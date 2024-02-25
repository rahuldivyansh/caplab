// GET the status-es using group id
// POST new status to group

import supabaseClient from "@/src/services/supabase";
import { StatusPayloadValidator } from "@/src/utils/request_payload/validators";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const GET = async (group_id) => {
  try {
    const { data: groupData, error: groupError } = await supabaseClient
      .from("status")
      .select("*")
      .eq("group_id", group_id);

    if (groupError) throw groupError;

    return groupData;
  } catch (error) {
    throw error;
  }
};

const POST = async (group_id, payload) => {
  const validatedData = StatusPayloadValidator.safeParse({
    title: payload.title,
    desc: payload.desc,
    group_id: payload.group_id,
    type: payload.type,
  });

  if (!validatedData.success) {
    throw new Error("Data is not valid.");
  }
  try {
    const { data: groupData, error: groupError } = await supabaseClient
      .from("status")
      .insert(payload)
      .select()
      .single();

    if (groupError) throw groupError;

    return groupData;
  } catch (error) {
    throw error;
  }
};

const handler = async (req, res) => {
  const { group_id } = req.query;

  if (req.method === "GET") {
    try {
      const data = await GET(group_id);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error, { error: error.message });
    }
  }

  if (req.method === "POST") {
    try {
      const { body } = req;
      const data = await POST(group_id, body);
      return res.status(StatusCodes.CREATED).json(data);
    } catch (error) {
      return res.status(500).json(error, { error: error.message });
    }
  }
  return res.status(StatusCodes.METHOD_NOT_ALLOWED).send("Method not allowed");
};

export default handler;
