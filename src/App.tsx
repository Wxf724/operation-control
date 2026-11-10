import { BrowserRouter, HashRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'

import { AppRoutes } from './router'
import i18n from './i18n'
import { GuidedTour } from './features/guided-tour/GuidedTour'

/**
 * 直接用 file:// 双击 index.html 打开时没有服务端，BrowserRouter 的 history 路由会失效，
 * 这种情况降级成 HashRouter（地址变成 index.html#/drill/xxx），其余场景（http 部署）仍用 BrowserRouter。
 */
const isFileProtocol = typeof window !== 'undefined' && window.location.protocol === 'file:'
const Router = isFileProtocol ? HashRouter : BrowserRouter
const routerProps = isFileProtocol ? {} : { basename: __BASE_PATH__ }

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router {...routerProps}>
        <AppRoutes />
        <GuidedTour />
      </Router>
    </I18nextProvider>
  )
}

export default App
