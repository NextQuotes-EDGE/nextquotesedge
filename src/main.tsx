import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Buffer} from 'buffer';
import App from './App.tsx';
import './index.css';

// Fix for gray-matter Buffer dependency in the browser
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
