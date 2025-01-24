import React from "react";

const IconWithText = ({ icon, text }) => {
  return (
    <div className="icon-with-text" style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
      <i className={`fa fa-${icon}`} style={{margin:" 0 6px"}}/>
      <span>{text}</span>
    </div>
  );
}

export default IconWithText;