import { LOGOTEXT } from "@/src/constants";
import EmailService from "@/src/services/email";
import memberAdditionEmailTemplate from "@/src/services/email/templates/member-addition";
import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import Handlebars from "handlebars";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const GET = async (group_id) => {
  try {
    const { data: membersData, error: membersError } = await supabaseClient
      .from("members")
      .select("id,users(name,email,uid,is_active)")
      .eq("group_id", group_id);
    if (membersError)
      throw new CustomError(
        "unable to fetch members",
        StatusCodes.BAD_REQUEST,
        membersError
      );
    if (membersData.length == 0) return [];
    const members = membersData.map((member) => {
      return { ...member.users, id: member.id };
    });
    return members;
  } catch (error) {
    throw error;
  }
};

const POST = async (group_id, payload) => {
  const { members } = payload;
  try {
    if (!members || !Array.isArray(members) || members.length == 0)
      throw new CustomError(
        "members must be an array",
        StatusCodes.BAD_REQUEST,
        {}
      );
    const membersToAdd = members.map((uid) => ({ uid, group_id }));
    const { data, error } = await supabaseClient
      .from("members")
      .insert(membersToAdd)
      .select("*");
    if (error)
      throw new CustomError(
        "unable to add member(s)",
        StatusCodes.BAD_REQUEST,
        error
      );
    const { data: usersViaUidData, error: usersViaUidError } =
      await supabaseClient
        .from("users")
        .select("name,email")
        .in(
          "uid",
          members.map((uid) => uid)
        );
    if (usersViaUidError) return data;
    const { data: groupData, error: groupError } = await supabaseClient
      .from("groups")
      .select("*")
      .eq("id", group_id)
      .single();
    if (groupError) return data;
    const template = Handlebars.compile(memberAdditionEmailTemplate);
    await EmailService.emails.send({
      from: "caplab@shortr.in",
      to: usersViaUidData.map((user) => user.email),
      subject: `Added to group ${groupData.num} - session - ${groupData.session}`,
      html: template({
        appName: LOGOTEXT,
        group_id,
        group_num: groupData.num,
        group_session: groupData.session,
      }),
    });
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
    } else if (method === "POST") {
      const data = await POST(group_id, req.body);
      return res.status(StatusCodes.CREATED).json(data);
    }
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .send(ReasonPhrases.METHOD_NOT_ALLOWED);
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

export default handler;
