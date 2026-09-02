import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Code2, 
  Cpu, 
  Database, 
  Zap, 
  Box, 
  Layout, 
  Atom, 
  Server, 
  Lock, 
  ShieldCheck, 
  MessageSquare, 
  Terminal,
  Globe,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project } from '../lib/projects.ts';

interface ProjectPreviewProps {
  project: Project;
  featured?: boolean;
}

const getTechIcon = (tech: string) => {
  const t = tech.toLowerCase();
  if (t.includes('rust')) return <Cpu className="w-3 h-3" />;
  if (t.includes('redis') || t.includes('sql') || t.includes('postgres') || t.includes('db')) return <Database className="w-3 h-3" />;
  if (t.includes('websocket') || t.includes('performance') || t.includes('zap') || t.includes('go')) return <Zap className="w-3 h-3" />;
  if (t.includes('docker') || t.includes('container')) return <Box className="w-3 h-3" />;
  if (t.includes('next')) return <Layout className="w-3 h-3" />;
  if (t.includes('react')) return <Atom className="w-3 h-3" />;
  if (t.includes('node') || t.includes('backend')) return <Server className="w-3 h-3" />;
  if (t.includes('solidity') || t.includes('security')) return <Lock className="w-3 h-3" />;
  if (t.includes('hsm') || t.includes('vault')) return <ShieldCheck className="w-3 h-3" />;
  if (t.includes('kafka') || t.includes('message')) return <MessageSquare className="w-3 h-3" />;
  if (t.includes('infrastructure') || t.includes('cloud')) return <Globe className="w-3 h-3" />;
  return <Terminal className="w-3 h-3" />;
};

export default function ProjectPreview({ project, featured = false }: ProjectPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        scale: { duration: 0.4 },
        y: { duration: 0.4 }
      }}
      viewport={{ once: true, margin: "-100px" }}
      className={`group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-brand/50 transition-all duration-300 ${
        featured ? 'md:grid md:grid-cols-2' : ''
      } hover:shadow-[0_30px_60px_rgba(108,92,231,0.2)]`}
      id={`project-preview-${project.slug}`}
    >
      <div className={`p-6 sm:p-8 flex flex-col justify-between ${featured ? 'md:border-r md:border-white/10' : ''}`}>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {project.status && (
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                project.status === 'Ongoing' 
                  ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' 
                  : 'bg-green-500/10 border-green-500/20 text-green-500'
              }`}>
                {project.status}
              </span>
            )}
            {project.categories?.map((category) => (
              <span key={category} className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono text-white bg-brand/30 border border-brand/40 px-2 py-0.5 rounded">
                {category}
              </span>
            ))}
            {project.techStack.map((tech) => (
              <span key={tech} className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono text-brand border border-brand/20 px-2 py-0.5 rounded bg-brand/5">
                {getTechIcon(tech)}
                {tech}
              </span>
            ))}
          </div>
          <h3 className="text-2xl font-bold mb-4 group-hover:text-brand transition-colors">{project.title}</h3>
          <p className="text-gray-400 mb-6 line-clamp-3">{project.summary}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 text-white font-medium hover:text-brand transition-colors"
          >
            Case Study <ArrowRight className="w-4 h-4" />
          </Link>
          {project.status === 'Finished' && project.projectLink && (
            <a 
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono text-gray-500 hover:text-brand flex items-center gap-1 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Live <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {project.status === 'Ongoing' && project.testLink && (
            <a 
              href={project.testLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono text-gray-500 hover:text-brand flex items-center gap-1 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Test <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {featured && (
        <div className="hidden md:flex items-center justify-center bg-brand/5 p-12">
          <Code2 className="w-32 h-32 text-brand/20" />
        </div>
      )}
    </motion.div>
  );
}
