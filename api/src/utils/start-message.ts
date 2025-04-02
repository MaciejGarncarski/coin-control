/* eslint-disable no-console */

import { styleText } from 'node:util'

import { env } from '../config/env.js'

const hashes = styleText(
  'greenBright',
  '########################################',
)
const message = styleText(
  'greenBright',
  ` Server running on ${styleText(['gray'], `http://${env.HOST}:${env.PORT}`)}`,
)

export const showStartMessage = () => {
  console.log(hashes)
  console.log(message)
  console.log(hashes)
}
