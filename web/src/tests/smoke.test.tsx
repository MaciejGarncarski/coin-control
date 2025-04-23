import { screen } from '@testing-library/react'

import { MainApp } from '@/main'
import { unauthedHandlerOnce } from '@/tests/mocks/handlers'
import { server } from '@/tests/mocks/msw-server'
import { renderWithProviders } from '@/tests/renderWithProviders'

describe('smoke test', () => {
  it('should render app', async () => {
    server.use(unauthedHandlerOnce)

    renderWithProviders(<MainApp />)
    expect(await screen.findByText(/login to coincontrol/i)).toBeInTheDocument()
  })
})
