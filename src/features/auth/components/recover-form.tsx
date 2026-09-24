import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { getAuthErrorMessage, requestPasswordRecovery } from '../auth-service'
import { AuthLayout, FormError } from './auth-layout'

export function RecoverForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setBusy(true)
    try {
      await requestPasswordRecovery(email.trim())
      setMessage('If an account matches that email, recovery instructions are on their way.')
    } catch (recoveryError) {
      setError(getAuthErrorMessage(recoveryError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="Find your way back" intro="Enter your email and we’ll help you reset your password.">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="recover-email">Email address</label>
        <input id="recover-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <FormError message={error} />
        {message && <p className="form-success" role="status">{message}</p>}
        <button className="button button-primary button-full" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send recovery email'}</button>
      </form>
      <p className="form-footer"><Link to="/auth/sign-in">Back to sign in</Link></p>
    </AuthLayout>
  )
}
