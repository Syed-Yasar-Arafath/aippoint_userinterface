import { Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import MicIcon from '@mui/icons-material/Mic'
import Switch from '@mui/material/Switch'
import Checkbox from '@mui/material/Checkbox'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { openSnackbar } from '../redux/actions'
import { useDispatch } from 'react-redux'
import { updateInterviewCoding } from '../services/InterviewService'
import { t } from 'i18next'
import i18n from '../i18n'
import { useTranslation } from 'react-i18next';
function CodingAccess() {
  const { t } = useTranslation();

  const preRequisites = [
    t('stableInternetConnection'),
    t('useMobileAndLaptop'),
  ]
  const systemRequirements = [
    { field: t('processor'), value: t('intelI3') },
    { field: t('ram'), value: t('eightGb') },
    { field: t('browser'), value: t('latestChromeEdge') },
    { field: t('cameraAndMic'), value: t('enableForProctoring') },
  ]

  const duringTheAssessment = [
    t('recordedAndProctored'),
    t('noTabSwitching'),
    t('doNotRefreshAndClose'),
    t('timeAssessment'),
    t('readCarefullyBeforeAnswering'),
  ]

  const [checked1, setChecked1] = useState(false)
  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked1(event.target.checked)
  }

  const [checked2, setChecked2] = useState(false)
  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked2(event.target.checked)
  }

  const [isEnable, setIsEnable] = useState(false)
  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnable(event.target.checked)
  }
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [meetingId, setMeetingId] = useState('')
  const [isAttendedinterview, setIsattendedinterview]: any = useState(null)
  const [jointime, setJointime]: any = useState(null)
  const [authToken, setAuthToken] = useState('')
  const [email, setEmail] = useState('')
  const [objId, setObjId] = useState('')
  const [jobProfile, setJobProfile] = useState('')
  const organisation = localStorage.getItem('organisation')

  const ConfirmJoinInterview = async () => {
    const organisation = localStorage.getItem('organisation')

    try {
      const uniqueid: any = localStorage.getItem('uniqueid')
      const res = await axios.get(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/interview/gettingdetailscoding/${organisation}`,
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
      // dispatch(loaderOff())
    }
  }
  // const updateInterviewStatus = async (meetingId: any) => {
  //   const organisation = localStorage.getItem('organisation')
  //   try {
  //     const res = await updateInterviewCoding(meetingId, organisation)
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
      const res = await updateInterviewCoding(meetingId, organisation)
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
        navigate('/coding_section', {
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

  console.log('response:', objId, authToken, meetingId, email, jobProfile)

  // const navigate = useNavigate()
  // const handleNavigate = () => {
  //   navigate('/coding_section', { state: { objId } })
  // }

  const selectedLanguage = localStorage.getItem('i18nextLng')

    const convertNumberToArabic = (num: number, selectedLanguage: any) => {
    if (selectedLanguage === 'ar') {
      return num.toLocaleString('ar-EG')
    }
    return num
  }
  return (
    <div style={{ margin: '20px' }}>
      <Grid container>
        <Grid
          item
          lg={12}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <img
            src="assets/static/images/aippoint logo 1.png"
            alt="Logo"
            height="30px"
          />
          {/* <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'SF Pro Display',
                fontSize: '16px',
                fontWeight: 700,
                color: '#000000',
              }}
            >
              Login to your account
            </Typography>
            <Typography
              sx={{
                fontFamily: 'SF Pro Display',
                fontSize: '16px',
                fontWeight: 400,
                color: '#000000',
              }}
            >
              Read the below instructions to get started with your assessment
            </Typography>
          </div>
          <img
            src="assets/static/images/Rectangle 34624195.png"
            alt="profile"
            height="30px"
          /> */}
        </Grid>
        <Grid
          item
          lg={12}
          style={{
            border: '1px solid #1312121A',
            borderRadius: '8px',
            margin: '10px',
            padding: '10px 30px',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '25px',
              fontWeight: 700,
              color: '#0284C7',
            }}
          >
            aippoint.ai
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#0A0A0A',
              padding: '20px 0px 20px 0px',
            }}
          >
            {t('assessmentGuidelines')}
          </Typography>
          <Grid
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              flexDirection: 'row',
            }}
          >
            <div
              style={{
                border: '1px solid #1312121A',
                borderRadius: '8px',
                textAlign: 'left',
                padding: '20px',
                width: '600px',
                height: '200px',
              }}
            >
              <Typography>{t('preRequisites')}</Typography>
              <ul>
                {preRequisites.map((index) => (
                  <li key={index}>{index}</li>
                ))}
              </ul>
              <Typography>{t('systemRequirements')}</Typography>
              <ul>
                {systemRequirements.map((requirement, index) => (
                  <li key={index}>
                    <strong>{requirement.field}:</strong> {requirement.value}
                  </li>
                ))}
              </ul>
            </div>
            <hr
              style={{
                width: '2px',
                background: '#000000',
                alignSelf: 'stretch',
              }}
            />
            <div
              style={{
                border: '1px solid #1312121A',
                borderRadius: '8px',
                textAlign: 'left',
                padding: '20px',
                width: '600px',
                height: '200px',
              }}
            >
              <Typography>{t('duringTheAssessment')}</Typography>
              <ul>
                {duringTheAssessment.map((index) => (
                  <li key={index}>{index}</li>
                ))}
              </ul>
              <Typography>
                ⚠️ {t('failureToFollowTheseRules')}
              </Typography>
            </div>
          </Grid>
          <div
            style={{
              textAlign: 'left',
              paddingTop: '20px',
              margin: '0px 20px',
            }}
          >
            <Typography>{t('technicalRequirements')}</Typography>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingTop: '10px',
              }}
            >
              <div
                style={{
                  border: '1px solid #1312121A',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '30px',
                  padding: '10px',
                }}
              >
                {/* <CameraAltIcon /> */}
                <CameraAltIcon />
                <Typography>{t('enableCamera')}</Typography>
                <Switch
                  checked={checked1}
                  onChange={handleChange1}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </div>
              <div
                style={{
                  border: '1px solid #1312121A',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '30px',
                  padding: '10px',
                }}
              >
                <MicIcon />
                <Typography>{t('enableAudio')}</Typography>
                <Switch
                  checked={checked2}
                  onChange={handleChange2}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingTop: '10px',
              paddingLeft: '10px',
            }}
          >
            <Checkbox
              onChange={handleChecked}
              disabled={!checked1 || !checked2}
            />
            <Typography
              style={{
                paddingTop: '10px',
              }}
            >
              {t('agreeAndProceed')}
            </Typography>
          </div>
          <div>
            {isEnable && (
              <Button
                onClick={handleLogin}
                sx={{
                  padding: '10px 70px',
                  fontSize: '14px',
                  fontWeight: 700,
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
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                color: '#0A0A0A',
                paddingTop: '10px',
              }}
            >
             {t('poweredBy')} <span style={{ color: '#0284C7' }}>aippoint.ai</span>
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default CodingAccess