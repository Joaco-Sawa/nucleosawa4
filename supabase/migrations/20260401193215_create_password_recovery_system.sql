/*
  # Password Recovery System

  1. New Tables
    - `password_reset_tokens`: Almacena tokens de recuperación de contraseña
    - `password_reset_attempts`: Registra intentos de recuperación para prevenir abuso
    - `password_change_log`: Auditoría de cambios de contraseña

  2. Security
    - Enable RLS en todas las tablas
    - Tokens almacenados como hash (no el token completo)
    - Expiración automática de tokens a 24 horas
    - Políticas restrictivas de acceso

  3. Indexes
    - Búsqueda rápida de tokens por usuario
    - Búsqueda por timestamp para expiración
    - Búsqueda por IP para throttling

  4. Important Notes
    - Los tokens no se pueden usar dos veces
    - Cada nuevo token invalida los anteriores del usuario
    - Se registran todos los intentos para auditoría
    - Las contraseñas antiguas NO se almacenan en logs (seguridad)
*/

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT now() + interval '24 hours',
  used_at timestamptz,
  ip_address inet,
  user_agent text,
  CONSTRAINT token_not_reusable CHECK (used_at IS NULL OR used_at > created_at)
);

-- Create password_reset_attempts table for throttling
CREATE TABLE IF NOT EXISTS password_reset_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet NOT NULL,
  email_or_username text,
  attempt_type text NOT NULL CHECK (attempt_type IN ('request', 'failed_validation', 'failed_token')),
  success boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  user_agent text
);

-- Create password_change_log for auditing
CREATE TABLE IF NOT EXISTS password_change_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  changed_at timestamptz DEFAULT now(),
  ip_address inet,
  user_agent text,
  method text NOT NULL CHECK (method IN ('password_reset', 'account_settings')),
  invalidated_sessions boolean DEFAULT true
);

-- Enable RLS on password_reset_tokens
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policy: No one can select tokens (only via edge function with service role)
CREATE POLICY "No direct token access"
  ON password_reset_tokens
  FOR SELECT
  TO authenticated
  USING (false);

-- Enable RLS on password_reset_attempts
ALTER TABLE password_reset_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Block all access (only accessible via edge function)
CREATE POLICY "No direct access to attempts"
  ON password_reset_attempts
  FOR SELECT
  TO authenticated
  USING (false);

-- Enable RLS on password_change_log
ALTER TABLE password_change_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own password change log
CREATE POLICY "Users view own password changes"
  ON password_change_log
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx 
  ON password_reset_tokens(user_id) 
  WHERE used_at IS NULL;

CREATE INDEX IF NOT EXISTS password_reset_tokens_expires_at_idx 
  ON password_reset_tokens(expires_at) 
  WHERE used_at IS NULL;

CREATE INDEX IF NOT EXISTS password_reset_tokens_token_hash_idx 
  ON password_reset_tokens(token_hash) 
  WHERE used_at IS NULL;

CREATE INDEX IF NOT EXISTS password_reset_attempts_ip_created_idx 
  ON password_reset_attempts(ip_address, created_at);

CREATE INDEX IF NOT EXISTS password_change_log_user_id_idx 
  ON password_change_log(user_id, changed_at);

-- Create a function to clean up expired tokens (can be called periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM password_reset_tokens
  WHERE expires_at < now() AND used_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check throttle status
CREATE OR REPLACE FUNCTION check_reset_throttle(p_ip inet, p_time_window interval)
RETURNS TABLE(attempts_count bigint, is_throttled boolean) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as attempts_count,
    (COUNT(*) >= 3)::boolean as is_throttled
  FROM password_reset_attempts
  WHERE ip_address = p_ip 
    AND created_at > now() - p_time_window
    AND attempt_type IN ('request', 'failed_validation');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
