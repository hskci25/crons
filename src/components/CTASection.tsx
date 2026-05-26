import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="border-t border-outline-variant bg-surface-container-low py-32 text-center">
      <div className="px-margin max-w-container-max mx-auto">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-8">
          Ready to level up?
        </h2>
        <Link
          to="/auth"
          className="inline-block bg-primary-container text-on-primary-container px-10 py-4 font-code-md text-code-md font-bold hover:brightness-90 transition-all active:scale-95"
        >
          Start Your First Challenge
        </Link>
      </div>
    </section>
  );
}
