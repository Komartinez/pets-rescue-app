export function FutureFeatureLink({ label }: { label: string }) {
  return (
    <span className="nav-placeholder" aria-label={`${label}, coming soon`}>
      {label}
      <small>Coming soon</small>
    </span>
  )
}
