import { env } from './env.js'
import { createTransport } from 'nodemailer'

export const mailer = createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
})
