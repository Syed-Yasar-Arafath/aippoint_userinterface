import internalApi from '../utilities/internalApiSt'

export async function getStatus(organisation:any) {
  try {
    const response = await internalApi.get(`/type/post/active/${organisation}`)
    return response.data
  } catch (error) {
    return error
  }
}
export async function putStatus(id: string,organisation:any) {
  try {
    const response = await internalApi.put(`/discard/${id}/${organisation}`)
    return response.data
  } catch (error) {
    return error
  }
}
