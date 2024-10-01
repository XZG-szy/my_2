// frontend/vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080, // 修改为你想要的端口，前端端口
    proxy: {
      '/api': {
        target: 'http://localhost:5000',//后端端口
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
