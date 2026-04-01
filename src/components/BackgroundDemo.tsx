import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const backgrounds = [
  {
    id: 1,
    name: 'Puntos con Gradiente',
    description: 'Patrón de puntos espaciados con gradiente radial desde el centro',
    style: {
      background: 'radial-gradient(circle at center, #F9FAFB 0%, #F3F4F6 100%)',
      backgroundImage: 'radial-gradient(circle, #D1D5DB 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    }
  },
  {
    id: 2,
    name: 'Líneas Diagonales',
    description: 'Líneas sutiles en diagonal a 45 grados',
    style: {
      background: '#F9FAFB',
      backgroundImage: 'linear-gradient(45deg, transparent 48%, #E5E7EB 48%, #E5E7EB 52%, transparent 52%)',
      backgroundSize: '40px 40px',
    }
  },
  {
    id: 3,
    name: 'Grid con Fade',
    description: 'Cuadrícula que se desvanece hacia los bordes',
    style: {
      background: '#F9FAFB',
      backgroundImage: `
        linear-gradient(#E5E7EB 1px, transparent 1px),
        linear-gradient(90deg, #E5E7EB 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px',
      WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 100%)',
      maskImage: 'radial-gradient(circle, black 50%, transparent 100%)',
    }
  },
  {
    id: 4,
    name: 'Formas Geométricas Flotantes',
    description: 'Círculos grandes con blur para profundidad',
    className: 'geometric-shapes',
    style: {
      background: '#FFFFFF'
    }
  },
  {
    id: 5,
    name: 'Ondas Orgánicas',
    description: 'Curvas suaves con gradientes sutiles',
    className: 'organic-waves',
    style: {
      background: '#FFFFFF'
    }
  }
];

export default function BackgroundDemo() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fondos Minimalistas para Login
          </h1>
          <p className="text-gray-600">
            Haz clic en cualquier diseño para verlo en pantalla completa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {backgrounds.map((bg) => (
            <Card
              key={bg.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelected(bg.id)}
            >
              <div
                className="h-48 relative"
                style={bg.style}
              >
                {bg.className === 'geometric-shapes' && (
                  <>
                    <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-gray-300/30 blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-gray-400/20 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gray-300/25 blur-3xl" />
                  </>
                )}
                {bg.className === 'organic-waves' && (
                  <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`grad-${bg.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F9FAFB" />
                        <stop offset="50%" stopColor="#F3F4F6" />
                        <stop offset="100%" stopColor="#E5E7EB" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,150 Q100,100 200,150 T400,150 L400,300 L0,300 Z"
                      fill={`url(#grad-${bg.id})`}
                      opacity="0.4"
                    />
                    <path
                      d="M0,180 Q100,140 200,180 T400,180 L400,300 L0,300 Z"
                      fill="#E5E7EB"
                      opacity="0.3"
                    />
                  </svg>
                )}

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-2">Login</div>
                    <div className="w-48 h-8 bg-gray-200 rounded mb-2" />
                    <div className="w-48 h-8 bg-gray-200 rounded mb-4" />
                    <div className="w-48 h-8 bg-gray-900 rounded" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white">
                <h3 className="font-semibold text-gray-900 mb-1">{bg.name}</h3>
                <p className="text-sm text-gray-600">{bg.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
              <div
                className="absolute inset-0"
                style={backgrounds.find(b => b.id === selected)?.style}
              >
                {backgrounds.find(b => b.id === selected)?.className === 'geometric-shapes' && (
                  <>
                    <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-gray-300/30 blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gray-400/20 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gray-300/25 blur-3xl" />
                  </>
                )}
                {backgrounds.find(b => b.id === selected)?.className === 'organic-waves' && (
                  <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="grad-full" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F9FAFB" />
                        <stop offset="50%" stopColor="#F3F4F6" />
                        <stop offset="100%" stopColor="#E5E7EB" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,400 Q480,300 960,400 T1920,400 L1920,1080 L0,1080 Z"
                      fill="url(#grad-full)"
                      opacity="0.4"
                    />
                    <path
                      d="M0,500 Q480,420 960,500 T1920,500 L1920,1080 L0,1080 Z"
                      fill="#E5E7EB"
                      opacity="0.3"
                    />
                    <path
                      d="M0,600 Q480,540 960,600 T1920,600 L1920,1080 L0,1080 Z"
                      fill="#D1D5DB"
                      opacity="0.2"
                    />
                  </svg>
                )}

                <div className="absolute inset-0 flex items-center justify-center">
                  <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm shadow-2xl">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h2>
                      <p className="text-gray-600">Inicia sesión en tu cuenta</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correo electrónico
                        </label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                          placeholder="tu@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contraseña
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                          placeholder="••••••••"
                        />
                      </div>

                      <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                        Iniciar Sesión
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              <Button
                variant="outline"
                className="absolute top-4 right-4 bg-white"
                onClick={() => setSelected(null)}
              >
                Cerrar
              </Button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg">
                <p className="text-sm font-semibold text-gray-900">
                  {backgrounds.find(b => b.id === selected)?.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}