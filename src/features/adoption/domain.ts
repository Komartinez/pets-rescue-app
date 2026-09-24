export type AnimalSpecies = 'dog' | 'cat'
export type AnimalStatus = 'available' | 'on_hold' | 'adoption_pending' | 'adopted' | 'archived'
export type AnimalSize = 'small' | 'medium' | 'large'
export type EnergyLevel = 'low' | 'medium' | 'high'

export interface Animal {
  id: string
  name: string
  species: AnimalSpecies
  breed: string | null
  sex: string | null
  age_years: number | null
  size: AnimalSize
  weight_kg: number | null
  location: string | null
  description: string
  personality: string
  energy_level: EnergyLevel
  good_with_children: boolean
  good_with_dogs: boolean
  good_with_cats: boolean
  house_trained: boolean
  medical_status: string
  vaccination_status: string
  sterilized: boolean
  special_care: string
  adoption_restrictions: string
  status: AnimalStatus
  created_at?: string
  updated_at?: string
}

export interface QuestionnaireAnswers {
  full_name: string
  phone: string
  location: string
  housing: 'house' | 'apartment' | 'other'
  landlord_permission: boolean
  has_children: boolean
  children_ages: string
  has_dogs: boolean
  has_cats: boolean
  existing_pet_details: string
  daily_hours: number
  experience: 'none' | 'some' | 'experienced'
  care_budget: 'under_50' | '50_100' | 'over_100'
  preferred_species: 'dog' | 'cat' | 'either'
  preferred_size: AnimalSize | 'either'
  preferred_energy: EnergyLevel | 'either'
  process_agreement: boolean
}

export const emptyQuestionnaire: QuestionnaireAnswers = {
  full_name: '',
  phone: '',
  location: '',
  housing: 'house',
  landlord_permission: false,
  has_children: false,
  children_ages: '',
  has_dogs: false,
  has_cats: false,
  existing_pet_details: '',
  daily_hours: 4,
  experience: 'some',
  care_budget: '50_100',
  preferred_species: 'either',
  preferred_size: 'either',
  preferred_energy: 'either',
  process_agreement: false,
}

export interface CompatibilityResult {
  id: string
  applicant_id: string
  animal_id: string
  score: number
  eligible: boolean
  reasons: string[]
  animal?: Animal
}

export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'appointment_requested' | 'appointment_scheduled' | 'approved' | 'rejected' | 'completed'
export type AppointmentStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

export interface AdoptionApplication {
  id: string
  applicant_id: string
  animal_id: string
  status: ApplicationStatus
  applicant_message: string
  staff_notes: string
  submitted_at: string | null
  created_at: string
  animal?: Pick<Animal, 'id' | 'name' | 'species' | 'status'>
}

export interface Appointment {
  id: string
  application_id: string
  applicant_id: string
  requested_start: string
  requested_end: string
  status: AppointmentStatus
  applicant_notes: string
  staff_notes: string
  animal_name?: string
}
