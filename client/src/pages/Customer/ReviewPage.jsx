import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";

const ReviewPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(5); // Mặc định 5 sao
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Xử lý gửi đánh giá (có thể gửi đến API)
        console.log("Tên:", name);
        console.log("Đánh giá:", review);
        console.log("Số sao:", rating);

        // Hiển thị thông báo thành công
        setSuccess(true);

        // Ẩn thông báo sau 2 giây và quay lại trang chủ
        setTimeout(() => {
            setSuccess(false);
            navigate("/");
        }, 2000);
    };

    return (
        <div className="max-w-sm mx-auto bg-gray-100 min-h-screen ">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-md">
                <button
                    className="text-white text-lg"
                    onClick={() => navigate(-1)} // Quay lại trang trước
                >
                    &#8592; Quay lại
                </button>
                <h1 className="font-bold text-lg">Đánh giá</h1>
            </div>

            {/* Form đánh giá */}
            <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                <img src={Logo} alt="Logo" className="w-20 mx-auto mb-4" />
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`text-2xl cursor-pointer ${star <= rating ? "text-yellow-500" : "text-gray-300"
                                    }`}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Tên:</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded-lg"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Đánh giá:</label>
                        <textarea
                            className="w-full border p-2 rounded-lg"
                            rows="4"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 rounded-lg"
                    >
                        Gửi
                    </button>
                </form>
            </div>

            {/* Thông báo thành công */}
            {success && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <div className="text-green-500 text-4xl mb-4">✔</div>
                        <p className="text-sm font-semibold">Gửi đánh giá thành công</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewPage;