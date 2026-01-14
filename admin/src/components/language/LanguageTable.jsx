import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import React from "react";

//internal import

import useToggleDrawer from "@/hooks/useToggleDrawer";
import CheckBox from "@/components/form/others/CheckBox";
import ShowHideButton from "@/components/table/ShowHideButton";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import { useAction } from "@/context/ActionContext";

const LanguageTable = ({ languages }) => {
  const { handleModalOpen, handleUpdate } = useToggleDrawer();
  const { handleSelect, selectedIds } = useAction();

  return (
    <>
      <TableBody>
        {languages?.map((language, i) => (
          <TableRow key={language._id}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name={language.name}
                id={language._id}
                handleSelect={handleSelect}
                isChecked={selectedIds.includes(language._id)}
              />
            </TableCell>
            {/* <TableCell>
              <span className="font-semibold uppercase text-xs"> {i + 1}</span>
            </TableCell> */}

            <TableCell>
              <span className="text-sm">{language.name}</span>{" "}
            </TableCell>

            <TableCell>
              <span className="text-sm">{language.code}</span>{" "}
            </TableCell>

            <TableCell>{language?.flag}</TableCell>

            <TableCell className="text-center">
              <ShowHideButton id={language._id} status={language.status} />
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={language._id}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default LanguageTable;
