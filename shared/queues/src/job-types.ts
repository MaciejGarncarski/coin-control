export type ResetPasswordLinkJob = {
  userEmail: string
  passwordResetCode: string
}

export type ResetPasswordNotificationJob = {
  userEmail: string
  createdAt: number
}

export type EmailVerificationJob = {
  userEmail: string
  code: string
}

export type NewEmailVerificationJob = {
  email: string
  token: string
}
