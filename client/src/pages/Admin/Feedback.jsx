import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import AdminHeader from "../../components/Admin/Admin_header";
import { getReviews } from "../../services/feedbackService";

const Feedback = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const data = await getReviews();
        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        setError("Không thể tải dữ liệu phản hồi");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Filter and sort feedbacks
  const filteredFeedbacks = feedbacks
    .filter(feedback =>
      (ratingFilter === 0 || feedback.rating === ratingFilter) &&
      (searchTerm === "" ||
        (feedback.name && feedback.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (feedback.comment && feedback.comment.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (feedback.orderId && feedback.orderId.toString().includes(searchTerm)))
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createAt) - new Date(a.createAt);
      } else if (sortOrder === "oldest") {
        return new Date(a.createAt) - new Date(b.createAt);
      } else if (sortOrder === "highest") {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle rating filter
  const handleRatingFilter = (rating) => {
    setRatingFilter(rating === ratingFilter ? 0 : rating);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on items per page change
  };

  if (loading) {
    return (
      <div className="min-h-screen background-image flex items-center justify-center">
        <div className="bg-white/20 p-6 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen background-image flex items-center justify-center">
        <div className="bg-red-500/80 text-white p-6 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen background-image">
      <AdminHeader
        title="QUẢN LÝ PHẢN HỒI"
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="px-4 md:px-10 py-6">
        <div className="bg-black/70 rounded-lg shadow-lg p-4 md:p-6">
          {/* Filter and Search Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Search Input */}
              <div className="w-full md:w-1/3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, nội dung..."
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <i className="fa-solid fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
              </div>

              {/* Sort and View Controls */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <select
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={sortOrder}
                  onChange={handleSortChange}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="highest">Đánh giá cao nhất</option>
                  <option value="lowest">Đánh giá thấp nhất</option>
                </select>

                <select
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value={5}>5 mục</option>
                  <option value={10}>10 mục</option>
                  <option value={20}>20 mục</option>
                </select>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white">Lọc theo đánh giá: </span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingFilter(star)}
                  className={`px-3 py-1 rounded-lg flex items-center ${
                    ratingFilter === star
                      ? "bg-yellow-500 text-gray-900"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {star}
                  <i className="fa-solid fa-star ml-1"></i>
                </button>
              ))}
              {ratingFilter > 0 && (
                <button
                  onClick={() => setRatingFilter(0)}
                  className="px-3 py-1 rounded-lg bg-red-500 text-white flex items-center"
                >
                  <i className="fa-solid fa-times mr-1"></i>
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Feedback Results Summary */}
          <div className="mb-4 text-white">
            <p>
              Hiển thị {currentFeedbacks.length} trên tổng số {filteredFeedbacks.length} phản hồi
              {ratingFilter > 0 && ` với ${ratingFilter} sao`}
              {searchTerm && ` có chứa "${searchTerm}"`}
            </p>
          </div>

          {/* Feedbacks List */}
          {currentFeedbacks.length === 0 ? (
            <div className="text-white text-center py-8 bg-gray-800/50 rounded-lg">
              <i className="fa-solid fa-comment-slash text-4xl mb-2"></i>
              <p>Không tìm thấy phản hồi nào</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto h-[460px]">
              {currentFeedbacks.map((feedback, index) => (
                <div
                  key={index}
                  className="bg-[#124035] hover:bg-[#1a5b4b] transition-colors duration-200 text-white rounded-lg p-4 shadow-md"
                >
                  {/* Top Section: Name, Stars, Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-600 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                        {feedback.name ? feedback.name.charAt(0).toUpperCase() : "A"}
                      </div>
                      <span className="font-bold text-lg">
                        {feedback.name || "Ẩn danh"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <div className="flex">
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
                      <span className="text-sm text-gray-300">
                        <i className="fa-regular fa-calendar mr-1"></i>
                        {new Date(feedback.createAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Comment Section */}
                  <div className="bg-white text-black rounded-lg p-4 mt-4 shadow-inner">
                    <p className="text-base whitespace-pre-wrap">{feedback.comment}</p>
                  </div>

                  {/* Order Info if available */}
                  {feedback.orderId && (
                    <div className="mt-3 px-3 py-2 bg-gray-700/50 rounded-lg flex items-center gap-2">
                      <i className="fa-solid fa-receipt text-green-400"></i>
                      <span className="text-sm">
                        Đơn hàng: <span className="font-semibold">#{feedback.orderId}</span>
                        {feedback.tableNumber && (
                          <> - Bàn <span className="font-semibold">{feedback.tableNumber}</span></>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredFeedbacks.length > itemsPerPage && (
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
              <div className="text-white mb-3 sm:mb-0">
                Trang {currentPage} trên {Math.ceil(filteredFeedbacks.length / itemsPerPage)}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  <i className="fa-solid fa-angles-left"></i>
                </button>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  <i className="fa-solid fa-angle-left"></i>
                </button>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, Math.ceil(filteredFeedbacks.length / itemsPerPage)) }).map((_, index) => {
                  // Calculate which page numbers to show
                  let pageNum;
                  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

                  if (totalPages <= 5) {
                    // If there are 5 or fewer pages, just show all pages
                    pageNum = index + 1;
                  } else {
                    // Show pages around current page
                    if (currentPage <= 3) {
                      // Near the start
                      pageNum = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // Near the end
                      pageNum = totalPages - 4 + index;
                    } else {
                      // In the middle
                      pageNum = currentPage - 2 + index;
                    }
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`w-8 h-8 rounded-lg ${
                        currentPage === pageNum
                          ? "bg-green-600 text-white"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredFeedbacks.length / itemsPerPage)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === Math.ceil(filteredFeedbacks.length / itemsPerPage)
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  <i className="fa-solid fa-angle-right"></i>
                </button>
                <button
                  onClick={() => paginate(Math.ceil(filteredFeedbacks.length / itemsPerPage))}
                  disabled={currentPage === Math.ceil(filteredFeedbacks.length / itemsPerPage)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === Math.ceil(filteredFeedbacks.length / itemsPerPage)
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                >
                  <i className="fa-solid fa-angles-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;