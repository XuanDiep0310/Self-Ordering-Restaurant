const TableItem = ({ table }) => {
  return (
    <div className="flex justify-between items-center bg-[#ced4d5] p-4 rounded shadow-sm w-[90%] cursor-pointer">
      <p className="text-lg font-medium">Bàn {table.tableNumber}</p>
      <div className="flex space-x-3">
        <button className="text-xl">🔔</button>
        <button className="text-xl">⬇</button>
      </div>
    </div>
  );
};

export default TableItem;