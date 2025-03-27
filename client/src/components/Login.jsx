import React from "react";
import RestaurantBanner from "../assets/images/restaurant-banner.png";
import Logo from "../assets/images/logo.png";

const Login = () => {
  return (
    <div className="flex h-screen justify-between">
      <div className="w-1/2">
        <img
          src={RestaurantBanner}
          alt="Food Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center bg-[#dbdbdb]">
        <img src={Logo} alt="Logo" className="w-64 h-[45%]" />

        <div className="w-2/3 h-[55%]">
          <input
            type="text"
            placeholder="User name"
            className="w-full border border-gray-300 p-6 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-[#fff]"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-6 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-[#fff]"
          />
          <button className="w-full bg-[#464646] text-white p-6 rounded hover:bg-black/80 cursor-pointer">
            ĐĂNG NHẬP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
