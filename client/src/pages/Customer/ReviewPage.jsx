import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import { sendFeedback } from "../../services/feedbackService";

const ReviewPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("tableNumber");
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Kiểm tra tableNumber khi component mount
  useEffect(() => {
    if (!tableNumber) {
      setError("Không tìm thấy thông tin bàn. Vui lòng quét lại mã QR.");
    }
  }, [tableNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Kiểm tra tableNumber
      if (!tableNumber) {
        setError("Không tìm thấy thông tin bàn");
        setLoading(false);
        return;
      }

      // Kiểm tra nội dung đánh giá
      if (!review.trim()) {
        setError("Vui lòng nhập nội dung đánh giá");
        setLoading(false);
        return;
      }

      // Tạo comment với format: [Name: xxx] actual comment
      const userName = name.trim() || "Khách hàng ẩn danh";
      const formattedComment = `[Name: ${userName}] ${review.trim()}`;

      const feedbackData = {
        tableNumber: parseInt(tableNumber, 10),
        rating: rating,
        comment: formattedComment
      };

      console.log("Sending feedback data:", feedbackData);

      // Gửi đánh giá
      await sendFeedback(feedbackData);

      // Hiển thị thông báo thành công
      setSuccess(true);
      setLoading(false);

      // Ẩn thông báo và điều hướng
      setTimeout(() => {
        setSuccess(false);
        navigate(`/customer?tableNumber=${tableNumber}`);
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error("Error submitting feedback:", error);

      // Xử lý các trường hợp lỗi khác nhau
      if (!navigator.onLine) {
        setError("Không có kết nối mạng. Vui lòng kiểm tra kết nối và thử lại.");
      } else if (error.response?.status === 500) {
        setError("Lỗi máy chủ. Vui lòng thử lại sau.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center h-[10%] justify-between p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg shadow-md">
        <button
          className="text-white text-lg"
          onClick={() => navigate(-1)}
        >
          &#8592; Quay lại
        </button>
        <h1 className="font-bold text-lg">Đánh giá</h1>
        <div className="w-8"></div> {/* Placeholder cho cân đối layout */}
      </div>

      {/* Form đánh giá */}
      <div className="bg-white p-4 rounded-lg m-4 shadow-md">
        <img src={Logo} alt="Logo" className="w-30 h-auto mx-auto mb-4" />

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
            <span className="mr-2">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-3xl cursor-pointer mx-1 ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Tên:</label>
            <input
              type="text"
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring focus:border-yellow-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên của bạn (không bắt buộc)"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Đánh giá:</label>
            <textarea
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring focus:border-yellow-500"
              rows="4"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Hãy chia sẻ trải nghiệm của bạn..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
            } text-white py-3 rounded-lg font-bold transition duration-300 flex justify-center items-center`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang gửi...
              </>
            ) : (
              "Gửi đánh giá"
            )}
          </button>
        </form>
      </div>

      {/* Thông báo thành công */}
      {success && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-green-500 text-4xl mb-4">✔</div>
            <p className="text-gray-800 font-semibold">Cảm ơn bạn đã gửi đánh giá!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;