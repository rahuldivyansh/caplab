import withAuthApi from "@/src/middlewares/withAuthApi";
import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import { StatusCodes } from "http-status-codes";


const handler = async (req, res) => {
  try {
    const { user } = req;
    const { flag } = req.query;
    if (!flag) throw new CustomError("flag keyword is required", 400, {});
    const { data, error } = await supabaseClient
      .from("users")
      .update({ is_active: flag === "true" ? true : false })
      .eq("uid", user)
      .single();
    if (error)
      throw new CustomError("error updating user active status", 500, error);
    const response = {
      message: `user is ${flag === "true" ? "active" : "inactive"}`,
      data,
    };
    res.status(StatusCodes.OK).json(response);
  } catch (errorResponse) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: errorResponse.message, error: errorResponse.response });
  }
};

export default withAuthApi(handler);
