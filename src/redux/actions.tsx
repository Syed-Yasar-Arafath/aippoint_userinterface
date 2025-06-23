// redux/actions.ts

export const login = (user: string) => ({
  type: 'LOGIN' as const,
  payload: user,
})

export const logout = () => ({
  type: 'LOGOUT' as const,
})

export const loaderOn = () => ({
  type: 'SET_LOADING' as const,
})

export const loaderOff = () => ({
  type: 'SET_LOADING_OFF' as const,
})
export const updaeToken = (token: any) => ({
  type: 'TOKEN_UPDATE',
  payload: token,
})

export const openSnackbar = (message: any, color: any) => ({
  type: 'OPEN_SNACKBAR',
  payload: message,
  color: color,
})

export const closeSnackbar = () => ({
  type: 'CLOSE_SNACKBAR',
})
export const uploadImage = (imageData: string) => ({
  type: 'UPLOAD_IMAGE' as const,
  payload: imageData,
})

export const updatEmaill = (email: string) => ({
  type: 'UPDATE_EMAIL' as const,
  payload: email,
})

export const updateToken = (token: any) => ({
  type: 'UPDATE_VALUE' as const,
  payload: token,
})
