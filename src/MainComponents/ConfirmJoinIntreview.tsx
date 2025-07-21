import {
  Alert,
  Button,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  Modal,
  Snackbar,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'

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
import { auth } from '../firebase/firebase-config'
import { useSignInForm } from '../custom-components/custom_forms/SignInForm'
import {
  emailRegex,
  loginPasswordRegex,
} from '../custom-components/CustomRegex'
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
import { useLogInForm } from '../custom-components/custom_forms/LoginForm'
import { logIn, updateInterview } from '../services/InterviewService'
import { t } from 'i18next'
import { MicIcon } from 'lucide-react'
// import useProctoring from './useProctoring'
import { useTranslation } from 'react-i18next';

function ConfirmJoinInterview() {
  const organisation = localStorage.getItem('organisation')

  const { t } = useTranslation();
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
    border: '1.5px solid #0A0B5C',
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

  const navigate = useNavigate()
  const dispatch = useDispatch()

  //   const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [error, setError] = useState('')
  const [meetingId, setMeetingId] = useState('')
  const [isAttendedinterview, setIsattendedinterview]: any = useState(null)
  const [jointime, setJointime]: any = useState(null)
  const [authToken, setAuthToken] = useState('')
  // openmodal/////////////////////
  const [open, setOpen] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [isCheckedInstruction, setIsCheckedInstruction] = useState(false) // Checkbox state
  const [isEnable, setIsEnable] = useState(false)
  const [checked1, setChecked1] = useState(false)
  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked1(event.target.checked)
  }

  const [checked2, setChecked2] = useState(false)
  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked2(event.target.checked)
  }

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnable(event.target.checked)
  }
  const preRequisites = [
    t('ensureStableInternetConnection'),
    t('useAQuietEnvironment'),
    t('keepValidGovtID'),
    t('copyOfYourResume'),
    t('dressAppropriately'),
  ]
  const systemRequirements = [
    {
      field: t('device'),
      value: t('laptopOrDesktop'),
    },
    {
      field: t('browser'),
      value: t('googleChromeOrMicrosoftEdge'),
    },
    {
      field: t('cameraAndMic'),
      value: t('ensureWebCamAndMicAreWorking'),
    },
    {
      field: t('powerBackup'),
      value: t('keepYourDeviceCharged')
    },
    {
      field: t('disableNotifications'),
      value: t('turnOffPopUpsAndNotifications'),
    },
  ]
  const duringTheAssessment = [
    t('stayInFrame'),
    t('answerClearly'),
    t('followInstructions'),
    t('noExternalHelp'),
    t('avoidConnectivityIssue'),
  ]

  const handleClosePopup = () => {
    setShowPopup(false)
    // setShowQuestions(true)
  }

  //////////
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
    const isValidPassword: boolean = loginPasswordRegex.test(password)
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
  //   navigate('/parseez_interviewattend')
  // }

  const googleProvider = new GoogleAuthProvider()

  const login = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const requiredFields = ['email', 'password']
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
        // handleLogin(res.data)
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
      const isValidPassword: boolean = loginPasswordRegex.test(password)
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

  const [email, setEmail] = useState('')
  const [objId, setObjId] = useState('')
  const [jobProfile, setJobProfile] = useState('')
  // console.log(
  //   'userInterviewIduserInterviewIduserInterviewIduserInterviewId',
  //   objId,
  // )
  const ConfirmJoinInterview = async () => {
    try {
      const uniqueid: any = localStorage.getItem('uniqueid')
      const res = await axios.get(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/interview/gettingdetails/${organisation}`,
        {
          params: { userInterviewId: uniqueid },
        },
      )
      setObjId(uniqueid)
      setAuthToken(res.data.authToken)
      setMeetingId(res.data.meetingId)
      setIsattendedinterview(res.data.interviewStatus)
      setJointime(res.data.joinTime)

      setEmail(res.data.email)
      setJobProfile(res.data.interviewProfile)
    } catch (error: any) {
      dispatch(loaderOff())
    }
  }
  const JoinMeeting = async () => {
    try {
      const uniqueid: any = localStorage.getItem('uniqueid')
      const res = await axios.get(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/interview/gettingdetails/${organisation}`,
        {
          params: { userInterviewId: uniqueid },
        },
      )
    } catch (error: any) {
      dispatch(loaderOff())
    }
  }

  // const updateInterviewStatus = async (meetingId: any) => {
  //   const organisation = localStorage.getItem('organisation')
  //   try {
  //     const res = await updateInterview(meetingId, organisation)
  //     if (res) {
  //       setIsattendedinterview(res)
  //     }
  //   } catch (error: any) {
  //     console.log('error', error)
  //   }
  // }
  const handleLogin = async () => {
    try {
      const organisation = localStorage.getItem('organisation')
      const res = await updateInterview(meetingId, organisation)
      const resData = res
      setIsattendedinterview(resData.interviewStatus)
      setJointime(resData.joinTime)
      if (authToken && meetingId && objId) {
        if (isAttendedinterview?.toLowerCase() === 'yes') {
          dispatch(
            openSnackbar(t('youHaveAlreadyAttendedThisInterview'), 'red'),
          )
          return
        }
        navigate('/AI-Interview', {
          state: {
            authToken: authToken,
            meetingId: meetingId,
            objId: objId,
          },
        })
      } else {
        throw new Error('Missing authToken, meetingId, or objId')
      }
    } catch (error) {
      console.error(error)
      dispatch(openSnackbar(t('failedToNavigate'), 'red'))
    }
  }

  useEffect(() => {
    ConfirmJoinInterview()
  }, [])
  const [showModal, setShowModal] = useState(false)

  const handleModal = () => {
    setShowModal(true) // Show the modal
  }
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const handleInterviewTime = async (objectId: any) => {
    try {
      const response = await axios.post(
        `https://parseez.ai/parseez-django-service/interview_time/${objectId}/`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Organization': organisation,
          },
        }
      );

      console.log('Interview time updated:', response.data);
    } catch (error) {
      console.error('Error updating interview time:', error);
    }
  };

  return (
    <div style={{ background: '#FFFFFF', overflowY: 'hidden' }}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{
          minHeight: '100vh',
        }}
      >
        <Grid
          item
          lg={6}
          xs={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: '550px',
            padding: '20px',
            border: '1px solid #000000',
            borderRadius: '8px',
            boxSizing: 'border-box', // Ensures padding and borders are included in the element's total width and height
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography
                variant="body1"
                style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textAlign: 'left',
                }}
              >
                {/* Email */}
                {t('email')}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography
                variant="body1"
                style={{
                  fontSize: '1rem',
                  //   textAlign: 'left',
                  paddingRight: '20px',

                  wordWrap: 'break-word', // Break long words to avoid overflow
                  overflow: 'hidden', // Hide any overflowed text
                  textOverflow: 'ellipsis', // Show ellipsis (...) for overflowed text
                }}
              >
                : &nbsp;{email}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '12px' }}>
            <Grid item xs={6}>
              <Typography
                variant="body1"
                style={{
                  //   fontSize: '1rem',
                  fontWeight: 'bold',
                  textAlign: 'left',
                }}
              >
                {/* Job Profile */}
                {t('jobProfile')}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography
                variant="body1"
                style={{
                  fontSize: '1rem',
                  textAlign: 'left',
                  wordWrap: 'break-word', // Ensure Job Profile does not overflow
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                : &nbsp;{jobProfile}
              </Typography>
            </Grid>
          </Grid>

          <Button
            sx={{
              ...btn,
              background: '#0284C7',
              marginTop: '50px',
              padding: '10px',
              color: '#E8F1FF',
              '&:hover': {
                background: '#0284C7',
              },
            }}
            onClick={handleModal}
          >
            Join Interview
          </Button>
        </Grid>
      </Grid>

      {/* modallllllllll */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#FFFFFF',
            borderRadius: 8,
            padding: isSmallScreen ? 10 : 10,
            width: '90%',
            maxWidth: '1200px',
            height: '90vh',
            overflow: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <img
                src="assets/static/images/aippointlogo.png"
                alt="Logo"
                height="30px"
              />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                border: '1px solid #1312121A',
                borderRadius: '8px',
                padding: 3,
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{ fontSize: '25px', fontWeight: 600, color: '#0284C7' }}
              >
                aippoint.ai
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0A0A0A',
                  py: 2,
                }}
              >
                {t('assessmentGuidelines')}
              </Typography>

              <Grid
                container
                spacing={2}
                direction={isSmallScreen ? 'column' : 'row'}
                justifyContent="space-between"
                alignItems="stretch"
              >
                {/* Left Side */}
                <Grid item xs={12} md={6}>
                  <div
                    style={{
                      border: '1px solid #1312121A',
                      borderRadius: '8px',
                      textAlign: 'left',
                      padding: '10px',
                      height: '100%',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontWeight: 600,
                        fontSize: '16px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        color: '#000000',
                      }}
                    >
                      {t('preRequisites')}
                    </Typography>
                    <ul
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                      }}
                    >
                      {preRequisites.map((item, index) => (
                        <li
                          key={index}
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            letterSpacing: '0%',
                          }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontWeight: 600,
                        fontSize: '16px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        color: '#000000',
                      }}
                    >
                      {t('systemRequirements')}
                    </Typography>
                    <ul
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                      }}
                    >
                      {systemRequirements.map((req, index) => (
                        <li
                          key={index}
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            letterSpacing: '0%',
                          }}
                        >
                          <strong>{req.field}:</strong> {req.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Grid>

                {/* Right Side */}
                <Grid item xs={12} md={6}>
                  <div
                    style={{
                      border: '1px solid #1312121A',
                      borderRadius: '8px',
                      textAlign: 'left',
                      padding: '10px',
                      height: '100%',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontWeight: 600,
                        fontSize: '16px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        color: '#000000',
                      }}
                    >
                      {t('duringTheAssessment')}
                    </Typography>
                    <ul
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                      }}
                    >
                      {duringTheAssessment.map((item, index) => (
                        <li
                          key={index}
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            letterSpacing: '0%',
                          }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Typography sx={{ mt: 1 }} color="error">
                      ⚠️ {t('failureToFollowTheseRules')}
                    </Typography>
                    <div style={{ textAlign: 'left', paddingTop: '10px' }}>
                      <Typography fontWeight="bold">
                        {t('technicalRequirements')}
                      </Typography>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                          <div
                            style={{
                              border: '1px solid #1312121A',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '15px',
                              padding: '5px',
                            }}
                          >
                            <CameraAltIcon />
                            <Typography
                              sx={{
                                fontFamily: 'Inter',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                letterSpacing: '0%',
                                color: '#000000',
                              }}
                            >
                              {t('enableCamera')}
                            </Typography>
                            <Switch
                              checked={checked1}
                              onChange={handleChange1}
                              inputProps={{ 'aria-label': 'Enable Camera' }}
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <div
                            style={{
                              border: '1px solid #1312121A',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '15px',
                              padding: '5px',
                            }}
                          >
                            <MicIcon />
                            <Typography
                              sx={{
                                fontFamily: 'Inter',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                letterSpacing: '0%',
                                color: '#000000',
                              }}
                            >
                              {t('enableAudio')}
                            </Typography>
                            <Switch
                              checked={checked2}
                              onChange={handleChange2}
                              inputProps={{ 'aria-label': 'Enable Audio' }}
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                </Grid>
              </Grid>

              {/* Technical Requirements */}

              {/* Agreement Checkbox */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingTop: '5px',
                }}
              >
                <Checkbox
                  onChange={handleChecked}
                  disabled={!checked1 || !checked2}
                />
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                  }}
                >
                  {t('iAgreeToProceedTheInterview')}
                </Typography>
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                {isEnable && (
                  <Button
                    onClick={() => {
                      handleLogin()
                      handleInterviewTime(objId)
                    }}
                    sx={{
                      padding: '10px 30px',
                      fontSize: '14px',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: '#0284C7',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      '&:hover': {
                        background: '#0284C7',
                      },
                    }}
                  >
                    {t('submitBtn')}
                  </Button>
                )}
                <Typography sx={{ fontSize: '10px', fontWeight: 400, pt: 2 }}>
                  {t('poweredBy')} {' '}
                  <span style={{ color: '#0284C7' }}>aippoint.ai</span>
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      </Modal>
    </div>
  )
}

export default ConfirmJoinInterview
