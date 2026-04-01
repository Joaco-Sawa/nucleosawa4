import { Search, Menu, ChevronDown, Sparkles, Tag, LogOut, Wallet } from 'lucide-react';
import logoDesafioSawa from '../assets/90d0b6e7e40ee202a8c067619d31d9c79731c384.png';
import profileImage from '../assets/9f5aa0e583374b6893d8921a6183b99d788006eb.png';
import coinIcon from '../assets/db29ff4dc98462b3539ca31d029b8918fad5d4e6.png';

import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

interface HeaderProps {
  userPoints: number;
  categoriesOpen: boolean;
  setCategoriesOpen: (open: boolean) => void;
  setSelectedCategory: (id: number) => void;
  setProfileDrawerOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  categoriesButtonRef: React.RefObject<HTMLButtonElement>;
  setMenuPosition: (position: { top: number; left: number }) => void;
  categories: Array<{ id: number; name: string; image: string; subcategories: any[] }>;
}

export function Header({
  userPoints,
  categoriesOpen,
  setCategoriesOpen,
  setSelectedCategory,
  setProfileDrawerOpen,
  setMobileMenuOpen,
  categoriesButtonRef,
  setMenuPosition,
  categories
}: HeaderProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header 
      className={`bg-white md:bg-white/95 md:backdrop-blur-md transition-all duration-300 md:rounded-2xl md:sticky md:top-0 md:z-30 flex-shrink-0`}
      style={window.innerWidth >= 768 ? { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)' } : {}}
    >
      {/* Desktop Header */}
      <div className="hidden md:block py-[25px] px-6">
        <div className="flex items-center justify-between gap-8">
          {/* Navegación horizontal izquierda */}
          <div className="flex items-center gap-1">
            {/* Mega-menú de Categorías */}
            <div className="relative">
              <button
                ref={categoriesButtonRef}
                onClick={() => {
                  setCategoriesOpen(!categoriesOpen);
                  if (!categoriesOpen) {
                    setSelectedCategory(categories[0].id);
                    if (categoriesButtonRef.current) {
                      const rect = categoriesButtonRef.current.getBoundingClientRect();
                      setMenuPosition({ 
                        top: rect.bottom + window.scrollY, 
                        left: rect.left + window.scrollX 
                      });
                    }
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-[#F1F5F9] text-slate-700 hover:bg-[#E1E5E9] transition-all"
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}
              >
                <Menu className="w-4 h-4" />
                <span>Categorías</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {/* Links directos */}
            <button className="px-3 py-2 text-sm font-semibold text-[#00BF29] hover:text-[#00A024] transition-colors flex items-center gap-1.5 cursor-pointer" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
              <Sparkles className="w-4 h-4" />
              Novedades
            </button>
            <button className="px-3 py-2 text-sm font-semibold text-[#FF8000] hover:text-[#FF8000] transition-colors flex items-center gap-1.5 cursor-pointer" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
              <Tag className="w-4 h-4" />
              Ofertas
            </button>
            <button
              onClick={() => navigate('/billetera')}
              className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer"
              style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}
            >
              <Wallet className="w-4 h-4" />
              Billetera
            </button>
          </div>
          
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
            
            {/* Points Badge */}
            <div className="min-w-[140px] h-[52px] w-fit rounded-xl bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 hover:shadow-lg hover:shadow-[#FF8000]/30 transition-all duration-300 px-3 flex items-center gap-3 cursor-pointer flex-shrink-0">
              {/* Icono de moneda */}
              <img src={coinIcon} alt="Coin" className="w-8 h-8 flex-shrink-0" />
              {/* Texto de puntos */}
              <div className="flex flex-col pr-2">
                <div className="text-[10px] text-white font-medium opacity-90" style={{ fontFamily: "'Nunito', sans-serif" }}>Tus puntos</div>
                <div className="text-[20px] font-bold text-white leading-none" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800 }}>{userPoints.toLocaleString('es-CL')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden px-4 py-3 bg-white">
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

          {/* Profile Photo with Logout Menu */}
          <div className="relative">
            <button
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
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

            {showLogoutMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLogoutMenu(false)}
                />
                <div className="absolute right-0 top-12 z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]">
                  <button
                    onClick={() => navigate('/perfil')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Ver perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Toolbar - Debajo del header */}
      <div className="md:hidden px-4 py-3 bg-[#F5F8FB]">
        {/* Search Bar - Ancho completo */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="¿Qué quieres canjear?"
            className="w-full pl-10 pr-3 py-2 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all text-sm shadow-sm"
          />
        </div>
      </div>

      {/* Mobile Section Links - Accesos a secciones */}
      <div className="md:hidden px-4 pb-3 bg-[#F5F8FB]">
        <div className="flex gap-2 overflow-x-auto pb-0 -mx-1 px-1 scrollbar-hide">
          {/* Botón Categorías */}
          <button
            onClick={() => {
              setSelectedCategory(categories[0].id);
              setMobileMenuOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#E8EFF5] text-slate-700 active:bg-[#D8DFE5] transition-all flex-shrink-0"
            style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900 }}
          >
            <Menu className="w-4 h-4" />
            <span>Categorías</span>
          </button>

          {/* Link: Novedades */}
          <button className="px-4 py-2 text-sm font-semibold text-[#00BF29] active:text-[#00A024] transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
            <Sparkles className="w-4 h-4" />
            <span>Novedades</span>
          </button>

          {/* Link: Ofertas */}
          <button className="px-4 py-2 text-sm font-semibold text-[#FF8000] active:text-[#FF8000] transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
            <Tag className="w-4 h-4" />
            <span>Ofertas</span>
          </button>

          {/* Link: Billetera */}
          <button
            onClick={() => navigate('/billetera')}
            className="px-4 py-2 text-sm font-semibold text-slate-700 active:text-slate-900 transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer hover:text-slate-900"
            style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}
          >
            <Wallet className="w-4 h-4" />
            <span>Billetera</span>
          </button>
        </div>
      </div>
    </header>
  );
}