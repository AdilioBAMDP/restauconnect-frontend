import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      // Séparation des chunks vendor pour de meilleures performances
      splitVendorChunkPlugin()
    ],
    define: {
      // Exposer les variables VITE_ explicitement
      'import.meta.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL || 'https://restauconnect-backen-production-70be.up.railway.app/api'
      ),
      // @ts-expect-error: JSON est disponible globalement à l'exécution
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      // @ts-expect-error: JSON est disponible globalement à l'exécution
      __DEFINES__: JSON.stringify({})
    },
    resolve: {
    alias: [
      {
        find: /^@\//,
        replacement: fileURLToPath(new URL('./src/', import.meta.url))
      },
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url))
      }
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    open: false,
    allowedHosts: ['pendente-skintight-shona.ngrok-free.dev'],
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    },
    // Ajout du fallback SPA pour éviter les 404 sur les routes React
    historyApiFallback: true
  },
  preview: {
    port: 5173,
    host: true,
    strictPort: true
  },
  // Optimisations de build pour la production
  build: {
    // Séparation des chunks pour réduire la taille initiale
    rollupOptions: {
      output: {
        manualChunks: {
          // Chunk pour les bibliothèques UI (React, Framer Motion, etc.)
          ui: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
          // Chunk pour les utilitaires (date-fns, axios, etc.)
          utils: ['axios', 'date-fns', 'uuid', 'yup'],
          // Chunk pour les bibliothèques de données (Zustand, Supabase)
          data: ['zustand', '@supabase/supabase-js'],
          // Chunk pour Stripe (chargé seulement quand nécessaire)
          stripe: ['@stripe/react-stripe-js', '@stripe/stripe-js'],
          // Chunk pour les graphiques (Recharts)
          charts: ['recharts'],
          // Chunk pour Socket.IO
          realtime: ['socket.io-client']
        }
      }
    },
    // Optimisations supplémentaires
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false, // Désactiver en prod pour réduire la taille
    chunkSizeWarningLimit: 1000
  },
  // Optimisations des dépendances
  optimizeDeps: {
    exclude: ['lucide-react'], // Évite les problèmes avec les icônes
    include: [
      'react',
      'react-dom',
      'framer-motion',
      '@stripe/react-stripe-js',
      'axios',
      'zustand'
    ]
  }
});
}