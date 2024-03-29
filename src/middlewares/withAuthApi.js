import Cookies from "cookies";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import supabaseClient from "../services/supabase";

export default function withAuthApi(handler) {
  return async function (req, res) {
    const cookies = new Cookies(req, res);
    const accessToken = cookies.get("access_token");
    const refreshToken = cookies.get("refresh_token");
    if (!(accessToken && refreshToken)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(ReasonPhrases.UNAUTHORIZED);
    }
    try {
      const { data: userData, error: userError } =
        await supabaseClient.auth.getUser(accessToken);
      if (userError) {
        throw userError;
      }
      const role = await supabaseClient
        .from("roles")
        .select("role")
        .eq("uid", userData.user.id)
        .single();
      req.user = userData.user.id;
      req.role = await role.data.role;
      return handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.UNAUTHORIZED).json(error);
    }
  };
}
