import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import Sidebar from "./Sidebar";
import AdminHeader from "../../components/Admin/Admin_header";

const Feedback = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // useEffect(() => {
  //   const fetchFeedbacks = async () => {
  //     try {
  //       const response = await axiosInstance.get("/api/customer/feedback");
  //       setFeedbacks(response.data);
  //     } catch (error) {
  //       console.error("Error fetching feedbacks:", error);
  //     }
  //   };

  //   fetchFeedbacks();
  // }, []);

  return (
    <div className="min-h-screen background-image">
      <AdminHeader
        title="QUẢN LÝ PHẢN HỒI"
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* <div className="px-10 py-6">
        <div className="bg-black/70 rounded-lg p-6">
          {feedbacks.map((feedback, index) => (
            <div
              key={index}
              className="bg-[#124035] text-white rounded-lg p-4 mb-4 flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span className="font-bold text-lg">{feedback.customerName || "Ẩn danh"}</span>
                <p className="text-base mt-2">{feedback.comment}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <i
                      key={starIndex}
                      className={`fa-solid fa-star ${
                        starIndex < feedback.rating ? "text-yellow-400" : "text-gray-400"
                      }`}
                    ></i>
                  ))}
                </div>
                <span className="text-sm mt-2">{feedback.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Feedback;