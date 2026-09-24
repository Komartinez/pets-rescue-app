import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getAnimal, listAnimalPhotos } from '../adoption-service'
import type { Animal } from '../domain'

export function AnimalDetailPage() {
  const { id } = useParams()
  const [animal, setAnimal] = useState<Animal | null>(null)
  const [photos, setPhotos] = useState<Array<{ id: string; public_url: string | null }>>([])
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { if (!id) return; void Promise.all([getAnimal(id), listAnimalPhotos(id)]).then(([loadedAnimal, loadedPhotos]) => { setAnimal(loadedAnimal); setPhotos(loadedPhotos) }).catch(() => setError('We could not load this animal.')) }, [id])
  if (error) return <section className="content-section"><p className="form-error" role="alert">{error}</p></section>
  if (!animal) return <section className="content-section"><p>Loading animal details…</p></section>
  return <section className="content-section animal-detail"><span className="eyebrow">A possible companion</span><h1>{animal.name}</h1><p className="lead">{animal.breed || 'Rescue companion'} · {animal.size} · {animal.energy_level} energy · {animal.location || 'Location available from the rescue team'}</p>{photos.length > 0 && <div className="photo-strip">{photos.map((photo) => photo.public_url && <img key={photo.id} src={photo.public_url} alt={`${animal.name}`} />)}</div>}<div className="detail-grid"><div><h2>About {animal.name}</h2><p>{animal.description}</p><p>{animal.personality}</p></div><div className="info-card"><strong>Care and compatibility</strong><span>Children: {animal.good_with_children ? 'Listed as compatible' : 'Ask the rescue team'}</span><span>Dogs: {animal.good_with_dogs ? 'Listed as compatible' : 'Ask the rescue team'}</span><span>Cats: {animal.good_with_cats ? 'Listed as compatible' : 'Ask the rescue team'}</span><span>Medical information: {animal.medical_status || 'Contact the rescue team'}</span></div></div><div className="workflow-actions"><Link className="button button-primary" to={`/app/applications/new?animal=${animal.id}`}>Ask to apply</Link><Link className="button button-secondary" to="/app/recommendations">Back to matches</Link></div></section>
}
