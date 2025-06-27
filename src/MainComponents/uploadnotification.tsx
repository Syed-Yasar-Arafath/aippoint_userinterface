import {
  Box,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
// import {
//   CustomTableCell,
//   CustomTableCellBody,
// } from '../custom-components/CustomTableCell'
// import randomColor from 'randomcolor'
import { Chart as Chart, ChartOptions } from 'chart.js'
// import Header from '../components/topheader'
import React, { useEffect, useState, useRef } from 'react'
import { getAllJob, getCollection } from '../services/AnalyticsService'
// import { CustomSlider } from '../custom-components/CustomSlider'
import TablePagination from '@mui/material/TablePagination'
import { getResumeCount, uploadStatus } from '../services/ResumeService'
import {
  PieChart,
  Pie,
  Legend,
  Sector,
  Label,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Autocomplete from '@mui/material/Autocomplete'
import { Doughnut } from 'react-chartjs-2'
import SearchIcon from '@mui/icons-material/Search'
import { getElementAtEvent } from 'react-chartjs-2'
import Chip from '@mui/material/Chip'
import internalApi from '../utilities/internalApiSt'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import { Button } from '@mui/material'
// import { CustomSecondaryButton } from '../custom-components/CustomButton'
import { Link, LinkProps, useLocation, useNavigate } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import { loaderOff, loaderOn } from '../redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { getUser, getUserDetails } from '../services/UserService'
import Header from '../CommonComponents/topheader'
const useStyles = makeStyles({
  autocomplete: {
    // width: 100, // Set your desired fixed width here
  },
  inputRoot: {
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      // Prevent the first child (the input field) from affecting height
      minHeight: 'auto',
    },
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-tag': {
      // Set the height and margins for the tags
      margin: '2px',
      height: 'auto',
    },
  },
})
interface JobDataItem {
  name: string
  id: number
  value: number
  type: string // Adjust the type based on your actual data structure
  acceptedCount: number
  waitlistedCount: number
  rejectedCount: number
}

interface HeaderProps {
  title: string
  userProfileImage?: string | null
}

