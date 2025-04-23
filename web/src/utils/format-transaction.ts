export const formatTransaction = (value: string | number) => {
  if (typeof value === 'number') {
    return parseFloat(parseFloat(value.toString()).toFixed(2))
  }

  return parseFloat(parseFloat(value).toFixed(2))
}
