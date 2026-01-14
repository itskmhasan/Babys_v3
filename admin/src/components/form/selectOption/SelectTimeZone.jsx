import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import React from "react";

// internal import
import { timeZones } from "@/utils/timezones";

const SelectTimeZone = ({ control, name, label, required }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: required ? `${label} is required!` : false,
      }}
      render={({ field }) => (
        <Select
          value={field.value || ""}
          onValueChange={(value) => field.onChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Default Time Zone" />
          </SelectTrigger>
          <SelectContent>
            {timeZones.map((timeZone, i) => (
              <SelectItem key={i + 1} value={timeZone.tzCode}>
                {timeZone.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
};

export default SelectTimeZone;
