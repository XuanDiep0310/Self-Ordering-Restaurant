import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ title, onToggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className="size-20 flex items-center bg-[#124035] text-white px-4 py-3 w-[100%]">
      <button
        className="mr-4 focus:outline-none"
        onClick={onToggleSidebar}
        style={{ fontSize: "2rem" }}
      >
        <i className="fa-solid fa-list"></i>
      </button>
      <h1 className="text-3xl font-bold">{title}</h1>
    </header>
  );
};

export default AdminHeader;
