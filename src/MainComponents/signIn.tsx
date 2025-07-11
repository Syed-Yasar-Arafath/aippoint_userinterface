import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  MenuItem,
  Select,
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
import { useDispatch } from 'react-redux'
import {
  loaderOff,
  loaderOn,
  openSnackbar,
  updatEmaill,
  updateToken,
} from '../redux/actions'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { signIn } from '../services/UserService'
import { useSignInForm } from '../custom-components/custom_forms/SignInForm'
import { emailRegex } from '../custom-components/CustomRegex'
import { useSignUpForm } from '../custom-components/custom_forms/SignUpForm'

// export const passwordRegex1 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{10,}$/
// export const passwordRegex2 =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%^&*])[A-Za-z\d@$!%^&*]{10,}$/

export const passwordRegex1 = /^.{10,}$/

function SignIn() {
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
    width: '339px',
    border: '2px solid #0284C7',
    textTransform: 'none',
  }

  const textarea: React.CSSProperties = {
    border: '2px solid #0A0B5C',
    borderRadius: '6px',
    marginTop: '8px',
    width: '339px',
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

  const { formValues, setFormValues } = useSignInForm()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const handleLogin = (token: any) => {
    const userData: string = token
    sessionStorage.setItem('jwtToken', userData)
    sessionStorage.setItem('isLoggedIn', 'true')
  }
  const googleProvider = new GoogleAuthProvider()

  const handleChange = (e: any) => {
    const { name, value } = e.target
    if (name === 'password') {
      const password: string = value
      const isValidPassword: boolean = passwordRegex1.test(password)
      // const isValidPassword: boolean =
      // passwordRegex1.test(password) || passwordRegex2.test(password)
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
  const [checkValid, setCheckValid] = useState(false)
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
    const isValidPassword: boolean = passwordRegex1.test(password)
    // const isValidPassword: boolean =
    //   passwordRegex1.test(password) || passwordRegex2.test(password)

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
      if (type == 'sign-in') {
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

  const { formValues: initialFormValues } = useSignUpForm()
  const resetForm = () => {
    setFormValues(initialFormValues)
  }

  const isValidEmail = (email: any) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }
  const [temporg, setTemporg] = useState('')
  const getOrganisation = async (email: string) => {
    if (!email || !isValidEmail(email)) {
      console.error('Email is null or undefined')
      return null
    }

    try {
      const res: any = await axios.post(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/admin/getschema/${email}`,
      )

      if (res.status === 200 && res.data !== 'no user found') {
        // ✅ Save organisation to localStorage immediately after successful response
        localStorage.setItem('organisation', res.data)
        setTemporg(res.data)
        console.log('Organisation set:', res.data)
        return res.data
      }

      return null
    } catch (error) {
      console.error('Error fetching organisation name:', error)
      return null
    }
  }
  useEffect(() => {
    getOrganisation(email)
  }, [email])

  localStorage.setItem('organisation', temporg)

  const organisation = localStorage.getItem('organisation')
  console.log('orggggg', organisation)
  const handleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault()
    // dispatch(loaderOn());
    const invalidSubmit = validateForm('sign-in')
    if (!invalidSubmit) {
      const formData = new FormData()
      const password: any = formValues.password.value
      // const hashedPassword = await bcrypt.hashSync(password, saltRounds)
      const email: any = formValues.email.value
      formData.append('email', email)
      formData.append('password', password)

      const data = {
        email: email,
        password: password,
      }
      try {
        const res: any = await signIn(data, temporg)
        // const organisation = localStorage.getItem('organisation')
        // const response: any = await axios.post(
        //   `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/admin/signin-user/${organisation}`,
        //   data,
        // )

        dispatch(loaderOff())

        if (res === 'Account needs to be activated') {
          dispatch(openSnackbar('Account not activated', 'red'))
          // dispatch(openSnackbar(t('accountNotActivatedSnackbar'), 'red'))
        } else if (res.length >= 50) {
          localStorage.setItem('token', res)
          localStorage.setItem('email', email)
          dispatch(updateToken('login successful'))
          dispatch(openSnackbar('User logged In successfully', 'dodgerblue'))
          // dispatch(updateToken(t('loginSuccessfulSnackbar')))
          // dispatch(openSnackbar(t('userLoggedInSnackbar'), 'dodgerblue'))
          // navigate('/RecruitmentDashboard')
          navigate('/uploadCV')
          fetchDiagnostic()
          sendOrg(organisation);
        } else if (
          res.data === 'User not found' ||
          res.data === 'Invalid username or password'
        ) {
          dispatch(openSnackbar('Invalid Username or Password..!!', 'red'))
          // dispatch(openSnackbar(('invalidEmailAndPasswordSnackbar'), 'red'))
        } else {
          dispatch(
            openSnackbar(
              'Please enter your registered email and password.',
              'red',
            ),
          )
          // dispatch(
          //   openSnackbar(('enterRegisterdEmailAndPasswordSnackbar'), 'red'),
          // )
          // navigate('/creationjd')
          // dispatch(openSnackbar("Invalid Username or Password..!!", "red"));
        }
      } catch (error) {
        // console.error('Error fetching data:', error)
      }
    }
    // else{
    // dispatch(openSnackbar("Please check for both the fields", "red"));}
  }
  // const login = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   const requiredFields = ['email', 'password']
  //   const emptyFields = requiredFields.filter(
  //     (field) => formValues[field].value.trim() === '',
  //   )

  //   if (emptyFields.length > 0) {
  //     // Display error messages for empty fields
  //     emptyFields.forEach((field) => {
  //       setFormValues((prevState) => ({
  //         ...prevState,
  //         [field]: {
  //           ...prevState[field],
  //           error: true,
  //         },
  //       }))
  //     })
  //     // Return or display error message indicating required fields are empty
  //     return
  //   }

  //   e.preventDefault()
  //   dispatch(loaderOn())
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       email,
  //       password,
  //     )
  //     const user = userCredential.user
  //     const token = await user.getIdToken()
  //     dispatch(updateToken(token))
  //     console.log(token)
  //     const res = await axios.post(
  //       '${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/user/demo-sso',
  //       null,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     )
  //     if (res.status == 200) {
  //       dispatch(updatEmaill(email))
  //       setEmail('')
  //       setPassword('')
  //       handleLogin(res.data)
  //       dispatch(openSnackbar('Login successfully', 'green'))
  //       // setTimeout(() => {
  //       //   window.location.href = '/dashboard'
  //       //   dispatch(loaderOff())
  //       // }, 200)
  //       setTimeout(() => {
  //         navigate('uploadfiles')
  //       }, 100)
  //     }
  //     dispatch(loaderOff())
  //   } catch (error: any) {
  //     dispatch(openSnackbar('Invalid Login Credentials', 'red'))
  //     console.error(error.message)
  //     setError(error.message)
  //     dispatch(loaderOff())
  //   }
  // }

  // const handleChange = (e: any) => {
  //   const { name, value } = e.target
  //   if (name === 'password') {
  //     const password: string = value
  //     const isValidPassword: boolean = passwordRegex.test(password)
  //     setFormValues({
  //       ...formValues,
  //       [name]: {
  //         ...formValues[name],
  //         value,
  //         error: !isValidPassword,
  //       },
  //     })
  //   } else if (name === 'email') {
  //     const email: string = value
  //     const isValidEmail: boolean = emailRegex.test(email)
  //     setFormValues({
  //       ...formValues,
  //       [name]: {
  //         ...formValues[name],
  //         value,
  //         error: !isValidEmail,
  //       },
  //     })
  //   } else {
  //     setFormValues({
  //       ...formValues,
  //       [name]: {
  //         ...formValues[name],
  //         value,
  //         error: value === '' ? true : false,
  //       },
  //     })
  //   }
  // }

  // const signInWithProvider = async (provider: any) => {
  //   dispatch(loaderOn())
  //   try {
  //     const result = await signInWithPopup(auth, provider)
  //     const token = result.user.getIdToken()
  //     const emailResult = await sendEmailVerification(result.user)
  //     console.log(result.user)
  //     if (token != null && emailResult != null) {
  //       const res = await axios.post(
  //         '${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/user/demo-sso',
  //         null,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         },
  //       )
  //       if (res.status == 200) {
  //         navigate('homepage')
  //         dispatch(openSnackbar('Login successfully', 'green'))
  //         dispatch(loaderOff())
  //       }
  //     }
  //     dispatch(loaderOff())
  //     // Redirect or update UI
  //   } catch (error: any) {
  //     dispatch(openSnackbar('Invalid Login Credentials', 'red'))
  //     console.error(error.message)
  //     setError(error.message)
  //     dispatch(loaderOff())
  //   }
  // }

  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)

  //code to send organisation

  const sendOrg = async (dbName: any) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get-organization-name/`,
        {
          headers: { Organization: dbName },
        },
      )
      console.log(response.data) // Log the whole response
    } catch (error: any) {
      console.error(
        'Error:',
        error.response ? error.response.data : error.message,
      )
    }
  }
  const fetchDiagnostic = async () => {
    try {
      // Call the Django diagnostic endpoint using an absolute URL.
      const response = await fetch(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/diagnostic/?org=${organisation}`,
      )
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      const data = await response.json()
      // setActiveDatabase(data.active_database);
    } catch (err: any) {
      setError(err.message)
    }
  }




  return (
    // <div style={{ background: '#FFFFFF', overflowY: 'hidden' }}>
    //   <Grid container spacing={2}>
    //     <Grid
    //       item
    //       lg={12}
    //       sx={{
    //         display: 'flex',
    //         justifyContent: 'flex-end',
    //         paddingRight: '20px',
    //       }}
    //     >
    //       {/* <FormControl>
    //         <Select
    //           labelId="language-select-label"
    //           id="language-select"
    //           value={changeLanguage}
    //           onChange={handleChangeLanguage}
    //         >
    //           <MenuItem value="en">English</MenuItem>
    //           <MenuItem value="ar">العربية</MenuItem>
    //         </Select>
    //       </FormControl> */}
    //     </Grid>
    //     <Grid item lg={6} sx={{ margin: '0px 0px 0px 100px' }}>
    //       <img
    //         src="assets/static/images/logimg.png"
    //         style={{
    //           width: '70%',
    //           height: '550px',
    //           minHeight: '60vh',
    //           borderRadius: '20px',
    //           borderLeft: '50px',
    //         }}
    //       />
    //     </Grid>
    //     <Grid
    //       item
    //       lg={5}
    //       style={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //         // alignItems: 'center',
    //         // justifyContent: 'center',
    //         // textAlign: 'center',
    //       }}
    //     >
    //       {/* <p
    //         style={{
    //           fontSize: '32px',
    //           fontWeight: 700,
    //           lineHeight: '40.51px',
    //           color: '#0A0B5C',
    //           marginBottom: '33px',
    //         }}
    //       >
    //          Sign In  */}
    //         {/* {('signIn')} */}
    //       {/* </p> */}
    //       <img src="assets/static/images/aippointlogo.png"
    //       style={{
    //         height:'57px',
    //         width:'198.79px'
    //       }}
    //       />
    //       <Typography style={{
    //           fontSize: '14px',
    //           fontWeight: 500,
    //           lineHeight: '100%',
    //           color: '#0284C7',
    //           paddingTop:'20px'
    //         }}>Welcome Back!</Typography>
    //       <Typography style={{
    //           fontSize: '12px',
    //           fontWeight: 400,
    //           lineHeight: '100%',
    //           color: '#1C1C1E',
    //           paddingTop:'11px',
    //         }}>Login to access your dashboard, manage job descriptions, assessments, and candidate interactions.</Typography>

    //       <div>
    //         <p style={labels}>
    //           Email
    //           {/* {t('email')} */}
    //           {/* <span
    //             style={{
    //               fontWeight: 300,
    //               color: '#E33629',
    //             }}
    //           >
    //             *
    //           </span> */}
    //         </p>
    //         <TextField
    //           sx={textarea}
    //           placeholder="Your email"
    //           // placeholder={t('emailPlaceholder')}
    //           variant="outlined"
    //           name="email"
    //           type="email"
    //           autoComplete="off"
    //           onChange={(e) => {
    //             setEmail(e.target.value)
    //             handleChange(e)
    //           }}
    //           value={formValues.email.value}
    //           error={formValues.email.error}
    //           // helperText={
    //           //   formValues.email.error && formValues.email.errorMessage
    //           // }
    //           inputProps={{
    //             style: { textAlign:'left' },
    //           }}
    //           InputProps={{
    //             startAdornment: (
    //               <IconButton>
    //                 <EmailIcon style={{ color: '#000000' }} />
    //               </IconButton>
    //             ),
    //           }}
    //         />
    //         {formValues.email.error && (
    //           <Typography variant="body2" color="error">
    //             {formValues.email.errorMessage}
    //           </Typography>
    //         )}
    //       </div>
    //       <div>
    //         <p
    //           style={{
    //             ...labels,
    //             marginTop: '12px',
    //           }}
    //         >
    //           Password
    //           {/* {t('password')} */}
    //           {/* <span
    //             style={{
    //               fontWeight: 300,
    //               color: '#E33629',
    //             }}
    //           >
    //             *
    //           </span> */}
    //         </p>
    //         <TextField
    //           sx={textarea}
    //           placeholder="Enter password"
    //           // placeholder={t('passwordPlaceholder')}
    //           variant="outlined"
    //           name="password"
    //           autoComplete="off"
    //           type={showPassword ? 'text' : 'password'}
    //           onChange={(e) => {
    //             setPassword(e.target.value)
    //             handleChange(e)
    //           }}
    //           value={formValues.password.value}
    //           error={formValues.password.error}
    //           inputProps={{
    //             style: { textAlign: 'left' },
    //           }}
    //           InputProps={{
    //             startAdornment: (
    //               <InputAdornment position="start">
    //                 <LockIcon style={{ color: '#000000' }} />
    //               </InputAdornment>
    //             ),
    //             endAdornment: (
    //               <InputAdornment position="end">
    //                 <IconButton
    //                   onClick={handleClickShowPassword}
    //                   sx={{
    //                     color: '#000000',
    //                   }}
    //                 >
    //                   {showPassword ? <Visibility /> : <VisibilityOff />}
    //                 </IconButton>
    //               </InputAdornment>
    //             ),
    //           }}
    //         />

    //         {formValues.password.error && (
    //           <Typography variant="body2" color="error">
    //             {formValues.password.errorMessage.slice(0, 35)}
    //             <br />
    //             {formValues.password.errorMessage.slice(35, 70)}
    //             <br />
    //             {formValues.password.errorMessage.slice(70)}
    //           </Typography>
    //         )}
    //       </div>
    //       <Link
    //         to={'/forgotpassword_ai'}
    //         style={{
    //           ...text,
    //           // paddingLeft: '110px',
    //           color: '#E33629',
    //         }}
    //       >
    //         Forgot Password ?
    //         {/* {t('forgotPassword')} */}
    //       </Link>
    //       <Button
    //         sx={{
    //           ...btn,
    //           background: '#0284C7',
    //           marginTop: '10px',
    //           padding: '10px',
    //           color: '#E8F1FF',
    //           '&:hover': {
    //             background: '#0284C7',
    //           },
    //         }}
    //         // onClick={(e) => login(e)}
    //         onClick={handleSignIn}
    //       >
    //         Login
    //         {/* {t('signIn')} */}
    //       </Button>
    //       <p
    //         style={{
    //           ...text,
    //           color: '#666666',
    //         }}
    //       >
    //         {/* Or Sign in Using */}
    //       </p>
    //       {/* <div
    //         style={{
    //           display: 'flex',
    //           justifyContent: 'center',
    //           flexDirection: 'column',
    //           gap: '12px',
    //           marginTop: '12px',
    //         }}
    //       >
    //         <Button
    //           sx={{
    //             ...btn,
    //             paddingTop: '10px',
    //             '&:hover': {
    //               background: 'none',
    //             },
    //           }}
    //           onClick={() => signInWithProvider(googleProvider)}
    //         >
    //           <p style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
    //             <img
    //               src="assets/static/images/Group 39.png"
    //               style={{ paddingBottom: '2px' }}
    //             />{' '}
    //             Google
    //           </p>
    //         </Button>
    //         <Button
    //           sx={{
    //             ...btn,
    //             paddingTop: '15px',
    //             '&:hover': {
    //               background: 'none',
    //             },
    //           }}
    //         >
    //           <p style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
    //             <img
    //               src="assets/static/images/Apple logo.png"
    //               style={{ paddingBottom: '2px' }}
    //             />
    //             Apple
    //           </p>
    //         </Button>
    //       </div> */}
    //       <p
    //         style={{
    //           fontWeight: 400,
    //           fontSize: '16px',
    //           color: '#0A0B5C',
    //           marginTop: '23px',
    //         }}
    //       >
    //         {/* Don’t have an account{' '} */}
    //         {/* {t('noAccount')}{' '} */}
    //         <pre></pre>
    //         <Link
    //           to={'/signup_ai'}
    //           style={{ color: '#0284C7', textDecoration: 'none' }}
    //         >
    //           {/* Create One ! */}
    //           {/* {t('createAccount')} */}
    //           <pre></pre>
    //         </Link>
    //       </p>
    //     </Grid>
    //   </Grid>
    // </div>
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left image */}
      <Grid container spacing={0} sx={{ paddingTop: '11px', paddingLeft: '9px' }}>
        <Grid item lg={6}>
          <Box
            sx={{
              // flex: 1,
              // display: { xs: 'none', md: 'flex' },
              // justifyContent: 'center',
              // alignItems: 'center',
              backgroundColor: '#fff',
            }}
          >
            <img
              src="/assets/static/images/logimg.png"
              alt="login"
              style={{
                width: 'auto',
                height: '95vh',


              }}
            />
          </Box>
        </Grid>

        {/* Right login form */}
        <Grid item lg={4}>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              px: 4,
              py: 6,
              backgroundColor: '#fff',
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <img
                src="/assets/static/images/aippointlogo.png"
                alt="logo"
                style={{ height: '57px', width: '198.79px', marginBottom: 24 }}
              />
              <Typography fontSize={14} fontWeight={500} color="#0284C7">
                Welcome Back!
              </Typography>
              {/* <Typography fontSize={12} fontWeight={400} mt={1} color="#1C1C1E">
                Login to access your dashboard, manage job descriptions, assessments, and candidate interactions.
              </Typography> */}

              {/* Email */}
              <Typography mt={3} fontSize={16} color="#0A0B5C" fontWeight={300}>
                Email
              </Typography>
              <TextField
                fullWidth
                name="email"
                placeholder="Your email"
                variant="outlined"
                size='small'
                value={formValues.email.value}
                onChange={(e) => {
                  setEmail(e.target.value)
                  handleChange(e)
                }}
                error={formValues.email.error}
                sx={{ mt: 1, mb: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {formValues.email.error && (
                <Typography variant="body2" color="error">
                  {formValues.email.errorMessage}
                </Typography>
              )}

              {/* Password */}
              <Typography fontSize={16} color="#0A0B5C" fontWeight={300}>
                Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                size='small'
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                variant="outlined"
                value={formValues.password.value}
                onChange={handleChange}
                error={formValues.password.error}
                sx={{ mt: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {formValues.password.error && (
                <Typography variant="body2" color="error">
                  {formValues.password.errorMessage.slice(0, 35)}
                  {/* <br /> */}
                  {formValues.password.errorMessage.slice(35, 70)}
                  {/* <br /> */}
                  {formValues.password.errorMessage.slice(70)}
                </Typography>
              )}

              {/* Forgot Password */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={keepLoggedIn}
                      onChange={(e) => setKeepLoggedIn(e.target.checked)}
                      sx={{
                        color: '#0A0B5C',
                        '&.Mui-checked': {
                          color: '#0284C7',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography fontSize={14} color="#0A0B5C">
                      Keep me logged in
                    </Typography>
                  }
                />

                <Link
                  to="/forgotpassword_ai"
                  style={{ fontSize: 14, color: '#E33629', textDecoration: 'none' }}
                >
                  Forgot Password?
                </Link>
              </Box>

              {/* Submit */}
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#0284C7',
                  color: '#fff',
                  mt: 3,
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#0369a1' },
                }}
                onClick={handleSignIn}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SignIn