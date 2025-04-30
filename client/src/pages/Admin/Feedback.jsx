import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AdminHeader from "../../components/Admin/Admin_header";

const Feedback = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hardcoded feedback data
  const feedbacks = [
    {
      customerName: "Lương Thị Kim Ngân",
      comment: "Tuyệt",
      rating: 5,
      date: "2025-03-11",
    },
    {
      customerName: "Ẩn danh",
      comment: "Không ngon",
      rating: 2,
      date: "2025-03-11",
    },
  ];

  return (
    <div className="min-h-screen background-image">
      <AdminHeader
        title="QUẢN LÝ PHẢN HỒI"
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="px-10 py-6">
        <div className="bg-black/70 rounded-lg p-6">
          {feedbacks.map((feedback, index) => (
            <div
              key={index}
              className="bg-[#124035] text-white rounded-lg p-4 mb-4"
            >
              {/* Top Section: Name, Stars, Date */}
              <div className="flex items-center">
                <span className="font-bold text-lg">{feedback.customerName || "Ẩn danh"}</span>
                <div className="flex-grow flex justify-center">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <i
                      key={starIndex}
                      className={`fa-solid fa-star ${
                        starIndex < feedback.rating
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    ></i>
                  ))}
                </div>
                <span className="text-sm">{feedback.date}</span>
              </div>

              {/* Bottom Section: Comment */}
              <div className="bg-white text-black rounded-lg p-9 mt-4">
                <p className="text-base">{feedback.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feedback;