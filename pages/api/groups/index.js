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
  const ALLOWED_ROLES = [ROLES.TEACHER, ROLES.STUDENT];
    const { role } = req;
    if (role === undefined || !ALLOWED_ROLES.includes(role)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "unauthorized" });
    }
    try {
      if (role === ROLES.TEACHER) {
        const { data: groupsData, error: groupsError } = await supabaseClient
          .from("groups")
          .select("*")
          .eq("owner", req.user);
        if (groupsError) throw groupsError;
        return res.status(StatusCodes.OK).json(groupsData);
      }
      const { data: membersData, error: membersError } = await supabaseClient
        .from("members")
        .select("*")
        .eq("uid", req.user);
  
      if (membersError) throw membersError;
      if (membersData.length === 0) return res.status(StatusCodes.OK).json([]);
      const { data: groupsData, error: groupsError } = await supabaseClient
        .from("groups")
        .select("*")
        .in(
          "id",
          membersData.map((member) => member.group_id)
        );
      if (groupsError) throw groupsError;
      return res.status(StatusCodes.OK).json(groupsData);
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error, message: "error getting groups data." });
    }

};

export default withAuthApi(handler);
