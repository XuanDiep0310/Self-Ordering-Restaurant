import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PaymentSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const tableNumber = params.get("tableNumber") || "";
    const responseCode = params.get("vnp_ResponseCode");
    const transactionStatus = params.get("vnp_TransactionStatus");
    const isSuccess = responseCode === "00" && transactionStatus === "00";

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(`/customer?tableNumber=${tableNumber}`);
        }, 10000);
        return () => clearTimeout(timer);
    }, [navigate, tableNumber]);

    const handleClose = () => {
        navigate(`/customer?tableNumber=${tableNumber}`);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                <div className="flex justify-center mb-4">
                    <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                        <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="12" fill="#34D399" />
                            <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                    {isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"}
                </h2>
                <p className="text-gray-700 mb-6">
                    {isSuccess
                        ? "Đơn hàng của quý khách đã thanh toán thành công.\nChúng tôi sẽ sớm liên hệ với quý khách để bàn giao sản phẩm, dịch vụ."
                        : "Thanh toán thất bại hoặc bị huỷ. Vui lòng thử lại."}
                </p>
                <button
                    className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
                    onClick={handleClose}
                >
                    Đóng
                </button>
                <p className="text-xs text-gray-400 mt-4">
                    Tự động chuyển về trang chủ sau 10 giây...
                </p>
            </div>
        </div>
    );
}

export default PaymentSuccess;