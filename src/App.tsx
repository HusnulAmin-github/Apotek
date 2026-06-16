import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, CheckCircle, Menu, ShoppingCart, Pill, 
  Droplet, Baby, Activity, ArrowRight, Mail, Phone, 
  MapPin, Sparkles, User, LogOut, FileText, Check,
  ChevronRight, Award, ShieldCheck, Heart, Star, Clock, X, Info, TrendingUp
} from 'lucide-react';

import { Product, CartItem, Order } from './types';
import { CATEGORIES, PRODUCTS } from './data';

import AuthModals from './components/AuthModals';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import RecipeUploadModal from './components/RecipeUploadModal';
import ProductDetailModal from './components/ProductDetailModal';

export default function App() {
  // Navigation & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(10000); // Default shipping

  // Auth States
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('login');

  // Modals & Flows State
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Mobile navigation state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Success state banners
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local storage loading for cart and user persistence
  useEffect(() => {
    const savedCart = localStorage.getItem('pharma_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
    const savedUser = localStorage.getItem('pharma_user');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  // Save cart to local storage whenever it changes
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('pharma_cart', JSON.stringify(items));
  };

  // Toast Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Add Item to Cart
  const handleAddToCart = (product: Product) => {
    const existing = cartItems.find(item => item.id === product.id);
    let newItems: CartItem[];

    if (existing) {
      newItems = cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [...cartItems, { id: product.id, product, quantity: 1 }];
    }

    saveCart(newItems);
    triggerToast(`"${product.name}" berhasil ditambahkan ke keranjang!`);
  };

  // Bulk add recipe prescriptions to cart
  const handleAddPrescriptionToCart = (items: { product: Product; quantity: number }[]) => {
    let currentCart = [...cartItems];
    
    items.forEach(prescription => {
      const existingIdx = currentCart.findIndex(item => item.id === prescription.product.id);
      if (existingIdx !== -1) {
        currentCart[existingIdx].quantity += prescription.quantity;
      } else {
        currentCart.push({
          id: prescription.product.id,
          product: prescription.product,
          quantity: prescription.quantity
        });
      }
    });

    saveCart(currentCart);
    triggerToast('Semua obat resep berhasil masuk ke keranjang belanja!');
    setIsCartOpen(true); // Open the cart drawer immediately
  };

  // Update Cart Quantities
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const updated = cartItems.map(item => 
      item.id === productId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  // Remove Item from Cart
  const handleRemoveItem = (productId: string) => {
    const updated = cartItems.filter(item => item.id !== productId);
    saveCart(updated);
  };

  // Promocode validation
  const handleApplyPromo = (code: string) => {
    const uppercaseCode = code.trim().toUpperCase();
    if (uppercaseCode === 'PHARMA10') {
      const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
      setPromoDiscount(Math.floor(subtotal * 0.10));
      setPromoCode(uppercaseCode);
      return { success: true, message: 'Selamat! Kupon PHARMA10 Berhasil (Diskon 10% Terpasang).' };
    } else if (uppercaseCode === 'FREEKIR') {
      setShippingFee(0);
      setPromoCode(uppercaseCode);
      return { success: true, message: 'Selamat! Kupon FREEKIR Berhasil (Gratis Ongkir Terpasang).' };
    } else {
      return { success: false, message: 'Kode kupon tidak valid atau sudah kadaluarsa.' };
    }
  };

  // Handle Checkout success
  const handleCheckoutSuccess = (order: Order) => {
    setActiveOrder(order);
    setIsCheckoutOpen(false);
    // Clear cart and reset promo states
    saveCart([]);
    setPromoCode('');
    setPromoDiscount(0);
    setShippingFee(10000);
  };

  // handle Auth success
  const handleAuthSuccess = (userName: string) => {
    setCurrentUser(userName);
    localStorage.setItem('pharma_user', userName);
    triggerToast(`Selamat datang kembali, ${userName}!`);
  };

  // Log Out
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pharma_user');
    triggerToast('Anda berhasil keluar dari akun.');
  };

  // Scroll to products catalogs category
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const catalogElement = document.getElementById('catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Search filter trigger
  const handleSearchTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    const catalogElement = document.getElementById('catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered products list
  const filteredProducts = PRODUCTS.filter(prod => {
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.apotek.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="bg-[#f7f9fb] text-neutral-850 font-sans min-h-screen flex flex-col pt-[72px]">
      
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-24 left-1/2 z-50 bg-neutral-900 border border-neutral-800 text-white font-bold py-3 px-6 rounded-2xl shadow-xl flex items-center gap-3 text-xs md:text-sm"
          >
            <CheckCircle className="text-teal-400" size={18} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-40 bg-white border-b border-slate-200/80 transition-all duration-200 h-[72px]">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <a onClick={() => setSelectedCategory('all')} className="font-sans font-black text-xl text-[#002d5f] flex items-center gap-2 cursor-pointer shrink-0">
            <span className="p-1.5 bg-blue-50 text-[#002d5f] rounded-xl border border-blue-100 flex items-center justify-center">
              <Pill size={22} className="fill-[#002d5f]/15" />
            </span>
            <span>PharmaCare</span>
          </a>

          {/* Search Box */}
          <form onSubmit={handleSearchTrigger} className="hidden md:flex flex-1 max-w-md relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Cari obat, vitamin, atau apotek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 hover:bg-neutral-100/50 border border-slate-200 rounded-full focus:outline-hidden focus:ring-1 focus:ring-blue-900 focus:border-[#002d5f] text-sm transition-all"
            />
          </form>

          {/* Nav Items & Auth */}
          <nav className="hidden md:flex items-center gap-5 justify-end">
            <a onClick={() => handleCategorySelect('all')} className="text-sm font-semibold text-neutral-600 hover:text-[#002d5f] cursor-pointer transition-colors">Semua Obat</a>
            <a onClick={() => handleCategorySelect('resep')} className="text-sm font-semibold text-neutral-600 hover:text-[#002d5f] cursor-pointer transition-colors">Resep</a>
            <a onClick={() => handleCategorySelect('vitamin')} className="text-sm font-semibold text-neutral-600 hover:text-[#002d5f] cursor-pointer transition-colors">Vitamin</a>
            <a onClick={() => handleCategorySelect('tubuh')} className="text-sm font-semibold text-neutral-600 hover:text-[#002d5f] cursor-pointer transition-colors">Alat Medis</a>
            
            {/* Cart Icon Drawer button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce-slow">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Auth / Profile Actions */}
            <div className="flex items-center gap-3 border-l border-slate-200/80 pl-5 ml-1">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-[#002d5f]" />
                    <span className="text-xs font-bold text-neutral-805 select-none">{currentUser}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 border border-slate-200 hover:border-red-200 text-neutral-500 hover:text-red-500 rounded-lg text-xs cursor-pointer transition-all"
                    title="Keluar Akun"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setAuthType('login'); setIsAuthOpen(true); }}
                    className="text-xs font-bold text-[#002d5f] border border-[#002d5f] hover:bg-[#002d5f]/5 px-4.5 py-2 rounded-full cursor-pointer transition-all"
                  >
                    Masuk
                  </button>
                  <button 
                    onClick={() => { setAuthType('register'); setIsAuthOpen(true); }}
                    className="text-xs font-bold text-white bg-[#002d5f] hover:bg-blue-950 px-4.5 py-2 rounded-full cursor-pointer shadow-xs"
                  >
                    Daftar
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile elements (Cart & Burger) */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-neutral-700 hover:bg-neutral-100 rounded-xl cursor-pointer"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center border border-white">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-neutral-800 p-2 hover:bg-neutral-150 rounded-xl cursor-pointer"
            >
              <Menu size={22} />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-[72px] inset-x-0 bg-white border-b border-slate-200 z-30 shadow-lg p-5 flex flex-col gap-4"
          >
            <form onSubmit={handleSearchTrigger} className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <Search size={15} />
              </span>
              <input
                type="text"
                placeholder="Cari obat, vitamin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-slate-200 rounded-full text-xs"
              />
            </form>

            <div className="flex flex-col gap-3 font-semibold text-xs text-neutral-700">
              <a onClick={() => { handleCategorySelect('all'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-[#002d5f] cursor-pointer">Semua Obat</a>
              <a onClick={() => { handleCategorySelect('resep'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-[#002d5f] cursor-pointer">Obat Resep</a>
              <a onClick={() => { handleCategorySelect('vitamin'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-[#002d5f] cursor-pointer">Vitamin &amp; Suplemen</a>
              <a onClick={() => { handleCategorySelect('tubuh'); setIsMobileMenuOpen(false); }} className="py-1 hover:text-[#002d5f] cursor-pointer">Kesehatan Tubuh</a>
            </div>

            <hr className="border-slate-100" />

            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-neutral-800">
                  <User size={14} />
                  <strong>{currentUser}</strong>
                </div>
                <button 
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="text-xs font-bold text-red-500 py-1 px-3 border border-red-200 rounded-lg"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setAuthType('login'); setIsAuthOpen(true); setIsMobileMenuOpen(false); }}
                  className="text-xs font-bold text-[#002d5f] border border-[#002d5f] py-2.5 rounded-xl"
                >
                  Masuk
                </button>
                <button
                  onClick={() => { setAuthType('register'); setIsAuthOpen(true); setIsMobileMenuOpen(false); }}
                  className="text-xs font-bold text-white bg-[#002d5f] py-2.5 rounded-xl"
                >
                  Daftar
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="relative bg-teal-50/10 min-h-[500px] flex items-center overflow-hidden">
          {/* Background pharmacist image */}
          <div className="absolute inset-0 z-0">
            <img 
              alt="Pharmacist in medical blue room" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-25 object-center" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlmXbPGXYfcP1udEZderAterLV2sUbDfUYEHypDbr0y4v0uJBolHCtJa5dZkTXyX7vPQcK-heh64zvjjUq111y0yVg2UvVsLqt2Bq578unFEmTXfQyJU7zWOgm6d9gKq0DdxWJBl4l3KRLxR16isThE4tFJuwqXNCqMpemIv5e3PO_OTVBYIZrwwzDx2Q7yASZNQj7Tzsot1BEAcCGCDMDkuCRe1NdURkmNPPdENq32tw88JU76HAHuT9qL73vV1r_L51b5rr0Scs"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent"></div>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
            <div className="max-w-2xl">
              
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[10px] uppercase tracking-widest font-black text-blue-900 border border-blue-100/50 px-3 py-1.5 rounded-full mb-5 animate-pulse-slow">
                <Award size={13} />
                Layanan Farmasi Digital 24 Jam
              </span>

              <h1 className="font-sans font-black text-4xl md:text-5.5xl text-[#002d5f] leading-snug tracking-tight mb-4 select-none">
                Solusi Kesehatan Terpercaya
              </h1>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-8 max-w-lg">
                Pesan obat resep, vitamin, dan produk kesehatan lainnya dengan mudah. Dikirim langsung dari apotek resmi ke pintu Anda.
              </p>

              {/* Large Hero Search */}
              <form onSubmit={handleSearchTrigger} className="bg-white p-2.5 rounded-2xl shadow-[0_12px_40px_-15px_rgba(0,45,95,0.08)] flex items-center gap-2 max-w-xl border border-slate-100">
                <span className="text-neutral-400 ml-3 shrink-0"><Search size={18} /></span>
                <input
                  type="text"
                  placeholder="Cari obat, gejala sakit, atau nama apotek..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-none bg-transparent focus:ring-0 focus:outline-hidden text-sm py-3 px-2 text-neutral-805"
                />
                <button
                  type="submit"
                  className="bg-[#002d5f] text-white px-7 py-3 rounded-xl font-bold text-xs hover:bg-blue-950 transition-colors shadow-sm cursor-pointer shrink-0"
                >
                  Cari
                </button>
              </form>

              {/* USP features */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-bold text-neutral-550 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="text-[#22C55E]" size={15} />
                  <span>Apotek Resmi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="text-[#22C55E]" size={15} />
                  <span>100% Asli</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="text-[#22C55E]" size={15} />
                  <span>Pengiriman Cepat</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Popular Categories section */}
        <section className="py-16 bg-white shrink-0">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-2xl font-black text-neutral-900 mb-8 select-none tracking-tight">
              Kategori Populer
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`p-6 rounded-2xl border flex flex-col items-center text-center gap-4 transition-all duration-300 w-full group cursor-pointer ${
                      isSelected 
                        ? 'border-blue-900 bg-blue-50/20 text-[#002d5f] shadow-md dark:border-blue-500' 
                        : 'border-slate-150 bg-white hover:border-[#002d5f] hover:shadow-xs'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${cat.color}`}>
                      {cat.iconName === 'Pill' && <Pill size={24} />}
                      {cat.iconName === 'Droplet' && <Droplet size={24} />}
                      {cat.iconName === 'Baby' && <Baby size={24} />}
                      {cat.iconName === 'Activity' && <Activity size={24} />}
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-sm tracking-tight text-neutral-900 block group-hover:text-[#002d5f] transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-medium block">
                        Temukan produk pilihan asli
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Special Prescriptions / Upload banner widget */}
        <section className="py-8 bg-[#f7f9fb] truncate-0">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="p-8 bg-gradient-to-r from-[#002d5f] to-indigo-950 rounded-3xl text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
                <FileText size={240} className="stroke-white" />
              </div>

              <div className="max-w-xl space-y-2 relative z-10">
                <span className="bg-amber-400 text-[#002d5f] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Layanan Unggah Resep
                </span>
                <h3 className="text-xl md:text-2xl font-bold leading-none pt-2">
                  Punya Resep Dari Dokter?
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed max-w-md">
                  Gunakan kamera HP atau foto resep Anda untuk membaca resep obat secara digital. Apotek resmi kami akan langsung menyusun resep tersebut.
                </p>
              </div>

              <button
                onClick={() => setIsRecipeOpen(true)}
                className="bg-teal-400 hover:bg-teal-350 text-[#002d5f] font-bold text-xs py-3 px-6 rounded-2xl transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer self-start md:self-center relative z-10 group"
              >
                <FileText size={16} />
                <span>Unggah Resep Sekarang</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* Catalog Products Listing block */}
        <section id="catalog-section" className="py-16 bg-white border-t border-slate-100 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#002d5f] font-semibold text-xs uppercase tracking-wider">
                  <TrendingUp size={14} />
                  <span>Promo Menarik</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mt-1 select-none">
                  {selectedCategory === 'all' ? 'Semua Produk Pilihan' :
                   selectedCategory === 'resep' ? 'Kategori Obat Resep' :
                   selectedCategory === 'vitamin' ? 'Kategori Vitamin & Suplemen' :
                   selectedCategory === 'ibu_bayi' ? 'Kategori Ibu & Bayi' : 'Kategori Alat Medis'}
                </h2>
                <p className="text-xs md:text-sm text-neutral-450 mt-1">
                  Dapatkan penawaran terbaik untuk produk bergaransi 100% asli
                </p>
              </div>

              {/* Sub filters */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                    selectedCategory === 'all' 
                      ? 'bg-[#002d5f] text-white border-blue-900 shadow-xs' 
                      : 'bg-neutral-50 hover:bg-neutral-100 border-slate-200 text-neutral-600'
                  }`}
                >
                  Semua ({PRODUCTS.length})
                </button>
                <button
                  onClick={() => setSelectedCategory('resep')}
                  className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                    selectedCategory === 'resep' 
                      ? 'bg-[#002d5f] text-white border-blue-900 shadow-xs' 
                      : 'bg-neutral-50 hover:bg-neutral-100 border-slate-200 text-neutral-600'
                  }`}
                >
                  Obat Resep
                </button>
                <button
                  onClick={() => setSelectedCategory('vitamin')}
                  className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                    selectedCategory === 'vitamin' 
                      ? 'bg-[#002d5f] text-white border-blue-900 shadow-xs' 
                      : 'bg-neutral-50 hover:bg-neutral-100 border-slate-200 text-neutral-600'
                  }`}
                >
                  Vitamin
                </button>
                <button
                  onClick={() => setSelectedCategory('tubuh')}
                  className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                    selectedCategory === 'tubuh' 
                      ? 'bg-[#002d5f] text-white border-blue-900 shadow-xs' 
                      : 'bg-neutral-50 hover:bg-neutral-100 border-slate-200 text-neutral-600'
                  }`}
                >
                  Alat Medis
                </button>
              </div>
            </div>

            {/* Warning query filter indicator if empty results */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 flex flex-col items-center text-center justify-center border border-dashed border-slate-200 rounded-3xl p-6">
                <div className="p-4 bg-rose-50 text-rose-500 rounded-full mb-4">
                  <Info size={30} />
                </div>
                <h4 className="font-bold text-neutral-800">Tidak ada produk ditemukan</h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                  Maaf, produk medis "{searchQuery}" tidak tersedia untuk saat ini atau kategori tersebut kosong. Coba cari kata kunci lainnya.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="mt-4 bg-[#002d5f] text-white font-bold text-xs py-2 px-5 rounded-xl cursor-pointer hover:bg-blue-950 transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              /* Products Grid */
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 bg-white border border-slate-200/80 rounded-2xl flex flex-col shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    {/* Discount badge tag */}
                    {prod.discountLabel && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full z-10 shadow-xs">
                        {prod.discountLabel}
                      </span>
                    )}

                    {/* image container */}
                    <div className="aspect-square bg-slate-50 rounded-xl mb-4 p-4 flex items-center justify-center relative select-none shrink-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-4/5 h-4/5 object-contain max-h-[140px] group-hover:scale-105 transition-transform duration-300"
                        onClick={() => setSelectedProduct(prod)}
                      />
                      
                      <button
                        onClick={() => setSelectedProduct(prod)}
                        className="absolute bottom-2 right-2 bg-white/85 dark:bg-neutral-800/85 hover:bg-white text-neutral-600 hover:text-[#002d5f] p-2 rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        title="Lihat Detail Obat"
                      >
                        <Info size={14} />
                      </button>
                    </div>

                    {/* Contents parameters details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Apothecary name */}
                        <span className="text-[10px] font-black uppercase text-[#22C55E]/90 bg-[#22C55E]/5 p-1 px-2.5 border border-[#22C55E]/10 rounded-full select-none block w-max mb-1.5 shrink-0">
                          {prod.apotek}
                        </span>

                        <h3 
                          onClick={() => setSelectedProduct(prod)}
                          className="font-bold text-xs md:text-sm text-neutral-900 hover:text-[#002d5f] transition-colors leading-snug line-clamp-2 cursor-pointer mb-2"
                        >
                          {prod.name}
                        </h3>

                        {/* Rating row details */}
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400 mb-4 select-none">
                          <div className="flex items-center text-amber-400">
                            <Star className="fill-amber-400 shrink-0" size={12} />
                          </div>
                          <span className="font-bold text-neutral-700">{prod.rating || '4.8'}</span>
                          <span>•</span>
                          <span>Terjual {prod.salesCount || '100+'}</span>
                        </div>
                      </div>

                      {/* prices and checkout trigger */}
                      <div>
                        <div className="mb-4">
                          {prod.originalPrice && (
                            <span className="text-[11px] text-neutral-400 line-through mr-1 block select-none">
                              Rp {prod.originalPrice.toLocaleString('id-ID')}
                            </span>
                          )}
                          <span className="text-sm md:text-base font-black text-[#002d5f] block">
                            Rp {prod.price.toLocaleString('id-ID')}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(prod)}
                          className="w-full bg-[#002d5f]/5 text-[#002d5f] hover:bg-[#002d5f] hover:text-white border border-[#002d5f]/15 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <ShoppingCart size={14} />
                          <span>Beli Obat</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How to Order Medications Instruction Steps section layout */}
        <section className="py-20 bg-slate-50 border-t border-slate-200/50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            
            <div className="max-w-lg mx-auto mb-16">
              <span className="text-xs font-bold uppercase text-[#002d5f] tracking-widest block bg-blue-50/70 border border-blue-100/50 px-3 py-1.5 rounded-full w-max mx-auto mb-3">
                Langkah Cepat Belanja
              </span>
              <h2 className="text-2xl md:text-3.5xl font-black text-neutral-900 tracking-tight">
                Cara Pesan Obat Online
              </h2>
              <p className="text-xs md:text-sm text-neutral-520 mt-2 leading-relaxed">
                Nikmati kenyamanan berbelanja alat kesehatan dan tebus resep dari dokter secara digital dalam 3 langkah super transparan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* background connecting bars */}
              <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[2px] bg-slate-200 z-0" />

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-4 group">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-slate-50 group-hover:border-teal-400 text-[#002d5f] flex items-center justify-center shadow-md transition-all">
                  <Search size={28} />
                </div>
                <h3 className="font-bold text-base text-neutral-900">1. Cari Obat Utama</h3>
                <p className="text-xs text-neutral-500 max-w-[240px] leading-relaxed">
                  Cari produk yang Anda butuhkan melalui filter, atau unggah foto resep dokter langsung.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-4 group">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-slate-50 group-hover:border-teal-400 text-[#002d5f] flex items-center justify-center shadow-md transition-all">
                  <ShoppingCart size={28} />
                </div>
                <h3 className="font-bold text-base text-neutral-900">2. Apotek &amp; Alamat</h3>
                <p className="text-xs text-neutral-500 max-w-[240px] leading-relaxed">
                  Pilih apotek rekanan terdekat yang menyediakan obat, lalu masukkan rincian alamat pengiriman.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-4 group">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-slate-50 group-hover:border-teal-400 text-[#002d5f] flex items-center justify-center shadow-md transition-all">
                  <CheckCircle size={28} className="text-[#22C55E]" />
                </div>
                <h3 className="font-bold text-base text-neutral-900">3. Kirim &amp; Bayar</h3>
                <p className="text-xs text-neutral-500 max-w-[240px] leading-relaxed">
                  Duduk santai sementara obat sedang diracik oleh Apoteker dan dikirim instan tepat sampai ke pintu rumah Anda.
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer information and copyrights blocks */}
      <footer className="bg-neutral-900 text-neutral-400 border-t border-neutral-850 text-xs py-16">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Main info Brand */}
          <div className="md:col-span-5 space-y-4">
            <a className="font-sans font-black text-xl text-white flex items-center gap-2 select-none">
              <span className="p-1.5 bg-neutral-800 text-teal-400 rounded-xl border border-neutral-750 flex items-center justify-center">
                <Pill size={18} className="fill-teal-400/10" />
              </span>
              <span>PharmaCare</span>
            </a>

            <p className="text-xs leading-relaxed max-w-sm">
              Platform digital kesehatan terpercaya yang menghubungkan Anda dengan apotek berlisensi resmi di seluruh penjuru Indonesia secara instan demi ketetapan obat yang aman.
            </p>

            <div className="flex gap-4 pt-2">
              <a href="#" className="p-2.5 bg-neutral-850 hover:bg-neutral-800 text-white rounded-xl transition-colors">
                <Mail size={16} />
              </a>
              <a href="#" className="p-2.5 bg-neutral-850 hover:bg-neutral-800 text-white rounded-xl transition-colors">
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Core Tautan Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Tautan Cepat</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-teal-400 transition-colors">Tentang PharmaCare</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Ketentuan Layanan aplikasi</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Kebijakan Privasi Data</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Pendaftaran Apotek Partner</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Hubungi CS Center</a></li>
            </ul>
          </div>

          {/* App download mockup */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Unduh Aplikasi</h4>
            <p className="text-xs leading-relaxed max-w-xs">
              Makin praktis beli obat langsung dari smartphone Anda. Dapatkan App store resmi kami.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              {/* Google Play store button mock */}
              <button className="flex items-center gap-2.5 bg-black border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-950 py-2.5 px-4 rounded-xl transition-all cursor-pointer">
                <span className="text-teal-400"><Droplet size={18} /></span>
                <div className="text-left leading-none font-sans">
                  <span className="text-[9px] block text-neutral-450 uppercase">Get it on</span>
                  <span className="text-xs font-bold text-white">Google Play</span>
                </div>
              </button>

              {/* App store button mock */}
              <button className="flex items-center gap-2.5 bg-black border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-950 py-2.5 px-4 rounded-xl transition-all cursor-pointer">
                <span className="text-teal-400"><Activity size={18} /></span>
                <div className="text-left leading-none font-sans">
                  <span className="text-[9px] block text-neutral-450 uppercase">Download on</span>
                  <span className="text-xs font-bold text-white">App Store</span>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* separator bottom copyright */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 border-t border-neutral-850 mt-12 pt-6">
          <p className="text-center text-[11px] text-neutral-500">
            &copy; 2026 PharmaCare Digital. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>

      </footer>

      {/* RENDER MODAL FLOW OVERLAYS */}

      {/* Auth Modals (Login/Register) */}
      <AuthModals
        isOpen={isAuthOpen}
        initialType={authType}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Cart Slider Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
        promoCode={promoCode}
        promoDiscount={promoDiscount}
        onApplyPromo={handleApplyPromo}
        shippingFee={shippingFee}
      />

      {/* Checkout Forms modal popup */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        total={cartSubtotal}
        promoDiscount={promoDiscount}
        shippingFee={shippingFee}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* Upload recipe modal */}
      <RecipeUploadModal
        isOpen={isRecipeOpen}
        onClose={() => setIsRecipeOpen(false)}
        onAddPrescriptionToCart={handleAddPrescriptionToCart}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Order Complete Celebratory full overlay */}
      <AnimatePresence>
        {activeOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setActiveOrder(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-8 z-10 text-center border border-neutral-100 dark:border-neutral-800"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setActiveOrder(null)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer p-1 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Celebrating check icon */}
              <div className="inline-flex p-3 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full mb-4 animate-bounce-slow">
                <CheckCircle size={36} />
              </div>

              <h3 className="text-2xl font-black text-neutral-900 dark:text-white">
                Pesanan Berhasil Dibuat!
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Terima kasih atas kepercayaan Anda. Pesanan obat Anda sedang dirakit oleh Apoteker dan bersiap untuk dikirim.
              </p>

              {/* Order meta codes summary block */}
              <div className="bg-neutral-50 dark:bg-neutral-850 p-4 rounded-2xl border border-neutral-150 dark:border-neutral-750/50 mt-6 space-y-2 text-left text-xs text-neutral-600 dark:text-neutral-350 select-text">
                <div className="flex justify-between font-mono text-[10px]">
                  <span>ID Pesanan:</span>
                  <span className="font-bold text-neutral-900 dark:text-white uppercase">{activeOrder.id}</span>
                </div>
                <div className="flex justify-between font-mono text-[10px]">
                  <span>No. Rekomendasi/Resi:</span>
                  <span className="font-bold text-neutral-900 dark:text-white uppercase">{activeOrder.trackingNumber}</span>
                </div>
                <hr className="border-neutral-200 dark:border-neutral-700 my-1" />
                <div className="flex justify-between">
                  <span>Nama Penerima:</span>
                  <strong className="text-neutral-900 dark:text-white">{activeOrder.fullName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>No. WhatsApp:</span>
                  <span className="text-neutral-805 dark:text-white">{activeOrder.phone}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Alamat Kirim:</span>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300 line-clamp-1 max-w-[180px] break-all">
                    {activeOrder.address}
                  </span>
                </div>
                <hr className="border-neutral-200 dark:border-neutral-700 my-1" />
                <div className="flex justify-between font-bold text-neutral-850 dark:text-white text-sm">
                  <span>Total Dibayar:</span>
                  <span className="text-[#002d5f] dark:text-blue-400">Rp {activeOrder.total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* tracker bar layout */}
              <div className="mt-6 flex justify-around items-center text-center relative max-w-sm mx-auto">
                <div className="absolute top-3 left-[15%] right-[15%] h-[2.5px] bg-slate-200" />
                
                <div className="relative flex flex-col items-center">
                  <div className="w-6.5 h-6.5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </div>
                  <span className="text-[9px] font-bold text-neutral-750 mt-1">Diterima</span>
                </div>

                <div className="relative flex flex-col items-center">
                  <div className="w-6.5 h-6.5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] animate-pulse">
                    ●
                  </div>
                  <span className="text-[9px] font-bold text-neutral-750 mt-1">Diproses</span>
                </div>

                <div className="relative flex flex-col items-center">
                  <div className="w-6.5 h-6.5 rounded-full bg-slate-150 text-neutral-400 flex items-center justify-center font-bold text-[10px]">
                    3
                  </div>
                  <span className="text-[9px] font-medium text-neutral-400 mt-1">Dikirim</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setActiveOrder(null)}
                  className="w-full bg-[#002d5f] hover:bg-blue-950 font-bold py-3.5 text-white rounded-xl shadow-md transition-all cursor-pointer text-sm"
                >
                  Selesai &amp; Lanjut Belanja
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
