import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import tailwindcss from '@tailwindcss/vite'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { WayUIResolver } from '@way-ui/unplugin/resolvers'

export const plugins = [
  vue(),
  vueJsx(),
  vueDevTools({ launchEditor: 'code' }),
  AutoImport({
    imports: ['vue', 'vue-router', 'pinia'],
    dts: './src/types/auto-imports.d.ts',
    resolvers: [ElementPlusResolver(), WayUIResolver()],
    eslintrc: { enabled: false },
  }),
  Components({
    resolvers: [
      IconsResolver({ prefix: 'i', enabledCollections: ['ep'] }),
      ElementPlusResolver({ importStyle: false }),
      WayUIResolver(),
    ],
    dts: './src/types/components.d.ts',
  }),
  Icons({ scale: 1, compiler: 'vue3' }),
  createSvgIconsPlugin({
    iconDirs: [fileURLToPath(new URL('../src/assets/icons', import.meta.url))],
    symbolId: 'icon-[dir]-[name]',
    svgoOptions: true,
  }),
  tailwindcss(),
]
