export const getUserLocation = (
  city?: string | null,
  country?: string | null,
) => {
  if (city && country) {
    return `${city}, ${country}`
  }

  if (!city) {
    if (country) {
      return country
    }

    return null
  }

  return null
}
