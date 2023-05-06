import { Dispatch, SetStateAction } from "react";

export const calculateAndSetTotalPage = (totalRows: number, setTotalPage: Dispatch<SetStateAction<number>>) => {
  let totalPages = totalRows / 20;
  setTotalPage(
    totalRows % 20 == 0 ? Math.round(totalPages) : Math.floor(totalPages) + 1
  );
};
