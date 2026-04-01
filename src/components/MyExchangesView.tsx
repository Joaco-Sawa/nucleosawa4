import { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Package, Clock, CheckCircle2, Truck, Search, Calendar, HelpCircle, Download, ExternalLink, ChevronLeft, X, MapPin, SlidersHorizontal } from 'lucide-react';
import coinIcon from '../assets/db29ff4dc98462b3539ca31d029b8918fad5d4e6.png';
import profileImage from '../assets/9f5aa0e583374b6893d8921a6183b99d788006eb.png';
import logoDesafioSawa from '../assets/90d0b6e7e40ee202a8c067619d31d9c79731c384.png';
import productImage1 from '../assets/aa1c46922342f57e423248394ee406669744875c.png';
import productImage2 from '../assets/ca05980825d53fdbf46ebce45a2323c4be91acc6.png';
import productImage3 from '../assets/5cc7a5ad8b257cbcef8ab1e607c927eb8b558885.png';
import productImage4 from '../assets/31d88f47a75f004b0f885deac6e147f2f47d4f2d.png';
import productImage5 from '../assets/6cd1cb024a14da331ced1255244ad60959ede15f.png';
import productImage6 from '../assets/91097cd56b7143bcff2b48dee420f657f543733d.png';
import { DateRangePicker } from './DateRangePicker';

interface Exchange {
  id: number;
  date: string;
  productName: string;
  productImage: string;
  points: number;
  status: 'ingresado' | 'confirmado' | 'en_ruta' | 'entregado' | 'anulado';
  trackingNumber?: string;
  orderCode?: string;
  deliveryDate?: string;
  address?: string;
  productType: 'fisico' | 'digital';
  isGiftCard?: boolean;
  cancelReason?: string;
}

interface MyExchangesViewProps {
  userPoints: number;
  onBack: () => void;
  onProfileClick?: () => void;
}

