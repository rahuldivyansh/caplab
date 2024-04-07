import withAuthApi from "@/src/middlewares/withAuthApi";
import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";

const GET = async (_group_id, id) => {
  try {
    const assignees = await supabaseClient
      .from("status_assignees")
      .select("id, users(name,email,uid,is_active)")
      .eq("status", id);
    if (assignees.error) {
      throw new CustomError("unable to fetch assignees", 400, assignees.error);
    }
    console.log(assignees.data)
    if (assignees.data.length == 0) return [];
    
    return assignees.data.map((assignee) => {
      return assignee.users;
    });
  } catch (error) {
    throw error;
  }
};

const POST = async (_group_id, id, payload) => {
  const { members } = payload;
  try {
    if (!members || !Array.isArray(members) || members.length == 0)
      throw new CustomError("members must be an array", 400, {});
    const membersToAdd = members.map((uid) => ({ member: uid, status: id }));
    const { data, error } = await supabaseClient
      .from("status_assignees")
      .insert(membersToAdd)
      .select("*");
    if (error) {
      throw new CustomError("unable to add assignee(s)", 400, error);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const DELETE = async (_group_id, id, payload) => {
  const { member } = payload;
  try {
    const { data, error } = await supabaseClient
      .from("status_assignees")
      .delete()
      .eq("member", member)
      .eq("status", id)
      .select("*");
    if (error) {
      throw new CustomError("unable to remove assignee(s)", 400, error);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const handler = async (req, res) => {
  try {
    if (req.method === "GET") {
      const { group_id, id } = req.query;
      const data = await GET(group_id, id);
      return res.status(200).json(data);
    }
    if (req.method === "POST") {
      const { group_id, id } = req.query;
      const data = await POST(group_id, id, req.body);
      return res.status(200).json(data);
    }
    if (req.method === "DELETE") {
      const { group_id, id } = req.query;
      const data = await DELETE(group_id, id, req.query);
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export default withAuthApi(handler);
