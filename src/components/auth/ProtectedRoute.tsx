import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] text-on-surface-variant">
        <div className="flex items-center gap-3 font-code-md text-code-md">
          <span className="w-4 h-4 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
          Checking session…
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <>{children}</>;
}
