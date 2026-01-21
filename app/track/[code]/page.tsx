"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, Clock, MessageSquare, XCircle, PartyPopper } from "lucide-react";

interface ApplicationStatus {
  name: string;
  status: string;
  jobTitle: string;
  jobCategory: string;
  appliedAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bgColor: string }> = {
  new: {
    icon: <Clock className="w-6 h-6" />,
    label: "Received",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  reviewing: {
    icon: <MessageSquare className="w-6 h-6" />,
    label: "Under Review",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  interviewed: {
    icon: <CheckCircle className="w-6 h-6" />,
    label: "Interview Stage",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  hired: {
    icon: <PartyPopper className="w-6 h-6" />,
    label: "Hired!",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  rejected: {
    icon: <XCircle className="w-6 h-6" />,
    label: "Closed",
    color: "text-slate-500",
    bgColor: "bg-slate-50",
  },
};

export default function TrackingPage() {
  const params = useParams();
  const code = params?.code as string;

  const [application, setApplication] = useState<ApplicationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(`/api/track/${code}`);
        if (!res.ok) {
          throw new Error("Application not found");
        }
        const data = await res.json();
        setApplication(data.application);
      } catch {
        setError("Application not found or invalid tracking code.");
      } finally {
        setIsLoading(false);
      }
    }

    if (code) fetchStatus();
  }, [code]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Not Found</h1>
          <p className="text-slate-500 mb-6">{error || "Application not found"}</p>
          <Link
            href="/careers"
            className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            View Open Roles
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[application.status] || statusConfig.new;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
              Application Status
            </p>
            <h1 className="text-xl font-semibold text-slate-900">
              {application.jobTitle}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              at REstart • {application.jobCategory}
            </p>
          </div>

          {/* Status */}
          <div className="px-6 py-8">
            <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl ${status.bgColor}`}>
              <span className={status.color}>{status.icon}</span>
              <div>
                <p className={`font-semibold ${status.color}`}>{status.label}</p>
                <p className="text-xs text-slate-500">
                  Updated {new Date(application.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Applicant</span>
                <span className="text-slate-900 font-medium">{application.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Applied</span>
                <span className="text-slate-900">
                  {new Date(application.appliedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">
              Questions? Email us at careers@letsrestart.in
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/careers"
            className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Back to careers
          </Link>
        </div>
      </div>
    </div>
  );
}
