import "./App.css";
import { client } from "./utility";
import moment from "moment";
import { FaPlus, FaPencilAlt } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { IconContext } from "react-icons";
import { useState, useEffect, MouseEvent } from "react";
import type { Status, Method } from "./utility";
import PaymentStatus from "./PaymentStatus";
import { sortableAttributes, filterableAttributes, setConfig } from "./config";
import { TABLE_HEADERS } from "./constants";
import { useModal } from "./hooks";
import PaymentMethod from "./PaymentMethod";
import Modal from "./Modal";

await setConfig(client);

function App() {
  const [sort, setSort] = useState({ column: "id", direction: "desc" });
  const [data, setData] = useState({});
  const [dataRows, setDataRows] = useState(<tr></tr>);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [filterId, setFilterId] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterTotal, setFilterTotal] = useState("");
  const [filterStatus, setFilterStatus] = useState("" as Status | "");
  const [filterMethod, setFilterMethod] = useState("" as Method | "");

  const [searchField, setSearchField] = useState("");
  const [isShowingAddModal, toggleAddModal] = useModal();
  const [isShowingUpdateModal, toggleUpdateModal] = useModal();

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("Paid" as Status);
  const [method, setMethod] = useState("Paypal" as Method);

  const [updateId, setUpdateId] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [updateTotal, setUpdateTotal] = useState(0);
  const [updateStatus, setUpdateStatus] = useState("Paid" as Status);
  const [updateMethod, setUpdateMethod] = useState("Paypal" as Method);

  const [sendAddData, setSendAddData] = useState(false);
  const [sendUpdateData, setSendUpdateData] = useState(false);

  const addDocument = () => {
    client
      .index("panel")
      .addDocuments([{ id, name, date, total, status, method }]);
  };
  const updateDocument = () => {
    client.index("panel").updateDocuments([
      {
        id: updateId,
        name: updateName,
        date: updateDate,
        total: updateTotal,
        status: updateStatus,
        method: updateMethod,
      },
    ]);
  };

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

  const table_headers = TABLE_HEADERS.map((columnName, index) => {
    const button = () => {
      if (index < sortableAttributes.length) {
        return (
          <button
            className="flex justify-left"
            onClick={(event) =>
              sortClickHandler(event, sortableAttributes[index])
            }
          >
            <div className="py-2 font-black">{columnName}</div>
          </button>
        );
      }

      return <div className="py-2 font-black">{columnName}</div>;
    };

    const filter_input = () => {
      if (index < filterableAttributes.length) {
        switch (index) {
          case 0:
            return (
              <input
                placeholder={`Filter ID (${data.estimatedTotalHits})`}
                className="w-20 rounded-md py-1 px-2"
                type="string"
                value={filterId}
                onChange={(event) => {
                  setFilterId(event.target.value);
                }}
              />
            );
          case 1:
            return (
              <input
                placeholder={`Filter Name (${data.estimatedTotalHits})`}
                className="w-40 rounded-md py-1 px-2"
                type="string"
                value={filterName}
                onChange={(event) => {
                  setFilterName(event.target.value);
                }}
              />
            );
          case 2:
            return (
              <input
                placeholder={`Filter Date (${data.estimatedTotalHits})`}
                className="w-36 rounded-md py-1 px-2"
                type="date"
                value={filterDate}
                onChange={(event) => {
                  setFilterDate(event.target.value);
                }}
              />
            );
          case 3:
            return (
              <input
                placeholder={`Filter Total (${data.estimatedTotalHits})`}
                className="w-24 rounded-md py-1 px-2"
                type="number"
                value={filterTotal}
                onChange={(event) => {
                  setFilterTotal(event.target.value.toString());
                }}
              />
            );
          case 4:
            return (
              <select
                className="p-1 bg-white rounded-md"
                value={filterStatus}
                onChange={(event) => {
                  setFilterStatus(event.target.value as Status);
                }}
              >
                <option></option>
                <option>Paid</option>
                <option>Chargeback</option>
                <option>Pending</option>
                <option>Expired</option>
                <option>Failed</option>
              </select>
            );
          case 5:
            return (
              <select
                className="p-1 bg-white rounded-md"
                value={filterMethod}
                onChange={(event) => {
                  setFilterMethod(event.target.value as Method);
                }}
              >
                <option></option>
                <option>Mastercard</option>
                <option>Visa</option>
                <option>Paypal</option>
              </select>
            );
        }
      } else return "";
    };

    return (
      <th key={index} className="border border-slate-400 p-5">
        <div className="flex flex-col items-left">
          {button()}
          {filter_input()}
        </div>
      </th>
    );
  });

  const searchFilter = [
    filterId,
    filterName,
    filterDate,
    filterTotal,
    filterStatus,
    filterMethod,
  ];
  const fetchData = () => {
    const filterQuery = searchFilter
      .map((value, index) => {
        if (!value) return "";
        if (index === 2) {
          const date = new Date(filterDate);
          return `(date >= ${date.getTime()} AND date < ${date.setDate(
            date.getDate() + 1
          )})`;
        }
        return `${filterableAttributes[index]} = "${value}"`;
      })
      .filter((value) => value)
      .join(" AND ");

    client
      .index("panel")
      .search(searchField, {
        sort: [`${sort.column}:${sort.direction}`],
        filter: filterQuery,
        limit: 20,
        offset: 20 * (page - 1),
      })
      .then((result) => setData(result));
  };

  const calculateAndSetTotalPage = () => {
    const totalRows = data.estimatedTotalHits;
    let totalPages = totalRows / 20;
    setTotalPage(
      totalRows % 20 == 0 ? Math.round(totalPages) : Math.floor(totalPages) + 1
    );
  };

  const [deleteId, setDeleteId] = useState("");
  const setUpdateFields = (field) => {
    setUpdateId(field.id);
    setUpdateName(field.name);
    setUpdateDate(field.date);
    setUpdateTotal(field.total);
    setUpdateStatus(field.status);
    setUpdateMethod(field.method);
  };

  const set_rows = () => {
    calculateAndSetTotalPage();
    const rows = data.hits?.map((row) => {
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
                onClick={() => setDeleteId(row["id"])}
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
    fetchData();
  }, [sort, page, searchField, ...searchFilter]);

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
            setTimeout(fetchData, 200);
          });
      }
    };
  }, [deleteId]);

  useEffect(() => {
    setSendAddData(false);
    return () => {
      if (sendAddData) {
        addDocument();
        toggleAddModal();
        setTimeout(fetchData, 200);
      }
    };
  }, [sendAddData]);

  useEffect(() => {
    setSendUpdateData(false);
    return () => {
      if (sendUpdateData) {
        updateDocument();
        toggleUpdateModal();
        setTimeout(fetchData, 200);
      }
    };
  }, [sendUpdateData]);

  const modalContentAdd = () => {
    const fields = [id, name, date, total];
    const setFields = [setId, setName, setDate, setTotal];
    const types = ["number", "text", "date", "number"];

    const inputs = () =>
      filterableAttributes.slice(0, 4).map((value, index) => {
        return (
          <label className="w-full flex justify-between items-center">
            <span className="pr-5">{value.toUpperCase()}:</span>
            <input
              className="border-2 border-neutral-400 rounded-md py-1 px-2"
              type={types[index]}
              value={fields[index]}
              onChange={(event) => setFields[index](event.target.value)}
            />
          </label>
        );
      });

    const select_inputs = (
      <>
        {inputs()}
        <label className="w-full flex justify-between items-center">
          <span className="pr-5">STATUS:</span>
          <select
            className="py-1 px-2 bg-white rounded-md border-2 border-neutral-400"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as Status);
            }}
          >
            <option>Paid</option>
            <option>Chargeback</option>
            <option>Pending</option>
            <option>Expired</option>
            <option>Failed</option>
          </select>
        </label>

        <label className="w-full flex justify-between items-center">
          <span className="pr-5">METHOD:</span>
          <select
            className="py-1 px-2 bg-white rounded-md border-2 border-neutral-400"
            value={method}
            onChange={(event) => {
              setMethod(event.target.value as Method);
            }}
          >
            <option>Mastercard</option>
            <option>Visa</option>
            <option>Paypal</option>
          </select>
        </label>
      </>
    );

    return (
      <div className="flex flex-col items-around space-y-2">
        {select_inputs}
        <button
          onClick={() => {
            setSendAddData(true);
          }}
        >
          ADD
        </button>
      </div>
    );
  };

  const modalContentUpdate = () => {
    const fields = [updateId, updateName, updateDate, updateTotal];
    const setFields = [
      setUpdateId,
      setUpdateName,
      setUpdateDate,
      setUpdateTotal,
    ];
    const types = ["number", "text", "text", "number"];

    const inputs = () =>
      filterableAttributes.slice(0, 4).map((value, index) => {
        return (
          <label className="w-full flex justify-between items-center">
            <span className="pr-5">{value.toUpperCase()}:</span>
            <input
              className="border-2 border-neutral-400 rounded-md py-1 px-2"
              type={types[index]}
              value={fields[index]}
              onChange={(event) => setFields[index](event.target.value)}
              disabled={index === 0}
            />
          </label>
        );
      });

    const select_inputs = (
      <>
        {inputs()}
        <label className="w-full flex justify-between items-center">
          <span className="pr-5">STATUS:</span>
          <select
            className="py-1 px-2 bg-white rounded-md border-2 border-neutral-400"
            value={updateStatus}
            onChange={(event) => {
              setUpdateStatus(event.target.value as Status);
            }}
          >
            <option>Paid</option>
            <option>Chargeback</option>
            <option>Pending</option>
            <option>Expired</option>
            <option>Failed</option>
          </select>
        </label>

        <label className="w-full flex justify-between items-center">
          <span className="pr-5">METHOD:</span>
          <select
            className="py-1 px-2 bg-white rounded-md border-2 border-neutral-400"
            value={updateMethod}
            onChange={(event) => {
              setUpdateMethod(event.target.value as Method);
            }}
          >
            <option>Mastercard</option>
            <option>Visa</option>
            <option>Paypal</option>
          </select>
        </label>
      </>
    );

    return (
      <div className="flex flex-col items-around space-y-2">
        {select_inputs}
        <button onClick={() => setSendUpdateData(true)}>UPDATE</button>
      </div>
    );
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
        {modalContentAdd()}
      </Modal>

      <Modal
        show={isShowingUpdateModal}
        onCloseClick={() => {
          toggleUpdateModal();
          if (isShowingAddModal) toggleAddModal();
        }}
      >
        {modalContentUpdate()}
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
