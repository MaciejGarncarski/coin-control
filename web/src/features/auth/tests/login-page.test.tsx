import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MainApp, router } from '@/main'
import {
  loginErrorHandlerOnce,
  unauthedHandlerOnce,
} from '@/tests/mocks/handlers'
import { server } from '@/tests/mocks/msw-server'
import { renderWithProviders } from '@/tests/renderWithProviders'

describe('login page test', () => {
  it('should render login page when unauthed', async () => {
    server.use(unauthedHandlerOnce)

    await router.navigate({
      to: '/auth/login',
      search: { error: undefined },
    })

    renderWithProviders(<MainApp />)

    expect(await screen.findByText(/login to coincontrol/i)).toBeInTheDocument()
  })

  it('should render homepage layout when authed', async () => {
    await router.navigate({
      to: '/auth/login',
      search: { error: undefined },
    })

    renderWithProviders(<MainApp />)
    expect(await screen.findByTestId('homepage')).toBeInTheDocument()
  })

  it('should show error on auth error', async () => {
    server.use(unauthedHandlerOnce)
    server.use(loginErrorHandlerOnce)

    await router.navigate({
      to: '/auth/login',
      search: { error: true },
    })

    renderWithProviders(<MainApp />)

    expect(await screen.findByText(/login to coincontrol/i)).toBeInTheDocument()

    const emailInput = await screen.findByLabelText(/Email/i)
    expect(emailInput).toBeInTheDocument()

    const passwordInput = await screen.findByLabelText(/Password/i)
    expect(passwordInput).toBeInTheDocument()

    const submitButton = await screen.findByRole('button', { name: /login/i })
    expect(submitButton).toBeInTheDocument()

    const user = userEvent.setup()

    await user.click(emailInput)
    await user.keyboard('user@gmail.com')

    await user.click(passwordInput)
    await user.keyboard('password')

    await user.click(submitButton)

    expect(await screen.findByText(/user not found/i)).toBeInTheDocument()
  })

  it('should redirect to homepage after successful login', async () => {
    server.resetHandlers()
    server.use(unauthedHandlerOnce)

    await router.navigate({
      to: '/auth/login',
      search: { error: undefined },
    })

    renderWithProviders(<MainApp />)

    expect(screen.getByText(/login to coincontrol/i)).toBeInTheDocument()

    const emailInput = screen.getByLabelText(/Email/i)
    expect(emailInput).toBeInTheDocument()

    const passwordInput = screen.getByLabelText(/Password/i)
    expect(passwordInput).toBeInTheDocument()

    const user = userEvent.setup()

    await user.type(emailInput, 'user@gmail.com')
    await user.type(passwordInput, 'password')

    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByTestId('homepage')).toBeInTheDocument()
  })
})
