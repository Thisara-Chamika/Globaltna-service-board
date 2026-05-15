import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Service Request Board | GlobalTNA",
  description: "A mini service request board for homeowners and tradespeople",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen antialiased">
        {/* ── Navbar ── */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <span className="text-2xl">🛠️</span>
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  Service Request Board
                </span>
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Main Content ── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}