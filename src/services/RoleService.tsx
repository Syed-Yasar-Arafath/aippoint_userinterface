import internalApi from '../utilities/internalApi'
// const organisation = localStorage.getItem('organisation')

export async function getRoles(organisation:any) {
  try {
    const response = await internalApi.get(`/roles/read/all/${organisation}`)
    return response.data
  } catch (error) {
    return error
  }
}
export async function postRoles(data: any,organisation:any) {
  try {
    const response = await internalApi.post(
      `/roles/write/${organisation}`,
      data,
    )
    return response.data
  } catch (error) {
    return error
  }
}
export async function putRole(user_id: any, data: object,organisation:any) {
  try {
    const response = await internalApi.put(
      'roles/edit/' + user_id + `/${organisation}`,
      data,
    )
    return response.data
  } catch (error) {
    return error
  }
}
export async function scoreResume(data: any,organisation:any) {
  try {
    const response = await internalApi.post(`/new_jd/${organisation}`, data)
    return response.data
  } catch (error) {
    return error
  }
}
export async function getResumeScore(data: any,organisation:any) {
  
  try {
    const response = await internalApi.post(
      `/get_jd_score/${organisation}`,
      data,
    )
    return response.data
  } catch (error) {
    return error
  }
}
