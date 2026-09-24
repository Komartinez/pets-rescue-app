import { useAuth } from '../../auth/auth-context'

export function AccountPage() {
  const auth = useAuth()
  return (
    <section className="content-section narrow-section">
      <span className="eyebrow">Your account</span>
      <h1>Account settings</h1>
      <p className="lead">Your account foundation is ready. Profile details will be added in the next step.</p>
      <div className="info-card"><strong>Signed in as</strong><span>{auth.user?.email ?? 'your account'}</span></div>
    </section>
  )
}
