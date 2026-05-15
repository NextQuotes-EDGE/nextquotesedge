import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-4">
      <Navbar />
      <div className="text-center">
        <h1 className="text-9xl font-bold text-brand mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-8">System Address Not Found</h2>
        <p className="text-gray-400 mb-12 max-w-md mx-auto">
          The requested page does not exist or has been moved to a different node in the network.
        </p>
        <Link 
          to="/" 
          className="inline-flex px-8 py-3 bg-brand text-white rounded-md font-medium hover:bg-opacity-90 transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    </main>
  );
}
