const { default: supabaseClient } = require("@/src/services/supabase");
const { CustomError } = require("@/src/utils/errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const PUT = async (group_id, payload) => {
  try {
    const { data, error } = await supabaseClient
      .from("groups")
      .update(payload)
      .eq("id", parseInt(group_id))
      .select("*")
      .single();
    if (error) throw new CustomError("unable to edit group", 500, error);

    return data;
  } catch (error) {
    throw error;
  }
};

const handler = async (req, res) => {
  const { id } = req.query;
  try {
    if (req.method === "PUT") {
      const data = await PUT(id, req.body);
      return res.status(StatusCodes.OK).json(data);
    }
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .end(ReasonPhrases.METHOD_NOT_ALLOWED);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

export default handler;
