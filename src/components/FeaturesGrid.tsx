const FEATURES = [
  {
    title: "Real Repo Challenges",
    body: "Stop solving LeetCode puzzles. Practice in production-ready repos with complex architectures, legacy debt, and modern toolchains.",
  },
  {
    title: "Built-in Assistant",
    body: "Get contextual hints and code reviews that simulate a real Senior Engineer feedback loop without giving away the solution.",
  },
  {
    title: "Timed Intervals",
    body: "Simulate the pressure of a live technical screen with customizable time boxes and environment constraints.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="px-margin max-w-container-max mx-auto py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {FEATURES.map((f) => (
          <div key={f.title}>
            <h3 className="font-code-md text-code-md font-bold text-primary mb-4 uppercase tracking-wider">
              {f.title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
