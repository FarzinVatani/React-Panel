import './App.css';
import { client } from './utility';
import moment from 'moment';
import { FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { useState, useEffect } from 'react';

await client.index('panel').updatePagination({maxTotalHits: 200000});
// await client.index('panel').updateSettings({
//   filterableAttributes: ['id', 'name', 'date', 'total', 'status', 'method'],
//   sortableAttributes: ['id', 'name', 'date', 'total']
// })

type Status = 'Paid' | 'Chargeback' | 'Pending' | 'Expired' | 'Failed';
type Method = 'Visa' | 'Mastercard' | 'Paypal';

const table_headers_names = ['Order ID', 'Billing Name', 'Date', 'Total', 'Payment Status', 'Payment Method', 'Actions'];

const get_status_tag = (status: Status) => {
  switch (status) {
    case 'Paid': return <span className='inline-block px-2 py-1 rounded-md bg-green-400 text-green-950 font-black text-xs'>{status}</span>;
    case 'Chargeback': return <span className='inline-block px-2 py-1 rounded-md bg-rose-400 text-rose-950 font-black text-xs'>{status}</span>;
    case 'Pending': return <span className='inline-block px-2 py-1 rounded-md bg-yellow-400 text-yellow-950 font-black text-xs'>{status}</span>;
    case 'Expired': return <span className='inline-block px-2 py-1 rounded-md bg-neutral-400 text-neutral-950 font-black text-xs'>{status}</span>;
    case 'Failed': return <span className='inline-block px-2 py-1 rounded-md bg-red-500 text-red-950 font-black text-xs'>{status}</span>;
  }
};

const get_method_tag = (method: Method) => {
  switch (method) {
    case 'Visa': return <FaCcVisa />;
    case 'Mastercard': return <FaCcMastercard />;
    case 'Paypal': return <FaCcPaypal />;
  }
};


function App() {
  const [sort, setSort] = useState({ column: 'id', direction: 'desc' });
  const [data, setData] = useState({});
  const [dataRows, setDataRows] = useState(<tr></tr>);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const fetchTotalPageData = () => client.index('panel').getStats().then((res) => {
    const totalRows = res["numberOfDocuments"];
    let totalPages = totalRows / 20;
    setTotalPage(totalRows % 20 == 0 ? totalPages : totalPages + 1);
  });

  useEffect(() => {
    fetchTotalPageData();
    return () => { };
  }, []);

  const table_headers = table_headers_names.map((name, index) => {
    return <th key={index}><div className='py-2 font-black'>{name}</div></th>;
  });

  const fetchData = () => client.index('panel').search(
    '',
    { sort: [`${sort.column}:${sort.direction}`], limit: 20, offset: 20 * (page - 1) }
  ).then((result) => setData(result));

  const set_rows = () => {
    const rows = data.hits?.map((row) => {
      const date = Date.parse(row["date"]);
      const formatted_date = moment(date).format('ll');

      return (
        <tr key={row["id"]} className='font-bold h-8 odd:bg-slate-200'>
          <td>#{row["id"]}</td>
          <td>{row["name"]}</td>
          <td>{formatted_date}</td>
          <td><span>${row["total"]}</span></td>
          <td>{get_status_tag(row["status"])}</td>
          <IconContext.Provider value={{ className: "text-neutral-800 text-2xl" }}>
            <td>
              <span className='flex no-wrap items-center'>
                {get_method_tag(row["method"])}<span className='ml-2'>{row["method"]}</span>
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
  }, [sort, page]);

  useEffect(() => {
    set_rows();
    console.log(data);
    return () => { };
  }, [data]);

  return (
    <>
      <div className='flex flex-col items-center'>
        <div className='w-full h-full flex justify-center'>
          <table className='table-auto min-w-[85%] text-left text-sm'>
            <thead className='bg-neutral-300'>
              <tr>
                {table_headers}
              </tr>
            </thead>
            <tbody className=''>
              {dataRows}
            </tbody>
          </table>
        </div>
        <label><span>Number of Page ({totalPage}):</span><input max={totalPage} min={1} onChange={(event) => { setPage(+event.target.value || 1) }} type='number' className='my-10 mx-5 shadow-md border-2 border-neutral-700 rounded-md px-2 w-20' value={page} /> </label>
      </div>
    </>
  )
}

export default App
