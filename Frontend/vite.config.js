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

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: import.meta.env.VITE_SOCKET_URL_PROD || 'http://localhost:5000',
        changeOrigin: true,
        ws: true,
      },
      '/socket.io': {
        target: import.meta.env.VITE_SOCKET_URL_PROD || 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
      }
    }
  }
});
