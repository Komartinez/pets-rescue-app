import { Link } from 'react-router-dom'

export function ApplicantHomePage() {
  return (
    <section className="content-section narrow-section">
      <span className="eyebrow">Your journey</span>
      <h1>A beautiful beginning.</h1>
      <p className="lead">Your account is ready. When the next feature arrives, this is where you’ll begin discovering animals who may be a good fit for your home.</p>
      <div className="placeholder-grid">
        <div className="info-card"><strong>Future matches</strong><span>Thoughtful recommendations will appear here.</span></div>
        <div className="info-card"><strong>Your profile</strong><Link className="text-link" to="/app/account">Review account settings →</Link></div>
      </div>
    </section>
  )
}
