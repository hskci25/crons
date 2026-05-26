const FOOTER_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Support", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-background">
      <div className="flex justify-between items-center py-gutter px-margin max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <span className="font-code-md text-code-md text-on-background font-bold">
            Crons
          </span>
          <div className="flex gap-6">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-on-surface-variant font-code-md text-code-md hover:text-primary underline decoration-primary transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="hidden md:block">
          <span className="font-code-md text-label-sm text-on-surface-variant opacity-50">
            © {new Date().getFullYear()} Crons
          </span>
        </div>
      </div>
    </footer>
  );
}
