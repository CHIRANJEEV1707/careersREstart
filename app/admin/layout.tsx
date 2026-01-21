import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "REstart Admin",
  description: "Admin dashboard for REstart hiring platform",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {children}
    </div>
  );
}
