import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../../assets/styles/custom.css";
import "../../assets/styles/Admin_menu.css";
import logo from "../../assets/images/logo.png"; // Import logo
import { getTableData } from "../../services/tableService";
import Management_table from "../../components/Management_table";

const AdminDashboard = () => {
  const [tables, setTables] = useState([]);
  const [activeTab, setActiveTab] = useState("MENU"); // Default tab is MENU
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    getTableData().then((data) => setTables(data));
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "MENU") {
      navigate("/admin/menu"); // Navigate to lowercase 'menu'
    } else if (tab === "BÀN") {
      navigate("/admin/tables"); // Navigate to 'bàn'
    } else if (tab === "NHÂN VIÊN") {
      navigate("/admin/employees");
    }
  };

  return (
    <div className="min-h-screen background-image">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 shadow-lg sidebar">
        <div className="text-center font-bold text-xl mb-4">
          <img
            src={logo} // Path to logo
            alt="Chef Hats Logo"
            className="mx-auto mb-2 logo-image"
          />
        </div>
        <ul>
          {[
            "MENU",
            "NHÂN VIÊN",
            "BÀN",
            "KHO",
            "DOANH THU",
            "PHẢN HỒI",
            "TÀI KHOẢN",
          ].map((tab) => (
            <li
              key={tab}
              className={`p-7.5 my-2 rounded-lg text-center cursor-pointer text-xl ${
                activeTab === tab
                  ? "bg-green-800 text-white"
                  : "bg-gray-500 text-white"
              }`}
              onClick={() => handleTabClick(tab)} // Call navigation function
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
