import { Grid, Typography } from '@mui/material'
import * as React from 'react'
import Lottie from 'lottie-react'
import { t } from 'i18next'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function SubmitInterview() {
  const navigate = useNavigate()
  useEffect(() => {
    const navigationEntries = window.performance.getEntriesByType('navigation')
    const navEntry = navigationEntries[0] as PerformanceNavigationTiming

    const isReload = navEntry?.type === 'reload'

    if (isReload) {
      const authToken = localStorage.getItem('authToken')
      const meetingId = localStorage.getItem('meetingId')
      const objId = localStorage.getItem('objId')

      if (!authToken || !meetingId || !objId) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('meetingId')
        localStorage.removeItem('objId')
        // navigate('/Signin_Ai')
      }
    }
  }, [navigate])

  useEffect(() => {
    // Replace current history state so the back button doesn't go to the previous page
    window.history.pushState(null, '', window.location.href)

    const onPopState = () => {
      // Push forward again to prevent going back
      window.history.pushState(null, '', window.location.href)
    }

    window.addEventListener('popstate', onPopState)

    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])
  return (
    <div>
      <Grid container>
        <Grid
          item
          lg={12}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: '20px',
          }}
        >
          <img
            src="assets/static/images/aippoint logo 1.png"
            alt="Logo"
            height="30px"
          />
          {/* <img
                src="assets/static/images/Rectangle 34624195.png"
                alt="profile"
                height="30px"
              /> */}
        </Grid>
        <Grid
          item
          lg={12}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            marginTop: '200px',
          }}
        >
          <img
            src="assets/static/images/Vector (4).png"
            alt="profile"
            height="100px"
          />
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'SF Pro Display',
              color: '#000000',
            }}
          >
            Thank you for attending the interview{' '}
          </Typography>
        </Grid>
      </Grid>
    </div>
  
  )
}

export default SubmitInterview
