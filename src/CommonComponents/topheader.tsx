import React, { useEffect, useRef, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import NotificationsIcon from '@mui/icons-material/Notifications'
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Popover,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import { getUser, getUserDetails } from '../services/UserService'
import { RootState } from '../redux/store'

// import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { loaderOff, loaderOn } from '../redux/actions'
import axios from 'axios'
import { t } from 'i18next'

interface HeaderProps {
  title: string
  userProfileImage?: string | null
  path?: any
}

const Header: React.FC<HeaderProps> = ({ title, userProfileImage, path }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { uploads, failedUploads } = useSelector((state: RootState) => state.uploadStatus)
  
  const handleNavigate = (path: string | null) => {
    if (path) {
      navigate(path)
    }
  }
  let name = ''
  const [email, setEmail] = useState('')
  const [first_name, setFirst_Name] = useState('')
  const [anchorE, setAnchorE] = React.useState<null | HTMLElement>(null)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [notifications, setNotifications]: any = useState([])
  const anchorRef = useRef(null) // Create a ref
  const open = Boolean(anchorE)
  
  // Monitor upload status for notifications
  useEffect(() => {
    const recentUploads = uploads.filter(upload => {
      const uploadTime = new Date(upload.uploadDate).getTime()
      const now = new Date().getTime()
      return (now - uploadTime) < 30000 // Last 30 seconds
    });

    const uploadNotifications = recentUploads.map(upload => ({
      id: upload.id,
      text: upload.status === 'success' 
        ? `${upload.name} uploaded successfully`
        : upload.status === 'error'
        ? `Failed to upload ${upload.name}`
        : `Uploading ${upload.name}...`
    }));

    setNotifications((prev: any) => {
      const existingIds = prev.map((n: any) => n.id);
      const newNotifications = uploadNotifications.filter((n: any) => !existingIds.includes(n.id));
      return [...newNotifications, ...prev].slice(0, 10); // Keep last 10 notifications
    });
  }, [uploads]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorE(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorE(null)
  }
  if (first_name && first_name.length > 0) {
    let temp = ''
    name = first_name.substring(0, 1)
    for (let i = first_name.length - 1; i >= 0; i--) {
      if (first_name.charAt(i) === ' ') break
      temp = first_name.charAt(i)
    }
    name = name + temp
  }
  const handleNotificationClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleNotificationClose = () => {
    setAnchorEl(null)
  }
  const [orgFile, setOrgFile]: any = React.useState(null)
  const token = localStorage.getItem('token')
  const organisation = localStorage.getItem('organisation')
  const getUserIdData = async () => {
    // dispatch(loaderOn())
    try {
      const res = await getUserDetails(organisation)
      console.log('im', res)
      connectNotification(res.user_id, organisation)
      dispatch(loaderOff())
    } catch (error) {
      console.error('Error fetching data:', error)
      dispatch(loaderOff())
    }
  }
  useEffect(() => {
    getUserIdData()
  }, [])

  const openPop = Boolean(anchorEl)
  const id = openPop ? 'simple-popover' : undefined
  const navigateID = (from: any) => {
    dispatch(loaderOn())
    handleNotificationClose()
    console.log('noyify', notifications)
    console.log('num', from)
    const tempData = notifications.slice()
    const filteredData = tempData.filter((data: any) => {
      return data.id != from
    })
    console.log('ok', filteredData)
    setNotifications(filteredData)
    navigate(`/uploadnotification/?req_no=${from}`)
    dispatch(loaderOff())
  }

  const connectNotification = (userId: any, dbName: any) => {
    // const ws = new WebSocket(
    //   `wss://aippoint.ai/aippoint-djang o-service/ws/notifications/${userId}/`,
    // )
    // const ws = new WebSocket(
    //   `wss://parseez.com/parseez-django-service/ws/notifications/${userId}/`,
    // )
    // const ws = new WebSocket(
    //   `wss://parseez.com/parseez-django-service/ws/notifications/${userId}/`,
    // )

    // const ws = new WebSocket(`ws://http://localhost:8000/ws/notifications/${userId}/`)
    if (!dbName) return
    // const ws = new WebSocket(
    //   `ws://http://localhost:8000/ws/notifications/${userId}/`,
    // )
    const ws = new WebSocket(
      `wss://parseez.ai/parseez-django-service/ws/notifications/${userId}/`,
    )
    ws.onopen = () => {
      console.log('WebSocket Connected')
    }
    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data)

      // Extract notification data
      const notificationData = {
        id: notification.req_no,
        text: notification.message,
      }

      // Log notification data
      console.log('notificationData')
      console.log(notificationData)

      // Update the notifications state with the new notification
      setNotifications((currentNotifications: any) => {
        return [...currentNotifications, notificationData]
      })

      // Set anchor element for the UI update (e.g., show notification dropdown)
      setAnchorEl(anchorRef.current)
    }

    // Handle WebSocket errors
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    // Handle WebSocket close event
    ws.onclose = () => {
      console.log('WebSocket Disconnected')
    }

    // Cleanup function to close WebSocket on component unmount
    return () => {
      ws.close()
    }
    setAnchorEl(anchorRef.current)
  }
  return (
    <div
      style={{
        boxShadow: '15px 0px 32px 0px #EAF1F5',
        display: 'flex',
        padding: '7px 28px 7px 20px',
        justifyContent: 'space-between',
        // borderRadius: '25px',
        // background: '#EAF1F5',
      }}
    >
      {/* <Typography
        style={{
          color: '#0284C7',
          fontFamily: 'SF Pro Display',
          fontSize: '20px',
          fontWeight: 600,
          lineHeight: '25.32px',
          textAlign: 'left',
        }}
      >
        {title}
      </Typography> */}
      <Typography
        style={{
          color: '#0284C7',

          // lineHeight: '95px',
          textAlign: 'left',

          fontFamily: 'SF Pro Display',
          fontWeight: 600,
          fontSize: '20px',
          lineHeight: '26.04px',
          letterSpacing: '0%',
        }}
      >
        <KeyboardBackspaceIcon
          style={{ color: '#0A0B5C', marginRight: '15px' }}
          onClick={() => handleNavigate(path)}
        />
        {title}
      </Typography>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {/* <DarkModeIcon style={{ marginRight: '25px' }} /> */}
        <Grid item>
          <Button
            onClick={handleNotificationClick}
            ref={anchorRef}
            sx={{
              fontFamily: 'Poppins',
              fontWeight: '700',
              fontSize: '16px',
              lineHeight: '24px',
              color: 'green',
              textTransform: 'none',
              // marginLeft: "20px",
              // marginRight: "20px",
            }}
          >
            <NotificationsIcon sx={{ color: '#0284C7' }} />
          </Button>
        </Grid>
        <Popover
          id={id}
          open={openPop}
          anchorEl={anchorEl}
          onClose={handleNotificationClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          >
            {notifications.length < 1 && (
              <ListItem>
                {/* <ListItemText primary={'No Notifications'} /> */}
                {/* <ListItemText primary={t('notificationMsg')} /> */}
              </ListItem>
            )}
            {notifications.map((notification: any) => (
              <ListItem button key={notification.id}>
                <ListItemText
                  primary={notification.text}
                  secondary={
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="body2">
                        Check upload status.
                      </Typography>
                      <Button
                        onClick={() => navigateID(notification.id)}
                        sx={{
                          backgroundColor: '#A7DBD6',
                          color: '#000000',
                          textTransform: 'none',
                          marginLeft: '10px',
                          marginRight: '10px',
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Popover>
        {/* <img
          src={
            userProfileImage === null
              ? 'assets/static/images/default_profile_picture.png'
              : userProfileImage
          }
          alt="Profile Picture"
          style={{
            height: '45px',
            width: '45px',
            borderRadius: '50px',
            marginLeft: '25px',
          }}
        /> */}
      </div>
    </div>
  )
}

export default Header
