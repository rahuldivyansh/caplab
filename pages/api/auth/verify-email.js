import { StatusCodes } from "http-status-codes";
import supabaseClient from "@/src/services/supabase";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json("method not allowed");
  }
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "email is required" });
    }
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("email")
      .eq("email", req.body.email)
      .single();
    if (userError) throw userError;
    if (!userData)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "user not found" });
    const { data: tokenData, error: tokenError } = await supabaseClient.auth.resetPasswordForEmail(email)
    if(tokenError) throw tokenError;
    return res.status(StatusCodes.OK).json({});
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error, message: error.message });
    }
    return res.status(StatusCodes.BAD_REQUEST).json("Unauthenticated");
  }
};

export default handler;
