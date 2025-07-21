import axios from 'axios'
import { getAuthToken } from './TokenUtility'
const internalApi = axios.create({
  baseURL: 'https://parseez.ai/parseez-django-service/',
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
