import React from "react";

const Card = (props) => {
  return <div {...props} className={`border border-secondary p-2 shadow-sm  bg-white rounded-lg ${props.className}`} />;
};

Card.defaultProps = {
  className: "",
};

export default Card;
