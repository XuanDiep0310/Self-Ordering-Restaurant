import React, { useState } from "react";
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
import { Dialog } from "@headlessui/react";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";

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

// Thêm nhiều hóa đơn, tất cả đã thanh toán
const mockInvoices = [
  // Tháng 1
  { id: "HD001", customer: "Nguyễn Văn A", date: "2025-01-05", total: 350000, status: "Đã thanh toán" },
  { id: "HD002", customer: "Trần Thị B", date: "2025-01-12", total: 420000, status: "Đã thanh toán" },
  { id: "HD003", customer: "Lê Văn C", date: "2025-01-20", total: 150000, status: "Đã thanh toán" },
  { id: "HD004", customer: "Phạm Thị D", date: "2025-01-25", total: 500000, status: "Đã thanh toán" },
  // Tháng 2
  { id: "HD005", customer: "Ngô Văn E", date: "2025-02-03", total: 700000, status: "Đã thanh toán" },
  { id: "HD006", customer: "Đặng Thị F", date: "2025-02-10", total: 800000, status: "Đã thanh toán" },
  { id: "HD007", customer: "Bùi Văn G", date: "2025-02-15", total: 600000, status: "Đã thanh toán" },
  { id: "HD008", customer: "Trịnh Thị H", date: "2025-02-25", total: 900000, status: "Đã thanh toán" },
  // Tháng 3
  { id: "HD009", customer: "Lý Văn I", date: "2025-03-01", total: 1000000, status: "Đã thanh toán" },
  { id: "HD010", customer: "Vũ Thị K", date: "2025-03-10", total: 1200000, status: "Đã thanh toán" },
  { id: "HD011", customer: "Nguyễn Văn L", date: "2025-03-15", total: 1100000, status: "Đã thanh toán" },
  { id: "HD012", customer: "Trần Thị M", date: "2025-03-20", total: 950000, status: "Đã thanh toán" },
  // Tháng 4
  { id: "HD013", customer: "Lê Văn N", date: "2025-04-02", total: 1050000, status: "Đã thanh toán" },
  { id: "HD014", customer: "Phạm Thị O", date: "2025-04-10", total: 1150000, status: "Đã thanh toán" },
  { id: "HD015", customer: "Ngô Văn P", date: "2025-04-18", total: 1250000, status: "Đã thanh toán" },
  { id: "HD016", customer: "Đặng Thị Q", date: "2025-04-25", total: 1350000, status: "Đã thanh toán" },
  // Tháng 5
  { id: "HD017", customer: "Bùi Văn R", date: "2025-05-01", total: 1450000, status: "Đã thanh toán" },
  { id: "HD018", customer: "Trịnh Thị S", date: "2025-05-10", total: 1550000, status: "Đã thanh toán" },
  { id: "HD019", customer: "Lý Văn T", date: "2025-05-15", total: 1650000, status: "Đã thanh toán" },
  { id: "HD020", customer: "Vũ Thị U", date: "2025-05-20", total: 1750000, status: "Đã thanh toán" },
  { id: "HD021", customer: "Nguyễn Văn V", date: "2025-05-22", total: 1800000, status: "Đã thanh toán" },
  { id: "HD022", customer: "Trần Thị W", date: "2025-05-25", total: 1900000, status: "Đã thanh toán" },
  { id: "HD023", customer: "Lê Văn X", date: "2025-05-19", total: 2000000, status: "Đã thanh toán" },
  { id: "HD024", customer: "Phạm Thị Y", date: "2025-05-18", total: 2100000, status: "Đã thanh toán" },
];

// Thêm dữ liệu chi tiêu mẫu cho từng tháng
const mockExpenses = [
  // Tháng 1
  { id: "CP001", description: "Nhập nguyên liệu", date: "2025-01-08", total: 200000, month: 1, year: 2025 },
  { id: "CP002", description: "Lương nhân viên", date: "2025-01-28", total: 500000, month: 1, year: 2025 },
  // Tháng 2
  { id: "CP003", description: "Nhập nguyên liệu", date: "2025-02-10", total: 300000, month: 2, year: 2025 },
  { id: "CP004", description: "Lương nhân viên", date: "2025-02-27", total: 600000, month: 2, year: 2025 },
  // Tháng 3
  { id: "CP005", description: "Nhập nguyên liệu", date: "2025-03-12", total: 250000, month: 3, year: 2025 },
  { id: "CP006", description: "Lương nhân viên", date: "2025-03-29", total: 700000, month: 3, year: 2025 },
  // Tháng 4
  { id: "CP007", description: "Nhập nguyên liệu", date: "2025-04-09", total: 400000, month: 4, year: 2025 },
  { id: "CP008", description: "Lương nhân viên", date: "2025-04-28", total: 800000, month: 4, year: 2025 },
  // Tháng 5
  { id: "CP009", description: "Nhập nguyên liệu", date: "2025-05-11", total: 350000, month: 5, year: 2025 },
  { id: "CP010", description: "Lương nhân viên", date: "2025-05-30", total: 900000, month: 5, year: 2025 },
];

