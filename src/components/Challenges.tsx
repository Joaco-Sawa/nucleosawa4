import { useNavigate, useSearchParams } from 'react-router';
import { Target, Trophy, TrendingUp, Search, SlidersHorizontal, ChevronDown, Zap, Sparkles, Check, Star, Flag } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import coinIcon from '../assets/db29ff4dc98462b3539ca31d029b8918fad5d4e6.png';
import logoDesafioSawa from '../assets/90d0b6e7e40ee202a8c067619d31d9c79731c384.png';
import logoDogChow from '../assets/ae486996a54fdf7b33dba3dce381a0966a079f4f.png';
import logoJohnDeere from '../assets/881be60a3e27e41c53669ba22a614adc80691979.png';
import bannerBCIPagos from '../assets/be97d3d34fee8a1e19a8ce367fea9e9bb4a89180.png';
import logoBelkin from '../assets/ad08acb91b5b73081d9da06261fae33e9e6257c2.png';
import profileImage from '../assets/9f5aa0e583374b6893d8921a6183b99d788006eb.png';
import { useState, useRef } from 'react';
import { DateRangePicker } from './DateRangePicker';
import { ChallengeBanner, ColorPalette } from './ChallengeBanner';

interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'finished';
  progress: number;
  target: number;
  category: string;
  icon: 'trending' | 'trophy' | 'target' | 'zap';
  unit: string;
  isMonetary?: boolean;
  imageUrl?: string;
  iconifyIcon?: string;
  imageType?: 'banner' | 'icon' | 'custom-banner' | 'logo';
  bannerImage?: string;
  logoUrl?: string;
  colorPalette?: ColorPalette;
  isFeatured?: boolean;
  thresholds: {
    subcumplimiento: number;
    cumplimiento: number;
    sobrecumplimiento: number;
  };
  bonusPoints: number;
  pointsLoaded?: boolean; // Para desafíos finalizados: true = puntos cargados, false = puntos por cargar
}

