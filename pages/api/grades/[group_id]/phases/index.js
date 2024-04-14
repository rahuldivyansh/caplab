import withAuthApi from "@/src/middlewares/withAuthApi";
import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

const GET = async (group_id) => {
  try {
    const { data: phases, error } = await supabaseClient
      .from("grading_phases")
      .select("*")
      .eq("group", group_id);
    if (error) {
      throw new CustomError("unable to fetch phases", 400, error);
    }
    return phases;
  } catch (error) {
    throw error;
  }
};

const POST = async (group_id, payload) => {
  try {
    const { data: addPhaseData, error: addPhaseError } = await supabaseClient
      .from("grading_phases")
      .insert(payload)
      .eq("group", group_id)
      .select("*")
      .single();
    if (addPhaseError) {
      throw new CustomError("unable to add phase", 400, addPhaseError);
    }
    return addPhaseData;
  } catch (error) {
    throw error;
  }
};

const handler = async (req, res) => {
  const { method } = req;
  try {
    if (method === "GET") {
      const { group_id } = req.query;
      const phases = await GET(group_id);
      return res.status(200).json(phases);
    } else if (method === "POST") {
      const { group_id } = req.query;
      const payload = req.body;
      const phase = await POST(group_id, payload);
      return res.status(200).json(phase);
    }
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .send(ReasonPhrases.METHOD_NOT_ALLOWED);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

export default withAuthApi(handler);
