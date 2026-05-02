import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import AppProviders from './app/provider/app_provider'

createRoot(document.getElementById('root')!).render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
)
