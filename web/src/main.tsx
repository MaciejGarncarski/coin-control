import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { auth } from '@/routes/__root'
import { userQueryOptions } from '@/lib/auth'

const queryClient = new QueryClient()

// Create a new router instance
const router = createRouter({
  context: {
    auth: undefined!,
    queryClient: queryClient,
  },
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const MainApp = () => {
  const userAuthenticated = useQuery(userQueryOptions)

  if (userAuthenticated.isLoading) return null

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          ...auth,
          status: userAuthenticated.data?.id ? 'loggedIn' : 'loggedOut',
        },
      }}
    />
  )
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <MainApp />
      </QueryClientProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
