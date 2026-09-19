import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // The site is deployed to a GitHub Pages PROJECT site: https://<user>.github.io/shada-khaled/ —
  // everything (scripts, styles, fonts, images) is served from under that "/shada-khaled/" folder,
  // not from the domain root. This tells Vite to build every asset URL with that prefix.
  // Moving to a custom domain or a github.io USER site later? Change this back to '/'.
  base: '/shada-khaled/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    // Stamped at build time → the footer shows "Last updated: Sep 2026" without manual edits
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
})
