const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = ["ĐƠN HÀNG", "MÓN ĂN", "THÔNG BÁO"];

  return (
    <nav className="p-6 pl-12 pr-12 flex justify-between items-center relative">
      <div className="absolute inset-x-0 top-1/2 border-b-2 border-[#ebcd95]"></div>
      <div className="flex space-x-10 z-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-[#ebcd95] border-1 px-12 py-6 rounded cursor-pointer ${
              activeTab === tab ? "bg-[#124035] text-white" : "bg-[#737373] text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="border-[#ebcd95] border-1 w-16 h-16 bg-[#124035] rounded-full z-10"></div>
    </nav>
  );
};

export default Navbar;