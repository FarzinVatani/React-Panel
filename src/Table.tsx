type TableParameters = {
  tableHeaders: JSX.Element[];
  dataRows: JSX.Element[];
}
function Table({ tableHeaders, dataRows }: TableParameters) {
  return (
    <table className="table-auto text-left text-sm">
      <thead className="bg-neutral-300">
        <tr>{tableHeaders}</tr>
      </thead>
      <tbody>{dataRows}</tbody>
    </table>
  );
}

export default Table;
