import headerEmailTemplatePartial from "./partials/header";

const memberRemovalEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Member Removed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            ${headerEmailTemplatePartial}
            <h2 style="color: #000; font-weight: bold; text-align: left; margin-top: 0;">Removed from group</h2>
            <p style="color: #555555;">You have been removed from the group-{{group_num}}-session-{{group_session}}</p>
            <p style="color: #555555;">You can no longer access the group dashboard.</p>
        </div>
    </div>
</body>
</html>
`;
export default memberRemovalEmailTemplate;
