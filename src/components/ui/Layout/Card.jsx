import React from "react";

const Card = (props) => {
  return <div {...props} className={`border dark:border-none border-secondary p-2 shadow-sm  bg-surface rounded-lg ${props.className}`} />;
};

Card.defaultProps = {
  className: "",
};

export default Card;
