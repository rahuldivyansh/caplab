import { ROLES } from "@/src/constants/roles";
import withAuthApi from "@/src/middlewares/withAuthApi";
import supabaseClient from "@/src/services/supabase";
import { StatusCodes } from "http-status-codes";

const GET = async (req, res) => {
  try {
    const { uid } = req.query;
    const { data: usersData, error: usersError } = await supabaseClient
      .from("users")
      .select("*")
      .eq("uid", uid)
      .single();
    if (usersError) throw usersError;
    const { data: rolesData, error: rolesError } = await supabaseClient
      .from("roles")
      .select("*")
      .eq("uid", uid)
      .single();
    if (rolesError) throw rolesError;
    const usersDataWithRoles = {
      ...usersData,
      role: rolesData.role,
    };
    return res.status(StatusCodes.OK).json(usersDataWithRoles);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error, message: "error getting user data." });
  }
};

const DELETE = async (req, res) => {
  try {
    const { uid } = req.query;
    const { data: usersData, error: usersError } = await supabaseClient
      .from("users")
      .delete()
      .eq("uid", uid);
    if (usersError) throw usersError;
    const { data: userAuthData, error: userAuthError } =
      await supabaseClient.auth.admin.deleteUser(uid);
    if (userAuthError) throw userAuthError;
    const { data: rolesData, error: rolesError } = await supabaseClient
      .from("roles")
      .delete()
      .eq("uid", uid);
    if (rolesError) throw rolesError;
    const { data: userData, error: userError } = await supabaseClient
      .from("user")
      .delete()
      .eq("uid", uid);
    if (userError) throw userError;
    return res.status(StatusCodes.OK).json(userAuthData.user);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error, message: "error deleting user data." });
  }
};

const handler = async (req, res) => {
  if (req.role !== ROLES.ADMIN) {
    return res.status(StatusCodes.UNAUTHORIZED).send("unauthorized");
  }
  if (req.method === "GET") {
    return GET(req, res);
  }
  if (req.method === "DELETE") {
    return DELETE(req, res);
  }
  return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("method not allowed");
};

export default withAuthApi(handler);
