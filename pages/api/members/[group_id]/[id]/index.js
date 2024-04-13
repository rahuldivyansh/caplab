import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import { StatusCodes } from "http-status-codes";

const DELETE = async (group_id, id) => {
  try {
    const { data: userID, error: fetchError } = await supabaseClient
      .from("members")
      .select("uid")
      .eq("id", id);
    if (fetchError) {
      console.log("fetch error");
      throw new Error("cannot delete member", StatusCodes.BAD_REQUEST);
    }
    const { data: role, error: roleError } = await supabaseClient
      .from("roles")
      .select("role")
      .eq("uid", userID[0].uid);
    if (role[0].role === 1) {
      const { data: gradeData, error: gradeError } = await supabaseClient
        .from("grades")
        .delete()
        .eq("uid", userID[0].uid)
        .select();
      if (gradeError) {
        console.log("grade error");
        throw new Error("cannot delete member", StatusCodes.BAD_REQUEST);
      }
      if(roleError){
        throw new Error("cannot delete the member",StatusCodes.BAD_REQUEST);
      }
    }

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
