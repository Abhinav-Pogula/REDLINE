import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  highlightBorder?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  highlightBorder = false,
  ...props
}) => {
  return (
    <div
      className={`bg-[var(--surface)] border ${
        highlightBorder ? "border-[var(--primary)]" : "border-[var(--border)]"
      } rounded-xl p-4 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
