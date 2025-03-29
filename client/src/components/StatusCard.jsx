const StatusCard = ({ title, count, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-8 rounded shadow-md text-center cursor-pointer ${active ? "bg-[#124035] text-white" : "bg-[#ced4d5]"}`}
    >
      <h3 className="text-2xl font-bold">{count}</h3>
      <p className="text-lg font-medium">{title}</p>
    </div>
  );
};

export default StatusCard;