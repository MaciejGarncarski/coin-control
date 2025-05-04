import { getUserLocation } from '../get-user-location.js'

describe('Get User Location', () => {
  it('should return the correct location for city and country', async () => {
    const location = getUserLocation('New York', 'USA')
    expect(location).toBe('New York, USA')
  })
  it('should return the correct location for only country', async () => {
    const location = getUserLocation(undefined, 'USA')
    expect(location).toBe('USA')
  })
  it('should return null for no city and no country', async () => {
    const location = getUserLocation(undefined, undefined)
    expect(location).toBe(null)
  })
})
