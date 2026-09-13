import React from "react";

interface StatusPillProps {
  status: string;
  className?: string;
  size?: "sm" | "md";
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  className = "",
  size = "sm",
}) => {
  const normStatus = status.toUpperCase();

  // Incomplete, open, conflicting, or urgent status use primary color
  const isPrimary = [
    "INCOMPLETE",
    "CONFLICTING",
    "OPEN",
    "VIOLATED",
    "PROPOSED",
    "UNCERTAIN",
  ].includes(normStatus);

  let styleClasses = "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]";
  if (isPrimary) {
    styleClasses = "bg-[var(--primary)]/10 border border-[var(--primary)] text-[var(--primary)] font-semibold";
  } else if (normStatus === "CONFIRMED" || normStatus === "ACTIVE" || normStatus === "DONE" || normStatus === "SATISFIED") {
    styleClasses = "bg-emerald-50 border border-emerald-300 text-emerald-700 font-medium";
  } else if (normStatus === "SUPERSEDED" || normStatus === "DISMISSED") {
    styleClasses = "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] opacity-75 line-through";
  }

  const sizeClasses = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`font-mono uppercase tracking-wider rounded-md inline-flex items-center gap-1 leading-none ${sizeClasses} ${styleClasses} ${className}`}
    >
      {isPrimary && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />}
      {status}
    </span>
  );
};
