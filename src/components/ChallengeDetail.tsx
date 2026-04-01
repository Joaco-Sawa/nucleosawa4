import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Calendar, Target, Trophy, Sparkles, Check, Clock, X, Flag, Star, TrendingUp } from 'lucide-react';
import { ChallengeBanner, ColorPalette } from './ChallengeBanner';
import coinIcon from '../assets/db29ff4dc98462b3539ca31d029b8918fad5d4e6.png';
import logoJohnDeere from '../assets/881be60a3e27e41c53669ba22a614adc80691979.png';
import logoDesafioSawa from '../assets/90d0b6e7e40ee202a8c067619d31d9c79731c384.png';
import logoDogChow from '../assets/ae486996a54fdf7b33dba3dce381a0966a079f4f.png';
import bannerBCIPagos from '../assets/be97d3d34fee8a1e19a8ce367fea9e9bb4a89180.png';
import logoBelkin from '../assets/ad08acb91b5b73081d9da06261fae33e9e6257c2.png';
import profileImage from '../assets/9f5aa0e583374b6893d8921a6183b99d788006eb.png';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

// Avatar images for ranking (optimized for small size)
const avatarImages: { [key: string]: string } = {
  'María González': 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?w=100&h=100&fit=crop&q=60',
  'Andrea Martínez': 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?w=100&h=100&fit=crop&q=60',
  'Roberto Silva': 'https://images.unsplash.com/photo-1554765345-6ad6a5417cde?w=100&h=100&fit=crop&q=60',
  'Patricia Rojas': 'https://images.unsplash.com/photo-1727299781147-c7ab897883a0?w=100&h=100&fit=crop&q=60',
  'Luis Fernández': 'https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?w=100&h=100&fit=crop&q=60',
  'Carmen Díaz': 'https://images.unsplash.com/photo-1613473350016-1fe047d6d360?w=100&h=100&fit=crop&q=60',
  'Carlos Toledo': profileImage,
  'Jorge Vargas': 'https://images.unsplash.com/photo-1658249682516-c7789d418978?w=100&h=100&fit=crop&q=60',
  'Isabel Castro': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&q=60',
  'Fernando López': 'https://images.unsplash.com/photo-1530281834572-02d15fa61f64?w=100&h=100&fit=crop&q=60',
  'Ana Torres': 'https://images.unsplash.com/photo-1610896011476-300d6239d995?w=100&h=100&fit=crop&q=60',
  'Miguel Ángel Pérez': 'https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?w=100&h=100&fit=crop&q=60',
  'Sofía Ramírez': 'https://images.unsplash.com/photo-1577721371657-d94c55fdf9c6?w=100&h=100&fit=crop&q=60',
  'Diego Morales': 'https://images.unsplash.com/photo-1697043593597-b75ca6112914?w=100&h=100&fit=crop&q=60',
  'Valentina Herrera': 'https://images.unsplash.com/photo-1707742453461-6855f0b8238c?w=100&h=100&fit=crop&q=60',
};

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

// Mock de desafíos (sincronizado con Challenges.tsx)
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
    bonusPoints: 3000,
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

