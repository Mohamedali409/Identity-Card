"use client";

import React from "react";
import { GraduationCap, Award, Calendar, CheckCircle2 } from "lucide-react";

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
  credentialUrl?: string | null;
}

interface EducationProps {
  education: EducationItem[];
}

export default function EducationCredentials({ education }: EducationProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 relative">
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-cyber-cardBorder text-cyber-cyan text-xs font-mono">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Verified Background</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Education &amp; Professional Diplomas
        </h2>
        <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
          Academic foundation and intensive professional development in software engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {education.map((item, idx) => (
          <div
            key={item.id}
            className="rounded-2xl p-6 sm:p-7 border border-cyber-cardBorder bg-gradient-to-b from-cyber-card/80 to-cyber-darkest/90 backdrop-blur-sm relative overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyber-darkest border border-cyber-cyan/30 text-cyber-cyan flex-shrink-0">
                {idx === 0 ? (
                  <GraduationCap className="w-6 h-6" />
                ) : (
                  <Award className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-lg font-display font-bold text-white">
                    {item.institution}
                  </h3>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyber-dark border border-cyber-cardBorder text-[11px] font-mono text-slate-400">
                    <Calendar className="w-3 h-3 text-cyber-cyan" />
                    <span>
                      {item.startDate} — {item.endDate}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-display font-semibold text-cyber-cyan">
                  {item.degree} • {item.fieldOfStudy}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed pt-1">
                  {item.description}
                </p>

                <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Credential</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
