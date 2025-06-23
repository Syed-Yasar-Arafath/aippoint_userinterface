// aiApi.ts
import axios from 'axios'
import { useSelector } from 'react-redux'
import { getAuthToken } from './TokenUtility'

const aiApi = axios.create({
  baseURL: 'http://13.60.82.27:8083',
})

aiApi.interceptors.request.use((config) => {
  console.log('token')
  const token = getAuthToken() // Call the function to get the token from Redux store
  console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log(token)
  }
  return config
})

export default aiApi
