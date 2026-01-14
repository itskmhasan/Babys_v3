import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import React from "react";

//internal import
import CheckBox from "@/components/form/others/CheckBox";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ShowHideButton from "@/components/table/ShowHideButton";
import { useAction } from "@/context/ActionContext";
// import { SidebarContext } from '../context/SidebarContext';

const CurrencyTable = ({ currency }) => {
  const { handleModalOpen, handleUpdate } = useToggleDrawer();
  const { handleSelect, selectedIds } = useAction();

  return (
    <>
      <TableBody>
        {currency?.map((currency) => (
          <TableRow key={currency._id}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name={currency.symbol}
                id={currency._id}
                handleSelect={handleSelect}
                isChecked={selectedIds.includes(currency._id)}
              />
            </TableCell>

            <TableCell className="text-center">
              <span className="font-medium text-sm">{currency.name}</span>
            </TableCell>

            {/* <TableCell className="text-center">
              <span className="font-medium text-sm">{currency.iso_code}</span>
            </TableCell> */}

            <TableCell className="text-center">
              <span className="font-medium text-sm">{currency.symbol}</span>
            </TableCell>

            <TableCell className="text-center">
              <ShowHideButton
                id={currency._id}
                status={currency.status}
                currencyStatusName="status"
              />
            </TableCell>

            <TableCell>
              <EditDeleteButton
                title={currency.name}
                id={currency._id}
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

export default CurrencyTable;
