import { createBrowserRouter, RouterProvider } from 'react-router'

// Layouts
import { PublicLayout } from '@/components/layout/public-layout'
import { AppLayout } from '@/components/layout/app-layout'

// Pages publiques
import { HomePage } from '@/app/(public)/home-page'
import { FinderPage } from '@/app/(public)/finder-page'
import { PricingPage } from '@/app/(public)/pricing-page'
import { LoginPage } from '@/app/(public)/login-page'
import { SignupPage } from '@/app/(public)/signup-page'
import { AuthCallbackPage } from '@/app/(public)/auth-callback-page'

// Pages authentifiées
import { DashboardPage } from '@/app/(auth)/dashboard-page'
import { ProjectNewPage } from '@/app/(auth)/project-new-page'
import { ProjectPage } from '@/app/(auth)/project-page'
import { PhasePage } from '@/app/(auth)/phase-page'
import { SettingsPage } from '@/app/(auth)/settings-page'

const router = createBrowserRouter([
  // ── Pages publiques (LIGHT) ──────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/finder', element: <FinderPage /> },
      { path: '/pricing', element: <PricingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/auth/callback', element: <AuthCallbackPage /> },
    ],
  },

  // ── Pages authentifiées (DARK) ───────────────────────────────────
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/project/new', element: <ProjectNewPage /> },
      { path: '/project/:id', element: <ProjectPage /> },
      { path: '/project/:id/phase/:phase', element: <PhasePage /> },
      { path: '/settings', element: <SettingsPage /> },
      {
        path: '/club',
        element: (
          <div className="flex items-center justify-center h-64">
            <p className="text-[#555570]">Buildrs Club — bientôt disponible</p>
          </div>
        ),
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
