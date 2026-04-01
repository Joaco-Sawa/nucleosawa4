// Vista Muro - Feed de noticias
import { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Heart, MessageCircle, ImageOff, Play, ArrowRight, Star, Calendar, Filter } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import profileImage from '../assets/9f5aa0e583374b6893d8921a6183b99d788006eb.png';
import coinIcon from '../assets/db29ff4dc98462b3539ca31d029b8918fad5d4e6.png';
import logoDesafioSawa from '../assets/90d0b6e7e40ee202a8c067619d31d9c79731c384.png';
import knowledgeContestImage from '../assets/Pon_a_prueba_tu.jpg';
import newContestImage from '../assets/img_concurso.jpg';
import encuestaClimaImage from '../assets/Encuesta.jpg';
import recordHistoricoImage from '../assets/Frame_824.jpg';
import tallerLiderazgoImage from '../assets/Taller_de_liderazgo.jpg';
import iniciativaVerdeImage from '../assets/Iniciativa_verde.jpg';
import programaBienestarImage from '../assets/Nuevo_programa_de_bienestar.jpg';
import { DateRangePicker } from './DateRangePicker';
import { EncuestaModal } from './EncuestaModal';

// Helper function: Obtener gradiente por categoría
const getCategoryGradient = (category: string): string => {
  const gradients: { [key: string]: string } = {
    'Logros del equipo': 'linear-gradient(135deg, #FFB366 0%, #FFCC99 100%)',
    'Beneficios': 'linear-gradient(135deg, #7BA5F5 0%, #A3C4F9 100%)',
    'Sostenibilidad': 'linear-gradient(135deg, #5FD4A8 0%, #8FE5C7 100%)',
    'Desarrollo profesional': 'linear-gradient(135deg, #A88BFA 0%, #C4B5FD 100%)',
    'Cultura organizacional': 'linear-gradient(135deg, #F472B6 0%, #FBADCF 100%)',
    'Catálogo': 'linear-gradient(135deg, #8B8FF8 0%, #ADAFFC 100%)',
  };
  return gradients[category] || 'linear-gradient(135deg, #FFB366 0%, #FFCC99 100%)'; // Default: naranja corporativo
};

// Helper function: Obtener patrón decorativo por categoría
const getCategoryPattern = (category: string): string => {
  // Patrón de puntos sutiles sobre el gradiente
  const dotPattern = `radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)`;
  return `${dotPattern}, ${getCategoryGradient(category)}`;
};

