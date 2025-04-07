import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logo.png";
import food from "../../assets/images/food.png";
import { useNavigate, useParams } from "react-router-dom";
import { getTableByNumber } from "../../services/tableService";
import { sendNotification } from "../../services/notificationService"; // Import hàm gửi thông báo

const ActionButtons = () => {
    const navigate = useNavigate();
    const { tableId } = useParams();
    const [showAlert, setShowAlert] = useState(false); // State để hiển thị thông báo


    const handleCallStaff = async () => {
        if (!tableId) {
            alert("Không tìm thấy thông tin bàn. Vui lòng thử lại!");
            return;
        }

        try {
            // Gửi thông báo vào cơ sở dữ liệu
            await sendNotification({
                table_number: tableId,
                title: "Yêu cầu hỗ trợ",
                content: `Khách hàng ở bàn ${tableId} cần sự hỗ trợ từ nhân viên.`,
                type: "TableRequest",
            });

            setShowAlert(true); // Hiển thị thông báo thành công
            setTimeout(() => {
                setShowAlert(false); // Ẩn thông báo sau 2 giây
            }, 2000);
        } catch (error) {
            console.error("Error sending notification:", error);
            alert("Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại!");
        }
    };

    return (
        <div className="mt-2 space-y-2 p-4">
            <button
                className="w-full h-20 bg-gradient-to-r from-yellow-400 to-orange-500 py-2 rounded-lg text-black font-semibold"
                onClick={() => navigate("/menu", { state: { tableId } })}
            >
                XEM MENU - GỌI MÓN
            </button>
            <div className="grid grid-cols-3 gap-2 mt-4">
                <button
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 py-2 rounded-lg text-black h-20"
                    onClick={() => navigate(`/order/${tableId}`)}
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
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 py-2 rounded-lg text-black"
                    onClick={() => navigate("/review", { state: { tableId } })}
                >
                    Đánh giá
                </button>
            </div>

            {/* Thông báo gọi nhân viên */}
            {showAlert && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
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
        <img src={Logo} alt="Logo" className="w-20 mx-auto mt-10" />
    </div>
);

const FoodMenu = () => (
    <img src={food} alt="Food" className="w-170 mx-auto" />
);

const TableInfo = () => {
    const { tableId } = useParams();
    const [table, setTable] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTableInfo = async () => {
            try {
                const data = await getTableByNumber(tableId);
                setTable(data);
            } catch (err) {
                console.error("Error fetching table info:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTableInfo();
    }, [tableId]);

    if (loading) return <div className="text-center">Đang tải thông tin bàn...</div>;

    if (!table) {
        return <div className="text-center text-red-500">Không tìm thấy thông tin bàn!</div>;
    }

    return (
        <div className="text-center font-bold text-lg">
            BÀN: {table?.id} 
        </div>
    );
};

const Footer = () => (
    <div className="text-center text-sm mt-4">
        <p>Địa chỉ: Lê Văn Việt - TP Thủ Đức</p>
        <p>SDT: 0389379012</p>
    </div>
);

const HomePage = () => {
    return (
        <div className="mx-auto rounded-lg h-screen bg-white flex flex-col justify-between">
            <Header />
            <FoodMenu />
            <TableInfo />
            <ActionButtons />
            <Footer />
        </div>
    );
};

export default HomePage;