"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MenuIcon } from "@/components/ui/Icons";
import { NavDrawer } from "@/components/ui/NavDrawer";
import { useMemory } from "@/context/memory-context";

export const Header: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { conflicts } = useMemory();

  const activeConflicts = conflicts.filter((c) => c.status === "OPEN").length;

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        {/* Hamburger Left */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="p-2 rounded-lg text-[var(--text)] hover:bg-[var(--surface)] transition-colors relative"
          aria-label="Open menu"
        >
          <MenuIcon size={22} />
          {activeConflicts > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--primary)] rounded-full animate-ping" />
          )}
        </button>

        {/* Wordmark Center */}
        <Link href="/" className="flex flex-col items-center">
          <span className="font-headline font-bold text-lg tracking-wider text-[var(--secondary)]">
            REDLINE
          </span>
        </Link>

        {/* Status Dot Right */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)]">
          <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
          <span className="font-mono text-[10px] uppercase text-[var(--text-muted)] tracking-wider">
            Memory Active
          </span>
        </div>
      </header>

      <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};
