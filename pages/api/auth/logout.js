// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import Cookies from "cookies";
import { StatusCodes } from "http-status-codes";

const handler = async (req, res) => {
  const cookies = new Cookies(req, res);
  try {
    const { data: userResponse, error: userError } =
      await supabaseClient.auth.getUser(cookies.get("access_token"));
    if (userError) throw new CustomError("error getting user", 500, userError);
    const { user } = userResponse;
    if (!user) throw new CustomError("user not found", 404, {});
    const { id } = user;
    const { data: userActiveStatus, error: userActiveStatusError } =
      await supabaseClient
        .from("users")
        .update({ is_active: false })
        .eq("uid", id);
    if (userActiveStatusError)
      throw new CustomError("error updating user active status", 500, userActiveStatusError);
    cookies.set("access_token", null, { maxAge: Date.now() });
    cookies.set("refresh_token", null, { maxAge: Date.now() });
    await supabaseClient.auth.signOut();
    res.redirect("/api/auth");
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("unable to sign out user");
  }
};

export default handler;
