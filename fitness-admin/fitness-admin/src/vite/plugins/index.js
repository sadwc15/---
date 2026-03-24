import vue from '@vitejs/plugin-vue'
import createAutoImport from './auto-import.js'
import createComponents from './components.js'
import createCompression from './compression.js'
import createSetupExtend from './setup-extend.js'
import createSvgIcons from './svg-icons'

export default function createVitePlugins(env, isBuild = false) {
  const vitePlugins = [vue()]
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createComponents())
  vitePlugins.push(createSetupExtend())
  vitePlugins.push(createSvgIcons(isBuild))
  isBuild && vitePlugins.push(...createCompression(env))
  return vitePlugins
}
