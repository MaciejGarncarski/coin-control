export const auth: Auth = {
  status: 'loggedOut',
  isEmailVerified: false,
  login: () => {
    auth.status = 'loggedIn'
  },
  logout: () => {
    auth.status = 'loggedOut'
  },
}

export type Auth = {
  login: () => void
  logout: () => void
  status: 'loggedOut' | 'loggedIn'
  isEmailVerified: boolean
}
