"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CloseIcon,
  AlertIcon,
  TimelineIcon,
  FileTextIcon,
  UserCheckIcon,
  SettingsIcon,
  PlayIcon,
  RefreshIcon,
  ChevronRightIcon,
} from "@/components/ui/Icons";
import { useMemory } from "@/context/memory-context";

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavDrawer: React.FC<NavDrawerProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { conflicts, resetToSeed, runDemoSequence } = useMemory();

  if (!isOpen) return null;

  const openConflictsCount = conflicts.filter((c) => c.status === "OPEN").length;

  const links = [
    {
      href: "/conflicts",
      label: "Conflicts",
      icon: AlertIcon,
      badge: openConflictsCount > 0 ? openConflictsCount : undefined,
    },
    {
      href: "/decisions",
      label: "Decision Timeline",
      icon: TimelineIcon,
    },
    {
      href: "/evidence",
      label: "Evidence Vault",
      icon: FileTextIcon,
    },
    {
      href: "/commitments",
      label: "Commitments",
      icon: UserCheckIcon,
    },
    {
      href: "/settings",
      label: "Settings & Memory Controls",
      icon: SettingsIcon,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-4/5 max-w-xs bg-[var(--surface)] border-r border-[var(--border)] h-full flex flex-col justify-between p-6 z-10 shadow-2xl overflow-y-auto">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--border)]">
            <div>
              <h2 className="font-headline font-bold text-xl tracking-wide text-[var(--secondary)]">
                REDLINE
              </h2>
              <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5">
                AI That Remembers
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors rounded-full"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="mt-6 space-y-1.5">
            {links.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all font-body text-sm ${
                    isActive
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold border border-[var(--primary)]/30"
                      : "text-[var(--text)] hover:bg-neutral-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent size={18} className={isActive ? "text-[var(--primary)]" : "text-[var(--text-muted)]"} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge !== undefined && (
                      <span className="font-mono text-[10px] bg-[var(--primary)] text-[var(--primary-ink)] font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRightIcon size={16} className="text-[var(--text-muted)] opacity-60" />
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Demo & Action Footer */}
        <div className="pt-6 border-t border-[var(--border)] space-y-2.5">
          <Link
            href="/demo"
            onClick={onClose}
            className="w-full bg-[var(--primary)] text-[var(--primary-ink)] font-semibold px-4 py-2.5 rounded-full text-xs font-body flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md"
          >
            <PlayIcon size={16} />
            <span>Run Interactive Demo</span>
          </Link>

          <button
            onClick={() => {
              resetToSeed();
              onClose();
            }}
            className="w-full bg-neutral-900 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <RefreshIcon size={14} />
            <span>Reset Seed Store</span>
          </button>
        </div>
      </div>
    </div>
  );
};
