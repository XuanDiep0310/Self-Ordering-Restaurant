import React from "react";

const FoodImageDetail = ({ image, name }) => {
    return (
        <div className="text-center mt-4">
            <img
                src={image}
                alt={name}
                className="w-64 h-64 object-cover rounded-lg mx-auto"
            />
        </div>
    );
};


export default FoodImageDetail;