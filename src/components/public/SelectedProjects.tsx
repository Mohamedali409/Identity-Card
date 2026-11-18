"use client";

import React from "react";
import Image from "next/image";
import { FolderGit2, Github, ExternalLink, Code2 } from "lucide-react";

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string;
  repoUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
  isFeatured: boolean;
}

interface SelectedProjectsProps {
  projects: ProjectItem[];
}

export default function SelectedProjects({ projects }: SelectedProjectsProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 relative">
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card border border-cyber-cardBorder text-cyber-cyan text-xs font-mono">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Practical Engineering</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Selected Projects &amp; Implementations
        </h2>
        <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
          Production-grade backend architectures, full-stack hubs, and microservices engines developed through practical experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => {
          const techArray = project.technologies
            ? project.technologies.split(",").map((t) => t.trim())
            : [];

          return (
            <div
              key={project.id}
              className="rounded-2xl overflow-hidden border border-cyber-cardBorder bg-gradient-to-b from-cyber-card/80 to-cyber-darkest/90 backdrop-blur-sm flex flex-col justify-between hover:border-cyber-cyan/40 transition-all duration-300 group"
            >
              {/* Project Visual / Diagram Header */}
              <div className="relative w-full h-44 bg-cyber-darkest overflow-hidden border-b border-cyber-cardBorder/60">
                <Image
                  src={project.imageUrl || "/assets/projects/ecommerce-backend.svg"}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Project Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-display font-bold text-white group-hover:text-cyber-cyan transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {techArray.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-cyber-dark border border-cyber-cardBorder/60 text-[10px] font-mono text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 pt-3 border-t border-cyber-cardBorder/50">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-cyber-cyan transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-mono text-cyber-azure hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
