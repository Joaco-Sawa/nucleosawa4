import { ChevronLeft, Minus, Plus, Check, AlertCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import coinIcon from '../assets/db29ff4dc98462b3539ca31d029b8918fad5d4e6.png';
import catalogIcon from '../assets/a1d61e7aee26ae9e65cfcc5d4d13290cc8da135b.png';
import walletIcon from '../assets/f53abab596a88a7dbe37a1de9340df1fc709bfa0.png';
import shoppingBagIcon from '../assets/5430a27800876129e7c102990a58d556b6b36a63.png';
import { ImageLightbox } from './ImageLightbox';
import { Header } from './Header';

interface ProductDetailProps {
  product: {
    id: number;
    name: string;
    brand: string;
    points: number;
    image: string;
    images: string[];
    available: boolean;
    stock: number;
    description: string;
    features: string[];
    specs: Array<{ label: string; value: string }>;
  };
  quantity: number;
  setQuantity: (quantity: number) => void;
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
  userPoints: number;
  onBack: () => void;
  categoriesOpen: boolean;
  setCategoriesOpen: (open: boolean) => void;
  setSelectedCategory: (id: number) => void;
  setProfileDrawerOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  categoriesButtonRef: React.RefObject<HTMLButtonElement>;
  setMenuPosition: (position: { top: number; left: number }) => void;
  categories: Array<{ id: number; name: string; image: string; subcategories: any[] }>;
  fromAllCatalog?: boolean;
}

export function ProductDetail({
  product,
  quantity,
  setQuantity,
  currentImageIndex,
  setCurrentImageIndex,
  userPoints,
  onBack,
  categoriesOpen,
  setCategoriesOpen,
  setSelectedCategory,
  setProfileDrawerOpen,
  setMobileMenuOpen,
  categoriesButtonRef,
  setMenuPosition,
  categories,
  fromAllCatalog
}: ProductDetailProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  // Filtrar imágenes únicas (sin duplicados)
  const uniqueImages = Array.from(new Set(product.images));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const formatPoints = (points: number) => {
    return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col min-w-0 w-full max-w-full md:h-[calc(100vh-1rem)] md:overflow-y-auto md:m-2 overflow-y-auto overflow-x-hidden pb-20 md:pb-8 bg-[#F5F8FB]"
    >
      {/* Header */}
      <Header
        userPoints={userPoints}
        categoriesOpen={categoriesOpen}
        setCategoriesOpen={setCategoriesOpen}
        setSelectedCategory={setSelectedCategory}
        setProfileDrawerOpen={setProfileDrawerOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        categoriesButtonRef={categoriesButtonRef}
        setMenuPosition={setMenuPosition}
        categories={categories}
      />

      {/* Back Button Bar */}
      <div className="px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-700 hover:text-[#FF8000] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[#E8EFF5] group-hover:bg-orange-50 flex items-center justify-center transition-all border border-transparent group-hover:border-[#FF8000]">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">
              {fromAllCatalog ? 'Volver a Todo catálogo' : 'Volver al catálogo'}
            </span>
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-0 pb-2 md:pt-0 md:pb-3">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column - Images */}
          <div className="flex flex-row gap-3 items-start">
            {/* Thumbnails - Desktop only */}
            <div className="hidden md:flex flex-col gap-1.5 md:gap-2">
              {uniqueImages.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (idx === 4 && uniqueImages.length > 5) {
                      setIsLightboxOpen(true);
                    } else {
                      setCurrentImageIndex(idx);
                    }
                  }}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-md md:rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 relative ${
                    currentImageIndex === idx
                      ? 'border-[#FF8000] ring-2 ring-[#FF8000]/20 shadow-md shadow-[#FF8000]/20'
                      : 'border-slate-200 hover:border-[#FF8000]/50'
                  } ${idx === 4 && uniqueImages.length > 5 ? 'cursor-pointer hover:scale-105' : ''}`}
                >
                  {idx === 4 && uniqueImages.length > 5 ? (
                    <>
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover bg-white"
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold text-sm md:text-base">
                          +{uniqueImages.length - 4}
                        </span>
                      </div>
                    </>
                  ) : (
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover bg-white"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Main Image - Desktop */}
            <div className="hidden md:block flex-1">
              <div 
                className="aspect-square bg-white rounded-xl md:rounded-2xl overflow-hidden flex items-center justify-center shadow-lg shadow-[#FF8000]/10 cursor-zoom-in relative"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onClick={() => setIsLightboxOpen(true)}
              >
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isZoomed ? 2 : 1,
                    x: isZoomed ? (0.5 - mousePosition.x) * 100 : 0,
                    y: isZoomed ? (0.5 - mousePosition.y) * 100 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  src={uniqueImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Mobile Carousel - Full width */}
            <div className="md:hidden w-full relative">
              <div 
                className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg shadow-[#FF8000]/10 relative"
              >
                <div 
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onScroll={(e) => {
                    const scrollLeft = e.currentTarget.scrollLeft;
                    const itemWidth = e.currentTarget.offsetWidth;
                    const newIndex = Math.round(scrollLeft / itemWidth);
                    if (newIndex !== currentImageIndex) {
                      setCurrentImageIndex(newIndex);
                    }
                  }}
                >
                  {uniqueImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-full h-full snap-center"
                      onClick={() => setIsLightboxOpen(true)}
                    >
                      <div className="w-full h-full flex items-center justify-center cursor-pointer">
                        <img
                          src={img}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Image Counter - Mobile */}
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">
                  {currentImageIndex + 1}/{uniqueImages.length}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-4 md:space-y-5">
            {/* Grouped info container - centered to match image width */}
            <div className="max-w-[500px] mx-auto space-y-4 md:space-y-5">
              {/* Brand & Name */}
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {product.brand}
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Points & Quantity in same row */}
              {product.available && (
                <div className="space-y-4">
                  {/* Points */}
                  <div className="flex items-center gap-2">
                    <img src={coinIcon} alt="Coin" className="w-9 h-9 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-2xl font-bold leading-none">
                        <span className="text-[#FF8000]">{formatPoints(product.points)}</span>{' '}
                        <span className="text-base font-semibold text-slate-500">puntos</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Cantidad
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-8 h-8 rounded-md border border-slate-300 flex items-center justify-center hover:border-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <Minus className="w-4 h-4 text-slate-600" />
                      </button>
                      <div className="w-12 h-8 flex items-center justify-center">
                        <span className="text-base font-semibold text-slate-900">{quantity}</span>
                      </div>
                      <button
                        onClick={() => setQuantity(Math.min(3, quantity + 1))}
                        disabled={quantity >= 3}
                        className="w-8 h-8 rounded-md border border-slate-300 flex items-center justify-center hover:border-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <Plus className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Points only when not available */}
              {!product.available && (
                <div className="flex items-center gap-2">
                  <img src={coinIcon} alt="Coin" className="w-9 h-9 flex-shrink-0" />
                  <div>
                    <div className="text-2xl font-bold leading-none">
                      <span className="text-[#FF8000]">{formatPoints(product.points)}</span>{' '}
                      <span className="text-base font-semibold text-slate-500">puntos</span>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <button
                disabled={!product.available || quantity * product.points > userPoints}
                className={`w-full py-3 md:py-3.5 px-6 rounded-full font-bold text-sm md:text-base transition-all shadow-lg ${
                  product.available && quantity * product.points <= userPoints
                    ? 'bg-[#FF8000] hover:bg-[#FF9119] text-white shadow-[0_0_20px_rgba(255,128,0,0.3)] hover:shadow-[0_0_30px_rgba(255,128,0,0.5)] active:scale-95'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                {!product.available
                  ? 'Producto no disponible'
                  : quantity * product.points > userPoints
                    ? `Te faltan ${quantity * product.points - userPoints} puntos`
                    : 'Canjear ahora'}
              </button>
            </div>
          </div>
        </div>

        {/* Information boxes - full width below */}
        <div className="max-w-5xl mx-auto mt-8 md:mt-12">
          <div className="bg-white rounded-xl border border-slate-200">
            {/* Description */}
            <div className="p-4">
              <h4 className="text-sm md:text-base font-bold text-slate-900 mb-2">Descripción</h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <ImageLightbox
            images={uniqueImages}
            currentIndex={currentImageIndex}
            onClose={() => setIsLightboxOpen(false)}
            onNavigate={setCurrentImageIndex}
            productName={product.name}
          />
        )}
      </AnimatePresence>

      {/* Bottom Navigation (Mobile) */}
      <nav 
        className="md:hidden fixed left-3 right-3 bg-white/90 backdrop-blur-xl rounded-[32px] z-40 border border-slate-200/50"
        style={{ 
          boxShadow: '0 0 40px rgba(15, 23, 42, 0.25)',
          bottom: '12px',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        <div className="grid grid-cols-3 h-16 px-2 py-2 gap-2">
          <button 
            onClick={onBack}
            className="flex flex-col items-center justify-center gap-0.5 text-[#FF8000] bg-[#FF8000]/10 rounded-full transition-all duration-200 mx-1"
          >
            <img src={catalogIcon} alt="" className="w-6 h-6" />
            <p className="text-xs font-bold">Catálogo</p>
          </button>
          <button className="flex flex-col items-center justify-center gap-0.5 text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5 rounded-full transition-all duration-200 mx-1">
            <img src={walletIcon} alt="" className="w-6 h-6" />
            <p className="text-xs font-medium">Billetera</p>
          </button>
          <button className="flex flex-col items-center justify-center gap-0.5 text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5 rounded-full transition-all duration-200 mx-1">
            <img src={shoppingBagIcon} alt="" className="w-6 h-6" />
            <p className="text-xs font-medium">Mis canjes</p>
          </button>
        </div>
      </nav>
    </motion.div>
  );
}