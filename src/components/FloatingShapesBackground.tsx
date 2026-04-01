import { useEffect, useState } from 'react';

/**
 * Componente de fondo animado con formas geométricas flotantes
 * Replica el diseño del BackgroundDemo con animaciones suaves
 */

interface Shape {
  id: number;
  size: number;
  x: number;
  y: number;
  color: string;
  blur: number;
  duration: number;
  delay: number;
  type: 'circle' | 'square' | 'triangle';
}

export default function FloatingShapesBackground() {
  const [shapes, setShapes] = useState<Shape[]>([]);

  // Generar formas geométricas con posiciones y animaciones aleatorias
  useEffect(() => {
    const colors = [
      'rgba(209, 213, 219, 0.3)', // gray-300/30
      'rgba(156, 163, 175, 0.25)', // gray-400/25
      'rgba(209, 213, 219, 0.2)',  // gray-300/20
      'rgba(229, 231, 235, 0.35)', // gray-200/35
      'rgba(243, 244, 246, 0.4)',  // gray-100/40
    ];

    const types: ('circle' | 'square' | 'triangle')[] = ['circle', 'circle', 'circle', 'square', 'triangle'];

    const generatedShapes: Shape[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: Math.random() * 250 + 150, // Entre 150px y 400px
      x: Math.random() * 100, // Posición X en porcentaje
      y: Math.random() * 100, // Posición Y en porcentaje
      color: colors[Math.floor(Math.random() * colors.length)],
      blur: Math.random() * 40 + 40, // Entre 40px y 80px de blur
      duration: Math.random() * 15 + 20, // Entre 20s y 35s
      delay: Math.random() * 5, // Delay aleatorio hasta 5s
      type: types[Math.floor(Math.random() * types.length)],
    }));

    setShapes(generatedShapes);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Fondo base blanco con gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100" />

      {/* Formas geométricas flotantes */}
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute animate-float"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            animation: `float ${shape.duration}s ease-in-out infinite`,
            animationDelay: `${shape.delay}s`,
          }}
        >
          {shape.type === 'circle' && (
            <div
              className="w-full h-full rounded-full transition-all duration-1000"
              style={{
                background: shape.color,
                filter: `blur(${shape.blur}px)`,
              }}
            />
          )}
          {shape.type === 'square' && (
            <div
              className="w-full h-full rotate-45 transition-all duration-1000"
              style={{
                background: shape.color,
                filter: `blur(${shape.blur}px)`,
              }}
            />
          )}
          {shape.type === 'triangle' && (
            <div
              className="w-full h-full transition-all duration-1000"
              style={{
                filter: `blur(${shape.blur}px)`,
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon
                  points="50,10 90,90 10,90"
                  fill={shape.color}
                />
              </svg>
            </div>
          )}
        </div>
      ))}

      {/* Capas adicionales para mayor profundidad - Réplica del BackgroundDemo */}
      <div
        className="absolute top-20 left-20 w-96 h-96 rounded-full animate-pulse-slow"
        style={{
          background: 'rgba(209, 213, 219, 0.3)',
          filter: 'blur(80px)',
          animation: 'float 25s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-20 right-20 w-80 h-80 rounded-full animate-pulse-slow"
        style={{
          background: 'rgba(156, 163, 175, 0.2)',
          filter: 'blur(70px)',
          animation: 'float 30s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'rgba(209, 213, 219, 0.25)',
          filter: 'blur(90px)',
          animation: 'float 35s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />

      {/* Estilos CSS inline para las animaciones */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(20px, -30px) rotate(5deg);
          }
          50% {
            transform: translate(-15px, 20px) rotate(-3deg);
          }
          75% {
            transform: translate(30px, 10px) rotate(3deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
