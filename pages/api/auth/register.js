import { ROLES } from "@/src/constants/roles";
import withAuthApi from "@/src/middlewares/withAuthApi";
import supabaseClient from "@/src/services/supabase";
import { StatusCodes } from "http-status-codes";

const handler = async (req, res) => {
  try {
    if (req.method !== "POST") throw new Error("method not allowed");
    const { data: getRoleData, error: getRoleError } = await supabaseClient
      .from("roles")
      .select("role")
      .eq("uid", req.user)
      .single();
    console.log(getRoleData);
    if (getRoleData.role !== ROLES.ADMIN) throw new Error("Unauthorized");
    const { email, role, name } = req.body;
    console.log(req.body);
    if (!email || !role || !name) {
      throw new Error("Invalid input");
    }
    const addAuthUser = await supabaseClient.auth.signUp({
      email,
      password: "abc12345",
    });
    if (addAuthUser.error) throw addAuthUser.error;
    const addUser = await supabaseClient
      .from("users")
      .insert({ email, name: name, uid: addAuthUser.data.user.id });
    if (addUser.error) throw addUser.error;
    const addRole = await supabaseClient
      .from("roles")
      .insert({ uid: addAuthUser.data.user.id, role });
    if (addRole.error) throw addRole.error;
    return res.status(StatusCodes.CREATED).json(addRole.data);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return res.status(400).json({ error, message: error.message });
    }
    return res.status(400).json({ message: "Error adding user" });
  }
};

export default withAuthApi(handler);
