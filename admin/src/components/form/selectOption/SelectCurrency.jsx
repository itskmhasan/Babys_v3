import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

// internal import
import useAsync from "@/hooks/useAsync";
import CurrencyServices from "@/services/CurrencyServices";

const SelectCurrency = ({ control, name, label, required }) => {
  const { data, loading } = useAsync(CurrencyServices.getShowingCurrency);

  if (loading) return "Loading...";

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
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            {data?.map((currency) => (
              <SelectItem key={currency._id} value={currency.symbol}>
                {currency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
};

export default SelectCurrency;
