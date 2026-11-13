import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

/**
 * 两个独立静态驾驶舱的承载页。
 *
 * 源文件是完整的 HTML 文档（自带 html/head/body、内联样式与脚本），
 * 不能作为 React 组件渲染，因此放在 public/ 由 Vite 原样提供，
 * 这里用全屏 iframe 加载，外层只保留一个返回入口。
 */
const HTML_PAGES: Record<string, { file: string; title: string }> = {
  'yanzhi-business': {
    file: 'yanzhi-business.html',
    title: '智慧园区运营管理驾驶舱',
  },
  'quality-supervision': {
    file: 'quality-supervision.html',
    title: '工程质量监督管理驾驶舱',
  },
}

export function HtmlViewScreen() {
  const navigate = useNavigate()
  const { pageKey } = useParams<{ pageKey: string }>()
  const page = pageKey ? HTML_PAGES[pageKey] : undefined
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
  }, [pageKey])

  if (!page) return <Navigate to="/" replace />

  return (
    <div className="theme-cloud-light relative h-screen w-screen overflow-hidden bg-slate-950">
      {/* 静态页就绪前先铺上与驾驶舱同色的底，避免白屏闪烁 */}
      {!loaded ? (
        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center gap-4">
          <span className="text-[16px] font-medium tracking-[0.22em] text-cyan-100/75">
            {page.title}
          </span>
          <span className="h-[2px] w-[120px] animate-pulse rounded-full bg-cyan-400/40" />
        </div>
      ) : null}

      <iframe
        key={page.file}
        src={`${import.meta.env.BASE_URL}${page.file}`}
        title={page.title}
        onLoad={() => setLoaded(true)}
        className={`relative z-[1] h-full w-full border-0 transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />

      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute top-3 right-4 z-10 cursor-pointer rounded-[4px] border border-cyan-400/50 bg-slate-900/80 px-3 py-1.5 text-[13px] text-cyan-100 transition-colors hover:bg-slate-800"
      >
        返回全景座舱
      </button>
    </div>
  )
}
