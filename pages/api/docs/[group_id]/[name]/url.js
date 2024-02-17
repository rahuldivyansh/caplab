import { BUCKET_NAME } from "@/src/constants/storage";
import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";

const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .end(ReasonPhrases.METHOD_NOT_ALLOWED);
  }
  const { name, group_id } = req.query;
  try {
    const PATH = `group_${group_id}/${name}`;
    const { data: docData, error: docError } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .getPublicUrl(PATH, {
        download: true,
      });
    if (docError) throw new CustomError("Error fetching doc", 500, docError);
    return res.status(200).json(docData);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
  return res.status(200).json({ message: "Hello World" });
};

export default handler;
