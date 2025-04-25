import { screen } from '@testing-library/react'

import { AddEmailForm } from '@/features/account/components/add-email-form'
import { renderWithProviders } from '@/tests/renderWithProviders'

describe('add-email-form', () => {
  it('should open then close', async () => {
    const { user } = renderWithProviders(<AddEmailForm />)

    const button = await screen.findByText(/add another/i)

    expect(button).toBeInTheDocument()

    await user.click(button)

    expect(await screen.findByText(/add email/i)).toBeInTheDocument()

    const closeBtn = screen.getByRole('button', { name: /close/i })
    expect(closeBtn).toBeInTheDocument()

    await user.click(closeBtn)

    expect(closeBtn).not.toBeInTheDocument()
  })
})
