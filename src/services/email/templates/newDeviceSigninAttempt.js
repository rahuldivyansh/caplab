const template = `

<div style="text-align: center; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; width: 80%; max-width: 400px;font-family:'Arial', sans-serif">

<h1 style="color: #333; margin-bottom: 10px;">Alert</h1>

<p style="background-color: #f2f2f2; padding: 20px; border-radius: 5px; margin: 0;">
    A new device has attempted to sign in to your account.
</p>

<div style="margin-top: 20px; padding: 10px; background-color: #fff; border: 1px solid #ccc; border-radius: 5px;">

    <p style="margin-bottom: 10px;">
        <strong style="font-weight: bold;">Device:</strong> {{device}}<br>
        <strong style="font-weight: bold;">Time:</strong> {{time}}
    </p>

    <span>Longitude: {{longitude}}</span><br>
    <span>Latitude: {{latitude}}</span>

    <a href="https://www.google.com/maps?q={{latitude}},{{longitude}}" style="display: block; margin-top: 10px; color: #3498db; text-decoration: none;" target="_blank">View in map</a>

</div>

</div>`;

export default template;
