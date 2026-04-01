import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// ── Constants ────────────────────────────────────────────────────────────────
const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const MONTHS_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];
const DAY_HEADERS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const MIN_YEAR = 1940;
const YEARS_PER_PAGE = 16;

// ── Helpers ──────────────────────────────────────────────────────────────────
const parseISO = (iso: string) => {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
};

const toISO = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

/** ISO → "DD-MM-AAAA" for input display */
const isoToDisplay = (iso: string) => {
  const p = parseISO(iso);
  if (!p) return '';
  return `${String(p.day).padStart(2, '0')}-${String(p.month + 1).padStart(2, '0')}-${p.year}`;
};

/** "DD-MM-AAAA" → ISO if valid, null otherwise */
const displayToISO = (display: string, maxDate?: string): string | null => {
  if (display.length !== 10) return null;
  const [ddStr, mmStr, yyyyStr] = display.split('-');
  const d = parseInt(ddStr, 10);
  const m = parseInt(mmStr, 10);
  const y = parseInt(yyyyStr, 10);
  if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
  if (m < 1 || m > 12 || d < 1 || d > 31 || y < MIN_YEAR) return null;
  // JS Date validation (handles Feb 30, etc.)
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  const iso = toISO(y, m - 1, d);
  if (maxDate && iso > maxDate) return null;
  return iso;
};

/**
 * Auto-masks raw input to DD-MM-AAAA.
 * Strips non-digits, then inserts hyphens at positions 2 and 4 (of digits).
 */
const maskInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  let result = digits.slice(0, 2);
  if (digits.length > 2) result += '-' + digits.slice(2, 4);
  if (digits.length > 4) result += '-' + digits.slice(4, 8);
  return result;
};

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

type Mode = 'days' | 'months' | 'years';

// ── Props ────────────────────────────────────────────────────────────────────
interface DatePickerProps {
  value: string;          // ISO YYYY-MM-DD or ''
  onChange: (date: string) => void;
  maxDate?: string;
  disabled?: boolean;
  hasError?: boolean;
  placeholder?: string;
}

