import React from 'react';
import Hero from '../components/Hero.tsx';
import ProjectPreview from '../components/ProjectPreview.tsx';
import About from '../components/About.tsx';
import CTA from '../components/CTA.tsx';
import Navbar from '../components/Navbar.tsx';
import { useProjects } from '../lib/projects.ts';
import { useSiteConfig } from '../lib/config.ts';
import { Layers, Zap, Cpu, Database } from 'lucide-react';

export default function HomePage() {
  const { projects: allProjects } = useProjects();
  const { config } = useSiteConfig();
  const featuredProjects = allProjects.filter(p => p.featured).slice(0, 2);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Layers': return <Layers className="w-8 h-8 text-brand" />;
      case 'Zap': return <Zap className="w-8 h-8 text-brand" />;
      case 'Cpu': return <Cpu className="w-8 h-8 text-brand" />;
      case 'Database': return <Database className="w-8 h-8 text-brand" />;
      default: return <Zap className="w-8 h-8 text-brand" />;
    }
  };

  const services = config.services.map(s => ({
    ...s,
    icon: getIcon(s.iconType)
  }));

  return (
    <main className="min-h-screen bg-bg-dark pt-16">
      <Navbar />
      <Hero />

      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="featured-projects">
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Featured Engineering</h2>
            <p className="text-gray-400">Selected case studies demonstrating system architecture and problem-solving.</p>
          </div>
        </div>
        <div className="grid gap-8">
          {featuredProjects.map(project => (
            <ProjectPreview key={project.slug} project={project} featured />
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white/[0.02]" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Expertise</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Specializing in systems that require high performance and unwavering uptime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-xl hover:border-brand/40 transition-colors" id={`service-${idx}`}>
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <About />

      <CTA />

      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} NextQuotesEdge. Built for reliability.</p>
      </footer>
    </main>
  );
}
