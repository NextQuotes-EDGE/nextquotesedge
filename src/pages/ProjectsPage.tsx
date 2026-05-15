import React from 'react';
import Navbar from '../components/Navbar.tsx';
import ProjectPreview from '../components/ProjectPreview.tsx';
import CTA from '../components/CTA.tsx';
import { useProjects } from '../lib/projects.ts';

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const { projects, loading } = useProjects();
  
  const allCategories = Array.from(new Set(projects.flatMap(p => p.categories || [])));

  const filteredProjects = activeCategory 
    ? projects.filter(p => p.categories?.includes(activeCategory))
    : projects;

  if (loading) {
    return (
      <main className="min-h-screen bg-bg-dark pt-32 flex items-center justify-center">
        <div className="text-brand font-mono animate-pulse">Initializing System Projects...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-dark pt-32">
      <Navbar />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Engineering Case Studies</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            A comprehensive look into my technical process, from initial constraints to final system deployment.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-md font-mono text-sm transition-all ${
              activeCategory === null 
                ? 'bg-brand text-white shadow-[0_0_15px_rgba(108,92,231,0.3)]' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            All Systems
          </button>
          {allCategories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-md font-mono text-sm transition-all ${
                activeCategory === category 
                  ? 'bg-brand text-white shadow-[0_0_15px_rgba(108,92,231,0.3)]' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <ProjectPreview key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/5 rounded-xl border border-dashed border-white/10">
            <p className="text-gray-400">No projects found. Check back soon for new case studies.</p>
          </div>
        )}
      </section>

      <CTA />

      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} NextQuotesEdge. Built for reliability.</p>
      </footer>
    </main>
  );
}
