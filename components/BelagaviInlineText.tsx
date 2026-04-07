"use client";

import { useEffect, useRef, useState } from "react";

const LANGS = [
  { text: "ಬೆಳಗಾವಿ", font: "'Noto Sans Kannada', sans-serif" },
  { text: "Belagavi", font: "inherit" },
  { text: "बेलगावी", font: "'Noto Sans Devanagari', sans-serif" },
];

if (typeof document !== "undefined" && !document.getElementById("belagavi-fonts")) {
  const link = document.createElement("link");
  link.id = "belagavi-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@600&family=Noto+Sans+Devanagari:wght@600&display=swap";
  document.head.appendChild(link);
}

type Phase = "idle" | "entering" | "exiting";

export function BelagaviInlineText() {
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPhase("entering"));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase !== "entering") return;

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (phase !== "entering") return;

    timerRef.current = setTimeout(() => {
      setPhase("exiting");
    }, 1600);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [phase, current]);

  useEffect(() => {
    if (phase !== "exiting") return;

    timerRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % LANGS.length);
      setPhase("entering");
    }, 220);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [phase]);

  const lang = LANGS[current];

  return (
    <span
      style={{
        display: "inline-block",
        minWidth: "140px",
        textAlign: "left",
      }}
    >
      <span
        style={{
          fontFamily: lang.font,
          display: "inline-block",
          opacity: phase === "entering" ? 1 : 0,
          transform:
            phase === "entering"
              ? "translateY(0) scale(1)"
              : phase === "exiting"
                ? "translateY(-8px) scale(0.95)"
                : "translateY(6px) scale(0.96)",
          transition:
            phase === "idle"
              ? "none"
              : "opacity 220ms ease, transform 220ms ease",
          willChange: "opacity, transform",
        }}
      >
        {lang.text}
      </span>
    </span>
  );
}
