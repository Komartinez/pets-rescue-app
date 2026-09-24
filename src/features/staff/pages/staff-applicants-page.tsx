import { useEffect, useState } from 'react'

import { listApplicantProfiles } from '../../adoption/adoption-service'

type ApplicantProfile = { user_id: string; full_name: string | null; phone: string | null; location: string | null; household_summary: string | null; updated_at: string }

export function StaffApplicantsPage() {
  const [applicants, setApplicants] = useState<ApplicantProfile[]>([])
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { void listApplicantProfiles().then(setApplicants).catch(() => setError('We could not load applicant profiles.')) }, [])
  return <section className="content-section"><span className="eyebrow">Rescue community</span><h1>Applicants</h1><p className="lead">Applicant information is visible only to trusted staff and is used to support thoughtful, human review.</p>{error && <p className="form-error" role="alert">{error}</p>}<div className="stack-list">{applicants.map((applicant) => <article className="info-card" key={applicant.user_id}><strong>{applicant.full_name || 'Profile in progress'}</strong><span>{applicant.location || 'Location not provided'}{applicant.phone ? ` · ${applicant.phone}` : ''}</span><span>{applicant.household_summary || 'Questionnaire details are available when completed.'}</span></article>)}</div></section>
}
