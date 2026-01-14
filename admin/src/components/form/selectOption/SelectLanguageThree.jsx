import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const SelectLanguageThree = ({ control, name, label, required, setValue }) => {
  const { languages } = useUtilsFunction();

  // console.log("languages", languages);

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
            field.onChange(value); // RHF sync
            setValue(name, value); // extra manual sync if needed
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {languages?.map((language, i) => (
              <SelectItem key={i + 1} value={language.code}>
                {language.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
};

export default SelectLanguageThree;
