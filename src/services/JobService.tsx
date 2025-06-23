import internalApi from '../utilities/internalApi'
// const organisation = localStorage.getItem('organisation')
// console.log('org', organisation)
export async function postJob(data: any, organisation: any) {
  try {
    const token = localStorage.getItem('token')
    const response = await internalApi.post(
      `/job/write/write-draft/${organisation}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function addJob(data: any, organisation: any) {
  const token = localStorage.getItem('token')
  try {
    const response = await internalApi.post(
      `/job/write/${organisation}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function getJob(jobId: any, organisation: any) {
  try {
    const response = await internalApi.get(`/job/read/${jobId}/${organisation}`)
    return response.data
  } catch (error) {
    return error
  }
}
export async function getJobActive(organisation: any) {
  try {
    const response = await internalApi.get(
      `/job/read/getbytype/active/${organisation}`,
    )
    return response.data
  } catch (error) {
    return error
  }
}
export async function getViewResume(jobId: number, organisation: any) {
  try {
    const response = await internalApi.get(
      `/job/read/getJobResumeStatus/${jobId}/${organisation}`,
    )
    return response.data
  } catch (error) {
    return error
  }
}
export async function putJob(jobId: any, data: object, organisation: any) {
  try {
    const response = await internalApi.put(
      `/job/edit/${jobId}/${organisation}`,
      data,
    )
    return response.data
  } catch (error) {
    return error
  }
}
export async function putResume(jobid: any, data: object, organisation: any) {
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
export async function removeResumeJd(
  jobid: any,
  resumeId: any,
  organisation: any,
) {
  try {
    const response = await internalApi.put(
      `/job/edit/${jobid}/${resumeId}/${organisation}`,
    )
    return response.data
  } catch (error) {
    return error
  }
}
export async function putDeleteStatus(
  jobId: any,
  data: object,
  organisation: any,
) {
  try {
    const response = await internalApi.put(
      'job/delete/byId/' + jobId + `/${organisation}`,
      data,
    )
    return response.data
  } catch (error) {
    return error
  }
}
