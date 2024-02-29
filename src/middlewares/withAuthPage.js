import Cookies from "cookies";
import supabaseClient from "@/src/services/supabase";

const withAuthPage = (handler) => {
  return async (ctx) => {
    const { req, res } = ctx;
    const cookies = new Cookies(req, res);
    const accessToken = cookies.get("access_token");
    if (!accessToken)
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    const { data, error: userFetchError } = await supabaseClient.auth.getUser(
      accessToken
    );
    if (userFetchError)
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    const { data: roleData, error: roleError } = await supabaseClient
      .from("roles")
      .select("role")
      .eq("uid", data.user.id)
      .single();
    if (roleError)
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    req.user = data.user.id;
    req.role = roleData.role; 
    return handler(ctx);
  };
};

export default withAuthPage;
