import { Outlet, useNavigate, useLocation } from 'react-router';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, User, HelpCircle, FileText } from 'lucide-react';
import logoDesafioSawa from './assets/90d0b6e7e40ee202a8c067619d31d9c79731c384.png';
import profileImage from './assets/9f5aa0e583374b6893d8921a6183b99d788006eb.png';
import coinIcon from './assets/db29ff4dc98462b3539ca31d029b8918fad5d4e6.png';
import catalogIcon from './assets/a1d61e7aee26ae9e65cfcc5d4d13290cc8da135b.png';
import walletIcon from './assets/f53abab596a88a7dbe37a1de9340df1fc709bfa0.png';
import shoppingBagIcon from './assets/5430a27800876129e7c102990a58d556b6b36a63.png';
import desafiosIcon from './assets/4a15d0bd599bae1cbcac1fa0399a4fb2828475b7.png';
import muroIcon from './assets/7179fbd1cf901f8eea694e734ad1384f3443cc43.png';
import { ChatSupportIcon } from './components/ChatSupportIcon';

export function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const userPoints = 15000;

  // Función helper para determinar si una ruta está activa
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path === '/catalogo') {
      return location.pathname === '/catalogo';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-[#F5F8FB] overflow-hidden">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div 
        className="hidden md:flex w-64 bg-white flex-col relative rounded-2xl m-2 mr-0 flex-shrink-0 h-[calc(100vh-1rem)] overflow-visible"
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)' }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-center flex-shrink-0">
          <img src={logoDesafioSawa} alt="Desafío Sawa" className="h-14 object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto min-h-0">
          <div className="space-y-1">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center transition-all duration-200 group w-full gap-3 px-4 py-3 rounded-xl ${
                isActive('/')
                  ? 'bg-[#FF8000]/10 text-[#FF8000] hover:bg-[#FF8000]/15'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5'
              }`}
            >
              <img src={muroIcon} alt="" className="w-7 h-7 min-w-[28px] min-h-[28px] flex-shrink-0 object-contain" />
              <span className="font-semibold">Muro</span>
            </button>

            <button
              onClick={() => navigate('/catalogo')}
              className={`flex items-center transition-all duration-200 group w-full gap-3 px-4 py-3 rounded-xl ${
                isActive('/catalogo')
                  ? 'bg-[#FF8000]/10 text-[#FF8000] hover:bg-[#FF8000]/15'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5'
              }`}
            >
              <img src={catalogIcon} alt="" className="w-7 h-7 min-w-[28px] min-h-[28px] flex-shrink-0 object-contain" />
              <span className="font-semibold">Catálogo</span>
            </button>
            
            <button 
              onClick={() => navigate('/desafios')}
              className={`flex items-center transition-all duration-200 group w-full gap-3 px-4 py-3 rounded-xl ${
                isActive('/desafios')
                  ? 'bg-[#FF8000]/10 text-[#FF8000] hover:bg-[#FF8000]/15'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5'
              }`}
            >
              <img src={desafiosIcon} alt="" className="w-7 h-7 min-w-[28px] min-h-[28px] flex-shrink-0 object-contain" />
              <span className="font-semibold">Desafíos</span>
            </button>
            
            <button
              onClick={() => navigate('/billetera')}
              className={`flex items-center transition-all duration-200 group w-full gap-3 px-4 py-3 rounded-xl ${
                isActive('/billetera')
                  ? 'bg-[#FF8000]/10 text-[#FF8000] hover:bg-[#FF8000]/15'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5'
              }`}
            >
              <img src={walletIcon} alt="" className="w-7 h-7 min-w-[28px] min-h-[28px] flex-shrink-0 object-contain" />
              <span className="font-semibold">Billetera</span>
            </button>
            
            <button 
              onClick={() => navigate('/mis-canjes')}
              className={`flex items-center transition-all duration-200 group w-full gap-3 px-4 py-3 rounded-xl ${
                isActive('/mis-canjes')
                  ? 'bg-[#FF8000]/10 text-[#FF8000] hover:bg-[#FF8000]/15'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5'
              }`}
            >
              <img src={shoppingBagIcon} alt="" className="w-7 h-7 min-w-[28px] min-h-[28px] flex-shrink-0 object-contain" />
              <span className="font-semibold">Mis canjes</span>
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={() => navigate('/perfil')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer w-full ${
              isActive('/perfil')
                ? 'bg-[#FF8000]/10'
                : 'hover:bg-[#FF8000]/5'
            }`}
          >
            <img 
              src={profileImage} 
              alt="Carlos Toledo" 
              className="w-10 h-10 rounded-full ring-2 ring-slate-200 object-cover"
            />
            <div className="flex-1 min-w-0 text-left">
              <div className={`text-sm font-medium truncate ${
                isActive('/perfil') ? 'text-[#FF8000]' : 'text-slate-900'
              }`}>
                Carlos Toledo
              </div>
            </div>
          </button>
          <div className="mt-2 space-y-1">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5 rounded-xl transition-all">
              <HelpCircle className="w-4 h-4" />
              <span>Ayuda</span>
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5 rounded-xl transition-all">
              <FileText className="w-4 h-4" />
              <span>Términos y condiciones</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Drawer (Mobile) */}
      <AnimatePresence>
        {profileDrawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 md:hidden flex flex-col"
            >
              {/* Header del drawer */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Mi Perfil</h3>
                <button
                  onClick={() => setProfileDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido del drawer */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col items-center mb-6">
                  <img 
                    src={profileImage} 
                    alt="Carlos Toledo" 
                    className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-[#FF8000]/20"
                  />
                  <h4 className="text-xl font-semibold text-slate-900">Carlos Toledo</h4>
                  <p className="text-sm text-slate-500 mt-1">carlos.toledo@empresa.com</p>
                </div>

                {/* Saldo de puntos */}
                <div className="mb-6 px-4">
                  <div className="rounded-2xl bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] p-4 shadow-lg shadow-[#FF8000]/30">
                    <div className="flex items-center gap-3">
                      <img src={coinIcon} alt="Coin" className="w-12 h-12 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-orange-50 font-medium uppercase tracking-wide">Tu saldo</div>
                        <div className="text-3xl font-bold text-white leading-none my-1">{userPoints.toLocaleString('es-CL')}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menú de opciones */}
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      navigate('/perfil');
                      setProfileDrawerOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
                  >
                    <User className="w-5 h-5 text-slate-400" />
                    <span className="font-medium">Editar perfil</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left">
                    <HelpCircle className="w-5 h-5 text-slate-400" />
                    <span className="font-medium">Ayuda</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <span className="font-medium">Términos y condiciones</span>
                  </button>
                </div>
              </div>

              {/* Footer del drawer */}
              <div className="p-6 border-t border-slate-200">
                <button className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-colors">
                  Cerrar sesión
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <Outlet />

      {/* Chat Support Icon */}
      <ChatSupportIcon />

      {/* Mobile Bottom Navigation */}
      <nav 
        className="md:hidden fixed left-3 right-3 bg-white/90 backdrop-blur-xl rounded-[32px] z-40 border border-slate-200/50"
        style={{ 
          boxShadow: '0 0 40px rgba(15, 23, 42, 0.25)',
          bottom: '12px',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        <div className="grid grid-cols-5 h-16 px-2 py-2 gap-1">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-full transition-all duration-200 ${
              isActive('/')
                ? 'text-[#FF8000] bg-[#FF8000]/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5'
            }`}
          >
            <img src={muroIcon} alt="" className="w-6 h-6 object-contain" />
            <p className={`text-xs ${isActive('/') ? 'font-bold' : 'font-medium'}`}>Muro</p>
          </button>

          <button
            onClick={() => navigate('/catalogo')}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-full transition-all duration-200 ${
              isActive('/catalogo')
                ? 'text-[#FF8000] bg-[#FF8000]/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5'
            }`}
          >
            <img src={catalogIcon} alt="" className="w-6 h-6 object-contain" />
            <p className={`text-xs ${isActive('/catalogo') ? 'font-bold' : 'font-medium'}`}>Catálogo</p>
          </button>
          
          <button 
            onClick={() => navigate('/desafios')}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-full transition-all duration-200 ${
              isActive('/desafios')
                ? 'text-[#FF8000] bg-[#FF8000]/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5'
            }`}
          >
            <img src={desafiosIcon} alt="" className="w-6 h-6 object-contain" />
            <p className={`text-xs ${isActive('/desafios') ? 'font-bold' : 'font-medium'}`}>Desafíos</p>
          </button>
          
          <button
            onClick={() => navigate('/billetera')}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-full transition-all duration-200 ${
              isActive('/billetera')
                ? 'text-[#FF8000] bg-[#FF8000]/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5'
            }`}
          >
            <img src={walletIcon} alt="" className="w-6 h-6 object-contain" />
            <p className={`text-xs ${isActive('/billetera') ? 'font-bold' : 'font-medium'}`}>Billetera</p>
          </button>
          
          <button 
            onClick={() => navigate('/mis-canjes')}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-full transition-all duration-200 ${
              isActive('/mis-canjes')
                ? 'text-[#FF8000] bg-[#FF8000]/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5'
            }`}
          >
            <img src={shoppingBagIcon} alt="" className="w-6 h-6 object-contain" />
            <p className={`text-xs ${isActive('/mis-canjes') ? 'font-bold' : 'font-medium'}`}>Mis canjes</p>
          </button>
        </div>
      </nav>
    </div>
  );
}