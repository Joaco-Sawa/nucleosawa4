interface LoaderProps {
  size?: number;
  className?: string;
}

export function Loader({ size = 50, className = '' }: LoaderProps) {
  return (
    <div
      className={`loader ${className}`}
      style={{
        width: `${size}px`,
        aspectRatio: '1',
        borderRadius: '50%',
        background: `
          radial-gradient(farthest-side, #ffa516 94%, transparent) top/8px 8px no-repeat,
          conic-gradient(transparent 30%, #ffa516)
        `,
        WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0)',
        mask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0)',
        animation: 'spin 1s infinite linear',
      }}
    />
  );
}

// Componente de pantalla de carga completa
export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <Loader size={60} />
        <p className="text-sm font-medium text-slate-600">Cargando...</p>
      </div>
    </div>
  );
}

// Componente de loader centrado en contenedor
export function CenteredLoader({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <Loader size={50} />
      {message && <p className="text-sm font-medium text-slate-600">{message}</p>}
    </div>
  );
}
