// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),
//     , tailwindcss()
//   ],
//   server: {
//     proxy: {
//       "/api": "http://localhost:5000", // Redirects /api/* to backend
//     },
//   },
  
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      // API routes
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      // Socket.IO routes
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})

