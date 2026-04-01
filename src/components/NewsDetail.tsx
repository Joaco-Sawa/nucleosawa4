import { useParams, useNavigate, useLocation } from 'react-router';
import { ChevronLeft, Calendar, ArrowLeft, Heart, MessageCircle, Send, Share2, ImageOff, FileX } from 'lucide-react';
import { useState, useEffect } from 'react';
import coinIcon from '../assets/db29ff4dc98462b3539ca31d029b8918fad5d4e6.png';
import profileImage from '../assets/9f5aa0e583374b6893d8921a6183b99d788006eb.png';
import logoDesafioSawa from '../assets/90d0b6e7e40ee202a8c067619d31d9c79731c384.png';
import knowledgeContestImage from '../assets/Pon_a_prueba_tu.jpg';
import newContestImage from '../assets/Frame_821.jpg';
import encuestaClimaImage from '../assets/Encuesta.jpg';
import recordHistoricoImage from '../assets/Frame_824.jpg';
import tallerLiderazgoImage from '../assets/Taller_de_liderazgo.jpg';
import iniciativaVerdeImage from '../assets/Iniciativa_verde.jpg';
import programaBienestarImage from '../assets/Nuevo_programa_de_bienestar.jpg';
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

// Helper function: Calcular días restantes para concursos
const getDaysRemaining = (endDate: string): number => {
  const today = new Date('2026-03-18'); // Fecha actual según el contexto
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// Helper function: Parsear negritas en texto
const parseMarkdown = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

interface NewsArticle {
  id: number;
  title: string;
  image: string | null; // Ahora puede ser null para noticias sin imagen
  videoUrl?: string; // Nuevo: URL de YouTube para noticias con video
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  date: string;
  publishedAgo: string;
  readTime: string;
  likes: number;
  comments: number;
  category: string;
  type?: 'noticia' | 'concurso' | 'encuesta'; // Nuevo campo para filtrar
  contestStartDate?: string; // Fecha de inicio del concurso (formato YYYY-MM-DD)
  contestEndDate?: string; // Fecha de fin del concurso (formato YYYY-MM-DD)
  externalLink?: {
    url: string;
    label: string;
  };
}

// Mock data - En producción vendría de una API
const newsArticles: NewsArticle[] = [
  {
    id: 17,
    title: '📊 Encuesta de Clima Organizacional 2026',
    image: encuestaClimaImage,
    excerpt: 'Tu opinión es fundamental para mejorar nuestro ambiente laboral. Participa y ayúdanos a construir un mejor lugar para trabajar.',
    content: `En Desafío Sawa valoramos tu voz y queremos construir juntos el mejor lugar para trabajar.

**¿Por qué participar?**

Tu opinión es fundamental para entender cómo nos sentimos como equipo y qué podemos mejorar. Esta encuesta nos ayudará a identificar nuestras fortalezas y áreas de oportunidad.

**¿Qué evaluaremos?**

- Ambiente laboral y cultura organizacional
- Comunicación interna y trabajo en equipo
- Desarrollo profesional y oportunidades de crecimiento
- Equilibrio entre vida personal y trabajo

La encuesta es **anónima y confidencial**. Tus respuestas serán tratadas con total privacidad y solo se utilizarán para generar reportes agregados que nos ayuden a tomar decisiones informadas.

**Tu participación es muy importante para nosotros.**`,
    author: 'Recursos Humanos',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    date: '23 de marzo de 2026',
    publishedAgo: 'Hace 1 día',
    readTime: '3 min',
    likes: 92,
    comments: 15,
    category: 'Encuestas',
    type: 'encuesta'
  },
  {
    id: 15,
    title: '¡Pon a prueba tu conocimiento y gana!',
    image: knowledgeContestImage,
    excerpt: 'Demuestra lo que sabes sobre nuestra empresa y participa por 200 puntos. ¿Estás listo para el desafío?',
    content: `¿Cuánto conoces realmente sobre nuestra empresa? ¡Es momento de demostrarlo!

Participa en nuestro desafío de conocimiento y pon a prueba lo que sabes sobre nuestra historia, valores, productos y cultura organizacional.

**¿Cómo participar?**

Haz clic en el botón **"Ver más"** para acceder al cuestionario completo con todas las instrucciones y comenzar tu participación.

**[DESTACADO]Los ganadores recibirán hasta 3,000 puntos y todos los participantes acumularán 200 puntos.**

¡Demuestra que eres un verdadero experto de nuestra empresa!`,
    author: 'Comunicaciones',
    authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    date: '20 de marzo de 2026',
    publishedAgo: 'Hace 4 días',
    readTime: '4 min',
    likes: 89,
    comments: 15,
    category: 'Logros del equipo',
    type: 'concurso',
    contestStartDate: '2026-03-20',
    contestEndDate: '2026-03-28'
  },
  {
    id: 14,
    title: '¡Tu hoja de ruta para este 2026!',
    image: newContestImage,
    excerpt: 'Comenzar el año con objetivos claros es la clave para llegar lejos.',
    content: `Comenzar el año con objetivos claros es la clave para llegar lejos.

**¿Qué debes hacer?**

Presiona el botón **"Responder"** al final de esta publicación y escribe tu principal meta laboral para este año.

**[DESTACADO]Todas las respuestas enviadas participan en el sorteo de un increíble premio.**

¡Recuerda que cada premio ganado es una oportunidad para llevarte ese producto soñado del catálogo sin gastar de tu bolsillo!

¡Comienza tu año trazando la ruta al éxito!`,
    author: 'Desarrollo de Talento',
    authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    date: '12 de marzo de 2026',
    publishedAgo: 'Hace 12 días',
    readTime: '5 min',
    likes: 215,
    comments: 38,
    category: 'Desarrollo profesional',
    type: 'concurso',
    contestStartDate: '2026-03-12',
    contestEndDate: '2026-03-25'
  },
  {
    id: 1,
    title: '¡Récord histórico! Nuestro equipo supera todas las metas del trimestre',
    image: recordHistoricoImage,
    excerpt: 'Un logro sin precedentes que demuestra el compromiso y dedicación de todo el equipo.',
    content: `Un logro sin precedentes que demuestra el compromiso y dedicación de todo el equipo.

Estamos emocionados de compartir que nuestro equipo ha alcanzado un hito histórico al superar todas las metas establecidas para este trimestre. Este logro no solo representa números en un tablero, sino el resultado del esfuerzo conjunto, la colaboración y el compromiso de cada uno de los miembros de nuestro equipo.

**Resultados destacados:**

• Incremento del 35% en productividad comparado con el trimestre anterior
• 98% de satisfacción del cliente, nuestro mejor registro hasta la fecha
• Reducción del 20% en tiempos de entrega
• Implementación exitosa de 5 nuevas iniciativas de mejora continua

**¿Qué significa esto para ti?**

Como reconocimiento a este esfuerzo extraordinario, todos los miembros del equipo recibirán un bono especial de 500 puntos que se acreditarán en sus cuentas durante los próximos 3 días. Estos puntos pueden canjearse por cualquiera de los productos disponibles en nuestro catálogo.

Además, estamos organizando un evento de celebración el próximo viernes donde compartiremos más detalles sobre los logros individuales y de equipo. ¡No te lo pierdas!

**Mirando hacia adelante:**

Este éxito nos motiva a seguir mejorando. Para el próximo trimestre, estamos preparando nuevos desafíos y oportunidades de desarrollo profesional que nos ayudarán a mantener este impulso y seguir creciendo juntos.

Gracias a cada uno de ustedes por hacer esto posible. ¡Sigamos haciendo historia!`,
    author: 'Ana García',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    date: '10 de marzo de 2026',
    publishedAgo: 'Hace 3 días',
    readTime: '3 min',
    likes: 124,
    comments: 18,
    category: 'Logros del equipo'
  },
  {
    id: 2,
    title: 'Nuevo programa de bienestar: Gimnasio y actividades deportivas',
    image: programaBienestarImage,
    excerpt: 'Lanzamos beneficios exclusivos para cuidar tu salud física y mental.',
    content: `Lanzamos beneficios exclusivos para cuidar tu salud física y mental.

Nos complace anunciar el lanzamiento de nuestro nuevo Programa de Bienestar Integral, diseñado para apoyar tu salud física y mental. A partir del 1 de abril, todos los colaboradores tendrán acceso a una serie de beneficios y actividades que promoverán un estilo de vida más saludable.

**Beneficios incluidos:**

**Membresía de gimnasio**
• Acceso a una red de más de 50 gimnasios en la ciudad
• Clases grupales sin costo adicional (yoga, spinning, pilates, crossfit)
• Horarios flexibles adaptados a tu jornada laboral

**Actividades deportivas**
• Torneos internos mensuales (fútbol, voleibol, tenis de mesa)
• Grupos de running y ciclismo los fines de semana
• Descuentos especiales en eventos deportivos

**Bienestar mental**
• Sesiones de meditación guiada (martes y jueves)
• Talleres de manejo de estrés
• Acceso a app de mindfulness premium

**¿Cómo participar?**

La inscripción es muy sencilla. Solo debes completar el formulario que encontrarás en tu perfil antes del 25 de marzo. Los cupos son limitados para algunas actividades, así que te recomendamos registrarte pronto.

**Gana puntos manteniéndote activo**

Como incentivo adicional, participar en las actividades del programa te permitirá acumular puntos:
• 50 puntos por asistir a 10 clases de gimnasio al mes
• 30 puntos por participar en torneos deportivos
• 20 puntos por completar retos de bienestar semanales

¡Invierte en tu salud y acumula puntos al mismo tiempo!`,
    author: 'Roberto Martínez',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    date: '8 de marzo de 2026',
    publishedAgo: 'Hace 5 días',
    readTime: '4 min',
    likes: 89,
    comments: 12,
    category: 'Beneficios'
  },
  {
    id: 3,
    title: 'Iniciativa verde: Comprometidos con la sostenibilidad',
    image: iniciativaVerdeImage,
    excerpt: 'Nuevas acciones para reducir nuestra huella de carbono y proteger el medio ambiente.',
    content: `Nuevas acciones para reducir nuestra huella de carbono y proteger el medio ambiente.

El cuidado del planeta es responsabilidad de todos, y como organización, estamos comprometidos a hacer nuestra parte. Hoy presentamos nuestra "Iniciativa Verde", un conjunto de acciones concretas para reducir nuestro impacto ambiental y fomentar prácticas sostenibles.

**Acciones implementadas:**

**En la oficina**
• Eliminación de plásticos de un solo uso
• Estaciones de reciclaje inteligente en cada piso
• Iluminación LED en todos los espacios

**Movilidad sostenible**
• Programa de incentivos para uso de bicicleta (100 puntos mensuales)
• Estacionamiento preferencial para vehículos eléctricos/híbridos
• Promoción de carpooling entre colaboradores

**¿Cómo puedes participar?**

Hemos creado desafíos especiales de sostenibilidad donde podrás ganar puntos:
• "Semana sin plástico": 75 puntos
• "Mes en bicicleta": 200 puntos
• "Ideas verdes": comparte tus sugerencias y gana hasta 150 puntos

Juntos podemos hacer la diferencia. 🌱`,
    author: 'Laura Jiménez',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    date: '5 de marzo de 2026',
    publishedAgo: 'Hace 1 semana',
    readTime: '5 min',
    likes: 156,
    comments: 24,
    category: 'Sostenibilidad',
    externalLink: {
      url: 'https://www.ejemplo.com/sostenibilidad',
      label: 'Ver guía completa de sostenibilidad'
    }
  },
  {
    id: 4,
    title: 'Capacitaciones 2026: Invierte en tu desarrollo profesional (imagen fallback)',
    image: 'https://invalid-url-to-trigger-fallback.jpg', // URL inválida para mostrar fallback
    excerpt: 'Descubre los cursos y talleres disponibles para potenciar tus habilidades.',
    content: `Descubre los cursos y talleres disponibles para potenciar tus habilidades.

El aprendizaje continuo es clave para el crecimiento profesional. Este año hemos ampliado significativamente nuestra oferta de capacitaciones, con más de 40 cursos diseñados para ayudarte a desarrollar nuevas habilidades y avanzar en tu carrera.

**Áreas de formación disponibles:**

**Tecnología e innovación**
• Introducción a la Inteligencia Artificial
• Análisis de datos con Python
• Ciberseguridad básica y avanzada
• Diseño UX/UI
• Automatización de procesos

**Liderazgo y gestión**
• Liderazgo transformacional
• Gestión de equipos remotos
• Comunicación efectiva
• Resolución de conflictos
• Toma de decisiones estratégicas

**Desarrollo personal**
• Gestión del tiempo y productividad
• Inteligencia emocional
• Presentaciones impactantes
• Negociación y persuasión
• Creatividad e innovación

**Idiomas**
• Inglés (todos los niveles)
• Portugués de negocios
• Mandarín básico

**Modalidades flexibles:**

Entendemos que tu tiempo es valioso, por eso ofrecemos:
• Cursos virtuales asíncronos (aprende a tu ritmo)
• Talleres presenciales los sábados
• Webinars en vivo con expertos
• Microlearning (cápsulas de 15 minutos)

**Incentivos por capacitación:**

No solo invertirás en tu futuro, también ganarás puntos:
• 100 puntos por completar un curso completo
• 50 puntos por asistir a talleres presenciales
• 200 puntos bonus al completar 5 cursos en el año
• Certificaciones reconocidas internacionalmente

**Inscripciones abiertas**

Las inscripciones están abiertas hasta el 20 de marzo. Los cupos son limitados, así que regístrate pronto en tu portal de beneficios.

¡Invierte en ti mismo y construye el futuro que deseas!`,
    author: 'Miguel Ángel Ruiz',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    date: '3 de marzo de 2026',
    publishedAgo: 'Hace 10 días',
    readTime: '4 min',
    likes: 92,
    comments: 15,
    category: 'Desarrollo profesional'
  },
  {
    id: 12,
    title: '📹 Tutorial: Cómo aprovechar al máximo tu plataforma de capacitaciones',
    image: null,
    videoUrl: 'u31qwQUeGuM', // ID del video de YouTube
    excerpt: 'Aprende en 5 minutos a navegar, inscribirte y certificarte en nuestros cursos online.',
    content: `Aprende en 5 minutos a navegar, inscribirte y certificarte en nuestros cursos online.

En este video tutorial te mostramos paso a paso cómo sacar el máximo provecho de nuestra plataforma de capacitaciones. Descubre todas las funcionalidades disponibles y comienza tu camino de desarrollo profesional.

**¿Qué aprenderás en este tutorial?**

**Navegación básica**
• Cómo acceder a la plataforma
• Explorar el catálogo de cursos
• Usar el buscador y filtros avanzados
• Personalizar tu perfil de aprendizaje

**Proceso de inscripción**
• Seleccionar cursos de tu interés
• Verificar requisitos previos
• Confirmar tu inscripción
• Acceder al contenido del curso

**Durante el curso**
• Navegar entre módulos y lecciones
• Descargar materiales complementarios
• Participar en foros de discusión
• Completar evaluaciones y ejercicios

**Certificación**
• Requisitos para obtener el certificado
• Proceso de evaluación final
• Descarga de certificados digitales
• Compartir tus logros en LinkedIn

**Tips y trucos**
• Atajos de teclado útiles
• Modo offline para aprender sin conexión
• Notificaciones personalizadas
• Integración con calendario

**Soporte disponible**

Si tienes dudas o problemas técnicos:
• Chat en vivo: Lunes a viernes 9:00 AM - 6:00 PM
• Email: soporte.capacitacion@empresa.com
• FAQ: Preguntas frecuentes en la plataforma
• Tutoriales adicionales en nuestro canal

¡No te pierdas este tutorial esencial para dominar la plataforma!`,
    author: 'Equipo de Capacitación',
    authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    date: '2 de marzo de 2026',
    publishedAgo: 'Hace 11 días',
    readTime: '5 min',
    likes: 87,
    comments: 22,
    category: 'Desarrollo profesional'
  },
  {
    id: 5,
    title: 'Colaboración que inspira: Historias de éxito del equipo',
    image: 'https://images.unsplash.com/photo-1758873268663-5a362616b5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    excerpt: 'Conoce cómo la colaboración está transformando nuestra forma de trabajar.',
    content: `Conoce cómo la colaboración está transformando nuestra forma de trabajar.

La verdadera magia ocurre cuando trabajamos juntos. En este artículo, queremos destacar algunas historias inspiradoras que demuestran el poder de la colaboración en nuestro equipo.

**Historia 1: El proyecto imposible**

Cuando recibimos el encargo de implementar un nuevo sistema en solo 3 semanas, muchos pensaron que era imposible. Pero el equipo de IT, Marketing y Operaciones se unió de una manera extraordinaria. Trabajando en sprints coordinados y comunicándose constantemente, no solo cumplieron el plazo, sino que superaron las expectativas del cliente.

**Historia 2: Innovación desde la base**

María, de atención al cliente, notó un patrón en las consultas recurrentes. En lugar de guardarlo para sí misma, compartió su observación con el equipo de producto. El resultado: una nueva funcionalidad que redujo las consultas en un 60% y mejoró significativamente la experiencia del usuario.

**Historia 3: Mentoría que transforma**

Juan, un desarrollador senior, dedicó tiempo cada semana para mentorear a tres colaboradores junior. Seis meses después, esos tres colaboradores están liderando sus propios proyectos y han creado su propio programa de mentoría para nuevos ingresos.

**¿Qué aprendemos de estas historias?**

• La colaboración rompe silos y multiplica resultados
• Las mejores ideas pueden venir de cualquier área
• Compartir conocimiento beneficia a todos
• El éxito colectivo supera los logros individuales

**Comparte tu historia**

¿Tienes una historia de colaboración que contar? Envíala a comunicaciones@empresa.com y podrías aparecer en nuestra próxima edición. Las mejores historias recibirán 100 puntos de reconocimiento.

Sigamos construyendo una cultura de colaboración que nos haga más fuertes juntos.`,
    author: 'Patricia López',
    authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    date: '1 de marzo de 2026',
    publishedAgo: 'Hace 12 días',
    readTime: '6 min',
    likes: 178,
    comments: 31,
    category: 'Cultura organizacional'
  },
  {
    id: 6,
    title: 'Actualización del catálogo: Nuevos productos disponibles',
    image: 'https://images.unsplash.com/photo-1740818576518-0c873d356122?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    excerpt: 'Amplía tus opciones de canje con más de 50 productos nuevos.',
    content: `Amplía tus opciones de canje con más de 50 productos nuevos.

¡Grandes noticias para todos! Hemos renovado completamente nuestro catálogo de canjes con más de 50 productos nuevos que estamos seguros te encantarán. Desde tecnología de última generación hasta experiencias inolvidables.

**Categorías destacadas:**

**Tecnología**
• Últimos modelos de smartphones y tablets
• Audífonos premium con cancelación de ruido
• Smartwatches y fitness trackers
• Accesorios gaming
• Dispositivos para smart home

**Experiencias**
• Cenas en restaurantes gourmet
• Entradas a conciertos y eventos
• Escapadas de fin de semana
• Clases de cocina con chefs reconocidos
• Experiencias de aventura (paracaidismo, buceo, etc.)

**Hogar y estilo de vida**
• Electrodomésticos inteligentes
• Artículos de decoración
• Sets de café y té premium
• Kits de jardinería
• Productos eco-friendly

**Gift cards**
• Tiendas departamentales
• Plataformas de streaming
• Apps de delivery
• Librerías y papelerías
• Spas y centros de bienestar

**Novedades especiales:**

Este mes destacamos:
• **iPhone 15 Pro** - 2,500 puntos
• **Experiencia gastronómica para dos** - 400 puntos
• **Smartwatch Apple Watch Series 9** - 1,800 puntos
• **Gift card Netflix anual** - 300 puntos
• **Set de maletas premium** - 650 puntos

**Promociones de lanzamiento:**

Durante todo marzo, obtén:
• 10% de descuento en productos tecnológicos (paga menos puntos)
• 2x1 en gift cards seleccionadas
• Envío express gratis en canjes superiores a 500 puntos

**¿Cómo canjear?**

Es muy fácil:
1. Revisa el catálogo actualizado
2. Selecciona el producto que deseas
3. Confirma tu canje
4. Recibe tu producto en la dirección que prefieras

Recuerda que tus puntos no vencen y puedes seguir acumulando para canjear por esos productos premium que tanto deseas.

¡No esperes más y descubre todo lo nuevo que tenemos para ti!`,
    author: 'Fernando Soto',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    date: '27 de febrero de 2026',
    publishedAgo: 'Hace 2 semanas',
    readTime: '5 min',
    likes: 203,
    comments: 45,
    category: 'Catálogo'
  },
  {
    id: 7,
    title: '⚠️ Mantenimiento programado el 23 de marzo (sin imagen)',
    image: null, // Comunicado breve sin imagen
    excerpt: 'La plataforma no estará disponible el domingo de 2:00 AM a 6:00 AM por mejoras en el sistema.',
    content: `La plataforma no estará disponible el domingo de 2:00 AM a 6:00 AM por mejoras en el sistema.

**Estimado equipo:**

Informamos que realizaremos un mantenimiento programado en nuestra plataforma para implementar mejoras técnicas y optimizaciones de rendimiento.

**Fecha y horario:**

• **Domingo 23 de marzo de 2026**
• **Horario**: 2:00 AM - 6:00 AM (4 horas aprox.)
• Durante este período la plataforma NO estará disponible

**¿Qué incluye este mantenimiento?**

• Actualización de sistemas de seguridad
• Optimización de bases de datos
• Mejoras en velocidad de carga
• Corrección de errores menores reportados

**Recomendaciones:**

• Completa cualquier canje o actividad antes del sábado 22 de marzo
• No habrá pérdida de información (tus puntos y canjes están seguros)
• Si tienes consultas urgentes, contáctanos antes del viernes

**Después del mantenimiento:**

Cuando la plataforma vuelva a estar disponible (estimado 6:00 AM), notarás mejoras en:
• Velocidad de navegación
• Estabilidad general
• Nuevas funcionalidades menores

Agradecemos tu comprensión y paciencia.

**Equipo Técnico**`,
    author: 'Equipo Técnico',
    authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    date: '15 de marzo de 2026',
    publishedAgo: 'Hace 1 día',
    readTime: '2 min',
    likes: 45,
    comments: 0,
    category: 'Beneficios'
  },
  {
    id: 8,
    title: '👨‍👩‍👧 Beneficios para padres: Flexibilidad y apoyo familiar',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    excerpt: 'Nuevas políticas de licencias parentales extendidas, horarios flexibles y apoyo para el cuidado infantil.',
    content: `Nuevas políticas de licencias parentales extendidas, horarios flexibles y apoyo para el cuidado infantil.

Entendemos que ser padre o madre trabajador es un desafío constante. Por eso, estamos comprometidos en crear un ambiente laboral que te permita equilibrar tu vida profesional con tus responsabilidades familiares.

**Nuevas políticas implementadas:**

**Licencias parentales extendidas**
• 20 semanas de licencia remunerada para madres (antes 12 semanas)
• 8 semanas de licencia remunerada para padres (antes 5 días)
• 4 semanas adicionales de licencia opcional con 50% del sueldo
• Licencia por adopción con las mismas condiciones
• Posibilidad de extender licencia no remunerada hasta 6 meses

**Flexibilidad horaria**
• Horario de entrada flexible entre 7:00 AM y 10:00 AM
• Posibilidad de salir 1 hora antes para actividades escolares
• Trabajo remoto 2 días a la semana garantizado
• Jornada reducida disponible (con ajuste proporcional de sueldo)
• Compensación de horas por emergencias familiares

**Apoyo para el cuidado infantil**
• Subsidio mensual de $150 para gastos de guardería/colegio
• Sala de lactancia privada y equipada
• Convenios con guarderías cercanas con 20% de descuento
• Eventos familiares trimestrales (día de la familia en la empresa)
• Flexibilidad para asistir a reuniones escolares

**Programa de reintegración post-licencia**
• Plan de retorno gradual al trabajo (30%, 60%, 100%)
• Mentoría y acompañamiento personalizado
• Actualización en cambios organizacionales durante tu ausencia
• Opción de reducir carga de trabajo los primeros 2 meses

**Beneficios adicionales**
• Días administrativos por emergencias familiares (hasta 5 al año)
• Kit de bienvenida para el nuevo bebé
• Asesoría psicológica gratuita para padres
• Talleres de parentalidad y balance vida-trabajo

**¿Cómo acceder?**

Estos beneficios están disponibles de inmediato para todo el personal. Para más información o para solicitar alguno de estos beneficios, contacta a Recursos Humanos o visita nuestro portal interno en la sección "Beneficios Familiares".

Creemos que apoyar a nuestras familias es apoyar el éxito de nuestra organización. ¡Porque cuidar de los tuyos no debería significar sacrificar tu carrera profesional!`,
    author: 'Recursos Humanos',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    date: '25 de febrero de 2026',
    publishedAgo: 'Hace 3 semanas',
    readTime: '5 min',
    likes: 198,
    comments: 47,
    category: 'Beneficios'
  },
  {
    id: 9,
    title: 'Innovación tecnológica: Nuevas herramientas para optimizar tu trabajo',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    excerpt: 'Implementamos software de última generación para mejorar la colaboración y productividad.',
    content: `Implementamos software de última generación para mejorar la colaboración y productividad.

Nos complace presentar un conjunto de herramientas tecnológicas innovadoras que transformarán la forma en que trabajas. Estas plataformas han sido seleccionadas cuidadosamente para mejorar tu productividad, facilitar la colaboración y automatizar tareas repetitivas.

**Herramientas implementadas:**

**Sistema de gestión de proyectos**
• Tableros visuales tipo Kanban para organizar tareas
• Asignación automática de responsabilidades
• Seguimiento en tiempo real del progreso
• Integración con calendario y correo electrónico
• Notificaciones inteligentes para deadlines

**Plataforma de comunicación interna**
• 4 salas temáticas con diferentes ambientes inspiradores
• Paredes escribibles de piso a techo
• Kits de design thinking y materiales creativos
• Butacas ergonómicas tipo lounge
• Pantallas de 65" para compartir ideas

**Pods de concentración**
• Cabinas individuales acústicamente aisladas
• Perfectas para llamadas o trabajo que requiere foco
• Escritorios ajustables en altura
• Iluminación LED personalizable
• Sistema de ventilación independiente

**Cafetería colaborativa**
• Barista profesional de 8:00 AM a 5:00 PM
• Café de especialidad, tés premium y snacks saludables
• Mesas altas para reuniones informales
• Terraza exterior con vista al jardín
• WiFi de alta velocidad

**Zona de relax**
• Sillones reclinables y pufs
• Mesa de ping pong y juegos de mesa
• Plantas naturales y decoración biofílica
• Música ambiental relajante
• Biblioteca con revistas y libros de inspiración

**Normas de uso:**

• Disponibles de lunes a viernes 7:00 AM - 8:00 PM
• Las salas de brainstorming se reservan vía app interna
• Mantén los espacios limpios y ordenados
• Respeta el nivel de ruido en zonas de concentración
• Las cabinas individuales tienen límite de 2 horas continuas

**Inauguración oficial:**

📅 **Jueves 27 de marzo - 10:00 AM**
🎉 Coffee break inaugural
🎁 Sorteo de 1000 puntos para los primeros 50 asistentes

¡Te esperamos para que descubras estos espacios diseñados para ti!`,
    author: 'Carolina Vega',
    authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    date: '20 de febrero de 2026',
    publishedAgo: 'Hace 3 semanas',
    readTime: '3 min',
    likes: 215,
    comments: 52,
    category: 'Cultura organizacional'
  },
  {
    id: 13,
    title: 'Taller de Liderazgo Transformacional 2026',
    image: tallerLiderazgoImage,
    excerpt: '3 sesiones presenciales con expertos internacionales. Cupos limitados.',
    content: `Programa intensivo de liderazgo con expertos internacionales. 3 sesiones presenciales los sábados 5, 12 y 19 de abril de 9:00 AM a 6:00 PM en Hotel Grand Hyatt.

**👨‍🏫 Facilitadores:** Dr. Michael Torres (Ex-VP Google/Microsoft), Dra. Sofia Martínez (Coach ICF-MCC) y Carlos Henrique da Silva (McKinsey).

**✅ Requisitos:** Asistencia obligatoria a las 3 sesiones, aprobación de líder directo y mínimo 2 años de experiencia.

**💰 100% financiado por la organización.** Incluye certificado internacional, materiales y almuerzos.

**🎁 Bonificación:** Completa las 3 sesiones y gana **500 puntos extra**.

**👥 Solo 30 cupos.** Inscríbete antes del 25 de marzo en desarrollo.liderazgo@empresa.com`,
    author: 'Desarrollo de Talento',
    authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    date: '28 de febrero de 2026',
    publishedAgo: 'Hace 2 semanas',
    readTime: '6 min',
    likes: 145,
    comments: 34,
    category: 'Desarrollo profesional',
    externalLink: {
      url: '#',
      label: 'Inscribirse al taller'
    }
  },
  {
    id: 10,
    title: '🏆 Reconocimiento a la excelencia: Destacados del mes',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    excerpt: 'Celebramos a los colaboradores que se destacaron por su excelencia, innovación y compromiso este mes.',
    content: `Celebramos a los colaboradores que se destacaron por su excelencia, innovación y compromiso este mes.

Cada mes, destacamos a aquellos colaboradores que con su trabajo, actitud y compromiso marcan una diferencia significativa en nuestro equipo. Estos son los reconocimientos de febrero 2026:

**🏆 COLABORADOR DEL MES**

**María Fernanda Castillo - Área de Atención al Cliente**

María ha demostrado un compromiso excepcional con la excelencia en el servicio. Este mes atendió más de 350 casos con un índice de satisfacción del 98%, superando el promedio del equipo en un 15%. Su actitud positiva y disposición para ayudar a sus compañeros la convierten en un ejemplo a seguir.

*Reconocimiento: 1,000 puntos + Certificado de reconocimiento*

**🌟 INNOVADOR DEL MES**

**Carlos Mendoza - Área de Tecnología**

Carlos propuso e implementó un sistema de automatización que redujo en 40% el tiempo de procesamiento de solicitudes internas. Su iniciativa ha generado un ahorro significativo de horas-hombre y ha mejorado la experiencia de todo el equipo.

*Reconocimiento: 800 puntos + Día libre adicional*

**🤝 LÍDER COLABORATIVO**

**Andrea Rodríguez - Gestión de Proyectos**

Andrea lideró un proyecto interdepartamental que involucró a 4 áreas diferentes. Su capacidad para coordinar, comunicar y motivar al equipo resultó en la entrega del proyecto 2 semanas antes de lo planificado, superando todos los objetivos establecidos.

*Reconocimiento: 700 puntos + Almuerzo con la Dirección*

**💪 EQUIPO DESTACADO**

**Equipo de Ventas Región Sur**

El equipo superó su meta trimestral en un 125%, logrando el mejor desempeño de todas las regiones. Su trabajo en equipo, estrategia coordinada y perseverancia fueron clave para este logro histórico.

*Reconocimiento: 500 puntos por integrante + Actividad recreativa grupal*

**🎓 MENTOR DEL MES**

**Jorge Pérez - Desarrollo de Talento**

Jorge ha dedicado tiempo extra para mentorear a 5 nuevos colaboradores, facilitando su integración y desarrollo. El 100% de sus mentorados reportan alta satisfacción y se sienten más seguros en sus roles gracias a su apoyo.

*Reconocimiento: 600 puntos + Certificación profesional a elección*

**¿Quieres ser reconocido el próximo mes?**

Todos pueden ser nominados. Los criterios de evaluación incluyen:
• Resultados sobresalientes en tu área
• Actitud positiva y colaborativa
• Innovación y mejora continua
• Compromiso con los valores de la organización
• Apoyo a compañeros y trabajo en equipo

**Cómo nominar a un compañero:**

Envía un correo a reconocimientos@empresa.com antes del 25 de cada mes con:
• Nombre del nominado y área
• Logro o conducta destacada
• Impacto en el equipo u organización

¡Celebremos juntos la excelencia!`,
    author: 'Comunicaciones Corporativas',
    authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    date: '15 de febrero de 2026',
    publishedAgo: 'Hace 1 mes',
    readTime: '4 min',
    likes: 289,
    comments: 52,
    category: 'Logros del equipo'
  },
  {
    id: 13,
    title: 'Taller de Liderazgo Transformacional 2026',
    image: tallerLiderazgoImage,
    excerpt: '3 sesiones presenciales con expertos internacionales. Cupos limitados.',
    content: `Programa intensivo de liderazgo con expertos internacionales. 3 sesiones presenciales los sábados 5, 12 y 19 de abril de 9:00 AM a 6:00 PM en Hotel Grand Hyatt.

**👨‍🏫 Facilitadores:** Dr. Michael Torres (Ex-VP Google/Microsoft), Dra. Sofia Martínez (Coach ICF-MCC) y Carlos Henrique da Silva (McKinsey).

**✅ Requisitos:** Asistencia obligatoria a las 3 sesiones, aprobación de líder directo y mínimo 2 años de experiencia.

**💰 100% financiado por la organización.** Incluye certificado internacional, materiales y almuerzos.

**🎁 Bonificación:** Completa las 3 sesiones y gana **500 puntos extra**.

**👥 Solo 30 cupos.** Inscríbete antes del 25 de marzo en desarrollo.liderazgo@empresa.com`,
    author: 'Desarrollo de Talento',
    authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    date: '28 de febrero de 2026',
    publishedAgo: 'Hace 2 semanas',
    readTime: '6 min',
    likes: 145,
    comments: 34,
    category: 'Desarrollo profesional',
    externalLink: {
      url: '#',
      label: 'Inscribirse al taller'
    }
  },
  {
    id: 10,
    title: '🏆 Reconocimiento a la excelencia: Destacados del mes',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    excerpt: 'Celebramos a los colaboradores que se destacaron por su excelencia, innovación y compromiso este mes.',
    content: `Celebramos a los colaboradores que se destacaron por su excelencia, innovación y compromiso este mes.

Cada mes, destacamos a aquellos colaboradores que con su trabajo, actitud y compromiso marcan una diferencia significativa en nuestro equipo. Estos son los reconocimientos de febrero 2026:

**🏆 COLABORADOR DEL MES**

**María Fernanda Castillo - Área de Atención al Cliente**

María Fernanda ha demostrado un compromiso excepcional con la excelencia en el servicio. Durante febrero, logró:

• 99.8% de satisfacción del cliente (promedio equipo: 94%)
• Resolvió 847 casos con tiempo promedio 40% menor al estándar
• Implementó 3 mejoras al proceso de atención que ahorraron 15 horas semanales al equipo
• Mentoró a 5 nuevos integrantes del equipo

**Reconocimiento:** 2000 puntos + Certificado de Excelencia + Día libre adicional

---

**🌟 EQUIPO DEL MES**

**Equipo de Desarrollo de Producto**

Este equipo completó el lanzamiento más exitoso del año con la nueva versión 3.0 de nuestra plataforma:

• Entrega 2 semanas antes del plazo establecido
• 0 bugs críticos en producción
• Adopción del 85% de usuarios en la primera semana
• Documentación técnica completa y accesible

**Integrantes reconocidos:**
- Roberto Salazar (Líder Técnico)
- Daniela Ponce (UX/UI Designer)
- Andrés Muñoz (Backend Developer)
- Valentina Torres (QA Specialist)
- Francisco Vera (Frontend Developer)

**Reconocimiento por integrante:** 1500 puntos + Almuerzo especial del equipo

---

**💡 INNOVADOR DEL MES**

**Carlos Mendoza - Área de Operaciones**

Carlos propuso e implementó un sistema automatizado de inventarios que:

• Redujo errores de stock en un 78%
• Ahorra 20 horas semanales de trabajo manual
• Genera alertas predictivas de reabastecimiento
• Mejoró la precisión de forecasting en 45%

**Impacto económico estimado:** $8.5 millones anuales en ahorro

**Reconocimiento:** 1800 puntos + Publicación de caso de éxito + Bono especial

---

**🤝 LÍDER INSPIRADOR DEL MES**

**Patricia Ramírez - Jefa de Recursos Humanos**

Patricia ha transformado la cultura de su área con iniciativas que impactaron a toda la organización:

• Programa de mentoring con 95% de satisfacción
• Reducción del 40% en rotación de personal
• Implementación de feedback 360° trimestral
• Creación de "Viernes de Bienestar" adoptado por toda la empresa

**Reconocimiento:** 1500 puntos + Beca para curso de liderazgo + Reconocimiento p��blico

---

**🎯 MENCIONES ESPECIALES**

**Puntualidad perfecta (100% asistencia sin retrasos):**
• Javier Ortiz - 1000 puntos
• Camila Soto - 1000 puntos
• Diego Fuentes - 1000 puntos

**Apoyo entre equipos (colaboración interdepartamental destacada):**
• Laura Pérez (Marketing) apoyó lanzamiento en Ventas - 800 puntos
• Sebastián Rojas (TI) implementó herramienta para Finanzas - 800 puntos

**Espíritu positivo (actitud que inspira al equipo):**
• Ana María González - 500 puntos + Certificado
• Rodrigo Campos - 500 puntos + Certificado

---

**📊 ESTADÍSTICAS DEL PROGRAMA DE RECONOCIMIENTO**

Desde su lanzamiento hace 6 meses:

• 87 colaboradores reconocidos individualmente
• 12 equipos completos destacados
• 156,000 puntos otorgados en total
• 94% de los colaboradores reportan sentirse valorados
• 23% de incremento en compromiso organizacional

---

**¿CÓMO NOMINAR A ALGUIEN PARA MARZO?**

**Criterios de evaluación:**
• Resultados medibles y sobresalientes
• Actitud positiva y colaborativa
• Impacto en el equipo o la organización
�� Innovación o mejora continua
• Alineación con nuestros valores corporativos

**Proceso de nominación:**
1. Ingresa al portal de reconocimiento
2. Completa el formulario de nominación (2 min)
3. Describe el logro o comportamiento destacado
4. Adjunta evidencias si aplica
5. Envía antes del 25 de marzo

**Categorías disponibles:**
• Colaborador del mes
• Equipo del mes
• Innovador del mes
• Líder inspirador del mes
• Menciones especiales

**¡Todos pueden nominar!** No necesitas ser jefe o líder para reconocer a un compañero excepcional.

---

**PRÓXIMA CEREMONIA DE RECONOCIMIENTO**

📅 **Viernes 28 de marzo - 5:00 PM**
📍 Auditorio principal
🎉 Evento híbrido (presencial y virtual)

**Agenda:**
• Palabras del CEO
• Entrega de reconocimientos
• Historias de impacto
• Cocktail de celebración
• Networking

**Nota:** Los reconocidos recibirán invitación personalizada, pero todos están invitados a participar y celebrar.

---

**¡Felicitaciones a todos los reconocidos!**

Gracias por elevar el estándar de excelencia y por inspirarnos a dar lo mejor cada día.

*"El talento gana partidos, pero el trabajo en equipo gana campeonatos."* - Michael Jordan`,
    author: 'Javier Campos',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    date: '15 de febrero de 2026',
    publishedAgo: 'Hace 1 mes',
    readTime: '4 min',
    likes: 142,
    comments: 41,
    category: 'Logros del equipo'
  },
  {
    id: 13,
    title: 'Taller de Liderazgo Transformacional 2026',
    image: tallerLiderazgoImage,
    excerpt: '3 sesiones presenciales con expertos internacionales. Cupos limitados.',
    content: `Programa intensivo de liderazgo con expertos internacionales. 3 sesiones presenciales los sábados 5, 12 y 19 de abril de 9:00 AM a 6:00 PM en Hotel Grand Hyatt.

**👨‍🏫 Facilitadores:** Dr. Michael Torres (Ex-VP Google/Microsoft), Dra. Sofia Martínez (Coach ICF-MCC) y Carlos Henrique da Silva (McKinsey).

**✅ Requisitos:** Asistencia obligatoria a las 3 sesiones, aprobación de líder directo y mínimo 2 años de experiencia.

**💰 100% financiado por la organización.** Incluye certificado internacional, materiales y almuerzos.

**🎁 Bonificación:** Completa las 3 sesiones y gana **500 puntos extra**.

**👥 Solo 30 cupos.** Inscríbete antes del 25 de marzo en desarrollo.liderazgo@empresa.com`,
    author: 'Recursos Humanos',
    authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    date: '17 de marzo de 2026',
    publishedAgo: 'Hoy',
    readTime: '1 min',
    likes: 91,
    comments: 23,
    category: 'Desarrollo profesional',
    externalLink: {
      url: '#',
      label: 'Inscribirse al taller'
    }
  },
  {
    id: 10,
    title: '🏆 Reconocimiento a la excelencia: Destacados del mes',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    excerpt: 'Celebramos a los colaboradores que se destacaron por su excelencia, innovación y compromiso este mes.',
    content: `Celebramos a los colaboradores que se destacaron por su excelencia, innovación y compromiso este mes.

Cada mes, destacamos a aquellos colaboradores que con su trabajo, actitud y compromiso marcan una diferencia significativa en nuestro equipo. Estos son los reconocimientos de febrero 2026:

**🏆 COLABORADOR DEL MES**

**María Fernanda Castillo - Área de Atención al Cliente**

María ha demostrado un compromiso excepcional con la excelencia en el servicio. Este mes atendió más de 350 casos con un índice de satisfacción del 98%, superando el promedio del equipo en un 15%. Su actitud positiva y disposición para ayudar a sus compañeros la convierten en un ejemplo a seguir.

*Reconocimiento: 1,000 puntos + Certificado de reconocimiento*

**🌟 INNOVADOR DEL MES**

**Carlos Mendoza - Área de Tecnología**

Carlos propuso e implementó un sistema de automatización que redujo en 40% el tiempo de procesamiento de solicitudes internas. Su iniciativa ha generado un ahorro significativo de horas-hombre y ha mejorado la experiencia de todo el equipo.

*Reconocimiento: 800 puntos + Día libre adicional*

**🤝 LÍDER COLABORATIVO**

**Andrea Rodríguez - Gestión de Proyectos**

Andrea lideró un proyecto interdepartamental que involucró a 4 áreas diferentes. Su capacidad para coordinar, comunicar y motivar al equipo resultó en la entrega del proyecto 2 semanas antes de lo planificado, superando todos los objetivos establecidos.

*Reconocimiento: 700 puntos + Almuerzo con la Dirección*

**💪 EQUIPO DESTACADO**

**Equipo de Ventas Región Sur**

El equipo superó su meta trimestral en un 125%, logrando el mejor desempeño de todas las regiones. Su trabajo en equipo, estrategia coordinada y perseverancia fueron clave para este logro histórico.

*Reconocimiento: 500 puntos por integrante + Actividad recreativa grupal*

**🎓 MENTOR DEL MES**

**Jorge Pérez - Desarrollo de Talento**

Jorge ha dedicado tiempo extra para mentorear a 5 nuevos colaboradores, facilitando su integración y desarrollo. El 100% de sus mentorados reportan alta satisfacción y se sienten más seguros en sus roles gracias a su apoyo.

*Reconocimiento: 600 puntos + Certificación profesional a elección*

**¿Quieres ser reconocido el próximo mes?**

Todos pueden ser nominados. Los criterios de evaluación incluyen:
• Resultados sobresalientes en tu área
• Actitud positiva y colaborativa
• Innovación y mejora continua
• Compromiso con los valores de la organización
• Apoyo a compañeros y trabajo en equipo

**Cómo nominar a un compañero:**

Envía un correo a reconocimientos@empresa.com antes del 25 de cada mes con:
• Nombre del nominado y área
• Logro o conducta destacada
• Impacto en el equipo u organización

¡Celebremos juntos la excelencia!`,
    author: 'Comunicaciones Corporativas',
    authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    date: '15 de febrero de 2026',
    publishedAgo: 'Hace 1 mes',
    readTime: '4 min',
    likes: 289,
    comments: 52,
    category: 'Logros del equipo'
  },
  {
    id: 11,
    title: '🏢 Nuevos espacios de trabajo colaborativo en la oficina',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    excerpt: 'Descubre las nuevas salas de reuniones interactivas, zonas de coworking y espacios creativos diseñados para potenciar la innovación.',
    content: `Descubre las nuevas salas de reuniones interactivas, zonas de coworking y espacios creativos diseñados para potenciar la innovación.

Estamos emocionados de presentar la renovación completa de nuestras áreas de trabajo colaborativo. Estos nuevos espacios han sido diseñados pensando en ti, combinando funcionalidad, comodidad y estética moderna para potenciar tu creatividad y productividad.

**¿Qué encontrarás en los nuevos espacios?**

**Zona de colaboración creativa**
• Mesas modulares que se adaptan a cualquier configuración
• Pizarras digitales interactivas de última generación
• Iluminación ajustable según la hora del día
• Conexiones de carga inalámbrica en todas las superficies
• Sistema de audio para presentaciones y videoconferencias

**Salas de brainstorming**
• 4 salas temáticas con diferentes ambientes inspiradores
• Paredes escribibles de piso a techo
• Kits de design thinking y materiales creativos
• Butacas ergonómicas tipo lounge
• Pantallas de 65" para compartir ideas

**Pods de concentración**
• Cabinas individuales acústicamente aisladas
• Perfectas para llamadas o trabajo que requiere foco
• Escritorios ajustables en altura
• Iluminación LED personalizable
• Sistema de ventilación independiente

**Cafetería colaborativa**
• Barista profesional de 8:00 AM a 5:00 PM
• Café de especialidad, tés premium y snacks saludables
• Mesas altas para reuniones informales
• Terraza exterior con vista al jardín
• WiFi de alta velocidad

**Zona de relax**
• Sillones reclinables y pufs
• Mesa de ping pong y juegos de mesa
• Plantas naturales y decoración biofílica
• Música ambiental relajante
• Biblioteca con revistas y libros de inspiración

**Normas de uso:**

• Disponibles de lunes a viernes 7:00 AM - 8:00 PM
• Las salas de brainstorming se reservan vía app interna
• Mantén los espacios limpios y ordenados
• Respeta el nivel de ruido en zonas de concentración
• Las cabinas individuales tienen límite de 2 horas continuas

**Inauguración oficial:**

📅 **Jueves 27 de marzo - 10:00 AM**
🎉 Coffee break inaugural
🎁 Sorteo de 1000 puntos para los primeros 50 asistentes

¡Te esperamos para que descubras estos espacios diseñados para ti!`,
    author: 'Gestión de Espacios',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    date: '18 de febrero de 2026',
    publishedAgo: 'Hace 1 mes',
    readTime: '4 min',
    likes: 167,
    comments: 38,
    category: 'Cultura organizacional'
  }
];

export function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userPoints = 15000;

  const article = newsArticles.find(a => a.id === Number(id));

  if (!article) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#45556C] mb-2">Noticia no encontrada</h2>
          <button
            onClick={() => navigate('/')}
            className="text-[#FF8000] hover:underline"
          >
            Volver al muro
          </button>
        </div>
      </div>
    );
  }

  // Empty state para noticia no disponible (id: 8)
  if (article.id === 8) {
    return (
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full md:h-[calc(100vh-1rem)] md:m-2 overflow-y-auto overflow-x-hidden pb-[88px] md:pb-0 bg-[#F5F8FB]">
        {/* Mobile Header */}
        <header className="md:hidden bg-white flex-shrink-0">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <img src={logoDesafioSawa} alt="Desafío Sawa" className="h-10 object-contain" />
              <div className="flex-1" />
              <div className="px-3 py-2 rounded-full bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 flex items-center gap-2 flex-shrink-0">
                <img src={coinIcon} alt="Coin" className="w-6 h-6 flex-shrink-0" />
                <div className="flex flex-col">
                  <div className="text-[9px] text-white opacity-90 tracking-wide leading-none" style={{ fontWeight: 500 }}>Tus puntos</div>
                  <div className="text-base font-bold text-white leading-none mt-0.5" style={{ fontWeight: 800 }}>{userPoints.toLocaleString('es-CL')}</div>
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

        {/* Empty state */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 md:p-12 text-center shadow-md">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6">
              <FileX className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-[#45556C] mb-3">Contenido no disponible</h2>
            <p className="text-slate-600 mb-6">
              Esta noticia no está disponible, pero te invitamos a revisar lo más nuevo en tu muro.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-full bg-[#FF8000] hover:bg-[#FF9119] text-white font-semibold transition-all shadow-md shadow-[#FF8000]/20"
            >
              Volver al muro
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Inicializar likes: si isLiked es true (viene del feed), incrementar en 1
  const initialLikes = (location.state as { isLiked?: boolean })?.isLiked ? article.likes + 1 : article.likes;
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(article.comments);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentFilter, setCommentFilter] = useState<'recent' | 'popular'>('recent');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null); // ID del comentario al que se está respondiendo
  const [replyText, setReplyText] = useState(''); // Texto de la respuesta
  const [showEncuestaModal, setShowEncuestaModal] = useState(false);
  
  // Generar comentarios iniciales basados en el conteo del artículo
  const generateInitialComments = () => {
    const baseComments = [
      { author: 'Ana García', authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', text: '¡Excelente noticia! Me alegra mucho ver este tipo de iniciativas en la empresa.', time: 'Hace 2 horas', likes: 12, replies: [
        { id: 101, author: 'Carlos Toledo', authorImage: profileImage, text: 'Totalmente de acuerdo Ana, es genial ver estos cambios.', time: 'Hace 1 hora', likes: 3 }
      ] },
      { author: 'Carlos Mendoza', authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', text: 'Totalmente de acuerdo, esto nos motiva a seguir dando lo mejor cada día.', time: 'Hace 3 horas', likes: 0, replies: [] },
      { author: 'Laura Torres', authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: 'Felicitaciones a todo el equipo por este logro.', time: 'Hace 4 horas', likes: 0, replies: [] },
      { author: 'María González', authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', text: 'Muy buena iniciativa, estoy emocionada por participar.', time: 'Hace 5 horas', likes: 25, replies: [
        { id: 102, author: 'Roberto Silva', authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', text: '¡Yo también María! Vamos a sacarle el máximo provecho.', time: 'Hace 4 horas', likes: 8 },
        { id: 103, author: 'Diego Ramírez', authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', text: '¡Cuenta conmigo para cualquier cosa!', time: 'Hace 3 horas', likes: 2 }
      ] },
      { author: 'Roberto Silva', authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', text: '¡Esto es exactamente lo que necesitábamos!', time: 'Hace 6 horas', likes: 5, replies: [] },
      { author: 'Camila Reyes', authorImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', text: '¡Qué buenas noticias! Esperaba algo así desde hace tiempo.', time: 'Hace 7 horas', likes: 0, replies: [] },
      { author: 'Diego Ramírez', authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', text: 'Gran trabajo, sigamos así. Muy orgulloso de formar parte de este equipo.', time: 'Hace 10 horas', likes: 14, replies: [] },
      { author: 'Sofía Martínez', authorImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', text: 'Me encanta cómo están llevando estas iniciativas adelante.', time: 'Hace 12 horas', likes: 9, replies: [] },
      { author: 'Andrés López', authorImage: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150', text: 'Muy inspirador, gracias por compartir esto con nosotros.', time: 'Hace 14 horas', likes: 22, replies: [] },
      { author: 'Mateo Herrera', authorImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', text: 'Me sumo a los comentarios positivos, esto es genial.', time: 'Hace 15 horas', likes: 0, replies: [] },
      { author: 'Felipe Morales', authorImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', text: 'Excelente comunicación, muy clara y motivadora.', time: 'Hace 18 horas', likes: 11, replies: [] },
      { author: 'Valentina Castro', authorImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150', text: 'Gracias por reconocer el esfuerzo de todos.', time: 'Hace 20 horas', likes: 7, replies: [] },
      { author: 'Isabella Vargas', authorImage: 'https://images.unsplash.com/photo-1488424731084-a5d8b219a5bb?w=150', text: '¡Vamos equipo! Sigamos adelante con esta energía.', time: 'Hace 1 día', likes: 20, replies: [] },
      { author: 'Nicolás Ortiz', authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', text: 'Muy acertada la decisión, felicitaciones.', time: 'Hace 1 día', likes: 4, replies: [] },
      { author: 'Gabriela Núñez', authorImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150', text: 'Gracias por mantener esta comunicación tan transparente.', time: 'Hace 1 día', likes: 13, replies: [] },
      { author: 'Santiago Pérez', authorImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150', text: '¡Increíble! No puedo esperar para ver los resultados.', time: 'Hace 2 días', likes: 0, replies: [] },
      { author: 'Martina Soto', authorImage: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150', text: 'Definitivamente esto marca la diferencia en nuestra cultura.', time: 'Hace 2 días', likes: 19, replies: [] },
      { author: 'Lucas Fuentes', authorImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150', text: 'Muy bien pensado, me parece una excelente iniciativa.', time: 'Hace 2 días', likes: 3, replies: [] },
    ];
    
    // Retornar solo la cantidad necesaria según article.comments
    return baseComments.slice(0, article.comments).map((comment, index) => ({
      id: index + 1,
      ...comment
    }));
  };
  
  const [commentsList, setCommentsList] = useState(generateInitialComments());
  const [isLiked, setIsLiked] = useState((location.state as { isLiked?: boolean })?.isLiked || false);
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [imageError, setImageError] = useState(false); // Rastrear si la imagen falló al cargar

  // Smooth scroll to comments section if hash is present
  useEffect(() => {
    if (location.hash === '#comentarios') {
      const element = document.getElementById('comentarios');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  // Ordenar comentarios según el filtro activo
  const getSortedComments = () => {
    const sorted = [...commentsList];
    if (commentFilter === 'popular') {
      return sorted.sort((a, b) => b.likes - a.likes);
    }
    return sorted; // Recientes (orden por defecto)
  };
  
  // Mostrar solo los primeros 5 comentarios si showAllComments es false
  const sortedComments = getSortedComments();
  const displayedComments = showAllComments ? sortedComments : sortedComments.slice(0, 5);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  const handleComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: commentsList.length + 1,
        author: 'Carlos Toledo',
        authorImage: profileImage,
        text: newComment,
        time: 'Justo ahora',
        likes: 0,
        replies: []
      };
      setCommentsList([newCommentObj, ...commentsList]);
      setComments(comments + 1);
      setNewComment('');
    }
  };

  const handleReply = (commentId: number) => {
    if (replyText.trim()) {
      const newReply = {
        id: Date.now(), // ID único temporal
        author: 'Carlos Toledo',
        authorImage: profileImage,
        text: replyText,
        time: 'Justo ahora',
        likes: 0
      };
      
      const updatedComments = commentsList.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      });
      
      setCommentsList(updatedComments);
      setComments(comments + 1); // Incrementar contador total
      setReplyText('');
      setReplyingTo(null); // Cerrar el formulario de respuesta
    }
  };

  const handleShare = () => {
    // Simulación de compartir - En producción podría usar la Web Share API
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {
        // Si falla o el usuario cancela, no hacer nada
      });
    } else {
      // Fallback: mostrar mensaje de confirmación
      alert('¡Gracias por compartir esta noticia!');
    }
  };

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
            {/* Botón Volver al muro */}
            <button
              onClick={() => navigate(article.type === 'concurso' ? '/?filter=concurso' : '/')}
              className="flex items-center gap-2 text-slate-600 hover:text-[#FF8000] transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Volver al muro</span>
            </button>

            <div className="flex-1" />
            
            <div className="flex items-center gap-3">
              {/* Points Badge */}
              <div className="min-w-[140px] h-[52px] w-fit rounded-xl bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 px-3 flex items-center gap-3 flex-shrink-0">
                <img src={coinIcon} alt="Coin" className="w-8 h-8 flex-shrink-0" />
                <div className="flex flex-col pr-2">
                  <div className="text-[10px] text-white font-medium opacity-90">Tus puntos</div>
                  <div className="text-[20px] font-bold text-white leading-none" style={{ fontWeight: 800 }}>{userPoints.toLocaleString('es-CL')}</div>
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
                <div className="text-[9px] text-white opacity-90 tracking-wide leading-none" style={{ fontWeight: 500 }}>Tus puntos</div>
                <div className="text-base font-bold text-white leading-none mt-0.5" style={{ fontWeight: 800 }}>{userPoints.toLocaleString('es-CL')}</div>
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
          onClick={() => navigate(article.type === 'concurso' ? '/?filter=concurso' : '/')}
          className="md:hidden flex items-center gap-2 text-slate-700 hover:text-[#FF8000] transition-colors mb-6 group"
        >
          <div className="w-8 h-8 rounded-full bg-[#E8EFF5] group-hover:bg-orange-50 flex items-center justify-center transition-all border border-transparent group-hover:border-[#FF8000]">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-semibold text-sm">Volver al muro</span>
        </button>

        {/* Video de YouTube embebido */}
        {article.videoUrl && (
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6 md:mb-8">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${article.videoUrl}`}
              title={article.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {/* Imagen hero */}
        {!article.videoUrl && article.image && !imageError && (
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-6 md:mb-8">
            <img
              src={article.image}
              alt={article.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
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
            {/* Pill de días restantes - Solo para concursos */}
            {article.type === 'concurso' && article.contestEndDate && (() => {
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
                  className={`absolute top-4 right-4 inline-flex px-3 py-1.5 rounded-full text-sm font-semibold border ${bgColor} ${textColor} ${borderColor} shadow-lg z-20`}
                  style={{ borderWidth: '0.5px' }}
                >
                  Quedan {daysLeft} {daysLeft === 1 ? 'd��a' : 'días'}
                </span>
              );
            })()}
          </div>
        )}
        
        {/* Fallback cuando la imagen falla */}
        {!article.videoUrl && article.image && imageError && (
          <div 
            className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-6 md:mb-8 flex flex-col items-center justify-center"
            style={{ 
              background: 'linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)'
            }}
          >
            <ImageOff className="w-12 h-12 md:w-16 md:h-16 text-slate-400 mb-2" />
            <p className="text-xs md:text-sm text-slate-500">Imagen no disponible</p>
          </div>
        )}

        {/* Metadata - Fecha */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 flex-shrink-0 ${article.type === 'concurso' ? 'text-[#FF8000]' : 'text-slate-500'}`} />
            <p className="text-sm text-slate-500">
              {article.type === 'concurso' && article.contestStartDate && article.contestEndDate ? (
                (() => {
                  const startDate = new Date(article.contestStartDate);
                  const endDate = new Date(article.contestEndDate);
                  const startDay = startDate.getDate();
                  const endDay = endDate.getDate();
                  const startMonth = startDate.toLocaleDateString('es-ES', { month: 'long' });
                  const endMonth = endDate.toLocaleDateString('es-ES', { month: 'long' });
                  const startYear = startDate.getFullYear();
                  const endYear = endDate.getFullYear();
                  
                  if (startYear === endYear) {
                    if (startMonth === endMonth) {
                      return `${startDay} al ${endDay} de ${endMonth} del ${endYear}`;
                    } else {
                      return `${startDay} de ${startMonth} al ${endDay} de ${endMonth} del ${endYear}`;
                    }
                  } else {
                    return `${startDay} de ${startMonth} del ${startYear} al ${endDay} de ${endMonth} del ${endYear}`;
                  }
                })()
              ) : (
                article.date
              )}
            </p>
          </div>
        </div>

        {/* Título */}
        <h1 className={`text-3xl md:text-4xl font-bold mb-6 md:mb-8 ${article.type === 'concurso' ? 'text-[#87409C]' : 'text-[#45556C]'}`}>
          {article.title}
        </h1>

        {/* Contenido */}
        <div className="prose prose-slate max-w-none mb-8">
          {article.content.split('\n').map((paragraph, index) => {
            // Detectar cuadro destacado (líneas que empiezan con **[DESTACADO])
            if (paragraph.trim().startsWith('**[DESTACADO]')) {
              const text = paragraph.trim().slice(2).replace('[DESTACADO]', '').replace(/\*\*$/, ''); // Remover ** del inicio, [DESTACADO] y ** del final
              const isConcurso = article.type === 'concurso';
              return (
                <div key={index} className={`my-6 p-4 md:p-5 rounded-xl flex gap-3 items-start relative overflow-hidden shadow-md ${
                  isConcurso 
                    ? 'bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-[#FF8000]/20' 
                    : 'bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-[#FF8000]/30'
                }`}>
                  <img src={coinIcon} alt="Coin" className="w-6 h-6 flex-shrink-0 mt-0.5 animate-[coin-pulse_2s_ease-in-out_infinite]" />
                  <p className={`text-sm md:text-base leading-relaxed m-0 font-bold ${
                    isConcurso ? 'text-white' : 'text-[#45556C]'
                  }`}>
                    {text}
                  </p>
                </div>
              );
            }
            // Detectar títulos (líneas que empiezan con **)
            if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
              const title = paragraph.trim().slice(2, -2);
              return (
                <h3 key={index} className="text-xl font-bold text-[#45556C] mt-8 mb-4">
                  {title}
                </h3>
              );
            }
            // Detectar bullets (líneas que empiezan con •)
            if (paragraph.trim().startsWith('•')) {
              return (
                <li key={index} className="text-[#45556C] ml-4 mb-2">
                  {parseMarkdown(paragraph.trim().slice(1).trim())}
                </li>
              );
            }
            // Párrafos normales
            if (paragraph.trim()) {
              return (
                <p key={index} className="text-[#45556C] leading-relaxed mb-4">
                  {parseMarkdown(paragraph)}
                </p>
              );
            }
            return null;
          })}
        </div>

        {/* Botón de Responder Encuesta (solo para encuestas) */}
        {article.type === 'encuesta' && (
          <div className="mb-8">
            <button
              onClick={() => setShowEncuestaModal(true)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#FFAD5B] to-[#FF8000] hover:from-[#FF9119] hover:to-[#FF7000] shadow-lg shadow-[#FF8000]/30 hover:shadow-xl hover:shadow-[#FF8000]/40 transition-all text-white font-bold text-base"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Responder encuesta</span>
            </button>
          </div>
        )}

        {/* Botón de enlace externo (si existe) */}
        {article.externalLink && (
          <div className="mb-8">
            <a
              href={article.externalLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8000] hover:bg-[#FF9119] shadow-md shadow-[#FF8000]/20 hover:shadow-lg hover:shadow-[#FF8000]/30 transition-all text-white font-semibold text-sm"
            >
              <span>{article.externalLink.label}</span>
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                />
              </svg>
            </a>
          </div>
        )}

        {/* Botón "Responder" para concursos */}
        {article.type === 'concurso' && (
          <div className="mb-8">
            <button
              onClick={() => setShowResponseModal(true)}
              className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#FF8000] hover:bg-[#FF9119] shadow-md shadow-[#FF8000]/20 hover:shadow-lg hover:shadow-[#FF8000]/30 transition-all text-white font-bold text-base"
            >
              <span>Responder</span>
            </button>
          </div>
        )}

        {/* Separador */}
        <div className="border-t border-slate-200 mb-6" />

        {/* Botones de interacción: Me gusta y Compartir */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 transition-all group ${
              isLiked 
                ? 'bg-[#FF8000]/10 border-[#FF8000] text-[#FF8000]' 
                : 'bg-white border-slate-200 hover:border-[#FF8000] hover:bg-[#FF8000]/5'
            }`}
          >
            <Heart 
              className={`w-5 h-5 transition-all ${
                isLiked 
                  ? 'text-[#FF8000] fill-[#FF8000]' 
                  : 'text-slate-500 group-hover:text-[#FF8000] group-hover:fill-[#FF8000]'
              }`} 
            />
            <span className={`text-sm font-semibold ${
              isLiked ? 'text-[#FF8000]' : 'text-slate-700 group-hover:text-[#FF8000]'
            }`}>
              {likes} Me gusta
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 bg-white border-slate-200 hover:border-[#FF8000] hover:bg-[#FF8000]/5 transition-all group"
          >
            <Share2 className="w-5 h-5 text-slate-500 group-hover:text-[#FF8000] transition-all" />
            <span className="text-sm font-semibold text-slate-700 group-hover:text-[#FF8000]">
              Compartir
            </span>
          </button>
        </div>

        {/* Sección de comentarios - Siempre visible */}
        <div id="comentarios" className="bg-slate-50 rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#45556C]">
              Comentarios ({comments})
            </h3>
            
            {/* Filtro de comentarios */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCommentFilter('recent')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  commentFilter === 'recent' ? 'bg-[#FF8000] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Recientes
              </button>
              <button
                onClick={() => setCommentFilter('popular')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  commentFilter === 'popular' ? 'bg-[#FF8000] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Populares
              </button>
            </div>
          </div>
          
          {/* Lista de comentarios */}
          <div className="space-y-4 mb-6">
            {commentsList.length === 0 ? (
              // Empty state cuando no hay comentarios
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 mb-3">
                  <MessageCircle className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600">
                  A��n no hay comentarios. ¡Escribe el primero!
                </p>
              </div>
            ) : (
              <>
                {displayedComments.map(comment => (
                  <div key={comment.id}>
                    {/* Comentario principal */}
                    <div className="flex gap-3">
                      <img 
                        src={comment.authorImage} 
                        alt={comment.author}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="bg-white rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-[#45556C]">{comment.author}</span>
                            <span className="text-xs text-slate-500">{comment.time}</span>
                          </div>
                          <p className="text-sm text-slate-600">
                            {comment.text}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() => {
                                const newLikes = likedComments.has(comment.id) ? comment.likes - 1 : comment.likes + 1;
                                const newCommentsList = commentsList.map(c => 
                                  c.id === comment.id ? { ...c, likes: newLikes } : c
                                );
                                setCommentsList(newCommentsList);
                                setLikedComments(prev => {
                                  const newSet = new Set(prev);
                                  if (newSet.has(comment.id)) {
                                    newSet.delete(comment.id);
                                  } else {
                                    newSet.add(comment.id);
                                  }
                                  return newSet;
                                });
                              }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                                likedComments.has(comment.id) 
                                  ? 'bg-[#FF8000]/10 border-[#FF8000] text-[#FF8000]' 
                                  : comment.likes > 0
                                    ? 'bg-white border-slate-200 hover:border-[#FF8000] hover:bg-[#FF8000]/5 text-slate-600'
                                    : 'bg-transparent border-transparent hover:bg-slate-100 text-slate-400'
                              }`}
                            >
                              <Heart 
                                className={`w-3.5 h-3.5 transition-all ${
                                  likedComments.has(comment.id) 
                                    ? 'text-[#FF8000] fill-[#FF8000]' 
                                    : 'text-slate-400 hover:text-[#FF8000]'
                                }`} 
                              />
                              {comment.likes > 0 && (
                                <span className={`text-xs font-semibold ${
                                  likedComments.has(comment.id) ? 'text-[#FF8000]' : 'text-slate-600'
                                }`}>
                                  {comment.likes}
                                </span>
                              )}
                            </button>
                            
                            {/* Botón Responder */}
                            <button
                              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                              className="text-xs font-semibold text-slate-500 hover:text-[#FF8000] transition-colors"
                            >
                              Responder
                            </button>
                          </div>
                        </div>

                        {/* Formulario de respuesta inline */}
                        {replyingTo === comment.id && (
                          <div className="mt-3 flex gap-2">
                            <img 
                              src={profileImage} 
                              alt="Tu perfil" 
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleReply(comment.id)}
                                placeholder={`Responder a ${comment.author}...`}
                                className="flex-1 px-4 py-2 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all text-sm text-[#45556C]"
                                autoFocus
                              />
                              <button
                                onClick={() => handleReply(comment.id)}
                                disabled={!replyText.trim()}
                                className="px-3 py-2 rounded-full bg-[#FF8000] hover:bg-[#FF9119] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                              >
                                <Send className="w-3.5 h-3.5 text-white" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Respuestas anidadas */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-3 space-y-3">
                            {comment.replies.map((reply: any) => (
                              <div key={reply.id} className="flex gap-3 relative">
                                {/* Línea vertical decorativa */}
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                                
                                <img 
                                  src={reply.authorImage} 
                                  alt={reply.author}
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 ml-6 relative z-10"
                                />
                                <div className="flex-1">
                                  <div className="bg-slate-100 rounded-2xl p-3">
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <span className="text-xs font-semibold text-[#45556C]">{reply.author}</span>
                                      <span className="text-xs text-slate-400">{reply.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                      {reply.text}
                                    </p>
                                    {reply.likes > 0 && (
                                      <div className="flex items-center gap-1.5 mt-2">
                                        <Heart className="w-3 h-3 text-[#FF8000] fill-[#FF8000]" />
                                        <span className="text-xs font-semibold text-[#FF8000]">{reply.likes}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            {commentsList.length > 5 && !showAllComments && (
              <button
                onClick={() => setShowAllComments(true)}
                className="text-sm text-[#FF8000] hover:underline"
              >
                Ver más comentarios
              </button>
            )}
              </>
            )}
          </div>

          {/* Formulario para nuevo comentario */}
          <div className="flex gap-3">
            <img 
              src={profileImage} 
              alt="Tu perfil" 
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                placeholder="Escribe un comentario..."
                className="flex-1 px-4 py-2.5 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all text-sm text-[#45556C]"
              />
              <button
                onClick={handleComment}
                disabled={!newComment.trim()}
                className="px-4 py-2.5 rounded-full bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 hover:shadow-lg hover:shadow-[#FF8000]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal de Respuesta para Concursos */}
        {showResponseModal && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowResponseModal(false)}
          >
            <div 
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 animate-in fade-in zoom-in duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#45556C]">
                  Comparte tu meta profesional
                </h3>
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cuadro destacado con información del premio */}
              <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-[#FF8000]/30 flex gap-3 items-start relative overflow-hidden">
                {/* Efecto shimmer */}
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                <img src={coinIcon} alt="Coin" className="w-6 h-6 flex-shrink-0 mt-0.5 relative z-10 animate-[coin-pulse_2s_ease-in-out_infinite]" />
                <p className="text-sm text-[#45556C] leading-relaxed font-bold m-0 relative z-10">
                  Todas las respuestas enviadas participan en el sorteo de un increíble premio.
                </p>
              </div>

              {/* Texto adicional fuera del cuadro */}
              <p className="mb-6 text-sm text-[#45556C] leading-relaxed">
                ¡Recuerda que cada premio ganado es una oportunidad para llevarte ese producto soñado del catálogo sin gastar de tu bolsillo!
              </p>

              {/* Textarea */}
              <div className="mb-6">
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Mi meta profesional para el 2026 es..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all text-sm text-[#45556C] placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponseText('');
                  }}
                  className="flex-1 px-6 py-3 rounded-full border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (responseText.trim()) {
                      // Aquí iría la lógica para enviar la respuesta
                      alert('¡Gracias! Tu meta ha sido enviada y participas en el sorteo.');
                      setShowResponseModal(false);
                      setResponseText('');
                    }
                  }}
                  disabled={!responseText.trim()}
                  className="flex-1 px-6 py-3 rounded-full bg-[#FF8000] hover:bg-[#FF9119] shadow-md shadow-[#FF8000]/20 hover:shadow-lg hover:shadow-[#FF8000]/30 transition-all text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enviar respuesta
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Encuesta */}
        <EncuestaModal
          isOpen={showEncuestaModal}
          onClose={() => setShowEncuestaModal(false)}
        />
      </div>
    </div>
  );
}