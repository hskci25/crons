import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NAV_LINKS = [
  { label: "Challenges", to: "/questions" },
  { label: "Docs", href: "#" },
];

export default function TopNavBar() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant">
      <nav className="flex justify-between items-center h-12 px-margin max-w-container-max mx-auto">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="font-code-md text-code-md font-bold text-on-background tracking-tighter hover:text-primary transition-colors"
          >
            Crons
          </Link>
          <div className="hidden md:flex gap-6">
            {NAV_LINKS.map((link) =>
              "to" in link && link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-on-surface-variant font-code-md text-code-md hover:text-primary transition-all duration-150"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-on-surface-variant font-code-md text-code-md hover:text-primary transition-all duration-150"
                >
                  {link.label}
                </a>
              ),
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 min-h-[28px]">
          {loading ? null : user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden sm:inline text-on-surface-variant font-code-md text-code-md hover:text-primary transition-colors max-w-[180px] truncate"
                title={user.email ?? undefined}
              >
                {user.email}
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="px-4 py-1 border border-outline text-on-surface font-code-md text-code-md hover:bg-surface-container-low transition-all active:scale-95"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-1 border border-outline text-on-surface font-code-md text-code-md hover:bg-surface-container-low transition-all active:scale-95"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
