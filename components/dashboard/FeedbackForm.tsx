"use client";

import { useState, useRef, useEffect } from "react";
import { Mail } from "lucide-react";
import {
  MessageSquareHeart,
  X,
  Send,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── types ─── */
interface FeedbackData {
  email: string;
  helpful: string;
  mostUseful: string[];
  otherFeature: string;
  recommend: number;
  suggestion: string;
}

const INITIAL: FeedbackData = {
  email: "",
  helpful: "",
  mostUseful: [],
  otherFeature: "",
  recommend: 0,
  suggestion: "",
};

const HELPFUL_OPTIONS = [
  "Yes, very helpful",
  "Somewhat helpful",
  "Not really helpful",
];

const USEFUL_OPTIONS = [
  "Chapter weightage",
  "Difficulty analysis",
  "Topic trends",
  "Study recommendations",
];

const ArrowIcon = () => (
  <svg
    className='group-hover:translate-x-1 duration-200 transition-all'
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/* ─── component ─── */
export function FeedbackForm() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<FeedbackData>({ ...INITIAL });
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* Escape to close */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  /* reset when re‑opened */
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setData({ ...INITIAL });
        setSubmitted(false);
      }, 300);
    }
  }, [open]);

  /* toggle a multi‑select value */
  const toggleUseful = (v: string) =>
    setData((d) => ({
      ...d,
      mostUseful: d.mostUseful.includes(v)
        ? d.mostUseful.filter((x) => x !== v)
        : [...d.mostUseful, v],
    }));

  const handleSubmit = () => {
    // TODO: wire up to your API endpoint
    console.log("Feedback submitted:", data);
    setSubmitted(true);
  };

  const isValid =
    data.email.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    data.helpful !== "" &&
    data.mostUseful.length > 0 &&
    data.recommend > 0;

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(true)}
        className="group bg-ei-accent text-white border-none py-[7px] px-[20px] rounded-full text-sm font-semibold cursor-pointer no-underline inline-flex items-center gap-2 transition-all
        duration-200 ease-linear shadow-[0_4px_20px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 hover:scale-102"
      >
        <MessageSquareHeart className="w-4 h-4 text-white" />
        <span className="hidden sm:inline">Give Feedback</span>
      </button>

      {/* ── Backdrop + Dialog ── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] px-4"
          style={{
            background: "rgba(15, 17, 23, 0.6)",
            backdropFilter: "blur(6px)",
            transition: "all 0.2s ease-out",
          }}
        >
          <div
            ref={modalRef}
            className="w-full max-w-lg rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.3)] overflow-hidden border animate-in fade-in zoom-in-95 duration-200"
            style={{
              background: "var(--ei-white)",
              borderColor: "var(--ei-border)",
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: "var(--ei-border)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(108,71,255,0.12), rgba(108,71,255,0.04))",
                  }}
                >
                  <MessageSquareHeart className="w-4 h-4 text-[#6c47ff]" />
                </div>
                <div>
                  <h2
                    className="text-sm font-semibold leading-tight"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Share your feedback
                  </h2>
                  <p
                    className="text-[11px] leading-tight mt-0.5"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    Help us improve your dashboard experience
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <X
                  className="w-4 h-4"
                  style={{ color: "var(--color-text-tertiary)" }}
                />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="max-h-[65vh] overflow-y-auto">
              {submitted ? (
                /* ── Thank‑you state ── */
                <div className="flex flex-col items-center gap-3 p-10 text-center">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-full"
                    style={{ background: "var(--color-background-success)" }}
                  >
                    <CheckCircle2
                      className="w-6 h-6"
                      style={{ color: "var(--color-text-success)" }}
                    />
                  </div>
                  <h3
                    className="text-base font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Thank you!
                  </h3>
                  <p
                    className="text-sm max-w-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Your feedback helps us build a better JEE Dashboard for
                    everyone.
                  </p>
                  <Button
                    onClick={() => setOpen(false)}
                    className="mt-2 rounded-xl bg-ei-accent text-white hover:bg-ei-accent-mid transition-all duration-200"
                  >
                    Close
                  </Button>
                </div>
              ) : (
                /* ── Form ── */
                <div className="p-5 space-y-6">
                  {/* Email field */}
                  <fieldset className="space-y-2">
                    <legend
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Email address
                    </legend>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: "var(--color-text-tertiary)" }}
                      />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={data.email}
                        onChange={(e) =>
                          setData((d) => ({ ...d, email: e.target.value }))
                        }
                        className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none transition-all border focus:ring-2 focus:ring-[#6c47ff]/20"
                        style={{
                          background: "var(--ei-white)",
                          borderColor: "var(--ei-border)",
                          color: "var(--color-text-primary)",
                        }}
                      />
                    </div>
                  </fieldset>

                  {/* Q1 — helpfulness */}
                  <fieldset className="space-y-2.5">
                    <legend
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Q1. Did the dashboard help you understand what to study?
                    </legend>
                    <div className="space-y-1.5">
                      {HELPFUL_OPTIONS.map((opt) => (
                        <label
                          key={opt}
                          onClick={() => setData((d) => ({ ...d, helpful: opt }))}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150"
                        >
                          <span
                            className="flex items-center justify-center w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors"
                            style={{
                              background:
                                data.helpful === opt
                                  ? "var(--ei-accent)"
                                  : "transparent",
                            }}
                          >
                            {data.helpful === opt && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </span>
                          <span
                            className="text-sm"
                            style={{
                              color:
                                data.helpful === opt
                                  ? "var(--color-text-info)"
                                  : "var(--color-text-secondary)",
                            }}
                          >
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Q2 — most useful feature */}
                  <fieldset className="space-y-2.5">
                    <legend
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Q2. Which features did you find most useful?{" "}
                      <span
                        className="text-[11px] font-normal"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        select all that apply
                      </span>
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {USEFUL_OPTIONS.map((opt) => {
                        const selected = data.mostUseful.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => toggleUseful(opt)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                            style={{
                              background: selected
                                ? "var(--ei-accent-light)"
                                : "transparent",
                              color: selected
                                ? "var(--ei-accent)"
                                : "var(--color-text-secondary)",
                              border: selected
                                ? "1px solid var(--ei-accent)"
                                : "1px solid var(--ei-border)",
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                      {/* "Other" chip */}
                      <button
                        type="button"
                        onClick={() => toggleUseful("Other")}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                        style={{
                          background: data.mostUseful.includes("Other")
                            ? "var(--ei-accent-light)"
                            : "transparent",
                          color: data.mostUseful.includes("Other")
                            ? "var(--ei-accent)"
                            : "var(--color-text-secondary)",
                          border: data.mostUseful.includes("Other")
                            ? "1px solid var(--ei-accent)"
                            : "1px solid var(--ei-border)",
                        }}
                      >
                        Other
                      </button>
                    </div>
                    {data.mostUseful.includes("Other") && (
                      <input
                        type="text"
                        placeholder="Tell us which feature…"
                        value={data.otherFeature}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            otherFeature: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl text-sm outline-none transition-all border focus:ring-2 focus:ring-[#6c47ff]/20"
                        style={{
                          background: "var(--ei-white)",
                          borderColor: "var(--ei-border)",
                          color: "var(--color-text-primary)",
                        }}
                      />
                    )}
                  </fieldset>

                  {/*Q3. Rating — NPS */}
                  <fieldset className="space-y-2.5">
                    <legend
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Q3. On a scale of 1–5, how likely are you to recommend this
                      JEE Dashboard to a friend?
                    </legend>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setData((d) => ({ ...d, recommend: n }))}
                          className="group flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-150"
                          style={{
                            background:
                              data.recommend === n
                                ? "linear-gradient(135deg, rgba(108,71,255,0.14), rgba(108,71,255,0.06))"
                                : "transparent",
                            border:
                              data.recommend === n
                                ? "1px solid rgba(108,71,255,0.4)"
                                : "1px solid var(--ei-border)",
                          }}
                        >
                          <Star
                            className="w-5 h-5 transition-colors"
                            fill={
                              data.recommend >= n
                                ? "#6c47ff"
                                : "transparent"
                            }
                            stroke={
                              data.recommend >= n
                                ? "#6c47ff"
                                : "var(--ei-border)"
                            }
                          />
                          <span
                            className="text-[11px] font-medium"
                            style={{
                              color:
                                data.recommend === n
                                  ? "#6c47ff"
                                  : "var(--color-text-tertiary)",
                            }}
                          >
                            {n}
                          </span>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {/* Q4 — open‑ended suggestion */}
                  <fieldset className="space-y-2.5">
                    <legend
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Q4. What feature would you like us to add or improve?
                    </legend>
                    <p
                      className="text-[11px] -mt-1"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      We&apos;ll work on your suggestions.
                    </p>
                    <textarea
                      rows={3}
                      value={data.suggestion}
                      onChange={(e) =>
                        setData((d) => ({ ...d, suggestion: e.target.value }))
                      }
                      placeholder="Type your suggestion here…"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none transition-all border focus:ring-2 focus:ring-[#6c47ff]/20"
                      style={{
                        background: "var(--ei-white)",
                        borderColor: "var(--ei-border)",
                        color: "var(--color-text-primary)",
                      }}
                    />
                  </fieldset>
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            {!submitted && (
              <div
                className="flex gap-3 px-5 py-4 border-t"
                style={{ borderColor: "var(--ei-border)" }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!isValid}
                  className="flex-1 rounded-xl bg-ei-accent text-white hover:bg-ei-accent-mid hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-semibold disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Send className="w-4 h-4 mr-2 opacity-80" />
                  Submit feedback
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border-ei-border hover:bg-muted/50 text-muted-foreground"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
