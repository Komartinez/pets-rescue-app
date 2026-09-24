export function LoadingScreen({ message = 'Loading…' }: { message?: string }) {
  return (
    <main className="page-center" aria-live="polite" aria-busy="true">
      <section className="state-card">
        <span className="eyebrow">Animal Rescue</span>
        <p>{message}</p>
      </section>
    </main>
  )
}
