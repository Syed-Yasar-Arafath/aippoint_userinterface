import internalApi from '../utilities/internalApi'

// const organisation = localStorage.getItem('organisation')
export async function signIn(data: any, organisation: any) {
  try {
    const response = await internalApi.post(
      `/admin/signin-user/${organisation}`,
      data,
    )
    return response.data
  } catch (error) {
    return error
  }
}
export async function setPassword(data: any) {
  try {
    const response = await internalApi.post('/user/write/create-password', data)
    return response.data
  } catch (error) {
    return error
  }
}
export async function signUp(data: any) {
  try {
    const response = await internalApi.post('/user/create', data)
    return response.data
  } catch (error) {
    return error
  }
}

export async function createUser(data: any) {
  try {
    const response = await internalApi.post('/user/write/create-user', data)
    return response.data
  } catch (error) {
    return error
  }
}

export async function createUserAccess(data: any) {
  try {
    const response = await internalApi.post(
      '/user/write/create-user-access',
      data,
    )
    return response.data
  } catch (error) {
    return error
  }
}

export async function forgotUserPasswords(data: any) {
  try {
    const response = await internalApi.post('/user/write/forgot-password', data)
    return response.data
  } catch (error) {
    return error
  }
}
export async function forgotUserPassword(data: any, organisation: any) {
  try {
    const response = await internalApi.post(
      `/user/forgotPassword/${organisation}`,
      data,
    )
    return response.data
  } catch (error) {
    return error
  }
}

// export async function changeUserPassword(data: any) {
//   try {
//     const response = await internalApi.post('/user/write/change-password', data)
//     return response.data
//   } catch (error) {
//     return error
//   }
// }
export async function changeUserPassword(data: any, organisation: any) {
  try {
    const response = await internalApi.post(
      `/user/changePassword/${organisation}`,
      data,
    )
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

export async function getUserData(organisation: any) {
  try {
    const res = await internalApi.get(`/user/read/${organisation}`)
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

export async function getUser(organisation: any) {
  try {
    // const response = await internalApi.get('/user/read')// `admin/signin-user/${organisation}`
    const response = await internalApi.get(`/user/read/${organisation}`)
    return response.data
  } catch (error) {
    return error
  }
}

export async function getCompany() {
  try {
    const response = await internalApi.get('/company/read/getall')
    return response.data
  } catch (error) {
    return error
  }
}

export async function getAllUser(organisation: any) {
  try {
    const response = await internalApi.get(`/user/read/all/${organisation}`)
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

export async function userRoleUpdate(
  user_id: any,
  data: object,
  organisation: any,
) {
  try {
    const response = await internalApi.put(
      `/user/edit/role-update/${user_id}/${organisation}`,
      data,
    )
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
export async function putUserSubscription(data: any, organisation: any) {
  try {
    const response = await internalApi.put(
      `/user/subscribe/${organisation}`,
      data,
    )
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

export async function getUserDetails(organisation: any) {
  try {
    const token = localStorage.getItem('token')
    const response = await internalApi.get(`/user/read/${organisation}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
export async function isVallidToken(token: any) {
  try {
    // const token = localStorage.getItem('token')
    const response = await internalApi.post(
      '/admin/tokenexp',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
