import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['ghiras-logo.svg'], 
      manifest: {
        name: 'غِراس - بستانك من الذكر', 
        short_name: 'غِراس', 
        description: 'تطبيق ذكي للأذكار اليومية يتطور مع تسبيحك ليغرس لك حديقة في الجنة.',
        start_url: '/DhikrBook/', 
        theme_color: '#0d9488', 
        background_color: '#0f172a',
        display: 'standalone', 
        icons: [
          {
            src: 'ghiras-logo.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  base: '/DhikrBook/'
})