import TableItem from "./TableItem";

const OrderList = ({ tables }) => {
  return (
    <div>
      <h2 className="text-2xl text-center text-white rounded bg-[#124035] p-4 shadow-md">
        DANH SÁCH BÀN ĐANG PHỤC VỤ
      </h2>
      <div
        className="grid grid-cols-3 gap-4 bg-black/60 p-6 rounded"
        style={{ maxHeight: "500px", overflowY: "auto" }}
      >
        {tables.map((table) => (
          <TableItem key={table.tableNumber} table={table} />
        ))}
      </div>
    </div>
  );
};

export default OrderList;
