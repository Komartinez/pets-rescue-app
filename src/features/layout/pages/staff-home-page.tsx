import { Link } from 'react-router-dom'

export function StaffHomePage() {
  return (
    <section className="content-section narrow-section">
      <span className="eyebrow">Rescue workspace</span>
      <h1>Good work starts here.</h1>
      <p className="lead">Keep animal records accurate, review applicant conversations, and coordinate the next human step in every adoption journey.</p>
      <div className="placeholder-grid"><div className="info-card"><strong>Animals</strong><span>Create and update the verified information applicants see.</span><Link className="button button-primary" to="/staff/animals">Manage animals</Link></div><div className="info-card"><strong>Applications</strong><span>Review compatibility context and applicant messages.</span><Link className="button button-secondary" to="/staff/applications">Review applications</Link></div><div className="info-card"><strong>Appointments</strong><span>Confirm requests before external calendar synchronization.</span><Link className="button button-secondary" to="/staff/appointments">Manage appointments</Link></div></div>
    </section>
  )
}
