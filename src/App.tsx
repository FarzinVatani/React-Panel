import "./App.css";
import { TABLE_HEADERS } from "./constants";
import { client, addDocument, updateDocument, fetchData } from "./meilisearch";
import { useState, useEffect } from "react";
import { useToggle } from "./hooks";
import { sortableAttributes, filterableAttributes, setConfig } from "./config";
import { calculateAndSetTotalPage } from "./utility";
import Modal from "./Modal";
import ModalContentInput from "./ModalContentInput";
import TableHeader from "./TableHeader";
import TableBodyRow from "./TableBodyRow";
import MainBody from "./MainBody";

import type { SetStateAction } from "react";
import type { DataHits, Data, InputStateSetter } from './types';

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
  const fetchingData = () => fetchData({ searchFilter, filterableAttributes, searchField, sort, page, setData });

  const searchFilter = {
    id: filterId,
    name: filterName,
    date: filterDate,
    total: filterTotal,
    status: filterStatus,
    method: filterMethod,
  };

  const [deleteId, setDeleteId] = useState("");
  const setUpdateFields = (field: DataHits) => {
    setUpdateId(`${field.id}`);
    setUpdateName(field.name);
    setUpdateDate(field.date);
    setUpdateTotal(field.total);
    setUpdateStatus(field.status);
    setUpdateMethod(field.method);
  };

  const table_headers = TABLE_HEADERS.map((columnShowName, index) => {
    const filterGetters = [filterId, filterName, filterDate, filterTotal, filterStatus, filterMethod];
    const filterSetter = [setFilterId, setFilterName, setFilterDate, setFilterTotal, setFilterStatus, setFilterMethod];
    const inputType: ("text" | "date" | "number" | "select" | null)[] = ["text", "text", "date", "number", "select", "select", null];
    return (
      <TableHeader key={index} sort={sort} setSort={setSort} columnName={filterableAttributes[index]} columnShowName={columnShowName} isSortable={index < sortableAttributes.length} totalRows={data.estimatedTotalHits} filterGetter={filterGetters[index]} filterSetter={filterSetter[index]} inputType={inputType[index]} />
    );
  });

  const set_rows = () => {
    calculateAndSetTotalPage(data.estimatedTotalHits, setTotalPage);
    const rows = data?.hits?.map((row) => {
      return <TableBodyRow row={row} setUpdateFields={setUpdateFields} toggleUpdateModal={toggleUpdateModal} setDeleteId={setDeleteId} />;
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
      <MainBody totalHits={data.estimatedTotalHits} searchField={searchField} setSearchField={setSearchField} totalPage={totalPage} setPage={setPage} page={page} toggleAddModal={toggleAddModal} tableHeaders={table_headers} dataRows={dataRows}/>
    </>
  );
}

export default App;
