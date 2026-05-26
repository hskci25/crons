import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import ProfileHeader from "../components/profile/ProfileHeader";
import EditProfileForm from "../components/profile/EditProfileForm";
import StatsRow from "../components/profile/StatsRow";
import ActivityHeatmap from "../components/profile/ActivityHeatmap";
import SectionHeader from "../components/profile/SectionHeader";
import CornerFrame from "../components/profile/CornerFrame";
import { useAuth } from "../hooks/useAuth";
import { runsToActivityDays, summarizeRuns } from "../lib/activityFromRuns";
import { generateActivity, summarize } from "../lib/mockActivity";
import { fetchSubmissionRuns } from "../lib/questions";

function formatJoined(iso: string | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const [activityDays, setActivityDays] = useState<ReturnType<typeof generateActivity> | null>(null);
  const [summary, setSummary] = useState<ReturnType<typeof summarize> | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchSubmissionRuns(user.id, 365).then((runs) => {
      if (runs.length > 0) {
        const days = runsToActivityDays(runs);
        setActivityDays(days);
        setSummary(summarizeRuns(runs));
      } else {
        const mock = generateActivity(user.id, 365);
        setActivityDays(mock);
        setSummary(summarize(mock));
      }
    });
  }, [user?.id]);

  if (!user) return null;

  async function handleSignOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  function handleSaved() {
    setEditing(false);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2400);
  }

  return (
    <>
      <TopNavBar />
      <main className="min-h-screen w-full bg-background text-on-surface pt-20 pb-24">
        <div className="px-margin max-w-container-max mx-auto space-y-12">
          <section>
            <SectionHeader
              index="01"
              label="Profile_Data"
              meta={
                <span className="flex items-center gap-2">
                  <span>session</span>
                  <span className="text-primary">::</span>
                  <span>operator</span>
                  <span className="opacity-30">//</span>
                  <span>joined {formatJoined(user.created_at)}</span>
                </span>
              }
            />

            <div className="space-y-6">
              <ProfileHeader
                user={user}
                editing={editing}
                onToggleEdit={() => setEditing((v) => !v)}
                onSignOut={handleSignOut}
              />

              {savedFlash && (
                <div
                  role="status"
                  className="flex items-center gap-2 px-3 py-2 border border-primary-container/40 bg-primary-container/10 font-code-md text-code-md text-primary animate-fade-in-up"
                >
                  <span className="w-1.5 h-1.5 bg-primary-container" />
                  Profile saved.
                </div>
              )}

              {editing && (
                <EditProfileForm
                  user={user}
                  onSaved={handleSaved}
                  onCancel={() => setEditing(false)}
                />
              )}
            </div>
          </section>

          <section>
            <SectionHeader
              index="02"
              label="Run_Metrics"
              meta={<span>cumulative · last 365d</span>}
            />
            <StatsRow
              stats={[
                {
                  label: "Total Runs",
                  value: summary?.total.toLocaleString() ?? "0",
                },
                {
                  label: "Current Streak",
                  value: String(summary?.currentStreak ?? 0),
                  unit: "days",
                },
                {
                  label: "Longest Streak",
                  value: String(summary?.longestStreak ?? 0),
                  unit: "days",
                },
                {
                  label: "Best Day",
                  value: String(summary?.bestDay?.count ?? 0),
                  unit: "runs",
                },
              ]}
            />
          </section>

          <section>
            <SectionHeader
              index="03"
              label="Contribution_Log"
              meta={
                <span className="flex items-center gap-2">
                  <span>range</span>
                  <span className="text-primary">::</span>
                  <span>last 53 weeks</span>
                </span>
              }
            />
            <CornerFrame>
              <div className="p-6 md:p-8">
                <ActivityHeatmap seedId={user.id} days={activityDays ?? undefined} />
              </div>
            </CornerFrame>
          </section>
        </div>
      </main>
    </>
  );
}
