import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import { StatusCodes } from "http-status-codes";

const DELETE = async (group_id, id) => {
  try {
    console.log(id);
    const { data, error } = await supabaseClient
      .from("members")
      .delete()
      .eq("id", parseInt(id))
      .select("*")
      .single();
    if (error)
      throw new CustomError(
        "unable to delete member",
        StatusCodes.BAD_REQUEST,
        error
      );
    return data;
  } catch (error) {
    throw error;
  }
};
const handler = async (req, res) => {
  const { method, query } = req;
  const { group_id, id } = query;
  if (!group_id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "group_id is required", error: {} });
  if (!id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "id is required", error: {} });
  try {
    if (method === "DELETE") {
      const data = await DELETE(group_id, id);
      return res.status(StatusCodes.OK).json(data);
    }
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error, message: "error updating member." });
  }
};

export default handler;