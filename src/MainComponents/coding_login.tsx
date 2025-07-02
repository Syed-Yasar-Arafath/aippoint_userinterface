import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import { useNavigate } from 'react-router-dom'
import {
  emailRegex,
  loginPasswordRegex,
} from '../custom-components/CustomRegex'
import { useDispatch } from 'react-redux'
import { loaderOff, openSnackbar } from '../redux/actions'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useLogInForm } from '../custom-components/custom_forms/LoginForm'
import { codinglogin, logIn } from '../services/InterviewService'
import Header from '../CommonComponents/topheader'
import axios from 'axios'
import { t } from 'i18next'
import i18n from '../i18n'
import { useTranslation } from 'react-i18next';


function CodingLogin() {
  const { t } = useTranslation();

  const labels: React.CSSProperties = {
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    textAlign: 'start',
    color: '#0A0A0A',
  }

  const textarea: React.CSSProperties = {
    border: '1.5px solid #0A0B5C',
    borderRadius: '6px',
    marginTop: '10px',
    width: '250px',
  }

  const { formValues, setFormValues } = useLogInForm()
  const [userProfileImage, setUserProfileImage]: any = React.useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
        return false
      }
    })
    return invalidSubmit
  }

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

  const handleLogin = async (e: React.MouseEvent) => {
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
        // ✅ Use await to resolve the promise
        const res: any = await codinglogin(formData, organisation)
        dispatch(loaderOff())

        console.log(res.data) // ✅ res.data contains the actual response

        if (res.data.userInterviewId !== null) {
          localStorage.setItem('uniqueid', res.data.userInterviewId)
          navigate('/coding_access')
          localStorage.setItem('userType', 'candidatecoding');
        }
        // else if (
        //   res.data.userInterviewId !== null &&
        //   res.data.scheduled === false
        // )
        // {
        //   localStorage.setItem('uniqueid', res.data.userInterviewId)
        //   navigate('/scheduleinterview_coding') // ✅ Navigation will work correctly now
        // }
        else if (
          res.data.userInterviewId === null &&
          res.data.scheduled === false &&
          res.data.message === 'No candidate found'
        ) {
          dispatch(openSnackbar('Invalid Candidate..!', 'red'))
        } else if (res.data.message === 'Network Error') {
          dispatch(openSnackbar('Please try again later', 'red'))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
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

  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  return (
    <div style={{ padding: '4px 33px 15px 38px' }}>
      <Header
        title={t('loginToYourAccountHeader')}
        // title={t('collectionHeader')}
        userProfileImage={userProfileImage}
      // path="/assessmentselection"
      />
      <Typography
        style={{
          color: '#0A0B5C',
          fontFamily: 'SF Pro Display',
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '25.32px',
          textAlign: 'left',
          paddingLeft: '55px',
        }}
      >
        {t('toAccessCodingAssessment')}
      </Typography>
      <Grid container>
        <Grid item lg={5.9}>
          {/* <img
            src="assets/static/images/logimg.png"
            style={{
              width: '70%',
              height: '480px',
              minHeight: '60vh',
              borderRadius: '20px',
              marginLeft: '80px',
              marginTop: '20px',
              // borderLeft: '70px',
            }}
          /> */}
        </Grid>
        <Grid
          item
          lg={5.9}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            margin: '20px 0px',
          }}
        >
          <Grid
            sx={{
              background: '#FFFFFF',
              padding: '50px',
              borderRadius: '8px',
              boxShadow: '0px 3px 10px #1312121A',
              height: 'auto',
            }}
          >
            <div>
              <Typography style={labels}>{t('mailId')}</Typography>
              <TextField
                sx={textarea}
                placeholder={t('mailIdPlaceholder')}
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
                InputProps={{
                  startAdornment: (
                    <IconButton>
                      <EmailIcon style={{ color: '#000000' }} />
                    </IconButton>
                  ),
                }}
                inputProps={{
                  style: { textAlign: i18n.language === 'ar' ? 'right' : 'left' },
                }}
              />
              {formValues.email.error && (
                <Typography variant="body2" color="error">
                  {formValues.email.errorMessage}
                </Typography>
              )}
            </div>
            <div>
              <Typography
                style={{
                  ...labels,
                  marginTop: '12px',
                }}
              >
                {t('passwordHeader')}
              </Typography>
              <TextField
                sx={textarea}
                placeholder={t('passwordPalceHolder')}
                variant="outlined"
                name="password"
                autoComplete="off"
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => {
                  setPassword(e.target.value), handleChange(e)
                }}
                error={formValues.password.error}
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
                inputProps={{
                  style: { textAlign: i18n.language === 'ar' ? 'right' : 'left' },
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
            <Button
              sx={{
                borderRadius: '6px',
                gap: '10px',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '20PX',
                width: '250px',
                border: '1.5px solid #0284C7',
                textTransform: 'none',
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
              {t('logIn')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default CodingLogin
