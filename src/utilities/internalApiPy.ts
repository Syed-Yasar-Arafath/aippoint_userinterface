import axios from 'axios'
import { getAuthToken } from './TokenUtility'
const internalApi = axios.create({
  baseURL: process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE,
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
