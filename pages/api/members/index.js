import { CustomError } from "@/src/utils/errors";


const GET = async (group_id) => {
  try {
    const Path = `group_${group_id}`;

    let { data: members, error:memberError } = await supabase
    .from("members")
    .select("*")
    .eq("group_id", group_id);
    if(memberError) throw new CustomError("Error fetching members: ",500, memberError)
    return memberError;
  } catch (error) {
    throw error;
  }
};
