import { createTransport } from 'nodemailer'
import { env } from '../config/env.js'

export const mailer = createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
})
