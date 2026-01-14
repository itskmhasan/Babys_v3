import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

const SelectReceiptSize = ({
  control,
  name,
  label,
  pos,
  required,
  setPosCustomer,
}) => {
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
          onValueChange={(value) => {
            field.onChange(value);
            if (setPosCustomer) setPosCustomer(value);
          }}
          className={`${pos ? "h-10" : "h-12"}`}
        >
          <SelectTrigger>
            <SelectValue placeholder="57 mm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="57-mm">57 mm</SelectItem>
            <SelectItem value="80-mm">80 mm</SelectItem>
            <SelectItem value="3-1/8">3 1/8"</SelectItem>
            <SelectItem value="2-1/4">2 1/4"</SelectItem>
            <SelectItem value="A4">A4</SelectItem>
          </SelectContent>
        </Select>
      )}
    />
  );
};

export default SelectReceiptSize;
