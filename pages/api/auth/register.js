import { DOMAIN, LOGOTEXT } from "@/src/constants";
import { ROLES } from "@/src/constants/roles";
import withAuthApi from "@/src/middlewares/withAuthApi";
import EmailService from "@/src/services/email";
import template from "@/src/services/email/templates/signup";
import supabaseClient from "@/src/services/supabase";
import { StatusCodes } from "http-status-codes";
import Handlebars from "handlebars";

const handler = async (req, res) => {
  try {
    if (req.method !== "POST") throw new Error("method not allowed");
    const { data: getRoleData, error: getRoleError } = await supabaseClient
      .from("roles")
      .select("role")
      .eq("uid", req.user)
      .single();
    if (getRoleError) throw getRoleError;
    if (getRoleData.role !== ROLES.ADMIN) throw new Error("Unauthorized");
    const { email, role, name } = req.body;
    if (!email || !role || !name) {
      throw new Error("Invalid input");
    }
    const credentials = {
      email,
      password: Math.random().toString(36).slice(-8),
    };
    const addAuthUser = await supabaseClient.auth.signUp({
      email,
      password: credentials.password,
      options: {
        data: {
          role,
          name,
        },
      },
    });
    if (addAuthUser.error) throw addAuthUser.error;
    const addUser = await supabaseClient
      .from("users")
      .insert({ email, name: name, uid: addAuthUser.data.user.id });
    if (addUser.error) throw addUser.error;
    const addRole = await supabaseClient
      .from("roles")
      .insert({ uid: addAuthUser.data.user.id, role });

    if (addRole.error) throw addRole.error;

    const signupTemplate = Handlebars.compile(template);

    await EmailService.emails.send({
      from: "caplab@shortr.in",
      to: email,
      subject: `Login Credentials for ${LOGOTEXT}`,
      html: signupTemplate({
        appName: LOGOTEXT,
        email,
        password: credentials.password,
        url: `https://${DOMAIN}/login`,
      }),
    });

    return res.status(StatusCodes.CREATED).json(addAuthUser.data);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return res.status(400).json({ error, message: error.message });
    }
    return res.status(400).json({ message: "Error adding user" });
  }
};

export default withAuthApi(handler);
