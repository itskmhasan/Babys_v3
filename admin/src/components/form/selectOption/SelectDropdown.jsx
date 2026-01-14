import { cn } from "@/lib/utils";
import { FormControl } from "@/components/ui/form";
// Assuming this is part of your shadcn/ui FormField setup
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "lucide-react";

// Assuming shadcn/ui Select

export function SelectDropdown({
  value, // <--- Change from defaultValue to value
  onValueChange,
  isPending,
  items,
  placeholder,
  disabled,
  className = "",
  // Remove isControlled prop - it's not needed for RHF controlled fields
}) {
  // console.log('SelectDropdown received value:', placeholder, value) // Add this for debugging

  return (
    // Pass 'value' directly. Shadcn's Select is designed to be controlled.
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <FormControl>
        <SelectTrigger className={cn(className)}>
          <SelectValue placeholder={placeholder ?? "Select"} />
        </SelectTrigger>
      </FormControl>
      <SelectContent
        position="popper"
        container={document.querySelector(".drawer-container")} // 👈 must be inside Drawer
        className="z-[9999]" // 👈 make sure it's above the drawer backdrop
      >
        {isPending ? (
          <SelectItem disabled value="loading" className="h-14">
            <div className="flex items-center justify-center gap-2">
              <Loader className="h-5 w-5 animate-spin" />
              Loading...
            </div>
          </SelectItem>
        ) : (
          items?.map(
            (
              item // Use 'item' directly to avoid potential destructuring issues with empty objects
            ) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            )
          )
        )}
      </SelectContent>
    </Select>
  );
}
