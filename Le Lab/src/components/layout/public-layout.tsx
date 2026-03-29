import { Outlet } from 'react-router'
import { PublicHeader } from './public-header'
import { PublicFooter } from './public-footer'

/**
 * Layout LIGHT — pages publiques (landing, finder, pricing, auth)
 * Fond blanc, header blanc, footer noir
 */
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}

export { PublicLayout }
