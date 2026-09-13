import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyle =
    "font-body inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  let variantStyle = "";
  if (variant === "primary") {
    variantStyle = "bg-[var(--primary)] text-[var(--primary-ink)] hover:brightness-110 active:scale-95";
  } else if (variant === "secondary") {
    variantStyle = "bg-[var(--secondary)] text-[var(--bg)] border border-[var(--border)] hover:opacity-90 active:scale-95";
  } else if (variant === "outline") {
    variantStyle =
      "bg-transparent border border-[var(--border)] text-[var(--text)] hover:border-[var(--text-muted)] active:scale-95";
  }

  let sizeStyle = "";
  if (size === "sm") {
    sizeStyle = "text-xs px-3 py-1.5 gap-1.5";
  } else if (size === "md") {
    sizeStyle = "text-sm px-4 py-2 gap-2";
  } else if (size === "lg") {
    sizeStyle = "text-base px-6 py-3 gap-2.5";
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
