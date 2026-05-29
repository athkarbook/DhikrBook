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
      includeAssets: ['icon-192x192.png', 'icon-512x512.png'], // الأيقونات التي أضفتها
      manifest: {
        name: 'أذكار الصباح والمساء', // الاسم الكامل
        short_name: 'الأذكار', // الاسم القصير الذي يظهر تحت الأيقونة في الهاتف
        description: 'تطبيق أذكار الصباح والمساء لفضيلة د. مطلق الجاسر',
        start_url: '/DhikrBook/', // هذا السطر هو الذي يوقظ زر التثبيت
        theme_color: '#0d9488', // هذا لون التيل (Teal-600) ليتناسق مع تصميمك
        background_color: '#ffffff',
        display: 'standalone', // هذا الأمر يجعله يفتح كبرنامج مستقل بدون شريط المتصفح العلوي
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: '/DhikrBook/',
})