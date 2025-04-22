import { decrypt } from '../../utils/encryption.js'

export const filterTransactions = (
  description: string | null,
  search: string | undefined,
) => {
  if (!search) {
    return true
  }

  if (!description) {
    return false
  }

  return decrypt(description).toLowerCase().includes(search.toLowerCase())
}
