export function ErrorMessage() {
  return (
    <main className="page-center">
      <section className="state-card" aria-live="assertive">
        <span className="eyebrow">Animal Rescue</span>
        <h1>Something needs our attention.</h1>
        <p>Please refresh the page and try again. If the issue continues, contact the rescue team.</p>
        <button className="button button-primary" type="button" onClick={() => window.location.reload()}>Refresh page</button>
      </section>
    </main>
  )
}
