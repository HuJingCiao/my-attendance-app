import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { VitePWA } from 'vite-plugin-pwa' // 1. 確保有導入 PWA 插件

export default defineConfig({
  plugins: [
    vue(),
    // 2. 保留原本的 Vant 自動按需引入 (這行沒了畫面就會亂掉)
    Components({
      resolvers: [VantResolver()],
    }),
    // 3. 在下方新增 PWA 設定
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: '企業員工打卡系統',
        short_name: '員工打卡',
        description: '基於 Vue3 + Express 的全端打卡方案',
        theme_color: '#1989fa',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})