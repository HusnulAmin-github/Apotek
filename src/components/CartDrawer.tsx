import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, Ticket, Check } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  promoDiscount: number;
  promoCode: string;
  onApplyPromo: (code: string) => { success: boolean; message: string };
  shippingFee: number;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  promoDiscount,
  promoCode,
  onApplyPromo,
  shippingFee
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const grandTotal = Math.max(0, subtotal - promoDiscount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const result = onApplyPromo(promoInput.trim().toUpperCase());
    if (result.success) {
      setPromoMessage({ type: 'success', text: result.message });
    } else {
      setPromoMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Cover the full viewport index */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/55 backdrop-blur-xs transition-opacity cursor-pointer"
              onClick={onClose}
            />

            {/* Slider panel content */}
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                className="pointer-events-auto w-screen max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col h-full border-l border-neutral-100 dark:border-neutral-800"
              >
                {/* Header panel */}
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="text-blue-900 dark:text-blue-400" size={22} />
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-white">
                      Keranjang Belanja
                    </h3>
                    <span className="bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full text-xs">
                      {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  </div>

                  <button
                    onClick={onClose}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-full cursor-pointer transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Items container body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none">
                      <div className="p-4 bg-neutral-50 dark:bg-neutral-850 rounded-full border border-neutral-100 dark:border-transparent text-neutral-400 mb-4">
                        <ShoppingBag size={40} />
                      </div>
                      <h4 className="font-bold text-neutral-800 dark:text-white">Keranjang Kosong</h4>
                      <p className="text-xs text-neutral-450 max-w-[200px] mt-1 line-clamp-2">
                        Sepertinya Anda belum memasukkan produk kesehatan apapun.
                      </p>
                      <button
                        onClick={onClose}
                        className="mt-5 text-xs font-bold text-blue-800 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Mulai Belanja Sekarang
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-3 p-3 bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800 rounded-2xl relative"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 object-contain bg-white dark:bg-neutral-900 rounded-xl p-1 shrink-0"
                          />

                          <div className="flex-1 min-w-0 pr-6">
                            <h4 className="text-xs font-bold text-neutral-850 dark:text-white line-clamp-2 leading-tight">
                              {item.product.name}
                            </h4>
                            <p className="text-[10px] text-[#22C55E] font-medium leading-normal mt-0.5">
                              {item.product.apotek}
                            </p>
                            <p className="text-xs font-black text-neutral-800 dark:text-neutral-200 mt-1.5">
                              Rp {item.product.price.toLocaleString('id-ID')}
                            </p>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 transition-colors p-1 rounded-full cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>

                          <div className="absolute bottom-3 right-3 flex items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-750 rounded-lg shadow-2xs overflow-hidden">
                            <button
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="p-1 px-2 text-neutral-450 hover:bg-neutral-55 cursor-pointer dark:hover:bg-neutral-800"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="px-2 text-xs font-bold font-mono text-neutral-800 dark:text-neutral-250 border-x border-neutral-150 dark:border-neutral-750">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1 px-2 text-neutral-450 hover:bg-neutral-55 cursor-pointer dark:hover:bg-neutral-800"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer and Price total details overlay */}
                {cartItems.length > 0 && (
                  <div className="border-t border-neutral-100 dark:border-neutral-800 p-6 space-y-4">
                    {/* Promo coupon code form */}
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                          <Ticket size={16} />
                        </span>
                        <input
                          type="text"
                          placeholder="Kode Kupon: PHARMA10 / FREEKIR"
                          value={promoInput}
                          onChange={(e) => {
                            setPromoInput(e.target.value);
                            setPromoMessage(null);
                          }}
                          className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-bold uppercase"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-neutral-900 hover:bg-neutral-950 dark:bg-neutral-800 dark:hover:bg-neutral-750 font-semibold text-white px-3.5 rounded-xl text-xs flex items-center justify-center cursor-pointer gap-1 transition-colors"
                      >
                        <Check size={14} />
                        Klaim
                      </button>
                    </form>

                    {promoMessage && (
                      <p
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-lg leading-normal ${
                          promoMessage.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : 'bg-red-50 text-red-600 dark:bg-red-950/15 dark:text-red-400'
                        }`}
                      >
                        {promoMessage.text}
                      </p>
                    )}

                    <div className="border-t border-dashed border-neutral-150 dark:border-neutral-850 pt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-neutral-500">
                        <span>Subtotal Barang</span>
                        <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                      </div>
                      {promoDiscount > 0 && (
                        <div className="flex justify-between text-rose-600 font-semibold">
                          <span>Kupon Diskon</span>
                          <span>-Rp {promoDiscount.toLocaleString('id-ID')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-neutral-500">
                        <span>Biaya Pengiriman</span>
                        <span>
                          {shippingFee === 0 ? (
                            <span className="text-emerald-600 font-bold">Gratis Ongkir</span>
                          ) : (
                            `Rp ${shippingFee.toLocaleString('id-ID')}`
                          )}
                        </span>
                      </div>

                      <div className="border-t border-neutral-150 dark:border-neutral-800 pt-3 flex justify-between items-end">
                        <span className="text-sm font-bold text-neutral-850 dark:text-white">
                          Total Pembayaran
                        </span>
                        <div className="text-right">
                          <span className="text-xl font-black text-blue-900 dark:text-blue-400 block leading-tight">
                            Rp {grandTotal.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onCheckout}
                      className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1 cursor-pointer text-sm"
                    >
                      <span>Proses Lanjut Pembelian</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
