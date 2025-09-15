import React from "react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="flex h-full w-full items-center justify-between px-4">
        {/* Left: App logo / brand */}
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-neutral-900 text-white">
            <span className="text-sm font-bold">A</span>
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold tracking-tight">AppName</div>
            <div className="text-xs text-neutral-500">React + Tailwind</div>
          </div>
        </div>

        {/* Right: User profile */}
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-neutral-600 sm:block">Hi, Alex</span>
          <button
            className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-1 ring-neutral-200"
            aria-label="User menu"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
              <circle cx="12" cy="8" r="4" className="fill-neutral-300" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" className="fill-neutral-300" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}