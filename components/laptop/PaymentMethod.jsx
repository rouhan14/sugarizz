"use client";

import React from "react";

const PaymentMethod = ({ selected, onChange, isOrderingTime = true }) => {
    const optionClasses = (isActive) =>
        `border border-gray-300 rounded-md p-4 transition-all duration-200 ${isOrderingTime
            ? isActive
                ? "bg-green-50 border-green-400"
                : "bg-white hover:bg-gray-50"
            : "bg-gray-100 cursor-not-allowed"
        }`;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                Payment Method
            </h2>

            <div className="flex flex-col gap-3">
                {/* Cash on Delivery */}
                <div
                    className={optionClasses(selected === "cod")}
                    onClick={() => onChange("cod")}
                >
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="payment"
                            value="cod"
                            checked={selected === "cod"}
                            onChange={() => onChange("cod")} // keep this for accessibility
                            disabled={!isOrderingTime}
                            className="w-4 h-4 accent-green-500"
                        />
                        <span className="font-medium text-gray-800">Cash on Delivery</span>
                    </label>
                </div>

                {/* Online Payment */}
                <div className={optionClasses(selected === "online")} onChange={() => onChange("online")}>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="payment"
                            value="online"
                            checked={selected === "online"}
                            disabled={!isOrderingTime}
                            className="w-4 h-4 accent-green-500"
                        />
                        <span className="font-medium text-gray-800">
                            Online Payment – <span className="text-green-600">10% off</span>
                        </span>
                    </label>

                    {/* Expand Card Info */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${selected === "online" ? "max-h-40 mt-4" : "max-h-0"
                            }`}
                    >
                        <div className="pl-7 text-sm text-gray-700 space-y-1">
                            <div>
                                <span className="font-semibold">Account Number:</span>{" "}
                                03160574308
                            </div>
                            <div>
                                <span className="font-semibold">Bank:</span>{" "}
                                EasyPaisa
                            </div>
                            <div>
                                <span className="font-semibold">Name:</span>{" "}
                                Abdur Rehman
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethod;
