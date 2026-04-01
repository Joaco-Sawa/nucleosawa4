import { TrendingUp, AlertTriangle, ShoppingCart, RefreshCw } from 'lucide-react';

interface WalletBalanceProps {
  totalPoints: number;
  expiringPoints: number;
  expirationDate?: string;
  daysUntilExpiration?: number;
  lastUpdated: Date;
  onGoToCatalog: () => void;
}

const coinIcon = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" fill="currentColor" />
  </svg>
);

export default function WalletBalance({
  totalPoints,
  expiringPoints,
  expirationDate,
  daysUntilExpiration,
  lastUpdated,
  onGoToCatalog,
}: WalletBalanceProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatExpirationDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isExpirationSoon = daysUntilExpiration !== undefined && daysUntilExpiration <= 30;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-md shadow-slate-100 border border-slate-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <p className="text-sm text-slate-600 font-medium mb-2">Balance de Puntos</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-bold text-slate-900">
                  {totalPoints.toLocaleString('es-CL')}
                </span>
                <span className="text-lg text-slate-500">puntos</span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">Disponibles para</p>
                    <p className="text-sm font-semibold text-slate-900">Canjear en el Catálogo</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <button
                onClick={onGoToCatalog}
                className="w-full md:w-fit px-6 py-3 bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] hover:from-[#FFB970] hover:to-[#FF9119] text-white font-semibold rounded-full shadow-md shadow-[#FF8000]/30 hover:shadow-lg hover:shadow-[#FF8000]/40 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Ir al Catálogo</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md shadow-slate-100 border border-slate-100">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-600 font-medium mb-2">Información de Cuenta</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Puntos Disponibles</span>
                  <span className="font-semibold text-slate-900">
                    {(totalPoints - expiringPoints).toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">A Vencer Próximamente</span>
                  <span className="font-semibold text-slate-900">
                    {expiringPoints.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" />
                {formatDate(lastUpdated)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {expiringPoints > 0 && isExpirationSoon && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-6 flex items-start gap-4">
          <div className="flex-shrink-0 pt-0.5">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-amber-900 mb-1">Puntos a Vencer Próximamente</h3>
            <p className="text-sm text-amber-800">
              Tienes <span className="font-bold">{expiringPoints.toLocaleString('es-CL')} puntos</span> que vencerán el{' '}
              <span className="font-bold">{expirationDate ? formatExpirationDate(expirationDate) : 'próximamente'}</span>
              {daysUntilExpiration && daysUntilExpiration > 0 && (
                <span> (en {daysUntilExpiration} días)</span>
              )}
              . Te recomendamos canjearlo antes de que expire.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
