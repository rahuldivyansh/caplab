import supabaseClient from "@/src/services/supabase";
import { StatusCodes } from "http-status-codes";

// GET details about a specific status using status id.
// DELETE status using status id.
// PUT to update status type (backlog, in progress, in review, completed).

const GET = async (status_id) => {
  try {
    const { data: statusData, error: statusError } = await supabaseClient
      .from("status")
      .select("*")
      .eq("id", status_id);

    if (statusError) throw statusError;
    return statusData;
  } catch (error) {
    throw error;
  }
};

const DELETE = async (group_id, status_id) => {
  try {
    const { error: deleteError } = await supabaseClient
      .from("status")
      .delete()
      .eq("id", status_id)
      .eq("group_id", group_id);

    if (deleteError) throw deleteError;
    // return res.status(StatusCodes.OK).json({ message: "Deletion successfull" });
    return { success: true };
  } catch (error) {
    throw error;
  }
};

const PUT = async (status_id, payload) => {
  try {
    const { data: updateData, error: updateError } = await supabaseClient
      .from("status")
      .update(payload)
      .eq("id", status_id)
      .select().single();

    if (updateError) throw updateError;
    return updateData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const handler = async (req, res) => {
  const { group_id, id: status_id } = req.query;

  if (req.method === "GET") {
    try {
      const data = await GET(status_id);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const data = await DELETE(group_id, status_id);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "PUT") {
    const { body } = req;
    try {
      const data = await PUT(status_id, body);
      return res.status(StatusCodes.OK).json(data);
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error, message: "Updation failed." });
    }
  }
};

export default handler;
