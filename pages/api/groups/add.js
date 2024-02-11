import { ROLES } from "@/src/constants/roles";
import withAuthApi from "@/src/middlewares/withAuthApi";
import supabaseClient from "@/src/services/supabase";
import { StatusCodes } from "http-status-codes";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json("method not allowed");
  }
  const ALLOWED_ROLES = [ROLES.TEACHER];
  const { role } = req;
  if (role === undefined || !ALLOWED_ROLES.includes(role)) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "unauthorized" });
  }
  try {
    const { data: uniqueData, error: uniqueError } = await supabaseClient
      .from("groups")
      .select("*")
      .eq("num", req.body.num)
      .eq("session", req.body.session);
    if (uniqueError) throw uniqueError;
    if (uniqueData.length > 0)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "group already exists" });
    const { data: groupsData, error: groupsError } = await supabaseClient
      .from("groups")
      .insert({ ...req.body, owner: req.user });
    if (groupsError) throw groupsError;
    return res.status(StatusCodes.OK).json(groupsData);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error, message: "error getting group." });
  }
};

export default withAuthApi(handler);
