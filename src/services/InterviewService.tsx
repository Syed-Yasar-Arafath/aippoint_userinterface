import internalApi from '../utilities/internalApiInterview'
// const organisation = localStorage.getItem('organisation')

export async function logIn(data: any, organisation: any) {
  try {
    const response = await internalApi.post(
      `/interview/logincandidate/${organisation}`,
      data,
    )
    return response.data
  } catch (error) {
    return error
  }
}
export async function codinglogin(data: any, organisation: any) {
  try {
    const response = await internalApi.post(
      `/interview/codinglogin/${organisation}`,
      data,
    )
    return response
  } catch (error) {
    return error
  }
}
//////////////////
codinglogin

export async function setPassword(data: any) {
  try {
    const response = await internalApi.post('/user/create-password', data)
    return response.data
  } catch (error) {
    return error
  }
}
export async function signUp(data: any) {
  try {
    const response = await internalApi.post('/user/sign-up', data)
    return response.data
  } catch (error) {
    return error
  }
}

export async function createUser(data: any) {
  try {
    const response = await internalApi.post('/user/create-user', data)
    return response.data
  } catch (error) {
    return error
  }
}

export async function createUserAccess(data: any) {
  try {
    const response = await internalApi.post('/user/create-user-access', data)
    return response.data
  } catch (error) {
    return error
  }
}

export async function forgotUserPassword(data: any) {
  try {
    const response = await internalApi.post('/user/forgot-password', data)
    return response.data
  } catch (error) {
    return error
  }
}

export async function changeUserPassword(data: any) {
  try {
    const response = await internalApi.post('/user/change-password', data)
    return response.data
  } catch (error) {
    return error
  }
}
// export async function updateRole(data: any) {
//   try {
//     const response = await internalApi.put('/roles', data)
//     return response.data
//   } catch (error) {
//     return error
//   }
// }
export async function postMail(data: any) {
  try {
    const response = await internalApi.post('/user/write/mail', data)
    return response.data
  } catch (error) {
    return error
  }
}

export async function getUserData() {
  try {
    const res = await internalApi.get('/user')
    const roleAccess = res.data.role_type.job_descriptions_read
    console.log(roleAccess)
    if (roleAccess) {
      return roleAccess
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export async function getUser() {
  try {
    const response = await internalApi.get('/user/read')
    return response.data
  } catch (error) {
    return error
  }
}

export async function getCompany(organisation: any) {
  try {
    const response = await internalApi.get(
      `/company/read/getall/${organisation}`,
    )
    return response.data
  } catch (error) {
    return error
  }
}

export async function getAllUser() {
  try {
    const response = await internalApi.get('/user/read/all')
    return response.data
  } catch (error) {
    return error
  }
}

export async function putUserPartial(data: any, organisation: any) {
  try {
    const response = await internalApi.put(
      `/user/edit/partial-update/${organisation}`,
      data,
    )
    return response.data
  } catch (error) {
    return error
  }
}

export async function userRoleUpdate(user_id: any, data: object) {
  try {
    const response = await internalApi.put(`/user/role-update/${user_id}`, data)
    return response.data
  } catch (error) {
    return error
  }
}

export async function putUser(data: any) {
  try {
    const response = await internalApi.put('/user', data)
    return response.data
  } catch (error) {
    return error
  }
}
export async function putUserSubscription(data: any) {
  try {
    const response = await internalApi.put('/user/subscribe', data)
    return response.data
  } catch (error) {
    return error
  }
}
export async function putUserRole(user_id: any, data: object) {
  try {
    const response = await internalApi.put('user/roles/' + user_id, data)
    return response.data
  } catch (error) {
    return error
  }
}
export async function updateInterview(meetingId: any, organization: any) {
  try {
    const response = await internalApi.post(
      `/interview/updateinterviewstatus/${organization}`,
      { meetingId },
    )
    return response.data
  } catch (error) {
    return error
  }
}
export async function updateInterviewCoding(meetingId: any, organization: any) {
  try {
    const response = await internalApi.post(
      `/interview/updateinterviewstatuscoding/${organization}`,
      { meetingId },
    )
    return response.data
  } catch (error) {
    return error
  }
}
