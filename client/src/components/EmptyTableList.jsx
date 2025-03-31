const EmptyTableList = ({ tables }) => {
  return (
    <div>
      <h2 className="text-2xl text-center text-white rounded bg-[#124035] p-4 shadow-md]">
        DANH SÁCH BÀN TRỐNG
      </h2>
      <div className="bg-black/60 p-6 rounded space-y-4" style={{ maxHeight: "500px", overflowY: "auto" }}>
        {tables.map((table) => (
          <div
            key={table.tableNumber}
            className="flex justify-between items-center bg-[#ced4d5] text-black p-4 rounded shadow-md"
          >
            <p className="font-bold">Bàn {table.tableNumber}</p>
            <p className="font-semibold">Sức chứa: {table.capacity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyTableList;