import { ChevronDown, ChevronUp, Plus, Minus, Zap, Gift, TrendingDown, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  reason: string;
  type: 'earning' | 'redemption' | 'transfer' | 'bonus' | 'deduction' | 'expiration';
  amount: number;
  balanceAfter: number;
  category: string;
}

interface WalletTransactionsProps {
  transactions: Transaction[];
  isLoading: boolean;
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const getTypeConfig = (type: string) => {
  const configs: Record<string, any> = {
    earning: {
      icon: Plus,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      label: 'Ganancia',
      sign: '+',
    },
    bonus: {
      icon: Gift,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      label: 'Bonificación',
      sign: '+',
    },
    redemption: {
      icon: Minus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      label: 'Canje',
      sign: '-',
    },
    transfer: {
      icon: RefreshCw,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      label: 'Transferencia',
      sign: '→',
    },
    deduction: {
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      label: 'Deducción',
      sign: '-',
    },
    expiration: {
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      label: 'Vencimiento',
      sign: '✕',
    },
  };
  return configs[type] || configs.earning;
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    general: 'General',
    challenge: 'Desafío',
    promotion: 'Promoción',
    survey: 'Encuesta',
    purchase: 'Compra',
    refund: 'Reembolso',
    store: 'Catálogo',
  };
  return labels[category] || category;
};

const TransactionRow = ({ transaction, isExpanded, onToggle }: any) => {
  const typeConfig = getTypeConfig(transaction.type);
  const Icon = typeConfig.icon;
  const isPositive = transaction.type === 'earning' || transaction.type === 'bonus';

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full text-left hover:bg-slate-50 transition-colors py-4 px-4"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${typeConfig.bgColor} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${typeConfig.color}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start md:items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{transaction.description}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(transaction.date).toLocaleDateString('es-CL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <div className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : '-'}{transaction.amount.toLocaleString('es-CL')}
            </div>
            <p className="text-xs text-slate-500 mt-1">{getCategoryLabel(transaction.category)}</p>
          </div>

          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">
                {transaction.balanceAfter.toLocaleString('es-CL')}
              </p>
              <p className="text-xs text-slate-500">saldo</p>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <div className="md:hidden flex-shrink-0">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50 px-4 py-4 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-600 font-medium">Razón</p>
                  <p className="text-sm text-slate-900 mt-1">{transaction.reason}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Tipo</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${typeConfig.color}`}></div>
                    <p className="text-sm text-slate-900">{typeConfig.label}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-600 font-medium">Puntos</p>
                  <p className={`text-sm font-semibold mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {typeConfig.sign}{transaction.amount.toLocaleString('es-CL')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Saldo Después</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {transaction.balanceAfter.toLocaleString('es-CL')}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-600 font-medium">Fecha</p>
                <p className="text-sm text-slate-900 mt-1">
                  {new Date(transaction.date).toLocaleDateString('es-CL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function WalletTransactions({
  transactions,
  isLoading,
  totalCount,
  page,
  pageSize,
  onPageChange,
}: WalletTransactionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const totalPages = Math.ceil(totalCount / pageSize);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-md shadow-slate-100 border border-slate-100 p-8">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md shadow-slate-100 border border-slate-100 p-12 text-center">
        <Minus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-600 font-medium mb-2">Sin movimientos</p>
        <p className="text-sm text-slate-500">
          No hay transacciones que coincidan con los filtros seleccionados
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-md shadow-slate-100 border border-slate-100 overflow-hidden">
        <div className="hidden md:block">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 grid grid-cols-5 gap-4 text-xs font-semibold text-slate-600">
            <div>Fecha</div>
            <div className="col-span-2">Movimiento</div>
            <div className="text-right">Puntos</div>
            <div className="text-right">Saldo</div>
          </div>
        </div>

        <div>
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              isExpanded={expandedId === transaction.id}
              onToggle={() => setExpandedId(expandedId === transaction.id ? null : transaction.id)}
            />
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Anterior
          </button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isCurrentPage = pageNum === page;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                    isCurrentPage
                      ? 'bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] text-white'
                      : 'border border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
