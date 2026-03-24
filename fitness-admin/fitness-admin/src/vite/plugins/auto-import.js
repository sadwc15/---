import autoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default function createAutoImport() {
    return autoImport({
        imports: [
            'vue',
            'vue-router',
            {
                'element-plus': ['ElMessage', 'ElMessageBox', 'ElNotification', 'ElLoading']
            }
        ],
        resolvers: [ElementPlusResolver()],
        dts: 'src/auto-imports.d.ts',
        eslintrc: {
            enabled: true,
            filepath: './.eslintrc-auto-import.json'
        }
    })
}
