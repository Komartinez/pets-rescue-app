import type { Animal, CompatibilityResult, QuestionnaireAnswers } from './domain'

const minimumScore = 60

function preferenceMatch(preferred: string, actual: string) {
  return preferred === 'either' || preferred === actual
}

export function scoreAnimal(animal: Animal, answers: QuestionnaireAnswers): Omit<CompatibilityResult, 'id' | 'applicant_id' | 'animal_id' | 'animal'> {
  const reasons: string[] = []
  const warnings: string[] = []
  let score = 0

  const speciesMatch = preferenceMatch(answers.preferred_species, animal.species)
  const sizeMatch = preferenceMatch(answers.preferred_size, animal.size)
  const energyMatch = preferenceMatch(answers.preferred_energy, animal.energy_level)
  const housingMatch = answers.housing !== 'apartment' || animal.size !== 'large'
  const childrenMatch = !answers.has_children || animal.good_with_children
  const dogsMatch = !answers.has_dogs || animal.good_with_dogs
  const catsMatch = !answers.has_cats || animal.good_with_cats
  const landlordMatch = answers.housing !== 'apartment' || answers.landlord_permission

  if (housingMatch) { score += 20; reasons.push('The animal profile fits your housing situation.') } else warnings.push('The animal may need more space than the described housing provides.')
  if (answers.daily_hours >= (animal.energy_level === 'high' ? 6 : animal.energy_level === 'medium' ? 4 : 2)) { score += 15; reasons.push('Your daily availability aligns with this animal’s energy level.') } else warnings.push('Your available daytime hours may be low for this animal’s energy needs.')
  if (answers.experience === 'experienced' || (answers.experience === 'some' && animal.energy_level !== 'high')) { score += 15; reasons.push('Your experience is a reasonable fit for this care profile.') } else if (answers.experience === 'none' && animal.energy_level === 'high') warnings.push('This animal may benefit from an experienced adopter.')
  if (childrenMatch) { score += 15; if (answers.has_children) reasons.push('The animal is listed as compatible with children.') } else warnings.push('The animal is not currently listed as compatible with children.')
  if (dogsMatch && catsMatch) { score += 15; if (answers.has_dogs || answers.has_cats) reasons.push('The animal profile is compatible with your existing pets.') } else warnings.push('The animal may not be compatible with all existing pets.')
  if (answers.care_budget === 'over_100' || answers.care_budget === '50_100') { score += 10; reasons.push('Your stated care budget supports the expected ongoing commitment.') } else warnings.push('Please discuss the expected care costs with the rescue team.')
  if (speciesMatch && sizeMatch && energyMatch) { score += 10; reasons.push('The animal matches your stated preferences.') } else if (!speciesMatch) warnings.push('The animal species differs from your selected preference.')

  const eligible = speciesMatch && housingMatch && childrenMatch && dogsMatch && catsMatch && landlordMatch && score >= minimumScore
  if (!landlordMatch) warnings.push('Please confirm landlord permission before continuing.')
  return { score, eligible, reasons: [...reasons, ...warnings] }
}
