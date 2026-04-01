import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, Calendar, Heart, MessageCircle, Upload, Award, Star, Users } from 'lucide-react';
import { useState } from 'react';
import coinIcon from '../assets/db29ff4dc98462b3539ca31d029b8918fad5d4e6.png';
import profileImage from '../assets/9f5aa0e583374b6893d8921a6183b99d788006eb.png';
import logoDesafioSawa from '../assets/90d0b6e7e40ee202a8c067619d31d9c79731c384.png';
import knowledgeContestImage from '../assets/Frame_821.png';
import newContestImage from '../assets/Frame_821.jpg';

export function ContestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Función para calcular días restantes
  const getDaysRemaining = (endDate: string): number => {
    const today = new Date('2026-03-24'); // Fecha actual según el contexto
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Mock data de los concursos - En producción vendría de una API
  const contests: { [key: string]: any } = {
    '15': {
      id: 15,
      title: '¡Pon a prueba tu conocimiento y gana!',
      image: knowledgeContestImage,
      excerpt: 'Demuestra lo que sabes sobre nuestra empresa y participa por 200 puntos. ¿Estás listo para el desafío?',
      author: 'Comunicaciones',
      authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      date: '20 de marzo de 2026',
      publishedAgo: 'Hace 4 días',
      comments: 15,
      category: 'Logros del equipo',
      deadline: '28 de marzo de 2026',
      contestEndDate: '2026-03-28',
      prizes: [
        { place: '1er Lugar', points: 3000, icon: '🥇' },
        { place: '2do Lugar', points: 2000, icon: '🥈' },
        { place: '3er Lugar', points: 1000, icon: '🥉' }
      ],
      participants: 42,
      rules: [
        'Responde las 10 preguntas de conocimiento general sobre la empresa',
        'Tienes 15 minutos para completar el cuestionario',
        'Cada pregunta correcta suma puntos',
        'Solo se permite un intento por persona',
        'El cuestionario estará disponible hasta el 28 de marzo'
      ],
      description: `¿Cuánto conoces realmente sobre nuestra empresa? ¡Es momento de demostrarlo!

Participa en nuestro desafío de conocimiento y pon a prueba lo que sabes sobre nuestra historia, valores, productos y cultura organizacional. Los participantes con mejores puntajes ganarán premios increíbles.

**¿Cómo participar?**

1. Lee atentamente cada pregunta del cuestionario
2. Selecciona la respuesta correcta de las opciones múltiples
3. Completa todas las preguntas antes de que se acabe el tiempo
4. Envía tus respuestas y revisa tu puntaje

**Temáticas del cuestionario:**

• **Historia de la empresa (20%)**: Hitos importantes y evolución
• **Productos y servicios (30%)**: Conocimiento de nuestro catálogo
• **Cultura y valores (25%)**: Principios que nos guían
• **Logros recientes (25%)**: Noticias y reconocimientos del último año

Los ganadores se anunciarán el 30 de marzo. ¡Mientras más sepas, más posibilidades tienes de ganar!

**Importante:** El cuestionario es individual y no se permite consultar información externa durante la participación.

¡Demuestra que eres un verdadero experto!`,
      ctaText: 'Comenzar cuestionario',
      prizePoints: 200
    },
    '14': {
      id: 14,
      title: '¡Tu hoja de ruta para este 2026!',
      image: newContestImage,
      excerpt: 'Comenzar el año con objetivos claros es la clave para llegar lejos. Comparte tu plan de desarrollo y gana hasta 3,000 puntos.',
      author: 'Desarrollo de Talento',
      authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      date: '12 de marzo de 2026',
      publishedAgo: 'Hace 12 días',
      comments: 38,
      category: 'Desarrollo profesional',
      deadline: '25 de marzo de 2026',
      contestEndDate: '2026-03-25',
      prizes: [
        { place: '1er Lugar', points: 3000, icon: '🥇' },
        { place: '2do Lugar', points: 2000, icon: '🥈' },
        { place: '3er Lugar', points: 1000, icon: '🥉' }
      ],
      participants: 67,
      rules: [
        'Crea un documento con tus 3-5 objetivos profesionales principales para el 2026',
        'Cada objetivo debe incluir: meta específica, plazo y cómo lo medirás',
        'Formato PDF o presentación, máximo 3 páginas',
        'Solo se permite una participación por persona',
        'La hoja de ruta debe ser realista y alineada con tu rol actual'
      ],
      description: `¡Empieza el 2026 con el pie derecho!

Queremos conocer tus planes de crecimiento profesional para este año. ¿Qué habilidades quieres desarrollar? ¿Qué metas te propones alcanzar? ¿Cómo vas a contribuir al éxito del equipo?

**¿Cómo participar?**

1. Define 3-5 objetivos profesionales clave para el 2026
2. Para cada objetivo, especifica: qué quieres lograr, cuándo, y cómo lo medirás
3. Sube tu documento usando el botón "Subir mi plan" al final de esta página
4. ¡Listo! Tu hoja de ruta quedará registrada en el concurso

**Criterios de evaluación:**

• **Claridad (30%)**: Objetivos específicos y bien definidos
• **Medibilidad (30%)**: Indicadores claros de éxito
• **Viabilidad (20%)**: Metas realistas y alcanzables
• **Impacto (20%)**: Contribución al equipo y la organización

El comité evaluador estará conformado por líderes de Desarrollo de Talento y RRHH. Los ganadores se anunciarán el 30 de marzo.

¡Tu desarrollo profesional es nuestra prioridad!`,
      ctaText: 'Subir mi plan',
      prizePoints: 100
    }
  };

  // Obtener el concurso basado en el ID de la URL
  const contest = contests[id || '14'] || contests['14'];

  const userPoints = 15000;
  const [isLiked, setIsLiked] = useState(true);

  // Inicializar likes según el concurso
  const initialLikes = id === '15' ? 89 : 215;
  const [likes, setLikes] = useState(initialLikes);

  const daysRemaining = getDaysRemaining(contest.contestEndDate);

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikes(likes - 1);
    } else {
      setIsLiked(true);
      setLikes(likes + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 w-full max-w-full md:h-[calc(100vh-1rem)] md:overflow-y-auto md:m-2 overflow-y-auto overflow-x-hidden pb-[88px] md:pb-0">
      {/* Header Mobile */}
      <header className="md:hidden bg-white sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              onClick={() => navigate('/')}
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center active:bg-slate-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>

            {/* Logo */}
            <img src={logoDesafioSawa} alt="Desafío Sawa" className="h-10 object-contain" />
            
            {/* Spacer */}
            <div className="flex-1" />

            {/* Points Badge */}
            <div className="px-3 py-2 rounded-full bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 flex items-center gap-2">
              <img src={coinIcon} alt="Coin" className="w-6 h-6" />
              <div className="flex flex-col">
                <div className="text-[9px] text-white opacity-90 tracking-wide leading-none" style={{ fontWeight: 500 }}>Tus puntos</div>
                <div className="text-base font-bold text-white leading-none mt-0.5" style={{ fontWeight: 800 }}>{userPoints.toLocaleString('es-CL')}</div>
              </div>
            </div>

            {/* Profile Photo */}
            <button className="w-9 h-9 rounded-full ring-2 ring-slate-200 overflow-hidden">
              <img src={profileImage} alt="Carlos Toledo" className="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto w-full px-4 md:px-6 py-6 md:py-8">
        {/* Desktop Back Button */}
        <button
          onClick={() => navigate('/')}
          className="hidden md:flex items-center gap-2 text-slate-600 hover:text-[#FF8000] transition-colors mb-6 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Volver al Muro</span>
        </button>

        {/* Contest Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50">
          {/* Hero Image con badge de "Concurso" */}
          <div className="relative">
            <img 
              src={contest.image} 
              alt={contest.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            {/* Badge de Concurso */}
            <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFAD5B] to-[#FF8000] shadow-lg shadow-[#FF8000]/30 flex items-center gap-2 z-20">
              <Star className="w-4 h-4 text-white fill-white" />
              <span className="text-white font-bold text-sm">Concurso Activo</span>
            </div>
            {/* Pill de días restantes - Estilo igual a Desafíos */}
            <div className="absolute top-4 right-4 z-20">
              <span 
                className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold border shadow-md ${
                  daysRemaining <= 3
                    ? 'bg-red-100 text-red-700 border-red-700'
                    : daysRemaining <= 7
                    ? 'bg-amber-100 text-amber-700 border-amber-700'
                    : 'bg-emerald-100 text-emerald-700 border-emerald-700'
                }`}
                style={{ borderWidth: '0.5px' }}
              >
                Quedan {daysRemaining} {daysRemaining === 1 ? 'día' : 'días'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-[#45556C] mb-4 leading-tight">
              {contest.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <img 
                  src={contest.authorImage} 
                  alt={contest.author}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">{contest.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{contest.date} • {contest.publishedAgo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF8000]" />
                <span className="font-semibold">{contest.participants} participantes</span>
              </div>
            </div>

            {/* Interaction buttons */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-200 mb-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  isLiked 
                    ? 'bg-[#FF8000]/10 text-[#FF8000]' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#FF8000]' : ''}`} />
                <span className="font-semibold">{likes}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">{contest.comments}</span>
              </button>
            </div>

            {/* Prizes Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#45556C] mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-[#FF8000]" />
                Premios
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contest.prizes.map((prize, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 text-center border-2 border-slate-200 hover:border-[#FF8000]/30 transition-all"
                  >
                    <div className="text-4xl mb-2">{prize.icon}</div>
                    <div className="font-bold text-[#45556C] mb-1">{prize.place}</div>
                    <div className="flex items-center justify-center gap-2">
                      <img src={coinIcon} alt="Coin" className="w-6 h-6" />
                      <span className="text-2xl font-bold text-[#FF8000]">{prize.points.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">puntos</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deadline */}
            <div className="bg-orange-50 border-2 border-[#FF8000]/20 rounded-xl p-4 mb-8">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#FF8000] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-[#45556C] mb-1">Fecha límite de participación</div>
                  <div className="text-[#FF8000] font-semibold">{contest.deadline}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-slate max-w-none mb-8">
              {contest.description.split('\n\n').map((paragraph, index) => {
                // Check if paragraph is bold (starts with **)
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h3 key={index} className="text-lg font-bold text-[#45556C] mt-6 mb-3">
                      {paragraph.slice(2, -2)}
                    </h3>
                  );
                }
                // Check if paragraph is a numbered list
                if (/^\d+\./.test(paragraph)) {
                  const lines = paragraph.split('\n');
                  return (
                    <ol key={index} className="list-decimal list-inside space-y-2 text-slate-700">
                      {lines.map((line, i) => (
                        <li key={i}>{line.replace(/^\d+\.\s*/, '')}</li>
                      ))}
                    </ol>
                  );
                }
                // Check if paragraph is a bullet list
                if (paragraph.startsWith('•')) {
                  const lines = paragraph.split('\n');
                  return (
                    <ul key={index} className="space-y-2 text-slate-700">
                      {lines.map((line, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#FF8000] font-bold mt-1">•</span>
                          <span>{line.replace(/^•\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                // Regular paragraph
                return (
                  <p key={index} className="text-slate-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Rules Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#45556C] mb-4">Bases del concurso</h2>
              <div className="bg-slate-50 rounded-xl p-5">
                <ul className="space-y-3">
                  {contest.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#FF8000] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-slate-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#45556C] mb-4">¿Qué debes hacer?</h3>
              <p className="text-slate-700 mb-4">Todas las respuestas enviadas participan en el sorteo de...</p>
              <div className="bg-gradient-to-r from-[#FF8000] to-[#FF9119] rounded-2xl p-6 mb-6">
                <p className="text-xl font-bold text-white">{contest.prizePoints} puntos</p>
              </div>
              <button className="bg-gradient-to-r from-[#FF8000] to-[#FF9119] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto">
                <Upload className="w-6 h-6" />
                <span>{contest.ctaText}</span>
              </button>
              <p className="text-slate-600 text-sm mt-4">{contest.participants} participantes ya se registraron</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}