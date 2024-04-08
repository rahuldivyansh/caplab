import withAuthApi from "@/src/middlewares/withAuthApi";
import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const GET = async (group_id) => {
  try {
    const { data: milestonesData, error: milestonesError } =
      await supabaseClient.from("milestones").select("*").eq("group", group_id);
    if (milestonesError) {
      throw new CustomError(
        "unable to fetch milestones",
        StatusCodes.BAD_REQUEST,
        milestonesError
      );
    }
    if (milestonesData.length == 0) return [];
    return milestonesData;
  } catch (error) {
    throw error;
  }
};
const POST = async (group_id, payload) => {
  try {
    const { description } = payload;
    if (!description) {
      throw new CustomError(
        "description is required",
        StatusCodes.BAD_REQUEST,
        {}
      );
    }
    const { data, error } = await supabaseClient
      .from("milestones")
      .insert({ description, group: parseInt(group_id) })
      .select("*")
      .single();
    if (error) {
      throw new CustomError(
        "unable to add milestone",
        StatusCodes.BAD_REQUEST,
        error
      );
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const handler = async (req, res) => {
  const { method, query } = req;
  const { group_id } = query;
  try {
    if (method === "GET") {
      const data = await GET(group_id);
      return res.status(StatusCodes.OK).json(data);
    }
    if (method === "POST") {
      const data = await POST(group_id, req.body);
      return res.status(StatusCodes.CREATED).json(data);
    }
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error, message: error.message });
  }
};

export default withAuthApi(handler);
