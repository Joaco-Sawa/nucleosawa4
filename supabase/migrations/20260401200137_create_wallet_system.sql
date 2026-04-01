/*
  # Wallet Points System

  1. New Tables
    - `wallet_movements`: Registro de todos los movimientos de puntos (ganancias, canjes, bonificaciones)
    - `wallet_expirations`: Seguimiento de puntos que vencerán

  2. Security
    - Enable RLS en ambas tablas
    - Usuarios solo pueden ver sus propios movimientos

  3. Indexes
    - Búsqueda rápida por user_id y fecha
    - Búsqueda por tipo de movimiento

  4. Important Notes
    - Cada movimiento es inmutable (solo insert, no update)
    - Los datos de puntos se consideran auditables
    - Soporte para múltiples razones de movimiento
*/

-- Create wallet_movements table
CREATE TABLE IF NOT EXISTS wallet_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('earning', 'redemption', 'transfer', 'bonus', 'deduction', 'expiration')),
  amount integer NOT NULL CHECK (amount > 0),
  balance_after integer NOT NULL DEFAULT 0,
  description text NOT NULL,
  reason text NOT NULL,
  category text DEFAULT 'general' CHECK (category IN ('general', 'challenge', 'promotion', 'survey', 'purchase', 'refund', 'store')),
  related_challenge_id uuid,
  related_product_id uuid,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wallet_expirations table
CREATE TABLE IF NOT EXISTS wallet_expirations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL CHECK (amount > 0),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  movement_id uuid REFERENCES wallet_movements(id) ON DELETE SET NULL,
  is_expired boolean DEFAULT false
);

-- Enable RLS on wallet_movements
ALTER TABLE wallet_movements ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own movements
CREATE POLICY "Users view own wallet movements"
  ON wallet_movements
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Enable RLS on wallet_expirations
ALTER TABLE wallet_expirations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own expirations
CREATE POLICY "Users view own wallet expirations"
  ON wallet_expirations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS wallet_movements_user_created_idx
  ON wallet_movements(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS wallet_movements_user_type_idx
  ON wallet_movements(user_id, type);

CREATE INDEX IF NOT EXISTS wallet_movements_user_category_idx
  ON wallet_movements(user_id, category);

CREATE INDEX IF NOT EXISTS wallet_movements_created_at_idx
  ON wallet_movements(created_at DESC);

CREATE INDEX IF NOT EXISTS wallet_expirations_user_expires_idx
  ON wallet_expirations(user_id, expires_at)
  WHERE is_expired = false;

-- Create function to calculate user total points
CREATE OR REPLACE FUNCTION get_user_total_points(p_user_id uuid)
RETURNS TABLE(total_points integer) AS $$
BEGIN
  RETURN QUERY
  SELECT COALESCE(
    (SELECT COALESCE(SUM(
      CASE 
        WHEN type IN ('earning', 'bonus', 'transfer') THEN amount
        WHEN type IN ('redemption', 'expiration') THEN -amount
        ELSE 0
      END
    ), 0) FROM wallet_movements WHERE user_id = p_user_id),
    0
  )::integer as total_points;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create function to get expiring points
CREATE OR REPLACE FUNCTION get_user_expiring_points(p_user_id uuid)
RETURNS TABLE(
  total_expiring integer,
  expires_at timestamptz,
  days_until_expiration integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(amount)::integer, 0) as total_expiring,
    MAX(expires_at) as expires_at,
    EXTRACT(DAY FROM (MAX(expires_at) - now()))::integer as days_until_expiration
  FROM wallet_expirations
  WHERE user_id = p_user_id
    AND is_expired = false
    AND expires_at > now();
END;
$$ LANGUAGE plpgsql STABLE;

-- Create function to get latest movements
CREATE OR REPLACE FUNCTION get_user_wallet_movements(
  p_user_id uuid,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  type text,
  amount integer,
  balance_after integer,
  description text,
  reason text,
  category text,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wallet_movements.id,
    wallet_movements.type,
    wallet_movements.amount,
    wallet_movements.balance_after,
    wallet_movements.description,
    wallet_movements.reason,
    wallet_movements.category,
    wallet_movements.created_at
  FROM wallet_movements
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;
