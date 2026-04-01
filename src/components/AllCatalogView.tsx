import { Search, ChevronRight, SlidersHorizontal, Menu, ChevronDown, Sparkles, Tag, ChevronLeft, X } from 'lucide-react';
import coinIcon from '../assets/db29ff4dc98462b3539ca31d029b8918fad5d4e6.png';
import logoDesafioSawa from '../assets/90d0b6e7e40ee202a8c067619d31d9c79731c384.png';
import profileImage from '../assets/9f5aa0e583374b6893d8921a6183b99d788006eb.png';
import { useState, useMemo, useRef, useEffect } from 'react';
import { FilterSortPanel, FilterSortState } from './FilterSortPanel';
import { useNavigate } from 'react-router';

interface Product {
  id: number;
  name: string;
  brand: string;
  points: number;
  image: string;
  images: string[];
  available: boolean;
  stock: number;
  badge?: { text: string; color: string; };
  description: string;
  features: string[];
  specs: { label: string; value: string; }[];
}

interface AllCatalogViewProps {
  products: Product[];
  userPoints: number;
  onProductClick: (productId: number) => void;
  onBack: () => void;
}

export function AllCatalogView({ products, userPoints, onProductClick, onBack }: AllCatalogViewProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterSortState>({
    brand: 'todas',
    minPoints: 0,
    maxPoints: 0,
    sortBy: 'destacados'
  });
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  
  // Detect if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract unique brands
  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));
    return uniqueBrands.sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply brand filter
    if (filters.brand !== 'todas') {
      result = result.filter(p => p.brand === filters.brand);
    }

    // Apply min points filter
    if (filters.minPoints > 0) {
      result = result.filter(p => p.points >= filters.minPoints);
    }

    // Apply max points filter
    if (filters.maxPoints > 0) {
      result = result.filter(p => p.points <= filters.maxPoints);
    }

    // Apply sorting
    if (filters.sortBy === 'mayor') {
      result.sort((a, b) => b.points - a.points);
    } else if (filters.sortBy === 'menor') {
      result.sort((a, b) => a.points - b.points);
    }
    // 'destacados' keeps the original order

    return result;
  }, [products, filters]);

  const handleApplyFilters = (newFilters: FilterSortState) => {
    setFilters(newFilters);
  };

  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col min-w-0 w-full max-w-full md:h-[calc(100vh-1rem)] md:overflow-y-auto md:m-2 overflow-y-auto overflow-x-hidden pb-[88px] md:pb-0">
      {/* Header */}
      <header 
        className="bg-white md:bg-white/95 md:backdrop-blur-md transition-all duration-300 md:rounded-2xl md:sticky md:top-0 md:z-30 flex-shrink-0"
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)' }}
      >
        {/* Desktop Header */}
        <div className="hidden md:block py-[25px] px-6">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Categories Menu */}
            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-[#F1F5F9] text-slate-700 hover:bg-[#E1E5E9] transition-all" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                <Menu className="w-4 h-4" />
                <span>Categorías</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button className="px-3 py-2 text-sm font-semibold text-[#00BF29] hover:text-[#00A024] transition-colors flex items-center gap-1.5" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                <Sparkles className="w-4 h-4" />
                Novedades
              </button>
              <button className="px-3 py-2 text-sm font-semibold text-[#FF8000] hover:text-[#FF8000] transition-colors flex items-center gap-1.5" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                <Tag className="w-4 h-4" />
                Ofertas
              </button>
            </div>

            {/* Right: Search, Filter and Points */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="¿Qué quieres canjear hoy?"
                  className="w-[260px] pl-12 pr-4 py-2.5 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm"
                />
              </div>

              {/* Filtrar y ordenar button */}
              <div className="relative">
                <button 
                  ref={filterButtonRef}
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors text-sm flex-shrink-0"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filtrar y ordenar</span>
                </button>
                
                {/* Filter/Sort Panel Desktop Popover */}
                {isFilterOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="hidden md:block fixed inset-0 z-40"
                      onClick={() => setIsFilterOpen(false)}
                    />
                    
                    {/* Popover Panel */}
                    <div className="hidden md:block absolute top-full right-0 mt-2 z-50">
                      <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-slate-900" style={{ fontFamily: "'Nunito', sans-serif" }}>
                            Filtrar y ordenar
                          </h3>
                          <button 
                            onClick={() => setIsFilterOpen(false)}
                            className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4 text-slate-500" />
                          </button>
                        </div>

                        <FilterSortPanel
                          isOpen={isFilterOpen}
                          onClose={() => setIsFilterOpen(false)}
                          brands={brands}
                          onApply={handleApplyFilters}
                          isDesktopPopover={true}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Points Badge */}
              <div className="min-w-[140px] h-[52px] w-fit rounded-xl bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 hover:shadow-lg hover:shadow-[#FF8000]/30 transition-all duration-300 px-3 flex items-center gap-3 cursor-pointer flex-shrink-0">
                <img src={coinIcon} alt="Coin" className="w-8 h-8 flex-shrink-0" />
                <div className="flex flex-col pr-2">
                  <div className="text-[10px] text-white font-medium opacity-90" style={{ fontFamily: "'Nunito', sans-serif" }}>Tus puntos</div>
                  <div className="text-[20px] font-bold text-white leading-none" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800 }}>{userPoints.toLocaleString('es-CL')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <img src={logoDesafioSawa} alt="Desafío Sawa" className="h-10 object-contain" />
            
            {/* Spacer */}
            <div className="flex-1" />

            {/* Points Badge */}
            <div className="px-3 py-2 rounded-full bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 flex items-center gap-2 flex-shrink-0">
              <img src={coinIcon} alt="Coin" className="w-6 h-6 flex-shrink-0" />
              <div className="flex flex-col">
                <div className="text-[9px] text-white opacity-90 tracking-wide leading-none" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}>Tus puntos</div>
                <div className="text-base font-bold text-white leading-none mt-0.5" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800 }}>{userPoints.toLocaleString('es-CL')}</div>
              </div>
            </div>

            {/* Profile Photo */}
            <button
              onClick={() => navigate('/perfil')}
              className="profile-photo-button w-9 h-9 min-w-[36px] aspect-square rounded-full overflow-hidden transition-all active:scale-95"
              onMouseDown={(e) => e.preventDefault()}
              onTouchStart={(e) => e.preventDefault()}
            >
              <img 
                src={profileImage} 
                alt="Carlos Toledo" 
                className="w-full h-full object-cover pointer-events-none"
              />
            </button>
          </div>
        </div>

        {/* Mobile Toolbar - Debajo del header */}
        <div className="md:hidden px-4 py-3 bg-[#F5F8FB]">
          <div className="flex items-center gap-2">
            {/* Search Bar - Flex para ocupar espacio disponible */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="¿Qué quieres canjear?"
                className="w-full pl-10 pr-3 py-2 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all text-sm shadow-sm"
              />
            </div>

            {/* Filtrar button - Compacto */}
            <button 
              ref={filterButtonRef}
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-300 bg-white active:bg-slate-50 text-slate-700 font-medium transition-colors text-sm flex-shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtrar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pt-4 md:pt-8 bg-[#F5F8FB]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-4 md:pb-8">
          {/* Title and back button */}
          <div className="mb-6 md:mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-700 hover:text-[#FF8000] transition-colors group mb-3 md:mb-4"
            >
              <div className="w-8 h-8 rounded-full bg-[#E8EFF5] group-hover:bg-orange-50 flex items-center justify-center transition-all border border-transparent group-hover:border-[#FF8000]">
                <ChevronLeft className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm">Volver al inicio</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">Todo Catálogo</h1>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onProductClick(product.id)}
              className="group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-md shadow-[#FF8000]/10 hover:shadow-xl hover:shadow-[#FF8000]/20 transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-[8/7] bg-white flex items-center justify-center overflow-hidden p-1.5 md:p-3 border border-gray-100 rounded-lg m-2">
                {product.badge && (
                  <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold ${
                    product.badge.color === 'red'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {product.badge.text}
                  </div>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2 md:p-2.5">
                <div className="text-[11px] md:text-xs font-medium text-slate-500 mb-0.5 uppercase tracking-wider">
                  {product.brand}
                </div>
                <h3 className="text-[12px] md:text-[13px] font-semibold text-slate-900 mb-2 line-clamp-3 leading-tight h-[2.5rem]">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1 md:gap-1.5">
                    <img src={coinIcon} alt="Coin" className="w-5 h-5 md:w-6 md:h-6" />
                    <div>
                      <div className="text-base md:text-lg font-bold text-[#FF8000] leading-none">{product.points.toLocaleString('es-CL')}</div>
                      <div className="text-[10px] text-slate-500 -mt-1.5">puntos</div>
                    </div>
                  </div>
                  {/* Mobile: solo flecha */}
                  <div className="md:hidden w-7 h-7 rounded-full bg-[#FF8000] flex items-center justify-center shadow-[0_0_8px_rgba(255,128,0,0.25)] group-hover:shadow-[0_0_12px_rgba(255,128,0,0.4)] transition-all group-active:scale-95">
                    <ChevronRight className="w-3.5 h-3.5 text-white" />
                  </div>
                  {/* Desktop: botón con texto */}
                  <button className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FF8000] text-white text-xs font-semibold shadow-[0_0_8px_rgba(255,128,0,0.25)] group-hover:shadow-[0_0_12px_rgba(255,128,0,0.4)] transition-all group-active:scale-95">
                    Ver detalle
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Filter/Sort Panel - Mobile only */}
      {isMobile && (
        <FilterSortPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          brands={brands}
          onApply={handleApplyFilters}
        />
      )}
    </div>
  );
}