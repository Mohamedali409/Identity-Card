"use client";

import React from "react";
import { Server, Layout, Database, Cloud, Terminal, CheckCircle } from "lucide-react";

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  proficiencyLabel?: string | null;
}

interface TechnicalArsenalProps {
  skills: SkillItem[];
}

export default function TechnicalArsenal({ skills }: TechnicalArsenalProps) {
  // Group skills by category
  const categories: { [key: string]: SkillItem[] } = {};
  skills.forEach((s) => {
    if (!categories[s.category]) {
      categories[s.category] = [];
    }
    categories[s.category].push(s);
  });

  const getCategoryIcon = (cat: string) => {
    if (cat.toLowerCase().includes("backend") || cat.toLowerCase().includes("api")) {
      return <Server className="w-5 h-5 text-cyber-cyan" />;
    }
    if (cat.toLowerCase().includes("frontend") || cat.toLowerCase().includes("web")) {
      return <Layout className="w-5 h-5 text-cyber-azure" />;
    }
    if (cat.toLowerCase().includes("database") || cat.toLowerCase().includes("cache")) {
      return <Database className="w-5 h-5 text-emerald-400" />;
    }
    if (cat.toLowerCase().includes("cloud") || cat.toLowerCase().includes("devops")) {
      return <Cloud className="w-5 h-5 text-amber-400" />;
    }
    return <Terminal className="w-5 h-5 text-cyber-cyan" />;
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 relative">
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-cyber-cardBorder text-cyber-cyan text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>Technical Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Technical Arsenal &amp; Stack
        </h2>
        <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
          Verified skills and production technologies applied across scalable backend systems and modern full-stack web applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(categories).map(([categoryName, catSkills]) => (
          <div
            key={categoryName}
            className="rounded-2xl p-6 bg-gradient-to-b from-cyber-card/70 to-cyber-darkest/70 border border-cyber-cardBorder backdrop-blur-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-cyber-cardBorder/60">
                <div className="p-2 rounded-xl bg-cyber-darkest border border-cyber-cardBorder">
                  {getCategoryIcon(categoryName)}
                </div>
                <h3 className="text-base font-display font-bold text-white">
                  {categoryName}
                </h3>
              </div>

              <div className="space-y-2.5">
                {catSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-cyber-darkest/60 border border-cyber-cardBorder/40 hover:border-cyber-cyan/30 transition-colors"
                  >
                    <span className="text-xs font-mono text-slate-200">
                      {skill.name}
                    </span>
                    {skill.proficiencyLabel && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-dark border border-cyber-cardBorder/60 text-slate-400">
                        {skill.proficiencyLabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
