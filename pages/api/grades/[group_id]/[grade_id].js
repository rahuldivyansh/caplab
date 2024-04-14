import withAuthApi from "@/src/middlewares/withAuthApi";
import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import { StatusCodes } from "http-status-codes";

const DELETE = async (grade_id) => {
  try {
    const { data: removeGradeData, error: removeGradeError } =
      await supabaseClient
        .from("grades")
        .delete()
        .eq("id", grade_id)
        .select("*")
        .single();
    if (removeGradeError) {
      throw new CustomError(
        "unable to remove grade",
        StatusCodes.BAD_REQUEST,
        removeGradeError
      );
    }
    return removeGradeData;
  } catch (error) {
    throw error;
  }
};
const PUT = async (grade_id, payload) => {
  try {
    const { data, error } = await supabaseClient
      .from("grades")
      .update(payload)
      .eq("id", grade_id)
      .select("*")
      .single();
    if (error) {
      throw new CustomError(
        "unable to update grade",
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
  const { grade_id } = query;
  try {
    if (method === "DELETE") {
      const data = await DELETE(grade_id);
      return res.status(StatusCodes.OK).json(data);
    }
    if (method === "PUT") {
      const data = await PUT(grade_id, req.body);
      return res.status(StatusCodes.CREATED).json(data);
    }
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error, message: error.message });
  }
};

export default withAuthApi(handler);
