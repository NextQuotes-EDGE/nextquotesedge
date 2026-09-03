import matter from 'gray-matter';
import React from 'react';

// Use import.meta.glob to load MDX files at build time (fallback)
const mdxFiles = import.meta.glob('../content/projects/*.mdx', { query: '?raw', import: 'default', eager: true });

export type Project = {
  title: string;
  slug: string;
  summary: string;
  featured: boolean;
  techStack: string[];
  categories: string[];
  status?: 'Ongoing' | 'Finished';
  projectLink?: string;
  testLink?: string;
  githubUrl?: string;
  featuredImage?: string;
  highlights?: string[];
  content: string;
  date?: string;
}

export function getStaticProjects(): Project[] {
  const projects = Object.entries(mdxFiles).map(([_path, rawContent]) => {
    const { data, content } = matter(rawContent as string);
    const slug = _path.split('/').pop()?.replace('.mdx', '') || '';
    return {
      ...(data as any),
      content,
      slug,
      status: data.status || 'Finished' // Default to finished for existing ones
    } as Project;
  });

  return projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });
}

// Deprecated: use useProjects instead for CMS support
export function getProjects(): Project[] {
  return getStaticProjects();
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getStaticProjects().find((p) => p.slug === slug);
}

export function useProjects() {
  const [projects, setProjects] = React.useState<Project[]>(getStaticProjects());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
          }));
        }
      })
      .catch(err => console.error("Failed to fetch projects from CMS:", err))
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading };
}
