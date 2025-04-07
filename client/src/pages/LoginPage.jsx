import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import RestaurantBanner from "../assets/images/restaurant-banner.jpg";
import Logo from "../assets/images/logo.png";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(username, password);

    if (result.success) {
      // Chuyển hướng dựa trên vai trò người dùng
      if (result.role === "ADMIN") {
        navigate("/admin");
      } else if (result.role === "STAFF") {
        navigate("/staff");
      } else {
        setError("Vai trò người dùng không hợp lệ! Trang này chỉ dành cho admin và nhân viên.");
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex h-screen justify-between">
      <div className="w-1/2">
        <img
          src={RestaurantBanner}
          alt="Food Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-[#124035]">
        <img src={Logo} alt="Logo" className="w-64 h-[45%]" />

        <div className="w-2/3 h-[55%]">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="User name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 p-6 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-[#fff]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-6 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-[#fff]"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#737373] text-white p-6 rounded hover:bg-black/60 cursor-pointer"
            >
              ĐĂNG NHẬP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;