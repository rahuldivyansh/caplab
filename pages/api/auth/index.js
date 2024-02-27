import supabaseClient from "@/src/services/supabase";
import Cookies from "cookies";

const handler = async (req, res) => {
  try {
    const cookies = new Cookies(req, res);
    const refreshToken = cookies.get("refresh_token");
    const accessToken = cookies.get("access_token");
    if (accessToken && refreshToken) {
      await supabaseClient.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } else {
      throw new Error("User is not authenticated.");
    }
    const session = await supabaseClient.auth.getSession();
    if (session.error) throw new Error("Error getting session");
    const { user } = session.data.session;
    const role = await supabaseClient
      .from("roles")
      .select("role")
      .eq("uid", user.id)
      .single();
    if (role.error) throw role.error;
    const userData = await supabaseClient
      .from("users")
      .update({ is_active: true })
      .select("name")
      .eq("uid", user.id)
      .single();
    if (userData.error) throw userData.error;
    const app_meta = {
      role: role.data.role,
      name: userData.data.name,
    };
    return res.status(200).json({ ...session.data.session.user, app_meta });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return res.status(400).json(error.message);
    }
    return res.status(400).json("Unauthenticated");
  }
};

export default handler;
