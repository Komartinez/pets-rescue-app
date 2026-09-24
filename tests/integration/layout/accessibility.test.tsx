import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { LandingPage } from '../../../src/features/layout/pages/landing-page'

describe('public shell accessibility', () => {
  it('exposes a named navigation and accessible primary actions', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>)
    expect(screen.getByRole('navigation', { name: 'Public navigation' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Create an account' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'I already have an account' })).toBeInTheDocument()
  })
})
