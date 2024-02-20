import React from "react";

const Caption = (props) => {
  return <span {...props} className={`caption ${props.className}`} />;
};

export default Caption;

Caption.defaultProps = {
  className: "",
}
