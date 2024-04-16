import EmailService from "@/src/services/email";
import supabaseClient from "@/src/services/supabase";
import Handlebars from "handlebars";
import { CustomError } from "@/src/utils/errors";
import { StatusCodes } from "http-status-codes";
import memberRemovalEmailTemplate from "@/src/services/email/templates/member-removal";

const DELETE = async (group_id, id) => {
  try {
    console.log(id);
    const { data: memberRemovalData, error: memberRemovalError } =
      await supabaseClient
        .from("members")
        .delete()
        .eq("id", parseInt(id))
        .select("*,users(name,email)")
        .single();
    if (memberRemovalError)
      throw new CustomError(
        "unable to delete member",
        StatusCodes.BAD_REQUEST,
        memberRemovalError
      );
    const template = Handlebars.compile(memberRemovalEmailTemplate);
    const { data: groupData, error: groupError } = await supabaseClient
      .from("groups")
      .select("num,session")
      .eq("id", group_id)
      .single();
    if (groupError) return data;
    await EmailService.emails.send({
      from: "caplab@shortr.in",
      to: memberRemovalData.users.email,
      subject: `Removed from group ${groupData.num} - session - ${groupData.session}`,
      html: template({
        group_num: groupData.num,
        group_session: groupData.session,
      }),
    });
    return memberRemovalData;
  } catch (error) {
    throw error;
  }
};
const handler = async (req, res) => {
  const { method, query } = req;
  const { group_id, id } = query;
  if (!group_id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "group_id is required", error: {} });
  if (!id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "id is required", error: {} });
  try {
    if (method === "DELETE") {
      const data = await DELETE(group_id, id);
      return res.status(StatusCodes.OK).json(data);
    }
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error, message: "error updating member." });
  }
};

export default handler;
