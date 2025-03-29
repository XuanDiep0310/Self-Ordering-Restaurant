import TableItem from "./TableItem";

const OrderList = ({ tables }) => {
  return (
    <div>
      <h2 className="text-2xl text-center text-white rounded bg-[#124035] p-4 rounded shadow-md">
        DANH SÁCH BÀN ĐANG PHỤC VỤ
      </h2>
      <div className="bg-black/60 p-6">
        <div className="space-y-6 flex flex-col items-center justify-center">
          {tables.map((table) => (
            <TableItem key={table.id} table={table}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderList;