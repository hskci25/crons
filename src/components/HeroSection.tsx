import { useEffect, useState } from "react";

const TARGET = "CRONS";
const TYPE_DELAY_MIN = 110;
const TYPE_DELAY_MAX = 210;
const DELETE_DELAY = 75;
const PAUSE_AT_FULL = 2600;
const PAUSE_AT_EMPTY = 550;

function randType() {
  return TYPE_DELAY_MIN + Math.random() * (TYPE_DELAY_MAX - TYPE_DELAY_MIN);
}

export default function HeroSection() {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timeoutId = window.setTimeout(resolve, ms);
      });

    async function loop() {
      while (!cancelled) {
        for (let i = 1; i <= TARGET.length; i++) {
          if (cancelled) return;
          setText(TARGET.slice(0, i));
          await sleep(randType());
        }

        await sleep(PAUSE_AT_FULL);
        if (cancelled) return;

        for (let i = TARGET.length - 1; i >= 0; i--) {
          if (cancelled) return;
          setText(TARGET.slice(0, i));
          await sleep(DELETE_DELAY);
        }

        await sleep(PAUSE_AT_EMPTY);
      }
    }

    loop();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-[#0F0F0F] overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(232,114,12,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(232,114,12,0.09) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 70% 55% at center, black 25%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 55% at center, black 25%, transparent 90%)",
        }}
      />
      <h1
        aria-label="CRONS"
        className="relative z-10 inline-flex items-baseline font-code-md font-extrabold tracking-tighter select-none text-[#E8720C] animate-glow-pulse leading-none text-[15vw] md:text-[18vw]"
      >
        <span className="opacity-60 mr-[0.35em]" aria-hidden="true">
          $
        </span>
        <span className="relative inline-block" aria-hidden="true">
          <span className="invisible whitespace-pre">{TARGET}</span>
          <span className="absolute inset-y-0 left-0 flex items-center whitespace-pre">
            <span>{text}</span>
            <span
              aria-hidden="true"
              className="inline-block w-[0.08em] h-[0.82em] bg-[#E8720C] ml-[0.05em] translate-y-[0.02em] animate-cursor-blink"
            />
          </span>
        </span>
      </h1>
    </section>
  );
}
