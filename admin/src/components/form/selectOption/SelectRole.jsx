import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

const SelectRole = ({ control, name, label }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: `${label} is required!` }}
      render={({ field, fieldState }) => (
        <div className="space-y-1">
          <Select
            value={field.value || ""}
            onValueChange={field.onChange}
            defaultValue=""
          >
            <SelectTrigger>
              <SelectValue placeholder="Staff role" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              container={document.querySelector(".drawer-container")} // 👈 must be inside Drawer
              className="z-[9999]" // 👈 make sure it's above the drawer backdrop
            >
              <SelectItem value="super admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="cashier">Cashier</SelectItem>
              <SelectItem value="ceo">CEO</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="accountant">Accountant</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
              <SelectItem value="security guard">Security Guard</SelectItem>
              <SelectItem value="deliver person">Delivery Person</SelectItem>
            </SelectContent>
          </Select>

          {/* Optional error display */}
          {fieldState.error && (
            <p className="text-sm text-red-500">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default SelectRole;
