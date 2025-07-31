import axios from 'axios'
import { getAuthToken } from './TokenUtility'
const BASE_URL = process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE

const internalApi = axios.create({
  baseURL: BASE_URL,
})
internalApi.interceptors.request.use((config: any) => {
  console.log('token')
  const token = getAuthToken()
  console.log(token)
  if (token) {
    config = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    }
    console.log(token)
  }
  console.log(config)
  return config
})
export default internalApi
