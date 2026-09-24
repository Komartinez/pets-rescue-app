import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { getAuthErrorMessage, registerApplicant } from '../auth-service'
import { AuthLayout, FormError } from './auth-layout'

export function RegisterForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setBusy(true)
    try {
      const result = await registerApplicant(email.trim(), password)
      if (result.session) navigate('/app')
      else setMessage('Check your email to confirm your account, then come back to sign in.')
    } catch (registrationError) {
      setError(getAuthErrorMessage(registrationError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="Start your adoption journey" intro="Create a secure account so your future adoption journey can stay connected and private.">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="register-email">Email address</label>
        <input id="register-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <label htmlFor="register-password">Password</label>
        <input id="register-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
        <p className="field-hint">Use at least 8 characters.</p>
        <FormError message={error} />
        {message && <p className="form-success" role="status">{message}</p>}
        <button className="button button-primary button-full" type="submit" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      </form>
      <p className="form-footer">Already have an account? <Link to="/auth/sign-in">Sign in</Link></p>
    </AuthLayout>
  )
}
