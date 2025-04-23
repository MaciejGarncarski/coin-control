import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AddEmailForm } from '@/features/account/components/add-email-form'
import { renderWithProviders } from '@/tests/renderWithProviders'

describe('add-email-form', () => {
  it('Should open form on button click', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AddEmailForm />)

    const button = await screen.findByText(/add another/i)

    expect(button).toBeInTheDocument()

    user.click(button)

    expect(await screen.findByText(/add email/i)).toBeInTheDocument()
  })
})