export function MyExchangesView({ userPoints, onBack, onProfileClick }: MyExchangesViewProps) {
  const [expandedExchange, setExpandedExchange] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [dateRangeStart, setDateRangeStart] = useState<string | null>(null);
  const [dateRangeEnd, setDateRangeEnd] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Mock data - Replace with real data
  const exchanges: Exchange[] = [
    {
      id: 1,
      date: '26 de febrero de 2026',
      productName: 'Lápiz para iPad Zagg Negro',
      productImage: productImage1,
      points: 77,
      status: 'confirmado',
      address: 'Av. Providencia 1234, Santiago',
      productType: 'fisico'
    },
    {
      id: 2,
      date: '19 de febrero de 2026',
      productName: 'Gift Card Digital por $30.000 Varsovienne',
      productImage: productImage2,
      points: 31,
      status: 'entregado',
      trackingNumber: 'SW-2026-0002',
      orderCode: 'ORD-2026-0002',
      deliveryDate: '21 de febrero de 2026',
      address: 'Correo electrónico enviado',
      productType: 'digital',
      isGiftCard: true
    },
    {
      id: 3,
      date: '5 de febrero de 2026',
      productName: 'Perfume Mujer Davidoff Cool Water 100Ml',
      productImage: productImage3,
      points: 84,
      status: 'en_ruta',
      trackingNumber: 'SW-2026-0003',
      orderCode: 'ORD-2026-0003',
      address: 'Av. Las Condes 9850, Santiago',
      productType: 'fisico'
    },
    {
      id: 4,
      date: '3 de febrero de 2026',
      productName: 'AirPods Pro 2da Generación',
      productImage: productImage4,
      points: 150,
      status: 'ingresado',
      address: 'Av. Apoquindo 4501, Santiago',
      productType: 'fisico'
    },
    {
      id: 5,
      date: '28 de enero de 2026',
      productName: 'Nintendo Switch OLED',
      productImage: productImage5,
      points: 200,
      status: 'entregado',
      trackingNumber: 'SW-2026-0005',
      orderCode: 'ORD-2026-0005',
      deliveryDate: '30 de enero de 2026',
      address: 'Av. Providencia 2594, Santiago',
      productType: 'fisico'
    },
    {
      id: 6,
      date: '27 de enero de 2026',
      productName: 'Lápiz Pro stylus 2 para iPad Zagg Azul',
      productImage: productImage6,
      points: 66,
      status: 'anulado',
      address: 'Av. Apoquindo 4501, Santiago',
      productType: 'fisico',
      cancelReason: 'Producto fuera de stock'
    }
  ];

  const getStatusConfig = (status: Exchange['status']) => {
    switch (status) {
      case 'ingresado':
        return {
          label: 'Canje ingresado',
          bgColor: 'bg-slate-100',
          textColor: 'text-slate-700',
          borderColor: 'border-slate-200',
          progressColor: 'bg-blue-500',
          step: 1
        };
      case 'confirmado':
        return {
          label: 'Canje confirmado',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600',
          borderColor: 'border-blue-200',
          progressColor: 'bg-blue-500',
          step: 2
        };
      case 'en_ruta':
        return {
          label: 'Canje en ruta',
          bgColor: 'bg-sky-50',
          textColor: 'text-sky-600',
          borderColor: 'border-sky-200',
          progressColor: 'bg-blue-500',
          step: 3
        };
      case 'entregado':
        return {
          label: 'Canje entregado',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600',
          borderColor: 'border-green-200',
          progressColor: 'bg-blue-500',
          step: 4
        };
      case 'anulado':
        return {
          label: 'Canje anulado',
          bgColor: 'bg-red-50',
          textColor: 'text-red-600',
          borderColor: 'border-red-200',
          progressColor: 'bg-red-500',
          step: 4
        };
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedExchange(expandedExchange === id ? null : id);
  };

  const handleDownloadPDF = () => {
    // Implementar descarga de PDF
    console.log('Descargando PDF de Gift Card...');
  };

  const handleTrackOrder = (orderCode: string) => {
    // Implementar rastreo de pedido
    console.log('Rastreando pedido:', orderCode);
    window.open(`https://tracking.example.com/${orderCode}`, '_blank');
  };

  const handleHelp = () => {
    setShowHelp(true);
    // Implementar apertura de chatbot
    console.log('Abriendo chatbot de ayuda...');
  };

  const ProgressBar = ({ currentStep, isCancelled = false }: { currentStep: number; isCancelled?: boolean }) => {
    const steps = [
      { label: 'Ingresado', step: 1, icon: Package },
      { label: 'Confirmado', step: 2, icon: Clock },
      { label: 'En ruta', step: 3, icon: Truck },
      { label: 'Entregado', step: 4, icon: CheckCircle2 }
    ];

    return (
      <div className="w-full py-4 px-4">
        <div className="relative max-w-full">
          {/* Progress Line Background */}
          <div className="absolute top-5 left-[20px] right-[20px] h-1 bg-slate-200"></div>
          
          {/* Progress Line Active - Only if not cancelled */}
          {!isCancelled && (
            <div 
              className="absolute top-5 left-[20px] h-1 bg-blue-500 transition-all duration-500" 
              style={{ 
                width: `calc(((100% - 40px) / 3) * ${currentStep - 1})` 
              }}
            ></div>
          )}

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => {
              const isCompleted = !isCancelled && currentStep >= step.step;
              const isCurrent = !isCancelled && currentStep === step.step;
              const isFirstStepCancelled = isCancelled && step.step === 1;
              const StepIcon = step.icon;

              return (
                <div key={step.step} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                      isFirstStepCancelled
                        ? 'bg-red-500 border-4 border-red-500'
                        : isCurrent
                          ? 'bg-blue-500 border-4 border-blue-500'
                          : isCompleted 
                            ? 'bg-blue-300 border-4 border-blue-300' 
                            : 'bg-white border-4 border-slate-200'
                    }`}
                  >
                    {isFirstStepCancelled ? (
                      <X className="w-5 h-5 text-white" />
                    ) : isCompleted ? (
                      <StepIcon className="w-5 h-5 text-white" />
                    ) : null}
                  </div>
                  <span 
                    className={`mt-2 text-xs md:text-sm font-medium ${
                      isFirstStepCancelled ? 'text-red-600' : isCompleted ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 w-full max-w-full md:h-[calc(100vh-1rem)] md:overflow-y-auto md:m-2 overflow-y-auto overflow-x-hidden pb-[88px] md:pb-0">
      {/* Header */}
      <div 
        className="bg-white md:bg-white/95 md:backdrop-blur-md md:rounded-2xl md:sticky md:top-0 md:z-30 flex-shrink-0 mb-4 md:mb-6"
        style={window.innerWidth >= 768 ? { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)' } : {}}
      >
        {/* Desktop Header */}
        <div className="hidden md:block py-[25px] px-6">
          <div className="flex items-center justify-between gap-8">
            {/* Left: Search and Filter */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar canje..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[220px] pl-12 pr-4 py-2.5 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm"
                />
              </div>

              {/* Calendar Filter */}
              <div className="relative" ref={calendarRef}>
                <button 
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 bg-white hover:border-[#FF8000]/30 transition-all text-sm font-medium text-slate-700"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>
                    {dateRangeStart && dateRangeEnd
                      ? `${new Date(dateRangeStart).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${new Date(dateRangeEnd).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`
                      : 'Filtrar'}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showCalendar && (
                  <div className="absolute top-full right-0 mt-2 z-50">
                    <DateRangePicker
                      onClose={() => setShowCalendar(false)}
                      onApply={(start, end) => {
                        setDateRangeStart(start);
                        setDateRangeEnd(end);
                        setShowCalendar(false);
                      }}
                      onClear={() => {
                        setDateRangeStart(null);
                        setDateRangeEnd(null);
                        setShowCalendar(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Points Badge */}
            <div className="min-w-[140px] h-[52px] w-fit rounded-xl bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 hover:shadow-lg hover:shadow-[#FF8000]/30 transition-all duration-300 px-3 flex items-center gap-3 cursor-pointer flex-shrink-0">
              <img src={coinIcon} alt="Coin" className="w-8 h-8 flex-shrink-0" />
              <div className="flex flex-col pr-2">
                <div className="text-[10px] text-white font-medium opacity-90">Tus puntos</div>
                <div className="text-[20px] font-bold text-white leading-none" style={{ fontWeight: 800 }}>{userPoints.toLocaleString('es-CL')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          {/* Top Bar - Logo, Points, Profile - Fondo Blanco */}
          <div className="px-4 py-3 bg-white">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <img src={logoDesafioSawa} alt="Desafío Sawa" className="h-10 object-contain" />
              
              {/* Spacer */}
              <div className="flex-1" />

              {/* Points Badge */}
              <div className="px-3 py-2 rounded-full bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 flex items-center gap-2 flex-shrink-0">
                <img src={coinIcon} alt="Coin" className="w-6 h-6 flex-shrink-0" />
                <div className="flex flex-col">
                  <div className="text-[9px] text-white opacity-90 tracking-wide leading-none" style={{ fontWeight: 500 }}>Tus puntos</div>
                  <div className="text-base font-bold text-white leading-none mt-0.5" style={{ fontWeight: 800 }}>{userPoints.toLocaleString('es-CL')}</div>
                </div>
              </div>

              {/* Profile Photo */}
              <button
                className="w-9 h-9 min-w-[36px] aspect-square rounded-full ring-2 ring-slate-200 overflow-hidden transition-all cursor-pointer"
                onClick={onProfileClick}
              >
                <img 
                  src={profileImage} 
                  alt="Carlos Toledo" 
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>

          {/* Search Bar - Gray Background */}
          <div className="px-4 py-3 bg-[#F5F8FB]" ref={calendarRef}>
            <div className="flex items-center gap-2 relative">
              {/* Search Bar - Flex para ocupar espacio disponible */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar canje..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all text-sm"
                />
              </div>

              {/* Filtrar button - Compacto */}
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-300 bg-white active:bg-slate-50 text-slate-700 font-medium transition-colors text-sm flex-shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filtrar</span>
              </button>
              
              {/* Date Picker para mobile */}
              {showCalendar && (
                <div className="absolute top-full right-0 mt-2 z-50">
                  <DateRangePicker
                    onClose={() => setShowCalendar(false)}
                    onApply={(start, end) => {
                      setDateRangeStart(start);
                      setDateRangeEnd(end);
                      setShowCalendar(false);
                    }}
                    onClear={() => {
                      setDateRangeStart(null);
                      setDateRangeEnd(null);
                      setShowCalendar(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exchanges List */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 space-y-4">
        {exchanges.map((exchange) => {
          const statusConfig = getStatusConfig(exchange.status);
          const isExpanded = expandedExchange === exchange.id;

          return (
            <div 
              key={exchange.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50"
              style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
            >
              {/* Date Header */}
              <div className="px-4 md:px-5 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center justify-between gap-3">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Calendar className="w-4 h-4" />
                    {exchange.date}
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.bgColor} border ${statusConfig.borderColor} w-fit flex-shrink-0`}>
                    {exchange.status === 'anulado' ? (
                      <X className={`w-3.5 h-3.5 ${statusConfig.textColor}`} />
                    ) : (
                      <CheckCircle2 className={`w-3.5 h-3.5 ${statusConfig.textColor}`} />
                    )}
                    <span className={`text-xs font-semibold ${statusConfig.textColor} whitespace-nowrap`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Exchange Content */}
              <div className="p-4 md:p-5">
                {/* Mobile Layout */}
                <div className="md:hidden space-y-3">
                  {/* Product Image and Info */}
                  <div className="flex gap-3 items-center">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img 
                          src={exchange.productImage} 
                          alt={exchange.productName}
                          className={`w-full h-full ${exchange.isGiftCard ? 'object-contain' : 'object-cover'}`}
                        />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 mb-0.5 line-clamp-2 leading-tight">
                        {exchange.productName}
                      </h3>

                      {/* Points */}
                      <div className="flex items-center gap-1.5">
                        <img src={coinIcon} alt="Points" className="w-5 h-5 flex-shrink-0" />
                        <div className="leading-none">
                          <span className="text-base font-bold text-[#FF8000]">
                            {exchange.points}
                          </span>{' '}
                          <span className="text-sm font-semibold text-slate-500">
                            puntos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ver detalles Button - Full Width */}
                  <button
                    onClick={() => toggleExpand(exchange.id)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all flex items-center gap-1 justify-center w-full"
                  >
                    {isExpanded ? 'Ocultar' : 'Ver detalles'}
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex gap-4 items-center">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img 
                        src={exchange.productImage} 
                        alt={exchange.productName}
                        className={`w-full h-full ${exchange.isGiftCard ? 'object-contain' : 'object-cover'}`}
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 mb-0.5 line-clamp-2">
                      {exchange.productName}
                    </h3>

                    {/* Points and Button Row */}
                    <div className="flex items-center justify-between gap-3">
                      {/* Points */}
                      <div className="flex items-center gap-1.5">
                        <img src={coinIcon} alt="Points" className="w-5 h-5" />
                        <div className="leading-none">
                          <span className="text-lg font-bold text-[#FF8000]">
                            {exchange.points}
                          </span>{' '}
                          <span className="text-sm font-semibold text-slate-500">
                            puntos
                          </span>
                        </div>
                      </div>

                      {/* Ver detalles Button */}
                      <button
                        onClick={() => toggleExpand(exchange.id)}
                        className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all flex items-center gap-1.5"
                      >
                        {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Progress Bar */}
                    <ProgressBar currentStep={statusConfig.step} isCancelled={exchange.status === 'anulado'} />

                    {/* Additional Info for "En Ruta" */}
                    {exchange.status === 'en_ruta' && exchange.productType === 'fisico' && (
                      <div className="mt-6 p-4 bg-sky-50 rounded-xl border border-sky-100">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-600">
                                Código de orden:
                              </span>
                              <span className="text-sm font-bold text-slate-900">
                                {exchange.orderCode}
                              </span>
                            </div>
                            {exchange.address && (
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-slate-600">
                                    Dirección:
                                  </span>{' '}
                                  <span className="text-sm text-slate-700">
                                    {exchange.address}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          <button 
                            onClick={() => handleTrackOrder(exchange.orderCode || '')}
                            className="px-6 py-2.5 rounded-full bg-[#FF8000] hover:bg-[#FF8000]/90 text-white font-semibold text-sm transition-all shadow-md shadow-[#FF8000]/25 flex items-center gap-2 justify-center"
                          >
                            <Truck className="w-4 h-4" />
                            Rastrear mi canje
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Additional Info for "Entregado" - Gift Card */}
                    {exchange.status === 'entregado' && exchange.isGiftCard && (
                      <div className="mt-6">
                        <div className="flex flex-col md:flex-row gap-3">
                          <button 
                            onClick={handleDownloadPDF}
                            className="flex-1 px-6 py-3 rounded-full bg-[#FF8000] hover:bg-[#FF8000]/90 text-white font-bold text-sm transition-all shadow-md shadow-[#FF8000]/25 flex items-center gap-2 justify-center"
                          >
                            <Download className="w-5 h-5" />
                            Descargar PDF
                          </button>
                          <button 
                            onClick={handleHelp}
                            className="flex-1 px-6 py-3 rounded-full bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 font-semibold text-sm transition-all flex items-center gap-2 justify-center"
                          >
                            <HelpCircle className="w-5 h-5" />
                            Ayuda
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Additional Info for "Entregado" - Physical Product */}
                    {exchange.status === 'entregado' && !exchange.isGiftCard && exchange.productType === 'fisico' && (
                      <div className="mt-6">
                        <button 
                          onClick={handleHelp}
                          className="w-full px-6 py-3 rounded-full bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 font-semibold text-sm transition-all flex items-center gap-2 justify-center"
                        >
                          <HelpCircle className="w-5 h-5" />
                          Ayuda
                        </button>
                      </div>
                    )}

                    {/* Info for other statuses */}
                    {(exchange.status === 'ingresado' || exchange.status === 'confirmado') && (
                      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        {exchange.address && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-slate-600">
                                Dirección de envío:
                              </span>{' '}
                              <span className="text-sm text-slate-700">
                                {exchange.address}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Info for "Anulado" status */}
                    {exchange.status === 'anulado' && (
                      <div className="mt-6">
                        <button 
                          onClick={handleHelp}
                          className="w-full px-6 py-3 rounded-full bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-700 font-semibold text-sm transition-all flex items-center gap-2 justify-center"
                        >
                          <HelpCircle className="w-5 h-5" />
                          Ayuda
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State (if no exchanges) */}
      {exchanges.length === 0 && (
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No tienes canjes aún
            </h3>
            <p className="text-slate-600 mb-6">
              Cuando realices tu primer canje, aparecerá aquí con toda la información de seguimiento
            </p>
          </div>
        </div>
      )}
    </div>
  );
}