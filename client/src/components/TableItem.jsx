const TableItem = ({ table }) => {
  return (
    <div className=" text-white flex flex-col">
      <div className="flex justify-between items-center bg-[#124035] p-4">
        <p className="text-lg font-bold">Bàn {table.tableNumber}</p>
        <button className="">
          <i className="fa-solid fa-bell"></i>
        </button>
      </div>
      <div className="flex justify-between items-center bg-[#737373] p-4">
        <button className="">
          <i className="fa-solid fa-bell-concierge"></i>
        </button>
        <button className="">
          <i className="fa-solid fa-receipt"></i>
        </button>
      </div>
      <div className="bg-[#124035] p-2 pl-4">
        <p className="">Sức chứa: {table.capacity}</p>
      </div>
    </div>
  );
};

export default TableItem;
