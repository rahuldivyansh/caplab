import { DOMAIN } from "@/src/constants";
import headerEmailTemplatePartial from "./partials/header";

const memberGradingEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Member Graded</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            ${headerEmailTemplatePartial}
            <h3 style="color: #000; font-weight: bold; text-align: left; margin-top: 0;">Results are out for group-{{group_num}}-session-{{group_session}}</h3>
            <a href="https://${DOMAIN}/dashboard/groups/{{group_id}}" style="color: #007bff; text-decoration: none; display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; border-radius: 5px; margin-top: 20px; text-align: center;width:92%;">View {{phase_name}} grades</a>
        </div>
    </div>
</body>
</html>
`;
export default memberGradingEmailTemplate;
