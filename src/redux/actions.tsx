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

// Upload Status Actions
export const addUpload = (upload: {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx';
  status: 'uploading' | 'success' | 'error' | 'cancelled';
  uploadDate: string;
  size: string;
  progress?: number;
  errorMessage?: string;
}) => ({
  type: 'ADD_UPLOAD' as const,
  payload: upload,
})

export const updateUploadStatus = (id: string, updates: {
  status?: 'uploading' | 'success' | 'error' | 'cancelled';
  progress?: number;
  errorMessage?: string;
  uploadDate?: string;
}) => ({
  type: 'UPDATE_UPLOAD_STATUS' as const,
  payload: { id, ...updates },
})

export const clearUploads = () => ({
  type: 'CLEAR_UPLOADS' as const,
})
