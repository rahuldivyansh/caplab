import { ROLES } from "@/src/constants/roles";
import withAuthApi from "@/src/middlewares/withAuthApi";
import supabaseClient from "@/src/services/supabase";
import { StatusCodes } from "http-status-codes";

const handler = async (req, res) => {
  const ALLOWED_ROLES = [ROLES.ADMIN,ROLES.TEACHER];
  try {
    if (req.method !== "GET") {
      return res
        .status(StatusCodes.METHOD_NOT_ALLOWED)
        .json("method not allowed");
    }
    if (!ALLOWED_ROLES.includes(req.role)) {
      return res.status(StatusCodes.UNAUTHORIZED).send("unauthorized");
    }
    const { data: usersData, error: usersError } = await supabaseClient
      .from("users")
      .select("*");
    if (usersError) throw usersError;
    const { data: rolesData, error: rolesError } = await supabaseClient
      .from("roles")
      .select("*");
    if (rolesError) throw rolesError;
    const usersDataWithRoles = usersData.map((user) => {
      const role = rolesData.find((role) => role.uid === user.uid);
      return { ...user, role: role.role };
    });
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    return res.status(StatusCodes.OK).json(usersDataWithRoles);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error, message: "error getting users data." });
  }
};

export default withAuthApi(handler);
