import { Prisma } from '@shared/database'

import { decimalToNumber } from '../decimal-to-number.js'

describe('Decimal to Number Conversion', () => {
  it('should convert decimal to number with two decimal places', () => {
    const decimal = new Prisma.Decimal('123.456789')
    const result = decimalToNumber(decimal)
    expect(result).toBe(123.46)
  })
  it('should convert decimal to number with no decimal places', () => {
    const decimal = new Prisma.Decimal('123')
    const result = decimalToNumber(decimal)
    expect(result).toBe(123)
  })
  it('should convert decimal to number with one decimal place', () => {
    const decimal = new Prisma.Decimal('123.4')
    const result = decimalToNumber(decimal)
    expect(result).toBe(123.4)
  })
  it('should convert decimal to number with more than two decimal places', () => {
    const decimal = new Prisma.Decimal('123.456')
    const result = decimalToNumber(decimal)
    expect(result).toBe(123.46)
  })
  it('should convert decimal to number with negative value', () => {
    const decimal = new Prisma.Decimal('-123.456')
    const result = decimalToNumber(decimal)
    expect(result).toBe(-123.46)
  })
})
