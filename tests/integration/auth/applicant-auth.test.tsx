import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { RegisterForm } from '../../../src/features/auth/components/register-form'
import { SignInForm } from '../../../src/features/auth/components/sign-in-form'

const registerApplicant = vi.fn()
const signIn = vi.fn()

vi.mock('../../../src/features/auth/auth-service', () => ({
  registerApplicant: (...args: unknown[]) => registerApplicant(...args),
  signIn: (...args: unknown[]) => signIn(...args),
  getAuthErrorMessage: (error: unknown) => (error instanceof Error ? error.message : 'error'),
}))

describe('applicant authentication forms', () => {
  it('submits a registration and reports email confirmation', async () => {
    registerApplicant.mockResolvedValue({ session: null })
    render(<MemoryRouter><RegisterForm /></MemoryRouter>)
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'adopter@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'safe-password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Check your email'))
    expect(registerApplicant).toHaveBeenCalledWith('adopter@example.com', 'safe-password')
  })

  it('shows a safe sign-in error', async () => {
    signIn.mockRejectedValue(new Error('The email or password is incorrect.'))
    render(<MemoryRouter><SignInForm /></MemoryRouter>)
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'adopter@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong-password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('incorrect'))
  })
})
