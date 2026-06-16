import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Star, ShieldCheck, Heart, Award } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <AnimatePresence>
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
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-neutral-400 bg-white/85 dark:bg-neutral-800/85 hover:text-neutral-600 dark:hover:text-neutral-100 rounded-full shadow-xs cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column: Image wrapper */}
            <div className="bg-neutral-50 dark:bg-neutral-950 p-8 flex items-center justify-center relative min-h-[280px]">
              {product.discountLabel && (
                <span className="absolute top-4 left-4 bg-red-500 text-white font-semibold text-xs px-3 py-1.5 rounded-full shadow-xs">
                  Promo {product.discountLabel}
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-4/5 h-4/5 object-contain max-h-[220px]"
              />
            </div>

            {/* Right Column: Information */}
            <div className="p-8 flex flex-col justify-between h-full max-h-[480px] overflow-y-auto">
              <div>
                <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 rounded-md mb-3">
                  {product.category === 'resep' ? 'Obat Resep' :
                   product.category === 'vitamin' ? 'Vitamin & Suplemen' :
                   product.category === 'ibu_bayi' ? 'Ibu & Bayi' : 'Kesehatan Tubuh'}
                </span>
                
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-snug">
                  {product.name}
                </h3>

                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1 mb-3">
                  Disediakan oleh {product.apotek}
                </p>

                {/* Ratings & Sales */}
                <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      {product.rating || '4.8'}
                    </span>
                  </div>
                  <div>•</div>
                  <div>Terjual {product.salesCount || '100+'} produk</div>
                </div>

                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 mb-4">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Deskripsi Produk
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-350 leading-relaxed">
                    {product.description || 'Produk kesehatan orisinal yang telah lolos uji kualitas dan diawasi oleh apoteker berlisensi di apotek rekanan resmi kami.'}
                  </p>
                </div>
              </div>

              <div>
                {/* Price section */}
                <div className="flex items-end gap-3 mb-5">
                  <div>
                    {product.originalPrice && (
                      <p className="text-xs text-neutral-400 line-through">
                        Rp {product.originalPrice.toLocaleString('id-ID')}
                      </p>
                    )}
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-400">
                      Rp {product.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    className="flex-1 bg-blue-950 hover:bg-blue-980 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    <ShoppingCart size={18} />
                    Tambah Keranjang
                  </button>
                  <button className="p-3 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-500 hover:text-red-500 rounded-xl transition-colors cursor-pointer">
                    <Heart size={18} />
                  </button>
                </div>

                {/* Safety Seal */}
                <div className="mt-4 flex items-center gap-2 text-[11px] text-neutral-550">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>Obat dijamin asli, higienis, dan diawasi oleh Farmasis professional.</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
