import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, FileText, CheckCircle, Cpu, Eye, ArrowRight, Pill, Sparkles, Plus } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data';

interface RecipeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPrescriptionToCart: (products: { product: Product; quantity: number }[]) => void;
}

export default function RecipeUploadModal({ isOpen, onClose, onAddPrescriptionToCart }: RecipeUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [step, setStep] = useState<'upload' | 'scanning' | 'results'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Only accept images or pdfs
    if (file.type.match('image.*') || file.type === 'application/pdf') {
      setSelectedFile(file);
      setStep('scanning');
      
      // Simulate scanning
      setTimeout(() => {
        setStep('results');
      }, 3000);
    } else {
      alert('Hanya diperbolehkan mengunggah file gambar (JPG/PNG) atau PDF resep.');
    }
  };

  // Mock extracted medicines from the scanned recipe
  const matchedPrescriptions = [
    {
      product: PRODUCTS[0], // Paracetamol
      qty: 2,
      note: '3 kali sehari 1 kaplet setelah makan (bila demam/nyeri)'
    },
    {
      product: PRODUCTS[1], // Vitamin C
      qty: 1,
      note: '1 kali sehari 1 tablet larutkan dalam air (setelah sarapan)'
    },
    {
      product: PRODUCTS[2], // Sirup batuk
      qty: 1,
      note: '3 kali sehari 2 sendok teh (10ml)'
    }
  ];

  const handleAutoBuy = () => {
    const itemsToAdd = matchedPrescriptions.map(item => ({
      product: item.product,
      quantity: item.qty
    }));
    onAddPrescriptionToCart(itemsToAdd);
    onClose();
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
            className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden z-10 border border-neutral-100 dark:border-neutral-800"
          >
            {/* Header banner */}
            <div className="h-2 bg-gradient-to-r from-blue-900 via-indigo-700 to-teal-500" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              {step === 'upload' && (
                <div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                      Unggah Resep Dokter
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                      Kirim foto resep Anda, sistem AI kami akan membaca &amp; merujuk obat asli yang cocok dari apotek berlisensi
                    </p>
                  </div>

                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed border-neutral-200 dark:border-neutral-750 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[220px] ${
                      isDragActive 
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20' 
                        : 'bg-neutral-50 hover:bg-neutral-100/50 dark:bg-neutral-850 dark:hover:bg-neutral-800/80'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleInputChange}
                      accept="image/*,.pdf"
                      className="hidden"
                    />

                    <div className="p-4 bg-white dark:bg-neutral-850 rounded-full shadow-md text-blue-900 dark:text-blue-400 mb-4 border border-neutral-100 dark:border-transparent">
                      <Upload size={28} />
                    </div>

                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      Tarik &amp; lepas file resep di sini, atau klik untuk memilih
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Mendukung format PNG, JPG, JPEG, atau PDF (Maks. 5MB)
                    </p>
                  </div>

                  {/* Safety Notice */}
                  <div className="mt-6 p-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-xl flex gap-3 text-xs text-amber-800 dark:text-amber-400">
                    <Sparkles className="shrink-0 text-amber-500" size={16} />
                    <p className="leading-relaxed">
                      <strong>Privasi Terjamin:</strong> Informasi resep dokter dienkripsi secara aman dan hanya diteruskan ke apoteker penanggung jawab apotek resmi rekanan untuk kepentingan peracikan.
                    </p>
                  </div>
                </div>
              )}

              {step === 'scanning' && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
                    {/* Animated scanning bar */}
                    <motion.div
                      animate={{
                        top: ['0%', '100%', '0%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent z-10 blur-[1px]"
                    />

                    <div className="absolute inset-0 bg-teal-50/50 dark:bg-teal-950/10 rounded-2xl border border-teal-100 dark:border-teal-900/30 animate-pulse" />

                    <FileText size={48} className="text-teal-600 dark:text-teal-400 relative z-0 animate-bounce" />
                  </div>

                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    Mengekstrak Resep Dokter
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 justify-center">
                    <Cpu size={14} className="animate-spin text-blue-500" />
                    <span>Gemini AI sedang membaca coretan resep dokter...</span>
                  </div>

                  {/* Mock progress bar */}
                  <div className="w-48 bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-6">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2.8, ease: 'easeInOut' }}
                      className="bg-teal-500 h-full"
                    />
                  </div>
                </div>
              )}

              {step === 'results' && (
                <div>
                  <div className="text-center mb-5">
                    <div className="inline-flex p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full mb-3 border border-emerald-100">
                      <CheckCircle size={20} />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                      Resep Berhasil Dibaca!
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Sistem AI mendeteksi kecocokan obat tersedia berikut:
                    </p>
                  </div>

                  {/* Scanned/extracted list */}
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                    {matchedPrescriptions.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-150 dark:border-neutral-750/50 rounded-xl flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-contain bg-white dark:bg-neutral-900 rounded-lg p-1"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1 max-w-[200px]">
                              {item.product.name}
                            </h4>
                            <p className="text-[10px] text-blue-800 dark:text-blue-300 font-semibold leading-none mt-0.5">
                              {item.product.apotek}
                            </p>
                            <p className="text-[10px] text-neutral-450 mt-1 select-none">
                              Dosis: {item.note}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-black text-neutral-800 dark:text-white">
                            Rp {item.product.price.toLocaleString('id-ID')}
                          </div>
                          <div className="text-[10px] font-medium text-neutral-400">
                            Jumlah: {item.qty} pcs
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary of checkout */}
                  <div className="mt-5 p-4 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-neutral-500 block">Total Est. Obat Resep ({matchedPrescriptions.length} items)</span>
                      <strong className="text-sm text-blue-900 dark:text-blue-300">
                        Rp {(matchedPrescriptions.reduce((acc, current) => acc + (current.product.price * current.qty), 0)).toLocaleString('id-ID')}
                      </strong>
                    </div>
                    <span>Disediakan Apotek Berlisensi</span>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setStep('upload');
                      }}
                      className="flex-1 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 font-semibold py-3 px-4 rounded-xl text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer text-sm"
                    >
                      Unggah Ulang
                    </button>
                    <button
                      onClick={handleAutoBuy}
                      className="flex-1 bg-blue-900 hover:bg-blue-950 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                    >
                      <span>Masukan Keranjang</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
