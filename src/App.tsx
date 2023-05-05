import "./App.css";
import { client } from "./utility";
import moment from "moment";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaPlus } from "react-icons/fa";
import { IconContext } from "react-icons";
import { useState, useEffect, MouseEvent } from "react";

await client.index("panel").updatePagination({ maxTotalHits: 200000 });
const sortableAttributes = ["id", "name", "date", "total"];
const filterableAttributes = ['id', 'name', 'date', 'total', 'status', 'method'];
await client.index('panel').updateSettings({
  filterableAttributes,
  sortableAttributes
});

type Status = "Paid" | "Chargeback" | "Pending" | "Expired" | "Failed";
type Method = "Visa" | "Mastercard" | "Paypal";

const table_headers_names = [
  "Order ID",
  "Billing Name",
  "Date",
  "Total",
  "Payment Status",
  "Payment Method",
  "Actions",
];

const get_status_tag = (status: Status) => {
  switch (status) {
    case "Paid":
      return (
        <span className="inline-block px-2 py-1 rounded-md bg-green-400 text-green-950 font-black text-xs">
          {status}
        </span>
      );
    case "Chargeback":
      return (
        <span className="inline-block px-2 py-1 rounded-md bg-rose-400 text-rose-950 font-black text-xs">
          {status}
        </span>
      );
    case "Pending":
      return (
        <span className="inline-block px-2 py-1 rounded-md bg-yellow-400 text-yellow-950 font-black text-xs">
          {status}
        </span>
      );
    case "Expired":
      return (
        <span className="inline-block px-2 py-1 rounded-md bg-neutral-400 text-neutral-950 font-black text-xs">
          {status}
        </span>
      );
    case "Failed":
      return (
        <span className="inline-block px-2 py-1 rounded-md bg-red-500 text-red-950 font-black text-xs">
          {status}
        </span>
      );
  }
};

const get_method_icon = (method: Method) => {
  switch (method) {
    case "Visa":
      return <FaCcVisa />;
    case "Mastercard":
      return <FaCcMastercard />;
    case "Paypal":
      return <FaCcPaypal />;
  }
};

function App() {
  const [sort, setSort] = useState({ column: "id", direction: "desc" });
  const [data, setData] = useState({});
  const [dataRows, setDataRows] = useState(<tr></tr>);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [filterId, setFilterId] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterTotal, setFilterTotal] = useState('');
  const [filterStatus, setFilterStatus] = useState('' as Status | '');
  const [filterMethod, setFilterMethod] = useState('' as Method | '');

  const [searchField, setSearchField] = useState('');

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

  const table_headers = table_headers_names.map((columnName, index) => {
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
            return <input placeholder={`Filter ID (${data.estimatedTotalHits})`} className="w-20 rounded-md py-1 px-2" type="string" value={filterId} onChange={(event) => { setFilterId(event.target.value) }} />;
          case 1:
            return <input placeholder={`Filter Name (${data.estimatedTotalHits})`} className="w-40 rounded-md py-1 px-2" type="string" value={filterName} onChange={(event) => { setFilterName(event.target.value) }} />;
          case 2:
            return <input placeholder={`Filter Date (${data.estimatedTotalHits})`} className="w-36 rounded-md py-1 px-2" type="date" value={filterDate} onChange={(event) => { setFilterDate(event.target.value) }} />;
          case 3:
            return <input placeholder={`Filter Total (${data.estimatedTotalHits})`} className="w-24 rounded-md py-1 px-2" type="number" value={filterTotal} onChange={(event) => { setFilterTotal(event.target.value.toString()) }} />;
          case 4:
            return (
              <select className="p-1 bg-white rounded-md" value={filterStatus} onChange={(event) => { setFilterStatus(event.target.value as Status) }}>
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
              <select className="p-1 bg-white rounded-md" value={filterMethod} onChange={(event) => { setFilterMethod(event.target.value as Method) }}>
                <option></option>
                <option>Mastercard</option>
                <option>Visa</option>
                <option>Paypal</option>
              </select>
            );
        }
      } else return '';
    };

    return <th key={index} className="border border-slate-400 p-5"><div className="flex flex-col items-left">{button()}{filter_input()}</div></th>;
  });

  const searchFilter = [filterId, filterName, filterDate, filterTotal, filterStatus, filterMethod];
  const fetchData = () => {
    const filterQuery = searchFilter.map((value, index) => {
      if (!value) return '';
      if (index === 2) {
        const date = new Date(filterDate);
        return `(date >= ${date.getTime()} AND date < ${date.setDate(date.getDate() + 1)})`;
      }
      return `${filterableAttributes[index]} = "${value}"`;
    }).filter((value) => value).join(' AND ');

    client
      .index("panel")
      .search(searchField, {
        sort: [`${sort.column}:${sort.direction}`],
        filter: filterQuery,
        limit: 20,
        offset: 20 * (page - 1),
      })
      .then((result) => setData(result));
  }

  const calculateAndSetTotalPage = () => {
    const totalRows = data.estimatedTotalHits;
    let totalPages = totalRows / 20;
    setTotalPage(totalRows % 20 == 0 ? Math.round(totalPages) : Math.floor(totalPages) + 1);
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
          <td className="pl-5">{get_status_tag(row["status"])}</td>
          <IconContext.Provider
            value={{ className: "text-neutral-800 text-2xl" }}
          >
            <td className="pl-5">
              <span className="flex no-wrap items-center">
                {get_method_icon(row["method"])}
                <span className="ml-2">{row["method"]}</span>
              </span>
            </td>
          </IconContext.Provider>
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

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="my-10 flex w-full px-40 justify-between">
          <input placeholder={`Search (${data.estimatedTotalHits})`} className="border-2 border-slate-500 rounded-md p-1 w-64" value={searchField} type="text" onChange={(event) => {setSearchField(event.target.value)}} />
          <IconContext.Provider
            value={{ className: "text-neutral-800 text-2xl" }}
          >
            <button className="p-2 px-4 bg-green-400 rounded-full font-black text-lg flex items-center justify-between"><FaPlus /> <span className="ml-4">Add New Order</span></button>
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
