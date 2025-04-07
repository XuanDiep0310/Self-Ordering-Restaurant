import React from "react";

const CustomerNote = ({ note, setNote }) => {
    return (
        <div className=" p-4 rounded-lg ">
            <label className="block text-sm font-bold mb-2">Lời nhắn:</label>
            <textarea
                className="w-full border p-2 rounded-lg"
                rows="4"
                value={note}
                onChange={(e) => setNote(e.target.value)} // Cập nhật lời nhắn
                placeholder="Nhập lời nhắn cho nhà bếp..."
            ></textarea>
        </div>
    );
};

export default CustomerNote;