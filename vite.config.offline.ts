import { defineConfig } from 'vite'

import appConfig from './vite.config'

/**
 * 「双击就能看」的离线包构建配置（`npm run build:offline`）。
 *
 * 与常规构建的差别只有三处：
 *   1. base 改相对路径 `./`，file:// 下资源才找得到；
 *   2. 产物打成一个 IIFE 单文件（`inlineDynamicImports`），并关掉 module 预加载——
 *      Chrome 不允许 file:// 加载 ES module，必须出成普通 script；
 *   3. 输出到 dist-offline，不影响 dist 的正常部署产物。
 */
export default defineConfig(async (env) => {
  const base = await (typeof appConfig === 'function' ? appConfig(env) : appConfig)

  return {
    ...base,
    base: './',
    build: {
      ...base.build,
      outDir: 'dist-offline',
      sourcemap: false,
      modulePreload: false,
      cssCodeSplit: false,
      rollupOptions: {
        ...base.build?.rollupOptions,
        output: {
          format: 'iife' as const,
          inlineDynamicImports: true,
          entryFileNames: 'assets/app.js',
          chunkFileNames: 'assets/app-[name].js',
          assetFileNames: 'assets/[name][extname]',
        },
      },
    },
  }
})
