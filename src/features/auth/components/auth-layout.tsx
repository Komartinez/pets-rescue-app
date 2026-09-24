import { Link } from 'react-router-dom'

export function AuthLayout({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link className="brand auth-brand" to="/">
          <span className="brand-mark" aria-hidden="true">AR</span>
          <span>Animal Rescue</span>
        </Link>
        <span className="eyebrow">A thoughtful beginning</span>
        <h1>{title}</h1>
        <p className="lead">{intro}</p>
        {children}
      </div>
    </main>
  )
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return <p className="form-error" role="alert">{message}</p>
}
