import { Outlet } from 'react-router-dom'

export function PublicShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="site-shell public-shell">
      <header className="site-header public-header">
        <div className="header-inner">
          <a className="brand" href="/" aria-label="Animal Rescue home">
            <span className="brand-mark" aria-hidden="true">AR</span>
            <span>Animal Rescue</span>
          </a>
          <nav aria-label="Public navigation">
            <a className="nav-link" href="/#how-it-works">How it works</a>
            <a className="nav-link" href="/#about">About the rescue</a>
          </nav>
          <div className="header-actions">
            <a className="button button-quiet" href="/auth/sign-in">Sign in</a>
            <a className="button button-primary" href="/auth/register">Get started</a>
          </div>
        </div>
      </header>
      {children ?? <Outlet />}
    </div>
  )
}
