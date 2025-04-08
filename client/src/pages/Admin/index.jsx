import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/custom.css";
import "../../assets/styles/Admin_menu.css";
import logo from "../../assets/images/logo.png";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "MENU") {
      navigate("/admin/menu");
    } else if (tab === "BÀN") {
      navigate("/admin/tables");
    } else if (tab === "NHÂN VIÊN") {
      navigate("/admin/employees");
    } else if (tab === "KHO") {
      navigate("/admin/inventory");
    } else if (tab === "DOANH THU") {
      navigate("/admin/revenue");
    } else if (tab === "PHẢN HỒI") {
      navigate("/admin/feedback");
    } else if (tab === "TÀI KHOẢN") {
      navigate("/admin/account");
    }
  };

  return (
    <div className="min-h-screen background-image">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 shadow-lg sidebar">
        <div className="text-center font-bold text-md mb-1">
        <img
          src={logo}
          alt="Chef Hats Logo"
          className="mx-auto mb-1 logo-image"
          style={{ width: "150px", height: "auto" }}
        />
        </div>
        <ul>
          {["MENU", "NHÂN VIÊN", "BÀN", "KHO", "DOANH THU", "PHẢN HỒI", "TÀI KHOẢN"].map((tab) => (
            <li
              key={tab}
              className={`p-4 my-2 rounded-lg text-center cursor-pointer text-xl ${
                activeTab === tab ? "bg-[#124035] text-white" : "bg-gray-500 text-white"
              } hover:bg-[#124035] hover:text-white`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;

