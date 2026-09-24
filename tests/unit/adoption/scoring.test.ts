import { describe, expect, it } from 'vitest'

import { scoreAnimal } from '../../../src/features/adoption/scoring'
import { emptyQuestionnaire, type Animal } from '../../../src/features/adoption/domain'

const dog: Animal = {
  id: 'dog-1', name: 'Luna', species: 'dog', breed: 'Mixed breed', sex: 'female', age_years: 3, size: 'medium', weight_kg: 14, location: 'San José', description: 'Gentle and playful.', personality: 'Social', energy_level: 'medium', good_with_children: true, good_with_dogs: true, good_with_cats: false, house_trained: true, medical_status: 'Healthy', vaccination_status: 'Current', sterilized: true, special_care: '', adoption_restrictions: '', status: 'available',
}

describe('transparent compatibility scoring', () => {
  it('rewards a compatible home and explains the result', () => {
    const result = scoreAnimal(dog, { ...emptyQuestionnaire, preferred_species: 'dog', preferred_size: 'medium', preferred_energy: 'medium', has_children: true, children_ages: '8', daily_hours: 6, experience: 'some', process_agreement: true })
    expect(result.eligible).toBe(true)
    expect(result.score).toBeGreaterThanOrEqual(60)
    expect(result.reasons.some((reason) => reason.includes('children'))).toBe(true)
  })

  it('fails closed for an essential incompatibility', () => {
    const result = scoreAnimal(dog, { ...emptyQuestionnaire, preferred_species: 'cat', has_children: true, children_ages: '2', daily_hours: 8, process_agreement: true })
    expect(result.eligible).toBe(false)
    expect(result.reasons.some((reason) => reason.includes('species'))).toBe(true)
  })
})