// Helper function: Calcular días restantes para concursos
const getDaysRemaining = (endDate: string): number => {
  const today = new Date('2026-03-18'); // Fecha actual según el contexto
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Helper function: Formatear fecha relativa según antigüedad
const getRelativeDate = (publishedDate: string): string => {
  // Fecha actual del contexto (24 marzo 2026 a las 19:00)
  const currentDate = new Date('2026-03-24T19:00:00');
  const published = new Date(publishedDate);
  
  // Calcular diferencia en milisegundos
  const diffMs = currentDate.getTime() - published.getTime();
  
  // Si la fecha es futura, mostrar formato de fecha antiguo
  if (diffMs < 0) {
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const day = published.getDate();
    const month = months[published.getMonth()];
    const year = published.getFullYear();
    return `${day} ${month} ${year}`;
  }
  
  // Convertir a minutos, horas y días
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Última hora: "Hace XX min"
  if (diffMinutes < 60) {
    return `Hace ${diffMinutes} min`;
  }
  
  // Mismo día: "Hace X h"
  if (diffHours < 24 && diffDays === 0) {
    return `Hace ${diffHours} h`;
  }
  
  // Contenido reciente (<7 días): "Hace X días"
  if (diffDays < 7) {
    return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  }
  
  // Noticias antiguas (+7 días): "20 feb 2026"
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const day = published.getDate();
  const month = months[published.getMonth()];
  const year = published.getFullYear();
  
  return `${day} ${month} ${year}`;
};

interface NewsArticle {
  id: number;
  title: string;
  image: string | null; // Ahora puede ser null para noticias sin imagen
  videoUrl?: string; // Nuevo: URL de YouTube para noticias con video
  excerpt: string;
  author: string;
  authorImage: string;
  date: string;
  publishedDate: string; // Formato YYYY-MM-DD para filtrado
  publishedAgo: string;
  readTime: string;
  likes: number;
  comments: number;
  category: string;
  type: 'noticia' | 'concurso' | 'encuesta'; // Agregado tipo 'encuesta'
  contestEndDate?: string; // Fecha de fin del concurso (formato YYYY-MM-DD)
  contestPrizePoints?: number; // Puntos del premio para concursos
  ctaButton?: { // Nuevo: botón CTA opcional
    text: string;
    link: string;
  };
}

// Mock data - En producción vendría de una API
const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: '¡Récord histórico! Nuestro equipo supera todas las metas del trimestre',
    image: recordHistoricoImage,
    excerpt: 'Un logro sin precedentes que demuestra el compromiso y dedicación de todo el equipo.',
    author: 'Ana García',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    date: '10 de marzo de 2026',
    publishedDate: '2026-03-10',
    publishedAgo: 'Hace 3 días',
    readTime: '3 min',
    likes: 124,
    comments: 18,
    category: 'Logros del equipo',
    type: 'noticia'
  },
  {
    id: 17,
    title: '📊 Encuesta de Clima Organizacional 2026',
    image: encuestaClimaImage,
    excerpt: 'Tu opinión es fundamental para mejorar nuestro ambiente laboral. Participa y ayúdanos a construir un mejor lugar para trabajar.',
    author: 'Recursos Humanos',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    date: '23 de marzo de 2026',
    publishedDate: '2026-03-23',
    publishedAgo: 'Hace 1 día',
    readTime: '3 min',
    likes: 92,
    comments: 15,
    category: 'Encuestas',
    type: 'encuesta'
  },
  {
    id: 14,
    title: '¡Tu hoja de ruta para este 2026!',
    image: newContestImage,
    excerpt: 'Comenzar el año con objetivos claros es la clave para llegar lejos.',
    author: 'Desarrollo de Talento',
    authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    date: '12 de marzo de 2026',
    publishedDate: '2026-03-12',
    publishedAgo: 'Hace 12 días',
    readTime: '5 min',
    likes: 215,
    comments: 38,
    category: 'Desarrollo profesional',
    type: 'concurso',
    contestEndDate: '2026-03-25', // Fecha de finalización del concurso
    contestPrizePoints: 100 // Puntos del premio para el ganador
  },
  {
    id: 15,
    title: '¡Pon a prueba tu conocimiento y gana!',
    image: knowledgeContestImage,
    excerpt: 'Demuestra lo que sabes sobre nuestra empresa y participa por 200 puntos. ¿Estás listo para el desafío?',
    author: 'Comunicaciones',
    authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    date: '20 de marzo de 2026',
    publishedDate: '2026-03-20',
    publishedAgo: 'Hace 4 días',
    readTime: '4 min',
    likes: 89,
    comments: 15,
    category: 'Logros del equipo',
    type: 'concurso',
    contestEndDate: '2026-03-28',
    contestPrizePoints: 200
  },
  {
    id: 13,
    title: '🎓 Taller de Liderazgo Transformacional 2026',
    image: tallerLiderazgoImage,
    excerpt: 'Desarrolla habilidades de liderazgo que inspiran, motivan y transforman equipos de alto rendimiento.',
    author: 'Desarrollo de Talento',
    authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    date: '28 de febrero de 2026',
    publishedDate: '2026-02-28',
    publishedAgo: 'Hace 2 semanas',
    readTime: '6 min',
    likes: 145,
    comments: 34,
    category: 'Desarrollo profesional',
    type: 'noticia',
    ctaButton: {
      text: 'Inscribirse',
      link: 'https://www.ejemplo.com/inscripcion-liderazgo'
    }
  },
  {
    id: 2,
    title: 'Nuevo programa de bienestar: Gimnasio y actividades deportivas',
    image: programaBienestarImage,
    excerpt: 'Lanzamos beneficios exclusivos para cuidar tu salud física y mental.',
    author: 'Roberto Martínez',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    date: '8 de marzo de 2026',
    publishedDate: '2026-03-08',
    publishedAgo: 'Hace 5 días',
    readTime: '4 min',
    likes: 89,
    comments: 12,
    category: 'Beneficios',
    type: 'noticia'
  },
  {
    id: 3,
    title: 'Iniciativa verde: Comprometidos con la sostenibilidad (c/ botón interno)',
    image: iniciativaVerdeImage,
    excerpt: 'Nuevas acciones para reducir nuestra huella de carbono y proteger el medio ambiente.',
    author: 'Laura Jiménez',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    date: '5 de marzo de 2026',
    publishedDate: '2026-03-05',
    publishedAgo: 'Hace 1 semana',
    readTime: '5 min',
    likes: 156,
    comments: 24,
    category: 'Sostenibilidad',
    type: 'noticia'
  },
  {
    id: 4,
    title: 'Capacitaciones 2026: Invierte en tu desarrollo profesional (imagen fallback)',
    image: 'https://invalid-url-to-trigger-fallback.jpg',
    excerpt: 'Descubre los cursos y talleres disponibles para potenciar tus habilidades.',
    author: 'Miguel Ángel Ruiz',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    date: '3 de marzo de 2026',
    publishedDate: '2026-03-03',
    publishedAgo: 'Hace 10 días',
    readTime: '4 min',
    likes: 92,
    comments: 15,
    category: 'Desarrollo profesional',
    type: 'noticia'
  },
  {
    id: 12,
    title: '📹 Tutorial: Cómo aprovechar al máximo tu plataforma de capacitaciones',
    image: null,
    videoUrl: 'u31qwQUeGuM',
    excerpt: 'Aprende en 5 minutos a navegar, inscribirte y certificarte en nuestros cursos online.',
    author: 'Equipo de Capacitación',
    authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    date: '2 de marzo de 2026',
    publishedDate: '2026-03-02',
    publishedAgo: 'Hace 11 días',
    readTime: '5 min',
    likes: 87,
    comments: 22,
    category: 'Desarrollo profesional',
    type: 'noticia'
  },
  {
    id: 8,
    title: '👨‍👩‍👧 Beneficios para padres: Flexibilidad y apoyo familiar (no disponible)',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    excerpt: 'Nuevas políticas de licencias parentales extendidas, horarios flexibles y apoyo para el cuidado infantil.',
    author: 'Recursos Humanos',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    date: '25 de febrero de 2026',
    publishedDate: '2026-02-25',
    publishedAgo: 'Hace 3 semanas',
    readTime: '5 min',
    likes: 198,
    comments: 47,
    category: 'Beneficios',
    type: 'noticia'
  },
  {
    id: 5,
    title: 'Colaboración que inspira: Historias de éxito del equipo',
    image: 'https://images.unsplash.com/photo-1758873268663-5a362616b5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    excerpt: 'Conoce cómo la colaboración está transformando nuestra forma de trabajar.',
    author: 'Patricia López',
    authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    date: '1 de marzo de 2026',
    publishedDate: '2026-03-01',
    publishedAgo: 'Hace 12 días',
    readTime: '6 min',
    likes: 178,
    comments: 31,
    category: 'Cultura organizacional',
    type: 'noticia'
  },
  {
    id: 6,
    title: 'Actualización del catálogo: Nuevos productos disponibles',
    image: 'https://images.unsplash.com/photo-1740818576518-0c873d356122?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    excerpt: 'Amplía tus opciones de canje con más de 50 productos nuevos.',
    author: 'Fernando Soto',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    date: '27 de febrero de 2026',
    publishedDate: '2026-02-27',
    publishedAgo: 'Hace 2 semanas',
    readTime: '5 min',
    likes: 203,
    comments: 45,
    category: 'Catálogo',
    type: 'noticia'
  },
  {
    id: 9,
    title: 'Innovación tecnológica: Nuevas herramientas para optimizar tu trabajo',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    excerpt: 'Implementamos software de última generación para mejorar la colaboración y productividad.',
    author: 'Área de Tecnología',
    authorImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    date: '22 de febrero de 2026',
    publishedDate: '2026-02-22',
    publishedAgo: 'Hace 3 semanas',
    readTime: '5 min',
    likes: 134,
    comments: 28,
    category: 'Desarrollo profesional',
    type: 'noticia'
  },
  {
    id: 11,
    title: '🏢 Nuevos espacios de trabajo colaborativo en la oficina',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    excerpt: 'Descubre las nuevas salas de reuniones interactivas, zonas de coworking y espacios creativos diseñados para potenciar la innovación.',
    author: 'Gestión de Espacios',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    date: '18 de febrero de 2026',
    publishedDate: '2026-02-18',
    publishedAgo: 'Hace 1 mes',
    readTime: '4 min',
    likes: 167,
    comments: 38,
    category: 'Cultura organizacional',
    type: 'noticia'
  },
  {
    id: 10,
    title: '🏆 Reconocimiento a la excelencia: Destacados del mes',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    excerpt: 'Celebramos a los colaboradores que se destacaron por su excelencia, innovación y compromiso este mes.',
    author: 'Comunicaciones Corporativas',
    authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    date: '15 de febrero de 2026',
    publishedDate: '2026-02-15',
    publishedAgo: 'Hace 1 mes',
    readTime: '4 min',
    likes: 289,
    comments: 52,
    category: 'Logros del equipo',
    type: 'noticia'
  }
];

