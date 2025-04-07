import React from "react";

const CartActions = ({ quantity, onIncrease, onDecrease, onAddToCart }) => {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-md flex justify-between items-center z-10">
            <div className="flex items-center">
                <button
                    className="text-2xl px-4 py-2 border rounded-lg"
                    onClick={onDecrease} // Giảm số lượng
                >
                    -
                </button>
                <span className="mx-4">{quantity}</span>
                <button
                    className="text-2xl px-4 py-2 border rounded-lg"
                    onClick={onIncrease} // Tăng số lượng
                >
                    +
                </button>
            </div>
            <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                onClick={onAddToCart} // Thêm vào giỏ hàng
            >
                Thêm vào giỏ hàng
            </button>
        </div>
    );
};

export default CartActions;