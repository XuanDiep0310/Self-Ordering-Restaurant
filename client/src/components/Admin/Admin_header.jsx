import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ title }) => {
  const navigate = useNavigate();

  const handleMenuClick = () => {
    navigate("/admin");
  };

  return (
    <header className="size-20 flex items-center bg-[#124035] text-white px-4 py-3 w-2/7">
      <button
        className="mr-4 focus:outline-none"
        onClick={handleMenuClick}
        style={{ fontSize: "2rem" }}
      >
        <i class="fa-solid fa-list"></i>
      </button>
      <h1 className="text-3xl text-justify font-bold">{title}</h1>
    </header>
  );
};

export default AdminHeader;