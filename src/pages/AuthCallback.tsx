import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const errorDescription = params.get("error_description") ?? params.get("error");
    if (errorDescription) {
      navigate(`/auth?error=${encodeURIComponent(errorDescription)}`, {
        replace: true,
      });
      return;
    }

    navigate(session ? "/dashboard" : "/auth?error=signin_failed", {
      replace: true,
    });
  }, [loading, session, params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] text-on-surface">
      <div className="flex items-center gap-3 font-code-md text-code-md text-on-surface-variant">
        <span className="w-4 h-4 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
        Completing sign-in…
      </div>
    </div>
  );
}
