import { Link } from "react-router-dom";

export default function ProductIntro() {
  return (
    <div className="px-margin max-w-container-max mx-auto pt-24 pb-16">
      <div className="max-w-3xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">
          Practice the interviews that actually matter now.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-10">
          A platform for engineers to master repo-based technical interviews.
          Build real features, fix critical bugs, and optimize performance in
          production-grade codebases.
        </p>
        <Link
          to="/auth"
          className="inline-block bg-primary-container text-on-primary-container px-8 py-3 font-code-md text-code-md font-bold hover:brightness-90 transition-all active:scale-95"
        >
          Start Practicing
        </Link>
      </div>
    </div>
  );
}
