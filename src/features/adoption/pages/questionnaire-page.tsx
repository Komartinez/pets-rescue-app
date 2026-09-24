import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../auth/auth-context'
import { getQuestionnaire, listAnimals, saveApplicantProfile, saveCompatibilityResults, saveQuestionnaire } from '../adoption-service'
import { emptyQuestionnaire, type QuestionnaireAnswers } from '../domain'
import { scoreAnimal } from '../scoring'

export function QuestionnairePage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(emptyQuestionnaire)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth.user) return
    void getQuestionnaire(auth.user.id).then((saved) => saved && setAnswers({ ...emptyQuestionnaire, ...saved })).catch(() => setError('We could not load your saved questionnaire.'))
  }, [auth.user])

  function update<K extends keyof QuestionnaireAnswers>(key: K, value: QuestionnaireAnswers[K]) {
    setAnswers((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!auth.user) return
    setBusy(true)
    setError(null)
    try {
      const animals = await listAnimals()
      await saveQuestionnaire(auth.user.id, answers)
      await saveApplicantProfile(auth.user.id, answers)
      await saveCompatibilityResults(auth.user.id, animals.map((animal) => ({ animal_id: animal.id, ...scoreAnimal(animal, answers) })))
      navigate('/app/recommendations')
    } catch {
      setError('We could not save your answers. Please check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="content-section form-section">
      <span className="eyebrow">Your adoption story</span>
      <h1>Help us understand your home.</h1>
      <p className="lead">These answers create a transparent starting point for your animal recommendations. You can update them at any time.</p>
      <form className="workflow-form" onSubmit={handleSubmit}>
        <fieldset><legend>About you</legend>
          <label>Full name<input required value={answers.full_name} onChange={(event) => update('full_name', event.target.value)} /></label>
          <label>Phone number<input value={answers.phone} onChange={(event) => update('phone', event.target.value)} /></label>
          <label>Location<input required value={answers.location} onChange={(event) => update('location', event.target.value)} placeholder="City or area" /></label>
        </fieldset>
        <fieldset><legend>Your home</legend>
          <label>Housing type<select value={answers.housing} onChange={(event) => update('housing', event.target.value as QuestionnaireAnswers['housing'])}><option value="house">House</option><option value="apartment">Apartment</option><option value="other">Other</option></select></label>
          {answers.housing === 'apartment' && <label className="check-row"><input type="checkbox" checked={answers.landlord_permission} onChange={(event) => update('landlord_permission', event.target.checked)} /> I have permission to keep an animal here.</label>}
          <label className="check-row"><input type="checkbox" checked={answers.has_children} onChange={(event) => update('has_children', event.target.checked)} /> Children live in my household.</label>
          {answers.has_children && <label>Children’s ages<input required value={answers.children_ages} onChange={(event) => update('children_ages', event.target.value)} placeholder="For example: 5 and 9" /></label>}
          <label className="check-row"><input type="checkbox" checked={answers.has_dogs} onChange={(event) => update('has_dogs', event.target.checked)} /> I already have a dog.</label>
          <label className="check-row"><input type="checkbox" checked={answers.has_cats} onChange={(event) => update('has_cats', event.target.checked)} /> I already have a cat.</label>
          {(answers.has_dogs || answers.has_cats) && <label>Tell us about your existing pets<textarea value={answers.existing_pet_details} onChange={(event) => update('existing_pet_details', event.target.value)} rows={3} /></label>}
        </fieldset>
        <fieldset><legend>Your rhythm and preferences</legend>
          <label>Hours available for care each day<input type="number" min="0" max="24" required value={answers.daily_hours} onChange={(event) => update('daily_hours', Number(event.target.value))} /></label>
          <label>Animal experience<select value={answers.experience} onChange={(event) => update('experience', event.target.value as QuestionnaireAnswers['experience'])}><option value="none">I am new to animal care</option><option value="some">I have some experience</option><option value="experienced">I am very experienced</option></select></label>
          <label>Expected monthly care budget<select value={answers.care_budget} onChange={(event) => update('care_budget', event.target.value as QuestionnaireAnswers['care_budget'])}><option value="under_50">Under $50</option><option value="50_100">$50–$100</option><option value="over_100">More than $100</option></select></label>
          <label>Preferred animal type<select value={answers.preferred_species} onChange={(event) => update('preferred_species', event.target.value as QuestionnaireAnswers['preferred_species'])}><option value="either">Dog or cat</option><option value="dog">Dog</option><option value="cat">Cat</option></select></label>
          <label>Preferred size<select value={answers.preferred_size} onChange={(event) => update('preferred_size', event.target.value as QuestionnaireAnswers['preferred_size'])}><option value="either">Any size</option><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></label>
          <label>Preferred energy level<select value={answers.preferred_energy} onChange={(event) => update('preferred_energy', event.target.value as QuestionnaireAnswers['preferred_energy'])}><option value="either">Any energy level</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
        </fieldset>
        <label className="check-row agreement"><input type="checkbox" required checked={answers.process_agreement} onChange={(event) => update('process_agreement', event.target.checked)} /> I understand that recommendations assist the rescue team and do not guarantee adoption approval.</label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Finding thoughtful matches…' : 'Save and see recommendations'}</button>
      </form>
    </section>
  )
}
