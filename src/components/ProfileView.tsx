import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Lock, ArrowRight, CheckCircle, Eye, EyeOff, AlertCircle, X, Camera,
  User, Calendar, Phone, Mail, ChevronLeft, HelpCircle, FileText, Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DatePicker } from './DatePicker';
import profileImage from '../assets/9f5aa0e583374b6893d8921a6183b99d788006eb.png';
import coinIcon from '../assets/db29ff4dc98462b3539ca31d029b8918fad5d4e6.png';
import logoDesafioSawa from '../assets/90d0b6e7e40ee202a8c067619d31d9c79731c384.png';
import catalogIcon from '../assets/a1d61e7aee26ae9e65cfcc5d4d13290cc8da135b.png';
import walletIcon from '../assets/f53abab596a88a7dbe37a1de9340df1fc709bfa0.png';
import shoppingBagIcon from '../assets/5430a27800876129e7c102990a58d556b6b36a63.png';

interface ProfileViewProps {
  userPoints: number;
}

// ── Validation helpers ───────────────────────────────────────────────────────
const validatePhone = (v: string) =>
  /^\+56\s?9\s?\d{4}\s?\d{4}$/.test(v.trim());

const REQUIRED_MSG = 'Este campo es obligatorio';

// ── FieldError ───────────────────────────────────────────────────────────────
function FieldError({ message }: { message: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18 }}
      className="flex items-start gap-1.5 mt-1.5 text-xs text-red-500"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
      {message}
    </motion.p>
  );
}

