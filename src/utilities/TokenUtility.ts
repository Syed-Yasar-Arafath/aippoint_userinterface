// // utility.ts
import store from '../redux/store' // Adjust the import path based on your store setup

export const getAuthToken = (): string | null => {
  return sessionStorage.getItem('jwtToken')
}
