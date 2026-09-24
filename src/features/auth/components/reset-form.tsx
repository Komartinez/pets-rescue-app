import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { getAuthErrorMessage, resetPassword } from '../auth-service'
import { AuthLayout, FormError } from './auth-layout'

export function ResetForm() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await resetPassword(password)
      setMessage('Your password has been updated. You can now continue to your account.')
      setTimeout(() => navigate('/app'), 400)
    } catch (resetError) {
      setError(getAuthErrorMessage(resetError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout title="Choose a new password" intro="Create a new password for your rescue platform account.">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="reset-password">New password</label>
        <input id="reset-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
        <FormError message={error} />
        {message && <p className="form-success" role="status">{message}</p>}
        <button className="button button-primary button-full" type="submit" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</button>
      </form>
      <p className="form-footer"><Link to="/auth/sign-in">Back to sign in</Link></p>
    </AuthLayout>
  )
}
