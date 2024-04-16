import withAuthApi from "@/src/middlewares/withAuthApi";
import EmailService from "@/src/services/email";
import memberGradingEmailTemplate from "@/src/services/email/templates/member-grading";
import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import Handlebars from "handlebars";
import { StatusCodes } from "http-status-codes";

const GET = async (group_id) => {
  try {
    const { data: gradesData, error: gradesError } = await supabaseClient
      .from("grades")
      .select("*, users(*)")
      .eq("group_id", group_id);
    if (gradesError) {
      throw new CustomError(
        "unable to fetch grades",
        StatusCodes.BAD_REQUEST,
        gradesError
      );
    }
    if (gradesData.length == 0) return [];
    return gradesData;
  } catch (error) {
    throw error;
  }
};
const POST = async (group_id, payload) => {
  try {
    const { data: isAlreadyExist, error: isAlreadyExistError } =
      await supabaseClient
        .from("grades")
        .select("*")
        .eq("group_id", group_id)
        .eq("phase", payload.phase)
        .eq("uid", payload.uid)
        .single();
    if (isAlreadyExist) {
      throw new CustomError(
        "Grade already exist",
        StatusCodes.BAD_REQUEST,
        isAlreadyExist
      );
    }
    const { data, error } = await supabaseClient
      .from("grades")
      .insert(payload)
      .select("*")
      .single();
    if (error) {
      throw new CustomError(
        "unable to add grade",
        StatusCodes.BAD_REQUEST,
        error
      );
    }
    const { data: groupData, error: groupError } = await supabaseClient
      .from("groups")
      .select("*")
      .eq("id", group_id)
      .single();
    if (groupError) return data;
    const { data: phaseData, error: phaseError } = await supabaseClient
      .from("grading_phases")
      .select("*")
      .eq("id", payload.phase)
      .single();

    if (phaseError) return data;
    console.log(phaseData);
    const { data: memberData, error: memberError } = await supabaseClient
      .from("members")
      .select("users(email)")
      .eq("uid", payload.uid)
      .eq("group_id", group_id)
      .single();
    console.log(memberError);
    if (memberError) return data;
    console.log(memberData);
    const template = Handlebars.compile(memberGradingEmailTemplate);
    await EmailService.emails.send({
      from: "caplab@shortr.in",
      to: memberData.users.email,
      subject: `🎉Results are out`,
      html: template({
        group_id,
        group_num: groupData.num,
        group_session: groupData.session,
        phase_name: phaseData.name,
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
  try {
    if (method === "GET") {
      const data = await GET(group_id);
      return res.status(StatusCodes.OK).json(data);
    }
    if (method === "POST") {
      const data = await POST(group_id, req.body);
      return res.status(StatusCodes.CREATED).json(data);
    }
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error, message: error.message });
  }
};

export default withAuthApi(handler);
