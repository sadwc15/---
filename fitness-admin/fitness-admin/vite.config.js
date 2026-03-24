import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    // 自动导入 Vue 和 Vue Router API
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          'element-plus': ['ElMessage', 'ElMessageBox', 'ElNotification', 'ElLoading']
        }
      ],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true, // 生成 .eslintrc-auto-import.json
        filepath: './.eslintrc-auto-import.json'
      }
    }),
    // 自动导入 Element Plus 组件
    Components({
      resolvers: [
        ElementPlusResolver()
      ],
      dts: 'src/components.d.ts',
      dirs: ['src/components'], // 自动注册全局组件
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 80, // 开发服务器端口
    open: true, // 自动打开浏览器
    proxy: {
      // 代理配置，解决跨域问题
      '/api': {
        target: 'http://localhost:8081', // 你的后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 2000
  }
})
