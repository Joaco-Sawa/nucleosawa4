import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Filter, Calendar, X } from 'lucide-react';
import { DateRangePicker } from './DateRangePicker';
import WalletBalance from './WalletBalance';
import WalletTransactions from './WalletTransactions';
import { supabase } from '../lib/supabase';

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

type FilterType = 'all' | 'earning' | 'redemption';

export default function WalletView() {
  const navigate = useNavigate();
  const [totalPoints, setTotalPoints] = useState(0);
  const [expiringPoints, setExpiringPoints] = useState(0);
  const [expirationDate, setExpirationDate] = useState<string>();
  const [daysUntilExpiration, setDaysUntilExpiration] = useState<number>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const lastUpdated = new Date();

  useEffect(() => {
    loadWalletData();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [searchQuery, filterType, dateRange, page]);

  const loadWalletData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get total points using RPC function
      const { data: pointsData, error: pointsError } = await supabase.rpc('get_user_total_points', {
        p_user_id: user.id,
      });

      if (!pointsError && pointsData && pointsData.length > 0) {
        setTotalPoints(pointsData[0].total_points || 0);
      }

      // Get expiring points
      const { data: expiringData, error: expiringError } = await supabase.rpc('get_user_expiring_points', {
        p_user_id: user.id,
      });

      if (!expiringError && expiringData && expiringData.length > 0) {
        const expiring = expiringData[0];
        setExpiringPoints(expiring.total_expiring || 0);
        setDaysUntilExpiration(expiring.days_until_expiration || 0);

        if (expiring.expires_at) {
          setExpirationDate(expiring.expires_at);
        }
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('wallet_movements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filterType !== 'all') {
        query = query.eq('type', filterType);
      }

      if (dateRange.from && dateRange.to) {
        query = query
          .gte('created_at', dateRange.from.toISOString())
          .lte('created_at', dateRange.to.toISOString());
      }

      if (searchQuery) {
        query = query.or(
          `description.ilike.%${searchQuery}%,reason.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`
        );
      }

      const { data, error, count } = await query
        .range((page - 1) * pageSize, page * pageSize - 1)
        .returns<any[]>();

      if (error) {
        console.error('Error loading transactions:', error);
        return;
      }

      const formattedTransactions: Transaction[] = (data || []).map((t) => ({
        id: t.id,
        date: t.created_at,
        description: t.description,
        reason: t.reason,
        type: t.type,
        amount: t.amount,
        balanceAfter: t.balance_after,
        category: t.category,
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setDateRange({ from: undefined, to: undefined });
    setPage(1);
  };

  const hasActiveFilters = searchQuery || filterType !== 'all' || dateRange.from || dateRange.to;

  return (
    <div className="min-h-screen pb-12 md:pb-6">
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 backdrop-blur-xl bg-white/80">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-slate-900">Mi Billetera</h1>

          <div className="ml-auto flex items-center gap-2">
            <div className="min-w-[140px] h-[52px] w-fit rounded-xl bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 hover:shadow-lg hover:shadow-[#FF8000]/30 transition-all duration-300 px-3 flex items-center gap-3 cursor-pointer flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" fill="currentColor" />
              </svg>
              <div className="flex flex-col pr-2">
                <div className="text-[10px] text-white font-medium opacity-90">Tus puntos</div>
                <div className="text-[20px] font-bold text-white" style={{ fontWeight: 800 }}>
                  {totalPoints.toLocaleString('es-CL')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
        <WalletBalance
          totalPoints={totalPoints}
          expiringPoints={expiringPoints}
          expirationDate={expirationDate}
          daysUntilExpiration={daysUntilExpiration}
          lastUpdated={lastUpdated}
          onGoToCatalog={() => navigate('/catalogo')}
        />

        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar movimientos..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-2.5 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {}}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 bg-white hover:border-[#FF8000]/30 transition-all text-sm font-medium text-slate-700"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtrar</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {['all', 'earning', 'redemption'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type as FilterType);
                      setPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filterType === type
                        ? 'bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] text-white shadow-md shadow-[#FF8000]/20'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {type === 'all' && 'Todo'}
                    {type === 'earning' && 'Cargas'}
                    {type === 'redemption' && 'Canjes'}
                  </button>
                ))}
              </div>

              {dateRange.from || dateRange.to ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">
                    {dateRange.from?.toLocaleDateString('es-CL')} - {dateRange.to?.toLocaleDateString('es-CL')}
                  </span>
                  <button
                    onClick={() => setDateRange({ from: undefined, to: undefined })}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Limpiar
                  </button>
                </div>
              ) : (
                <DateRangePicker
                  onRangeChange={(from, to) => {
                    setDateRange({ from, to });
                    setPage(1);
                  }}
                  compact
                />
              )}

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Limpiar todos los filtros
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Historial de Movimientos</h2>
            <WalletTransactions
              transactions={transactions}
              isLoading={isLoading}
              totalCount={100}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
