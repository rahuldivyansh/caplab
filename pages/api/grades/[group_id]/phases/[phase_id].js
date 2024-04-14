import withAuthApi from "@/src/middlewares/withAuthApi";
import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import { StatusCodes } from "http-status-codes";

const DELETE = async (phase_id) => {
  try {
    const { data: removePhaseData, error: removePhaseError } =
      await supabaseClient
        .from("grading_phases")
        .delete()
        .eq("id", phase_id)
        .select("*")
        .single();
    if (removePhaseError) {
      throw new CustomError(
        "unable to remove phase",
        StatusCodes.BAD_REQUEST,
        removePhaseError
      );
    }
    return removePhaseData;
  } catch (error) {
    throw error;
  }
};
const PUT = async (phase_id, payload) => {
  try {
    const { name } = payload;
    if (!description) {
      throw new CustomError(
        "description is required",
        StatusCodes.BAD_REQUEST,
        {}
      );
    }
    const { data, error } = await supabaseClient
      .from("grading_phases")
      .update({ name })
      .eq("id", phase_id)
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
  const { phase_id } = query;
  try {
    if (method === "DELETE") {
      const data = await DELETE(phase_id);
      return res.status(StatusCodes.OK).json(data);
    }
    if (method === "PUT") {
      const data = await PUT(phase_id, req.body);
      return res.status(StatusCodes.CREATED).json(data);
    }
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error, message: error.message });
  }
};

export default withAuthApi(handler);
