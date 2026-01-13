
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

console.log('🚀 Main.tsx - Démarrage de Web Spider');

const rootElement = (globalThis as any).document?.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found');
} else {
  const root = createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('✅ Application Web Spider démarrée');
}
