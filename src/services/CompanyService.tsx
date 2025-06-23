import internalApi from '../utilities/internalApi'

// const organisation = localStorage.getItem('organisation')

export async function postCompany(data: any, organisation: any) {
  try {
    const response = await internalApi.post(
      `/company/write/${organisation}`,
      data,
    )
    return response.data
  } catch (error) {
    return error
  }
}
export async function putCompany(companyid: any, data: any, organisation: any) {
  try {
    const response = await internalApi.put(
      `/company/update/${companyid}/${organisation}`,
      data,
    )
    return response.data
  } catch (error) {
    return error
  }
}
export async function getCompany(data: any, organisation: any) {
  try {
    const response = await internalApi.get(
      `/company/getall/${organisation}`,
      data,
    )
    return response.data
  } catch (error) {
    return error
  }
}
