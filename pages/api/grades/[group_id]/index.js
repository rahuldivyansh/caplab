import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const GET = async (group_id) => {
  try {
    const { data: gradesData, error: gradesError } = await supabaseClient
      .from("grades")
      .select("id,mid_term,end_term,users(name)")
      .eq("group_id", group_id);
    if (gradesError)
      throw new CustomError(
        "unable to fetch grades",
        StatusCodes.BAD_REQUEST,
        gradesError
      );
    if (gradesData.length == 0) return [];
    const grades = gradesData.map((grade) => {
      return {
        ...grade.users,
        id: grade.id,
        mid_term: grade.mid_term,
        end_term: grade.end_term,
      };
    });
    return grades;
  } catch (error) {
    throw error;
  }
};

const PUT = async (group_id, payload) => {
  const { data } = payload;
  try {
    if (!data || !Array.isArray(data) || data.length == 0)
      throw new CustomError(
        "members must be an array",
        StatusCodes.BAD_REQUEST,
        {}
      );
    data.map(async (grade) => {
      const { error } = await supabaseClient
        .from("grades")
        .update({ mid_term: grade.mid_term, end_term: grade.end_term })
        .eq("id", grade.id);
      if (error)
        throw new CustomError(
          "unable to add grade(s)",
          StatusCodes.BAD_REQUEST,
          error
        );
    });

    return true;
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
    } else if (method === "PUT") {
      const data = await PUT(group_id, req.body);
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
