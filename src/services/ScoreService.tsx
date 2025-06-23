import internalApi from '../utilities/internalApiSt'
const organisation = localStorage.getItem('organisation')

export async function scoreResume1(data: any) {
  const organisation = localStorage.getItem('organisation')

  try {
    const response = await internalApi.post(`/new_jd/${organisation}`, data)
    return response.data
  } catch (error) {
    return error
  }
}
export async function getResumeScore1(data: any) {
  const organisation = localStorage.getItem('organisation')

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
