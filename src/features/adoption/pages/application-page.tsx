import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { useAuth } from '../../auth/auth-context'
import { createApplication, getAnimal, listApplications } from '../adoption-service'
import type { AdoptionApplication, Animal } from '../domain'

export function ApplicationPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const animalId = params.get('animal')
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [applications, setApplications] = useState<AdoptionApplication[]>([])
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (animalId) void getAnimal(animalId).then(setAnimal).catch(() => setError('We could not load that animal.'))
    if (!animalId) void listApplications().then(setApplications).catch(() => setError('We could not load your applications.'))
  }, [animalId])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!auth.user || !animalId) return
    setBusy(true)
    setError(null)
    try {
      await createApplication(auth.user.id, animalId, message)
      navigate('/app/applications')
    } catch { setError('We could not submit your application. Please try again.') } finally { setBusy(false) }
  }

  if (!animalId) return <ApplicationsList applications={applications} error={error} />
  return <section className="content-section narrow-section form-section">
    <span className="eyebrow">Adoption application</span>
    <h1>{animal ? `Tell us about ${animal.name}.` : 'Loading animal details…'}</h1>
    <p className="lead">Your application starts a conversation with the rescue team. Final decisions are always made by people who know the animals and the adoption process.</p>
    <form className="workflow-form" onSubmit={submit}>
      <label>What would you like the rescue team to know?<textarea required minLength={20} rows={7} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tell us about your home, your hopes, and any questions you have." /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="workflow-actions"><button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Submitting…' : 'Submit application'}</button><Link className="button button-secondary" to="/app/recommendations">Cancel</Link></div>
    </form>
  </section>
}

function ApplicationsList({ applications, error }: { applications: AdoptionApplication[]; error: string | null }) {
  return <section className="content-section">
    <span className="eyebrow">Your journey</span>
    <h1>Adoption applications</h1>
    <p className="lead">Follow each conversation from submission through the rescue team’s review.</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    {!error && !applications.length && <div className="info-card"><strong>No applications yet</strong><span>Complete the questionnaire to discover animals who may be a good fit.</span><Link className="button button-primary" to="/app/recommendations">See recommendations</Link></div>}
    <div className="stack-list">{applications.map((application) => <article className="info-card" key={application.id}><strong>{application.animal?.name ?? 'Animal application'}</strong><span className="status-pill">{application.status.replaceAll('_', ' ')}</span><span>{application.applicant_message}</span>{['submitted', 'under_review'].includes(application.status) && <Link className="button button-secondary" to={`/app/appointments/new?application=${application.id}`}>Request an appointment</Link>}</article>)}</div>
  </section>
}
