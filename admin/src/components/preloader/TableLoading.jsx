import {
  TableContainer,
  TableFooter,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "@/context/ThemeContext";
import React, { useContext } from "react";
import Skeleton from "react-loading-skeleton";

const TableLoading = ({ row = 5, col = 4, width = 290, height = 25 }) => {
  const { theme } = useTheme();
  const newArray = [];

  for (let i = 1; i <= row; i++) {
    newArray.push(i);
  }

  return (
    <TableContainer className="mb-8">
      <Table>
        <TableBody>
          <TableRow>
            {Array.from({ length: col }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton
                  height={40}
                  width={width}
                  className="dark:bg-gray-800 bg-gray-200"
                  baseColor={`${theme === "dark" ? "#010101" : "#f9f9f9"}`}
                  highlightColor={`${
                    theme === "dark" ? "#1a1c23" : "#f8f8f8"
                  } `}
                />
              </TableCell>
            ))}
          </TableRow>
          {newArray.map((item) => (
            <TableRow key={item}>
              {Array.from({ length: col }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton
                    height={height}
                    width={width}
                    className="dark:bg-gray-800 bg-gray-200"
                    baseColor={`${theme === "dark" ? "#010101" : "#f9f9f9"}`}
                    highlightColor={`${
                      theme === "dark" ? "#1a1c23" : "#f8f8f8"
                    } `}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <TableFooter>
        <TableRow>
          <TableCell
            colSpan={Math.floor(col / 2)}
            className="flex justify-start"
          >
            <Skeleton
              className="dark:bg-gray-800 bg-gray-200"
              baseColor={theme === "dark" ? "#010101" : "#f9f9f9"}
              highlightColor={theme === "dark" ? "#1a1c23" : "#f8f8f8"}
              height={25}
              width={290}
              count={1}
            />
          </TableCell>
          <TableCell colSpan={Math.ceil(col / 2)} className="flex justify-end">
            <Skeleton
              className="dark:bg-gray-800 bg-gray-200"
              baseColor={theme === "dark" ? "#010101" : "#f9f9f9"}
              highlightColor={theme === "dark" ? "#1a1c23" : "#f8f8f8"}
              height={25}
              width={290}
              count={1}
            />
          </TableCell>
        </TableRow>
      </TableFooter> */}
    </TableContainer>
  );
};

export default TableLoading;
