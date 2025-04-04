import { useState, useEffect } from "react";
import StaffInfo from "./StaffInfo";
import { getStaffInfo } from "../services/staffService";

const Navbar = ({ activeTab, setActiveTab }) => {
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Giả sử user_id được lưu trong localStorage
  const userId = 2; // Thay bằng giá trị thực tế từ localStorage hoặc context

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const staffData = await getStaffInfo(userId);
        setUserInfo({
          name: staffData.fullname,
          phone: staffData.phone || "Không có số điện thoại",
          email: staffData.email || "Không có email",
          position: staffData.position,
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (showUserInfo) {
      fetchUserInfo();
    }
  }, [showUserInfo]);

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
      <div
        className="border-[#ebcd95] border-1 w-16 h-16 bg-[#124035] rounded-full z-10 cursor-pointer"
        onClick={() => setShowUserInfo(!showUserInfo)}
      ></div>
      {showUserInfo && userInfo && (
        <StaffInfo user={userInfo} onClose={() => setShowUserInfo(false)} />
      )}
    </nav>
  );
};

export default Navbar;