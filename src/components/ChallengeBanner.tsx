import { Icon } from '@iconify/react';

// Paleta de 7 colores suaves predefinidos
const COLOR_PALETTES = {
  blue: 'linear-gradient(135deg, #E3F2FD 0%, #90CAF9 100%)',
  green: 'linear-gradient(135deg, #E8F5E9 0%, #81C784 100%)',
  purple: 'linear-gradient(135deg, #F3E5F5 0%, #BA68C8 100%)',
  orange: 'linear-gradient(135deg, #FFF3E0 0%, #FFB74D 100%)',
  pink: 'linear-gradient(135deg, #FCE4EC 0%, #F06292 100%)',
  teal: 'linear-gradient(135deg, #E0F2F1 0%, #4DB6AC 100%)',
  gold: 'linear-gradient(135deg, #FFF9E6 0%, #FFD700 100%)'
} as const;

export type ColorPalette = keyof typeof COLOR_PALETTES;

interface ChallengeBannerProps {
  imageUrl?: string;
  iconifyIcon?: string; // Nuevo: nombre del ícono de Iconify
  title: string;
  colorPalette: ColorPalette;
  children?: React.ReactNode; // Para la pill flotante
  isFinished?: boolean; // Nuevo: para aplicar grayscale cuando esté finalizado
  size?: 'normal' | 'large'; // Nuevo: controla la altura del banner
}

export function ChallengeBanner({ imageUrl, iconifyIcon, title, colorPalette, children, isFinished, size = 'normal' }: ChallengeBannerProps) {
  const gradientColor = COLOR_PALETTES[colorPalette];
  const heightClass = size === 'large' ? 'h-40 md:h-48' : 'h-32';
  const iconContainerSize = size === 'large' ? 'w-28 h-28' : 'w-24 h-24';
  const iconSize = size === 'large' ? 'w-16 h-16' : 'w-14 h-14';

  return (
    <div 
      className={`relative ${heightClass} overflow-hidden ${isFinished ? 'grayscale' : ''}`}
      style={{ background: gradientColor }}
    >
      {/* Imagen circular centrada */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`${iconContainerSize} rounded-full bg-white shadow-lg overflow-hidden flex items-center justify-center p-1.5`}>
          {iconifyIcon ? (
            <Icon icon={iconifyIcon} className={`${iconSize} text-gray-700`} />
          ) : imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-contain"
            />
          ) : null}
        </div>
      </div>

      {/* Pill flotante (pasada como children) */}
      {children}
    </div>
  );
}