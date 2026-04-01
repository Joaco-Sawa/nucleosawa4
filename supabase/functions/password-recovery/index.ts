import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  action: "request" | "validate" | "reset";
  email_or_username?: string;
  token?: string;
  email?: string;
  new_password?: string;
  confirm_password?: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  code?: string;
}

interface SuccessResponse {
  success: true;
  message: string;
  data?: unknown;
}

type ApiResponse = ErrorResponse | SuccessResponse;

// Security: Hash token to store in database (not the original token)
async function hashToken(token: string): Promise<string> {
  const encoded = new TextEncoder().encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate secure random token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

// Validate email format
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Mínimo 8 caracteres");
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+=\[\]{};:'",.<>?/\\|-]/.test(
    password
  );

  const complexityCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars].filter(
    (x) => x
  ).length;

  if (complexityCount < 3) {
    errors.push(
      "Debe contener al menos 3 de: mayúsculas, minúsculas, números, caracteres especiales"
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Check if IP is throttled
async (
  supabaseClient: ReturnType<typeof createClient>,
  ipAddress: string
): Promise<{ throttled: boolean; remaining_time_ms?: number }> => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const { data, error } = await supabaseClient
    .from("password_reset_attempts")
    .select("id")
    .eq("ip_address", ipAddress)
    .gt("created_at", fiveMinutesAgo)
    .eq("attempt_type", "request");

  if (error) {
    console.error("Error checking throttle:", error);
    return { throttled: false };
  }

  const attemptCount = data?.length || 0;

  if (attemptCount >= 5) {
    const oldestAttempt = new Date(
      Date.now() - 5 * 60 * 1000
    ).getTime();
    const remaining = 5 * 60 * 1000 - (Date.now() - oldestAttempt);
    return { throttled: true, remaining_time_ms: remaining };
  }

  return { throttled: false };
};

// Main handler
Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const body: RequestBody = await req.json();
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    // STEP 1: REQUEST PASSWORD RESET TOKEN
    if (body.action === "request") {
      const emailOrUsername = body.email_or_username?.trim().toLowerCase();

      if (!emailOrUsername) {
        const response: ErrorResponse = {
          success: false,
          message: "Por favor ingresa tu correo electrónico o nombre de usuario",
          code: "EMPTY_INPUT",
        };
        return new Response(JSON.stringify(response), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check throttle
      const fiveMinutesAgo = new Date(
        Date.now() - 5 * 60 * 1000
      ).toISOString();
      const { count: recentAttempts } = await supabase
        .from("password_reset_attempts")
        .select("*", { count: "exact", head: true })
        .eq("ip_address", clientIp)
        .gt("created_at", fiveMinutesAgo)
        .eq("attempt_type", "request");

      if ((recentAttempts || 0) >= 5) {
        await supabase.from("password_reset_attempts").insert({
          ip_address: clientIp,
          email_or_username: emailOrUsername,
          attempt_type: "request",
          success: false,
        });

        const response: ErrorResponse = {
          success: false,
          message:
            "Demasiados intentos. Por favor, intenta nuevamente en 15 minutos",
          code: "THROTTLED",
        };
        return new Response(JSON.stringify(response), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Simulate timing for security (prevent timing attacks)
      const startTime = Date.now();

      // Search for user by email or username
      let user = null;

      if (validateEmail(emailOrUsername)) {
        const { data } = await supabase.auth.admin.listUsers();
        user = data.users?.find(
          (u: any) => u.email?.toLowerCase() === emailOrUsername
        );
      } else {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, user_id")
          .eq("username", emailOrUsername)
          .single();

        if (profiles) {
          const { data } = await supabase.auth.admin.getUserById(profiles.user_id);
          user = data.user;
        }
      }

      // Ensure consistent response time (security)
      const elapsedTime = Date.now() - startTime;
      const minimumTime = 500; // milliseconds
      if (elapsedTime < minimumTime) {
        await new Promise((resolve) =>
          setTimeout(resolve, minimumTime - elapsedTime)
        );
      }

      // Log attempt
      await supabase.from("password_reset_attempts").insert({
        ip_address: clientIp,
        email_or_username: emailOrUsername,
        attempt_type: "request",
        success: user ? true : false,
      });

      // Always return generic success message (security: don't reveal if user exists)
      const response: SuccessResponse = {
        success: true,
        message:
          "Si existe una cuenta con ese correo, recibirás un enlace de recuperación en pocos minutos",
      };

      if (!user) {
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Generate token
      const token = generateToken();
      const tokenHash = await hashToken(token);

      // Invalidate previous tokens
      await supabase
        .from("password_reset_tokens")
        .update({ used_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .is("used_at", null);

      // Create new token
      const { error: insertError } = await supabase
        .from("password_reset_tokens")
        .insert({
          user_id: user.id,
          token_hash: tokenHash,
          ip_address: clientIp,
          user_agent: req.headers.get("user-agent"),
        });

      if (insertError) {
        console.error("Error creating token:", insertError);
        const errorResponse: ErrorResponse = {
          success: false,
          message: "Error al procesar tu solicitud. Por favor intenta nuevamente",
          code: "TOKEN_CREATE_ERROR",
        };
        return new Response(JSON.stringify(errorResponse), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Build recovery link (client URL should be passed in env)
      const clientUrl = Deno.env.get("CLIENT_URL") || "https://app.desafiosawa.com";
      const resetLink = `${clientUrl}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email || "")}`;

      // TODO: Send email with recovery link
      // For now, return token in response (NOT FOR PRODUCTION)
      console.log("Recovery link:", resetLink);

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // STEP 2: VALIDATE TOKEN
    if (body.action === "validate") {
      if (!body.token || !body.email) {
        const response: ErrorResponse = {
          success: false,
          message: "Parámetros inválidos",
          code: "INVALID_PARAMS",
        };
        return new Response(JSON.stringify(response), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const tokenHash = await hashToken(body.token);

      // Find token record
      const { data: tokenRecord, error: findError } = await supabase
        .from("password_reset_tokens")
        .select("user_id, expires_at, used_at")
        .eq("token_hash", tokenHash)
        .single();

      if (findError || !tokenRecord) {
        // Log failed validation
        await supabase.from("password_reset_attempts").insert({
          ip_address: clientIp,
          email_or_username: body.email,
          attempt_type: "failed_token",
          success: false,
        });

        const response: ErrorResponse = {
          success: false,
          message: "El enlace de recuperación no es válido o ha expirado",
          code: "INVALID_TOKEN",
        };
        return new Response(JSON.stringify(response), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if token is expired
      if (new Date(tokenRecord.expires_at) < new Date()) {
        await supabase.from("password_reset_attempts").insert({
          ip_address: clientIp,
          email_or_username: body.email,
          attempt_type: "failed_token",
          success: false,
        });

        const response: ErrorResponse = {
          success: false,
          message: "El enlace ha expirado. Por favor solicita uno nuevo",
          code: "TOKEN_EXPIRED",
        };
        return new Response(JSON.stringify(response), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if token was already used
      if (tokenRecord.used_at) {
        await supabase.from("password_reset_attempts").insert({
          ip_address: clientIp,
          email_or_username: body.email,
          attempt_type: "failed_token",
          success: false,
        });

        const response: ErrorResponse = {
          success: false,
          message: "Este enlace ya fue utilizado. Solicita uno nuevo",
          code: "TOKEN_ALREADY_USED",
        };
        return new Response(JSON.stringify(response), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const response: SuccessResponse = {
        success: true,
        message: "Token válido",
        data: { user_id: tokenRecord.user_id },
      };
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // STEP 3: RESET PASSWORD
    if (body.action === "reset") {
      if (!body.token || !body.email || !body.new_password || !body.confirm_password) {
        const response: ErrorResponse = {
          success: false,
          message: "Parámetros inválidos",
          code: "INVALID_PARAMS",
        };
        return new Response(JSON.stringify(response), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate password match
      if (body.new_password !== body.confirm_password) {
        const response: ErrorResponse = {
          success: false,
          message: "Las contraseñas no coinciden",
          code: "PASSWORD_MISMATCH",
        };
        return new Response(JSON.stringify(response), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate password strength
      const passwordValidation = validatePasswordStrength(body.new_password);
      if (!passwordValidation.valid) {
        const response: ErrorResponse = {
          success: false,
          message: passwordValidation.errors.join(". "),
          code: "WEAK_PASSWORD",
        };
        return new Response(JSON.stringify(response), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Validate token again
      const tokenHash = await hashToken(body.token);
      const { data: tokenRecord, error: findError } = await supabase
        .from("password_reset_tokens")
        .select("user_id, expires_at, used_at")
        .eq("token_hash", tokenHash)
        .single();

      if (findError || !tokenRecord) {
        const response: ErrorResponse = {
          success: false,
          message: "Token inválido",
          code: "INVALID_TOKEN",
        };
        return new Response(JSON.stringify(response), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (new Date(tokenRecord.expires_at) < new Date() || tokenRecord.used_at) {
        const response: ErrorResponse = {
          success: false,
          message: "El enlace ha expirado",
          code: "TOKEN_EXPIRED",
        };
        return new Response(JSON.stringify(response), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update user password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        tokenRecord.user_id,
        {
          password: body.new_password,
        }
      );

      if (updateError) {
        console.error("Error updating password:", updateError);
        const response: ErrorResponse = {
          success: false,
          message: "Error al cambiar la contraseña. Por favor intenta nuevamente",
          code: "PASSWORD_UPDATE_ERROR",
        };
        return new Response(JSON.stringify(response), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Mark token as used
      await supabase
        .from("password_reset_tokens")
        .update({ used_at: new Date().toISOString() })
        .eq("token_hash", tokenHash);

      // Log password change
      await supabase.from("password_change_log").insert({
        user_id: tokenRecord.user_id,
        ip_address: clientIp,
        user_agent: req.headers.get("user-agent"),
        method: "password_reset",
      });

      const response: SuccessResponse = {
        success: true,
        message: "Tu contraseña ha sido cambiada exitosamente",
      };
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Invalid action
    const response: ErrorResponse = {
      success: false,
      message: "Acción no válida",
      code: "INVALID_ACTION",
    };
    return new Response(JSON.stringify(response), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unhandled error:", error);
    const response: ErrorResponse = {
      success: false,
      message: "Error interno del servidor",
      code: "INTERNAL_ERROR",
    };
    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
