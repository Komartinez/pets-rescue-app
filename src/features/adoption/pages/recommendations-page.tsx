import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../../auth/auth-context'
import { getRecommendations } from '../adoption-service'
import type { CompatibilityResult } from '../domain'

export function RecommendationsPage() {
  const auth = useAuth()
  const [results, setResults] = useState<CompatibilityResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth.user) return
    void getRecommendations(auth.user.id).then(setResults).catch(() => setError('We could not load your recommendations.')).finally(() => setLoading(false))
  }, [auth.user])

  if (loading) return <section className="content-section"><p>Reviewing available animals…</p></section>
  return (
    <section className="content-section">
      <span className="eyebrow">Thoughtful matches</span>
      <h1>Animals who may fit your life.</h1>
      <p className="lead">These recommendations use the information you provided. Read the reasons, then contact the rescue team with questions.</p>
      <div className="workflow-actions"><Link className="button button-secondary" to="/app/questionnaire">Update questionnaire</Link><Link className="button button-secondary" to="/app/applications">View applications</Link></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {!error && !results.length && <div className="info-card"><strong>No compatible animals yet</strong><span>Complete the questionnaire or check back as new animals become available.</span><Link className="button button-primary" to="/app/questionnaire">Complete questionnaire</Link></div>}
      <div className="animal-grid">
        {results.map((result) => result.animal && <article className="animal-card" key={result.id}>
          <div className="animal-card-top"><span className="animal-kind">{result.animal.species}</span><strong>{Math.round(result.score)}% fit</strong></div>
          <h2><Link className="text-link" to={`/app/animals/${result.animal.id}`}>{result.animal.name}</Link></h2>
          <p>{result.animal.breed || 'Rescue companion'} · {result.animal.size} · {result.animal.energy_level} energy</p>
          <p>{result.animal.description || result.animal.personality}</p>
          <details><summary>Why this may be a good fit</summary><ul>{result.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></details>
          <Link className="button button-primary" to={`/app/applications/new?animal=${result.animal.id}`}>Ask to apply</Link>
        </article>)}
      </div>
    </section>
  )
}
