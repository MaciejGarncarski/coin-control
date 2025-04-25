import { act, fireEvent, screen } from '@testing-library/react'

import { MainApp, router } from '@/main'
import { unauthedHandlerOnce } from '@/tests/mocks/handlers'
import { server } from '@/tests/mocks/msw-server'
import { renderWithProviders } from '@/tests/renderWithProviders'

describe('login page test', () => {
  it('should render login page when unauthed', async () => {
    server.use(unauthedHandlerOnce)

    await act(() => {
      return router.navigate({
        to: '/auth/login',
        search: { error: undefined },
      })
    })

    renderWithProviders(<MainApp />)

    expect(await screen.findByText(/login to coincontrol/i)).toBeInTheDocument()
  })

  it('should render homepage layout when authed', async () => {
    await act(() => {
      return router.navigate({
        to: '/auth/login',
        search: { error: undefined },
      })
    })

    renderWithProviders(<MainApp />)
    expect(await screen.findByTestId('homepage')).toBeInTheDocument()
  })

  it('should show error on auth error', async () => {
    server.use(unauthedHandlerOnce)

    await act(() => {
      return router.navigate({
        to: '/auth/login',
        search: { error: true },
      })
    })

    const { user } = renderWithProviders(<MainApp />)

    expect(await screen.findByText(/login to coincontrol/i)).toBeInTheDocument()

    const emailInput = await screen.findByLabelText(/Email/i)
    expect(emailInput).toBeInTheDocument()

    const passwordInput = await screen.findByLabelText(/Password/i)
    expect(passwordInput).toBeInTheDocument()

    const submitButton = await screen.findByRole('button', { name: /login/i })
    expect(submitButton).toBeInTheDocument()

    await user.click(emailInput)
    await user.keyboard('nonexistent@gmail.com')

    await user.click(passwordInput)
    await user.keyboard('password')

    await user.click(submitButton)

    expect(await screen.findByText(/user not found/i)).toBeInTheDocument()
  })
})

describe('login form', () => {
  it('should login successfully', async () => {
    await act(() => {
      return router.navigate({
        to: '/auth/login',
        search: { error: undefined },
      })
    })

    const { user } = renderWithProviders(<MainApp />)

    expect(screen.getByText(/login to coincontrol/i)).toBeInTheDocument()

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    fireEvent.input(emailInput, { target: { value: 'some@email.com' } })
    expect(emailInput).toHaveValue('some@email.com')

    const passwordInput = screen.getByLabelText(/password/i)
    fireEvent.input(passwordInput, { target: { value: 'randompassword' } })
    expect(passwordInput).toHaveValue('randompassword')

    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByTestId('homepage')).toBeInTheDocument()
  })
})
