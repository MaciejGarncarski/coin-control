import { decrypt } from '../../utils/encryption.js'

export const filterTransactions = (
  description: string | null,
  search: string | undefined,
): boolean => {
  if (!search) {
    return true
  }

  if (!description) {
    return false
  }

  try {
    const decrypted = decrypt(description).toLowerCase()
    const searchLowerCase = search.toLowerCase()

    const isEqual = decrypted === searchLowerCase
    const includes = decrypted.includes(searchLowerCase)

    return isEqual || includes
  } catch {
    return false
  }
}
