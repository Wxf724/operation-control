import fs from 'node:fs'

/**
 * 离线包收尾脚本：`vite build --config vite.config.offline.ts` 之后跑一遍。
 *
 * Chrome 不允许从 file:// 加载 ES module，所以把入口脚本从
 * `<script type="module" crossorigin src="./assets/app.js">` 改成普通延迟脚本，
 * 顺手去掉样式表上的 crossorigin。
 */
const file = 'dist-offline/index.html'

if (!fs.existsSync(file)) {
  console.error(`${file} 不存在，请先跑 vite build --config vite.config.offline.ts`)
  process.exit(1)
}

let html = fs.readFileSync(file, 'utf8')

html = html
  .replace(
    /<script type="module" crossorigin src="(\.\/assets\/app\.js)"><\/script>/,
    '<script defer src="$1"></script>'
  )
  .replace(/<link rel="stylesheet" crossorigin href="(\.\/assets\/style\.css)">/, '<link rel="stylesheet" href="$1">')

if (html.includes('type="module"')) {
  console.warn('警告：index.html 里仍有 module 脚本，file:// 下可能打不开')
}

fs.writeFileSync(file, html, 'utf8')
console.log('patched dist-offline/index.html（file:// 可用）')
