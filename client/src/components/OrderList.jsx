import TableItem from "./TableItem";

const OrderList = ({ tables }) => {
  return (
    <div>
      <h2 className="text-2xl text-center text-white p-2 rounded bg-[#124035] p-4 rounded shadow-md">
        Danh sách bàn đang phục vụ
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