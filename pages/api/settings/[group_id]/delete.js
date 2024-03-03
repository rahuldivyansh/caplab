const { default: supabaseClient } = require("@/src/services/supabase");
const { CustomError } = require("@/src/utils/errors");
const { StatusCodes } = require("http-status-codes");

const DELETE = async (group_id) => {
  try {
    // delete respestive group members
    const { data: members, error: fetchGroupMembers } = await supabaseClient
      .from("members")
      .select("*")
      .eq("group_id", group_id);

    if (members && members.length > 0) {
      const { error: memberError } = await supabaseClient
        .from("members")
        .delete()
        .eq("group_id", group_id);
      if (memberError) {
        console.log("member error: " + memberError);
        throw new CustomError(
          "Cannot delete the group",
          StatusCodes.BAD_REQUEST,
          memberError
        );
      }
    }
    if (fetchGroupMembers) {
      throw new CustomError(
        "Cannot delete the group",
        StatusCodes.BAD_REQUEST,
        fetchGroupMembers
      );
    }
    // delete the respestive group messages
    const { data: messages, error: fetchMessagesError } = await supabaseClient
      .from("messages")
      .select("*")
      .eq("group_id", group_id);
    if (messages && messages.length > 0) {
      const { error: messageError } = await supabaseClient
        .from("messages")
        .delete()
        .eq("group_id", group_id);
      if (messageError) {
        console.log("message error: " + messageError);
        throw new CustomError(
          "Cannot delete the group",
          StatusCodes.BAD_REQUEST,
          messageError
        );
      }
    }
    if (fetchMessagesError) {
      throw new CustomError(
        "Cannot delete the group",
        StatusCodes.BAD_REQUEST,
        fetchMessagesError
      );
    }
  } catch (error) {
    throw error;
  }
  // delete the respestive group documents
  // const { data: documents, error: fetchDocumentsError } = await supabaseClient
  //   .from("docs")
  //   .select("*")
  //   .eq("group_id", group_id);
  // if (documents && documents.length > 0) {
  //   const { error: documentError } = await supabaseClient
  //     .from("docs")
  //     .delete()
  //     .eq("group_id", group_id);
  //   if (documentError) {
  //     console.log("document error: " + documentError);
  //     throw new CustomError(
  //       "Cannot delete the group",
  //       StatusCodes.BAD_REQUEST,
  //       documentError
  //     );
  //   }
  // }
  // if (fetchDocumentsError) {
  //   throw new CustomError(
  //     "Cannot delete the group",
  //     StatusCodes.BAD_REQUEST,
  //     fetchDocumentsError
  //   );
  // }

  // delete the group
  const { data: groups, error: fetchGroupError } = await supabaseClient
    .from("groups")
    .select("*")
    .eq("id", group_id);
  if (groups) {
    const { data, error: groupError } = await supabaseClient
      .from("groups")
      .delete()
      .eq("id", group_id)
      .single();

    if (groupError) {
      console.log("group error: " + groupError);
      throw new CustomError(
        "Cannot delete the group",
        StatusCodes.BAD_REQUEST,
        groupError
      );
    }
    return data;
  }
  if (fetchGroupError) {
    throw new CustomError(
      "Cannot delete the group",
      StatusCodes.BAD_REQUEST,
      fetchGroupError
    );
  }
  // return data;
};

const handler = async (req, res) => {
  const { method, query } = req;
  const { group_id } = query;

  if (!group_id) {
    return res
      .stauts(StatusCodes.BAD_REQUEST)
      .send({ message: "group id is required", error: {} });
  }

  try {
    if (method === "DELETE") {
      const data = await DELETE(group_id);
      return res.status(StatusCodes.OK).json(data);
    }
  } catch (error) {
    throw error;
  }
};

export default handler;