export function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  const userPoints = 15000;
  
  const challenge = mockChallenges.find(c => c.id === Number(id));

  if (!challenge) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#45556C] mb-2">Desafío no encontrado</h2>
          <p className="text-slate-600 mb-6">El desafío que buscas no existe</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-[#FF8000] text-white rounded-full font-semibold hover:bg-[#FF8000]/90 transition-colors"
          >
            Volver a desafíos
          </button>
        </div>
      </div>
    );
  }

  // Calcular días restantes
  const getDaysRemaining = (endDate: string) => {
    // FECHA CONGELADA - No avanza automáticamente
    const today = new Date('2026-03-19');
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calcular porcentaje de progreso
  const calculateProgressPercentage = (progress: number, target: number) => {
    return Math.min((progress / target) * 100, 200);
  };

  // Determinar en qué nivel está el progreso
  const getMilestoneLevel = (progress: number, target: number, thresholds: Challenge['thresholds']) => {
    const percentage = calculateProgressPercentage(progress, target);
    
    if (percentage >= thresholds.sobrecumplimiento) {
      return {
        label: 'Sobrecumplimiento',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-700'
      };
    } else if (percentage >= thresholds.cumplimiento) {
      return {
        label: 'Cumplimiento',
        badgeBg: 'bg-green-100',
        badgeText: 'text-green-700'
      };
    } else if (percentage >= thresholds.subcumplimiento) {
      return {
        label: 'Subcumplimiento',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-700'
      };
    } else {
      return {
        label: 'En progreso',
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-600'
      };
    }
  };

  // Calcular puntos por hito
  const inicio25Points = Math.floor(challenge.points * 0.25); // 25%
  const subcumplimientoPoints = Math.floor(challenge.points * 0.5); // 50%
  const cumplimientoPoints = challenge.points; // 100%
  const sobrecumplimientoPoints = challenge.bonusPoints; // Solo el bonus en el marcador 150%

  // Verificar si es el desafío de clientes (que tiene 4 hitos + inicio)
  const isClientChallenge = challenge.id === 4; // Desafío de clientes - 4 hitos

  // Verificar si es el desafío simple (que solo tiene 2 hitos: 0% y 100%)
  // Verificar si es desafío "todo o nada"
  const isAllOrNothing = challenge.thresholds.subcumplimiento === 0 && challenge.thresholds.sobrecumplimiento === 0;
  const isSimpleChallenge = isAllOrNothing; // Desafío simple - 2 hitos

  // Calcular puntos totales
  const calculateTotalPoints = (
    progress: number,
    target: number,
    basePoints: number,
    bonusPoints: number,
    thresholds: Challenge['thresholds'],
    challengeId?: number
  ) => {
    const percentage = calculateProgressPercentage(progress, target);
    
    // Lógica para desafío "todo o nada" (sin subcumplimiento ni sobrecumplimiento)
    if (thresholds.subcumplimiento === 0 && thresholds.sobrecumplimiento === 0) {
      return progress >= target ? basePoints : 0;
    }
    
    // Lógica especial para el desafío de clientes (id: 4) que tiene 4 hitos
    if (challengeId === 4) {
      if (percentage >= thresholds.sobrecumplimiento) {
        return basePoints + bonusPoints; // Al alcanzar 150%, se otorga base + bonus
      } else if (percentage >= thresholds.cumplimiento) {
        return basePoints; // 100% = 2500 puntos
      } else if (percentage >= thresholds.subcumplimiento) {
        return Math.floor(basePoints * 0.5); // 50% = 1250 puntos
      } else if (percentage >= 25) {
        return Math.floor(basePoints * 0.25); // 25% = 625 puntos
      } else {
        return 0;
      }
    }
    
    // Lógica estándar para otros desafíos
    if (percentage >= thresholds.sobrecumplimiento) {
      return basePoints + bonusPoints; // Al alcanzar 150%, se otorga base + bonus
    } else if (percentage >= thresholds.cumplimiento) {
      return basePoints;
    } else if (percentage >= thresholds.subcumplimiento) {
      return Math.floor(basePoints * 0.5);
    } else {
      return 0;
    }
  };

  const progressPercentage = calculateProgressPercentage(challenge.progress, challenge.target);
  const milestone = getMilestoneLevel(challenge.progress, challenge.target, challenge.thresholds);
  const currentPoints = calculateTotalPoints(
    challenge.progress,
    challenge.target,
    challenge.points,
    challenge.bonusPoints,
    challenge.thresholds,
    challenge.id
  );
  const maxPoints = challenge.points + challenge.bonusPoints;
  const daysRemaining = getDaysRemaining(challenge.endDate);

  // Calcular el próximo hito alcanzable según el progreso actual
  const getNextMilestonePoints = () => {
    // Lógica especial para el desafío simple (id: 13) que solo tiene 0% y 100%
    if (challenge.id === 13) {
      if (progressPercentage >= challenge.thresholds.cumplimiento) {
        return challenge.points; // Ya alcanzó el máximo
      } else {
        return challenge.points; // Próximo: 100%
      }
    }
    
    // Si ya alcanzó o superó el cumplimiento, mostrar el máximo posible
    if (progressPercentage >= challenge.thresholds.cumplimiento) {
      return maxPoints;
    }
    
    // Lógica especial para el desafío de clientes (id: 4) que tiene 4 hitos
    if (challenge.id === 4) {
      if (progressPercentage < 25) {
        return Math.floor(challenge.points * 0.25); // Próximo: 25%
      } else if (progressPercentage < challenge.thresholds.subcumplimiento) {
        return Math.floor(challenge.points * 0.5); // Próximo: 50%
      } else {
        return challenge.points; // Próximo: 100%
      }
    }
    
    // Lógica estándar para otros desafíos
    if (progressPercentage < challenge.thresholds.subcumplimiento) {
      return Math.floor(challenge.points * 0.5); // Próximo: 50%
    } else {
      return challenge.points; // Próximo: 100%
    }
  };

  const nextMilestonePoints = getNextMilestonePoints();

  // Efecto de confetti cuando se alcanza o supera la meta
  useEffect(() => {
    // Solo mostrar confetti si el progreso alcanza o supera la meta
    if (progressPercentage >= challenge.thresholds.cumplimiento && progressBarRef.current) {
      // Esperar un poco para que la barra se anime primero
      const timer = setTimeout(() => {
        const rect = progressBarRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        // Calcular posición desde donde disparar el confetti (centro de la barra)
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        
        // Determinar si es sobrecumplimiento (bonus) o solo cumplimiento
        // Solo es sobrecumplimiento si existe un threshold de sobrecumplimiento Y se alcanzó
        const isSobrecumplimiento = challenge.thresholds.sobrecumplimiento > 0 && 
                                     progressPercentage >= challenge.thresholds.sobrecumplimiento;
        
        // Colores según el tipo de logro
        const colors = isSobrecumplimiento 
          ? ['#FFD321', '#DC943A', '#FFDF5C', '#FFA500', '#FFB84D'] // Dorados para bonus
          : ['#47CA45', '#008236', '#65F063', '#3BAF39', '#8BDF89']; // Verdes para meta
        
        // Efecto celebratorio pero elegante
        const count = isSobrecumplimiento ? 100 : 70;
        const spread = isSobrecumplimiento ? 100 : 80;
        
        confetti({
          particleCount: count,
          spread: spread,
          origin: { x, y },
          colors: colors,
          ticks: 200,
          gravity: 1,
          scalar: 0.9,
          drift: 0,
          startVelocity: 30,
          zIndex: 40
        });
        
        // Segundo disparo ligeramente después para efecto más rico
        setTimeout(() => {
          confetti({
            particleCount: count / 2,
            spread: spread - 20,
            origin: { x, y },
            colors: colors,
            ticks: 150,
            gravity: 1.2,
            scalar: 0.8,
            drift: 0.5,
            startVelocity: 25,
            zIndex: 40
          });
        }, 150);
      }, 1500); // Esperar 1.5s para que la animación de la barra termine
      
      return () => clearTimeout(timer);
    }
  }, [challenge.id, progressPercentage, challenge.thresholds.cumplimiento, challenge.thresholds.sobrecumplimiento]);

  // Definir los hitos según el tipo de desafío
  const milestones = isSimpleChallenge
    ? [
        // Solo 2 hitos: 0% y 100%
        {
          percentage: 0,
          points: 0,
          shortLabel: '0%',
          completed: true,
          isMeta: false,
          isBonus: false
        },
        // 100% (Cumplimiento/Meta)
        {
          percentage: 100,
          points: cumplimientoPoints,
          shortLabel: '100%',
          completed: progressPercentage >= challenge.thresholds.cumplimiento,
          isMeta: true,
          isBonus: false
        }
      ]
    : isClientChallenge 
    ? [
        // Inicio (0%)
        {
          percentage: 0,
          points: 0,
          shortLabel: '0%',
          completed: true,
          isMeta: false,
          isBonus: false
        },
        // 25%
        {
          percentage: 25,
          points: inicio25Points,
          shortLabel: '25%',
          completed: progressPercentage >= 25,
          isMeta: false,
          isBonus: false
        },
        // 50% (Subcumplimiento)
        {
          percentage: 50,
          points: subcumplimientoPoints,
          shortLabel: '50%',
          completed: progressPercentage >= challenge.thresholds.subcumplimiento,
          isMeta: false,
          isBonus: false
        },
        // 100% (Cumplimiento/Meta)
        {
          percentage: 75,
          points: cumplimientoPoints,
          shortLabel: '100%',
          completed: progressPercentage >= challenge.thresholds.cumplimiento,
          isMeta: true,
          isBonus: false
        },
        // 150% (Sobrecumplimiento)
        {
          percentage: 100,
          points: sobrecumplimientoPoints,
          shortLabel: '150%',
          completed: progressPercentage >= challenge.thresholds.sobrecumplimiento,
          isMeta: false,
          isBonus: true
        }
      ]
    : [
        // Inicio (0%)
        {
          percentage: 0,
          points: 0,
          shortLabel: '0%',
          completed: true,
          isMeta: false,
          isBonus: false
        },
        // 50% (Subcumplimiento)
        {
          percentage: 33.33,
          points: subcumplimientoPoints,
          shortLabel: '50%',
          completed: progressPercentage >= challenge.thresholds.subcumplimiento,
          isMeta: false,
          isBonus: false
        },
        // 100% (Cumplimiento/Meta)
        {
          percentage: 66.67,
          points: cumplimientoPoints,
          shortLabel: '100%',
          completed: progressPercentage >= challenge.thresholds.cumplimiento,
          isMeta: true,
          isBonus: false
        },
        // 150% (Sobrecumplimiento)
        {
          percentage: 100,
          points: sobrecumplimientoPoints,
          shortLabel: '150%',
          completed: progressPercentage >= challenge.thresholds.sobrecumplimiento,
          isMeta: false,
          isBonus: true
        }
      ];

  const [showHelp, setShowHelp] = useState(false);
  const [showRanking, setShowRanking] = useState(false);

  // Mock de datos de ranking para el desafío #6
  const mockRankingData = [
    { position: 1, name: 'María González', progress: 150, role: 'Vendedor(a)', branch: 'Sucursal Antofagasta' },
    { position: 2, name: 'Andrea Martínez', progress: 118, role: 'Vendedor(a)', branch: 'Sucursal Antofagasta' },
    { position: 3, name: 'Roberto Silva', progress: 112, role: 'Vendedor(a)', branch: 'Sucursal Antofagasta' },
    { position: 4, name: 'Patricia Rojas', progress: 105, role: 'Vendedor(a)', branch: 'Sucursal Antofagasta' },
    { position: 5, name: 'Luis Fernández', progress: 98, role: 'Vendedor(a)', branch: 'Sucursal Antofagasta' },
    { position: 6, name: 'Carmen Díaz', progress: 92, role: 'Vendedor(a)', branch: 'Sucursal Antofagasta' },
    { position: 7, name: 'Carlos Toledo', progress: 87, role: 'Vendedor(a)', branch: 'Sucursal Antofagasta' },
    { position: 8, name: 'Jorge Vargas', progress: 83, role: 'Vendedor(a)', branch: 'Sucursal Antofagasta' },
    { position: 9, name: 'Isabel Castro', progress: 78, role: 'Vendedor(a)', branch: 'Sucursal Antofagasta' },
    { position: 10, name: 'Fernando López', progress: 72, role: 'Vendedor(a)', branch: 'Sucursal Antofagasta' },
    { position: 11, name: 'Ana Torres', progress: 68, role: 'Vendedor(a)', branch: 'Sucursal Antofagasta' },
    { position: 12, name: 'Miguel Ángel Pérez', progress: 65, role: 'Vendedor(a)', branch: 'Sucursal Antofagasta' },
    { position: 13, name: 'Sofía Ramírez', progress: 58, role: 'Vendedor(a)', branch: 'Sucursal Antofagasta' },
    { position: 14, name: 'Diego Morales', progress: 52, role: 'Vendedor(a)', branch: 'Sucursal Antofagasta' },
    { position: 15, name: 'Valentina Herrera', progress: 45, role: 'Vendedor(a)', branch: 'Sucursal Antofagasta' },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 w-full max-w-full md:h-[calc(100vh-1rem)] md:overflow-y-auto md:m-2 overflow-y-auto overflow-x-hidden pb-[88px] md:pb-0">
      {/* Header */}
      <header 
        className="bg-white md:bg-white/95 md:backdrop-blur-md transition-all duration-300 md:rounded-2xl md:sticky md:top-0 md:z-30 flex-shrink-0"
        style={window.innerWidth >= 768 ? { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)' } : {}}
      >
        {/* Desktop Header */}
        <div className="hidden md:block py-[25px] px-6">
          <div className="flex items-center gap-3">
            {/* Botón Volver a desafíos */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 hover:text-[#FF8000] transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Volver a desafíos</span>
            </button>

            <div className="flex-1" />
            
            <div className="flex items-center gap-3">
              {/* Points Badge */}
              <div className="min-w-[140px] h-[52px] w-fit rounded-xl bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 px-3 flex items-center gap-3 flex-shrink-0">
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
            <img src={logoDesafioSawa} alt="Desafío Sawa" className="h-10 object-contain" />
            <div className="flex-1" />
            <div className="px-3 py-2 rounded-full bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 flex items-center gap-2 flex-shrink-0">
              <img src={coinIcon} alt="Coin" className="w-6 h-6 flex-shrink-0" />
              <div className="flex flex-col">
                <div className="text-[9px] text-white opacity-90 tracking-wide leading-none" style={{ fontFamily: "'Nunito', sans-serif" }}>Tus puntos</div>
                <div className="text-base font-bold text-white leading-none mt-0.5" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800 }}>{userPoints.toLocaleString('es-CL')}</div>
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
      </header>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-6">
        {/* Mobile: Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="md:hidden flex items-center gap-2 text-slate-700 hover:text-[#FF8000] transition-colors mb-6 group"
        >
          <div className="w-8 h-8 rounded-full bg-[#E8EFF5] group-hover:bg-orange-50 flex items-center justify-center transition-all border border-transparent group-hover:border-[#FF8000]">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-semibold text-sm">Volver a desafíos</span>
        </button>

        {/* Tarjeta principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-2xl overflow-hidden ${
            challenge.isFeatured
              ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-400/30'
              : 'border border-slate-200 shadow-lg'
          }`}
        >
          {/* Banner personalizado (custom-banner) */}
          {challenge.imageType === 'custom-banner' && challenge.bannerImage && (
            <div className="relative w-full h-40 md:h-48 overflow-hidden">
              <img
                src={challenge.bannerImage}
                alt={challenge.title}
                className={`w-full h-full object-cover ${daysRemaining <= 0 || challenge.status === 'finished' ? 'grayscale' : ''}`}
              />
              {/* Badge featured */}
              {challenge.isFeatured && (
                <div className="absolute top-4 md:top-8 left-4 md:left-8">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg">
                    <Star className="w-4 h-4 text-white fill-white" strokeWidth={2.5} />
                    <span className="text-sm font-bold text-white">Desafío principal</span>
                  </div>
                </div>
              )}

              {/* Status badge */}
              <div className="absolute top-4 md:top-8 right-4 md:right-8">
                {(() => {
                  const actualStatus = daysRemaining <= 0 ? 'finished' : challenge.status;
                  
                  if (actualStatus === 'active') {
                    return (
                      <span 
                        className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold border ${
                          daysRemaining <= 3
                            ? 'bg-red-100 text-red-700 border-red-700'
                            : daysRemaining <= 7
                            ? 'bg-amber-100 text-amber-700 border-amber-700'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-700'
                        }`}
                        style={{ borderWidth: '0.5px' }}
                      >
                        Quedan {daysRemaining} días
                      </span>
                    );
                  } else {
                    return (
                      <span 
                        className="inline-flex px-3 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 border border-slate-600"
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
          )}

          {/* Banner con gradiente e icono/logo */}
          {(challenge.imageUrl || challenge.iconifyIcon) && challenge.imageType === 'banner' && (
            <ChallengeBanner
              imageUrl={challenge.imageUrl}
              iconifyIcon={challenge.iconifyIcon}
              title={challenge.title}
              colorPalette={challenge.colorPalette || 'blue'}
              isFinished={daysRemaining <= 0 || challenge.status === 'finished'}
              size="large"
            >
              {/* Badge featured */}
              {challenge.isFeatured && (
                <div className="absolute top-4 md:top-8 left-4 md:left-8">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg">
                    <Star className="w-4 h-4 text-white fill-white" strokeWidth={2.5} />
                    <span className="text-sm font-bold text-white">Desafío principal</span>
                  </div>
                </div>
              )}

              {/* Status badge */}
              <div className="absolute top-4 md:top-8 right-4 md:right-8">
                {(() => {
                  const actualStatus = daysRemaining <= 0 ? 'finished' : challenge.status;
                  
                  if (actualStatus === 'active') {
                    return (
                      <span 
                        className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold border ${
                          daysRemaining <= 3
                            ? 'bg-red-100 text-red-700 border-red-700'
                            : daysRemaining <= 7
                            ? 'bg-amber-100 text-amber-700 border-amber-700'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-700'
                        }`}
                        style={{ borderWidth: '0.5px' }}
                      >
                        Quedan {daysRemaining} días
                      </span>
                    );
                  } else {
                    return (
                      <span 
                        className="inline-flex px-3 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 border border-slate-600"
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
          )}

          {/* Banner con logo (para desafíos tipo 'logo') */}
          {challenge.logoUrl && challenge.imageType === 'logo' && (
            <div 
              className={`relative h-40 md:h-48 overflow-hidden ${daysRemaining <= 0 || challenge.status === 'finished' ? 'grayscale' : ''}`}
              style={{ 
                background: challenge.colorPalette === 'gold' 
                  ? 'linear-gradient(135deg, #FFF9E6 0%, #FFD700 100%)'
                  : 'linear-gradient(135deg, #E3F2FD 0%, #90CAF9 100%)'
              }}
            >
              {/* Logo centrado */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-[200px] md:max-w-[280px] px-8">
                  <img 
                    src={challenge.logoUrl} 
                    alt={challenge.title}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Badge featured */}
              {challenge.isFeatured && (
                <div className="absolute top-4 md:top-8 left-4 md:left-8">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg">
                    <Star className="w-4 h-4 text-white fill-white" strokeWidth={2.5} />
                    <span className="text-sm font-bold text-white">Desafío principal</span>
                  </div>
                </div>
              )}

              {/* Status badge */}
              <div className="absolute top-4 md:top-8 right-4 md:right-8">
                {(() => {
                  const actualStatus = daysRemaining <= 0 ? 'finished' : challenge.status;
                  
                  if (actualStatus === 'active') {
                    return (
                      <span 
                        className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold border ${
                          daysRemaining <= 3
                            ? 'bg-red-100 text-red-700 border-red-700'
                            : daysRemaining <= 7
                            ? 'bg-amber-100 text-amber-700 border-amber-700'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-700'
                        }`}
                        style={{ borderWidth: '0.5px' }}
                      >
                        Quedan {daysRemaining} días
                      </span>
                    );
                  } else {
                    return (
                      <span 
                        className="inline-flex px-3 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 border border-slate-600"
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
          )}

          {/* Contenido */}
          <div className="px-4 py-6 md:p-8">
            {/* Título y descripción */}
            <div className="mb-4 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-[#45556C] mb-2">{challenge.title}</h1>
              
              {/* Período del desafío */}
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-[#FF8000] flex-shrink-0" />
                <p className="text-sm text-slate-500">
                  {(() => {
                    const startDate = new Date(challenge.startDate);
                    const endDate = new Date(challenge.endDate);
                    const startDay = startDate.getDate();
                    const endDay = endDate.getDate();
                    const startMonth = startDate.toLocaleDateString('es-ES', { month: 'long' });
                    const endMonth = endDate.toLocaleDateString('es-ES', { month: 'long' });
                    const startYear = startDate.getFullYear();
                    const endYear = endDate.getFullYear();
                    
                    if (startYear === endYear) {
                      if (startMonth === endMonth) {
                        return `${startDay} - ${endDay} de ${endMonth} del ${endYear}`;
                      } else {
                        return `${startDay} de ${startMonth} - ${endDay} de ${endMonth} del ${endYear}`;
                      }
                    } else {
                      return `${startDay} de ${startMonth} del ${startYear} - ${endDay} de ${endMonth} del ${endYear}`;
                    }
                  })()}
                </p>
              </div>

              {/* Para desafíos que NO son #6 - mantener layout original */}
              {challenge.id !== 6 && (
                <div className="flex items-start gap-4">
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 md:line-clamp-2 flex-1">
                    Gana puntos según tu progreso: alcanza el objetivo base o supera las expectativas para desbloquear bonificaciones especiales.
                  </p>
                  <button
                    onClick={() => setShowHelp(true)}
                    className="hidden md:flex flex-shrink-0 px-6 py-2.5 rounded-full bg-[#FF8000] text-white font-bold hover:bg-[#FF8000]/90 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                  >
                    Cómo ganar
                  </button>
                </div>
              )}

              {/* Para desafío #6 - texto arriba, botones horizontales debajo */}
              {challenge.id === 6 && (
                <div>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 md:line-clamp-2 mb-4">
                    Gana puntos según tu progreso: alcanza el objetivo base o supera las expectativas para desbloquear bonificaciones especiales.
                  </p>
                  <div className="hidden md:grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowHelp(true)}
                      className="px-6 py-2.5 rounded-full bg-[#FF8000] text-white font-bold hover:bg-[#FF8000]/90 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                    >
                      Cómo ganar
                    </button>
                    <button
                      onClick={() => setShowRanking(true)}
                      className="px-6 py-2.5 rounded-full bg-white border-2 border-[#FF8000] text-[#FF8000] font-bold hover:bg-[#FF8000]/5 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                    >
                      Ver ranking
                    </button>
                  </div>
                </div>
              )}

              {/* Botón móvil */}
              <button
                onClick={() => setShowHelp(true)}
                className="md:hidden w-full mt-4 px-6 py-3 rounded-full bg-[#FF8000] text-white font-bold hover:bg-[#FF8000]/90 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
              >
                Cómo ganar
              </button>

              {/* Botón "Ver ranking" solo para desafío #6 - móvil */}
              {challenge.id === 6 && (
                <button
                  onClick={() => setShowRanking(true)}
                  className="md:hidden w-full mt-3 px-6 py-3 rounded-full bg-white border-2 border-[#FF8000] text-[#FF8000] font-bold hover:bg-[#FF8000]/5 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                >
                  Ver ranking
                </button>
              )}
            </div>

            {/* Progreso */}
            <div className="space-y-4 mb-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Info de progreso */}
                <div className={`bg-slate-100 rounded-xl p-4 ${progressPercentage >= challenge.thresholds.cumplimiento && progressPercentage < challenge.thresholds.sobrecumplimiento ? 'md:flex-1' : 'w-full'}`}>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#FF8000]" strokeWidth={2.5} />
                      <h3 className="text-sm font-bold text-[#45556C]">{challenge.status === 'finished' ? 'Tu resultado' : 'Tu progreso'}</h3>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg font-bold text-[#45556C]">
                        {challenge.isMonetary ? (
                          <>
                            ${challenge.progress.toLocaleString('es-CL')} / ${challenge.target.toLocaleString('es-CL')}
                          </>
                        ) : (
                          <>
                            {challenge.progress} / {challenge.target} {challenge.unit}
                          </>
                        )}
                      </span>
                      <span className="text-xs text-slate-500">
                        {Math.round((challenge.progress / challenge.target) * 100)}% completado
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Cuadro de bonus - Solo para desafíos activos o cuando se alcanza sobrecumplimiento (no en desafíos simples) */}
                {!isSimpleChallenge &&
                 (challenge.status === 'active' || progressPercentage >= challenge.thresholds.sobrecumplimiento) && 
                 progressPercentage >= challenge.thresholds.cumplimiento && 
                 progressPercentage < challenge.thresholds.sobrecumplimiento && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-[#FFD321] md:flex-1">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex items-center gap-2">
                        {/* Marcador bonus */}
                        <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#FFD321] text-white border-2 border-[#DC943A]">
                          <Star className="w-3 h-3" strokeWidth={2.5} fill="currentColor" />
                        </div>
                        <h3 className="text-sm font-bold text-[#DC943A]">¡Alcanza el bonus!</h3>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg font-bold text-[#DC943A]">
                          {challenge.isMonetary ? (
                            <>
                              Vende ${((challenge.target * 1.5) - challenge.progress).toLocaleString('es-CL')} más
                            </>
                          ) : (
                            <>
                              Vende {Math.round((challenge.target * 1.5) - challenge.progress)} {challenge.unit} más
                            </>
                          )}
                        </span>
                        <span className="text-xs text-[#DC943A]/80">
                          para llegar a {challenge.isMonetary ? `$${(challenge.target * 1.5).toLocaleString('es-CL')}` : `${Math.round(challenge.target * 1.5)} ${challenge.unit}`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Barra de progreso continua con marcadores flotantes */}
              <div className="bg-slate-100 rounded-xl p-6">
                <div className="relative pb-16 px-0 md:px-6 pt-6">
                  {/* Contenedor con ancho ajustable - reducido en mobile y desktop */}
                  <div className="w-[94%] mx-auto md:w-[92%]">
                    {/* Barra de fondo continua */}
                    <div ref={progressBarRef} className="w-full h-6 rounded-full bg-slate-200 overflow-hidden relative">
                    {/* Barra de progreso verde (0% - 100%) */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: isSimpleChallenge 
                          ? `${Math.min(progressPercentage, 100)}%` // Desafío simple: 0% a 100%
                          : `${Math.min((Math.min(progressPercentage, 100) / 150) * 100, 66.67)}%` // Desafíos con bonus: 0% a 66.67%
                      }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
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
                    
                    {/* Barra de progreso dorada (100% - 150%) - Solo visible en sobrecumplimiento y no en desafíos simples */}
                    {!isSimpleChallenge && progressPercentage > 100 && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${Math.min(((progressPercentage - 100) / 50) * 33.33, 33.33)}%`
                        }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 1.5 }}
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
                  </div>

                  {/* Marcadores flotantes */}
                  {milestones?.map((m, idx) => {
                    const position = m.percentage;
                    const isMeta = m.isMeta;
                    const isFirst = idx === 0;
                    const isLast = idx === milestones.length - 1;
                    
                    // Ajustar posición para mobile y desktop (barras reducidas)
                    // Mobile: Distribución equidistante entre 0% y 92%
                    const totalMilestones = milestones.length;
                    const mobileSpacing = 92 / (totalMilestones - 1); // Espacio entre 0% y 92%
                    let mobilePosition = mobileSpacing * idx;
                    
                    // Desktop: barra al 92% con 4% de margen inicial
                    const desktopOffset = 4; // 4% de margen inicial (100-92)/2
                    const desktopPosition = desktopOffset + (position * 0.92);
                    
                    // Ajustar transform según posición: primero sin offset izquierdo, último sin offset derecho
                    const transformX = isFirst ? '0%' : isLast ? '-100%' : '-50%';
                    
                    // Todos los labels a la misma altura - ajustado para el marcador META más grande
                    const labelTop = isMeta ? '70px' : '58px';
                    
                    // Calcular unidades para este hito
                    const milestonePercentage = m.shortLabel.replace('%', '');
                    const unitsAtMilestone = challenge.isMonetary 
                      ? Math.round((parseFloat(milestonePercentage) / 100) * challenge.target)
                      : Math.round((parseFloat(milestonePercentage) / 100) * challenge.target);
                    
                    const tooltipText = challenge.isMonetary
                      ? `$${unitsAtMilestone.toLocaleString('es-CL')}`
                      : `${unitsAtMilestone} ${challenge.unit}`;
                    
                    return (
                      <div
                        key={idx}
                        className={`absolute group -translate-y-1/2 ${
                          isFirst ? 'translate-x-0 md:translate-x-0' : 
                          isLast ? '-translate-x-1/2 md:-translate-x-full' : 
                          '-translate-x-1/2'
                        } milestone-marker`}
                        style={{
                          '--mobile-pos': `${mobilePosition}%`,
                          '--desktop-pos': `${desktopPosition}%`,
                          top: '36px'
                        } as React.CSSProperties}
                      >
                        {/* Tooltip personalizado */}
                        {idx !== 0 && (
                          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-white text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50 ${
                            m.isBonus 
                              ? 'bg-[#DC943A]' 
                              : m.isMeta 
                                ? 'bg-[#008236]' 
                                : 'bg-slate-700'
                          }`}>
                            {tooltipText}
                            {/* Flecha del tooltip */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                              <div className={`border-4 border-transparent ${
                                m.isBonus 
                                  ? 'border-t-[#DC943A]' 
                                  : m.isMeta 
                                    ? 'border-t-[#008236]' 
                                    : 'border-t-slate-700'
                              }`}></div>
                            </div>
                          </div>
                        )}
                      
                        {/* Círculo marcador */}
                        <motion.div
                          className={`${isMeta ? 'w-14 h-14' : (isClientChallenge ? (idx === 1 || idx === 2 || idx === 4 ? 'w-9 h-9' : 'w-11 h-11') : isSimpleChallenge ? 'w-11 h-11' : (idx === 1 || idx === 3 ? 'w-9 h-9' : 'w-11 h-11'))} rounded-full flex items-center justify-center ${isMeta ? 'text-base' : 'text-sm'} font-bold transition-all border-[5px] cursor-help ${
                            idx === 0
                              ? 'bg-slate-100 text-slate-400 border-slate-300 opacity-0'
                              : isSimpleChallenge
                                ? (idx === 1
                                  ? m.completed
                                    ? 'bg-[#47CA45] text-white border-[#008236]/50'
                                    : 'bg-white text-[#8BDF89] border-[#8BDF89]'
                                  : 'bg-white text-slate-400 border-white')
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
                          {idx === 0 ? (
                            '0'
                          ) : isSimpleChallenge ? (
                            idx === 1 ? (
                              <Flag className="w-5 h-5" strokeWidth={3} fill="currentColor" />
                            ) : null
                          ) : isClientChallenge ? (
                            idx === 1 ? (
                              m.completed ? <Check className="w-4 h-4" strokeWidth={4} /> : null
                            ) : idx === 2 ? (
                              m.completed ? <Check className="w-4 h-4" strokeWidth={4} /> : null
                            ) : idx === 3 ? (
                              <Flag className="w-5 h-5" strokeWidth={3} fill="currentColor" />
                            ) : idx === 4 ? (
                              <Star className="w-4 h-4" strokeWidth={2.5} fill="currentColor" />
                            ) : null
                          ) : (
                            idx === 1 ? (
                              m.completed ? <Check className="w-5 h-5" strokeWidth={4} /> : null
                            ) : idx === 2 ? (
                              <Flag className="w-5 h-5" strokeWidth={3} fill="currentColor" />
                            ) : idx === 3 ? (
                              <Star className={`${isMeta ? 'w-5 h-5' : 'w-4 h-4'}`} strokeWidth={2.5} fill="currentColor" />
                            ) : null
                          )}
                        </motion.div>
                        
                        {/* Label debajo con puntos y porcentaje - todos alineados a la misma altura */}
                        <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center" style={{ top: labelTop }}>
                          <div className="flex flex-col items-center gap-0.5">
                            {/* Puntos con icono */}
                            <div className="flex items-center gap-0.5 justify-center">
                              <img src={coinIcon} alt="Coin" className="w-4 h-4" />
                              <span className={`text-sm font-bold leading-none ${m.isBonus ? 'text-[#DC943A]' : m.completed ? 'text-slate-700' : 'text-slate-400'}`}>
                                {m.isBonus ? `+${m.points.toLocaleString('es-CL')}` : m.points.toLocaleString('es-CL')}
                              </span>
                            </div>
                            {/* Porcentaje */}
                            {m.isBonus ? (
                              <span className="flex flex-col md:flex-row md:items-center md:gap-0.5 px-2 py-0.5 rounded-md bg-[#DC943A] text-white text-xs font-semibold mt-0.5 mb-6 md:mb-0">
                                <span>Bonus</span>
                                <span className="opacity-90">(150%)</span>
                              </span>
                            ) : m.isMeta ? (
                              <span className="flex flex-col md:flex-row md:items-center md:gap-0.5 px-2 py-0.5 rounded-md bg-[#47CA45] text-white text-xs font-semibold mt-0.5 mb-6 md:mb-0">
                                <span>Meta</span>
                                <span className="opacity-90">(100%)</span>
                              </span>
                            ) : (
                              <span className={`text-xs font-semibold text-center leading-none mt-0.5 ${m.completed ? 'text-slate-500' : 'text-slate-400'}`}>
                                ({m.shortLabel})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mensaje de estado debajo del gráfico */}
                <div className="text-center mt-10 md:mt-6">
                  {isSimpleChallenge ? (
                    // Lógica específica para desafío simple (solo 0% y 100%)
                    progressPercentage >= challenge.thresholds.cumplimiento ? (
                      <div className="w-full rounded-lg bg-white border border-[#47CA45]">
                        <div className="w-full px-4 py-2 rounded-lg bg-[#47CA45]/10">
                          <p className="text-sm font-bold text-[#008236]">
                            {challenge.status === 'finished'
                              ? '¡Meta cumplida! Lograste el objetivo y desbloqueaste tu recompensa'
                              : '¡Felicitaciones! Alcanzaste la meta'
                            }
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full rounded-lg bg-white border border-[#FF8000]/30">
                        <div className="w-full px-4 py-2 rounded-lg bg-[#FF8000]/10">
                          <p className="text-sm text-[#45556C]">
                            {challenge.status === 'finished'
                              ? '¡Sigue adelante! Cada desafío es una oportunidad para mejorar'
                              : (
                                <>
                                  ¡Te faltan <span className="font-bold text-[#FF8000]">{challenge.isMonetary 
                                    ? `$${(challenge.target - challenge.progress).toLocaleString('es-CL')}`
                                    : `${Math.round(100 - progressPercentage)}%`
                                  }</span> para alcanzar la meta!
                                </>
                              )
                            }
                          </p>
                        </div>
                      </div>
                    )
                  ) : (
                    // Lógica original para desafíos con subcumplimiento y sobrecumplimiento
                    progressPercentage >= challenge.thresholds.sobrecumplimiento ? (
                      <div className="w-full rounded-lg bg-white border border-[#FFD321]">
                        <div className="w-full px-4 py-2 rounded-lg bg-[#FFD321]/10">
                          <p className="text-sm font-bold text-[#DC943A]">
                            {challenge.status === 'finished' 
                              ? '¡Excelente resultado! Superaste ampliamente la meta y demostraste tu gran desempeño'
                              : '¡Increíble, superaste la meta!'
                            }
                          </p>
                        </div>
                      </div>
                    ) : progressPercentage >= challenge.thresholds.cumplimiento ? (
                      <div className="w-full rounded-lg bg-white border border-[#47CA45]">
                        <div className="w-full px-4 py-2 rounded-lg bg-[#47CA45]/10">
                          <p className="text-sm font-bold text-[#008236]">
                            {challenge.status === 'finished'
                              ? '¡Meta cumplida! Lograste el objetivo y desbloqueaste tu recompensa'
                              : '¡Felicitaciones! Alcanzaste la meta'
                            }
                          </p>
                        </div>
                      </div>
                    ) : progressPercentage >= 50 ? (
                      <div className="w-full rounded-lg bg-white border border-[#FF8000]/30">
                        <div className="w-full px-4 py-2 rounded-lg bg-[#FF8000]/10">
                          <p className="text-sm text-[#45556C]">
                            {challenge.status === 'finished' 
                              ? '¡Buen avance! No lograste la meta, pero sumaste puntos por tu esfuerzo.'
                              : (
                                <>
                                  ¡Te faltan <span className="font-bold text-[#FF8000]">{challenge.isMonetary 
                                    ? `$${(challenge.target - challenge.progress).toLocaleString('es-CL')}`
                                    : `${challenge.target - challenge.progress} ${challenge.unit}`
                                  }</span> para alcanzar la meta!
                                </>
                              )
                            }
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full rounded-lg bg-white border border-[#FF8000]/30">
                        <div className="w-full px-4 py-2 rounded-lg bg-[#FF8000]/10">
                          <p className="text-sm text-[#45556C]">
                            {challenge.status === 'finished'
                              ? '¡Sigue adelante! Cada desafío es una oportunidad para mejorar'
                              : (
                                <>
                                  ¡Te faltan <span className="font-bold text-[#FF8000]">{challenge.isMonetary 
                                    ? `$${(challenge.target - challenge.progress).toLocaleString('es-CL')}`
                                    : `${challenge.target - challenge.progress} ${challenge.unit}`
                                  }</span> para alcanzar la meta!
                                </>
                              )
                            }
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Recompensa */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
              <div className="flex flex-col items-center justify-center gap-3 text-center">
                <div className="flex items-center gap-2">
                  {progressPercentage >= challenge.thresholds.cumplimiento && challenge.status !== 'finished' && (
                    <Trophy className="w-5 h-5 text-[#FF8000]" strokeWidth={2.5} />
                  )}
                  <h3 className="text-lg font-bold text-[#45556C]">
                    {challenge.status === 'finished' 
                      ? (challenge.pointsLoaded ? 'Puntos cargados' : (currentPoints === 0 ? 'Puntos alcanzados' : 'Puntos por cargar'))
                      : 'Vas ganando'
                    }
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <img src={coinIcon} alt="Coin" className="w-10 h-10" />
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-[#FF8000]">
                      {currentPoints.toLocaleString('es-CL')}
                    </div>
                    <div className="text-sm text-slate-500">puntos</div>
                  </div>
                </div>
                
                {challenge.status === 'active' && (
                  <p className="text-xs text-slate-400 mt-1">
                    *Sujeto a revisión
                  </p>
                )}
                
                {challenge.status === 'finished' && currentPoints === 0 && (
                  <p className="text-xs text-slate-500 mt-1">
                    Los puntos de este desafío serán cargados durante los primeros 5 días hábiles del próximo mes.
                  </p>
                )}
                
                {challenge.status === 'finished' && currentPoints > 0 && (
                  <p className="text-xs text-slate-500 mt-1">
                    {challenge.pointsLoaded 
                      ? `Tus puntos fueron cargados el ${new Date(challenge.endDate).getDate()} de ${new Date(challenge.endDate).toLocaleDateString('es-ES', { month: 'long' })} a las ${new Date(challenge.endDate + 'T14:30:00').toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} hrs.`
                      : 'Tus puntos serán cargados durante los primeros 5 días hábiles del próximo mes.'
                    }
                  </p>
                )}
              </div>
            </div>

            {/* Disclaimer de actualización */}
            <p className="text-xs text-slate-400 text-center mt-4">
              Información actualizada al {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} a las {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} hrs.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Modal "Cómo ganar" */}
      <AnimatePresence>
        {showHelp && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-br from-[#FF8000] to-[#FF8000]/90 p-6 rounded-t-2xl z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Cómo ganar este desafío</h2>
                      <p className="text-white/90 text-sm">{challenge.title}</p>
                    </div>
                    <button
                      onClick={() => setShowHelp(false)}
                      className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6 md:p-8">
                  {/* Objetivo */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-[#45556C] mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#FF8000]" />
                      Objetivo del desafío
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {challenge.description}. Tu meta es alcanzar{' '}
                      <span className="font-bold text-[#45556C]">
                        {challenge.isMonetary 
                          ? `$${challenge.target.toLocaleString('es-CL')}` 
                          : `${challenge.target} ${challenge.unit}`}
                      </span>
                      {' '}antes del {new Date(challenge.endDate).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}.
                    </p>
                  </div>

                  {/* Sistema de hitos */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-[#45556C] mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-[#FF8000]" />
                      Sistema de hitos y recompensas
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Hito 1 - Subcumplimiento */}
                      <div className="bg-[#47CA45]/10 rounded-xl p-5 border border-[#47CA45]">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#47CA45] text-white flex items-center justify-center flex-shrink-0 border-[5px] border-[#008236]/50">
                            <Check className="w-4 h-4" strokeWidth={4} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-[#45556C] mb-2">Subcumplimiento</h4>
                            <p className="text-sm text-slate-600 mb-2">
                              Alcanza al menos el 60% de tu objetivo para desbloquear la primera recompensa.
                            </p>
                            <div className="flex items-center gap-2">
                              <img src={coinIcon} alt="Coin" className="w-5 h-5" />
                              <span className="text-sm font-bold text-[#45556C]">
                                {Math.floor(challenge.points * 0.6).toLocaleString('es-CL')} puntos
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hito 2 - Cumplimiento */}
                      <div className="bg-[#47CA45]/10 rounded-xl p-5 border-2 border-[#47CA45]">
                        <div className="flex items-start gap-4">
                          <motion.div 
                            className="w-14 h-14 rounded-full bg-[#47CA45] text-white flex items-center justify-center flex-shrink-0 border-[5px] border-[#008236]/50"
                            style={{
                              boxShadow: '0 4px 8px rgba(71, 202, 69, 0.6)'
                            }}
                            animate={{
                              scale: [1, 1.15, 1],
                              boxShadow: ['0 4px 8px rgba(71, 202, 69, 0.6)', '0 4px 10px rgba(71, 202, 69, 0.8)', '0 4px 8px rgba(71, 202, 69, 0.6)']
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <Flag className="w-5 h-5" strokeWidth={3} fill="currentColor" />
                          </motion.div>
                          <div className="flex-1">
                            <h4 className="font-bold text-[#45556C] mb-2">Cumplimiento</h4>
                            <p className="text-sm text-slate-600 mb-2">
                              ¡Completa el 100% de tu objetivo y recibe la recompensa completa!
                            </p>
                            <div className="flex items-center gap-2">
                              <img src={coinIcon} alt="Coin" className="w-5 h-5" />
                              <span className="text-sm font-bold text-[#45556C]">
                                {challenge.points.toLocaleString('es-CL')} puntos
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hito 3 - Sobrecumplimiento */}
                      <div className="bg-[#FFD321]/10 rounded-xl p-5 border border-[#FFD321] relative overflow-hidden">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#FFD321] text-white flex items-center justify-center flex-shrink-0 border-[5px] border-[#DC943A]">
                            <Star className="w-4 h-4" strokeWidth={2.5} fill="currentColor" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-[#45556C] mb-2">Sobrecumplimiento </h4>
                            <p className="text-sm text-slate-600 mb-2">
                              ¡Supera el 150% de tu objetivo y recibe puntos bonus! Cuanto más logres, m��s puntos ganarás.
                            </p>
                            <div className="flex items-center gap-2">
                              <img src={coinIcon} alt="Coin" className="w-5 h-5" />
                              <span className="text-sm font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                                Hasta {maxPoints.toLocaleString('es-CL')}+ puntos
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Consejos */}
                  <div className="bg-[#F5F8FB] rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-bold text-[#45556C] mb-3">💡 Consejos para ganar</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF8000] mt-2 flex-shrink-0" />
                        <span className="text-sm text-slate-600">
                          Revisa tu progreso regularmente para asegurarte de que vas por buen camino.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF8000] mt-2 flex-shrink-0" />
                        <span className="text-sm text-slate-600">
                          Planifica con anticipación: tienes hasta el{' '}
                          {new Date(challenge.endDate).toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'long' 
                          })} para completar este desafío.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF8000] mt-2 flex-shrink-0" />
                        <span className="text-sm text-slate-600">
                          ¡Apunta al sobrecumplimiento! Los puntos extra te ayudarán a canjear más premios.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Condiciones */}
                  <div>
                    <h3 className="text-lg font-bold text-[#45556C] mb-4">Condiciones del desafío</h3>
                    <div className="prose prose-sm max-w-none text-slate-600 space-y-4">
                      <p>
                        <strong className="text-[#45556C]">1. Revisión y cierre:</strong> Puntos sujetos a cambios tras la revisión del cierre.
                      </p>
                      
                      <p>
                        <strong className="text-[#45556C]">2. Período de validez:</strong> El desafío inicia el {new Date(challenge.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} y finaliza el {new Date(challenge.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} a las 23:59 hrs. El progreso se actualiza diariamente.
                      </p>
                    </div>
                  </div>

                  {/* Botón cerrar */}
                  <div className="mt-8">
                    <button
                      onClick={() => setShowHelp(false)}
                      className="w-full px-6 py-3 rounded-full bg-[#FF8000] text-white font-bold hover:bg-[#FF8000]/90 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Entendido
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Modal "Ranking" */}
      <AnimatePresence>
        {showRanking && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRanking(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-br from-[#FF8000] to-[#FF8000]/90 p-6 rounded-t-2xl z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{challenge.status === 'finished' ? 'Ranking final' : 'Ranking del desafío'}</h2>
                      <p className="text-white/90 text-sm">{challenge.title}</p>
                    </div>
                    <button
                      onClick={() => setShowRanking(false)}
                      className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6 md:p-8">
                  {/* Resumen de posición del usuario */}
                  <div className="bg-gradient-to-r from-[#FF8000]/10 to-[#FF8000]/5 border border-[#FF8000]/20 rounded-xl px-4 py-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-[#FF8000]" />
                        <span className="text-sm font-semibold text-[#45556C]">
                          Tu posición: <span className="text-[#FF8000] font-bold text-lg">7°</span>
                        </span>
                      </div>
                      <span className="text-sm text-[#45556C]/70">
                        de <span className="font-bold text-[#45556C]">{mockRankingData.length}</span> participantes
                      </span>
                    </div>
                  </div>

                  {/* Header de columnas */}
                  <div className="flex items-center justify-between px-4 pb-3 mb-1">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-sm font-bold text-[#45556C] w-8 text-center">Posición</span>
                    </div>
                    <span className="text-sm font-bold text-[#45556C]">Progreso</span>
                  </div>
                  
                  {/* Lista de ranking - diseño moderno */}
                  <div className="space-y-1.5">
                    {mockRankingData.map((item, index) => {
                      const hasMetGoal = item.progress >= 100; // Alcanzó o superó la meta
                      const isCurrentUser = item.name === 'Carlos Toledo';
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                            hasMetGoal 
                              ? 'bg-[#47CA45]/10 hover:bg-[#47CA45]/15 border border-[#47CA45]' 
                              : 'bg-slate-100 hover:bg-slate-200'
                          } ${isCurrentUser ? 'bg-[#FF8000]/5' : ''}`}
                        >
                          {/* Posición */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <span className={`text-lg font-bold w-8 text-center flex-shrink-0 ${
                              hasMetGoal ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              {item.position}
                            </span>
                            
                            {/* Avatar y nombre */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <img 
                                src={avatarImages[item.name] || profileImage} 
                                alt={item.name}
                                className={`w-9 h-9 rounded-full object-cover flex-shrink-0 border-2 ${
                                  hasMetGoal ? 'border-[#47CA45]/30' : 'border-slate-200'
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <div className={`font-medium block truncate ${
                                  hasMetGoal ? 'text-[#008236] font-bold' : 'text-[#45556C]'
                                }`}>
                                  {item.name}
                                  {isCurrentUser && <span className="text-[#FF8000] ml-2 text-xs font-bold">(Tú)</span>}
                                </div>
                                <div className="text-xs text-slate-500 truncate">
                                  {item.role} • {item.branch}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Progreso */}
                          <div className={`flex items-center gap-2 flex-shrink-0 px-3 py-1.5 rounded-full ${
                            hasMetGoal ? 'bg-[#47CA45]/20' : 'bg-slate-200/60'
                          }`}>
                            <span className={`${
                              hasMetGoal ? 'text-[#008236] text-lg font-black' : 'text-[#45556C] text-base font-bold'
                            }`}>
                              {item.progress}%
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}