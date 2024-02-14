// GET the status-es using group id

//

import supabaseClient from "@/src/services/supabase";
import { StatusCodes } from "http-status-codes";

const GET = async (group_id) => {
  try {
    const { data: groupData, error: groupError } = await supabaseClient
      .from("status")
      .select("*")
      .eq("group_id", group_id);

    if (groupError) throw groupError;

    return groupData;
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error, message: "Error while deleting data" });
  }
};

const handler = async (req, res) => {
  const { group_id } = req.query;

  if (req.method === "GET") {
    try {
      const data = await GET(group_id);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

export default handler;