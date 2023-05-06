import "./App.css";
import { client, addDocument, updateDocument, fetchData } from "./meilisearch";
import moment from "moment";
import { FaPlus, FaPencilAlt } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { IconContext } from "react-icons";
import { useState, useEffect } from "react";
import { useToggle } from "./hooks";
import { sortableAttributes, filterableAttributes, setConfig } from "./config";
import { TABLE_HEADERS } from "./constants";
import PaymentStatus from "./PaymentStatus";
import PaymentMethod from "./PaymentMethod";
import Modal from "./Modal";
import { calculateAndSetTotalPage } from "./utility";

import type { SetStateAction } from "react";
import type { DataHits, Data, InputStateSetter } from './types';
import TableHeader from "./TableHeader";
import ModalContentInput from "./ModalContentInput";

setConfig(client);

function App() {
  const [sort, setSort] = useState({ column: "id", direction: "desc" } as Record<string, string>);
  const [data, setData] = useState({} as Data);
  const [dataRows, setDataRows] = useState([] as JSX.Element[]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [filterId, setFilterId] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterTotal, setFilterTotal] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");

  const [searchField, setSearchField] = useState("");

  const addModal = useToggle();
  const isShowingAddModal = addModal[0] as boolean;
  const toggleAddModal = addModal[1] as () => void;

  const updateModal = useToggle();
  const isShowingUpdateModal = updateModal[0] as boolean;
  const toggleUpdateModal = updateModal[1] as () => void;

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("Paid");
  const [method, setMethod] = useState("Paypal");

  const [updateId, setUpdateId] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [updateTotal, setUpdateTotal] = useState(0);
  const [updateStatus, setUpdateStatus] = useState("Paid");
  const [updateMethod, setUpdateMethod] = useState("Paypal");

  const [sendAddData, setSendAddData] = useState(false);
  const [sendUpdateData, setSendUpdateData] = useState(false);

  const addData = () => addDocument({ id, name, date, total, status, method });
  const updateData = () => updateDocument({ id: updateId, name: updateName, date: updateDate, total: updateTotal, status: updateStatus, method: updateMethod });

  const table_headers = TABLE_HEADERS.map((columnShowName, index) => {
    const filterGetters = [filterId, filterName, filterDate, filterTotal, filterStatus, filterMethod];
    const filterSetter = [setFilterId, setFilterName, setFilterDate, setFilterTotal, setFilterStatus, setFilterMethod];
    const inputType: ("text" | "date" | "number" | "select" | null)[] = ["text", "text", "date", "number", "select", "select", null];
    return (
      <th key={index} className="border border-slate-400 p-5">
        <div className="flex flex-col items-left">
          <TableHeader sort={sort} setSort={setSort} columnName={filterableAttributes[index]} columnShowName={columnShowName} isSortable={index < sortableAttributes.length} totalRows={data.estimatedTotalHits} filterGetter={filterGetters[index]} filterSetter={filterSetter[index]} inputType={inputType[index]} />
        </div>
      </th>
    );
  });

  const searchFilter = {
    id: filterId,
    name: filterName,
    date: filterDate,
    total: filterTotal,
    status: filterStatus,
    method: filterMethod,
  };
  const fetchingData = () => fetchData({ searchFilter, filterableAttributes, searchField, sort, page, setData });

  const [deleteId, setDeleteId] = useState("");
  const setUpdateFields = (field: DataHits) => {
    setUpdateId(`${field.id}`);
    setUpdateName(field.name);
    setUpdateDate(field.date);
    setUpdateTotal(field.total);
    setUpdateStatus(field.status);
    setUpdateMethod(field.method);
  };

  const set_rows = () => {
    calculateAndSetTotalPage(data.estimatedTotalHits, setTotalPage);
    const rows = data?.hits?.map((row) => {
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
          <IconContext.Provider
            value={{ className: "text-neutral-800 text-2xl" }}
          >
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
    });

    setDataRows(rows);
  };

  useEffect(() => {
    fetchingData();
  }, [sort, page, searchField, ...Object.values(searchFilter)]);

  useEffect(() => {
    set_rows();
    return () => { };
  }, [data]);

  useEffect(() => {
    setDeleteId("");
    return () => {
      if (deleteId !== "") {
        client
          .index("panel")
          .deleteDocument(deleteId)
          .then(() => {
            setTimeout(fetchingData, 200);
          });
      }
    };
  }, [deleteId]);

  useEffect(() => {
    setSendAddData(false);
    return () => {
      if (sendAddData) {
        addData();
        toggleAddModal();
        setTimeout(fetchingData, 200);
      }
    };
  }, [sendAddData]);

  useEffect(() => {
    setSendUpdateData(false);
    return () => {
      if (sendUpdateData) {
        updateData();
        toggleUpdateModal();
        setTimeout(fetchingData, 200);
      }
    };
  }, [sendUpdateData]);

  const modalInputTypes: ("text" | "number" | "date" | "select")[] = ["text", "text", "date", "number", "select", "select"];

  const modalAddGetter = [id, name, date, total, status, method];
  const modalAddSetter = [setId, setName, setDate, setTotal, setStatus, setMethod];

  const modalUpdateGetter = [updateId, updateName, updateDate, updateTotal, updateStatus, updateMethod];
  const modalUpdateSetter = [setUpdateId, setUpdateName, setUpdateDate, setUpdateTotal, setUpdateStatus, setUpdateMethod];

  const modalContentInputs = (modalSetter: InputStateSetter[], modalGetter: (string | number)[], dataSender: ((value: SetStateAction<boolean>) => void), type: "add" | "update") => {
    const result = filterableAttributes.map((value, index) => {
      return (
        <ModalContentInput columnName={value} columnShowName={TABLE_HEADERS.slice(0, -1)[index]} inputType={modalInputTypes[index]} modalGetter={modalGetter[index]} modalSetter={modalSetter[index]} isDisabled={false} />
      );
    });
    return <div className="flex flex-col"><div className="flex flex-col space-y-2">{result}</div><button className="bg-green-500 rounded-md py-2 mt-6" onClick={() => dataSender(true)}>{type.toUpperCase()}</button></div>;
  };

  return (
    <>
      <Modal
        show={isShowingAddModal}
        onCloseClick={() => {
          toggleAddModal();
          if (isShowingUpdateModal) toggleUpdateModal();
        }}
      >
        {modalContentInputs(modalAddSetter, modalAddGetter, setSendAddData, "add")}
      </Modal>

      <Modal
        show={isShowingUpdateModal}
        onCloseClick={() => {
          toggleUpdateModal();
          if (isShowingAddModal) toggleAddModal();
        }}
      >
        {modalContentInputs(modalUpdateSetter, modalUpdateGetter, setSendUpdateData, "update")}
      </Modal>

      <div className="absolute lg:relative flex flex-col items-center">
        <div className="my-10 flex w-full px-40 justify-between">
          <input
            placeholder={`Search (${data.estimatedTotalHits})`}
            className="border-2 border-slate-500 rounded-md p-1 w-64"
            value={searchField}
            type="text"
            onChange={(event) => {
              setSearchField(event.target.value);
            }}
          />
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
              <tr>{table_headers}</tr>
            </thead>
            <tbody className="">{dataRows}</tbody>
          </table>
        </div>
        <label>
          <span>Number of Page ({totalPage}):</span>
          <input
            max={totalPage || 1}
            min={1}
            onChange={(event) => {
              setPage(+event.target.value || 1);
            }}
            type="number"
            className="my-10 mx-5 shadow-md border-2 border-neutral-700 rounded-md px-2 w-20"
            value={page}
          />{" "}
        </label>
      </div>
    </>
  );
}

export default App;
