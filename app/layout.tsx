import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "REstart - Careers",
  description: "Join the REstart team and help us build the future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
