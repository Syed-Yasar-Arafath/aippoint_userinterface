import { createStore, combineReducers } from 'redux'

// Define types for the state

interface AuthState {
  isLoggedIn: boolean
  user: string | null
}

// Upload Status State
interface UploadStatusState {
  uploads: Array<{
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'docx';
    status: 'uploading' | 'success' | 'error' | 'cancelled';
    uploadDate: string;
    size: string;
    progress?: number;
    errorMessage?: string;
  }>;
  totalUploads: number;
  successfulUploads: number;
  failedUploads: number;
}

const initialUploadStatusState: UploadStatusState = {
  uploads: [],
  totalUploads: 0,
  successfulUploads: 0,
  failedUploads: 0,
}

// Initial state
const initialAuthState: AuthState = {
  isLoggedIn: false,
  user: null,
}

interface LoadingState {
  isLoading: boolean
}

const initialLoadingState: LoadingState = {
  isLoading: false,
}
const initialState = {
  tokenData: null,
}

// Reducer to manage login state
function authReducer(state = initialAuthState, action: any): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      }
    default:
      return state
  }
}
interface iState {
  inValue: string | null
}
const initialStates: iState = {
  inValue: '',
}

function iReducer(state = initialStates, action: any): iState {
  switch (action.type) {
    case 'UPDATE_VALUE':
      return {
        ...state,
        inValue: action.payload,
      }
    default:
      return state
  }
}
// Reducer to manage isLoading state
function loadingReducer(
  state = initialLoadingState,
  action: any,
): LoadingState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: true,
      }
    case 'SET_LOADING_OFF':
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state
  }
}

// Snackbar Reducer
const snackbarReducer = (
  state = { open: false, message: '', color: '' },
  action: any,
) => {
  switch (action.type) {
    case 'OPEN_SNACKBAR':
      return { open: true, message: action.payload, color: action.color }
    case 'CLOSE_SNACKBAR':
      return { open: false, message: '', color: '' }
    default:
      return state
  }
}
interface ImageState {
  imageData: string | null
}

const initialImageState: ImageState = {
  imageData: null,
}
function imageReducer(state = initialImageState, action: any): ImageState {
  switch (action.type) {
    case 'UPLOAD_IMAGE':
      return {
        ...state,
        imageData: action.payload,
      }
    default:
      return state
  }
}
const initialEmail = {
  email: null,
}
const emailReducer = (state = initialEmail, action: any) => {
  switch (action.type) {
    case 'UPDATE_EMAIL':
      return { ...state, email: action.payload }
    default:
      return state
  }
}

const tokrnReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'TOKEN_UPDATE':
      return { ...state, tokenData: action.payload }
    default:
      return state
  }
}

// Upload Status Reducer
const uploadStatusReducer = (state = initialUploadStatusState, action: any): UploadStatusState => {
  switch (action.type) {
    case 'ADD_UPLOAD':
      return {
        ...state,
        uploads: [action.payload, ...state.uploads],
        totalUploads: state.totalUploads + 1
      }
    case 'UPDATE_UPLOAD_STATUS':
      const updatedUploads = state.uploads.map(upload => 
        upload.id === action.payload.id 
          ? { ...upload, ...action.payload }
          : upload
      );
      
      const successfulCount = updatedUploads.filter(u => u.status === 'success').length;
      const failedCount = updatedUploads.filter(u => u.status === 'error').length;
      
      return {
        ...state,
        uploads: updatedUploads,
        successfulUploads: successfulCount,
        failedUploads: failedCount
      }
    case 'CLEAR_UPLOADS':
      return initialUploadStatusState;
    default:
      return state
  }
}

// Combine reducers if you have more than one reducer
const rootReducer = combineReducers({
  auth: authReducer,
  loading: loadingReducer,
  tokenChange: iReducer,
  snackbar: snackbarReducer,
  image: imageReducer,
  token: tokrnReducer,
  emm: emailReducer,
  uploadStatus: uploadStatusReducer,
})

export type RootState = ReturnType<typeof rootReducer>

// Create the Redux store
const store = createStore(rootReducer)

export default store
