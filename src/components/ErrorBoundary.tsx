import { useRouteError, useNavigate, isRouteErrorResponse } from "react-router";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage: string;
  let errorStatus: number | undefined;
  let isNotFound = false;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || "Ha ocurrido un error";
    isNotFound = error.status === 404;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = "Ha ocurrido un error inesperado";
  }

  const handleGoHome = () => {
    navigate("/");
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-[#FF8000]" />
            </div>
          </div>

          {/* Error Status */}
          {errorStatus && (
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-2 bg-slate-100 rounded-full text-slate-600 font-semibold text-sm">
                Error {errorStatus}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-4">
            {isNotFound ? "Página no encontrada" : "¡Oops! Algo salió mal"}
          </h1>

          {/* Description */}
          <p className="text-slate-600 text-center mb-8 text-lg leading-relaxed">
            {isNotFound
              ? "La página que buscas no existe o ha sido movida."
              : "No te preocupes, estamos trabajando para solucionarlo."}
          </p>

          {/* Error Message (in development mode) */}
          {import.meta.env.DEV && (
            <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs font-mono text-slate-500 mb-1 font-semibold">
                Detalles técnicos (solo en desarrollo):
              </p>
              <p className="text-sm font-mono text-slate-700 break-all">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="bg-gradient-to-r from-[#FF8000] to-[#FF9933] hover:from-[#FF9933] hover:to-[#FFAD5B] text-white shadow-lg shadow-orange-500/30 h-12 px-8 rounded-xl font-semibold text-base transition-all hover:shadow-xl hover:scale-105"
            >
              <Home className="w-5 h-5 mr-2" />
              Ir al inicio
            </Button>

            <Button
              onClick={handleReload}
              variant="outline"
              className="border-2 border-slate-200 hover:border-[#FF8000] hover:bg-orange-50 text-slate-700 hover:text-[#FF8000] h-12 px-8 rounded-xl font-semibold text-base transition-all"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Recargar
            </Button>
          </div>

          {/* Helpful tip */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500 text-center">
              Si el problema persiste, intenta{" "}
              <button
                onClick={handleReload}
                className="text-[#FF8000] hover:text-[#FF9933] font-semibold underline"
              >
                recargar la página
              </button>{" "}
              o contacta con soporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
