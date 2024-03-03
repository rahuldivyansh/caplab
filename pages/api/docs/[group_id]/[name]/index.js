import { BUCKET_NAME } from "@/src/constants/storage";
import withAuthApi from "@/src/middlewares/withAuthApi";
import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const GET = async (group_id, name) => {
  try {
    const PATH = `group_${group_id}/${name}`;
    const { data: docData, error: docError } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .getPublicUrl(PATH);
    if (docError) throw new CustomError("Error fetching doc", 500, docError);
    return docData;
  } catch (err) {
    throw err;
  }
};

const POST = async (group_id) => {
  return {};
};

const PUT = async (group_id) => {
  return {};
};
const DELETE = async (group_id, name) => {
  try {
    const PATH = `group_${group_id}/${name}`;
    const { data: docData, error: docError } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .remove([PATH]);
    if (docError) throw new CustomError("Error deleting doc", 500, docError);
    return { message: "Doc deleted successfully" };
  } catch (error) {
    throw error;
  }
};

const handler = async (req, res) => {
  const { group_id, name } = req.query;
  try {
    if (req.method === "GET") {
      const docs = await GET(group_id);
      return res.status(200).json(docs);
    } else if (req.method === "PUT") {
      const data = await PUT(group_id);
      return res.status(200).json({ data });
    } else if (req.method === "DELETE") {
      const data = await DELETE(group_id, name);
      return res.status(StatusCodes.OK).json(data);
    }
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .end(ReasonPhrases.METHOD_NOT_ALLOWED);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

export default withAuthApi(handler);
