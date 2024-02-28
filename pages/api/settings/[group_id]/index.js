const { ROLES } = require("@/src/constants/roles");
const { CustomError } = require("@/src/utils/errors");
const { StatusCodes } = require("http-status-codes");
import supabaseClient from "@/src/services/supabase";


const GET = async () => {
  try {
    let { data: teachersData, error: teachersError } = await supabaseClient
      .from("users")
      .select("*");
    if (teachersError) {
      throw new CustomError(
        "unable to fetch teachers",
        StatusCodes.BAD_REQUEST,
        teachersError
      );
    }
    if (teachersData.length === 0) return [];
    // getting the data from the roles table to display all the teachers
    let { data: roles, error: rolesError } = await supabaseClient
      .from("roles")
      .select("uid,role");
    if (rolesError) {
      throw new CustomError(
        "unable to fetch roles",
        StatusCodes.BAD_REQUEST,
        rolesError
      );
    }
    // selecting the users with teacher role and adding them to the teachers.
    let teachers = [];
    for (let i = 0; i < teachersData.length; i++) {
      for (let j = 0; j < roles.length; j++) {
        if (roles[j].uid == teachersData[i].uid && roles[j].role === 2) {
          let teacher = {
            name: teachersData[i].name,
            uid: teachersData[i].uid,
            email: teachersData[i].email,
          };
          teachers.push(teacher);
          break;
        }
      }
    }
    return teachers;
  } catch (error) {}
};

const PATCH = async (group_id, payload) => {
  const { teacher } = payload;
  try {
    if (!teacher)
      throw new Error("please select a valid teacher", StatusCodes.BAD_REQUEST);
    const { data: groupData, error: groupError } = await supabase
      .from("groups")
      .update({ owner: teacher })
      .eq("num", group_id)
      .select();
    if (groupError) {
      throw new Error(
        "cannot update group owner",
        StatusCodes.BAD_REQUEST,
        groupError
      );
    }
  } catch (error) {
    throw error;
  }
};

const handler = async (req, res) => {
  const { method, query, role } = req;
  const { group_id } = query;
  if (!group_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "group_id is required", error: {} });
  }
  try {
    if (method === "GET") {
      const data = await GET();
      return res.status(StatusCodes.OK).json(data);
    }

    const ALLOWED_ROLES = [ROLES.TEACHER, ROLES.ADMIN];
    if (role === undefined || !ALLOWED_ROLES.includes(role)) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "unauthorized" });
    }
    if(method == "PATCH"){
        const data = await PATCH(group_id,req.body);
        return res.status(StatusCodes.CREATED).json(data);
    }
  } catch (error) {}
};


export default handler;