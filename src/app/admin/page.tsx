"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Download,
  Contact,
  FileText,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  HardDrive,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const summary = analytics?.summary || {
    totalPageViews: 0,
    totalCvDownloads: 0,
    totalVCardSaves: 0,
    activeCvCount: 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyber-cardBorder/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Real-time analytics, CV downloads, and identity card engagement.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyber-card hover:bg-cyber-cardBorder border border-cyber-cardBorder text-xs font-mono text-slate-300 hover:text-cyber-cyan transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Page Views */}
        <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-cardBorder/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Total Page Visits</span>
            <div className="p-2 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-display font-black text-white">
            {summary.totalPageViews}
          </div>
          <span className="text-[11px] font-mono text-emerald-400 mt-2 block">
            QR scans &amp; direct links
          </span>
        </div>

        {/* Total CV Downloads */}
        <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-cardBorder/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Total CV Downloads</span>
            <div className="p-2 rounded-xl bg-cyber-azure/10 text-cyber-azure border border-cyber-azure/20">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-display font-black text-cyber-cyan">
            {summary.totalCvDownloads}
          </div>
          <span className="text-[11px] font-mono text-slate-400 mt-2 block">
            Across tailored roles
          </span>
        </div>

        {/* Total vCard Saves */}
        <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-cardBorder/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">vCard Contact Saves</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Contact className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-display font-black text-white">
            {summary.totalVCardSaves}
          </div>
          <span className="text-[11px] font-mono text-emerald-400 mt-2 block">
            Phone address book saves
          </span>
        </div>

        {/* Active Tailored CVs */}
        <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-cardBorder/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Active CV Versions</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-display font-black text-white">
            {summary.activeCvCount}
          </div>
          <span className="text-[11px] font-mono text-slate-400 mt-2 block">
            Tailored to role descriptions
          </span>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CV Downloads Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-cyber-card border border-cyber-cardBorder space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyber-cyan" />
              <h2 className="text-base font-display font-bold text-white">
                CV Downloads by Role
              </h2>
            </div>
            <Link
              href="/admin/cv"
              className="text-xs font-mono text-cyber-cyan hover:underline flex items-center gap-1"
            >
              <span>Manage CVs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {analytics?.cvDownloads?.length > 0 ? (
              analytics.cvDownloads.map((cv: any) => (
                <div
                  key={cv.id}
                  className="p-3.5 rounded-xl bg-cyber-darkest border border-cyber-cardBorder/60 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-display font-bold text-slate-200">
                      {cv.title}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {cv.targetRole}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-mono font-bold text-cyber-cyan">
                      {cv.downloadCount}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      downloads
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs font-mono text-slate-500">
                No CV records found.
              </div>
            )}
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-cyber-card border border-cyber-cardBorder space-y-4">
          <h2 className="text-base font-display font-bold text-white">
            Quick Actions
          </h2>

          <div className="space-y-2.5">
            <Link
              href="/admin/profile"
              className="p-3 rounded-xl bg-cyber-darkest hover:bg-cyber-dark border border-cyber-cardBorder flex items-center justify-between text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <span>Update Bio &amp; Availability</span>
              <ArrowUpRight className="w-4 h-4 text-cyber-cyan" />
            </Link>

            <Link
              href="/admin/cv"
              className="p-3 rounded-xl bg-cyber-darkest hover:bg-cyber-dark border border-cyber-cardBorder flex items-center justify-between text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <span>Upload or Replace a CV PDF</span>
              <ArrowUpRight className="w-4 h-4 text-cyber-cyan" />
            </Link>

            <Link
              href="/admin/qr"
              className="p-3 rounded-xl bg-cyber-darkest hover:bg-cyber-dark border border-cyber-cardBorder flex items-center justify-between text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <span>Generate High-Res Print QR Code</span>
              <ArrowUpRight className="w-4 h-4 text-cyber-cyan" />
            </Link>

            <Link
              href="/admin/skills"
              className="p-3 rounded-xl bg-cyber-darkest hover:bg-cyber-dark border border-cyber-cardBorder flex items-center justify-between text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <span>Manage Technical Arsenal</span>
              <ArrowUpRight className="w-4 h-4 text-cyber-cyan" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
