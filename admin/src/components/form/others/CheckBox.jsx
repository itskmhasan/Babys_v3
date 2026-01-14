import React from "react";

const CheckBox = ({ id, name, type, handleSelect, isChecked }) => {
  return (
    <>
      <input
        id={id}
        name={name}
        type={type}
        onChange={handleSelect}
        checked={isChecked}
      />
    </>
  );
};

export default CheckBox;
