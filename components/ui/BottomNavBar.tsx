"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, MicIcon, SearchIcon } from "@/components/ui/Icons";

export const BottomNavBar: React.FC = () => {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isSearch = pathname === "/search" || pathname === "/commitments" || pathname === "/evidence";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-6 pb-6 pt-2 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/95 to-transparent pointer-events-none">
      <nav className="pointer-events-auto bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] rounded-full px-6 py-2 flex items-center justify-between shadow-2xl">
        {/* Home / Dashboard Link */}
        <Link
          href="/"
          className={`p-2.5 rounded-full transition-all ${
            isHome
              ? "text-[var(--primary)] bg-neutral-900"
              : "text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
          aria-label="Dashboard"
        >
          <HomeIcon size={22} />
        </Link>

        {/* Central Large Circular Record Button */}
        <Link
          href="/record"
          className="relative -top-5 bg-[var(--primary)] text-[var(--primary-ink)] p-4 rounded-full shadow-lg shadow-[var(--primary)]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-4 border-[var(--bg)]"
          aria-label="Record Meeting"
        >
          <MicIcon size={26} className="animate-pulse" />
        </Link>

        {/* Search / Commitments Link */}
        <Link
          href="/commitments"
          className={`p-2.5 rounded-full transition-all ${
            isSearch
              ? "text-[var(--primary)] bg-neutral-900"
              : "text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
          aria-label="Memory Search"
        >
          <SearchIcon size={22} />
        </Link>
      </nav>
    </div>
  );
};
