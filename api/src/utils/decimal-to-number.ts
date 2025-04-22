import type { Prisma } from '@shared/database'

export function decimalToNumber(decimal: Prisma.Decimal) {
  return parseFloat(parseFloat(decimal.toString()).toFixed(2))
}
