import type { Metadata } from "next";
import "./globals.css";
import { MemoryProvider } from "@/context/memory-context";
import { Header } from "@/components/ui/Header";
import { BottomNavBar } from "@/components/ui/BottomNavBar";

export const metadata: Metadata = {
  title: "REDLINE — AI That Remembers",
  description: "Private work-memory tool. Listens, extracts decisions & constraints, and proactively detects conflicts with timestamped evidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-[var(--text)] antialiased min-h-screen">
        <MemoryProvider>
          {/* Mobile Viewport Container */}
          <div className="max-w-md mx-auto min-h-screen bg-[var(--bg)] border-x border-[var(--border)] flex flex-col relative pb-24 shadow-2xl">
            <Header />
            <main className="flex-1 px-4 py-4">{children}</main>
            <BottomNavBar />
          </div>
        </MemoryProvider>
      </body>
    </html>
  );
}
