import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Eye, EyeOff, CheckCircle, AlertCircle, Check, X } from 'lucide-react';
import logoDesafioSawa from '../assets/90d0b6e7e40ee202a8c067619d31d9c79731c384.png';
import logoSawa from '../assets/Logotipo_sawa_negro.png';
import '../styles/floating-label.css';

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export default function PasswordReset() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('error');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [closeSessions, setCloseSessions] = useState(true);

  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    { label: 'Mínimo 8 caracteres', met: false },
    { label: 'Mayúsculas (A-Z)', met: false },
    { label: 'Minúsculas (a-z)', met: false },
    { label: 'Números (0-9)', met: false },
  ]);

  useEffect(() => {
    if (!token || !email) {
      setMessage('Enlace inválido o expirado');
      setMessageType('error');
    }
  }, [token, email]);

  useEffect(() => {
    const updateRequirements = () => {
      setRequirements([
        { label: 'Mínimo 8 caracteres', met: newPassword.length >= 8 },
        { label: 'Mayúsculas (A-Z)', met: /[A-Z]/.test(newPassword) },
        { label: 'Minúsculas (a-z)', met: /[a-z]/.test(newPassword) },
        { label: 'Números (0-9)', met: /\d/.test(newPassword) },
      ]);
    };

    updateRequirements();
  }, [newPassword]);

  const isPasswordStrong = requirements.filter(r => r.met).length >= 3 && newPassword.length >= 8;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmit = isPasswordStrong && passwordsMatch && !loading;

  const getPasswordStrengthColor = () => {
    const metCount = requirements.filter(r => r.met).length;
    if (metCount >= 4) return 'text-green-600';
    if (metCount >= 3) return 'text-orange-500';
    return 'text-red-600';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (!token || !email) {
      setMessage('Enlace inválido');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (!isPasswordStrong) {
      setMessage('La contraseña no cumple los requisitos de seguridad');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setMessage('Las contraseñas no coinciden');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const apiUrl = `${supabaseUrl}/functions/v1/password-recovery`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset',
          token,
          email,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('Tu contraseña ha sido cambiada exitosamente. Redirigiendo a inicio de sesión...');
        setMessageType('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else if (response.status === 401) {
        setMessage(data.message || 'El enlace ha expirado. Por favor solicita uno nuevo.');
        setMessageType('error');
      } else {
        setMessage(data.message || 'Error al cambiar la contraseña');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Ocurrió un error. Por favor intenta nuevamente');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="flex flex-col items-center gap-6 relative mt-8 md:mt-0">
          <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex justify-center mb-4">
              <img
                src={logoDesafioSawa}
                alt="Desafío Sawa"
                className="h-16 w-auto"
              />
            </div>

            <div className="text-center mb-6 space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Enlace no válido
              </h1>
              <p className="text-gray-600 text-sm">
                El enlace de recuperación es inválido o ha expirado
              </p>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#FF8000] hover:bg-[#FF9119] text-white py-3 rounded-full font-semibold transition-all shadow-md shadow-[#FF8000]/25"
            >
              Volver a inicio de sesión
            </button>
          </div>

          <a
            href="https://sawa.cl/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-center text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            Powered by
            <img
              src={logoSawa}
              alt="SAWA"
              className="h-4 w-auto"
            />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="flex flex-col items-center gap-6 relative mt-8 md:mt-0">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex justify-center mb-4">
            <img
              src={logoDesafioSawa}
              alt="Desafío Sawa"
              className="h-16 w-auto"
            />
          </div>

          <div className="text-center mb-6 space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Establece tu nueva contraseña
            </h1>
            <p className="text-gray-600 text-sm">
              Por favor elige una contraseña segura para tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="floating-label-group">
              <div className="relative">
                <Eye className="floating-label-icon text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  required
                  className="floating-label-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="floating-label-toggle"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="floating-label-group">
              <div className="relative">
                <Eye className="floating-label-icon text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmar contraseña"
                  required
                  className="floating-label-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="floating-label-toggle"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {newPassword && (
              <div className="space-y-2 pt-2">
                <div className="space-y-1">
                  {requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {req.met ? (
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-red-400 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${req.met ? 'text-green-700' : 'text-gray-500'}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {confirmPassword && (
              <div className={`text-sm p-2 rounded flex items-center gap-2 ${
                passwordsMatch
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {passwordsMatch ? (
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                )}
                <span>
                  {passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                </span>
              </div>
            )}

            {message && (
              <div className={`text-sm p-3 rounded-lg flex items-start gap-2 ${
                messageType === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {messageType === 'success' ? (
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                )}
                <span>{message}</span>
              </div>
            )}

            <label className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={closeSessions}
                onChange={(e) => setCloseSessions(e.target.checked)}
                className="h-4 w-4 text-orange-500 rounded"
              />
              <span className="text-xs text-gray-600">
                Cerrar sesión en otros dispositivos
              </span>
            </label>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-[#FF8000] hover:bg-[#FF9119] text-white py-3 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#FF8000]/25 mt-6 mb-4"
            >
              {loading ? 'Cambiando contraseña...' : 'Cambiar contraseña'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full text-orange-500 hover:text-orange-600 py-2 rounded-full font-medium transition-colors text-sm"
            >
              Volver a inicio de sesión
            </button>
          </form>
        </div>

        <a
          href="https://sawa.cl/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-center text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        >
          Powered by
          <img
            src={logoSawa}
            alt="SAWA"
            className="h-4 w-auto"
          />
        </a>
      </div>
    </div>
  );
}
