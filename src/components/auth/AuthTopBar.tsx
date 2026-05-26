import { Link } from "react-router-dom";

export default function AuthTopBar() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-margin z-50">
      <Link
        to="/"
        className="font-code-md text-headline-lg font-bold text-on-background tracking-tighter hover:text-primary transition-colors"
      >
        CRONS
      </Link>
      <div className="hidden md:flex items-center gap-gutter font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest opacity-50">
        Auth_Node // 01
      </div>
    </header>
  );
}
