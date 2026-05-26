import GoogleButton from "./GoogleButton";

export default function AuthCard() {
  return (
    <div className="relative bg-surface-container-low border border-surface-container-high p-10 overflow-hidden shadow-2xl animate-fade-in-up">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(18,16,16,0) 50%, rgba(0,0,0,0.1) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      <div className="relative z-10 space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
            Authentication Required
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant opacity-70">
            Select a provider to continue to your dashboard.
          </p>
        </div>

        <div className="space-y-4">
          <GoogleButton />
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-60 px-4 leading-normal">
            This action will automatically log you in or create a new developer
            account if one doesn't exist.
          </p>
        </div>

        <div className="pt-4 border-t border-surface-container-high">
          <div className="flex items-center justify-center gap-gutter">
            <span className="w-1 h-1 bg-surface-container-highest" />
            <span className="w-1 h-1 bg-surface-container-highest" />
            <span className="w-1 h-1 bg-surface-container-highest" />
          </div>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute -top-px -left-px w-2 h-2 border-t border-l border-primary-container"
      />
      <span
        aria-hidden="true"
        className="absolute -top-px -right-px w-2 h-2 border-t border-r border-primary-container"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-primary-container"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-primary-container"
      />
    </div>
  );
}
