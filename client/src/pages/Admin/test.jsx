import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/Admin_menu.css";
import "../../assets/styles/custom.css";
import logo from "../../assets/images/logo.png"; // Corrected logo import
import { getTableData } from "../../services/tableService";
import Management_table from "./Management_table";
import Employees from "./Employees"; // Added missing import

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("MENU"); // Default tab is MENU
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    getTableData().then((data) => console.log(data)); // Log table data for debugging
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "MENU") {
      navigate("/menu");
    } else if (tab === "BÀN") {
      navigate("/ban");
    } else if (tab === "NHÂN VIÊN") {
      navigate("/employees");
    }
  };

  const renderContent = () => {
    if (activeTab === "MENU") {
      return <h1 className="text-3xl font-bold">Quản lý Menu</h1>;
    } else if (activeTab === "BÀN") {
      return <Management_table />;
    } else if (activeTab === "NHÂN VIÊN") {
      return <Employees />;
    } else {
      return <h1 className="text-3xl font-bold">Chọn một tab để quản lý</h1>;
    }
  };

  return (
    <div className="min-h-screen background-image">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 shadow-lg sidebar">
        <div className="text-center font-bold text-xl mb-4">
          <img
            src={logo}
            alt="Chef Hats Logo"
            className="mx-auto mb-2 logo-image"
          />
        </div>
        <ul>
          {["MENU", "NHÂN VIÊN", "BÀN", "KHO", "DOANH THU", "PHẢN HỒI", "TÀI KHOẢN"].map((tab) => (
            <li
              key={tab}
              className={`p-7.5 my-2 rounded-lg text-center cursor-pointer text-xl ${
                activeTab === tab ? "bg-green-800 text-white" : "bg-gray-500 text-white"
              }`}
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