import React from "react";
import Label from "@components/form/Label";
import { Input } from "@components/ui/input";

const InputArea = ({
  name,
  label,
  type,
  Icon,
  register,
  defaultValue,
  autocomplete,
  placeholder,
}) => {
  return (
    <>
      <Label label={label} />
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 focus-within:text-gray-900 sm:text-base">
              <Icon />{" "}
            </span>
          </div>
        )}
        <Input
          {...register(`${name}`, {
            required: `${label} is required!`,
          })}
          type={type}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete={autocomplete}
          className={
            Icon
              ? "py-2 pl-10 w-full placeholder-gray-300"
              : "py-2 px-4 md:px-5"
          }
        />
      </div>
    </>
  );
};

export default InputArea;
