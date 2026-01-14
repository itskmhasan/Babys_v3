import { Select } from "@/components/ui/select";
import React from "react";

const SelectOption = ({ register, name, label }) => {
  return (
    <>
      <Select
        name={name}
        {...register(`${name}`, {
          required: `${label} is required!`,
        })}
      >
        <option value="" defaultValue hidden>
          Select type
        </option>
        <option value="Fish & Meat">Fish & Meat</option>
        <option value="Household Tools">Household Tools</option>
        <option value="Cloths">Cloths</option>
        <option value="Health Care">Health Care </option>
        <option value="Grocery">Grocery </option>
        <option value="Books">Books </option>
        <option value="Bags">Bags</option>
        <option value="Sports & Fitness">Sports & Fitness </option>
        <option value="Home Accessories">Home Accessories</option>
        <option value="Furniture">Furniture</option>
        <option value="Electronics">Electronics </option>
      </Select>
    </>
  );
};

export default SelectOption;
