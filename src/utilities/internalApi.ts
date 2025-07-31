// import axios from 'axios'
// import { getAuthToken } from './TokenUtility'
// const BASE_URL = process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE

// const internalApi = axios.create({
//   baseURL: BASE_URL,
// })
// internalApi.interceptors.request.use((config: any) => {
//   console.log('token')
//   const token = getAuthToken()
//   console.log(token)
//   if (token) {
//     config = {
//       ...config,
//       headers: {
//         ...config.headers,
//         Authorization: `Bearer ${token}`,
//       },
//     }
//     console.log(token)
//   }
//   console.log(config)
//   return config
// })
// export default internalApi
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import axios from 'axios';

async function getSecret(): Promise<string> {
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({
    name: 'projects/deployments-449806/secrets/api-endpoint-url/versions/latest',
  });
  return version.payload!.data!.toString('utf8');
}

let internalApi: any;
async function initializeInternalApi() {
  if (!internalApi) {
    const baseUrl = await getSecret(); // Fetches https://api.example.com/v1
    internalApi = axios.create({ baseURL: baseUrl });
  }
  return internalApi;
}

export default initializeInternalApi();