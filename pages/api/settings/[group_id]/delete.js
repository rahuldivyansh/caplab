import { BUCKET_NAME } from "@/src/constants/storage";
import supabaseClient from "@/src/services/supabase";
import { CustomError } from "@/src/utils/errors";
import { StatusCodes } from "http-status-codes";

const DELETE = async (group_id) => {
  const response = {
    group: null,
    members: null,
    messages: null,
    status: null,
    docs: false,
  };
  try {
    const { data: deleteMembers, error: deleteMembersError } =
      await supabaseClient
        .from("members")
        .delete()
        .eq("group_id", group_id)
        .select();
    if (deleteMembersError) {
      throw new CustomError(
        "error removing members",
        StatusCodes.INTERNAL_SERVER_ERROR,
        deleteMembersError
      );
    }
    const { data: deleteMessages, error: deleteMessagesError } =
      await supabaseClient
        .from("messages")
        .delete()
        .eq("group_id", group_id)
        .select();
    if (deleteMessagesError) {
      throw new CustomError(
        "error removing messages",
        StatusCodes.INTERNAL_SERVER_ERROR,
        deleteMessagesError
      );
    }
    const { data: deleteStatus, error: deleteStatusError } =
      await supabaseClient
        .from("status")
        .delete()
        .eq("group_id", group_id)
        .select();
    if (deleteStatusError) {
      throw new CustomError(
        "error removing status",
        StatusCodes.INTERNAL_SERVER_ERROR,
        deleteStatusError
      );
    }
    const { data: docs, error: docsError } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .list(`group_${group_id}/`);
    if (docsError) {
      throw new CustomError(
        "error fetching docs",
        StatusCodes.INTERNAL_SERVER_ERROR,
        docsError
      );
    }
    if (docs.length > 0) {
      const paths = docs.map((doc) => `group_${group_id}/${doc.name}`);
      paths.push(`group_${group_id}`);
      const { data: _deleteDocs, error: deleteDocsError } =
        await supabaseClient.storage.from(BUCKET_NAME).remove(paths);
      if (deleteDocsError) {
        throw new CustomError(
          "error removing docs",
          StatusCodes.INTERNAL_SERVER_ERROR,
          deleteDocsError
        );
      }
      response.docs = true;
    }
    const { data: group, error: groupError } = await supabaseClient
      .from("groups")
      .delete()
      .eq("id", group_id)
      .select()
      .single();
    if (groupError) {
      throw new CustomError(
        "error removing group",
        StatusCodes.INTERNAL_SERVER_ERROR,
        groupError
      );
    }
    response.status = deleteStatus;
    response.group = group;
    response.members = deleteMembers;
    response.messages = deleteMessages;
    return response;
  } catch (error) {
    throw error;
  }
};

const handler = async (req, res) => {
  const { method, query } = req;
  const { group_id } = query;

  if (!group_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "group id is required", error: {} });
  }

  try {
    if (method === "DELETE") {
      const data = await DELETE(group_id);
      return res.status(StatusCodes.OK).json(data);
    }
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: error?.message, error });
  }
};

export default handler;