export function Muro() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState<string | null>(null);
  const [dateRangeEnd, setDateRangeEnd] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'todas' | 'noticia' | 'concurso' | 'encuesta' | 'catalogo'>('todas');
  const [dateFilter, setDateFilter] = useState<'7days' | 'thisMonth' | 'lastMonth' | 'custom' | null>(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const userPoints = 15000;
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Restaurar visibleNewsCount desde sessionStorage ANTES del primer render
  const savedCount = sessionStorage.getItem('muroVisibleCount');
  const [visibleNewsCount, setVisibleNewsCount] = useState(savedCount ? parseInt(savedCount, 10) : 8);

  const [failedImages, setFailedImages] = useState<Set<number>>(new Set()); // Rastrear imágenes que fallaron
  const [likedNews, setLikedNews] = useState<Set<number>>(new Set([1])); // Estado para rastrear noticias con "me gusta" - ID: 1 activo por defecto
  const scrollRestoredRef = useRef(false); // Para evitar múltiples restauraciones
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref al contenedor con scroll
  const [showEncuestaModal, setShowEncuestaModal] = useState(false); // Estado para modal de encuesta
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null); // Estado para rastrear card con hover
  
  // Estados del carrusel
  const featuredNews = newsArticles.filter(article => article.type === 'noticia').slice(0, 4);
  const infiniteFeaturedNews = [featuredNews[featuredNews.length - 1], ...featuredNews, featuredNews[0]];

  // Restaurar scroll: DEBE ejecutarse lo más temprano posible
  useEffect(() => {
    // Deshabilitar el scroll restoration automático del navegador
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const savedScrollPosition = sessionStorage.getItem('muroScrollPosition');
    const container = scrollContainerRef.current;
    
    if (savedScrollPosition && container && !scrollRestoredRef.current) {
      const scrollPos = parseInt(savedScrollPosition, 10);
      
      // Método 1: Inmediato
      container.scrollTop = scrollPos;
      
      // Método 2: Después del siguiente frame
      requestAnimationFrame(() => {
        container.scrollTop = scrollPos;
      });
      
      // Método 3: Con timeout pequeño
      setTimeout(() => {
        container.scrollTop = scrollPos;
      }, 100);
      
      // Método 4: Con timeout mayor para asegurar que imágenes carguen
      setTimeout(() => {
        container.scrollTop = scrollPos;
        scrollRestoredRef.current = true;
        
        // Limpiar SOLO después de confirmar restauración
        sessionStorage.removeItem('muroScrollPosition');
        sessionStorage.removeItem('muroVisibleCount');
      }, 300);
    }
  }, []);

  // Leer parámetro de URL para activar filtro de concursos si viene desde un concurso
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam === 'concurso') {
      setFilterType('concurso');
      // Limpiar el parámetro de la URL después de aplicarlo
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Guardar posición del scroll antes de navegar al detalle
  const handleNewsClick = (id: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const currentScroll = container.scrollTop;
    const currentCount = visibleNewsCount;
    
    sessionStorage.setItem('muroScrollPosition', currentScroll.toString());
    sessionStorage.setItem('muroVisibleCount', currentCount.toString());
    
    navigate(`/muro/${id}`);
  };

  // Auto-play del carrusel cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentSlide === 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
        setCurrentSlide(featuredNews.length);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 500);
      return () => clearTimeout(timer);
    } else if (currentSlide === infiniteFeaturedNews.length - 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
        setCurrentSlide(1);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  const nextSlide = () => {
    if (!isTransitioning) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index + 1);
  };

  // Touch handlers para mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide();
    }

    if (touchStart - touchEnd < -75) {
      prevSlide();
    }
  };

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setShowDateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar cambios en el filtro de fecha predefinido
  useEffect(() => {
    if (!dateFilter) {
      setDateRangeStart(null);
      setDateRangeEnd(null);
      return;
    }

    const today = new Date('2026-03-26'); // Fecha actual del contexto
    let start: Date;
    let end: Date = today;

    switch (dateFilter) {
      case '7days':
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'custom':
        // No hacer nada, el usuario seleccionará el rango
        return;
    }

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    setDateRangeStart(formatDate(start));
    setDateRangeEnd(formatDate(end));
  }, [dateFilter]);

  // Filtrar noticias por búsqueda y rango de fechas
  const filteredNews = newsArticles.filter(article => {
    // Filtro de búsqueda
    const matchesSearch = searchKeyword === '' || 
      article.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      article.category.toLowerCase().includes(searchKeyword.toLowerCase());

    // Filtro por rango de fechas (DateRangePicker)
    let matchesDateRange = true;
    if (dateRangeStart && dateRangeEnd) {
      const rangeStart = new Date(dateRangeStart);
      const rangeEnd = new Date(dateRangeEnd);
      const publishDate = new Date(article.publishedDate);
      matchesDateRange = publishDate >= rangeStart && publishDate <= rangeEnd;
    }

    // Filtro por tipo (noticias/concursos/encuestas/catálogo)
    let matchesType = false;

    if (filterType === 'todas') {
      matchesType = true;
    } else if (filterType === 'encuesta') {
      matchesType = article.type === 'encuesta';
    } else if (filterType === 'catalogo') {
      matchesType = article.category === 'Catálogo';
    } else if (filterType === 'noticia') {
      // Solo noticias, excluyendo encuestas y catálogo
      matchesType = article.type === 'noticia' && article.category !== 'Catálogo';
    } else {
      matchesType = article.type === filterType;
    }

    return matchesSearch && matchesDateRange && matchesType;
  });

  // Handler para manejar errores de carga de imágenes
  const handleImageError = (articleId: number) => {
    setFailedImages(prev => new Set(prev).add(articleId));
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 flex flex-col min-w-0 w-full max-w-full md:h-[calc(100vh-1rem)] md:overflow-y-auto md:m-2 overflow-y-auto overflow-x-hidden pb-[88px] md:pb-0"
    >
      {/* Header */}
      <header 
        className={`bg-white md:bg-white/95 md:backdrop-blur-md transition-all duration-300 md:rounded-2xl md:sticky md:top-0 md:z-30 flex-shrink-0`}
        style={window.innerWidth >= 768 ? { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)' } : {}}
      >
        {/* Desktop Header */}
        <div className="hidden md:block py-[25px] px-6">
          <div className="flex items-center gap-4">
            {/* Left: Search */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar noticia..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-[240px] pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all text-sm"
                />
              </div>

              {/* Tipo Dropdown */}
              <div className="relative" ref={typeDropdownRef}>
                <button
                  onClick={() => {
                    setShowTypeDropdown(!showTypeDropdown);
                    setShowDateDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 transition-all text-sm font-medium text-slate-700 shadow-sm"
                >
                  <Filter className="w-4 h-4" />
                  <span>Tipo:</span>
                  <span className={`font-semibold ${filterType !== 'todas' ? 'text-[#FF8000]' : ''}`}>
                    {filterType === 'todas' && 'Todo'}
                    {filterType === 'noticia' && 'Noticias'}
                    {filterType === 'concurso' && 'Concursos'}
                    {filterType === 'encuesta' && 'Encuestas'}
                    {filterType === 'catalogo' && 'Catálogo'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showTypeDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setFilterType('todas');
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        filterType === 'todas'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Todo
                    </button>
                    <button
                      onClick={() => {
                        setFilterType('noticia');
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        filterType === 'noticia'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Noticias
                    </button>
                    <button
                      onClick={() => {
                        setFilterType('concurso');
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        filterType === 'concurso'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Concursos
                    </button>
                    <button
                      onClick={() => {
                        setFilterType('encuesta');
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        filterType === 'encuesta'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Encuestas
                    </button>
                    <button
                      onClick={() => {
                        setFilterType('catalogo');
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        filterType === 'catalogo'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Catálogo
                    </button>
                  </div>
                )}
              </div>

              {/* Fecha Dropdown */}
              <div className="relative" ref={dateDropdownRef}>
                <button
                  onClick={() => {
                    setShowDateDropdown(!showDateDropdown);
                    setShowTypeDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 transition-all text-sm font-medium text-slate-700 shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Fecha:</span>
                  <span className={`font-semibold ${dateFilter ? 'text-[#FF8000]' : ''}`}>
                    {!dateFilter && 'Todo'}
                    {dateFilter === '7days' && 'Últimos 7 días'}
                    {dateFilter === 'thisMonth' && 'Este mes'}
                    {dateFilter === 'lastMonth' && 'Mes pasado'}
                    {dateFilter === 'custom' && 'Rango'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDateDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setDateFilter(null);
                        setShowDateDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        !dateFilter
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Todo
                    </button>
                    <button
                      onClick={() => {
                        setDateFilter('7days');
                        setShowDateDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        dateFilter === '7days'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Últimos 7 días
                    </button>
                    <button
                      onClick={() => {
                        setDateFilter('thisMonth');
                        setShowDateDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        dateFilter === 'thisMonth'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Este mes
                    </button>
                    <button
                      onClick={() => {
                        setDateFilter('lastMonth');
                        setShowDateDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        dateFilter === 'lastMonth'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Mes pasado
                    </button>
                    <button
                      onClick={() => {
                        setDateFilter('custom');
                        setShowDateDropdown(false);
                        setShowDatePicker(true);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        dateFilter === 'custom'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Rango
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1" />

            {/* Right: Points Badge */}
            <div className="min-w-[140px] h-[52px] w-fit rounded-xl bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 hover:shadow-lg hover:shadow-[#FF8000]/30 transition-all duration-300 px-3 flex items-center gap-3 cursor-pointer flex-shrink-0">
              <img src={coinIcon} alt="Coin" className="w-8 h-8 flex-shrink-0" />
              <div className="flex flex-col pr-2">
                <div className="text-[10px] text-white font-medium opacity-90">Tus puntos</div>
                <div className="text-[20px] font-bold text-white leading-none" style={{ fontWeight: 800 }}>{userPoints.toLocaleString('es-CL')}</div>
              </div>
            </div>
          </div>

          {/* DateRangePicker - Shown when custom range is selected */}
          {showDatePicker && dateFilter === 'custom' && (
            <div className="flex justify-end px-6 pb-4" ref={datePickerRef}>
              <DateRangePicker
                onClose={() => {
                  setShowDatePicker(false);
                  setDateFilter(null);
                }}
                onApply={(start, end) => {
                  setDateRangeStart(start);
                  setDateRangeEnd(end);
                  setShowDatePicker(false);
                }}
                onClear={() => {
                  setDateRangeStart(null);
                  setDateRangeEnd(null);
                  setDateFilter(null);
                  setShowDatePicker(false);
                }}
              />
            </div>
          )}
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
          <div className="px-4 py-3 bg-[#F5F8FB]">
            {/* Buscador */}
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-3 py-2 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all text-sm shadow-sm"
                />
              </div>
            </div>

            {/* Dropdowns */}
            <div className="flex items-center gap-2">
              {/* Tipo Dropdown */}
              <div className="relative flex-1">
                <button
                  onClick={() => {
                    setShowTypeDropdown(!showTypeDropdown);
                    setShowDateDropdown(false);
                  }}
                  className="w-full flex items-center justify-between gap-1.5 px-3 py-2 rounded-full bg-white border border-slate-200 active:bg-slate-50 transition-all text-xs font-medium text-slate-700 shadow-sm"
                >
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className={`font-semibold truncate ${filterType !== 'todas' ? 'text-[#FF8000]' : ''}`}>
                      {filterType === 'todas' && 'Todo'}
                      {filterType === 'noticia' && 'Noticias'}
                      {filterType === 'concurso' && 'Concursos'}
                      {filterType === 'encuesta' && 'Encuestas'}
                      {filterType === 'catalogo' && 'Catálogo'}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showTypeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setFilterType('todas');
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        filterType === 'todas'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 active:bg-slate-50'
                      }`}
                    >
                      Todo
                    </button>
                    <button
                      onClick={() => {
                        setFilterType('noticia');
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        filterType === 'noticia'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 active:bg-slate-50'
                      }`}
                    >
                      Noticias
                    </button>
                    <button
                      onClick={() => {
                        setFilterType('concurso');
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        filterType === 'concurso'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 active:bg-slate-50'
                      }`}
                    >
                      Concursos
                    </button>
                    <button
                      onClick={() => {
                        setFilterType('encuesta');
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        filterType === 'encuesta'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 active:bg-slate-50'
                      }`}
                    >
                      Encuestas
                    </button>
                    <button
                      onClick={() => {
                        setFilterType('catalogo');
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        filterType === 'catalogo'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 active:bg-slate-50'
                      }`}
                    >
                      Catálogo
                    </button>
                  </div>
                )}
              </div>

              {/* Fecha Dropdown */}
              <div className="relative flex-1">
                <button
                  onClick={() => {
                    setShowDateDropdown(!showDateDropdown);
                    setShowTypeDropdown(false);
                  }}
                  className="w-full flex items-center justify-between gap-1.5 px-3 py-2 rounded-full bg-white border border-slate-200 active:bg-slate-50 transition-all text-xs font-medium text-slate-700 shadow-sm"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className={`font-semibold truncate ${dateFilter ? 'text-[#FF8000]' : ''}`}>
                      {!dateFilter && 'Todo'}
                      {dateFilter === '7days' && 'Últimos 7 días'}
                      {dateFilter === 'thisMonth' && 'Este mes'}
                      {dateFilter === 'lastMonth' && 'Mes pasado'}
                      {dateFilter === 'custom' && 'Rango'}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDateDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setDateFilter(null);
                        setShowDateDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        !dateFilter
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 active:bg-slate-50'
                      }`}
                    >
                      Todo
                    </button>
                    <button
                      onClick={() => {
                        setDateFilter('7days');
                        setShowDateDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        dateFilter === '7days'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 active:bg-slate-50'
                      }`}
                    >
                      Últimos 7 días
                    </button>
                    <button
                      onClick={() => {
                        setDateFilter('thisMonth');
                        setShowDateDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        dateFilter === 'thisMonth'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 active:bg-slate-50'
                      }`}
                    >
                      Este mes
                    </button>
                    <button
                      onClick={() => {
                        setDateFilter('lastMonth');
                        setShowDateDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        dateFilter === 'lastMonth'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 active:bg-slate-50'
                      }`}
                    >
                      Mes pasado
                    </button>
                    <button
                      onClick={() => {
                        setDateFilter('custom');
                        setShowDateDropdown(false);
                        setShowDatePicker(true);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        dateFilter === 'custom'
                          ? 'bg-[#FF8000]/10 text-[#FF8000] font-semibold'
                          : 'text-slate-700 active:bg-slate-50'
                      }`}
                    >
                      Rango
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* DateRangePicker - Mobile */}
            {showDatePicker && dateFilter === 'custom' && (
              <div className="mt-3" ref={datePickerRef}>
                <DateRangePicker
                  onClose={() => {
                    setShowDatePicker(false);
                    setDateFilter(null);
                  }}
                  onApply={(start, end) => {
                    setDateRangeStart(start);
                    setDateRangeEnd(end);
                    setShowDatePicker(false);
                  }}
                  onClear={() => {
                    setDateRangeStart(null);
                    setDateRangeEnd(null);
                    setDateFilter(null);
                    setShowDatePicker(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content - Grid de noticias */}
      <div className="pt-0 md:pt-6 pb-3 md:pb-6">

        {/* Carrusel de noticias destacadas - Visible cuando filterType es 'todas', 'noticia', 'concurso', 'encuesta' o 'catalogo' */}
        {(filterType === 'todas' || filterType === 'noticia' || filterType === 'concurso' || filterType === 'encuesta' || filterType === 'catalogo') && (
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            {/* Carrusel de noticias destacadas */}
            <div
              className="relative rounded-2xl md:rounded-3xl overflow-hidden mb-3 md:mb-6 group shadow-md shadow-[#FF8000]/10 hover:shadow-xl hover:shadow-[#FF8000]/20 transition-all duration-300"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div
                animate={{ x: `-${currentSlide * 100}%` }}
                transition={isTransitioning ? { duration: 0 } : {
                  type: "tween",
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                className="flex"
              >
                {infiniteFeaturedNews.map((news, index) => (
                  <div
                    key={index}
                    onClick={() => handleNewsClick(news.id)}
                    className="relative w-full flex-shrink-0 cursor-pointer group aspect-[5/2] md:aspect-[21/5]"
                  >
                    {/* Imagen de fondo o Placeholder */}
                    {news.image ? (
                      <>
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-full object-cover flex-shrink-0 pointer-events-none"
                          style={{
                            objectPosition:
                              news.id === 1 ? 'center 25%' : // Récord histórico - mostrar parte superior
                              news.id === 13 ? 'center 35%' : // Taller de liderazgo - mostrar contenido principal
                              news.id === 3 ? 'center 50%' : // Iniciativa verde - centrado
                              news.id === 2 ? 'center 45%' : // Programa bienestar - mostrar texto principal
                              news.id === 15 ? 'center 50%' : // Pon a prueba - centrado
                              news.id === 17 ? 'center 45%' : // Encuesta - mostrar texto principal
                              'center center' // Por defecto centrado
                          }}
                        />
                        
                        {/* Degradado negro de abajo hacia arriba */}
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black to-transparent"
                          style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)'
                          }}
                        />
                      </>
                    ) : (
                      <>
                        {/* Sin imagen: fondo gris corporativo 3% con logo en 80% opacidad */}
                        <div className="w-full h-full flex items-center justify-center bg-[#45556C]/[0.03]">
                          <img
                            src={logoDesafioSawa}
                            alt="Logo"
                            className="h-28 md:h-40 object-contain opacity-80"
                          />
                        </div>

                        {/* Degradado negro de abajo hacia arriba - más suave para placeholder */}
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black to-transparent"
                          style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)'
                          }}
                        />
                      </>
                    )}

                    {/* Contenido: título y bajada */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <h3 className="text-white font-bold text-lg md:text-xl mb-0.5 md:mb-1 line-clamp-2" style={{ lineHeight: '1.2' }}>
                        {news.title}
                      </h3>
                      <p className="text-white/90 text-xs md:text-sm line-clamp-1 md:line-clamp-2" style={{ lineHeight: '1.3' }}>
                        {news.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center gap-2 mb-6 md:mb-8">
              {featuredNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    (currentSlide === index + 1) ||
                    (currentSlide === 0 && index === featuredNews.length - 1) ||
                    (currentSlide === infiniteFeaturedNews.length - 1 && index === 0)
                      ? 'bg-[#FF8000] w-6'
                      : 'bg-slate-300 hover:bg-[#FF8000]/50 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Grid: 1 columna en mobile, 2 columnas en desktop */}
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {filteredNews.slice(0, visibleNewsCount).map(article => {
            const isConcurso = article.type === 'concurso';
            
            return (
              <div
                key={article.id}
                onClick={() => handleNewsClick(article.id)}
                onMouseEnter={() => setHoveredCardId(article.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group h-full flex flex-col ${isConcurso ? 'border-[1.5px] border-[#A261B6]' : ''}`}
                style={{
                  boxShadow: hoveredCardId === article.id
                    ? '0 12px 32px rgba(255, 128, 0, 0.25), 0 4px 12px rgba(255, 128, 0, 0.15)'
                    : '0 2px 8px rgba(0, 0, 0, 0.06)'
                }}
              >
                  {/* Imagen o Gradiente */}
                  <div className="relative w-full aspect-[28/9] overflow-hidden flex-shrink-0">
                    {article.videoUrl ? (
                      // Con video de YouTube: mostrar thumbnail con ícono play
                      <>
                        <img 
                          src={`https://img.youtube.com/vi/${article.videoUrl}/maxresdefault.jpg`}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Overlay con ícono play */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#FF8000] group-hover:bg-[#FF9119] shadow-xl shadow-[#FF8000]/50 flex items-center justify-center transition-all group-hover:scale-110">
                            <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1" />
                          </div>
                        </div>
                      </>
                    ) : article.image && !failedImages.has(article.id) ? (
                      // Con imagen (y no ha fallado)
                      <img
                        src={article.image}
                        alt={article.title}
                        onError={() => handleImageError(article.id)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        style={{
                          objectPosition:
                            article.id === 1 ? 'center 30%' :
                            article.id === 13 ? 'center 40%' :
                            article.id === 3 ? 'center 50%' :
                            article.id === 2 ? 'center 45%' :
                            article.id === 15 ? 'center 50%' :
                            article.id === 17 ? 'center 45%' :
                            'center center'
                        }}
                      />
                    ) : article.image && failedImages.has(article.id) ? (
                      // Imagen falló: fondo gris corporativo 3% con logo en 80% opacidad
                      <div className="w-full h-full flex items-center justify-center bg-[#45556C]/[0.03]">
                        <img
                          src={logoDesafioSawa}
                          alt="Logo"
                          className="h-24 md:h-32 object-contain opacity-80"
                        />
                      </div>
                    ) : (
                      // Sin imagen: fondo gris corporativo 3% con logo en 80% opacidad
                      <div className="w-full h-full flex items-center justify-center bg-[#45556C]/[0.03]">
                        <img
                          src={logoDesafioSawa}
                          alt="Logo"
                          className="h-24 md:h-32 object-contain opacity-80"
                        />
                      </div>
                    )}
                    
                    {/* Pill de días restantes - Solo para concursos */}
                    {isConcurso && article.contestEndDate && (() => {
                      const daysLeft = getDaysRemaining(article.contestEndDate);
                      if (daysLeft <= 0) return null;
                      
                      // Estilo según días restantes (igual que en Desafíos)
                      let bgColor, textColor, borderColor;
                      if (daysLeft <= 3) {
                        bgColor = 'bg-red-100';
                        textColor = 'text-red-700';
                        borderColor = 'border-red-700';
                      } else if (daysLeft <= 7) {
                        bgColor = 'bg-amber-100';
                        textColor = 'text-amber-700';
                        borderColor = 'border-amber-700';
                      } else {
                        bgColor = 'bg-emerald-100';
                        textColor = 'text-emerald-700';
                        borderColor = 'border-emerald-700';
                      }
                      
                      return (
                        <span 
                          className={`absolute top-3 right-3 inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${bgColor} ${textColor} ${borderColor} shadow-lg z-20`}
                          style={{ borderWidth: '0.5px' }}
                        >
                          Quedan {daysLeft} {daysLeft === 1 ? 'día' : 'días'}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Contenido */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Fecha con etiqueta de Concurso (si aplica) */}
                    <div className="flex items-center gap-2 text-xs mb-2">
                      {isConcurso && (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-300">
                          Concurso
                        </span>
                      )}
                      <span className="text-slate-500">{getRelativeDate(article.publishedDate)}</span>
                    </div>

                    {/* Título - Máximo 2 líneas */}
                    <h3 className={`text-lg font-bold mb-2 line-clamp-2 leading-tight ${isConcurso ? 'text-[#87409C]' : 'text-[#45556C]'}`}>
                      {article.title}
                    </h3>

                    {/* Para Concursos: Subtítulo + Premio en puntos */}
                    {isConcurso && article.contestPrizePoints ? (
                      <div className="flex-1 flex flex-col">
                        {/* Subtítulo/Excerpt - Mismo formato que noticias */}
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                        {/* Badge de puntos del premio - Una sola línea */}
                        <div className="py-2 px-2.5 rounded-xl border-[1.5px] border-[#FF8000] bg-transparent flex items-center justify-center gap-2">
                          <img src={coinIcon} alt="Coin" className="w-5 h-5 flex-shrink-0" />
                          <p className="text-sm leading-none">
                            <span className="font-normal text-gray-600">Se sortearán</span> <span className="font-bold text-[#FF8000]" style={{ fontWeight: 800 }}>{article.contestPrizePoints.toLocaleString('es-CL')} puntos</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col">
                        {/* Para Noticias: Extracto */}
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>
                    )}

                    {/* Contadores + Botones de acción - Siempre al fondo con separación superior */}
                    <div className="flex items-center justify-between gap-2 mt-auto pt-4">
                      {/* Contadores a la izquierda */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div 
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full cursor-pointer transition-all ${
                            likedNews.has(article.id) 
                              ? 'bg-[#FF8000]/10 hover:bg-[#FF8000]/15' 
                              : 'bg-slate-100 hover:bg-slate-200'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setLikedNews(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(article.id)) {
                                newSet.delete(article.id);
                              } else {
                                newSet.add(article.id);
                              }
                              return newSet;
                            });
                          }}
                        >
                          <Heart 
                            className={`w-4 h-4 transition-all ${
                              likedNews.has(article.id) 
                                ? 'fill-[#FF8000] text-[#FF8000]' 
                                : 'text-slate-600'
                            }`}
                          />
                          <span className={`text-sm font-semibold ${likedNews.has(article.id) ? 'text-[#FF8000]' : 'text-slate-600'}`}>{article.likes}</span>
                        </div>
                        <div 
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/muro/${article.id}#comentarios`);
                          }}
                        >
                          <MessageCircle className="w-4 h-4 text-slate-600" />
                          <span className="text-sm font-semibold text-slate-600">{article.comments}</span>
                        </div>
                      </div>

                      {/* Botones CTA a la derecha - Usar todo el espacio vacío */}
                      {isConcurso && article.contestPrizePoints ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Aquí iría la lógica de participación
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-8 py-2 rounded-full bg-[#FF8000] hover:bg-[#FF9119] text-white text-sm font-semibold transition-all shadow-md shadow-[#FF8000]/20"
                        >
                          <span>Participar</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : article.type === 'encuesta' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowEncuestaModal(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-8 py-2 rounded-full bg-[#FF8000] hover:bg-[#FF9119] text-white text-sm font-semibold transition-all shadow-md shadow-[#FF8000]/20"
                        >
                          <span>Responder</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : article.ctaButton ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(article.ctaButton!.link, '_blank');
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-8 py-2 rounded-full bg-[#FF8000] hover:bg-[#FF9119] text-white text-sm font-semibold transition-all shadow-md shadow-[#FF8000]/20"
                        >
                          <span>{article.ctaButton.text}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>
              </div>
            );
          })}
          </div>

          {/* Botón "Ver más" - Patrón Load More */}
          {filteredNews.length > visibleNewsCount && (
            <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleNewsCount(prev => prev + 4)}
              className="px-6 py-3 rounded-full border-2 border-[#FF8000] bg-transparent hover:bg-[#FF8000] text-[#FF8000] hover:text-white font-bold transition-all duration-300 flex items-center gap-2"
            >
              <span>Ver más noticias</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            </div>
          )}

          {/* Mensaje final cuando ya se mostraron todas las noticias */}
          {filteredNews.length > 0 && filteredNews.length <= visibleNewsCount && (
            <div className="flex justify-center mt-8">
              <p className="text-sm text-slate-500 text-center">
                Has llegado al final por ahora. ¡Vuelve pronto para más novedades!
              </p>
            </div>
          )}

          {/* Mensaje si no hay resultados */}
          {filteredNews.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-[#45556C] mb-2">No se encontraron noticias</h3>
              <p className="text-sm text-slate-600">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de encuesta */}
      <EncuestaModal isOpen={showEncuestaModal} onClose={() => setShowEncuestaModal(false)} />
    </div>
  );
}