"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  Terminal,
  FolderGit2,
  GraduationCap,
  Link2,
  QrCode,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Profile Info", href: "/admin/profile", icon: User },
  { label: "Smart CV Center", href: "/admin/cv", icon: FileText },
  { label: "Technical Skills", href: "/admin/skills", icon: Terminal },
  { label: "Projects Showcase", href: "/admin/projects", icon: FolderGit2 },
  { label: "Education & Diplomas", href: "/admin/education", icon: GraduationCap },
  { label: "Social & Contacts", href: "/admin/links", icon: Link2 },
  { label: "QR Code Studio", href: "/admin/qr", icon: QrCode },
  { label: "Settings & Security", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, render clean without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-darkest text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-cyber-card border-b border-cyber-cardBorder z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/40 flex items-center justify-center font-display font-black text-xs text-cyber-cyan">
            MA
          </div>
          <span className="font-display font-bold text-sm text-white">
            Admin Console
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-cyber-dark border border-cyber-cardBorder text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-cyber-card/95 border-r border-cyber-cardBorder/80 flex flex-col justify-between backdrop-blur-xl transition-transform duration-300 md:translate-x-0 md:static ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Brand */}
          <div className="flex items-center gap-3 pb-6 border-b border-cyber-cardBorder/60">
            <div className="w-10 h-10 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/40 flex items-center justify-center font-display font-black text-base text-cyber-cyan shadow-cyan-glow">
              MA
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white">
                Mohamed Ali
              </div>
              <div className="text-[10px] font-mono text-cyber-cyan flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Admin Console</span>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                    isActive
                      ? "bg-cyber-cyan text-cyber-darkest font-bold shadow-cyan-glow"
                      : "text-slate-400 hover:text-white hover:bg-cyber-darkest"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: View Site & Logout */}
        <div className="p-4 border-t border-cyber-cardBorder/60 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-cyber-darkest hover:bg-cyber-card border border-cyber-cardBorder text-slate-300 hover:text-cyber-cyan text-xs font-mono transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Public Card</span>
            </span>
            <span className="text-[10px] text-slate-500">&rarr;</span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl hover:bg-red-950/40 border border-transparent hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs font-mono transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
