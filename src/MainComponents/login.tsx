import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import { Link, useNavigate } from 'react-router-dom'
import {
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateEmail,
} from 'firebase/auth'
import axios from 'axios'
// import { auth } from '../../../../MULTI_DEV/aippoint_frontend/src/firebase/firebase-config'
// import { useSignInForm } from '../../../../MULTI_DEV/aippoint_frontend/src/custom-components/custom_forms/SignInForm'
// import {
//   emailRegex,
//   loginPasswordRegex1,
// } from '../../../../MULTI_DEV/aippoint_frontend/src/custom-components/CustomRegex'
import { useDispatch } from 'react-redux'
import {
  loaderOff,
  loaderOn,
  openSnackbar,
  updaeToken,
  updatEmaill,
} from '../redux/actions'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useLogInForm } from '.././custom-components/custom_forms/LoginForm'
// import { logIn } from '../services/'
import { t } from 'i18next'
// import i18n from '../../../../MULTI_DEV/aippoint_frontend/src/i18n'
import { useTranslation } from 'react-i18next';
import { logIn } from '../services/InterviewService'
import i18n from '../i18n'
import { emailRegex, loginPasswordRegex1 } from '../custom-components/CustomRegex'
import { auth } from '../firebase/firebase-config'

function Login() {
  // const organisation = localStorage.getItem('organisation')
  const labels: React.CSSProperties = {
    fontWeight: 300,
    fontSize: '16px',
    lineHeight: '20px',
    textAlign: 'start',
    color: '#0A0B5C',
  }

  const btn: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '6px',
    gap: '10px',
    color: '#0A0B5C',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '20PX',
    width: '250px',
    border: '1.5px solid #0284C7',
    textTransform: 'none',
  }

  const textarea: React.CSSProperties = {
    border: '1.5px solid #0A0B5C',
    borderRadius: '6px',
    marginTop: '10px',
    width: '250px',
  }

  const text: React.CSSProperties = {
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '31px',
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: '10px',
    textDecoration: 'none',
  }

  const { formValues, setFormValues } = useLogInForm()
