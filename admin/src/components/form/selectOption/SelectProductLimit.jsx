import React from "react";
// import { CODES } from 'currencies-map';

const SelectProductLimit = ({ register, name, label, required }) => {
  return (
    <>
      <select
        name={name}
        {...register(`${name}`, {
          required: required ? `${label} is required!` : false,
        })}
        className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
      >
        <option value="" hidden>
          Select Products Limit
        </option>
        {/* {CODES.map((currency) => (
          <option key={currency} value={currency}>
            {currency}{' '}
          </option>
        ))} */}

        <option value="6">6</option>
        <option value="12">12</option>
        <option value="18">18</option>
      </select>
    </>
  );
};
export default SelectProductLimit;
