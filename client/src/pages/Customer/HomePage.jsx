import React, { useState } from "react";
import Logo from "../../assets/images/logo.png";
import food from "../../assets/images/food.png";
import { useNavigate } from "react-router-dom";

const ActionButtons = () => {
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false); // Trạng thái hiển thị thông báo

    const handleCallStaff = () => {
        setShowAlert(true); // Hiển thị thông báo
        setTimeout(() => {
            setShowAlert(false); // Ẩn thông báo sau 2 giây
        }, 2000);
    };

    return (
        <div className="mt-4 space-y-2">
            <button
                className="w-full h-20 bg-gradient-to-r from-yellow-400 to-orange-500 py-2 rounded-lg text-black font-semibold transition-transform transform hover:scale-105 active:scale-95"
                onClick={() => navigate("/menu")}
            >
                XEM MENU - GỌI MÓN
            </button>
            <div className="grid grid-cols-3 gap-2 mt-4">
                <button
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 py-2 rounded-lg text-black h-20 transition-transform transform hover:scale-105 active:scale-95"
                    onClick={() => navigate("/order")} // Chuyển hướng sang trang Đơn hàng
                >
                    Thanh toán
                </button>
                <button
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 py-2 rounded-lg text-black transition-transform transform hover:scale-105 active:scale-95"
                    onClick={handleCallStaff} // Hiển thị thông báo gọi nhân viên
                >
                    Gọi nhân viên
                </button>
                <button
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 py-2 rounded-lg text-black transition-transform transform hover:scale-105 active:scale-95"
                    onClick={() => navigate("/review")} // Chuyển hướng sang trang Đánh giá
                >
                    Đánh giá
                </button>
            </div>

            {/* Thông báo gọi nhân viên */}
            {showAlert && (
                <div className="fixed inset-0  bg-[rgba(0,0,0,0.5)]  flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg font-semibold mb-4">Vui lòng đợi trong giây lát</p>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-lg"
                            onClick={() => setShowAlert(false)} // Đóng thông báo
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Header = () => (
    <div className="text-center">
        <img src={Logo} alt="Logo" className="w-20 mx-auto " />
    </div>
);

const FoodMenu = () => (
    <img src={food} alt="Food" className="w-170 mx-auto " />
);

const TableInfo = () => (
    <div className="text-center font-bold text-lg">BÀN : 01</div>
);

const Footer = () => (
    <div className="text-center text-sm mt-4">
        <p>Địa chỉ: Lê Văn Việt - TP Thủ Đức</p>
        <p>SDT: 0389379012</p>
    </div>
);

const HomePage = () => {
    return (
        <div className="max-w-sm mx-auto p-4 rounded-lg shadow-lg">
            <Header />
            <FoodMenu />
            <TableInfo />
            <ActionButtons />
            <Footer />
        </div>
    );
};

export default HomePage;