"use client";

import { useState } from "react";
import { X, Send, Star, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

const FEATURES = [
  "Chapter weightage",
  "Difficulty analysis",
  "Topic trends",
  "Year-wise trends",
  "AI Search",
  "Other",
];

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [helpful, setHelpful] = useState<string | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [requestedFeature, setRequestedFeature] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const toggleFeature = (f: string) =>
    setFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          helpful,
          features,
          rating,
          message,
          requestedFeature,
        }),
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        // Reset state after closing
        setTimeout(() => {
          setSubmitted(false);
          setHelpful(null);
          setFeatures([]);
          setRating(null);
          setEmail("");
          setMessage("");
          setRequestedFeature("");
        }, 300);
      }, 2000);
    } catch {
      setSubmitting(false);
    }
  };

  const displayRating = hoverRating ?? rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-base text-foreground">
                Share your feedback
              </p>
              <p className="text-xs text-muted-foreground">
                Help us improve your dashboard experience
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-lg text-foreground">
                Thanks for your feedback!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Your insights help us make JEE patterns clearer for everyone.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
              {/* Q1: Radio list */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  Q1. Did the dashboard help you understand what to study?
                </p>
                <div className="grid gap-2">
                  {[
                    { value: "yes", label: "Yes, very helpful" },
                    { value: "somewhat", label: "Somewhat helpful" },
                    { value: "no", label: "Not really helpful" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                        helpful === opt.value
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-background border-border hover:border-primary/50 hover:bg-muted/30"
                      )}
                    >
                      <input
                        type="radio"
                        name="helpful"
                        className="sr-only"
                        checked={helpful === opt.value}
                        onChange={() => setHelpful(opt.value)}
                      />
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                          helpful === opt.value
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {helpful === opt.value && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-foreground/90">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Q2: Feature chips */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  Q2. Which features did you find most useful?{" "}
                  <span className="font-normal text-xs text-muted-foreground">
                    (select all that apply)
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {FEATURES.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFeature(f)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                        features.includes(f)
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3: Stars */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  Q3. How likely are you to recommend this JEE Dashboard to a friend?
                </p>
                <div className="flex justify-between items-center bg-muted/20 p-4 rounded-2xl border border-border/50">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(n)}
                      className="group flex flex-col items-center gap-1.5 outline-none"
                    >
                      <div className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
                        displayRating !== null && n <= displayRating
                          ? "bg-primary text-primary-foreground shadow-md scale-110"
                          : "bg-background text-muted-foreground border border-border group-hover:border-primary/50"
                      )}>
                        <Star
                          className={cn(
                            "w-6 h-6 transition-all",
                            displayRating !== null && n <= displayRating
                              ? "fill-current"
                              : "fill-none"
                          )}
                        />
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold font-mono",
                        displayRating !== null && n <= displayRating ? "text-primary" : "text-muted-foreground"
                      )}>
                        {n}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between px-1 text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                  <span>Unlikely</span>
                  <span>Very Likely</span>
                </div>
              </div>

              {/* Q4: Input */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  Q4. What feature should we add next?
                </p>
                <Input
                  value={requestedFeature}
                  onChange={(e) => setRequestedFeature(e.target.value)}
                  placeholder="e.g. Compare two years side by side..."
                  className="rounded-xl bg-muted/30 border-border focus-visible:ring-primary/20"
                />
              </div>

              {/* Email (New) */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  Your Email{" "}
                  <span className="font-normal text-xs text-muted-foreground">
                    (if you'd like a response)
                  </span>
                </p>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="rounded-xl bg-muted/30 border-border focus-visible:ring-primary/20"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  Any other thoughts?{" "}
                  <span className="font-normal text-xs text-muted-foreground">
                    (optional)
                  </span>
                </p>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Bugs, suggestions, or what you love..."
                  className="rounded-xl bg-muted/30 border-border resize-none focus-visible:ring-primary/20"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t border-border bg-muted/30">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl h-11 font-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || !rating || !helpful}
                className="flex-[2] rounded-xl h-11 font-bold shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
