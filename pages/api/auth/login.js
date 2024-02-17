import supabaseClient from "@/src/services/supabase";
import moment from "moment/moment";
import Cookies from "cookies";
import EmailService from "@/src/services/email";
import Handlebars from "handlebars";
import template from "@/src/services/email/templates/newDeviceSigninAttempt";
import { LOGOTEXT } from "@/src/constants";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json("method not allowed");
  const { email, password, device, geolocation } = req.body;
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    await supabaseClient.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
    const role = await supabaseClient
      .from("roles")
      .select("role")
      .eq("uid", data.user.id)
      .single();
    if (role.error) throw role.error;
    const userData = await supabaseClient
      .from("users")
      .select("name")
      .eq("uid", data.user.id)
      .single();
    if (userData.error) throw userData.error;
    const { data: userDevicesData, error: userDevicesError } =
      await supabaseClient
        .from("auth_devices")
        .select("*")
        .eq("uid", data.user.id)
        .eq("is_mobile", device.isMobile)
        .eq("user_agent", device.userAgent);
    if (userDevicesError) throw userDevicesError;
    if (userDevicesData.length === 0) {
      await supabaseClient.from("auth_devices").insert([
        {
          uid: data.user.id,
          is_mobile: device.isMobile,
          user_agent: device.userAgent,
        },
      ]);
      const signInAttemptTemplate = Handlebars.compile(template);
      await EmailService.emails.send({
        from: "caplab@shortr.in",
        to: email,
        subject: `New device login`,
        html: signInAttemptTemplate({
          appName: LOGOTEXT,
          email,
          time: moment().format("MMMM Do YYYY, h:mm a"),
          device: device.userAgent,
          latitude: geolocation?.latitude || "unavailable",
          longitude: geolocation?.longitude || "unavailable",
        }),
      });
    }
    const app_meta = {
      role: role.data.role,
      name: userData.data.name,
    };
    const cookies = new Cookies(req, res);
    const timestamp = new Date(moment.unix(data.session.expires_at).toString());
    cookies.set("access_token", data.session.access_token, {
      expires: timestamp,
    });
    cookies.set("refresh_token", data.session.refresh_token, {
      expires: timestamp,
    });

    return res.status(200).json({ ...data.user, app_meta });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
}
