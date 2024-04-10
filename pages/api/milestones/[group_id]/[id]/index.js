import withAuthApi from "@/src/middlewares/withAuthApi";
import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import { StatusCodes } from "http-status-codes";

const DELETE = async (milestone_id) => {
  try {
    const { data: removeMilestoneData, error: removeMilestoneError } =
      await supabaseClient
        .from("milestones")
        .delete()
        .eq("id", milestone_id)
        .select("*")
        .single();
    if (removeMilestoneError) {
      throw new CustomError(
        "unable to remove milestone",
        StatusCodes.BAD_REQUEST,
        removeMilestoneError
      );
    }
    return removeMilestoneData;
  } catch (error) {
    throw error;
  }
};
const PUT = async (milestone_id, payload) => {
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
      .update({ description })
      .eq("id", milestone_id)
      .select("*")
      .single();
    if (error) {
      throw new CustomError(
        "unable to update milestone",
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
  const { id } = query;
  try {
    if (method === "DELETE") {
      const data = await DELETE(id);
      return res.status(StatusCodes.OK).json(data);
    }
    if (method === "PUT") {
      const data = await PUT(id, req.body);
      return res.status(StatusCodes.CREATED).json(data);
    }
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error, message: error.message });
  }
};

export default withAuthApi(handler);