// ── ProfileView ──────────────────────────────────────────────────────────────
export function ProfileView({ userPoints }: ProfileViewProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isEditing, setIsEditing]           = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  // ── Form data ─────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    nombre:           'Carlos Toledo',
    fechaNacimiento:  '1990-03-15',
    telefono:         '+56 9 8765 4321',
    correo:           'carlos.toledo@empresa.com',
  });

  // ── Field errors ──────────────────────────────────────────────────────────
  const [nombreError, setNombreError] = useState('');
  const [fechaError,  setFechaError]  = useState('');
  const [phoneError,  setPhoneError]  = useState('');

  // ── Password section ──────────────────────────────────────────────────────
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ nueva: '', confirmar: '' });
  const [passwordErrors, setPasswordErrors] = useState({
    nueva:     '',
    confirmar: '',
  });
  const [showPasswords, setShowPasswords] = useState({ nueva: false, confirmar: false });

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerToast = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setShowToast(true);
    toastTimer.current = setTimeout(() => setShowToast(false), 3000);
  };

  // ── Form validity ─────────────────────────────────────────────────────────
  const isFormValid =
    formData.nombre.trim()        !== '' && !nombreError &&
    formData.fechaNacimiento      !== '' && !fechaError  &&
    formData.telefono.trim()      !== '' && !phoneError;

  // ── Blur handlers ─────────────────────────────────────────────────────────
  const handleNombreBlur = () => {
    if (!formData.nombre.trim()) setNombreError(REQUIRED_MSG);
  };

  const handleTelefonoBlur = () => {
    if (!formData.telefono.trim()) {
      setPhoneError(REQUIRED_MSG);
    } else if (!validatePhone(formData.telefono)) {
      setPhoneError('Ingresa un número de teléfono válido (ej: +56 9 1234 5678)');
    }
  };

  const handleFechaBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (!formData.fechaNacimiento) setFechaError(REQUIRED_MSG);
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setNombreError('');
    setFechaError('');
    setPhoneError('');
    setShowPasswordForm(false);
    setPasswordData({ nueva: '', confirmar: '' });
    setPasswordErrors({ nueva: '', confirmar: '' });
  };

  const handleSave = () => {
    let hasErrors = false;

    if (!formData.nombre.trim()) {
      setNombreError(REQUIRED_MSG);
      hasErrors = true;
    } else if (nombreError) {
      hasErrors = true;
    }

    if (!formData.fechaNacimiento) {
      setFechaError(REQUIRED_MSG);
      hasErrors = true;
    } else if (fechaError) {
      hasErrors = true;
    }

    if (!formData.telefono.trim()) {
      setPhoneError(REQUIRED_MSG);
      hasErrors = true;
    } else if (!validatePhone(formData.telefono)) {
      setPhoneError('Ingresa un número de teléfono válido (ej: +56 9 1234 5678)');
      hasErrors = true;
    } else {
      setPhoneError('');
    }

    if (hasErrors) return;
    setIsEditing(false);
    triggerToast();
  };

  const handlePasswordSave = () => {
    const errs = { nueva: '', confirmar: '' };
    let hasErrors = false;
    if (passwordData.nueva.length < 8) {
      errs.nueva = 'La contraseña debe tener al menos 8 caracteres';
      hasErrors = true;
    }
    if (passwordData.confirmar !== passwordData.nueva) {
      errs.confirmar = 'Las contraseñas no coinciden. Inténtalo de nuevo';
      hasErrors = true;
    }
    setPasswordErrors(errs);
    if (hasErrors) return;
    setShowPasswordForm(false);
    setPasswordData({ nueva: '', confirmar: '' });
    setPasswordErrors({ nueva: '', confirmar: '' });
    triggerToast();
  };

  const handlePasswordCancel = () => {
    setShowPasswordForm(false);
    setPasswordData({ nueva: '', confirmar: '' });
    setPasswordErrors({ nueva: '', confirmar: '' });
  };

  const formatDateForDisplay = (iso: string) => {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  const getMaxDate = () => new Date().toISOString().split('T')[0];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // ── Input class helpers ───────────────────────────────────────────────────
  const inputBase =
    'w-full px-4 h-[44px] rounded-lg border text-slate-900 text-sm focus:outline-none focus:ring-2 transition-all';
  const inputNormal   = `${inputBase} border-slate-200 focus:ring-[#FF8000]/20 focus:border-[#FF8000] bg-white`;
  const inputError    = `${inputBase} border-red-400 bg-red-50/40 focus:ring-red-400/20 focus:border-red-400`;
  const inputDisabled = `${inputBase} border-slate-200 bg-slate-50/40`;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col min-w-0 w-full max-w-full md:h-[calc(100vh-1rem)] md:overflow-y-auto md:m-2 md:rounded-2xl overflow-y-auto overflow-x-hidden pb-24 md:pb-12"
    >

      {/* ── Toast ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-4 right-4 md:top-[88px] md:right-6 z-50 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 shadow-lg shadow-green-900/10 max-w-xs"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-500" />
            <span className="text-sm">Tus cambios fueron guardados correctamente</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-auto flex-shrink-0 text-green-400 hover:text-green-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Topbar Desktop ── */}
      <header
        className="hidden md:block bg-white/95 backdrop-blur-md transition-all duration-300 rounded-2xl sticky top-0 z-30 flex-shrink-0"
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)' }}
      >
        <div className="py-[25px] px-6">
          <div className="flex items-center justify-between gap-8">
            <div className="flex flex-col gap-0.5">
              <h1
                className="text-2xl text-slate-900 leading-tight"
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}
              >
                Mi perfil
              </h1>
              <p
                className="text-sm text-slate-600 leading-none"
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 400 }}
              >
                Gestiona tu información personal
              </p>
            </div>
            <div className="min-w-[140px] h-[52px] w-fit rounded-xl bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 hover:shadow-lg hover:shadow-[#FF8000]/30 transition-all duration-300 px-3 flex items-center gap-3 cursor-pointer flex-shrink-0">
              <img src={coinIcon} alt="Coin" className="w-8 h-8 flex-shrink-0" />
              <div className="flex flex-col pr-2">
                <div className="text-[10px] text-white font-medium opacity-90" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  Tus puntos
                </div>
                <div className="text-[20px] font-bold text-white leading-none" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800 }}>
                  {userPoints.toLocaleString('es-CL')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Topbar Mobile ── */}
      <header className="md:hidden bg-white flex-shrink-0">
        {/* flecha | logo | espacio flexible | chip */}
        <div className="px-[16px] py-3 flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <img src={logoDesafioSawa} alt="Desafío Sawa" className="h-10 object-contain flex-shrink-0" />

          <div className="flex-1" />

          <div className="px-3 py-2 rounded-full bg-gradient-to-b from-[#FFAD5B] to-[#FF8000] shadow-md shadow-[#FF8000]/20 flex items-center gap-2 flex-shrink-0">
            <img src={coinIcon} alt="Coin" className="w-6 h-6 flex-shrink-0" />
            <div className="flex flex-col">
              <div
                className="text-[9px] text-white opacity-90 tracking-wide leading-none"
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}
              >
                Tus puntos
              </div>
              <div
                className="text-base font-bold text-white leading-none mt-0.5"
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800 }}
              >
                {userPoints.toLocaleString('es-CL')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 pt-8 md:pt-12 pb-8 md:pb-12 w-full">

        {/* Título y subtítulo — solo mobile, fuera de la barra blanca */}
        <div className="md:hidden mb-6">
          <h1
            className="text-2xl text-slate-900 leading-tight mb-1"
            style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}
          >
            Mi perfil
          </h1>
          <p
            className="text-sm text-slate-500"
            style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 400 }}
          >
            Gestiona tu información personal
          </p>
        </div>

        {/* ── User Identity Card ── */}
        <div
          className="bg-white rounded-2xl p-5 md:p-7 mb-8 border border-slate-100"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)' }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6">
            <div
              className="relative group cursor-pointer focus:outline-none active:outline-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
              onMouseEnter={() => setIsHoveringAvatar(true)}
              onMouseLeave={() => setIsHoveringAvatar(false)}
              onClick={() => console.log('Open file picker')}
            >
              <img
                src={profileImage}
                alt="Carlos Toledo"
                className="w-20 h-20 rounded-full ring-2 ring-slate-200 object-cover flex-shrink-0 transition-all focus:outline-none active:outline-none"
              />
              <div className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center transition-opacity ${isHoveringAvatar ? 'opacity-100' : 'opacity-0'}`}>
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-0.5">Carlos Toledo</h2>
              <p className="text-sm text-slate-600 mb-0.5">carlos.toledo@empresa.com</p>
              <p className="text-xs text-slate-500">+56 9 8765 4321</p>
            </div>

            {!isEditing && (
              <button
                onClick={handleEdit}
                className="w-full md:w-auto px-5 py-2.5 bg-[#FF8000] hover:bg-[#FF9119] text-white rounded-full font-semibold text-sm transition-all shadow-md shadow-[#FF8000]/20 hover:shadow-lg hover:shadow-[#FF8000]/25 active:scale-95"
              >
                Editar perfil
              </button>
            )}
          </div>
        </div>

        {/* ── Información Personal ── */}
        <div
          className="bg-white rounded-2xl p-5 md:p-6 mb-8 border border-slate-100"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)' }}
        >
          <h3 className="text-base md:text-lg font-bold text-slate-900 mb-5">Información Personal</h3>

          <div className="space-y-4">

            {/* ── Nombre ── */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                <User className="w-4 h-4 flex-shrink-0" />
                Nombre
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => {
                  setFormData({ ...formData, nombre: e.target.value });
                  if (e.target.value.trim()) setNombreError('');
                  else setNombreError(REQUIRED_MSG);
                }}
                onBlur={handleNombreBlur}
                disabled={!isEditing}
                className={
                  !isEditing ? inputDisabled
                  : nombreError ? inputError
                  : inputNormal
                }
              />
              <AnimatePresence>
                {isEditing && nombreError && <FieldError key="nombre-err" message={nombreError} />}
              </AnimatePresence>
            </div>

            {/* ── Fecha de nacimiento ── */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                Fecha de nacimiento
              </label>
              {isEditing ? (
                <div onBlur={handleFechaBlur}>
                  <DatePicker
                    value={formData.fechaNacimiento}
                    onChange={(date) => {
                      setFormData({ ...formData, fechaNacimiento: date });
                      setFechaError(date ? '' : REQUIRED_MSG);
                    }}
                    maxDate={getMaxDate()}
                    hasError={!!fechaError}
                  />
                  <AnimatePresence>
                    {fechaError && <FieldError key="fecha-err" message={fechaError} />}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <input
                    type="text"
                    value={formatDateForDisplay(formData.fechaNacimiento)}
                    disabled
                    className={`${inputDisabled} pl-10`}
                  />
                </div>
              )}
            </div>

            {/* ── Teléfono ── */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                Teléfono
              </label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ ...formData, telefono: val });
                  if (!val.trim()) setPhoneError(REQUIRED_MSG);
                  else setPhoneError('');
                }}
                onBlur={handleTelefonoBlur}
                disabled={!isEditing}
                className={
                  !isEditing ? inputDisabled
                  : phoneError ? inputError
                  : inputNormal
                }
                placeholder="+56 9 1234 5678"
              />
              <AnimatePresence>
                {isEditing && phoneError && <FieldError key="phone-err" message={phoneError} />}
              </AnimatePresence>
            </div>

            {/* ── Correo (bloqueado) ── */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                Correo
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={formData.correo}
                  disabled
                  className="w-full pl-10 pr-4 h-[44px] rounded-lg border border-slate-200 bg-slate-100/60 text-slate-400 text-sm cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                El correo es gestionado por la empresa y no puede modificarse.
              </p>
            </div>
          </div>

          {/* ── Action buttons ── */}
          {isEditing && (
            <div className="flex flex-col md:flex-row gap-3 mt-6 pt-6 border-t border-slate-100">
              <button
                onClick={handleSave}
                disabled={!isFormValid}
                className={[
                  'w-full md:flex-1 px-5 py-2.5 bg-[#FF8000] text-white rounded-full font-semibold text-sm transition-all',
                  isFormValid
                    ? 'hover:bg-[#FF9119] shadow-md shadow-[#FF8000]/20 hover:shadow-lg hover:shadow-[#FF8000]/25 active:scale-95 cursor-pointer'
                    : 'opacity-40 cursor-not-allowed',
                ].join(' ')}
              >
                Guardar cambios
              </button>
              <button
                onClick={handleCancel}
                className="w-full md:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-full font-semibold text-sm transition-all active:scale-95"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* ── Contraseña ── */}
        <div
          className="bg-white rounded-2xl p-5 md:p-6 mb-8 border border-slate-100"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)' }}
        >
          <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3">Contraseña</h3>
          <p className="text-sm text-slate-600 mb-5">
            Mantén tu cuenta protegida actualizando tu contraseña regularmente.
          </p>

          <AnimatePresence mode="wait">
            {!showPasswordForm ? (
              <motion.div
                key="pw-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full md:w-auto px-5 py-2.5 bg-white hover:bg-orange-50 text-[#FF8000] border-2 border-[#FF8000] rounded-full font-semibold text-sm transition-all active:scale-95"
                >
                  Cambiar contraseña
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="pw-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-1">

                  {/* Nueva contraseña */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.nueva ? 'text' : 'password'}
                        value={passwordData.nueva}
                        onChange={(e) => {
                          setPasswordData({ ...passwordData, nueva: e.target.value });
                          if (passwordErrors.nueva)
                            setPasswordErrors({ ...passwordErrors, nueva: '' });
                        }}
                        placeholder="Mínimo 8 caracteres"
                        className={`${passwordErrors.nueva ? inputError : inputNormal} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, nueva: !showPasswords.nueva })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPasswords.nueva ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Requisitos en tiempo real */}
                    {(() => {
                      const v = passwordData.nueva;
                      const rules = [
                        { label: 'Al menos 8 caracteres de longitud', met: v.length >= 8 },
                        { label: 'Al menos un número',                met: /\d/.test(v) },
                        { label: 'Al menos un símbolo',               met: /[^a-zA-Z0-9]/.test(v) },
                      ];
                      return (
                        <ul className="mt-2 space-y-1.5">
                          {rules.map((r) => (
                            <li
                              key={r.label}
                              className={[
                                'flex items-center gap-1.5 text-xs transition-colors duration-200',
                                r.met ? 'text-green-600' : 'text-red-500',
                              ].join(' ')}
                              style={{ fontFamily: "'Nunito', sans-serif" }}
                            >
                              {r.met
                                ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                : <X className="w-3.5 h-3.5 flex-shrink-0" />
                              }
                              {r.label}
                            </li>
                          ))}
                        </ul>
                      );
                    })()}

                    <AnimatePresence>
                      {passwordErrors.nueva && (
                        <FieldError key="pw-nueva-err" message={passwordErrors.nueva} />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Confirmar contraseña */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirmar ? 'text' : 'password'}
                        value={passwordData.confirmar}
                        onChange={(e) => {
                          setPasswordData({ ...passwordData, confirmar: e.target.value });
                          if (passwordErrors.confirmar)
                            setPasswordErrors({ ...passwordErrors, confirmar: '' });
                        }}
                        placeholder="Repite tu nueva contraseña"
                        className={`${passwordErrors.confirmar ? inputError : inputNormal} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirmar: !showPasswords.confirmar })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPasswords.confirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {passwordErrors.confirmar && (
                        <FieldError key="pw-confirmar-err" message={passwordErrors.confirmar} />
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 pt-2">
                    <button
                      onClick={handlePasswordSave}
                      className="w-full md:flex-1 px-5 py-2.5 bg-[#FF8000] hover:bg-[#FF9119] text-white rounded-full font-semibold text-sm transition-all shadow-md shadow-[#FF8000]/20 hover:shadow-lg hover:shadow-[#FF8000]/25 active:scale-95"
                    >
                      Actualizar contraseña
                    </button>
                    <button
                      onClick={handlePasswordCancel}
                      className="w-full md:w-auto px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-full font-semibold text-sm transition-all active:scale-95"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Mi historial ── */}
        <div
          className="bg-white rounded-2xl p-5 md:p-6 mb-8 border border-slate-100"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)' }}
        >
          <h3 className="text-base md:text-lg font-bold text-slate-900 mb-5">Resumen de puntos</h3>

          <div className="grid grid-cols-3 gap-0 divide-x divide-slate-100">

            {/* Total ganado */}
            <div className="flex flex-col items-center px-3 md:px-5 first:pl-0 gap-1">
              <div className="flex items-center gap-1.5">
                <img src={coinIcon} alt="puntos" className="w-4 h-4 opacity-50 flex-shrink-0" />
                <span className="text-sm text-slate-900 leading-none" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 400 }}>
                  {(18500).toLocaleString('es-CL')}
                </span>
              </div>
              <span className="text-sm text-slate-600 leading-tight text-center" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 400 }}>
                Total<br />ganado
              </span>
            </div>

            {/* Puntos canjeados */}
            <div className="flex flex-col items-center px-3 md:px-5 gap-1">
              <div className="flex items-center gap-1.5">
                <img src={coinIcon} alt="puntos" className="w-4 h-4 flex-shrink-0 grayscale opacity-60" />
                <span className="text-sm text-slate-900 leading-none" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 400 }}>
                  {(3500).toLocaleString('es-CL')}
                </span>
              </div>
              <span className="text-sm text-slate-600 leading-tight text-center" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 400 }}>
                Puntos<br />canjeados
              </span>
            </div>

            {/* Puntos disponibles */}
            <div className="flex flex-col items-center px-3 md:px-5 last:pr-0 gap-1">
              <div className="flex items-center gap-1.5">
                <img src={coinIcon} alt="puntos" className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm text-[#FF8000] leading-none" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                  {userPoints.toLocaleString('es-CL')}
                </span>
              </div>
              <span className="text-sm text-slate-600 leading-tight text-center" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                Puntos<br />disponibles
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button className="text-sm font-medium text-slate-500 hover:text-[#FF8000] transition-colors inline-flex items-center gap-1.5 group">
              Ver más detalles
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* ── Ayuda y Términos ── */}
        <div
          className="md:hidden bg-white rounded-2xl mb-8 border border-slate-100 overflow-hidden"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)' }}
        >
          <button className="w-full flex items-center gap-2 px-5 py-3.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5 transition-all">
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            <span>Ayuda</span>
          </button>
          <div className="h-px bg-slate-100 mx-5" />
          <button className="w-full flex items-center gap-2 px-5 py-3.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-[#FF8000]/5 transition-all">
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span>Términos y condiciones</span>
          </button>
        </div>

        {/* ── Cerrar sesión ── */}
        <div className="mt-4 md:mt-6 mb-8 flex justify-center">
          <button
            onClick={handleLogout}
            className="px-16 py-2.5 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-full font-medium text-sm transition-all active:scale-95"
          >
            Cerrar sesión
          </button>
        </div>

      </div>

    </motion.div>
  );
}