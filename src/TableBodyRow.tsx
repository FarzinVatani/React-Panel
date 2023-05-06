import type { DataHits } from "./types";
import type { SetStateAction } from "react";
import moment from "moment";
import { AiFillDelete } from "react-icons/ai";
import { FaPencilAlt } from "react-icons/fa";
import PaymentMethod from "./PaymentMethod";
import PaymentStatus from "./PaymentStatus";
import { IconContext } from "react-icons";

type TableBodyRowType = {
  row: DataHits;
  setUpdateFields: (field: DataHits) => void;
  toggleUpdateModal: () => void;
  setDeleteId: (value: SetStateAction<string>) => void;
};

function TableBodyRow({
  row,
  setUpdateFields,
  toggleUpdateModal,
  setDeleteId,
}: TableBodyRowType) {
  const date = Date.parse(row["date"]);
  const formatted_date = moment(date).format("ll");

  return (
    <tr key={row["id"]} className="font-bold h-8 odd:bg-slate-200">
      <td className="pl-5">#{row["id"]}</td>
      <td className="pl-5">{row["name"]}</td>
      <td className="pl-5">{formatted_date}</td>
      <td className="pl-5">
        <span>${row["total"]}</span>
      </td>
      <td className="pl-5">
        <PaymentStatus status={row["status"]} />
      </td>
      <IconContext.Provider value={{ className: "text-neutral-800 text-2xl" }}>
        <td className="pl-5">
          <PaymentMethod method={row["method"]} />
        </td>
      </IconContext.Provider>
      <td>
        <div className="flex w-full justify-around items-center">
          <button
            className="text-green-500 text-lg"
            onClick={() => {
              setUpdateFields(row);
              toggleUpdateModal();
            }}
          >
            <FaPencilAlt />
          </button>
          <button
            className="text-red-500 text-xl"
            onClick={() => setDeleteId(`${row["id"]}`)}
          >
            <AiFillDelete />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default TableBodyRow;
