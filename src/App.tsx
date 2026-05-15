/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import ProjectsPage from './pages/ProjectsPage.tsx';
import ProjectDetailPage from './pages/ProjectDetailPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import AnimatedBackground from './components/AnimatedBackground.tsx';
import ScrollProgress from './components/ScrollProgress.tsx';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  return (
    <Router>
      <ScrollProgress />
      <AnimatedBackground />
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] noise-overlay" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
