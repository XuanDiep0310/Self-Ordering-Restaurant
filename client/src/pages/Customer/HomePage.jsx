import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/logo.png";
import food from "../../assets/images/food.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getTableByNumber } from "../../services/tableService";
import { sendNotification } from "../../services/notificationService";

const ActionButtons = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tableNumber = searchParams.get("tableNumber");
    const [showAlert, setShowAlert] = useState(false);

    const handleCallStaff = async () => {
        if (!tableNumber) {
            alert("Không tìm thấy thông tin bàn. Vui lòng thử lại!");
            return;
        }

        try {
            await sendNotification({
                table_number: tableNumber,
                title: "Yêu cầu hỗ trợ",
                content: `Khách hàng ở bàn ${tableNumber} cần sự hỗ trợ từ nhân viên.`,
                type: "TableRequest",
            });

            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
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
                onClick={() => navigate(`/menu?tableNumber=${tableNumber}`)}
            >
                XEM MENU - GỌI MÓN
            </button>
            <div className="grid grid-cols-3 gap-2 mt-4">
                <button
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 py-2 rounded-lg text-black h-20"
                    onClick={() => navigate(`/order?tableNumber=${tableNumber}`)}
                >
                    Thanh toán
                </button>
                <button
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 py-2 rounded-lg text-black transition-transform transform hover:scale-105 active:scale-95"
                    onClick={handleCallStaff}
                >
                    Gọi nhân viên
                </button>
                <button
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 py-2 rounded-lg text-black"
                    onClick={() => navigate(`/review?tableNumber=${tableNumber}`)}
                >
                    Đánh giá
                </button>
            </div>

            {showAlert && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg font-semibold mb-4">Vui lòng đợi trong giây lát</p>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-lg"
                            onClick={() => setShowAlert(false)}
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
    const [searchParams] = useSearchParams();
    const tableNumber = searchParams.get("tableNumber");
    const [table, setTable] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTableInfo = async () => {
            if (!tableNumber) {
                return;
            }

            try {
                setLoading(true);
                const data = await getTableByNumber(tableNumber);
                setTable(data);
            } catch (error) {
                console.error("Error fetching table info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTableInfo();
    }, [tableNumber]);

    if (loading) {
        return <div className="text-center">Đang tải thông tin bàn...</div>;
    }

    if (!table) {
        return (
            <div className="text-center text-red-500 font-semibold">
                Không tìm thấy thông tin bàn. Vui lòng kiểm tra lại URL!
            </div>
        );
    }

    return (
        <div className="text-center font-bold text-lg">
            BÀN: {table.tableNumber}
            <p>Sức chứa: {table.capacity}</p>
            <p>Trạng thái: {table.status}</p>
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