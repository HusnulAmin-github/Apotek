import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Phone, User, CreditCard, ShoppingBag, ArrowRight, CheckCircle, Truck } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  total: number;
  promoDiscount: number;
  shippingFee: number;
  onCheckoutSuccess: (order: Order) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  total,
  promoDiscount,
  shippingFee,
  onCheckoutSuccess
}: CheckoutModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const grandTotal = Math.max(0, total - promoDiscount + shippingFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setValidationError('Semua data pengiriman wajib diisi dengan lengkap.');
      return;
    }

    if (phone.length < 9) {
      setValidationError('Silakan masukkan nomor telepon yang valid.');
      return;
    }

    setIsSubmitting(true);

    // Simulate order placement
    setTimeout(() => {
      setIsSubmitting(false);

      const mockOrder: Order = {
        id: 'ORD-' + Math.floor(Math.random() * 9000000 + 1000000),
        fullName,
        phone,
        address,
        paymentMethod,
        items: [...cartItems],
        total: grandTotal,
        date: new Date().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        deliveryStatus: 'Diproses',
        trackingNumber: 'PC-' + Math.floor(Math.random() * 900000000 + 100000000)
      };

      onCheckoutSuccess(mockOrder);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden z-10 border border-neutral-100 dark:border-neutral-800"
          >
            {/* Header banner */}
            <div className="h-2 bg-gradient-to-r from-blue-900 to-teal-500" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                Formulir Checkout
              </h3>

              {validationError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 dark:bg-red-950/25 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/30">
                  {validationError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Side: Form */}
                <form onSubmit={handleSubmit} className="md:col-span-7 space-y-4">
                  <h4 className="font-semibold text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Informasi Pengiriman
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wide">
                      Nama Lengkap Penerima
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wide">
                      Nomor Telepon Aktif
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Misal: 0812XXXXXXXX"
                        className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wide">
                      Alamat Lengkap Pengiriman
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-neutral-400">
                        <MapPin size={16} />
                      </span>
                      <textarea
                        required
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Nama jalan, nomor rumah, RT/RW, kecamatan, dan kota/kabupaten"
                        className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm min-h-[80px]"
                      />
                    </div>
                  </div>

                  <hr className="border-neutral-100 dark:border-neutral-800" />

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2 uppercase tracking-wide">
                      Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`py-2 px-3 text-xs font-semibold border rounded-xl flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                          paymentMethod === 'COD'
                            ? 'bg-blue-50 border-blue-600 text-blue-900 dark:bg-blue-950/20 dark:border-blue-500 dark:text-blue-300'
                            : 'bg-white border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-750 dark:text-neutral-300 hover:bg-neutral-50'
                        }`}
                      >
                        <Truck size={16} />
                        <span>COD (Bayar Saja)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('E-Wallet')}
                        className={`py-2 px-3 text-xs font-semibold border rounded-xl flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                          paymentMethod === 'E-Wallet'
                            ? 'bg-blue-50 border-blue-600 text-blue-900 dark:bg-blue-950/20 dark:border-blue-500 dark:text-blue-300'
                            : 'bg-white border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-750 dark:text-neutral-300 hover:bg-neutral-50'
                        }`}
                      >
                        <CreditCard size={16} />
                        <span>E-Wallet</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('VA')}
                        className={`py-2 px-3 text-xs font-semibold border rounded-xl flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                          paymentMethod === 'VA'
                            ? 'bg-blue-50 border-blue-600 text-blue-900 dark:bg-blue-950/20 dark:border-blue-500 dark:text-blue-300'
                            : 'bg-white border-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:border-neutral-750 dark:text-neutral-300 hover:bg-neutral-50'
                        }`}
                      >
                        <CreditCard size={16} />
                        <span>Virtual Account</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Right Side: Order Summary */}
                <div className="md:col-span-5 bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-550 dark:text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ShoppingBag size={16} />
                      Ringkasan Belanja
                    </h4>

                    {/* Cart Items List */}
                    <div className="space-y-3 max-h-[140px] overflow-y-auto pr-1 mb-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-xs items-center">
                          <span className="text-neutral-750 dark:text-neutral-350 line-clamp-1 max-w-[160px]">
                            {item.product.name}
                          </span>
                          <span className="font-bold text-neutral-550 shrink-0">
                            {item.quantity}x Rp {item.product.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-dashed border-neutral-200 dark:border-neutral-750 pt-3 space-y-2 text-xs">
                      <div className="flex justify-between text-neutral-600 dark:text-neutral-450">
                        <span>Subtotal</span>
                        <span>Rp {total.toLocaleString('id-ID')}</span>
                      </div>
                      {promoDiscount > 0 && (
                        <div className="flex justify-between text-rose-600 font-semibold">
                          <span>Diskon Voucher</span>
                          <span>-Rp {promoDiscount.toLocaleString('id-ID')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-neutral-600 dark:text-neutral-450">
                        <span>Ongkos Kirim</span>
                        <span>
                          {shippingFee === 0 ? 'Gratis' : `Rp ${shippingFee.toLocaleString('id-ID')}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-xs font-semibold text-neutral-500">Total Tagihan</span>
                      <span className="text-lg font-black text-blue-900 dark:text-blue-400">
                        Rp {grandTotal.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Buat Pesanan</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
