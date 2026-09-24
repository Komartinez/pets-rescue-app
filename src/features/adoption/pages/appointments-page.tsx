import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { useAuth } from '../../auth/auth-context'
import { listApplications, listAppointments, requestAppointment } from '../adoption-service'
import type { AdoptionApplication, Appointment } from '../domain'

export function AppointmentsPage() {
  const auth = useAuth()
  const [params] = useSearchParams()
  const applicationId = params.get('application')
  const [applications, setApplications] = useState<AdoptionApplication[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void Promise.all([listApplications(), listAppointments()]).then(([loadedApplications, loadedAppointments]) => { setApplications(loadedApplications); setAppointments(loadedAppointments) }).catch(() => setError('We could not load your appointments.'))
  }, [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!auth.user || !applicationId) return
    setBusy(true)
    setError(null)
    try { await requestAppointment({ application_id: applicationId, applicant_id: auth.user.id, requested_start: new Date(start).toISOString(), requested_end: new Date(end).toISOString(), applicant_notes: notes }); window.location.href = '/app/appointments' } catch { setError('We could not request that appointment. Please choose another time.') } finally { setBusy(false) }
  }

  return <section className="content-section">
    <span className="eyebrow">Meet the rescue team</span>
    <h1>Appointments</h1>
    <p className="lead">Request a time that works for you. The rescue team will confirm it before it is added to the calendar.</p>
    {applicationId && <form className="workflow-form compact-form" onSubmit={submit}><label>Application<select required defaultValue={applicationId} disabled><option value={applicationId}>{applications.find((application) => application.id === applicationId)?.animal?.name ?? 'Selected application'}</option></select></label><label>Preferred start<input required type="datetime-local" value={start} onChange={(event) => setStart(event.target.value)} /></label><label>Preferred end<input required type="datetime-local" value={end} onChange={(event) => setEnd(event.target.value)} /></label><label>Notes<textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary" disabled={busy}>{busy ? 'Requesting…' : 'Request appointment'}</button></form>}
    {!applicationId && <div className="info-card"><strong>Choose an application first</strong><span>Appointments are connected to a specific adoption conversation.</span><Link className="button button-primary" to="/app/applications">View applications</Link></div>}
    <div className="stack-list">{appointments.map((appointment) => <article className="info-card" key={appointment.id}><strong>{appointment.animal_name ?? 'Appointment request'}</strong><span className="status-pill">{appointment.status.replaceAll('_', ' ')}</span><span>{new Date(appointment.requested_start).toLocaleString()}</span></article>)}</div>
  </section>
}
