import { BrowserRouter } from 'react-router-dom'

import { ErrorBoundary } from './error-boundary'
import { AppRouter } from './router'
import { AuthProvider } from '../features/auth/auth-context'

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
