import { Link } from 'react-router-dom'

export function AccessState({ title, message, action = true }: { title: string; message: string; action?: boolean }) {
  return (
    <main className="page-center" aria-live="polite">
      <section className="state-card" aria-labelledby="state-title">
        <span className="eyebrow">Animal Rescue</span>
        <h1 id="state-title">{title}</h1>
        <p>{message}</p>
        {action && <Link className="button button-primary" to="/">Return home</Link>}
      </section>
    </main>
  )
}
