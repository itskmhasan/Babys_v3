import React from "react";
import Label from "@components/form/Label";
import { Input } from "@components/ui/input";

const InputAreaTwo = ({
  name,
  label,
  type,
  Icon,
  defaultValue,
  autocomplete,
  placeholder,
  readOnly,
}) => {
  return (
    <>
      <Label label={label} />
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-800 focus-within:text-gray-900 sm:text-base">
              <Icon />
            </span>
          </div>
        )}
        <Input
          type={type}
          name={name}
          readOnly={readOnly}
          // disabled={readOnly} // Add disabled attribute if readOnly is true
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete={autocomplete}
          className={`${
            Icon ? "py-2 pl-10" : "py-2 px-4 md:px-5"
          } w-full placeholder:text-sm text-gray-700 ${
            readOnly ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
          }`}
        />
      </div>
    </>
  );
};

export default InputAreaTwo;
