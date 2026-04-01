import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import logoDesafioSawa from '../assets/90d0b6e7e40ee202a8c067619d31d9c79731c384.png';
import logoSawa from '../assets/Logotipo_sawa_negro.png';
import '../styles/floating-label.css';

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="20"
    height="20"
    className="flex-shrink-0"
  >
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError('Correo electrónico o contraseña incorrectos');
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setForgotPasswordMessage('');
    setForgotPasswordLoading(true);

    const emailOrUsername = forgotPasswordEmail.trim();

    if (!emailOrUsername) {
      setForgotPasswordMessage('Por favor ingresa tu correo electrónico o nombre de usuario');
      setForgotPasswordLoading(false);
      return;
    }

    if (emailOrUsername.includes('@') && !validateEmail(emailOrUsername)) {
      setForgotPasswordMessage('Por favor ingresa un correo electrónico válido');
      setForgotPasswordLoading(false);
      return;
    }

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const apiUrl = `${supabaseUrl}/functions/v1/password-recovery`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request',
          email_or_username: emailOrUsername,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setForgotPasswordMessage('Se ha enviado un enlace de recuperación a tu correo electrónico. Verifica tu bandeja de entrada.');
        setForgotPasswordEmail('');
        setTimeout(() => {
          setIsForgotPassword(false);
          setForgotPasswordMessage('');
        }, 4000);
      } else if (response.status === 429) {
        setForgotPasswordMessage('Demasiados intentos. Por favor, intenta nuevamente en 15 minutos');
      } else {
        setForgotPasswordMessage('Si existe una cuenta con ese correo, recibirás un enlace de recuperación');
      }
    } catch (error) {
      console.error('Error:', error);
      setForgotPasswordMessage('Ocurrió un error. Por favor, intenta más tarde');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

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

          {!isForgotPassword ? (
            <>
              <div className="text-center mb-6 space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  Tus desafíos te esperan
                </h1>
                <p className="text-gray-600 text-sm">
                  Inicia sesión y revisa tus logros
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="floating-label-group">
                  <div className="relative">
                    <Mail className="floating-label-icon text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Correo electrónico"
                      required
                      className="floating-label-input"
                    />
                  </div>
                </div>

                <div className="floating-label-group">
                  <div className="relative">
                    <Lock className="floating-label-icon text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contraseña"
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

                {error && (
                  <div className="text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between mb-8">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-xs text-gray-900">Recordarme</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError('');
                    }}
                    className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF8000] hover:bg-[#FF9119] text-white py-3 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#FF8000]/25 mt-16 mb-6"
                >
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </button>

                <button
                  type="button"
                  className="w-full bg-white text-gray-700 py-3 rounded-full font-medium border border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md"
                >
                  <GoogleIcon />
                  Continuar con Google
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-6 space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  ¿Olvidaste tu contraseña?
                </h1>
                <p className="text-gray-600 text-sm">
                  Te enviaremos un enlace para recuperar tu contraseña
                </p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <div className="floating-label-group">
                  <div className="relative">
                    <Mail className="floating-label-icon text-gray-400" />
                    <input
                      type="text"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      placeholder="Correo electrónico o nombre de usuario"
                      required
                      className="floating-label-input"
                    />
                  </div>
                </div>

                {forgotPasswordMessage && (
                  <div className={`text-sm text-center p-3 rounded-lg flex items-start gap-2 ${
                    forgotPasswordMessage.includes('exitosamente') || forgotPasswordMessage.includes('enviado') || forgotPasswordMessage.includes('recibirás')
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {forgotPasswordMessage.includes('exitosamente') || forgotPasswordMessage.includes('enviado') || forgotPasswordMessage.includes('recibirás') ? (
                      <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    )}
                    <span>{forgotPasswordMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="w-full bg-[#FF8000] hover:bg-[#FF9119] text-white py-3 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#FF8000]/25 mt-6 mb-4"
                >
                  {forgotPasswordLoading ? 'Enviando...' : 'Enviar'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setForgotPasswordEmail('');
                    setForgotPasswordMessage('');
                  }}
                  className="w-full text-orange-500 hover:text-orange-600 py-2 rounded-full font-medium transition-colors text-sm"
                >
                  {'< Volver al inicio'}
                </button>
              </form>
            </>
          )}
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