// ── Component ────────────────────────────────────────────────────────────────
export function DatePicker({
  value,
  onChange,
  maxDate,
  disabled = false,
  hasError = false,
}: DatePickerProps) {
  const today = new Date();
  const maxYear = today.getFullYear();
  const parsed = parseISO(value);

  // ── State ─────────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('days');

  // Committed ISO (passed to parent on Apply)
  const [tempISO, setTempISO] = useState(value);

  // Text currently in the input
  const [rawInput, setRawInput] = useState(() => isoToDisplay(value));

  // Inline validation error for the text input
  const [inputError, setInputError] = useState('');

  // Calendar view
  const [viewYear, setViewYear]   = useState(parsed?.year  ?? maxYear - 25);
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? today.getMonth());
  const [yearPageStart, setYearPageStart] = useState(
    Math.floor(((parsed?.year ?? maxYear - 25) - MIN_YEAR) / YEARS_PER_PAGE)
    * YEARS_PER_PAGE + MIN_YEAR
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  // ── Sync when value prop changes externally ───────────────────────────────
  useEffect(() => {
    setTempISO(value);
    const p = parseISO(value);
    if (p) {
      setViewYear(p.year);
      setViewMonth(p.month);
      setRawInput(isoToDisplay(value));
    } else {
      setRawInput('');
    }
    setInputError('');
  }, [value]);

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setMode('days');
        // Revert uncommitted calendar selection to last confirmed value
        setTempISO(value);
        if (!inputError) setRawInput(isoToDisplay(value));
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, value, inputError]);

  // ── Input change handler ──────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskInput(e.target.value);
    setRawInput(masked);

    if (masked.length < 10) {
      setInputError('');
      return;
    }

    // Full 10-char string — validate
    const iso = displayToISO(masked, maxDate);
    if (!iso) {
      setInputError('Ingresa una fecha válida en formato DD-MM-AAAA');
      setTempISO('');
      return;
    }

    // Valid date — update calendar view
    const p = parseISO(iso)!;
    setInputError('');
    setTempISO(iso);
    setViewYear(p.year);
    setViewMonth(p.month);
  };

  const handleInputFocus = () => {
    if (!disabled) setIsOpen(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setIsOpen(false); setMode('days'); }
  };

  // ── Month nav ─────────────────────────────────────────────────────────────
  const goPrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const goNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // ── Year page nav ─────────────────────────────────────────────────────────
  const prevYearPage = () =>
    setYearPageStart(s => Math.max(MIN_YEAR, s - YEARS_PER_PAGE));
  const nextYearPage = () =>
    setYearPageStart(s => s + YEARS_PER_PAGE <= maxYear ? s + YEARS_PER_PAGE : s);

  const yearsOnPage = Array.from(
    { length: YEARS_PER_PAGE },
    (_, i) => yearPageStart + i
  ).filter(y => y >= MIN_YEAR && y <= maxYear);

  // ── Day helpers ───────────────────────────────────────────────────────────
  const isSelected = (day: number) => {
    const p = parseISO(tempISO);
    return !!p && p.year === viewYear && p.month === viewMonth && p.day === day;
  };
  const isDayDisabled = (day: number) => {
    if (!maxDate) return false;
    return toISO(viewYear, viewMonth, day) > maxDate;
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  // ── Calendar day click ────────────────────────────────────────────────────
  const handleDayClick = (day: number) => {
    if (isDayDisabled(day)) return;
    const iso = toISO(viewYear, viewMonth, day);
    setTempISO(iso);
    setRawInput(isoToDisplay(iso));
    setInputError('');
  };

  // ── Month / Year selectors ────────────────────────────────────────────────
  const handleMonthSelect = (monthIdx: number) => {
    setViewMonth(monthIdx);
    setMode('days');
  };
  const handleYearSelect = (year: number) => {
    setViewYear(year);
    setMode('days');
  };
  const toggleMonthMode = () =>
    setMode(m => m === 'months' ? 'days' : 'months');
  const toggleYearMode = () => {
    setYearPageStart(
      Math.floor((viewYear - MIN_YEAR) / YEARS_PER_PAGE) * YEARS_PER_PAGE + MIN_YEAR
    );
    setMode(m => m === 'years' ? 'days' : 'years');
  };

  // ── Apply / Clear ─────────────────────────────────────────────────────────
  const handleApply = () => {
    if (tempISO) onChange(tempISO);
    setIsOpen(false);
    setMode('days');
  };
  const handleClear = () => {
    setTempISO('');
    setRawInput('');
    setInputError('');
    onChange('');
    setIsOpen(false);
    setMode('days');
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const showError = hasError || !!inputError;
  const inputClass = [
    'w-full pl-10 pr-4 h-[44px] rounded-lg border text-sm transition-all focus:outline-none',
    disabled
      ? 'bg-slate-50/40 border-slate-200 text-slate-500 cursor-default'
      : showError
      ? 'bg-red-50/40 border-red-400 text-slate-900 focus:ring-2 focus:ring-red-400/20'
      : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300 focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000]',
  ].join(' ');

  const navBtnClass = (active: boolean) =>
    [
      'px-3 py-1 rounded-full text-sm transition-all',
      active
        ? 'bg-[#FF8000]/10 text-[#FF8000]'
        : 'bg-slate-100 text-slate-800 hover:bg-slate-200',
    ].join(' ');

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative">

      {/* ── Text input ── */}
      <div className="relative">
        <Calendar
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10"
        />
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={rawInput}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          disabled={disabled}
          placeholder="DD-MM-AAAA"
          maxLength={10}
          className={inputClass}
          style={{ fontFamily: "'Nunito', sans-serif" }}
        />
      </div>

      {/* Inline error */}
      {inputError && (
        <p
          className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {inputError}
        </p>
      )}

      {/* ── Calendar panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl border border-slate-100 w-[304px] select-none overflow-hidden"
            style={{
              boxShadow: '0 20px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 pt-5 pb-3">
              <button
                type="button"
                onClick={mode === 'days' ? goPrev : mode === 'years' ? prevYearPage : undefined}
                className={[
                  'w-8 h-8 flex items-center justify-center rounded-full transition-colors text-slate-500',
                  mode === 'months'
                    ? 'opacity-0 pointer-events-none'
                    : 'hover:bg-slate-100 hover:text-slate-800',
                ].join(' ')}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {mode === 'years' ? (
                  <span className="text-sm text-slate-800 px-2" style={{ fontWeight: 700 }}>
                    {yearPageStart} – {Math.min(yearPageStart + YEARS_PER_PAGE - 1, maxYear)}
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={toggleMonthMode}
                      className={navBtnClass(mode === 'months')}
                      style={{ fontWeight: 700 }}
                    >
                      {MONTHS_ES[viewMonth]}
                    </button>
                    <button
                      type="button"
                      onClick={toggleYearMode}
                      className={navBtnClass(false)}
                      style={{ fontWeight: 700 }}
                    >
                      {viewYear}
                    </button>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={mode === 'days' ? goNext : mode === 'years' ? nextYearPage : undefined}
                className={[
                  'w-8 h-8 flex items-center justify-center rounded-full transition-colors text-slate-500',
                  mode === 'months'
                    ? 'opacity-0 pointer-events-none'
                    : yearPageStart + YEARS_PER_PAGE > maxYear && mode === 'years'
                    ? 'opacity-30 pointer-events-none'
                    : 'hover:bg-slate-100 hover:text-slate-800',
                ].join(' ')}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* ── Body ── */}
            <AnimatePresence mode="wait">

              {/* Days */}
              {mode === 'days' && (
                <motion.div
                  key="days"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                >
                  <div className="grid grid-cols-7 px-4 mb-1">
                    {DAY_HEADERS.map((d, i) => (
                      <div
                        key={i}
                        className="h-8 flex items-center justify-center text-[11px] text-slate-400"
                        style={{ fontWeight: 600 }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 px-4 pb-3">
                    {cells.map((day, i) => (
                      <div key={i} className="h-9 flex items-center justify-center">
                        {day !== null && (
                          <button
                            type="button"
                            disabled={isDayDisabled(day)}
                            onClick={() => handleDayClick(day)}
                            className={[
                              'w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all',
                              isSelected(day)
                                ? 'bg-[#FF8000] text-white shadow-md shadow-[#FF8000]/30'
                                : isDayDisabled(day)
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-700 hover:bg-orange-50 hover:text-[#FF8000] cursor-pointer',
                            ].join(' ')}
                            style={{ fontWeight: isSelected(day) ? 700 : 400 }}
                          >
                            {day}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

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
                    const isActive = idx === viewMonth;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleMonthSelect(idx)}
                        className={[
                          'h-10 rounded-xl text-sm transition-all',
                          isActive
                            ? 'bg-[#FF8000] text-white shadow-md shadow-[#FF8000]/25'
                            : 'text-slate-700 hover:bg-orange-50 hover:text-[#FF8000]',
                        ].join(' ')}
                        style={{ fontWeight: isActive ? 700 : 500 }}
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
                disabled={!tempISO}
                className={[
                  'flex-1 py-2 rounded-full text-sm transition-all',
                  tempISO
                    ? 'bg-[#FF8000] text-white hover:bg-[#FF9119] shadow-md shadow-[#FF8000]/20 active:scale-95'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed',
                ].join(' ')}
                style={{ fontWeight: 600 }}
              >
                Aplicar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
