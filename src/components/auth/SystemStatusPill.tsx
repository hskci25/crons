export default function SystemStatusPill() {
  return (
    <footer className="fixed bottom-0 left-0 w-full p-margin flex items-center justify-center md:justify-start z-50">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container border border-surface-container-high">
        <span className="flex h-2 w-2 relative" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container" />
        </span>
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-tighter">
          System Status:{" "}
          <span className="text-on-surface">Optimal</span>
        </span>
        <span className="ml-4 pl-4 border-l border-surface-container-high font-label-sm text-label-sm text-on-surface-variant opacity-40 hidden sm:inline">
          Lat: 12ms // Cluster: US-WEST-2
        </span>
      </div>
    </footer>
  );
}
