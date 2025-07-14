// VoucherInput.js - Component for voucher input and validation

import React, { useState } from 'react';
import { validateVoucher } from '@/utils/voucherUtils';

const VoucherInput = ({
    appliedVoucher,
    onVoucherApply,
    onVoucherRemove,
    orderAmount,
    disabled = false
}) => {
    const [voucherCode, setVoucherCode] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) {
            setValidationMessage('Please enter a voucher code');
            setMessageType('error');
            return;
        }

        setIsValidating(true);
        setValidationMessage('');

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const result = validateVoucher(voucherCode, orderAmount);

        if (result.success) {
            onVoucherApply(result.voucher);
            setValidationMessage(result.message);
            setMessageType('success');
            setVoucherCode('');
        } else {
            setValidationMessage(result.message);
            setMessageType('error');
        }

        setIsValidating(false);
    };

    const handleRemoveVoucher = () => {
        onVoucherRemove();
        setValidationMessage('');
        setMessageType('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleApplyVoucher();
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-white">Voucher Code</h3>
                {appliedVoucher && (
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                        {appliedVoucher.code}
                    </span>
                )}
            </div>

            {!appliedVoucher ? (
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter voucher code"
                        disabled={disabled || isValidating}
                        className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-white/40 disabled:opacity-50"
                    />
                    <button
                        type="button"
                        onClick={handleApplyVoucher}
                        disabled={disabled || isValidating || !voucherCode.trim()}
                        className="w-full px-4 py-2 text-sm bg-blue-500/70 hover:bg-blue-500/80 text-white rounded-md border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isValidating ? 'Applying...' : 'Apply'}
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-md p-3">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-green-300">{appliedVoucher.name}</p>
                        <p className="text-xs text-green-400">{appliedVoucher.description}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemoveVoucher}
                        disabled={disabled}
                        className="text-red-300 hover:text-red-200 text-sm underline disabled:opacity-50"
                    >
                        Remove
                    </button>
                </div>
            )}

            {validationMessage && (
                <div className={`text-xs p-2 rounded ${messageType === 'success'
                        ? 'bg-green-500/10 text-green-300 border border-green-500/30'
                        : 'bg-red-500/10 text-red-300 border border-red-500/30'
                    }`}>
                    {validationMessage}
                </div>
            )}
        </div>
    );

};

export default VoucherInput;