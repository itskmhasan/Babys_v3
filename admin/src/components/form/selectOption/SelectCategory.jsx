import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { useTranslation } from "react-i18next";

//internal import

import useAsync from "@/hooks/useAsync";
import CategoryServices from "@/services/CategoryServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const SelectCategory = ({ setCategory }) => {
  // console.log('data category',data)
  const { t } = useTranslation();
  const { data } = useAsync(CategoryServices.getAllCategories);
  const { showingTranslateValue } = useUtilsFunction();

  return (
    <>
      <Select onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder={t("Category")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {data?.map((cat) => (
            <SelectItem key={cat._id} value={cat._id}>
              {showingTranslateValue(cat?.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectCategory;
