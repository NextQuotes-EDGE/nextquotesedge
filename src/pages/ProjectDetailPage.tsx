import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/Navbar.tsx';
import CTA from '../components/CTA.tsx';
import { useProjects } from '../lib/projects.ts';
import { ChevronLeft, Calendar, Tag, ExternalLink } from 'lucide-react';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { projects, loading } = useProjects();
  const project = projects.find(p => p.slug === slug);

  if (loading) {
    return (
      <main className="min-h-screen bg-bg-dark pt-32 flex items-center justify-center">
        <div className="text-brand font-mono animate-pulse">Initializing System Node...</div>
      </main>
    );
  }

  if (!project) {
    return <Navigate to="/404" />;
  }

  return (
    <main className="min-h-screen bg-bg-dark pt-32">
      <Navbar />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <Link 
          to="/projects" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-brand mb-12 transition-colors"
          id="back-to-projects"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Projects
        </Link>

        <header className="mb-16">
          <div className="flex flex-wrap gap-4 mb-4">
            {project.status === 'Finished' && project.projectLink && (
              <a 
                href={project.projectLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2 bg-brand text-white rounded font-bold hover:bg-brand/80 transition-all text-sm"
              >
                View Live System <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.status === 'Ongoing' && project.testLink && (
              <a 
                href={project.testLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 text-white border border-white/20 rounded font-bold hover:bg-white/20 transition-all text-sm"
              >
                Access Beta Test <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">{project.title}</h1>
          
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {project.status && (
              <span className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded border ${
                project.status === 'Ongoing' 
                  ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-500' 
                  : 'bg-green-500/20 border-green-500/30 text-green-500'
              }`}>
                <Tag className="w-3 h-3" /> {project.status}
              </span>
            )}
            {project.featured && (
              <span className="flex items-center gap-1.5 text-xs font-mono text-brand bg-brand/10 border border-brand/30 px-3 py-1 rounded">
                <Tag className="w-3 h-3" /> Featured
              </span>
            )}
            {project.categories?.map(category => (
              <span key={category} className="flex items-center gap-1.5 text-xs font-mono text-white bg-brand/40 border border-brand/50 px-3 py-1 rounded shadow-[0_0_10px_rgba(108,92,231,0.2)]">
                <Tag className="w-3 h-3" /> {category}
              </span>
            ))}
            {project.date && (
              <span className="flex items-center gap-1.5 text-xs font-mono text-white/60 bg-white/5 border border-white/10 px-3 py-1 rounded">
                <Calendar className="w-3 h-3" /> {new Date(project.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            )}
            <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="text-xs font-mono text-brand bg-brand/5 border border-brand/20 px-3 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xl text-gray-400 leading-relaxed">{project.summary}</p>
        </header>

        <div className="markdown-body">
          <ReactMarkdown>{project.content}</ReactMarkdown>
        </div>
      </article>

      <CTA />

      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} NextQuotesEdge. Built for reliability.</p>
      </footer>
    </main>
  );
}