function Analytics1() {
  const organisation = localStorage.getItem('organisation')

  const chartRef: any = useRef()
  const [saved, setSaved] = useState(0)
  const [active, setActive] = useState(0)
  const [rows, setRows]: any = useState([])
  const [parseResume, setParseresume] = useState(0)
  const [rejectedCount, setRejectedCount] = useState(0)
  const [acceptedCount, setAcceptedCount] = useState(0)
  const [waitlistedCount, setWaitlistedCount] = useState(0)
  const [collection_name, setCollectionname] = useState<any[]>([])
  const [acceptedCount1, setAcceptedCount1] = useState(0)
  const [waitlistedCount1, setWaitlistedCount1] = useState(0)
  const [rejectedCount1, setRejectedCount1] = useState(0)
  const [fileNames, setFileNames] = useState([])
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<string[]>([])

  const [selectedExperience, setSelectedExperience] = useState<string | null>(
    null,
  )
  const [selectedDesignation, setSelectedDesignation] = useState<string | null>(
    null,
  )
  const [activeJobCount, setActiveJobCount] = useState(0)
  const [draftJobCount, setDraftJobCount] = useState(0)
  const [jobData, setJobData] = useState<JobDataItem[]>([])
  const [jobDataActive, setJobDataActive] = useState<JobDataItem[]>([])
  const [jobAcceptedCounts, setJobAcceptedCounts] = useState<{
    [key: string]: number
  }>({})

  const [totalResumeCounts, setTotalResumeCounts] = useState(0)
  const [jobRejectedCounts, setJobRejectedCounts] = useState({})
  const [jdValue, setJdValue] = useState(1)
  const [uniqueFile, setUniqueFile] = useState(0)
  const [activeJdValue, setActiveJdValue] = useState(1)
  const rowsPerPageOptions = [5, 10, 25]

  // Assuming you have state for current page and rows per page
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0])

  const [inputValue, setInputValue] = useState<any | null>('')

  useEffect(() => {
    if (inputValue === null) {
      setInputValue('')
    }
  }, [inputValue])
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const classes = useStyles()
  const head: React.CSSProperties = {
    fontWeight: 400,
    color: '#FFFFFF',
    fontSize: '23px',
    letterSpacing: '1%',
    fontFamily: 'SF Pro Display',
    lineHeight: '20px',
  }
  const info: React.CSSProperties = {
    fontWeight: 400,
    color: '#FFFFFF',
    fontSize: '17.31px',
    fontFamily: 'SF Pro Display',
    lineHeight: '20.65px',
    letterSpacing: '0.5%',
  }
  const scrollContainerStyle: React.CSSProperties = {
    height: '600px',
    overflowY: 'auto',
    color: '#A7DBD6',
    overflowX: 'hidden',
  }
  const selectionBorderStyle = {
    stroke: 'blue',
  }

  const navigate = useNavigate()
  const fromvalue = 'collection'
  const sample = 'job'

  // const navigateTo = () => {
  //   const path = '/acceptedresume'
  //   navigate(path, { state: { isFromValue: true } })
  // }
  const dispatch = useDispatch()
  const navigateTo = () => {
    const path = '/acceptedresume'
    navigate('/acceptedresume')
  }

  const navigateJobID = (from: any) => {
    const path = '/acceptedresume'
    navigate(`/acceptedresume?jobid=${from}`)
  }
  const navigateJobIDWaitlisted = (from: any) => {
    const path = '/waitlistedresumes'
    navigate(`/waitlistedresumes?jobid=${from}`)
  }
  const navigateJobIDRejected = (from: any) => {
    const path = '/rejectedresumes'
    navigate(`/rejectedresumes?jobid=${from}`)
  }
  const navigateView = ({
    id,
    data,
  }: {
    id: number
    data: any
    origin: any
  }) => {
    navigate('/viewjobrole', {
      state: { jobid: id, jobData: data, origin: origin },
    })
  }
  // const navigateJobID = () => {
  //   const path = `/acceptedresume/${sample}`
  //   navigate(path, { state: { isFromValue: false } })
  // }
  // const backgroundColors = randomColor({
  //   count: 100,
  //   luminosity: 'light',
  // })
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataEntry = jobData.find((entry) => entry.name === label)
      return (
        <div
          style={{
            background: 'white',
            padding: '10px',
            border: '1px solid #ccc',
          }}
        >
          <p>{`Job Title: ${payload[0].payload.name || 0}`}</p>
          <p>{`Accepted: ${payload[0].payload.acceptedCount || 0}`}</p>
        </div>
      )
    }

    return null
  }
  const CustomPaper = (props: any) => (
    <Paper
      {...props}
      style={{
        backgroundColor: '#1C1C1C',
        color: '#FFFFFF',
        borderColor: 'none',
      }}
    />
  )
  const color = ['#89CFF0', '#367588', '#FF7F50']
  const loc: any = [
    'Bengaluru',
    'Hyderabad',
    'Chennai',
    'Mumbai',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
  ]
  const data1 = {
    labels: [
      acceptedCount + ' accepted',
      waitlistedCount + ' waitlisted',
      rejectedCount + ' rejected',
    ],
    datasets: [
      {
        data: [
          { name: 'accepted', value: acceptedCount },
          { name: 'waitlisted', value: waitlistedCount },
          { name: 'rejected', value: rejectedCount },
        ],

        backgroundColor: color,
      },
    ],
  }
  const handleExpChange = (event: React.SyntheticEvent, newValue: any) => {
    setSelectedExperience(newValue)

    // handleSkillChange()
  }
  const handleDesigChange = (event: React.SyntheticEvent, newValue: any) => {
    setSelectedDesignation(newValue)

    // handleSkillChange()
  }

  // const handleSkill = (event: React.SyntheticEvent, newValue: any) => {
  //   setSelectedSkill(newValue[0])

  //   // handleSkillChange()
  // }
  const handleSkill = (_: any, newValue: string | string[]) => {
    // newValue can be either a string or an array of strings
    setSelectedSkill(Array.isArray(newValue) ? newValue : [newValue])
  }

  const handleLocChange = (event: React.SyntheticEvent, newValue: any) => {
    setSelectedLoc(newValue)
    // Log the current value of selectedExp
  }

  const onClick = (event: any) => {
    console.log(getElementAtEvent(chartRef.current, event))
  }
  const options = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  interface Data {
    jobid: string
    job_title: string
    job_role: string
    experience_required: string
    location: any
    type: string
    job_type: string
    skills: string
  }
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const postids: any = queryParams.get('req_no')

  const num: number = parseInt(postids)

  useEffect(() => {
    const handleUpload = async () => {
      const data = {
        req_no: postids,
      }
      try {
        const res = await uploadStatus(data) // Using uploadStatus function instead of axios.post
        if (res) {
          setFileNames(res)
        }
        dispatch(loaderOff())
      } catch (err) {
        console.error('Request error:', err)
        dispatch(loaderOff())
      }
    }
    handleUpload()
  }, [])

  const calculateAcceptedCount = (resumeData: any) => {
    // Your logic to calculate the accepted count based on resumeData
    let acceptedCount = 0
    if (Array.isArray(resumeData)) {
      resumeData.forEach((resumeEntry) => {
        if (resumeEntry.status === 'accepted') {
          acceptedCount++
        }
      })
    }
    return acceptedCount
  }
  const calculateWaitlistedCount = (resumeData: any) => {
    let waitlistedCount = 0
    if (Array.isArray(resumeData)) {
      resumeData.forEach((resumeEntry) => {
        if (resumeEntry.status === 'waitlisted') {
          waitlistedCount++
        }
      })
    }
    return waitlistedCount
  }
  const calculateRejectedCount = (resumeData: any) => {
    let rejectedCount = 0
    if (Array.isArray(resumeData)) {
      resumeData.forEach((resumeEntry) => {
        if (resumeEntry.status === 'rejected') {
          rejectedCount++
        }
      })
    }
    return rejectedCount
  }

  const skills = ['DTMF', 'java', 'web']
  const exp: any = [
    '1-3',
    '2-5',
    '3-6',
    '6-8',
    '8-10',
    '10-12',
    '12-15',
    '15-18',
    '18-20',
  ]

  const isAuthenticated = useSelector((state: any) => state.auth.isLoggedIn)
  const [userProfileImage, setUserProfileImage]: any = React.useState(null)
  const [orgFile, setOrgFile]: any = React.useState(null)
  const token = localStorage.getItem('token')
  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await getUserDetails(organisation)

        if (res.imageUrl) {
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
  return (
    <div style={{ padding: '4px 33px 15px 38px' }}>
      <Header
        title="Status of Upload"
        userProfileImage={userProfileImage}
        path="/uploadfiles"
      />
      {/* <div>
        <Box sx={{ paddingTop: '20px' }}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={12} lg={12}>
              {' '}
              <div>
                <div
                  style={{
                    // width: '81vw',
                    // marginTop: '20px',
                    // marginLeft: '5px',
                    borderRadius: '11px',
                    ...scrollContainerStyle,
                  }}
                >
                  <TableContainer
                    component={Paper}
                    style={{ overflowY: 'auto' }}
                  >
                    <Table
                      aria-label="simple table"
                      style={{
                        background: '#1C1C1C',
                      }}
                    >
                      <TableHead>
                        <TableRow style={{ background: '#FFFFFF' }}>
                          <CustomTableCell
                            style={{
                              fontFamily: 'SF Pro Display',
                              color: 'darkblue',
                            }}
                          >
                            File names
                          </CustomTableCell>
                          <CustomTableCell
                            style={{
                              fontFamily: 'SF Pro Display',
                              color: 'darkblue',
                            }}
                          >
                            Status
                          </CustomTableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {fileNames &&
                          fileNames.length > 0 &&
                          fileNames.map((file: any, index: any) => (
                            <TableRow key={index}>
                              <CustomTableCellBody
                                style={{
                                  fontFamily: 'SF Pro Display',
                                  cursor: 'pointer',
                                  color: '#0284C7',
                                  backgroundColor: '#FFFFFF',
                                }}
                              >
                                {file.original_file_name}
                              </CustomTableCellBody>

                              <CustomTableCellBody
                                style={{
                                  fontFamily: 'SF Pro Display',

                                  backgroundColor: '#FFFFFF',
                                  color:
                                    file.duplicate === 'no' ? 'green' : 'red',
                                }}
                              >
                                {file.duplicate === 'no'
                                  ? 'Successful'
                                  : 'Failed'}
                              </CustomTableCellBody>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={rowsPerPageOptions}
                      component="div"
                      count={jobData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                </div>
              </div>
            </Grid>
          </Grid>
        </Box>
      </div> */}
    </div>
  )
}
export default Analytics1
function randomColor(arg0: { count: number; luminosity: string }) {
  throw new Error('Function not implemented.')
}

