export const IFrame = ({ url }) => {
    return (
        <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${url}`} width="100%" height="100%" frameBorder="0">This is an embedded <a target="_blank" href="https://office.com">Microsoft Office</a> document, powered by <a target="_blank" href="https://office.com/webapps">Office</a>.</iframe>
    );
}