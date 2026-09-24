import { useEffect, useState } from 'react'

import { listAppointments, updateAppointmentStatus } from '../../adoption/adoption-service'
import type { Appointment, AppointmentStatus } from '../../adoption/domain'

const statuses: AppointmentStatus[] = ['requested', 'confirmed', 'completed', 'cancelled', 'no_show']

export function StaffAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [error, setError] = useState<string | null>(null)
  const refresh = () => void listAppointments().then(setAppointments).catch(() => setError('We could not load appointments.'))
  useEffect(refresh, [])
  async function changeStatus(id: string, status: AppointmentStatus) { try { await updateAppointmentStatus(id, status); refresh() } catch { setError('We could not update that appointment.') } }
  return <section className="content-section"><span className="eyebrow">Rescue calendar</span><h1>Appointments</h1><p className="lead">Confirm requests here. Outlook synchronization can be enabled through the secure integration boundary when credentials are configured.</p>{error && <p className="form-error" role="alert">{error}</p>}<div className="stack-list">{appointments.map((appointment) => <article className="info-card staff-record" key={appointment.id}><strong>{appointment.animal_name ?? 'Appointment request'}</strong><span>{new Date(appointment.requested_start).toLocaleString()} – {new Date(appointment.requested_end).toLocaleString()}</span><label>Status<select value={appointment.status} onChange={(event) => void changeStatus(appointment.id, event.target.value as AppointmentStatus)}>{statuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}</select></label></article>)}</div></section>
}
