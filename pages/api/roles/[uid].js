import { ROLES } from "@/src/constants/roles";
import withAuthApi from "@/src/middlewares/withAuthApi";
import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import { StatusCodes } from "http-status-codes";

const PUT = async (uid, payload) => {
  try {
    const { data: userData, error: userError } = await supabaseClient
      .from("roles")
      .update(payload)
      .eq("uid", uid)
      .select("*")
      .single();
    if (userError) new CustomError("error updating role data.", 500, userError);
    return userData;
  } catch (error) {
    throw error;
  }
};

const handler = async (req, res) => {
  if (req.role !== ROLES.ADMIN) {
    return res.status(StatusCodes.UNAUTHORIZED).send("unauthorized");
  }
  try {
    if (req.method === "PUT") {
      const { uid } = req.query;
      const { body } = req;
      const response = await PUT(uid, body);
      console.log(response);
      return res.status(StatusCodes.OK).json(response);
    }

    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json("method not allowed");
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error, message: "error processing request." });
  }
};

export default withAuthApi(handler);
