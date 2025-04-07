import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderDetail = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white shadow-md p-4 sticky top-0 left-0 w-full z-10 flex items-center justify-between">
            <button
                className="text-gray-500 text-lg"
                onClick={() => navigate(-1)} // Quay lại trang trước
            >
                &#8592; Quay lại
            </button>
            <h1 className="font-bold text-lg">Chi tiết món ăn</h1>
        </div>
    );
};

export default HeaderDetail;