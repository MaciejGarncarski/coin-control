import { formatTransaction } from '@/utils/format-transaction'

describe('format-transaction', () => {
  it('should return float with 2 decimal spaces', () => {
    const string = '12.232313123123'
    expect(formatTransaction(string)).toBe(12.23)
  })
  it('should return float with 2 decimal spaces', () => {
    const string = '12.05'
    expect(formatTransaction(string)).toBe(12.05)
  })
  it('should return float with 2 decimal spaces', () => {
    const string = 12
    expect(formatTransaction(string)).toBe(12)
  })
})