export function Challenges() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const userPoints = 15000;
  
  // Leer el filtro desde la URL, por defecto 'active'
  const filterStatusFromURL = (searchParams.get('status') as 'active' | 'finished' | 'all') || 'active';
  const [filterStatus, setFilterStatus] = useState<'active' | 'finished' | 'all'>(filterStatusFromURL);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState<string | null>(null);
  const [dateRangeEnd, setDateRangeEnd] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Función helper para actualizar el filtro y la URL
  const updateFilterStatus = (status: 'active' | 'finished' | 'all') => {
    setFilterStatus(status);
    setSearchParams({ status });
  };

  // Mock de desafíos - Diseñados para demostrar todos los estados de cumplimiento
  const mockChallenges: Challenge[] = [
    // NUEVO: Desafío BCI Pagos con banner personalizado
    {
      id: 12,
      title: 'BCI Pagos',
      description: 'Aumenta los folios con transacción BCI Pagos durante marzo',
      points: 6000,
      bonusPoints: 3000,
      startDate: '2026-03-01',
      endDate: '2026-03-20',
      status: 'active',
      progress: 45,
      target: 100,
      category: 'Ventas',
      icon: 'trophy',
      unit: 'folios',
      imageType: 'custom-banner',
      bannerImage: bannerBCIPagos,
      thresholds: { subcumplimiento: 50, cumplimiento: 100, sobrecumplimiento: 150 }
    },
    // Estado 1: Sin progreso (0%)
    {
      id: 1,
      title: 'Desafío de nuevos clientes',
      description: 'Atrae y cierra contratos con clientes nuevos',
      points: 7500,
      bonusPoints: 10000,
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      status: 'active',
      progress: 0,
      target: 15,
      category: 'Ventas',
      icon: 'target',
      unit: 'clientes',
      iconifyIcon: 'mdi:account-multiple-plus',
      imageType: 'banner',
      colorPalette: 'blue',
      thresholds: { subcumplimiento: 50, cumplimiento: 100, sobrecumplimiento: 150 }
    },
    // Estado 2: Progreso parcial - Subcumplimiento (~35%)
    {
      id: 2,
      title: 'Desafío de repuestos',
      description: 'Incrementa tus ventas de repuestos este trimestre',
      points: 3000,
      bonusPoints: 1500,
      startDate: '2026-02-20',
      endDate: '2026-03-25',
      status: 'active',
      progress: 17,
      target: 50,
      category: 'Productividad',
      icon: 'trending',
      unit: 'repuestos',
      iconifyIcon: 'mdi:cog',
      imageType: 'banner',
      colorPalette: 'orange',
      thresholds: { subcumplimiento: 50, cumplimiento: 100, sobrecumplimiento: 150 }
    },
    // Estado 3: Progreso medio - Cerca del umbral del 50% (~48%)
    {
      id: 3,
      title: 'Desafío John Deere',
      description: 'Cierra más deals que nunca este mes',
      points: 8000,
      bonusPoints: 4000,
      startDate: '2026-02-01',
      endDate: '2026-04-03',
      status: 'active',
      progress: 48,
      target: 100,
      category: 'Ventas',
      icon: 'trophy',
      imageUrl: logoJohnDeere,
      imageType: 'banner',
      colorPalette: 'green',
      unit: 'deals',
      thresholds: { subcumplimiento: 50, cumplimiento: 100, sobrecumplimiento: 150 }
    },
    // Estado 4: Subcumplimiento alcanzado (~75%)
    {
      id: 4,
      title: 'Desafío de clientes - 4 hitos',
      description: 'Realiza llamadas de seguimiento a clientes potenciales',
      points: 2500,
      bonusPoints: 1250,
      startDate: '2026-02-15',
      endDate: '2026-04-10',
      status: 'active',
      progress: 75,
      target: 100,
      category: 'Atención al cliente',
      icon: 'zap',
      unit: 'llamadas',
      iconifyIcon: 'mdi:phone-check',
      imageType: 'banner',
      colorPalette: 'pink',
      thresholds: { subcumplimiento: 50, cumplimiento: 100, sobrecumplimiento: 150 }
    },
    // Estado 5: Meta cumplida exactamente (100%)
    {
      id: 5,
      title: 'Desafío de pólizas',
      description: 'Alcanza la meta de ventas de pólizas del mes',
      points: 5000,
      bonusPoints: 2500,
      startDate: '2026-02-01',
      endDate: '2026-04-30',
      status: 'active',
      progress: 2000000,
      target: 2000000,
      category: 'Ventas',
      icon: 'trending',
      unit: 'ventas',
      isMonetary: true,
      isFeatured: true,
      iconifyIcon: 'mdi:folder-check',
      imageType: 'banner',
      colorPalette: 'blue',
      thresholds: { subcumplimiento: 50, cumplimiento: 100, sobrecumplimiento: 150 }
    },
    // Estado 6: Sobrecumplimiento parcial (~125%)
    {
      id: 6,
      title: 'Desafío de capacitación - Ranking',
      description: 'Completa módulos avanzados de formación técnica',
      points: 4000,
      bonusPoints: 2000,
      startDate: '2026-02-01',
      endDate: '2026-04-15',
      status: 'active',
      progress: 125,
      target: 100,
      category: 'Desarrollo',
      icon: 'target',
      unit: '%',
      iconifyIcon: 'mdi:school',
      imageType: 'banner',
      colorPalette: 'purple',
      thresholds: { subcumplimiento: 50, cumplimiento: 100, sobrecumplimiento: 150 }
    },
    // Estado 7: Sobrecumplimiento completo (150%+)
    {
      id: 7,
      title: 'Desafío de innovación',
      description: 'Propón mejoras para optimizar procesos internos',
      points: 6000,
      bonusPoints: 0,
      startDate: '2026-02-10',
      endDate: '2026-03-20',
      status: 'active',
      progress: 30,
      target: 20,
      category: 'Innovación',
      icon: 'zap',
      unit: 'propuestas',
      iconifyIcon: 'mdi:lightbulb-on',
      imageType: 'banner',
      colorPalette: 'orange',
      thresholds: { subcumplimiento: 50, cumplimiento: 100, sobrecumplimiento: 150 }
    },
    // Estado 8: Desafío finalizado (finished)
    {
      id: 8,
      title: 'Desafío de servicio Q1',
      description: 'Completa todos los módulos de capacitación del trimestre',
      points: 4000,
      bonusPoints: 2000,
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      status: 'finished',
      progress: 100,
      target: 100,
      category: 'Desarrollo',
      icon: 'target',
      unit: '%',
      iconifyIcon: 'mdi:trophy-variant',
      imageType: 'banner',
      colorPalette: 'purple',
      thresholds: { subcumplimiento: 50, cumplimiento: 100, sobrecumplimiento: 150 },
      pointsLoaded: true // Puntos ya cargados
    },
    // Estado 9: Desafío finalizado con puntos pendientes de carga
    {
      id: 9,
      title: 'Desafío Dog Chow',
      description: 'Incrementa el engagement con clientes clave durante febrero',
      points: 3500,
      bonusPoints: 1750,
      startDate: '2026-02-01',
      endDate: '2026-02-28',
      status: 'finished',
      progress: 45,
      target: 50,
      category: 'Ventas',
      icon: 'trophy',
      unit: 'unidades',
      imageUrl: logoDogChow,
      imageType: 'banner',
      colorPalette: 'orange',
      thresholds: { subcumplimiento: 50, cumplimiento: 100, sobrecumplimiento: 150 },
      pointsLoaded: false // Puntos aún no cargados
    },
    // Estado 10: Desafío finalizado con sobrecumplimiento
    {
      id: 10,
      title: 'Desafío de ventas enero',
      description: 'Supera las expectativas en ventas del primer mes del año',
      points: 5500,
      bonusPoints: 3500,
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      status: 'finished',
      progress: 4500000,
      target: 3000000,
      category: 'Ventas',
      icon: 'trending',
      unit: 'ventas',
      isMonetary: true,
      iconifyIcon: 'mdi:cash-multiple',
      imageType: 'banner',
      colorPalette: 'green',
      thresholds: { subcumplimiento: 50, cumplimiento: 100, sobrecumplimiento: 150 },
      pointsLoaded: true // Puntos ya cargados
    },
    // Estado 11: Desafío finalizado SIN alcanzar subcumplimiento (menos del 50%)
    {
      id: 11,
      title: 'Desafío de referencias corporativas',
      description: 'Genera nuevas oportunidades de negocio a través de referencias',
      points: 4500,
      bonusPoints: 2250,
      startDate: '2026-01-15',
      endDate: '2026-02-15',
      status: 'finished',
      progress: 18,
      target: 60,
      category: 'Ventas',
      icon: 'target',
      unit: 'referencias',
      iconifyIcon: 'mdi:account-arrow-right',
      imageType: 'banner',
      colorPalette: 'blue',
      thresholds: { subcumplimiento: 50, cumplimiento: 100, sobrecumplimiento: 150 },
      pointsLoaded: false // Puntos aún no cargados
    },
    // Estado 13: Desafío simple - Solo 0% y 100% (sin subcumplimiento ni sobrecumplimiento)
    {
      id: 13,
      title: 'Desafío Accesorios Belkin',
      description: '¡Meta alcanzada! Has completado la venta de accesorios Belkin',
      points: 3000,
      bonusPoints: 0, // Sin bonus
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      status: 'active',
      progress: 80,
      target: 80,
      category: 'Desarrollo',
      icon: 'award',
      unit: 'accesorios',
      imageUrl: logoBelkin,
      imageType: 'banner',
      colorPalette: 'teal',
      thresholds: { subcumplimiento: 0, cumplimiento: 80, sobrecumplimiento: 0 }, // Solo 80 accesorios
      pointsLoaded: false
    }
  ];

  // Calcular días restantes
  const getDaysRemaining = (endDate: string) => {
    // FECHA CONGELADA - No avanza automáticamente
    const today = new Date('2026-03-19');
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filtros
  const filteredChallenges = mockChallenges.filter((challenge) => {
    // Determinar el status real basado en la fecha de término
    const daysRemaining = getDaysRemaining(challenge.endDate);
    const actualStatus = daysRemaining <= 0 ? 'finished' : challenge.status;
    
    if (filterStatus !== 'all' && actualStatus !== filterStatus) return false;
    if (searchKeyword && !challenge.title.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    if (dateRangeStart && dateRangeEnd) {
      const startDate = new Date(dateRangeStart);
      const endDate = new Date(dateRangeEnd);
      const challengeStartDate = new Date(challenge.startDate);
      const challengeEndDate = new Date(challenge.endDate);
      if (challengeEndDate < startDate || challengeStartDate > endDate) return false;
    }
    return true;
  }).sort((a, b) => {
    // Calcular status real para el ordenamiento
    const daysRemainingA = getDaysRemaining(a.endDate);
    const daysRemainingB = getDaysRemaining(b.endDate);
    const actualStatusA = daysRemainingA <= 0 ? 'finished' : a.status;
    const actualStatusB = daysRemainingB <= 0 ? 'finished' : b.status;
    
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if (actualStatusA === 'finished' && actualStatusB !== 'finished') return 1;
    if (actualStatusA !== 'finished' && actualStatusB === 'finished') return -1;
    const daysA = getDaysRemaining(a.endDate);
    const daysB = getDaysRemaining(b.endDate);
    return daysA - daysB;
  });

  // Función helper para obtener íconos
  const getChallengeIcon = (iconName: Challenge['icon']) => {
    const iconClass = "w-6 h-6 text-[#FF8000]";
    switch (iconName) {
      case 'trending': return <TrendingUp className={iconClass} />;
      case 'trophy': return <Trophy className={iconClass} />;
      case 'target': return <Target className={iconClass} />;
      case 'zap': return <Zap className={iconClass} />;
      default: return <TrendingUp className={iconClass} />;
    }
  };

  // Estilo según días restantes
  const getDaysRemainingStyle = (days: number) => {
    if (days <= 3) {
      return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-700', label: `Quedan ${days} días` };
    } else if (days <= 7) {
      return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-700', label: `Quedan ${days} días` };
    } else {
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-700', label: `Quedan ${days} días` };
    }
  };

  // Calcular porcentaje de progreso
  const calculateProgressPercentage = (progress: number, target: number) => {
    return Math.min((progress / target) * 100, 200);
  };

  // Calcular puntos totales que se obtendrán
  const calculateTotalPoints = (
    progress: number,
    target: number,
    basePoints: number,
    bonusPoints: number,
    thresholds: Challenge['thresholds']
  ) => {
    // Verificar si es desafío "todo o nada" (sin subcumplimiento ni sobrecumplimiento)
    const isAllOrNothing = thresholds.subcumplimiento === 0 && thresholds.sobrecumplimiento === 0;
    
    if (isAllOrNothing) {
      // Para desafíos "todo o nada": solo ganas puntos al alcanzar la meta
      return progress >= target ? basePoints : 0;
    }
    
    // Lógica estándar para desafíos con subcumplimiento/sobrecumplimiento
    const percentage = calculateProgressPercentage(progress, target);
    if (percentage >= thresholds.sobrecumplimiento) {
      const maxBasePoints = basePoints + bonusPoints;
      return Math.floor(maxBasePoints * (percentage / 100));
    } else if (percentage >= thresholds.cumplimiento) {
      return basePoints;
    } else if (percentage >= thresholds.subcumplimiento) {
      return Math.floor(basePoints * 0.6);
    } else {
      return 0;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 w-full max-w-full md:h-[calc(100vh-1rem)] md:overflow-y-auto md:m-2 overflow-y-auto overflow-x-hidden pb-[88px] md:pb-0">
      {/* Header */}
      <header 
        className={`bg-white md:bg-white/95 md:backdrop-blur-md transition-all duration-300 md:rounded-2xl md:sticky md:top-0 md:z-30 flex-shrink-0`}
        style={window.innerWidth >= 768 ? { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)' } : {}}
      >
        {/* Desktop Header */}
        <div className="hidden md:block py-[25px] px-6">
          <div className="flex items-center gap-3">
            {/* Filtros de estado agrupados */}
            <div className="flex items-center gap-0 bg-white border border-slate-200 rounded-full p-1">
              <button
                onClick={() => updateFilterStatus('active')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  filterStatus === 'active' ? 'bg-[#FF8000] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => updateFilterStatus('finished')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  filterStatus === 'finished' ? 'bg-[#FF8000] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Finalizados
              </button>
              <button
                onClick={() => updateFilterStatus('all')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  filterStatus === 'all' ? 'bg-[#FF8000] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Todos
              </button>
            </div>

            <div className="flex-1" />
            
            <div className="flex items-center gap-3">
              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Buscar desafío..."
                  className="w-[240px] pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all text-sm"
                />
              </div>

              {/* Filtro de fecha */}
              <div className="relative" ref={datePickerRef}>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 hover:border-[#FF8000]/30 transition-all text-sm font-medium text-slate-700"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>
                    {dateRangeStart && dateRangeEnd
                      ? `${new Date(dateRangeStart).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${new Date(dateRangeEnd).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`
                      : 'Filtrar'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showDatePicker && (
                  <div className="absolute top-full right-0 mt-2 z-50">
                    <DateRangePicker
                      onClose={() => setShowDatePicker(false)}
                      onApply={(start, end) => {
                        setDateRangeStart(start);
                        setDateRangeEnd(end);
                        setShowDatePicker(false);
                      }}
                      onClear={() => {
                        setDateRangeStart(null);
                        setDateRangeEnd(null);
                        setShowDatePicker(false);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Points Badge */}
              <div className="min-w-[140px] h-[52px] w-fit rounded-xl bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 hover:shadow-lg hover:shadow-[#FF8000]/30 transition-all duration-300 px-3 flex items-center gap-3 cursor-pointer flex-shrink-0">
                <img src={coinIcon} alt="Coin" className="w-8 h-8 flex-shrink-0" />
                <div className="flex flex-col pr-2">
                  <div className="text-[10px] text-white font-medium opacity-90">Tus puntos</div>
                  <div className="text-[20px] font-bold text-white leading-none">{userPoints.toLocaleString('es-CL')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={logoDesafioSawa} alt="Desafío Sawa" className="h-10 object-contain" />
            <div className="flex-1" />
            <div className="px-3 py-2 rounded-full bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 flex items-center gap-2 flex-shrink-0">
              <img src={coinIcon} alt="Coin" className="w-6 h-6 flex-shrink-0" />
              <div className="flex flex-col">
                <div className="text-[9px] text-white opacity-90 tracking-wide leading-none">Tus puntos</div>
                <div className="text-base font-bold text-white leading-none mt-0.5">{userPoints.toLocaleString('es-CL')}</div>
              </div>
            </div>

            {/* Profile Photo */}
            <button
              onClick={() => navigate('/perfil')}
              className="w-9 h-9 min-w-[36px] aspect-square rounded-full ring-2 ring-slate-200 overflow-hidden transition-all active:scale-95 focus:outline-none active:outline-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <img 
                src={profileImage} 
                alt="Carlos Toledo" 
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        {/* Mobile Toolbar */}
        <div className="md:hidden px-4 py-3 bg-[#F5F8FB]">
          <div className="flex items-center gap-0 bg-white border border-slate-200 rounded-full p-1 mb-3">
            <button
              onClick={() => updateFilterStatus('active')}
              className={`flex-1 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                filterStatus === 'active' ? 'bg-[#FF8000] text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Activos
            </button>
            <button
              onClick={() => updateFilterStatus('finished')}
              className={`flex-1 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                filterStatus === 'finished' ? 'bg-[#FF8000] text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Finalizados
            </button>
            <button
              onClick={() => updateFilterStatus('all')}
              className={`flex-1 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                filterStatus === 'all' ? 'bg-[#FF8000] text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Todos
            </button>
          </div>

          <div className="flex gap-2 relative" ref={datePickerRef}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-10 pr-3 py-2 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all text-sm shadow-sm"
              />
            </div>
            
            {/* Botón de filtro por fecha */}
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-300 bg-white active:bg-slate-50 text-slate-700 font-medium transition-colors text-sm flex-shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtrar</span>
            </button>
            
            {/* Date Picker para mobile */}
            {showDatePicker && (
              <div className="absolute top-full right-0 mt-2 z-50">
                <DateRangePicker
                  onClose={() => setShowDatePicker(false)}
                  onApply={(start, end) => {
                    setDateRangeStart(start);
                    setDateRangeEnd(end);
                    setShowDatePicker(false);
                  }}
                  onClear={() => {
                    setDateRangeStart(null);
                    setDateRangeEnd(null);
                    setShowDatePicker(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-4 md:pt-6 pb-4 md:pb-6 w-full">
        <div className="mb-6">
          <p className="text-sm md:text-base text-slate-600">
            Completa desafíos y gana puntos extra para seguir canjeando
          </p>
        </div>

        {/* Grid de desafíos */}
        <AnimatePresence mode="wait">
          {filteredChallenges.length > 0 ? (
            <motion.div
              key="challenges-grid"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              {filteredChallenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/desafios/${challenge.id}`)}
                  className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 relative cursor-pointer ${
                    challenge.isFeatured
                      ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-400/30 border-0'
                      : 'border border-slate-200 hover:border-[#FF8000]/30 hover:shadow-lg hover:shadow-[#FF8000]/10'
                  }`}
                >
                  {/* Badge de "Desafío principal" */}
                  {challenge.isFeatured && (
                    <div className="absolute top-3 left-3 z-10">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg shadow-amber-500/40">
                        <Star className="w-3 h-3 text-white fill-white" strokeWidth={2.5} />
                        <span className="text-[10px] font-bold text-white tracking-wide">
                          Desafío principal
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Imagen/Banner */}
                  {challenge.imageType === 'custom-banner' && challenge.bannerImage && (
                    <>
                      <div className="relative h-32 w-full overflow-hidden rounded-t-2xl bg-slate-100">
                        {/* Background blurred - Opción 1 */}
                        <div 
                          className={`absolute inset-0 scale-110 blur-2xl opacity-60 ${getDaysRemaining(challenge.endDate) <= 0 || challenge.status === 'finished' ? 'grayscale' : ''}`}
                          style={{
                            backgroundImage: `url(${challenge.bannerImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                        
                        {/* Imagen principal */}
                        <img 
                          src={challenge.bannerImage} 
                          alt={challenge.title}
                          className={`relative z-10 w-full h-full object-contain ${getDaysRemaining(challenge.endDate) <= 0 || challenge.status === 'finished' ? 'grayscale' : ''}`}
                        />
                        
                        <div className="absolute top-3 right-3 z-20">
                          {(() => {
                            const days = getDaysRemaining(challenge.endDate);
                            const actualStatus = days <= 0 ? 'finished' : challenge.status;
                            
                            if (actualStatus === 'active') {
                              const style = getDaysRemainingStyle(days);
                              return (
                                <span 
                                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border} backdrop-blur-sm`}
                                  style={{ borderWidth: '0.5px' }}
                                >
                                  {style.label}
                                </span>
                              );
                            } else {
                              return (
                                <span 
                                  className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-600 backdrop-blur-sm"
                                  style={{ borderWidth: '0.5px' }}
                                >
                                  {challenge.pointsLoaded 
                                    ? 'Finalizado - Puntos cargados' 
                                    : 'Finalizado - Puntos por cargar'}
                                </span>
                              );
                            }
                          })()}
                        </div>
                      </div>
                      
                      <div className="px-5 pt-4 pb-1.5">
                        <h3 className="text-base font-bold text-[#45556C] leading-tight">
                          {challenge.title}
                        </h3>
                      </div>
                    </>
                  )}

                  {/* Imagen/Banner */}
                  {(challenge.imageUrl || challenge.iconifyIcon) && challenge.imageType === 'banner' && (
                    <>
                      <ChallengeBanner 
                        imageUrl={challenge.imageUrl}
                        iconifyIcon={challenge.iconifyIcon}
                        title={challenge.title}
                        colorPalette={challenge.colorPalette || 'blue'}
                        isFinished={getDaysRemaining(challenge.endDate) <= 0 || challenge.status === 'finished'}
                      >
                        <div className="absolute top-3 right-3">
                          {(() => {
                            const days = getDaysRemaining(challenge.endDate);
                            const actualStatus = days <= 0 ? 'finished' : challenge.status;
                            
                            if (actualStatus === 'active') {
                              const style = getDaysRemainingStyle(days);
                              return (
                                <span 
                                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border} backdrop-blur-sm`}
                                  style={{ borderWidth: '0.5px' }}
                                >
                                  {style.label}
                                </span>
                              );
                            } else {
                              return (
                                <span 
                                  className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-600 backdrop-blur-sm"
                                  style={{ borderWidth: '0.5px' }}
                                >
                                  {challenge.pointsLoaded 
                                    ? 'Finalizado - Puntos cargados' 
                                    : 'Finalizado - Puntos por cargar'}
                                </span>
                              );
                            }
                          })()}
                        </div>
                      </ChallengeBanner>
                      
                      <div className="px-5 pt-4 pb-1.5">
                        <h3 className="text-xl md:text-base font-bold text-[#45556C] leading-tight">
                          {challenge.title}
                        </h3>
                      </div>
                    </>
                  )}

                  {/* Banner con logo (para desafíos tipo 'logo') */}
                  {challenge.logoUrl && challenge.imageType === 'logo' && (
                    <>
                      <div 
                        className={`relative h-32 overflow-hidden ${getDaysRemaining(challenge.endDate) <= 0 || challenge.status === 'finished' ? 'grayscale' : ''}`}
                        style={{ 
                          background: challenge.colorPalette === 'gold' 
                            ? 'linear-gradient(135deg, #FFF9E6 0%, #FFD700 100%)'
                            : 'linear-gradient(135deg, #E3F2FD 0%, #90CAF9 100%)'
                        }}
                      >
                        {/* Logo centrado */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="max-w-[140px] px-6">
                            <img 
                              src={challenge.logoUrl} 
                              alt={challenge.title}
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className="absolute top-3 right-3">
                          {(() => {
                            const days = getDaysRemaining(challenge.endDate);
                            const actualStatus = days <= 0 ? 'finished' : challenge.status;
                            
                            if (actualStatus === 'active') {
                              const style = getDaysRemainingStyle(days);
                              return (
                                <span 
                                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border} backdrop-blur-sm`}
                                  style={{ borderWidth: '0.5px' }}
                                >
                                  {style.label}
                                </span>
                              );
                            } else {
                              return (
                                <span 
                                  className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-600 backdrop-blur-sm"
                                  style={{ borderWidth: '0.5px' }}
                                >
                                  {challenge.pointsLoaded 
                                    ? 'Finalizado - Puntos cargados' 
                                    : 'Finalizado - Puntos por cargar'}
                                </span>
                              );
                            }
                          })()}
                        </div>
                      </div>
                      
                      <div className="px-5 pt-4 pb-1.5">
                        <h3 className="text-base font-bold text-[#45556C] leading-tight">
                          {challenge.title}
                        </h3>
                      </div>
                    </>
                  )}

                  {/* Progreso */}
                  <div className="px-5 pt-1 pb-0">
                    {(() => {
                      const progressPercentage = calculateProgressPercentage(challenge.progress, challenge.target);
                      const milestones = [
                        { percentage: 33.33, shortLabel: '60%', completed: progressPercentage >= challenge.thresholds.subcumplimiento },
                        { percentage: 66.67, shortLabel: '100%', completed: progressPercentage >= challenge.thresholds.cumplimiento, isMeta: true },
                        { percentage: 100, shortLabel: '150%', completed: progressPercentage >= challenge.thresholds.sobrecumplimiento }
                      ];
                      
                      return (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-slate-500">Progreso</span>
                            <span className="text-sm font-bold text-[#45556C]">
                              {challenge.isMonetary ? (
                                `$${challenge.progress.toLocaleString('es-CL')} / $${challenge.target.toLocaleString('es-CL')}`
                              ) : (
                                `${challenge.progress} / ${challenge.target} ${challenge.unit}`
                              )}
                            </span>
                          </div>
                          
                          {/* Barra de progreso */}
                          <div className="relative mb-6 mt-5">
                            {(() => {
                              // Verificar si es desafío "todo o nada"
                              const isAllOrNothing = challenge.thresholds.subcumplimiento === 0 && challenge.thresholds.sobrecumplimiento === 0;
                              
                              return (
                                <>
                                  {/* Barra de fondo continua */}
                                  <div className="w-full h-4 rounded-full bg-slate-200 overflow-hidden relative">
                                    {/* Barra de progreso verde (0% - 100%) */}
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ 
                                        width: isAllOrNothing 
                                          ? `${Math.min(progressPercentage, 100)}%` 
                                          : `${Math.min((Math.min(progressPercentage, 100) / 150) * 100, 66.67)}%`
                                      }}
                                      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                                      className="absolute left-0 h-full bg-gradient-to-r from-[#3BAF39] to-[#65F063] rounded-full overflow-hidden"
                                    >
                                      <div 
                                        className="absolute inset-0 rounded-full pointer-events-none"
                                        style={{
                                          boxShadow: 'inset 0 3px 9px 0 rgba(255, 255, 255, 0.8)',
                                          mixBlendMode: 'overlay'
                                        }}
                                      />
                                    </motion.div>
                                    
                                    {/* Barra de progreso dorada (100% - 150%) - Solo visible en sobrecumplimiento */}
                                    {progressPercentage > 100 && !isAllOrNothing && (
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ 
                                          width: `${Math.min(((progressPercentage - 100) / 50) * 33.33, 33.33)}%`
                                        }}
                                        transition={{ duration: 1, ease: 'easeOut', delay: 1.2 }}
                                        className="absolute h-full bg-gradient-to-r from-[#DC943A] to-[#FFD321] rounded-full overflow-hidden"
                                        style={{ left: '66.67%' }}
                                      >
                                        <div 
                                          className="absolute inset-0 rounded-full pointer-events-none"
                                          style={{
                                            boxShadow: 'inset 0 3px 9px 0 rgba(255, 255, 255, 0.8)',
                                            mixBlendMode: 'overlay'
                                          }}
                                        />
                                      </motion.div>
                                    )}
                                  </div>
                                </>
                              );
                            })()}

                            {/* Marcadores flotantes sin labels */}
                            {(() => {
                              // Determinar si es desafío "todo o nada"
                              const isAllOrNothing = challenge.thresholds.subcumplimiento === 0 && challenge.thresholds.sobrecumplimiento === 0;
                              
                              // Determinar si es desafío con 4 hitos visibles (25%, 50%, 100%, 150%)
                              const isClientChallenge = challenge.id === 4;
                              
                              // Calcular puntos según progreso
                              const subcumplimientoPoints = Math.floor(challenge.points * 0.5);
                              const cumplimientoPoints = challenge.points;
                              const sobrecumplimientoPoints = challenge.points + challenge.bonusPoints;
                              const inicio25Points = isClientChallenge ? Math.floor(challenge.points * 0.25) : 0;
                              
                              // Definir los hitos según el tipo de desafío
                              const milestones = isAllOrNothing
                                ? [
                                    // Desafío "todo o nada": solo inicio (oculto) y meta al 100%
                                    { percentage: 0, completed: true, isMeta: false, isBonus: false },
                                    { percentage: 100, completed: challenge.progress >= challenge.target, isMeta: true, isBonus: false }
                                  ]
                                : isClientChallenge 
                                  ? [
                                      // Inicio (0%) - oculto
                                      { percentage: 0, completed: true, isMeta: false, isBonus: false },
                                      // 25% - posición simétrica
                                      { percentage: 25, completed: progressPercentage >= 25, isMeta: false, isBonus: false },
                                      // 50% - posición simétrica
                                      { percentage: 50, completed: progressPercentage >= challenge.thresholds.subcumplimiento, isMeta: false, isBonus: false },
                                      // 100% (Meta) - posición simétrica
                                      { percentage: 75, completed: progressPercentage >= challenge.thresholds.cumplimiento, isMeta: true, isBonus: false },
                                      // 150% (Bonus) - posición simétrica
                                      { percentage: 100, completed: progressPercentage >= challenge.thresholds.sobrecumplimiento, isMeta: false, isBonus: true }
                                    ]
                                  : [
                                      // Inicio (0%) - oculto
                                      { percentage: 0, completed: true, isMeta: false, isBonus: false },
                                      // 50% - posición simétrica
                                      { percentage: 33.33, completed: progressPercentage >= challenge.thresholds.subcumplimiento, isMeta: false, isBonus: false },
                                      // 100% (Meta) - posición simétrica
                                      { percentage: 66.67, completed: progressPercentage >= challenge.thresholds.cumplimiento, isMeta: true, isBonus: false },
                                      // 150% (Bonus) - posición simétrica
                                      { percentage: 100, completed: progressPercentage >= challenge.thresholds.sobrecumplimiento, isMeta: false, isBonus: true }
                                    ];

                              return milestones.map((m, idx) => {
                                const isMeta = m.isMeta;
                                const isFirst = idx === 0;
                                const isLast = idx === milestones.length - 1;
                                const transformX = isFirst ? '0%' : isLast ? '-100%' : '-50%';

                                return (
                                  <div
                                    key={idx}
                                    className="absolute"
                                    style={{
                                      left: `${m.percentage}%`,
                                      top: '8px',
                                      transform: `translate(${transformX}, -50%)`
                                    }}
                                  >
                                    {/* Círculo marcador */}
                                    <motion.div
                                      className={`${isMeta ? 'w-9 h-9' : (isAllOrNothing ? 'w-8 h-8' : (isClientChallenge ? (idx === 1 || idx === 2 || idx === 4 ? 'w-6 h-6' : 'w-8 h-8') : (idx === 1 || idx === 3 ? 'w-6 h-6' : 'w-8 h-8')))} rounded-full flex items-center justify-center text-xs font-bold transition-all border-[3px] ${
                                        idx === 0
                                          ? 'bg-slate-100 text-slate-400 border-slate-300 opacity-0'
                                          : isAllOrNothing
                                            ? (m.completed
                                              ? 'bg-[#47CA45] text-white border-[#008236]/50'
                                              : 'bg-white text-[#8BDF89] border-[#8BDF89]')
                                            : isClientChallenge
                                            ? (idx === 1
                                              ? m.completed
                                                ? 'bg-[#47CA45] text-white border-[#008236]/50'
                                                : 'bg-white text-slate-400 border-[#E2E8F0]'
                                              : idx === 2
                                                ? m.completed
                                                  ? 'bg-[#47CA45] text-white border-[#008236]/50'
                                                  : 'bg-white text-slate-400 border-[#E2E8F0]'
                                                : idx === 3
                                                  ? m.completed
                                                    ? 'bg-[#47CA45] text-white border-[#008236]/50'
                                                    : 'bg-white text-[#8BDF89] border-[#8BDF89]'
                                                  : idx === 4
                                                    ? m.completed
                                                      ? 'bg-[#FFD321] text-white border-[#DC943A]'
                                                      : 'bg-white text-[#FFDF5C] border-[#FFDF5C]'
                                                    : 'bg-white text-slate-400 border-white')
                                            : (idx === 1
                                              ? m.completed
                                                ? 'bg-[#47CA45] text-white border-[#008236]/50'
                                                : 'bg-white text-slate-400 border-[#E2E8F0]'
                                              : idx === 2
                                                ? m.completed
                                                  ? 'bg-[#47CA45] text-white border-[#008236]/50'
                                                  : 'bg-white text-[#8BDF89] border-[#8BDF89]'
                                                : idx === 3
                                                  ? m.completed
                                                    ? 'bg-[#FFD321] text-white border-[#DC943A]'
                                                    : 'bg-white text-[#FFDF5C] border-[#FFDF5C]'
                                                  : 'bg-white text-slate-400 border-white')
                                      }`}
                                      style={isMeta && m.completed ? {
                                        boxShadow: '0 4px 8px rgba(71, 202, 69, 0.6)'
                                      } : {}}
                                      animate={isMeta && m.completed ? {
                                        scale: [1, 1.15, 1],
                                        boxShadow: ['0 4px 8px rgba(71, 202, 69, 0.6)', '0 4px 10px rgba(71, 202, 69, 0.8)', '0 4px 8px rgba(71, 202, 69, 0.6)']
                                      } : {}}
                                      transition={isMeta && m.completed ? {
                                        duration: 1.2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                      } : {}}
                                    >
                                      {(isAllOrNothing ? (
                                        idx === 1 ? (
                                          <Flag className="w-4 h-4" strokeWidth={2.5} fill="currentColor" />
                                        ) : null
                                      ) : isClientChallenge ? (
                                        idx === 1 ? (
                                          m.completed ? <Check className="w-3 h-3" strokeWidth={3} /> : null
                                        ) : idx === 2 ? (
                                          m.completed ? <Check className="w-3 h-3" strokeWidth={3} /> : null
                                        ) : idx === 3 ? (
                                          <Flag className="w-4 h-4" strokeWidth={2.5} fill="currentColor" />
                                        ) : idx === 4 ? (
                                          <Star className="w-3 h-3" strokeWidth={2.5} fill="currentColor" />
                                        ) : null
                                      ) : (
                                        idx === 1 ? (
                                          m.completed ? <Check className="w-3 h-3" strokeWidth={3} /> : null
                                        ) : idx === 2 ? (
                                          <Flag className="w-4 h-4" strokeWidth={2.5} fill="currentColor" />
                                        ) : idx === 3 ? (
                                          <Star className="w-3 h-3" strokeWidth={2.5} fill="currentColor" />
                                        ) : null
                                      ))}
                                    </motion.div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
                    {(() => {
                      const currentPoints = calculateTotalPoints(
                        challenge.progress,
                        challenge.target,
                        challenge.points,
                        challenge.bonusPoints,
                        challenge.thresholds
                      );
                      const maxPoints = challenge.points; // Puntos al cumplir el 100% (meta)
                      
                      return (
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-semibold text-slate-500 block leading-tight">
                              {challenge.status === 'finished' 
                                ? (challenge.pointsLoaded ? 'Puntos cargados' : (currentPoints === 0 ? 'Puntos alcanzados' : 'Puntos por cargar'))
                                : 'Vas ganando'
                              }
                            </span>
                            <p className="text-xs text-slate-400 mt-0 leading-tight">
                              {challenge.status === 'active'
                                ? '*Sujeto a revisión'
                                : challenge.id === 9 
                                  ? '*Sujeto a revisión'
                                  : challenge.status === 'finished' && !challenge.pointsLoaded && currentPoints > 0
                                    ? 'Tus puntos serán cargados durante los primeros 5 días hábiles del próximo mes.'
                                    : '*Sujeto a revisión'
                              }
                            </p>
                          </div>
                          <div 
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border" 
                            style={{ borderColor: '#EAEFF5' }}
                          >
                            <img src={coinIcon} alt="Coin" className="w-5 h-5 flex-shrink-0" />
                            <span className="text-base">
                              <span className="font-bold text-[#FF8000]">{currentPoints.toLocaleString('es-CL')}</span>
                              <span className="text-slate-500 font-normal"> / {maxPoints.toLocaleString('es-CL')}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-[#45556C] mb-2">
                No se encontraron desafíos
              </h3>
              <p className="text-slate-600">
                Prueba con otros filtros o palabras clave
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}