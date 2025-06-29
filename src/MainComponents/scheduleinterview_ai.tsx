/* eslint-disable prefer-const */
import React, { useEffect, useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'

import Confetti from 'react-confetti'
// import LottieView from 'lottie-react-native'
import Lottie from 'lottie-react'

import {
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import { openSnackbar, uploadImage } from '../redux/actions'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { getUserDetails } from '../services/UserService'
import Header from '../CommonComponents/topheader'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next';

function ScheduleInterviewAI() {
  const { t } = useTranslation();
  const organisation = localStorage.getItem('organisation')
  const header = {
    color: '#0284C7',
    fontFamily: 'SF Pro Display',
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '25.32px',
    textAlign: 'left',
  }
  const paragraph1 = {
    color: '#0A0B5C',
    fontFamily: 'SF Pro Display',
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '25px',
    textAlign: 'left',
    padding: '10px 0px 0px 55px',
  }

  const paragraph2 = {
    color: '#0A0B5C',
    fontFamily: 'SF Pro Display',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '25px',
    textAlign: 'left',
    padding: '10px 0px 18px 55px',
  }
  const dropdownStyles = {
    padding: '16px 79px 16x 54px',
    borderRadius: '12px',
    gap: '10px',
    background: '#D3EEEB',
    color: '#000000',
  }
  const boxStyle = {
    width: '190px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: '16px 60px 16px 40px',
    borderRadius: '8px',
    border: '1px solid #000000',
    margin: '6px',
    color: '#0A0B5C',
  }
  const times = [
    '08:30-09:30 AM',
    '09:30-10:30 AM',
    '10:30-11:30 AM',
    '11:30-12:30 PM',
    '12:30-01:30 PM',
    '01:30-02:30 PM',
    '02:30-03:30 PM',
    '03:30-04:30 PM',
    '04:30-05:30 PM',
    '05:30-06:30 PM',
    '06:30-07:30 PM',
    '07:30-08:30 PM',
  ]

  // const times = [
  //   t('eightthirtyToNinethirty'),
  //   t('ninethirtyToTenthirty'),
  //   t('tenthirtyToEleventhirty'),
  //   t('eleventhirtyToTwelfethirty'),
  //   t('twelfethirtyToOnethirty'),
  //   t('onethirtyToTwothirty'),
  //   t('twothirtyToThreethirty'),
  //   t('threethirtyToFourthirty'),
  //   t('fourthirtyToFivethirty'),
  //   t('fivethirtyToSixthirty'),
  //   t('sixthirtyToSeventhirty'),
  //   t('seventhirtyToEightthirty'),
  // ]

  const [userProfileImage, setUserProfileImage]: any = React.useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const [orgFile, setOrgFile]: any = React.useState(null)
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()
  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await getUserDetails(organisation)

        if (res.imageUrl) {
          dispatch(uploadImage('image loaded again'))
          setUserProfileImage(
            `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/user/read/downloadFile/${res.imageUrl}/${organisation}`,
          )
          setOrgFile(
            `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/user/read/downloadFile/${res.imageUrl}/${organisation}`,
          )
        } else {
          setUserProfileImage(null)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    getUserData()
  }, [])

  const highlightedBoxStyle = {
    ...boxStyle,
    backgroundColor: 'lightblue',
    border: '1px solid black',
  }
  // const [timing, setTiming] = useState('')
  const [timing, setTiming] = useState<string>('')
  const [date, setDate] = useState(dayjs())
  const [formattedDate, setFormattedDate] = useState(date.format('DD-MM-YYYY'))
  const [duration, setDuration] = useState('30 Minutes')

  const [selectedTiming, setSelectedTiming] = useState(null)
  const [status, setStatus] = useState(false)
  const today = dayjs()
  const navigate = useNavigate()

  useEffect(() => {
    const uniqueid: any = localStorage.getItem('uniqueid')
    if (!uniqueid) {
      // console.log('executing..!')
      setShowConfetti(true)
    }
  }, [])

  const apiResult = async () => {
    try {
      const uniqueid = localStorage.getItem('uniqueid')

      // Ensure correct date format: 'dd-MM-yy'
      const formattedDate = dayjs(date).format('DD-MM-YY')

      if (timing === '') {
        dispatch(openSnackbar('Please select date and time', 'red'))
        return
      }

      const startTime = timing.split('-')[0]
      const period = timing.split(' ')[1]
      const formattedTime = `${startTime} ${period}` // Format as '05:30 PM'

      const addData = {
        userInterviewId: uniqueid,
        date: formattedDate, // Sending formatted date
        time: formattedTime, // Sending only start time with AM/PM
      }

      console.log('addData', addData)

      const res = await axios.post(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/interview/updatetime/${organisation}`,
        addData,
      )

      if (res.status === 200) {
        setShowConfetti(true)
        localStorage.removeItem('uniqueid')
      }

      if (!uniqueid) {
        setShowConfetti(true)
      }
    } catch (error) {
      console.log('error' + error)
    }
  }

  const handleTimeClick = (time: any) => {
    setTiming(timing === time ? '' : time) // Toggle selection
  }

  const isTimeExpired = (time: string) => {
    // Split the time slot into start and end times
    const [start, end, startPeriod] = time.split(/[- ]/)

    // Parse start time
    let [startHour, startMinute] = start.split(':').map(Number)
    const period = startPeriod || 'AM' // Default to AM if period is not provided

    // Adjust start hour based on AM/PM period
    if (period === 'PM' && startHour !== 12) {
      startHour += 12
    } else if (period === 'AM' && startHour === 12) {
      startHour = 0
    }

    // Convert the start time to the correct date-time object
    const startDateTime = date
      .hour(startHour)
      .minute(startMinute)
      .add(60, 'minute')

    // Parse end time
    let [endHour, endMinute] = end.split(':').map(Number)
    const endPeriod = time.includes('PM') ? 'PM' : 'AM' // Assumes PM if period is not explicitly stated

    // Adjust end hour based on AM/PM period
    if (endPeriod === 'PM' && endHour !== 12) {
      endHour += 12
    } else if (endPeriod === 'AM' && endHour === 12) {
      endHour = 0
    }

    // Convert the end time to the correct date-time object
    const endDateTime = date.hour(endHour).minute(endMinute).add(-60, 'minute')

    // Get the current time
    const today = dayjs() // This ensures 'today' is always the current time

    // Disable the button if the current time is after the end time
    return today.isAfter(endDateTime)
  }

  //****************** */
  const selectedStyle = {
    backgroundColor: '#007bff', // Highlight color
    color: '#fff', // Text color for highlighted state
  }
  const adapter = new AdapterDayjs({ locale: 'ar' })

  return (
    <div
      style={{
        background: '#FFFFFF',
        padding: '4px 14px 8px 28px',
        overflow: 'hidden',
      }}
    >
      {showConfetti ? (
        <>
          {/* <Confetti width={window.innerWidth} height={window.innerHeight} /> */}

          {/* <LottieView
            source={require('assets/static/Checkmark.json')}
            autoPlay
            loop={false}
            style={{ width: 100, height: 100 }}
          /> */}
          <Grid
            container
            sx={{
              height: '100vh', // Make the Grid take up the full viewport height
              display: 'flex',
              flexDirection: 'column', // Stack items vertically
              alignItems: 'center', // Center horizontally
              justifyContent: 'center', // Center vertically
              textAlign: 'center', // Center text within the items
            }}
          >
            {/* <Lottie
              animationData={require('../jsonfiles/Checkmark.json')}
              // animationData="/assets/static/Checkmark.json"
              loop={false}
              style={{ width: '50%', height: '50%', color: 'yellow' }}
            /> */}
            {/* <h1>Your Interview Scheduled Successfully</h1> */}
            <h1>{t('interviewScheduledMessage')}</h1>

            {/* <h6>
              Please check your email and join the interview as per the
              scheduled time.
            </h6> */}
            <h6>{t('pleaseCheckMessage')}</h6>
          </Grid>
        </>
      ) : (
        <div
          style={{
            background: '#FFFFFF',
            padding: '4px 14px 8px 28px',
            overflow: 'hidden',
          }}
        >
          {/* <Header title="Interview" userProfileImage={userProfileImage} /> */}
          <Header
            title={t('interviewHeader')}
            userProfileImage={userProfileImage}
          />
          <Typography sx={paragraph2}>
            {/* Please select a date and time to schedule your interview */}
            {t('pleaseSelectAdate')}
          </Typography>
          <div
            style={{
              boxShadow: '0px 4px 4px 0px #0000001A',
              padding: '4px 14px 6px 18px',
              borderRadius: '10px',
            }}
          >
            <Grid container spacing={3}>
              <Grid item lg={6}>
                {/* <Typography sx={paragraph1}>Select Time and Date</Typography> */}
                <Typography sx={paragraph1}>{t('selectTime')}</Typography>
                {/* <Typography sx={paragraph2}>
                  Select your time slot to confirm your interview
                </Typography> */}
                <Typography sx={paragraph2}>
                  {t('selectyourTimeSlot')}
                </Typography>
                <div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                      sx={{
                        background: '#D3EEEB',
                        borderRadius: '8px',
                        color: '#060F0E',
                        width: '80%',
                        height: '80%',
                      }}
                      value={date}
                      minDate={today}
                      onChange={(newDate: any) => {
                        setDate(newDate)
                        const formatted = newDate.format('DD-MM-YYYY')
                        setFormattedDate(formatted)
                        // console.log(formattedDate)
                      }}
                    />
                    <style>
                      {`
          ::-webkit-scrollbar {
            background-color: #0284C7 !important;
            width: 8px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: #0284C7 !important;
            border-radius: 5px;
          ::-webkit-scrollbar-track {
            background-color: #0284C7 !important;
            border-radius: 5px;
          }
        `}
                    </style>
                  </LocalizationProvider>
                  {/* <Typography sx={paragraph1}>Meeting Duration</Typography>
                            <div style={{ marginTop: '21px' }}>

                                <Select
                                    value={duration}
                                    variant="outlined"
                                    style={dropdownStyles}
                                    onChange={(e) => setDuration(e.target.value)}
                                >
                                    <MenuItem value={'30 Minutes'}>30 Minutes</MenuItem>
                                    <MenuItem value={'40 Minutes'}>40 Minutes</MenuItem>
                                    <MenuItem value={'60 Minutes'}>60 Minutes</MenuItem>
                                </Select>
                            </div> */}
                </div>
                {/* <div
              style={{
                backgroundColor: '#0A0B5C',
                display: 'flex',
                justifyContent: 'column',
              }}
            ></div> */}
              </Grid>
              <hr
                style={{
                  border: '1px solid #000000',
                  marginTop: '50px',
                }}
              />
              <Grid item lg={5} sx={{ alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '50px',
                  }}
                >
                  {/* <Typography sx={paragraph1}>
                    What time works best for you ?
                  </Typography> */}
                  <Typography sx={paragraph1}>{t('whatTimeWorks')}</Typography>
                  {/* <Typography sx={paragraph2}>
                    Showing available time slots for 26 February, 2024
                  </Typography>
                  <Typography sx={paragraph2}>UTC+ 05:30, Bengaluru</Typography> */}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2 ,1fr)',
                    alignItems: 'center',
                    paddingLeft: '45px',
                  }}
                >
                  {times.map((time, index) => (
                    <div
                      key={index}
                      // style={boxStyle}
                      // style={time === timing ? highlightedBoxStyle : boxStyle}
                      style={{
                        ...boxStyle,
                        ...(time === timing ? highlightedBoxStyle : {}),
                        opacity: isTimeExpired(time) ? 0.5 : 1, // Apply opacity if time is expired
                        cursor: isTimeExpired(time) ? 'not-allowed' : 'pointer',
                      }}
                      // style={{
                      //     ...boxStyle,
                      //     ...(selectedTiming === time ? selectedStyle : {}),
                      // }}
                      onClick={() => {
                        if (!isTimeExpired(time)) {
                          handleTimeClick(time)
                        }
                      }}
                      className={isTimeExpired(time) ? 'disabled' : ''}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </Grid>
            </Grid>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              sx={{
                borderRadius: '6px',
                marginTop: '21px',
                textTransform: 'none',
                border: '1px solid #A9DDD8',
                background: '#0284C7',
                color: '#FFFFFF',
                fontFamily: 'SF Pro Display',
                padding: '6px 10px 5px ',
                fontSize: '17px',
                boxShadow: '1px 1px 3px 0px #0004FD1A',
                ':hover': {
                  background: '#0284C7',
                  color: '#000000',
                },
              }}
              onClick={apiResult}
            >
              {/* Generate Interview Link */}
              {t('generateInterviewBtn')}
            </Button>
          </div>
        </div>
      )}

      {/* {
                status ?
                    <Typography style={{ color: 'red' }}>
                        Please select date and timing
                    </Typography> : ''


            } */}
    </div>
  )
}

export default ScheduleInterviewAI
