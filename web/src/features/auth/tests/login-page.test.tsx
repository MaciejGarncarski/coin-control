import { screen, waitFor } from '@testing-library/react'

import { MainApp, router } from '@/main'
import { unauthedHandlerOnce } from '@/tests/mocks/handlers'
import { server } from '@/tests/mocks/msw-server'
import { renderWithProviders } from '@/tests/renderWithProviders'

describe('login page test', () => {
  it('should render login page when unatuhed', async () => {
    server.use(unauthedHandlerOnce)

    await router.navigate({
      to: '/auth/login',
      search: { error: undefined },
    })

    renderWithProviders(<MainApp />)

    await waitFor(() => {
      expect(screen.getByText(/login to coincontrol/i)).toBeInTheDocument()
    })
  })

  it('should not render login page when authed', async () => {
    server.use(unauthedHandlerOnce)

    await router.navigate({
      to: '/auth/login',
      search: { error: undefined },
    })

    renderWithProviders(<MainApp />)

    await waitFor(() => {
      expect(
        screen.queryByText(/login to coincontrol/i),
      ).not.toBeInTheDocument()
    })
  })
})
