import { BUCKET_NAME } from "@/src/constants/storage";
import withAuthApi from "@/src/middlewares/withAuthApi";
import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const GET = async (group_id) => {
  try {
    const PATH = `group_${group_id}`;
    const { data: docsData, error: docsError } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .list(PATH);
    if (docsError) throw new CustomError("Error fetching docs", 500, docsError);
    return docsData;
  } catch (error) {
    throw error;
  }
};

const POST = async (group_id) => {
  return {};
};

const PUT = async (group_id) => {
  return {};
};
const DELETE = async (group_id) => {
  return {};
};

const handler = async (req, res) => {
  const { group_id } = req.query;
  const { user, role } = req;
  try {
    if (req.method === "GET") {
      const docs = await GET(group_id);
      return res.status(200).json(docs);
    } else if (req.method === "PUT") {
      const data = await PUT(group_id);
      return res.status(200).json({ data });
    } else if (req.method === "DELETE") {
      const data = await DELETE(group_id);
      return res.status(200).json({ data });
    }
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .end(ReasonPhrases.METHOD_NOT_ALLOWED);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

export default withAuthApi(handler);
