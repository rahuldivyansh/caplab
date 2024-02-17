const template = `
<p style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
    A new device has attempted to sign in to your account.
</p>
<div style="margin-top: 20px; padding: 10px; background-color: #fff; border: 1px solid #ccc; border-radius: 5px;">
    <p style="margin-bottom: 10px;">
        <strong style="font-weight: bold;">Device:</strong> {{device}}<br>
        <strong style="font-weight: bold;">Time:</strong> {{time}}
    </p>
    <span>Longitude : {{longitude}}</span></br>
    <span>Latitude : {{latitude}}</span>
</div>`;

export default template;
