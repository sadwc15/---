import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
export default function createSvgIcons(isBuild) {
    return svgIcons({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: isBuild
    })
}
