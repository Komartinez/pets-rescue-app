import { useEffect, useState } from 'react'

import { listApplications, updateApplicationStatus } from '../../adoption/adoption-service'
import type { AdoptionApplication } from '../../adoption/domain'

const statuses: AdoptionApplication['status'][] = ['submitted', 'under_review', 'appointment_requested', 'appointment_scheduled', 'approved', 'rejected', 'completed']

export function StaffApplicationsPage() {
  const [applications, setApplications] = useState<AdoptionApplication[]>([])
  const [error, setError] = useState<string | null>(null)
  const refresh = () => void listApplications().then(setApplications).catch(() => setError('We could not load applications.'))
  useEffect(refresh, [])
  async function changeStatus(id: string, status: AdoptionApplication['status']) { try { await updateApplicationStatus(id, status); refresh() } catch { setError('We could not update that application.') } }
  return <section className="content-section"><span className="eyebrow">Applicant review</span><h1>Applications</h1><p className="lead">Review the person, the animal, and the conversation together. Status changes are visible to the applicant.</p>{error && <p className="form-error" role="alert">{error}</p>}<div className="stack-list">{applications.map((application) => <article className="info-card staff-record" key={application.id}><strong>{application.animal?.name ?? 'Animal application'}</strong><span>Applicant: {application.applicant_id}</span><span>{application.applicant_message}</span><label>Status<select value={application.status} onChange={(event) => void changeStatus(application.id, event.target.value as AdoptionApplication['status'])}>{statuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}</select></label></article>)}</div></section>
}
