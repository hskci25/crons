import type { User } from "@supabase/supabase-js";

type Props = {
  user: User;
  editing: boolean;
  onToggleEdit: () => void;
  onSignOut: () => void;
};

function shortId(id: string | undefined): string {
  if (!id) return "—";
  return id.length > 12 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id;
}

function timeAgo(iso: string | undefined): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  return `${mo}mo ago`;
}

export default function ProfileHeader({
  user,
  editing,
  onToggleEdit,
  onSignOut,
}: Props) {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const displayName =
    (meta.display_name as string | undefined) ||
    (meta.full_name as string | undefined) ||
    user.email ||
    "developer";
  const avatar = meta.avatar_url as string | undefined;
  const bio = meta.bio as string | undefined;
  const location = meta.location as string | undefined;
  const website = meta.website as string | undefined;
  const githubHandle = meta.github_handle as string | undefined;
  const provider = (user.app_metadata?.provider as string | undefined) ?? "—";

  return (
    <div className="flex flex-col md:flex-row gap-6 md:items-start md:justify-between">
      <div className="flex gap-5 items-start">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="w-20 h-20 border border-outline-variant object-cover"
          />
        ) : (
          <div className="w-20 h-20 bg-surface-container-high border border-outline-variant flex items-center justify-center font-code-md text-2xl font-bold text-primary">
            {displayName.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight truncate">
              {displayName}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-primary-container font-label-sm text-label-sm uppercase tracking-widest text-primary">
              <span className="w-1.5 h-1.5 bg-primary-container animate-pulse" />
              Active
            </span>
          </div>

          <div className="font-code-md text-code-md text-on-surface-variant flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-on-surface">{user.email}</span>
            <span className="opacity-30">//</span>
            <span>
              <span className="opacity-50">uid:</span> {shortId(user.id)}
            </span>
            <span className="opacity-30">//</span>
            <span>
              <span className="opacity-50">auth:</span> {provider}
            </span>
            <span className="opacity-30">//</span>
            <span>
              <span className="opacity-50">last_seen:</span>{" "}
              {timeAgo(user.last_sign_in_at)}
            </span>
          </div>

          {bio && (
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl pt-2 leading-relaxed">
              {bio}
            </p>
          )}

          {(location || website || githubHandle) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 font-code-md text-code-md text-on-surface-variant">
              {location && (
                <span>
                  <span className="opacity-50">@</span>
                  {location}
                </span>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary underline decoration-primary/40 hover:decoration-primary transition-colors"
                >
                  {website.replace(/^https?:\/\//, "")}
                </a>
              )}
              {githubHandle && (
                <a
                  href={`https://github.com/${githubHandle.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <span className="opacity-50">gh:</span>
                  {githubHandle.replace(/^@/, "")}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onToggleEdit}
          aria-expanded={editing}
          className={`px-4 py-2 border font-code-md text-code-md transition-colors active:scale-95 ${
            editing
              ? "border-primary-container text-primary bg-primary-container/10"
              : "border-outline text-on-surface hover:bg-surface-container-low"
          }`}
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="px-4 py-2 border border-outline text-on-surface-variant font-code-md text-code-md hover:bg-surface-container-low hover:text-on-surface transition-colors active:scale-95"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
