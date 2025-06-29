import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  Checkbox,
  Pagination,
  Box,
  Typography,
  Stack,
  PaginationItem,
  Rating,
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import axios from 'axios'
import { useLocation, useParams } from 'react-router-dom'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'

import {
  Autocomplete,
  Chip,
  Grid,
  IconButton,
  Modal,
  TextField,
  useTheme,
} from '@mui/material'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'
import SearchIcon from '@mui/icons-material/Search'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import CloseIcon from '@mui/icons-material/Close'
import { useRef } from 'react'
import { Cell, Label, Pie, PieChart } from 'recharts'
import { useDispatch, useSelector } from 'react-redux'
import { loaderOff, loaderOn, openSnackbar } from '../redux/actions'
import { getJobActive, putResume } from '../services/JobService'
import {
  getAllResume,
  getResumeById,
  getResumeScore,
  postResume,
  scoreResume,
} from '../services/ResumeService'
import { makeStyles } from '@mui/styles'
import { postCollection, postCollectionJD } from '../services/AnalyticsService'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { t } from 'i18next'
import i18n from '../i18n'
import { useTranslation } from 'react-i18next';
import Header from '../CommonComponents/topheader'

type Row = {
  resume_data: any
  id: string | number
  name: string
  email: string
  phone: string
  location: string
  job_role: string
  experiance_in_number: number
  score?: number // Optional, since you're providing a fallback ('N/A')
  url: string
}

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
interface Collection {
  collection_name: string
  // Add other properties if needed
}
type Profile = {
  id: number
  resume_data: {
    resume_id: any
    name: string
    work: any
    pdf_data: string
  }
  score: any
}
const ResumeTable = () => {
  const { t } = useTranslation();
  const organisation = localStorage.getItem('organisation')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [userProfileImage, setUserProfileImage]: any = React.useState(null)
  const open = Boolean(anchorEl)
  const [profileLength, setProfileLength] = useState(1)
  const [showContent, setShowContent] = useState(false)
  const [profile, setProfile] = React.useState<Profile[]>([])
  const [selectOption, setSelectOption] = useState('initialValue')
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<string[]>([])
  const [jdValue, setJdValue] = useState(1)
  const [activeJdValue, setActiveJdValue] = useState(1)
  const [selectedExperience, setSelectedExperience] = useState<string | null>(
    null,
  )
  const [selectedDesignation, setSelectedDesignation] = useState<string | null>(
    null,
  )
  const [value, setValue] = React.useState<string[]>([])
  const autocompleteRef = useRef<HTMLInputElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const [selectedExplanation, setSelectedExplanation] = useState<Record<
    any,
    number
  > | null>(null)
  const [ratingValue, setRatingValue] = useState<Record<string, number> | null>(
    null,
  )
  // const [selectedExplanation, setSelectedExplanation] = React.useState(null)
  const handleOpenIcon = (explanation: any) => {
    const cleanExplanation = (data: any) => {
      try {
        if (typeof data === 'string') {
          data = data.replace(/'/g, '"')
          return JSON.parse(data)
        }
        if (typeof data === 'object' && data !== null) return data
        throw new Error('Invalid explanation format')
      } catch (error) {
        console.error('Error cleaning explanation:', error)
        return null
      }
    }

    const extractScores = (scores: any) => {
      const obtainedScores: Record<string, number> = {}
      if (typeof scores !== 'object' || scores === null) return obtainedScores

      Object.keys(scores).forEach((key) => {
        const match = scores[key]?.match(/Scored (\d+) out/)
        if (match) obtainedScores[key] = parseInt(match[1], 10)
      })

      return obtainedScores
    }

    const cleanedExplanation = cleanExplanation(explanation)
    const obtainedScores = cleanedExplanation
      ? extractScores(cleanedExplanation)
      : {}

    setSelectedExplanation(cleanedExplanation)
    setRatingValue(obtainedScores)
    setOpenicon(true)

    console.log('Cleaned explanation:', cleanedExplanation)
    console.log('Extracted scores:', obtainedScores)
  }

  const handleCloseIcon = () => {
    setOpenicon(false)
    setSelectedExplanation(null) // Clear explanation data
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClose1 = () => setOpenModal(false)
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

  const buttonStyle = {
    // padding: '10px 34px 10px 11px',
    gap: '0px',
    borderRadius: '6px 0px 0px 0px',
    border: '1px solid #0284C7',
    opacity: '0px',
    backgroundcolor: '#0284C7',
    color: '#FFFFFF',
  }
  const [inputValue, setInputValue] = useState<any | null>('')
  const [inputExpValue, setInputExpValue] = useState<string>('')
  const [inputLocValue, setInputLocValue] = useState<string>('')
  const [values, setValues]: any = useState([])
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [waitlistedResume, setWaitlistedResume] = useState([])
  const searchRef = useRef<HTMLInputElement>(null)
  const location = useLocation()
  const dispatch = useDispatch()
  const { state } = location
  // const jobid = state?.jobid
  // console.log("jobid",jobid)
  // const intJobId = parseInt(jobid, 10)

  const [waitlistedJdColl, setWaitlistedJdColl] = useState('')
  const [collectionNames, setCollectionNames] = useState<Collection[]>([])
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const handleExpChange = (event: React.SyntheticEvent, newValue: any) => {
    setSelectedExperience(newValue)
    // handleSkillChange()
  }
  const handleDesigChange = (event: React.SyntheticEvent, newValue: any) => {
    setSelectedDesignation(newValue)
    // handleSkillChange()
  }
  const handleSkill = (_: any, newValue: string | string[]) => {
    // newValue can be either a string or an array of strings
    setSelectedSkill(Array.isArray(newValue) ? newValue : [newValue])
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }
  const visibleButtonStyle: React.CSSProperties = {
    zIndex: 1,
    right: '0px',
    left: '10px',
    width: '100px',
    height: '50px',
    bottom: '0px',
    color: '#000000',
    position: 'absolute',
    display: 'inline-block',
  }
  const handleLocChange = (event: React.SyntheticEvent, newValue: any) => {
    setSelectedLoc(newValue)
  }
  // const [page, setPage] = useState(0)
  // const [rowsPerPage, setRowsPerPage] = useState(3)
  const fixedRowsPerPage = 8
  const theme = useTheme()

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setPage((prevPage) => prevPage - 1)
  }

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setPage((prevPage) => prevPage + 1)
  }
  const [checkedItems, setCheckedItems] = useState<number[]>([])

  const handleCheckboxChange = (index: number) => {
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter((item) => item !== index))
    } else {
      setCheckedItems([...checkedItems, index])
    }
  }
  const [openicon, setOpenicon] = React.useState(false)
  // const handleOpenIcon = () => setOpenicon(true)
  // const handleCloseIcon = () => setOpenicon(false)

  const handleDownload = async (proId: any) => {
    const jsonData = {
      resume_id: [proId],
    }
    console.log('jsonData', jsonData)
    try {
      const res = await postResume(jsonData)
      console.log('res', res)
      const base64Data = res[0].file_data

      // Convert base64 string to a Blob
      const pdfBlob = await fetch(
        `data:application/pdf;base64,${base64Data}`,
      ).then((response) => response.blob())

      // Create a download link
      const link = document.createElement('a')
      link.href = URL.createObjectURL(pdfBlob)
      link.download = `resume_${proId}.pdf`

      // Trigger the download
      link.click()
      // Clean up the link
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error('Error downloading the PDF:', error)
    }
  }

  const handleAddToCollectionForSelected = () => {
    checkedItems.forEach((index: any) => {
      const interview = rows[index]
      console.log('interview.resume_id', interview.resume_data.resume_id)
      console.log('interview.id', interview.id)

      console.log('interview', interview)
      saveJdCollectionName('default', interview.resume_data.resume_id)
    })
  }

  const [reset, setReset] = useState(false)
  const handleReset = () => {
    setSelectedRole('')
    // setSelectedName('')
    setSelectedExperience('')
    setSelectedLoc('')
    setValue([])
    setInputValue('')
    setInputLocValue('')
    setReset(true)
    setSelectOption('')
  }

  const numTimes = 6
  const [base64Pdf, setBase64Pdf] = useState('')
  const [openModal, setOpenModal] = React.useState(false)
  const [isHovered, setIsHovered] = useState(Array(numTimes).fill(false))
  const [waitlistedCollOfJobid, setWaitlistedCollOfJobid] = useState('')

  const handleHover = (index: any) => {
    setIsHovered((prevIsHovered) => {
      const updatedIsHovered = [...prevIsHovered]
      updatedIsHovered[index] = !updatedIsHovered[index]
      return updatedIsHovered
    })
  }
  const saveAcceptedJD = async (resume_id: any) => {
    const data = {
      resume_data: [{ id: resume_id, status: 'accepted' }],
      collection_name: 'default',
      user: {
        user_id: userId,
      },
    }
    dispatch(loaderOn())
    try {
      const res = await postCollectionJD(job_id, data, organisation)
      let tempResume: any = [...waitlistedCollOfJobid]
      tempResume = tempResume.filter((resumeId: any) => resumeId !== resume_id)
      setWaitlistedJdColl(tempResume)
      dispatch(loaderOff())
      dispatch(openSnackbar(t('storedInAcceptedJd'), 'green'))
    } catch (error) {
      console.error('Error fetching data:', error)
      dispatch(loaderOff())
    }
  }

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const handleOpen = async (proId: any) => {
    const jsonData = {
      resume_id: [proId],
    }

    try {
      const res = await postResume(jsonData)

      if (res && res.length > 0) {
        const fileData = res[0].file_data

        if (fileData) {
          const byteCharacters = atob(fileData)
          const byteNumbers = new Array(byteCharacters.length)
            .fill(null)
            .map((_, i) => byteCharacters.charCodeAt(i))
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: 'application/pdf' })

          const fileUrl = URL.createObjectURL(blob)
          setPdfUrl(fileUrl) // Set PDF URL to open in modal
        }
      }

      setProfile(res)
      setOpenModal(true)
      setPreview(proId)
      dispatch(loaderOff())
    } catch (error) {
      console.error('Error fetching data:', error)
      dispatch(loaderOff())
    }
  }

  const setPreview = (id: any) => {
    profile.map((item: any) => {
      if (item.id == id) {
        console.log('base64', item.file_data)
        setBase64Pdf(item.file_data)
      }
    })
  }
  const [userId, setUserId] = useState('')
  const [resumeWithVisibleOptions, setResumeWithVisibleOptions] = useState(null)
  const [jdTitle, setJdTitle] = useState('')
  const [visibleCollectionIndex, setVisibleCollectionIndex] = useState(null)

  const toggleOptions = (index: any) => {
    if (resumeWithVisibleOptions === index) {
      setResumeWithVisibleOptions(null)
    } else {
      setResumeWithVisibleOptions(index)
    }
  }

  const toggleCollectionVisibility = (index: any) => {
    if (visibleCollectionIndex === index) {
      setVisibleCollectionIndex(null)
    } else {
      setVisibleCollectionIndex(index)
    }
  }

  const handleJdCreation = async () => {
    const jsonDataa = { jd_id: String(job_id) }

    dispatch(loaderOn())
    try {
      const res = await scoreResume(jsonDataa)

      if (res) {
        const sortedProfiles = res.sort((a: any, b: any) => b.score - a.score)
        setProfile(sortedProfiles)
      }
      dispatch(loaderOff())
    } catch (err) {
      console.error('Request error:', err)
      dispatch(loaderOff())
    }
  }
  const getAllCollection = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/collection/read/${organisation}`,
      )
      const resData = res.data
      setCollectionNames(resData)
      setIsDropdownVisible(true)
      if (res.status === 200) {
        // setCollectionCount(resData)
      }
    } catch (error) {
      console.log('error' + error)
    }
  }
  const saveJdCollectionName = async (
    collectionName: string,
    resumeId: any,
  ) => {
    const resumedata = [{ id: resumeId, status: 'accepted' }]

    const Jobdata = {
      resume_data: resumedata,
    }
    // Dispatch the loader on
    dispatch(loaderOn())
    try {
      // Call putResume with the job ID and Jobdata
      const res = await putResume(job_id, Jobdata, organisation)
      // Optionally update the jdcount state
      // setjdcount(jdcount + 1);

      // Dispatch a success message with openSnackbar
      dispatch(openSnackbar(`${t('storedIn')} ${jdTitle} ${t('jdCollectionHeader')}`, 'green'))
      dispatch(loaderOff())
    } catch (error) {
      // Log the error and dispatch loader off
      console.error('Error fetching data:', error)
      dispatch(loaderOff())
    }
  }

  const saveCollectionAccepted = async (resume_id: any) => {
    const data = {
      resume_data: [{ id: resume_id, status: 'accepted' }],
      collection_name: 'default',
      user: {
        user_id: userId,
      },
    }
    // dispatch(loaderOn())
    try {
      const token = localStorage.getItem('token')

      let tempResume = [...waitlistedResume]
      tempResume = tempResume.filter((resume: any) => resume.id !== resume_id)
      setWaitlistedResume(tempResume)
      dispatch(loaderOff())
      dispatch(openSnackbar(t('storedInAcceptedCollection'), 'green'))
    } catch (error) {
      console.error('Error fetching data:', error)
      dispatch(loaderOff())
    }
  }
  //  const fetchResumes = async () => {
  //     try {
  //       console.log('This is resumeid', resumeId)
  //       const requestData = { resume_id: resumeId }
  //       const resumeResponse = await getResumeById(requestData)
  //       const resumeData = resumeResponse.map((resume: any) => resume.resume_data)
  //       console.log('This is resumeid', resumeData)
  //       setResumes(resumeData)
  //     } catch (error) {
  //       console.error('Error fetching resumes for job:', error)
  //     }
  //   }

  const [loading, setLoading] = useState(true) // Loading state

  const handleSkillChange = async () => {
    setLoading(true) // Start loading before making the API call

    const jsonDataa = { jd_id: parseInt(job_id, 10) }

    try {
      console.log('jsonDataa', jsonDataa)
      const res = await getResumeScore(jsonDataa)
      console.log('res', res[0].id)
      console.log('res', res[0].resume_data.name)
      console.log('res', res[0].resume_data.email)
      console.log('res', res[0].resume_data.phone)
      console.log('res', res[0].resume_data.location)
      console.log('res', res[0].resume_data.job_role)
      console.log('res', res[0].resume_data.experience_in_number)
      console.log('res', res[0].score)
      console.log('res', res[0].resume_data.url)

      setRows(res)
      setLoading(false)
      const resumes = res.map((resume: any) => ({
        id: resume.resume._id,
        name: resume.resume_data.name,
        email: resume.resume_data.email,
        phone: resume.resume_data.phone,
        location: resume.resume_data.location,
        job_role: resume.resume_data.job_role,
        experiance_in_number: resume.resume_data.experiance_in_number,
        score: resume.score || 'N/A', // Fallback to 'N/A' if score is not provided
        url: resume.resume_data.resume.url,
      }))
      // setRows(resumes)
      console.log('ghjghdgajds ====  ')
      console.log(resumes)
      if (res) {
        const validProfiles = res.filter(
          (profile: any) => Number(profile.score) > 0,
        )
        const sortedProfiles = validProfiles.sort(
          (a: any, b: any) => Number(b.score) - Number(a.score),
        )

        setProfile(sortedProfiles)
        setProfileLength(sortedProfiles.length)
      }
      dispatch(loaderOff())
      // Stop loading after API call completes
    } catch (err) {
      console.error('Request error:', err)
    } finally {
      dispatch(loaderOff())
    }
  }
  const checkExperienceRange = (experience: any, range: any) => {
    const [minExp, maxExp] = range.split('-').map(Number)
    return experience >= minExp && experience <= maxExp
  }

  const classes = useStyles()

  useEffect(() => {
    handleSkillChange()
  }, [base64Pdf])

  const [page, setPage] = useState(1)
  const [selectedResume, setSelectedResume] = useState('Previous Resumes')
  const [selectedScore, setSelectedScore] = useState('All Scores')
  const { jobId } = useParams()
  // const location = useLocation()
  const job_id = location.state?.job_id || jobId
  const [rows, setRows] = useState<Row[]>([])
  console.log('Job ID:', job_id)

  const handleChange = (_event: any, value: React.SetStateAction<number>) => {
    setPage(value)
  }

  const selectedLanguage = localStorage.getItem('i18nextLng')

    const convertNumberToArabic = (num: number, selectedLanguage: any) => {
    if (selectedLanguage === 'ar') {
      return num.toLocaleString('ar-EG')
    }
    return num
  }

  return (
    // <div style={{ padding: '4px 33px 15px 38px' }}>
    <div style={{ overflowY: 'hidden', padding: '4px 33px 15px 38px' }}>
      <Header
        title={t('scoredResume')}
        userProfileImage={userProfileImage}
        path="/jdcollection"
      />

      <div
        style={{
          maxHeight: rows.length > 5 ? '400px' : 'auto',
          overflowY: rows.length > 5 ? 'auto' : 'visible',
        }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: '#0284C7', fontWeight: 600 }}>
                  {t('slNoHeading')}
                </TableCell>
                <TableCell style={{ color: '#0284C7', fontWeight: 600 }}>
                  {t('nameHeading')}
                </TableCell>
                <TableCell style={{ color: '#0284C7', fontWeight: 600 }}>
                  {t('mailHeading')}
                </TableCell>
                <TableCell style={{ color: '#0284C7', fontWeight: 600 }}>
                  {t('scoreHeading')}
                </TableCell>
                <TableCell style={{ color: '#0284C7', fontWeight: 600 }}>
                 {t('actionHeading')}
                </TableCell>
                {/* <TableCell style={{ color: '#0284C7', fontWeight: 600 }}>
                <Checkbox style={{ color: '#0284C7', fontWeight: 600 }} />
              </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {t('loading')}
                  </TableCell>
                </TableRow>
              ) : rows.length > 0 ? (
                rows.map((row: any, index: any) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ padding: '24px' }}>
                      <Typography
                        sx={{
                          fontFamily: 'SF Pro Display',
                          fontWeight: 600,
                          fontSize: '14px',
                          lineHeight: '18.23px',
                          letterSpacing: '0%',
                          margin: 0,
                        }}
                      >
                        {/* {index + 1} */}
                        {convertNumberToArabic(index+1,selectedLanguage)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '8px' }}>
                      <Typography
                        sx={{
                          fontFamily: 'SF Pro Display',
                          fontWeight: 600,
                          fontSize: '14px',
                          lineHeight: '18.23px',
                          letterSpacing: '0%',
                          margin: 0,
                        }}
                      >
                        {row.resume_data.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                      <Typography
                        sx={{
                          fontFamily: 'SF Pro Display',
                          fontWeight: 600,
                          fontSize: '14px',
                          lineHeight: '18.23px',
                          letterSpacing: '0%',
                          margin: 0,
                        }}
                      >
                        {row.resume_data.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '8px' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#CFF6D8',
                          color: '#008A2E',
                          padding: '4px 10px', // Reduced padding
                          borderRadius: '25px',
                          fontWeight: 'bold',
                          width: 'fit-content',
                          gap: '4px', // Reduced gap between elements
                        }}
                      >
                        <Typography variant="body1" fontWeight="bold">
                          {/* {parseFloat(row.score).toFixed(2)} */}
                          {convertNumberToArabic(parseFloat(parseFloat(row.score).toFixed(2)), selectedLanguage)}
                        </Typography>
                        <InfoOutlinedIcon
                          sx={{ color: '#7D7D7D', fontSize: '18px' }}
                          onClick={() => handleOpenIcon(row.explanation)} // Pass explanation data
                        />
                      </Box>
                    </TableCell>

                    <TableCell sx={{ padding: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <VisibilityIcon
                          onClick={() => handleOpen(row.resume_data.resume_id)}
                          sx={{ marginRight: '8px' }}
                        />
                        <Checkbox
                          checked={checkedItems.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                          style={{
                            height: '20px',
                            width: '20px',
                            margin: '4px', // Reduced margin for better alignment
                          }}
                        />
                        {/* <FileDownloadOutlinedIcon
                          onClick={() =>
                            handleDownload(row.resume_data.resume_id)
                          }
                        /> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {t('noDataAvailable')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          width: '100%',
          marginTop: '50px',
        }}
      >
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Pagination
            count={1}
            page={page}
            onChange={handleChange}
            variant="outlined"
            shape="rounded"
            siblingCount={0} // Ensures no extra numbers appear
            boundaryCount={0} // Keeps only the page numbers, without first/last buttons
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#007DC3', // Active page blue
                    color: '#fff',
                    borderRadius: '6px',
                    border: 'none',
                  },
                  '&:hover': {
                    backgroundColor: '#005F99',
                    color: '#fff',
                  },
                  '&.MuiPaginationItem-previousNext': {
                    color: '#007DC3', // Blue color for Prev and Next
                    fontWeight: 'bold',
                    textTransform: 'none',
                  },
                }}
                slots={{
                  previous: () => <>{t('previousBtn')}</>,
                  next: () => <>{t('nextBtn')}</>,
                }}
              />
            )}
          />
        </Stack>
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: '10px' }}
          onClick={handleAddToCollectionForSelected}
        >
          {t('addToCollectionBtn')}
        </Button>
      </div>
      {/* <Modal
        open={openModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            position: 'fixed',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {' '}
          </Typography>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {' '}
          </Typography>
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
          >
            <iframe
              title="PDF Preview"
              src={'data:application/pdf;base64,' + base64Pdf}
              style={{
                width: '100vw',
                height: '100vh',
                border: 'none',
                padding: '10px 0px 0px 100px',
              }}
            ></iframe>
            <CloseIcon
              onClick={handleClose1}
              style={{
                top: '25px',
                right: '0px',
                width: '25px',
                height: '25px',
                color: '#000000',
                position: 'absolute',
                background: '#FFFFFF',
                padding: '1px 1px 1px 1px',
              }}
            />
          </div>
        </Box>
      </Modal> */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '90%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
          }}
        >
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Resume Viewer"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          ) : (
            <Typography>{t('loadingPdf')}</Typography>
          )}
        </Box>
      </Modal>

      <div>
        <Modal
          open={openicon}
          onClose={handleCloseIcon}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '400px',
              margin: '50px auto',
              outline: 'none',
            }}
          >
            {ratingValue &&
              Object.entries(ratingValue).map(([skill, rating]) => (
                <div
                  key={skill}
                  style={{
                    marginBottom: '10px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    style={{
                      color: '#000000',
                      fontSize: '14px',
                      fontWeight: 600,
                      fontFamily: 'Overpass',
                    }}
                  >
                    {skill}
                  </Typography>
                  <Rating name={skill} value={Number(rating)} readOnly />
                </div>
              ))}
          </div>
        </Modal>
      </div>
      {/* hiiiiii */}
    </div>
  )
}

export default ResumeTable
