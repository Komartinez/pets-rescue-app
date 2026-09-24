import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { getAuthErrorMessage, signIn } from '../auth-service'
import { AuthLayout, FormError } from './auth-layout'

export function SignInForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await signIn(email.trim(), password)
      navigate('/app')
    } catch (signInError) {
      setError(getAuthErrorMessage(signInError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" intro="Sign in to continue your journey with the rescue team.">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="sign-in-email">Email address</label>
        <input id="sign-in-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <div className="label-row"><label htmlFor="sign-in-password">Password</label><Link to="/auth/recover">Forgot password?</Link></div>
        <input id="sign-in-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        <FormError message={error} />
        <button className="button button-primary button-full" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="form-footer">New here? <Link to="/auth/register">Create an account</Link></p>
    </AuthLayout>
  )
}
