import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import CornerFrame from "./CornerFrame";

type Props = {
  user: User;
  onSaved: () => void;
  onCancel: () => void;
};

type Fields = {
  display_name: string;
  bio: string;
  location: string;
  website: string;
  github_handle: string;
};

const MAX_BIO_LEN = 240;

function pull(user: User): Fields {
  const m = (user.user_metadata ?? {}) as Record<string, unknown>;
  return {
    display_name:
      (m.display_name as string | undefined) ??
      (m.full_name as string | undefined) ??
      "",
    bio: (m.bio as string | undefined) ?? "",
    location: (m.location as string | undefined) ?? "",
    website: (m.website as string | undefined) ?? "",
    github_handle: (m.github_handle as string | undefined) ?? "",
  };
}

function normalizeWebsite(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function EditProfileForm({ user, onSaved, onCancel }: Props) {
  const [fields, setFields] = useState<Fields>(() => pull(user));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFields(pull(user));
  }, [user]);

  const update =
    <K extends keyof Fields>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
    };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    setError(null);
    setSaving(true);

    const payload = {
      display_name: fields.display_name.trim() || null,
      bio: fields.bio.trim() || null,
      location: fields.location.trim() || null,
      website: fields.website.trim() ? normalizeWebsite(fields.website) : null,
      github_handle: fields.github_handle.trim().replace(/^@/, "") || null,
    };

    const { error: err } = await supabase.auth.updateUser({ data: payload });
    setSaving(false);

    if (err) {
      setError(err.message);
      return;
    }
    onSaved();
  }

  return (
    <CornerFrame className="animate-fade-in-up">
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Display name" name="display_name">
            <input
              id="display_name"
              type="text"
              value={fields.display_name}
              onChange={update("display_name")}
              maxLength={60}
              className={inputCls}
              placeholder="Ada Lovelace"
              autoFocus
            />
          </Field>

          <Field label="Location" name="location">
            <input
              id="location"
              type="text"
              value={fields.location}
              onChange={update("location")}
              maxLength={60}
              className={inputCls}
              placeholder="Bangalore, IN"
            />
          </Field>

          <Field label="Website" name="website">
            <input
              id="website"
              type="text"
              inputMode="url"
              value={fields.website}
              onChange={update("website")}
              maxLength={200}
              className={inputCls}
              placeholder="https://example.dev"
            />
          </Field>

          <Field label="GitHub handle" name="github_handle">
            <div className="flex items-center bg-surface-container-low border border-surface-container-high focus-within:border-primary-container transition-colors">
              <span className="px-3 font-code-md text-code-md text-on-surface-variant opacity-50 select-none">
                @
              </span>
              <input
                id="github_handle"
                type="text"
                value={fields.github_handle.replace(/^@/, "")}
                onChange={update("github_handle")}
                maxLength={40}
                className="flex-1 bg-transparent py-2.5 pr-3 font-code-md text-code-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none"
                placeholder="octocat"
              />
            </div>
          </Field>
        </div>

        <Field
          label="Bio"
          name="bio"
          meta={
            <span className="font-label-sm text-label-sm text-on-surface-variant opacity-60">
              {fields.bio.length} / {MAX_BIO_LEN}
            </span>
          }
        >
          <textarea
            id="bio"
            value={fields.bio}
            onChange={update("bio")}
            maxLength={MAX_BIO_LEN}
            rows={3}
            className={`${inputCls} resize-none leading-relaxed`}
            placeholder="Distributed systems, Go, the occasional Rust rewrite."
          />
        </Field>

        {error && (
          <p
            role="alert"
            className="font-code-md text-code-md text-error border border-error/40 bg-error/5 px-3 py-2"
          >
            {error}
          </p>
        )}

        <div className="flex items-center justify-between gap-4 pt-2 border-t border-outline-variant">
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest opacity-60">
            Stored in user_metadata
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="px-4 py-2 border border-outline text-on-surface-variant font-code-md text-code-md hover:bg-surface-container-low hover:text-on-surface transition-colors active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              aria-busy={saving}
              className="px-5 py-2 bg-primary-container text-on-primary-container font-code-md text-code-md font-bold hover:brightness-90 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
            >
              {saving && (
                <span className="w-3.5 h-3.5 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin" />
              )}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </CornerFrame>
  );
}

const inputCls =
  "w-full bg-surface-container-low border border-surface-container-high px-3 py-2.5 font-code-md text-code-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container transition-colors";

function Field({
  label,
  name,
  meta,
  children,
}: {
  label: string;
  name: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={name}
          className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant"
        >
          {label}
        </label>
        {meta}
      </div>
      {children}
    </div>
  );
}
