import AuthTopBar from "../components/auth/AuthTopBar";
import SchematicBackdrop from "../components/auth/SchematicBackdrop";
import AuthCard from "../components/auth/AuthCard";
import SystemStatusPill from "../components/auth/SystemStatusPill";

export default function AuthPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0F0F0F] text-on-surface flex flex-col items-center justify-center">
      <SchematicBackdrop />
      <AuthTopBar />
      <main className="relative z-10 w-full max-w-[400px] px-gutter">
        <AuthCard />
      </main>
      <SystemStatusPill />
    </div>
  );
}