// Hàm lấy tháng từ chuỗi ngày (YYYY-MM-DD)
const getMonth = (dateStr) => Number(dateStr.split("-")[1]);
const getYear = (dateStr) => Number(dateStr.split("-")[0]);

// Lấy ngày hiện tại từ hệ thống
const now = new Date();
const currentMonth = now.getMonth() + 1; // getMonth() trả về 0-11
const currentYear = now.getFullYear();
const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
const yesterday = new Date(now);
yesterday.setDate(now.getDate() - 1);
const yesterdayStr = yesterday.toISOString().slice(0, 10);

// Lấy danh sách các năm có trong hóa đơn
const availableYears = Array.from(
  new Set(mockInvoices.map(inv => getYear(inv.date)))
).sort((a, b) => b - a);

const Revenue = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Số đơn hàng hoàn thành trong tháng và năm hiện tại
  const completedOrdersThisMonth = mockInvoices.filter(
    inv =>
      inv.status === "Đã thanh toán" &&
      getMonth(inv.date) === currentMonth &&
      getYear(inv.date) === currentYear
  ).length;

  // Doanh thu hôm nay
  const todayRevenue = mockInvoices
    .filter(
      inv =>
        inv.status === "Đã thanh toán" &&
        inv.date === todayStr
    )
    .reduce((sum, inv) => sum + inv.total, 0);

  // Doanh thu hôm qua
  const yesterdayRevenue = mockInvoices
    .filter(
      inv =>
        inv.status === "Đã thanh toán" &&
        inv.date === yesterdayStr
    )
    .reduce((sum, inv) => sum + inv.total, 0);

  // Tính tổng doanh thu tháng hiện tại (theo selectedYear)
  const monthlyRevenue = mockInvoices
    .filter(
      inv =>
        inv.status === "Đã thanh toán" &&
        getMonth(inv.date) === currentMonth &&
        getYear(inv.date) === selectedYear
    )
    .reduce((sum, inv) => sum + inv.total, 0);

  // Tính doanh thu 12 tháng của năm được chọn
  const monthlyIncome = Array(12).fill(0);
  mockInvoices.forEach(inv => {
    if (inv.status === "Đã thanh toán") {
      const year = getYear(inv.date);
      const month = getMonth(inv.date);
      if (year === selectedYear) {
        monthlyIncome[month - 1] += inv.total;
      }
    }
  });

  // Tổng chi tiêu tháng hiện tại (theo selectedYear)
  const monthlyExpense = mockExpenses
    .filter(
      exp =>
        exp.month === currentMonth &&
        exp.year === selectedYear
    )
    .reduce((sum, exp) => sum + exp.total, 0);

  // Tổng chi tiêu hôm nay
  const todayExpense = mockExpenses
    .filter(
      exp =>
        exp.date === todayStr
    )
    .reduce((sum, exp) => sum + exp.total, 0);

  // Tổng chi tiêu hôm qua
  const yesterdayExpense = mockExpenses
    .filter(
      exp =>
        exp.date === yesterdayStr
    )
    .reduce((sum, exp) => sum + exp.total, 0);

  // Chi tiêu 12 tháng của năm được chọn
  const monthlyExpenseArr = Array(12).fill(0);
  mockExpenses.forEach(exp => {
    if (exp.year === selectedYear) {
      monthlyExpenseArr[exp.month - 1] += exp.total;
    }
  });

  const revenueData = {
    completedOrders: completedOrdersThisMonth,
    todayRevenue: todayRevenue,
    yesterdayRevenue: yesterdayRevenue,
    monthlyIncome: monthlyIncome,
    monthlyRevenue: monthlyRevenue,
  };

  // Dữ liệu cho biểu đồ Tổng quan thu chi tháng này (theo tháng hiện tại)
  const incomeExpenseData = {
    labels: ["Thu nhập", "Chi tiêu"],
    datasets: [
      {
        data: [revenueData.monthlyRevenue, monthlyExpense],
        backgroundColor: ["#4CAF50", "#FF6384"],
        hoverBackgroundColor: ["#45A049", "#FF4D4D"],
      },
    ],
  };

  // Dữ liệu cho biểu đồ Doanh thu nhà hàng (theo năm đã chọn)
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
        label: `Doanh thu (${selectedYear}) (VNĐ)`,
        data: revenueData.monthlyIncome,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: `Chi tiêu (${selectedYear}) (VNĐ)`,
        data: monthlyExpenseArr,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
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

      {/* Nút danh sách hóa đơn và chi tiêu */}
      <div className="flex justify-end px-10 pt-6 space-x-3">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow"
          onClick={() => setOpenInvoiceModal(true)}
        >
          Danh sách hóa đơn
        </button>
        <button
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded shadow"
          onClick={() => setOpenExpenseModal(true)}
        >
          Danh sách chi tiêu
        </button>
      </div>

      {/* Modal danh sách hóa đơn */}
      <Dialog
        open={openInvoiceModal}
        onClose={() => setOpenInvoiceModal(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          {/* Thay Dialog.Overlay bằng div thường */}
          <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true"></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-bold">Danh sách hóa đơn</Dialog.Title>
              <button
                onClick={() => setOpenInvoiceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-3 border">Mã hóa đơn</th>
                    <th className="py-2 px-3 border">Khách hàng</th>
                    <th className="py-2 px-3 border">Ngày</th>
                    <th className="py-2 px-3 border">Tổng tiền</th>
                    <th className="py-2 px-3 border">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3 border">{invoice.id}</td>
                      <td className="py-2 px-3 border">{invoice.customer}</td>
                      <td className="py-2 px-3 border">{invoice.date}</td>
                      <td className="py-2 px-3 border">{invoice.total.toLocaleString()} VNĐ</td>
                      <td className="py-2 px-3 border">
                        <span
                          className={
                            invoice.status === "Đã thanh toán"
                              ? "text-green-600 font-semibold"
                              : "text-red-500 font-semibold"
                          }
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Modal danh sách chi tiêu */}
      <Dialog
        open={openExpenseModal}
        onClose={() => setOpenExpenseModal(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true"></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-bold">Danh sách chi tiêu</Dialog.Title>
              <button
                onClick={() => setOpenExpenseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-3 border">Mã chi tiêu</th>
                    <th className="py-2 px-3 border">Mô tả</th>
                    <th className="py-2 px-3 border">Ngày</th>
                    <th className="py-2 px-3 border">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {mockExpenses
                    .filter(exp => exp.month === currentMonth && exp.year === selectedYear)
                    .map(expense => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="py-2 px-3 border">{expense.id}</td>
                        <td className="py-2 px-3 border">{expense.description}</td>
                        <td className="py-2 px-3 border">{expense.date}</td>
                        <td className="py-2 px-3 border">{expense.total.toLocaleString()} VNĐ</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Dialog>

      <div className="px-10 py-6">
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Completed Orders */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <h2 className="text-4xl font-bold">{revenueData.completedOrders}</h2>
            <p className="text-lg text-gray-600">
              Đơn hàng đã hoàn thành trong tháng {currentMonth}/{currentYear}
            </p>
          </div>

          {/* Today's Revenue */}
          <div className="bg-blue-500 text-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <h2 className="text-4xl font-bold">{revenueData.todayRevenue.toLocaleString()} VNĐ</h2>
            <p className="text-lg">Doanh thu hôm nay</p>
          </div>

          {/* Yesterday's Revenue */}
          <div className="bg-green-500 text-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <h2 className="text-4xl font-bold">{revenueData.yesterdayRevenue.toLocaleString()} VNĐ</h2>
            <p className="text-lg">Doanh thu hôm qua</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Monthly Income vs Expense */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Tổng quan thu chi tháng này</h3>
            <div className="h-64">
              <Pie data={incomeExpenseData} />
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Doanh thu nhà hàng</h3>
              <div>
                <label className="mr-2 font-medium">Năm:</label>
                <select
                  className="border rounded px-2 py-1"
                  value={selectedYear}
                  onChange={e => setSelectedYear(Number(e.target.value))}
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
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