const { t } = useTranslation();
 
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const validateForm = (type: any) => {
    let invalidSubmit = false
    const email: string = formValues.email.value
    const isValidEmail: boolean = emailRegex.test(email)
    setFormValues({
      ...formValues,
      ['email']: {
        ...formValues['email'],
        error: !isValidEmail,
      },
    })
    invalidSubmit = !isValidEmail
    const password: string = formValues.password.value
    const isValidPassword: boolean = loginPasswordRegex1.test(password)
    setFormValues({
      ...formValues,
      ['password']: {
        ...formValues['password'],
        error: true,
      },
    })
    invalidSubmit = !isValidPassword
    const formFields = Object.keys(formValues)
    let newFormValues = { ...formValues }
    for (let index = 0; index < formFields.length; index++) {
      const currentField = formFields[index]
      const currentValue = formValues[currentField].value
      if (type == 'log-in') {
        if (currentValue === '') {
          newFormValues = {
            ...newFormValues,
            [currentField]: {
              ...newFormValues[currentField],
              error: true,
            },
          }
        }
      }
    }
    setFormValues(newFormValues)
    Object.values(newFormValues).every((number: any) => {
      if (number.error) {
        invalidSubmit = number.error
        // dispatch(loaderOff());
        return false
      }
    })
    // dispatch(loaderOff());
    return invalidSubmit
  }
  // const handleLogin = async (e: React.MouseEvent) => {
  //   // const userData: string = token
  //   // sessionStorage.setItem('jwtToken', userData)
  //   // sessionStorage.setItem('isLoggedIn', 'true')
  //   e.preventDefault()
  //   const invalidSubmit = validateForm('log-in')
  //   if (!invalidSubmit) {
  //     const formData = new FormData()
  //     const email: any = formValues.email.value
  //     const password: any = formValues.password.value
  //     formData.append('email', email)
  //     formData.append('password', password)

  //     try {
  //       const res: any = await logIn(formData)
  //       console.log(res)
  //       console.log('hhhhhhh' + res.scheduled)
  //       dispatch(loaderOff())
  //       console.log(res.message == 'Network Error')
  //       if (res.userInterviewId !== null && res.scheduled === true) {
  //         navigate('/parseez_interviewattend')
  //         dispatch(openSnackbar('interview scheduled already..!', 'red'))
  //       } else if (res.userInterviewId !== null && res.scheduled === false) {
  //         navigate('/scheduleinterview_ai')
  //         localStorage.setItem('uniqueid', res.userInterviewId)
  //       } else if (
  //         res.userInterviewId === null &&
  //         res.scheduled === false &&
  //         res.message === 'No candidate found'
  //       ) {
  //         dispatch(openSnackbar('Invalid Candidate..!', 'red'))
  //       } else if (res.message == 'Network Error') {
  //         dispatch(openSnackbar('Please try again later', 'red'))
  //       }

  //       // else if (res === 'no candidate found') {
  //       //   dispatch(openSnackbar('Invalid Candidate..!', 'red'))
  //       // } else if (res.includes('sent ')) {
  //       //   dispatch(openSnackbar('Success', 'dodgerblue'))

  //       //   navigate('/scheduleinterview_ai')

  //       //   localStorage.setItem('uniqueid', res)
  //       // } else if (res === 'interview scheduled already') {
  //       //   navigate('/interviewscreen')
  //       //   dispatch(openSnackbar('interview scheduled already', 'red'))
  //       // } else if (res === 'invalid password') {
  //       //   dispatch(openSnackbar('Invalid Candidate..!', 'red'))
  //       // } else {
  //       //   dispatch(openSnackbar('Please try again later', 'red'))
  //       // }

  //       //*************************** */
  //       // if (res.data === 'Account needs to be activated') {
  //       //   dispatch(openSnackbar('Account not activated', 'red'))
  //       // } else if (res.data === 'Login successful') {
  //       //   dispatch(updateToken('login successful'))
  //       //   dispatch(openSnackbar('User logged In successfully', 'dodgerblue'))
  //       //   navigate('/home')
  //       // } else if (
  //       //   res.data === 'User not found' ||
  //       //   res.data === 'Invalid username or password'
  //       // ) {
  //       //   dispatch(openSnackbar('Invalid Username or Password..!!', 'red'))
  //       // } else {
  //       //   dispatch(openSnackbar('Please try again later', 'red'))
  //       //   // dispatch(openSnackbar("Invalid Username or Password..!!", "red"));
  //       // }
  //     } catch (error) {
  //       console.error('Error fetching data:', error)
  //     }
  //   }
  // }

  const [organisation, setOrganisation] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const organisationFromUrl: any = urlParams.get('organisation')
    const tokenFromUrl: any = urlParams.get('token')

    if (organisationFromUrl) {
      setOrganisation(organisationFromUrl)
      localStorage.setItem('organisation', organisationFromUrl)
    }
    // You can store the token in state or localStorage if needed
    if (tokenFromUrl) {
      // setToken(tokenFromUrl) or similar logic
    }
  }, [])

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search)
  //   const tokenFromUrl: any = urlParams.get('token')
  //   if (tokenFromUrl) {
  //     setOrganisation(tokenFromUrl)
  //   }
  // }, [])
  const handleLogin = async (e: React.MouseEvent) => {
    // const userData: string = token
    // sessionStorage.setItem('jwtToken', userData)
    // sessionStorage.setItem('isLoggedIn', 'true')

    e.preventDefault()
    const invalidSubmit = validateForm('log-in')
    if (!invalidSubmit) {
      const formData = new FormData()
      const email: any = formValues.email.value
      const password: any = formValues.password.value
      formData.append('email', email)
      formData.append('password', password)
      console.log(email, '   ===  ', password)

      try {
        const res: any = await logIn(formData, organisation)
        console.log(res)
        console.log('hhhhhh', res.userInterviewId)
        console.log('hhhhhhh' + res.scheduled)
        dispatch(loaderOff())
        console.log(res.message == 'Network Error')
        // if (res.userInterviewId !== null && res.scheduled === true) {
        if (res.userInterviewId !== null) {
          localStorage.setItem('uniqueid', res.userInterviewId)
          localStorage.setItem('organisation', organisation)
          // navigate('/interviewscreen')// `https://app.dyte.io/meeting/${newMeetingId}?token=${token}`
          navigate('/confirmjoininterview')
          localStorage.setItem('userType', 'candidateai');
        }
        //  else if (res.userInterviewId !== null && res.scheduled === false) {
        //   localStorage.setItem('uniqueid', res.userInterviewId)
        //   navigate('/scheduleinterview_ai')
        // }
        else if (
          res.userInterviewId === null &&
          res.scheduled === false &&
          res.message === t('noCandidateFound')
        ) {
          dispatch(openSnackbar(t('invalidCandidate'), 'red'))
        } else if (res.message == 'Network Error') {
          dispatch(openSnackbar(t('pleaseTryAgainLater'), 'red'))
        }

        // else if (res === 'no candidate found') {
        //   dispatch(openSnackbar('Invalid Candidate..!', 'red'))
        // } else if (res.includes('sent ')) {
        //   dispatch(openSnackbar('Success', 'dodgerblue'))

        //   navigate('/scheduleinterview_ai')

        //   localStorage.setItem('uniqueid', res)
        // } else if (res === 'interview scheduled already') {
        //   navigate('/interviewscreen')
        //   dispatch(openSnackbar('interview scheduled already', 'red'))
        // } else if (res === 'invalid password') {
        //   dispatch(openSnackbar('Invalid Candidate..!', 'red'))
        // } else {
        //   dispatch(openSnackbar('Please try again later', 'red'))
        // }

        //*************************** */
        // if (res.data === 'Account needs to be activated') {
        //   dispatch(openSnackbar('Account not activated', 'red'))
        // } else if (res.data === 'Login successful') {
        //   dispatch(updateToken('login successful'))
        //   dispatch(openSnackbar('User logged In successfully', 'dodgerblue'))
        //   navigate('/home')
        // } else if (
        //   res.data === 'User not found' ||
        //   res.data === 'Invalid username or password'
        // ) {
        //   dispatch(openSnackbar('Invalid Username or Password..!!', 'red'))
        // } else {
        //   dispatch(openSnackbar('Please try again later', 'red'))
        //   // dispatch(openSnackbar("Invalid Username or Password..!!", "red"));
        // }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }
  const googleProvider = new GoogleAuthProvider()

  const login = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const requiredFields = [t('email'), t('password')]
    const emptyFields = requiredFields.filter(
      (field) => formValues[field].value.trim() === '',
    )

    if (emptyFields.length > 0) {
      // Display error messages for empty fields
      emptyFields.forEach((field) => {
        setFormValues((prevState) => ({
          ...prevState,
          [field]: {
            ...prevState[field],
            error: true,
          },
        }))
      })
      // Return or display error message indicating required fields are empty
      return
    }

    e.preventDefault()
    dispatch(loaderOn())
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const user = userCredential.user
      const token = await user.getIdToken()
      dispatch(updaeToken(token))
      console.log(token)
      const res = await axios.post(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/user/demo-sso/${organisation}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (res.status == 200) {
        dispatch(updatEmaill(email))
        setEmail('')
        setPassword('')
        handleLogin(res.data)
        dispatch(openSnackbar(t('loginSuccessfully'), 'green'))
        // setTimeout(() => {
        //   window.location.href = '/dashboard'
        //   dispatch(loaderOff())
        // }, 200)
        setTimeout(() => {
          navigate('uploadfiles')
        }, 100)
      }
      dispatch(loaderOff())
    } catch (error: any) {
      dispatch(openSnackbar(t('invalidLoginCredentials'), 'red'))
      console.error(error.message)
      setError(error.message)
      dispatch(loaderOff())
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    if (name === 'password') {
      const password: string = value
      const isValidPassword: boolean = loginPasswordRegex1.test(password)
      setFormValues({
        ...formValues,
        [name]: {
          ...formValues[name],
          value,
          error: !isValidPassword,
        },
      })
    } else if (name === 'email') {
      const email: string = value
      const isValidEmail: boolean = emailRegex.test(email)
      setFormValues({
        ...formValues,
        [name]: {
          ...formValues[name],
          value,
          error: !isValidEmail,
        },
      })
    } else {
      setFormValues({
        ...formValues,
        [name]: {
          ...formValues[name],
          value,
          error: value === '' ? true : false,
        },
      })
    }
  }

  const signInWithProvider = async (provider: any) => {
    dispatch(loaderOn())
    try {
      const result = await signInWithPopup(auth, provider)
      const token = result.user.getIdToken()
      const emailResult = await sendEmailVerification(result.user)
      console.log(result.user)
      if (token != null && emailResult != null) {
        const res = await axios.post(
          `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/user/demo-sso/${organisation}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        if (res.status == 200) {
          navigate('homepage')
          dispatch(openSnackbar(t('loginSuccessfully'), 'green'))
          dispatch(loaderOff())
        }
      }
      dispatch(loaderOff())
      // Redirect or update UI
    } catch (error: any) {
      dispatch(openSnackbar(t('invalidLoginCredentials'), 'red'))
      console.error(error.message)
      setError(error.message)
      dispatch(loaderOff())
    }
  }

  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  
  return (
    <div style={{ background: '#FFFFFF', overflowY: 'hidden' }}>
      <Grid container spacing={2}>
        <Grid
          item
          lg={6}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '32px',
              fontWeight: 700,
              lineHeight: '40.51px',
              color: '#0A0B5C',
              marginBottom: '33px',
            }}
          >
            {/* Log In */}
            {t('logIn')}
          </p>
          <div>
            <p style={labels}>
              {/* Email */}
              {t('emailHead')}
              <span
                style={{
                  fontWeight: 300,
                  color: '#E33629',
                }}
              >
                *
              </span>
            </p>
            <TextField
              sx={textarea}
              // placeholder="Your email"
              placeholder={t('emailPlaceholder')}
              variant="outlined"
              name="email"
              type="email"
              autoComplete="off"
              onPaste={(e) => {
                e.preventDefault()
              }}
              onChange={(e) => {
                setEmail(e.target.value), handleChange(e)
              }}
              value={email}
              error={formValues.email.error}
              // helperText={
              //   formValues.email.error && formValues.email.errorMessage
              // }
              inputProps={{
                style: { textAlign: i18n.language === 'ar' ? 'right' : 'left' },
              }}
              InputProps={{
                startAdornment: (
                  <IconButton>
                    <EmailIcon style={{ color: '#000000' }} />
                  </IconButton>
                ),
              }}
            />
            {formValues.email.error && (
              <Typography variant="body2" color="error">
                {formValues.email.errorMessage}
              </Typography>
            )}
          </div>
          <div>
            <p
              style={{
                ...labels,
                marginTop: '12px',
              }}
            >
              {/* Password */}
              {t('password')}
              <span
                style={{
                  fontWeight: 300,
                  color: '#E33629',
                }}
              >
                *
              </span>
            </p>
            <TextField
              sx={textarea}
              // placeholder="Enter password"
              placeholder={t('passwordPlaceholder')}
              variant="outlined"
              name="password"
              autoComplete="off"
              type={showPassword ? 'text' : 'password'}
              // onPaste={(e) => {
              //   e.preventDefault()
              // }}
              onChange={(e) => {
                setPassword(e.target.value), handleChange(e)
              }}
              error={formValues.password.error}
              inputProps={{
                style: { textAlign: i18n.language === 'ar' ? 'right' : 'left' },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon style={{ color: '#000000' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      sx={{
                        color: '#000000',
                      }}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {formValues.password.error && (
              <Typography variant="body2" color="error">
                {formValues.password.errorMessage.slice(0, 35)}
                <br />
                {formValues.password.errorMessage.slice(35, 70)}
                <br />
                {formValues.password.errorMessage.slice(70)}
              </Typography>
            )}
          </div>
          {/* <Link
            to={'/forgotpassword_ai'}
            style={{
              ...text,
              paddingLeft: '110px',
              color: '#E33629',
            }}
          >
            Forgot Password ?
          </Link> */}
          <Button
            sx={{
              ...btn,
              background: '#0284C7',
              marginTop: '12px',
              padding: '10px',
              color: '#E8F1FF',
              '&:hover': {
                background: '#0284C7',
              },
            }}
            onClick={(e) => handleLogin(e)}
          >
            {/* Log In */}
            {t('logIn')}
          </Button>
        </Grid>
        <Grid item lg={6}>
          <img
            src="assets/static/SVG/Select Candidates.png"
            style={{
              width: '70%',
              height: '580px',
              minHeight: '60vh',
              borderRadius: '20px',
              borderLeft: '50px',
            }}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default Login
