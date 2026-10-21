"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { site } from "@/config/site";

const KEY = "sw-gate-v1";

export function ResearchGate() {
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState(false);
  const [ruo, setRuo] = useState(false);

  useEffect(() => {
    let accepted = false;
    try {
      accepted = localStorage.getItem(KEY) === "accepted";
    } catch {}
    setOpen(!accepted);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  if (!open) return null;

  function enter() {
    try {
      localStorage.setItem(KEY, "accepted");
    } catch {}
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl sm:p-8">
        <Logo className="h-7 w-auto" />
        <h2 id="gate-title" className="mt-4 text-xl font-semibold">
          Research use only
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          {site.name} supplies compounds strictly for in-vitro laboratory research. Please confirm the following to continue.
        </p>
        <div className="mt-5 space-y-3 text-sm">
          <label className="flex gap-3">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-accent" checked={age} onChange={(e) => setAge(e.target.checked)} />
            <span>I am at least {site.minAge} years of age.</span>
          </label>
          <label className="flex gap-3">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-accent" checked={ruo} onChange={(e) => setRuo(e.target.checked)} />
            <span>
              I am a researcher purchasing for laboratory use, and I understand these products are not for human or animal
              consumption. I agree to the{" "}
              <Link href="/legal/terms" className="text-accent underline" onClick={() => setOpen(false)}>
                Terms
              </Link>
              .
            </span>
          </label>
        </div>
        <div className="mt-6 flex gap-3">
          <button className="btn flex-1" disabled={!age || !ruo} onClick={enter}>
            Enter site
          </button>
          <a href="https://www.google.com" className="btn-outline">
            Leave
          </a>
        </div>
      </div>
    </div>
  );
}
