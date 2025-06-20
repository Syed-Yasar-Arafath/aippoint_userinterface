import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Diamond } from 'lucide-react'

import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DescriptionIcon from '@mui/icons-material/Description'
import WorkIcon from '@mui/icons-material/Work'
import SearchIcon from '@mui/icons-material/Search'
import CollectionsIcon from '@mui/icons-material/Collections'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import CodeIcon from '@mui/icons-material/Code'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import SettingsIcon from '@mui/icons-material/Settings'
import HelpIcon from '@mui/icons-material/Help'
import LogoutIcon from '@mui/icons-material/Logout'
import { useDispatch } from 'react-redux'
// import { loaderOn, logout, updaeToken, loaderOff } from '../../redux/actions'

function SideMenuBars() {
  const [clickedItem, setClickedItem] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const pathLocation = useLocation()

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  const tempMenuItems = [
    {
      text: 'Dashboard',
      link: '/RecruitmentDashboard',
      icon: <DashboardIcon />,
    },
    {
      text: 'CV Manager',
      link: '/cvmanager',
      icon: <DescriptionIcon />,
      subItems: [
        {
          text: 'Upload',
          link: '/uploadfiles',
          icon: <DescriptionIcon />,
        },
        {
          text:'Review',
          link: '/review',
          icon: <DescriptionIcon />,
        },
      ],
    },
    {
      text: 'JD Manager',
      link: '/jdmanager',
      icon: <WorkIcon />,
      subItems: [
        {
          text: 'Create JD',
          link: '/createnewjobpost',
          icon: <WorkIcon />,
        },
        {
          text: 'JD Collection',
          link: '/jobdescriptionai',
          icon: <WorkIcon />,
        },
      ],
    },
    {
      text: 'Search Resumes',
      link: '/jdccollection',
      icon: <SearchIcon />,
    },
    {
      text:'Collections',
      link: '/collectionai',
      icon: <CollectionsIcon />,
    },
    {
      text: 'AI Interview Suite',
      link: '/aiinterviewsuite',
      icon: <QuestionAnswerIcon />,
      subItems: [
        {
          text: 'Schedule Interview',
          link: '/scheduleinterview_ai',
          icon: <QuestionAnswerIcon />,
        },
        {
          text: 'Upcoming',
          link: '/upcoming',
          icon: <QuestionAnswerIcon />,
        },
        {
          text: 'Interview Status',
          link: '/feedbackscore',
          icon: <QuestionAnswerIcon />,
        },
      ],
    },
    {
      text: 'Coding Assessment',
      link: '/codingassessment',
      icon: <CodeIcon />,
    },
    {
      text: 'Analytics',
      link: '/analytics',
      icon: <AnalyticsIcon />,
    },
    {
      text:'Settings',
      link: '/settinggeneral',
      icon: <SettingsIcon />,
    },
    {
      text: 'Support',
      link: '/support',
      icon: <HelpIcon />,
    },
  ]

  const handleClick = (index: any) => {
    setClickedItem(clickedItem === index ? null : index)
  }

  useEffect(() => {
    const currentPath = pathLocation.pathname
    const menuIndex = tempMenuItems.findIndex(
      (item) =>
        item.link === currentPath ||
        (item.subItems &&
          item.subItems.some((subItem) => subItem.link === currentPath)),
    )
    if (menuIndex !== -1) {
      setClickedItem(menuIndex)
    }
  }, [pathLocation.pathname])

 

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isSmallScreen ? '90%' : 400,
    background: '#B3CCFF',
    boxShadow: '0px 4px 6px rgba(0, 0, 255, 0.38)',
    p: 4,
    borderRadius: '8px',
  }

  return (
    <Box
      sx={{
        height: '100vh',
        position: 'fixed',
        background: '#EBF2F6',
        borderRadius: '26px',
        display: 'flex',
        fontFamily: 'SF Pro Display',
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'center',
        width: {
          xs: '200px',
          sm: '220px',
          md: '250px',
        },
        overflowY: 'auto',
        zIndex: 1000,
      }}
    >
      <Box sx={{ width: '100%' }}>
        <List>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 2,
            }}
          >
            <a
              href="https://aippoint.ai/aippoint-userinterface/#/uploadfiles"
              style={{ textDecoration: 'none' }}
            >
              <img
                src="assets/static/images/aippoint logo 1.png"
                alt="Logo"
                style={{
                  paddingTop: '17px',
                  paddingBottom: '35px',
                  paddingRight: '30px',
                  cursor: 'pointer',
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </a>
          </Box>
          {tempMenuItems.map((item, index) => (
            <React.Fragment key={`menu-item-${index}`}>
              <Link
                to={item.link}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItem onClick={() => handleClick(index)} sx={{ py: 0.5 }}>
                  <ListItemButton
                    disableRipple
                    disableTouchRipple
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignContent: 'center',
                      flexDirection: 'row',
                      padding: '10px 20px',
                      backgroundColor:
                        clickedItem === index ||
                        pathLocation.pathname === item.link
                          ? '#0284C7'
                          : 'transparent',
                      width: '90%',
                      height: '35px',
                      borderRadius: '6px',
                      color:
                        clickedItem === index ||
                        pathLocation.pathname === item.link
                          ? '#ffffff'
                          : 'inherit',
                      mx: 'auto',
                      '&:hover': {
                        backgroundColor:
                          clickedItem === index ||
                          pathLocation.pathname === item.link
                            ? '#0284C7'
                            : '#E3F3FF',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: '20px',
                          height: '20px',
                          marginRight: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color:
                            clickedItem === index ||
                            pathLocation.pathname === item.link
                              ? '#ffffff'
                              : '#000000',
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography
                        sx={{
                          color:
                            clickedItem === index ||
                            pathLocation.pathname === item.link
                              ? '#ffffff'
                              : '#000000',
                          fontFamily: 'SF Pro Display',
                          lineHeight: '20.26px',
                          fontSize: {
                            xs: '14px',
                            sm: '15px',
                            md: '16px',
                          },
                          marginLeft: '10px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                    {item.subItems && (
                      <Typography
                        sx={{
                          fontSize: '20px',
                          color:
                            clickedItem === index ||
                            pathLocation.pathname === item.link
                              ? '#ffffff'
                              : '#000000',
                        }}
                      >
                        {clickedItem === index ? '-' : '+'}
                      </Typography>
                    )}
                  </ListItemButton>
                </ListItem>
              </Link>
              {item.subItems && clickedItem === index && (
                <div style={{ position: 'relative' }}>
                  {/* Main vertical line */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '35px',
                      width: '1px',
                      height: `${item.subItems.length * 25}px`,
                      backgroundColor: '#000000',
                    }}
                  />

                  {/* Submenu items */}
                  {item.subItems.map((subItem, subIndex) => (
                    <div
                      key={`submenu-item-${subIndex}`}
                      style={{
                        position: 'relative',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '70px',
                      }}
                    >
                      {/* Horizontal Line */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '35px',
                          width: '20px',
                          height: '1px',
                          backgroundColor: '#000000',
                          transform: 'translateY(-50%)',
                        }}
                      />

                      {/* Diamond Icon */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '55px',
                          top: '50%',
                          // transform: 'translateY(-50%)',
                          width: '6px',
                          height: '6px',
                          backgroundColor:
                            pathLocation.pathname === subItem.link
                              ? '#0284C7'
                              : '#000000',
                          transform: 'translateY(-50%) rotate(45deg)',
                        }}
                      />

                      {/* Label Text */}
                      <div
                        style={{
                          color:
                            pathLocation.pathname === subItem.link
                              ? '#0284C7'
                              : '#000000',
                          fontFamily: 'SF Pro Display',
                          lineHeight: '20.26px',
                          marginLeft: '20px',
                          fontSize: '16px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {subItem.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
          <Button
            style={{
              color: '#000000',
              textAlign: 'center',
              fontWeight: 600,
              lineHeight: '20px',
              fontSize: isSmallScreen ? '12px' : '14px',
              textTransform: 'none',
              marginLeft: '25px',
              marginBottom: '20px',
            }}
            onClick={handleOpen}
          >
            <LogoutIcon style={{ paddingRight: '5px' }} />
            <span>Log Out</span>
          </Button>
        </List>

        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to sign out?
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                mt: 2,
              }}
            >
              <Button
                sx={{
                  background: '#E33629',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  '&:hover': {
                    background: '#E33629',
                  },
                }}
                onClick={() => {
                //   handleLogOut()
                  handleClose()
                }}
              >
                Ok
              </Button>
              <Button
                sx={{
                  background: '#000000',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  '&:hover': {
                    background: '#0284C7',
                  },
                }}
                onClick={handleClose}
              >
              Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  )
}

export default SideMenuBars
