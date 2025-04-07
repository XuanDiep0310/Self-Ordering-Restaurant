import React from "react";

const FoodDetails = ({ name, price }) => {
    return (
        <div className=" p-4 rounded-lg mt-4">
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-gray-500 mt-2">{price.toLocaleString()}Đ</p>
        </div>
    );
};

export default FoodDetails;