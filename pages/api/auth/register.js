import { DOMAIN, LOGOTEXT } from "@/src/constants";
import { ROLES } from "@/src/constants/roles";
import withAuthApi from "@/src/middlewares/withAuthApi";
import EmailService from "@/src/services/email";
import template from "@/src/services/email/templates/signup";
import supabaseClient from "@/src/services/supabase";
import { StatusCodes } from "http-status-codes";
import Handlebars from "handlebars";
import { CustomError } from "@/src/utils/errors";

const handler = async (req, res) => {
  try {
    if (req.method !== "POST") throw new Error("method not allowed");

    if (req.role !== ROLES.ADMIN) throw new Error("unauthorized");

    const { email, role, name } = req.body;

    if (!email || !name || typeof role !== "number") {
      throw new CustomError("missing required fields", 400, {});
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

    if (addAuthUser.error)
      throw new CustomError(
        "error registering to auth table",
        500,
        addAuthUser.error
      );

    const addUser = await supabaseClient
      .from("users")
      .insert({ email, name: name, uid: addAuthUser.data.user.id });
    if (addUser.error)
      throw new CustomError("error adding user", 500, addUser.error);
    const addRole = await supabaseClient
      .from("roles")
      .insert({ uid: addAuthUser.data.user.id, role });

    if (addRole.error)
      throw new CustomError("error adding role", 500, addRole.error);

    const signupTemplate = Handlebars.compile(template);

    const emailResponse = await EmailService.emails.send({
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

    if (emailResponse.error)
      throw new CustomError("error sending email", 500, emailResponse.error);

    return res.status(StatusCodes.CREATED).json(addAuthUser.data);
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) {
      return res.status(error.status).json({ message: error.message,error });
    }
    return res.status(500).json({ message: "Error adding user", error });
  }
};

export default withAuthApi(handler);
