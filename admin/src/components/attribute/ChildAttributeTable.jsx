import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import React from "react";

//internal import
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import CheckBox from "@/components/form/others/CheckBox";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ShowHideButton from "@/components/table/ShowHideButton";
import { useAction } from "@/context/ActionContext";

const ChildAttributeTable = ({ att, childAttributes }) => {
  // console.log(lang);
  // console.log("att", childAttributes);

  const { handleModalOpen, handleUpdate } = useToggleDrawer();
  const { showingTranslateValue } = useUtilsFunction();
  const { handleSelect, selectedIds } = useAction();

  return (
    <>
      <TableBody>
        {childAttributes?.map((attribute, index) => (
          <TableRow key={index + 1}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name="child-attribute"
                id={attribute._id}
                handleSelect={handleSelect}
                isChecked={selectedIds?.includes(attribute._id)}
              />
            </TableCell>
            <TableCell className="font-semibold uppercase text-xs">
              {attribute?._id?.substring(20, 24)}
            </TableCell>

            <TableCell className="font-medium text-sm">
              {showingTranslateValue(attribute?.name)}
            </TableCell>

            <TableCell className="font-medium text-sm">{att?.option}</TableCell>

            <TableCell className="text-center">
              <ShowHideButton id={attribute._id} status={attribute.status} />
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={attribute._id}
                selectedIds={selectedIds}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(attribute.name)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default ChildAttributeTable;
