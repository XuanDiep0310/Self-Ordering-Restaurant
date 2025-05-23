import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/custom.css";
import "../../assets/styles/Admin_menu.css";
import logo from "../../assets/images/logo.png";

const Sidebar = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "MENU":
        navigate("/admin/menu");
        break;
      case "BÀN":
        navigate("/admin/tables");
        break;
      case "NHÂN VIÊN":
        navigate("/admin/employees");
        break;
      case "KHO":
        navigate("/admin/inventory");
        break;
      case "DOANH THU":
        navigate("/admin/revenue");
        break;
      case "LỊCH SỬ HOÁ ĐƠN":
        navigate("/admin/payment-history");
        break;
      case "PHẢN HỒI":
        navigate("/admin/feedback");
        break;
      case "TÀI KHOẢN":
        navigate("/admin/account");
        break;
      default:
        break;
    }
    onClose(); // Đóng sidebar khi chọn tab
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay nền mờ */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="w-1/4 fixed top-0 left-0 h-full bg-white p-4 shadow-lg z-50 transition-transform duration-300 transform translate-x-0">
        <div className="text-center font-bold text-md mb-4">
          <img
            src={logo}
            alt="Chef Hats Logo"
            className="mx-auto mb-2"
            style={{ width: "150px", height: "auto" }}
          />
        </div>
        <ul>
          {["MENU", "NHÂN VIÊN", "BÀN", "KHO", "DOANH THU", "LỊCH SỬ HOÁ ĐƠN", "PHẢN HỒI", "TÀI KHOẢN"].map((tab) => (
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
    </>
  );
};

export default Sidebar;