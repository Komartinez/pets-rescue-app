import { getSupabaseClient } from '../../lib/supabase/client'
import type { AdoptionApplication, Animal, AnimalStatus, Appointment, AppointmentStatus, CompatibilityResult, QuestionnaireAnswers } from './domain'

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message)
}

export async function listAnimals(): Promise<Animal[]> {
  const { data, error } = await getSupabaseClient().from('animals').select('*').order('created_at', { ascending: false })
  throwIfError(error)
  return (data ?? []) as Animal[]
}

export async function getAnimal(id: string): Promise<Animal | null> {
  const { data, error } = await getSupabaseClient().from('animals').select('*').eq('id', id).maybeSingle()
  throwIfError(error)
  return data as Animal | null
}

export async function listAnimalPhotos(animalId: string): Promise<Array<{ id: string; public_url: string | null }>> {
  const { data, error } = await getSupabaseClient().from('animal_photos').select('id,public_url').eq('animal_id', animalId).order('sort_order')
  throwIfError(error)
  return (data ?? []) as Array<{ id: string; public_url: string | null }>
}

export async function saveAnimal(input: Partial<Animal> & Pick<Animal, 'name' | 'species' | 'size' | 'energy_level'>, id?: string) {
  const client = getSupabaseClient()
  const payload = { ...input }
  if (id) {
    const { data, error } = await client.from('animals').update(payload).eq('id', id).select().single()
    throwIfError(error)
    return data as Animal
  }
  const { data, error } = await client.from('animals').insert(payload).select().single()
  throwIfError(error)
  return data as Animal
}

export async function archiveAnimal(id: string) {
  const { error } = await getSupabaseClient().from('animals').update({ status: 'archived' satisfies AnimalStatus }).eq('id', id)
  throwIfError(error)
}

export async function uploadAnimalPhoto(animalId: string, file: File) {
  const path = `${animalId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`
  const client = getSupabaseClient()
  const { error: uploadError } = await client.storage.from('animal-photos').upload(path, file, { upsert: false })
  throwIfError(uploadError)
  const { data } = client.storage.from('animal-photos').getPublicUrl(path)
  const { error } = await client.from('animal_photos').insert({ animal_id: animalId, storage_path: path, public_url: data.publicUrl })
  throwIfError(error)
  return data.publicUrl
}

export async function getQuestionnaire(userId: string): Promise<QuestionnaireAnswers | null> {
  const { data, error } = await getSupabaseClient().from('questionnaire_answers').select('answers').eq('user_id', userId).maybeSingle()
  throwIfError(error)
  return (data?.answers as QuestionnaireAnswers | undefined) ?? null
}

export async function saveQuestionnaire(userId: string, answers: QuestionnaireAnswers) {
  const { error } = await getSupabaseClient().from('questionnaire_answers').upsert({ user_id: userId, answers, completed_at: new Date().toISOString() })
  throwIfError(error)
}

export async function saveApplicantProfile(userId: string, answers: QuestionnaireAnswers) {
  const { error } = await getSupabaseClient().from('applicant_profiles').upsert({ user_id: userId, full_name: answers.full_name, phone: answers.phone, location: answers.location })
  throwIfError(error)
}

export async function saveCompatibilityResults(userId: string, results: Array<{ animal_id: string; score: number; eligible: boolean; reasons: string[] }>) {
  if (!results.length) return
  const { error } = await getSupabaseClient().from('compatibility_results').upsert(results.map((result) => ({ applicant_id: userId, ...result })), { onConflict: 'applicant_id,animal_id' })
  throwIfError(error)
}

export async function listApplicantProfiles() {
  const { data, error } = await getSupabaseClient().from('applicant_profiles').select('*').order('updated_at', { ascending: false })
  throwIfError(error)
  return (data ?? []) as Array<{ user_id: string; full_name: string | null; phone: string | null; location: string | null; household_summary: string | null; updated_at: string }>
}

export async function getRecommendations(userId: string): Promise<CompatibilityResult[]> {
  const client = getSupabaseClient()
  const { data: resultData, error: resultError } = await client.from('compatibility_results').select('*').eq('applicant_id', userId).eq('eligible', true).order('score', { ascending: false })
  throwIfError(resultError)
  const results = (resultData ?? []) as CompatibilityResult[]
  if (!results.length) return []
  const { data: animals, error: animalError } = await client.from('animals').select('*').in('id', results.map((result) => result.animal_id))
  throwIfError(animalError)
  const animalsById = new Map((animals as Animal[]).map((animal) => [animal.id, animal]))
  return results.map((result) => ({ ...result, reasons: Array.isArray(result.reasons) ? result.reasons : [], animal: animalsById.get(result.animal_id) })).filter((result) => result.animal)
}

export async function createApplication(applicantId: string, animalId: string, message: string) {
  const { data, error } = await getSupabaseClient().from('adoption_applications').insert({ applicant_id: applicantId, animal_id: animalId, applicant_message: message, status: 'submitted', submitted_at: new Date().toISOString() }).select().single()
  throwIfError(error)
  return data as AdoptionApplication
}

export async function listApplications() {
  const { data, error } = await getSupabaseClient().from('adoption_applications').select('*, animal:animals(id,name,species,status)').order('created_at', { ascending: false })
  throwIfError(error)
  return (data ?? []) as AdoptionApplication[]
}

export async function updateApplicationStatus(id: string, status: AdoptionApplication['status'], staffNotes?: string) {
  const { error } = await getSupabaseClient().from('adoption_applications').update({ status, staff_notes: staffNotes }).eq('id', id)
  throwIfError(error)
}

export async function requestAppointment(input: Pick<Appointment, 'application_id' | 'applicant_id' | 'requested_start' | 'requested_end' | 'applicant_notes'>) {
  const { data, error } = await getSupabaseClient().from('appointments').insert({ ...input, status: 'requested' }).select().single()
  throwIfError(error)
  return data as Appointment
}

export async function listAppointments() {
  const { data, error } = await getSupabaseClient().from('appointments').select('*, application:adoption_applications(animal:animals(name))').order('requested_start', { ascending: true })
  throwIfError(error)
  return (data ?? []).map((appointment) => {
    const row = appointment as Appointment & { application?: { animal?: { name?: string } } }
    return { ...row, animal_name: row.application?.animal?.name }
  })
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus, staffNotes?: string) {
  const { error } = await getSupabaseClient().from('appointments').update({ status, staff_notes: staffNotes }).eq('id', id)
  throwIfError(error)
}
