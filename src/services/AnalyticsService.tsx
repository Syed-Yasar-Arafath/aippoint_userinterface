import internalApi from '../utilities/internalApi'
// const organisation = localStorage.getItem('organisation')
export async function getAllJob(organisation: any) {
  try {
    const response = await internalApi.get(`/job/getall/${organisation}`)
    return response.data
  } catch (error) {
    return error
  }
}
export async function getCollection(organisation: any) {
  try {
    const response = await internalApi.get(`/collection/read/${organisation}`)
    return response.data
  } catch (error) {
    return error
  }
}
// export async function postCollection(data: any) {
//   try {
//     const response = await internalApi.post('/collection/write', data)
//     return response.data
//   } catch (error) {
//     return error
//   }
// }

export async function postCollection(
  data: any,
  headers: any,
  organisation: any,
) {
  try {
    const response = await internalApi.post(
      `/collection/write/${organisation}`,
      data,
      {
        headers,
      },
    )
    return response.data
  } catch (error) {
    console.error('Error in postCollection:', error)
    throw error // Rethrow error to be caught in the calling function
  }
}

export async function postCollectionJD(
  jobid: any,
  data: object,
  organisation: any,
) {
  try {
    const response = await internalApi.put(
      `/job/edit/resume/${jobid}/${organisation}`,
      data,
    )
    return response.data
  } catch (error) {
    return error
  }
}
export async function removeCollection(
  collid: any,
  resumeid: any,
  organisation: any,
) {
  try {
    const response = await internalApi.put(
      `/collection/edit/${collid}/${resumeid}/${organisation}`,
    )
    return response.data
  } catch (error) {
    return error
  }
}
