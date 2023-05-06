import { Dispatch, SetStateAction } from "react";
import { PAYMENT_METHODS, PAYMENT_STATUS } from "./constants";
import type { MouseEvent } from 'react';

type TableHeaderParameters = {
  sort: Record<string, string>;
  setSort: Dispatch<SetStateAction<Record<string, string>>>;
  columnShowName: string;
  columnName: string;
  isSortable: boolean;
  totalRows: number;
  filterGetter: string;
  filterSetter: Dispatch<SetStateAction<string>>;
  inputType: "text" | "number" | "date" | "select" | null;
}

function TableHeader({ sort, setSort, columnName, columnShowName, isSortable, totalRows, filterGetter, filterSetter, inputType }: TableHeaderParameters) {
  const sortClickHandler = (event: MouseEvent, column: string) => {
    event.preventDefault();
    if (column == sort.column) {
      setSort({
        column: column,
        direction: sort.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSort({ column: column, direction: "asc" });
    }
  };

  const title = () => {
    if (isSortable) {
      return (
        <button
          className="flex justify-left"
          onClick={(event) =>
            sortClickHandler(event, columnName)
          }
        >
          <div className="py-2 font-black">{columnShowName}</div>
        </button>
      );
    }

    return <div className="py-2 font-black">{columnShowName}</div>;
  };

  let inputTag: JSX.Element = <></>;

  if (inputType && inputType !== "select") {
    inputTag = (
      <input
        placeholder={`Filter ${columnShowName} (${totalRows})`}
        className="w-30 rounded-md py-1 px-2"
        type={inputType}
        value={filterGetter}
        onChange={(event) => {
          filterSetter(event.target.value);
        }}
      />
    );
  }

  if (inputType && inputType === "select") {
    const paymentName = columnName === "status" ? PAYMENT_STATUS : PAYMENT_METHODS;
    inputTag = (
      <select
        className="p-1 bg-white rounded-md"
        value={filterGetter}
        onChange={(event) => {
          filterSetter(event.target.value);
        }}
      >
        {["", ...paymentName].map((value) => <option>{value}</option>)}
      </select>
    );
  }

  return (
    <>
      {title()}
      {inputTag}
    </>
  );
}

export default TableHeader;
