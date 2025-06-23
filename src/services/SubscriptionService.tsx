import internalApi from '../utilities/internalApi'
const organisation = localStorage.getItem('organisation')
export async function postSubscribe(data: any) {
  try {
    const response = await internalApi.post(
      `/subscription/${organisation}`,
      data,
    )
    return response.data
  } catch (error) {
    return error
  }
}
export async function getSubscribe() {
  try {
    const response = await internalApi.get(`/subscription/${organisation}`)
    return response.data
  } catch (error) {
    return error
  }
}
