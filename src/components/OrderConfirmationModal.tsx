'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { ordersAPI, type CreateOrderParams } from '@/lib/api/orders';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: CreateOrderParams;
  currentPrice?: number;
  onSuccess?: (order: any) => void;
}

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  orderData,
  currentPrice = 0,
  onSuccess,
}: OrderConfirmationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await ordersAPI.createOrder(orderData);

      if (response.success && response.order) {
        setSuccess(true);
        onSuccess?.(response.order);

        // Close modal after 1.5 seconds
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 1500);
      } else {
        setError(response.message || 'Failed to place order');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onClose();
      setError(null);
      setSuccess(false);
    }
  };

  const isBuy = ['BUY', 'LONG'].includes(orderData.side);
  const total = orderData.price
    ? orderData.price * orderData.amount
    : currentPrice * orderData.amount;

  const estimatedFee = total * 0.001; // 0.1% fee
  const totalWithFee = total + estimatedFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className={`p-6 border-b border-white/10 ${
              isBuy ? 'bg-green-500/10' : 'bg-red-500/10'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {isBuy ? (
                    <TrendingUp className="text-green-500" size={24} />
                  ) : (
                    <TrendingDown className="text-red-500" size={24} />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Confirm {orderData.type} {orderData.side}
                    </h3>
                    <p className="text-sm text-gray-400">{orderData.pair}</p>
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="p-1 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                >
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-green-400 font-medium">Order placed successfully!</span>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <AlertCircle className="text-red-500" size={20} />
                  <span className="text-red-400 text-sm">{error}</span>
                </motion.div>
              )}

              {/* Order Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Order Type</span>
                  <span className="font-semibold text-white">{orderData.type}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Side</span>
                  <span className={`font-semibold ${
                    isBuy ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {orderData.side}
                  </span>
                </div>

                {orderData.price && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price</span>
                    <span className="font-semibold text-white">
                      ${orderData.price.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount</span>
                  <span className="font-semibold text-white">
                    {orderData.amount} {orderData.pair.replace(/USDT|USD|BUSD/, '')}
                  </span>
                </div>

                {orderData.leverage && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Leverage</span>
                    <span className="font-semibold text-purple-400">
                      {orderData.leverage}x
                    </span>
                  </div>
                )}

                {orderData.stopLossPrice && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Stop Loss</span>
                    <span className="font-semibold text-red-400">
                      ${orderData.stopLossPrice.toLocaleString()}
                    </span>
                  </div>
                )}

                {orderData.takeProfitPrice && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Take Profit</span>
                    <span className="font-semibold text-green-400">
                      ${orderData.takeProfitPrice.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Total</span>
                    <span className="font-semibold text-white">
                      ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">Est. Fee (0.1%)</span>
                    <span className="text-sm text-gray-400">
                      ${estimatedFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="font-semibold text-white">Total Cost</span>
                    <span className="font-bold text-xl text-white">
                      ${totalWithFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting || success}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 ${
                  isBuy
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Placing Order...</span>
                  </div>
                ) : success ? (
                  'Success!'
                ) : (
                  `Confirm ${orderData.side}`
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
