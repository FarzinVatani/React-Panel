import { SetStateAction } from "react";
import { FaPlus } from "react-icons/fa";
import { IconContext } from "react-icons";

type MainBodyParameters = {
  totalHits: number;
  searchField: string;
  setSearchField: (value: SetStateAction<string>) => void;
  totalPage: number;
  setPage: (value: SetStateAction<number>) => void;
  page: number;
  toggleAddModal: () => void;
  tableHeaders: JSX.Element[];
  dataRows: JSX.Element[];
};

function MainBody({
  totalHits,
  searchField,
  setSearchField,
  totalPage,
  setPage,
  page,
  toggleAddModal,
  tableHeaders,
  dataRows,
}: MainBodyParameters) {
  return (
    <div className="absolute lg:relative flex flex-col items-center mb-10">
      <div className="my-10 flex w-full px-40 items-center justify-between">
        <input
          placeholder={`Search (${totalHits})`}
          className="border-2 border-slate-500 rounded-md p-1 w-64"
          value={searchField}
          type="text"
          onChange={(event) => {
            setSearchField(event.target.value);
          }}
        />
        <label>
          <span>Number of Page ({totalPage}):</span>
          <input
            max={totalPage || 1}
            min={1}
            onChange={(event) => {
              setPage(+event.target.value || 1);
            }}
            type="number"
            className="mx-5 shadow-md border-2 border-neutral-700 rounded-md px-2 w-24"
            value={page}
          />{" "}
        </label>
        <IconContext.Provider
          value={{ className: "text-neutral-800 text-2xl" }}
        >
          <button
            onClick={() => toggleAddModal()}
            className="p-2 px-4 bg-green-400 rounded-full font-black text-lg flex items-center justify-between"
          >
            <FaPlus /> <span className="ml-4">Add New Order</span>
          </button>
        </IconContext.Provider>
      </div>
      <div className="w-full h-full flex justify-center">
        <table className="table-auto text-left text-sm">
          <thead className="bg-neutral-300">
            <tr>{tableHeaders}</tr>
          </thead>
          <tbody className="">{dataRows}</tbody>
        </table>
      </div>
    </div>
  );
}

export default MainBody;
