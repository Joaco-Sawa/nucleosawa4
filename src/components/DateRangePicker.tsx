import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface DateRangePickerProps {
  onApply: (start: string | null, end: string | null) => void;
  onClose: () => void;
  onClear: () => void;
}

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const MONTHS_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];
const MIN_YEAR = 2020;
const YEARS_PER_PAGE = 16;

type Mode = 'months' | 'years';

export function DateRangePicker({ onApply, onClose, onClear }: DateRangePickerProps) {
  const today = new Date();
  const maxYear = today.getFullYear();

  const [mode, setMode] = useState<Mode>('months');
  const [viewYear, setViewYear] = useState(maxYear);
  const [yearPageStart, setYearPageStart] = useState(
    Math.floor((maxYear - MIN_YEAR) / YEARS_PER_PAGE) * YEARS_PER_PAGE + MIN_YEAR
  );

  // Guardamos mes/año como objetos simples {year, month}
  const [selectedStart, setSelectedStart] = useState<{year: number, month: number} | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<{year: number, month: number} | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<{year: number, month: number} | null>(null);

  // ── Year nav ──────────────────────────────────────────────────────────────
  const goPrevYear = () => setViewYear(y => Math.max(MIN_YEAR, y - 1));
  const goNextYear = () => setViewYear(y => Math.min(maxYear, y + 1));

  // ── Year page nav ─────────────────────────────────────────────────────────
  const prevYearPage = () =>
    setYearPageStart(s => Math.max(MIN_YEAR, s - YEARS_PER_PAGE));
  const nextYearPage = () =>
    setYearPageStart(s => s + YEARS_PER_PAGE <= maxYear ? s + YEARS_PER_PAGE : s);

  const yearsOnPage = Array.from(
    { length: YEARS_PER_PAGE },
    (_, i) => yearPageStart + i
  ).filter(y => y >= MIN_YEAR && y <= maxYear);

  // ── Month helpers ─────────────────────────────────────────────────────────
  const compareMonths = (a: {year: number, month: number}, b: {year: number, month: number}) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  };

  const isMonthInRange = (year: number, monthIdx: number) => {
    if (!selectedStart) return false;
    const current = {year, month: monthIdx};
    
    // Si hay hover y no hay end seleccionado, mostrar el rango temporal
    if (!selectedEnd && hoveredMonth) {
      const start = selectedStart;
      const end = hoveredMonth;
      const [min, max] = compareMonths(start, end) <= 0 ? [start, end] : [end, start];
      return compareMonths(current, min) > 0 && compareMonths(current, max) < 0;
    }
    
    if (selectedEnd) {
      return compareMonths(current, selectedStart) > 0 && compareMonths(current, selectedEnd) < 0;
    }
    return false;
  };

  const isStartMonth = (year: number, monthIdx: number) => {
    if (!selectedStart) return false;
    return selectedStart.year === year && selectedStart.month === monthIdx;
  };

  const isEndMonth = (year: number, monthIdx: number) => {
    if (!selectedEnd) return false;
    return selectedEnd.year === year && selectedEnd.month === monthIdx;
  };

  // ── Month click ───────────────────────────────────────────────────────────
  const handleMonthClick = (monthIdx: number) => {
    const clicked = {year: viewYear, month: monthIdx};
    
    if (!selectedStart || (selectedStart && selectedEnd)) {
      // Empezar nueva selección
      setSelectedStart(clicked);
      setSelectedEnd(null);
    } else {
      // Completar rango
      if (compareMonths(clicked, selectedStart) < 0) {
        setSelectedEnd(selectedStart);
        setSelectedStart(clicked);
      } else {
        setSelectedEnd(clicked);
      }
    }
  };

  const handleMonthHover = (monthIdx: number | null) => {
    if (monthIdx === null) {
      setHoveredMonth(null);
      return;
    }
    if (selectedStart && !selectedEnd) {
      setHoveredMonth({year: viewYear, month: monthIdx});
    }
  };

  // ── Year selector ─────────────────────────────────────────────────────────
  const handleYearSelect = (year: number) => {
    setViewYear(year);
    setMode('months');
  };
  const toggleYearMode = () => {
    setYearPageStart(
      Math.floor((viewYear - MIN_YEAR) / YEARS_PER_PAGE) * YEARS_PER_PAGE + MIN_YEAR
    );
    setMode(m => m === 'years' ? 'months' : 'years');
  };

  // ── Apply / Clear ─────────────────────────────────────────────────────────
  const handleApply = () => {
    if (selectedStart && selectedEnd) {
      // Convertir a primer día del mes de inicio y último día del mes de fin
      const startDate = new Date(selectedStart.year, selectedStart.month, 1);
      const endDate = new Date(selectedEnd.year, selectedEnd.month + 1, 0); // Último día del mes
      onApply(startDate.toISOString(), endDate.toISOString());
      onClose();
    }
  };
  const handleClear = () => {
    setSelectedStart(null);
    setSelectedEnd(null);
    setHoveredMonth(null);
    onClear();
  };

  // ── Quick filters ─────────────────────────────────────────────────────────
  const handleQuickSelect = (type: 'last7' | 'last30' | 'thisMonth' | 'lastMonth') => {
    const now = new Date();
    let start: {year: number, month: number};
    let end: {year: number, month: number};

    switch (type) {
      case 'last7':
      case 'last30':
        // Para últimos 7/30 días, usamos el mes actual
        start = {year: now.getFullYear(), month: now.getMonth()};
        end = {year: now.getFullYear(), month: now.getMonth()};
        break;
      case 'thisMonth':
        start = {year: now.getFullYear(), month: now.getMonth()};
        end = {year: now.getFullYear(), month: now.getMonth()};
        break;
      case 'lastMonth':
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        start = {year: lastMonthYear, month: lastMonth};
        end = {year: lastMonthYear, month: lastMonth};
        break;
      default:
        return;
    }

    setSelectedStart(start);
    setSelectedEnd(end);
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const navBtnClass = (active: boolean) =>
    [
      'px-3 py-1 rounded-full text-sm transition-all',
      active
        ? 'bg-[#FF8000]/10 text-[#FF8000]'
        : 'bg-slate-100 text-slate-800 hover:bg-slate-200',
    ].join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="bg-white rounded-2xl border border-slate-100 w-[304px] select-none overflow-hidden"
      style={{
        boxShadow: '0 20px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── Quick Filters ── */}
      <div className="grid grid-cols-2 gap-2 px-4 pt-4 pb-3">
        {[
          { label: 'Últimos 7 días', value: 'last7' as const },
          { label: 'Últimos 30 días', value: 'last30' as const },
          { label: 'Este mes', value: 'thisMonth' as const },
          { label: 'Mes pasado', value: 'lastMonth' as const },
        ].map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => handleQuickSelect(filter.value)}
            className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm transition-all"
            style={{ fontWeight: 500 }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-slate-100 mx-4" />

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <button
          type="button"
          onClick={mode === 'months' ? goPrevYear : prevYearPage}
          className={[
            'w-8 h-8 flex items-center justify-center rounded-full transition-colors text-slate-500',
            mode === 'years'
              ? 'opacity-0 pointer-events-none'
              : 'hover:bg-slate-100 hover:text-slate-800',
          ].join(' ')}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {mode === 'years' ? (
            <span className="text-sm text-slate-800 px-2" style={{ fontWeight: 700 }}>
              Seleccionar año
            </span>
          ) : (
            <button
              type="button"
              onClick={toggleYearMode}
              className={navBtnClass(false)}
              style={{ fontWeight: 700 }}
            >
              {viewYear}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={mode === 'months' ? goNextYear : nextYearPage}
          className={[
            'w-8 h-8 flex items-center justify-center rounded-full transition-colors text-slate-500',
            mode === 'years'
              ? 'opacity-0 pointer-events-none'
              : 'hover:bg-slate-100 hover:text-slate-800',
          ].join(' ')}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Body ── */}
      <AnimatePresence mode="wait">

        {/* Months */}
        {mode === 'months' && (
          <motion.div
            key="months"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="grid grid-cols-3 gap-2 px-4 pb-4"
          >
            {MONTHS_SHORT.map((name, idx) => {
              const inRange = isMonthInRange(viewYear, idx);
              const isStart = isStartMonth(viewYear, idx);
              const isEnd = isEndMonth(viewYear, idx);
              const isEdge = isStart || isEnd;
              
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleMonthClick(idx)}
                  onMouseEnter={() => handleMonthHover(idx)}
                  onMouseLeave={() => handleMonthHover(null)}
                  className={[
                    'h-10 rounded-xl text-sm transition-all',
                    isEdge
                      ? 'bg-[#FF8000] text-white shadow-md shadow-[#FF8000]/25'
                      : inRange
                      ? 'bg-[#FF8000]/10 text-[#FF8000]'
                      : 'text-slate-700 hover:bg-orange-50 hover:text-[#FF8000]',
                  ].join(' ')}
                  style={{ fontWeight: isEdge ? 700 : 500 }}
                >
                  {name}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Years */}
        {mode === 'years' && (
          <motion.div
            key="years"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="grid grid-cols-4 gap-2 px-4 pb-4"
          >
            {yearsOnPage.map((year) => {
              const isActive = year === viewYear;
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearSelect(year)}
                  className={[
                    'h-10 rounded-xl text-sm transition-all',
                    isActive
                      ? 'bg-[#FF8000] text-white shadow-md shadow-[#FF8000]/25'
                      : 'text-slate-700 hover:bg-orange-50 hover:text-[#FF8000]',
                  ].join(' ')}
                  style={{ fontWeight: isActive ? 700 : 500 }}
                >
                  {year}
                </button>
              );
            })}
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── Footer ── */}
      <div className="h-px bg-slate-100 mx-4" />
      <div className="flex items-center gap-3 px-5 py-4">
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 py-2 rounded-full border border-slate-300 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          style={{ fontWeight: 600 }}
        >
          Limpiar
        </button>
        <button
          type="button"
          onClick={handleApply}
          disabled={!selectedStart || !selectedEnd}
          className={[
            'flex-1 py-2 rounded-full text-sm transition-all',
            selectedStart && selectedEnd
              ? 'bg-[#FF8000] text-white hover:bg-[#FF9119] shadow-md shadow-[#FF8000]/20 active:scale-95'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed',
          ].join(' ')}
          style={{ fontWeight: 600 }}
        >
          Aplicar
        </button>
      </div>
    </motion.div>
  );
}