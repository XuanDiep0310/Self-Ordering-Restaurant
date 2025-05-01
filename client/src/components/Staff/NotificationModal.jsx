import React from "react";

const NotificationModal = ({ notifications, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="relative bg-white text-black rounded-lg w-[600px] max-h-[80vh] overflow-y-auto z-50">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <i className="fas fa-bell text-blue-500"></i>
            <h2 className="text-xl font-bold">Thông báo</h2>
            {notifications.length > 0 && (
              <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-bell-slash text-gray-400 text-4xl mb-4"></i>
              <p className="text-gray-500">Không có thông báo mới</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors"
                >
                  {/* Notification header */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-info-circle text-blue-500"></i>
                      <h3 className="font-semibold">
                        {notification.message}
                      </h3>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Notification content */}
                  {notification.content && (
                    <div className="mt-2 text-gray-600 pl-6">
                      {notification.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;