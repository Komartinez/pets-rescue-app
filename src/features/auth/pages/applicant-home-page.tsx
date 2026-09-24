import { Link } from 'react-router-dom'

export function ApplicantHomePage() {
  return (
    <section className="content-section narrow-section">
      <span className="eyebrow">Your adoption journey</span>
      <h1>Let’s find a thoughtful fit.</h1>
      <p className="lead">Start with a few details about your home and your rhythm. We’ll show compatible animals with clear reasons, then help you begin a conversation with the rescue team.</p>
      <div className="placeholder-grid">
        <div className="info-card"><strong>1. Tell us about your home</strong><span>Complete the adoption questionnaire so recommendations can respect your real life.</span><Link className="button button-primary" to="/app/questionnaire">Start questionnaire</Link></div>
        <div className="info-card"><strong>2. Explore matches</strong><span>See available animals who meet the minimum compatibility threshold.</span><Link className="button button-secondary" to="/app/recommendations">View matches</Link></div>
        <div className="info-card"><strong>3. Follow your applications</strong><span>Keep applications and appointment requests together in one place.</span><Link className="button button-secondary" to="/app/applications">View applications</Link></div>
        <div className="info-card"><strong>Your profile</strong><Link className="text-link" to="/app/account">Review account settings →</Link></div>
      </div>
    </section>
  )
}
