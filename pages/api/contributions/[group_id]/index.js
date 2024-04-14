import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const GET = async (group_id) => {
  try {
    const { data: membersData, error: membersError } = await supabaseClient
      .from("members")
      .select("id,uid,users(name)")
      .eq("group_id", group_id);
    // console.log(membersData)
    if (membersError)
      throw new CustomError(
        "unable to fetch members",
        StatusCodes.BAD_REQUEST,
        membersError
      );
    const { data: statusData, error: statusError } = await supabaseClient
      .from("status")
      .select("id,type")
      .eq("group_id", group_id);
    //   console.log(statusData)
    if (statusError) {
      throw new CustomError(
        "unable to fetch status",
        StatusCodes.BAD_REQUEST,
        statusError
      );
    }
    let allStatusAssignees = [];
    await Promise.all(statusData.map(async (status) => {
      const { data: statusAssigneeData, error: statusAssigneError } =
        await supabaseClient
          .from("status_assignees")
          .select("status,member")
          .eq("status", status.id);
      if (statusAssigneError) {
        throw new CustomError(
          "unable to fetch the assignees",
          StatusCodes.BAD_REQUEST,
          statusAssigneError
        );
      }
      allStatusAssignees.push(statusAssigneeData[0]);
    //   console.log(allStatusAssignees)
    }))
    // console.log(allStatusAssignees)
    const data = {membersData,statusData,allStatusAssignees}    
    return data;
  } catch (error) {
    throw error;
  }
};

const handler = async (req, res) => {
  const { method, query } = req;
  const { group_id } = query;
  if (!group_id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "group_id is required", error: {} });
  try {
    if (method === "GET") {
      const data = await GET(group_id);
      return res.status(StatusCodes.OK).json(data);
    }
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .send(ReasonPhrases.METHOD_NOT_ALLOWED);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

export default handler;
