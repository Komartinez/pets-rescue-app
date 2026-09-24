import { Link } from 'react-router-dom'

import { PublicShell } from '../public-shell'

export function LandingPage() {
  return (
    <PublicShell>
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">A gentler way home</span>
            <h1>Meet the animal who is waiting for you.</h1>
            <p className="hero-lede">
              Begin with a thoughtful conversation about your home, your rhythm, and the kind of
              companion you hope to welcome.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary button-large" to="/auth/register">Create an account</Link>
              <Link className="button button-secondary button-large" to="/auth/sign-in">I already have an account</Link>
            </div>
          </div>
          <div className="hero-art" aria-label="Illustration placeholder for a rescue animal" role="img">
            <span className="hero-art-circle">🐾</span>
            <span className="hero-art-note">Every good match starts with care.</span>
          </div>
        </section>
        <section id="how-it-works" className="content-section three-column-section">
          <div><span className="step-number">01</span><h2>Tell us about your world</h2><p>A few honest details help us understand what home could look like.</p></div>
          <div><span className="step-number">02</span><h2>Discover a good fit</h2><p>Future recommendations will consider the needs of both people and animals.</p></div>
          <div><span className="step-number">03</span><h2>Take the next step</h2><p>Our rescue team is here to guide you through the journey.</p></div>
        </section>
        <section id="about" className="content-section warm-panel">
          <span className="eyebrow">Built around care</span>
          <h2>Every animal deserves a patient, informed beginning.</h2>
          <p>This foundation keeps your account and future adoption journey protected from the very first step.</p>
        </section>
      </main>
    </PublicShell>
  )
}
