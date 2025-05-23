import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdminHeader from "../../components/Admin/Admin_header";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Revenue = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dữ liệu cứng (mock data)
  const revenueData = {
    completedOrders: 120,
    todayExpense: 500,
    yesterdayExpense: 450,
    monthlyIncome: [
      1000, 1200, 1500, 2000, 1800, 2200, 2500, 2700, 3000, 3200, 3500, 4000,
    ],
    monthlyRevenue: 35000,
  };

  // Dữ liệu cho biểu đồ Tổng quan thu chi tháng này
  const incomeExpenseData = {
    labels: ["Thu nhập", "Chi tiêu"],
    datasets: [
      {
        data: [revenueData.monthlyRevenue, revenueData.todayExpense * 30],
        backgroundColor: ["#4CAF50", "#FF6384"],
        hoverBackgroundColor: ["#45A049", "#FF4D4D"],
      },
    ],
  };

  // Dữ liệu cho biểu đồ Doanh thu nhà hàng
  const monthlyIncomeData = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: revenueData.monthlyIncome,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen background-image">
      <AdminHeader
        title="QUẢN LÝ DOANH THU"
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="px-10 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tổng quan doanh thu</h2>
          <button
            onClick={() => navigate("/admin/payment-history")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Xem lịch sử hóa đơn
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Completed Orders */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <h2 className="text-4xl font-bold">
              {revenueData.completedOrders}
            </h2>
            <p className="text-lg text-gray-600">Đơn hàng đã hoàn thành</p>
          </div>

          {/* Today's Expense */}
          <div className="bg-blue-500 text-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <h2 className="text-4xl font-bold">${revenueData.todayExpense}</h2>
            <p className="text-lg">Chi tiêu hôm nay</p>
          </div>

          {/* Yesterday's Expense */}
          <div className="bg-green-500 text-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <h2 className="text-4xl font-bold">
              ${revenueData.yesterdayExpense}
            </h2>
            <p className="text-lg">Chi tiêu hôm qua</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Monthly Income vs Expense */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">
              Tổng quan thu chi tháng này
            </h3>
            <div className="h-64">
              <Pie data={incomeExpenseData} />
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Doanh thu nhà hàng</h3>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Download CSV
              </button>
            </div>
            <div className="h-64">
              <Bar data={monthlyIncomeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
