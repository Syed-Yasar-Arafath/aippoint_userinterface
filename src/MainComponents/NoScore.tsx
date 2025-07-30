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
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import axios from 'axios'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
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
  getResumeScore,
  postResume,
  scoreResume,
} from '../services/ResumeService'
import { makeStyles } from '@mui/styles'
import { postCollection, postCollectionJD } from '../services/AnalyticsService'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import i18n from '../i18n'
import Header from '../CommonComponents/topheader'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next';


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
    name: string
    work: any
    pdf_data: string
  }
  score: any
}
type Row = {
  resume_data: any
  id: string | number
  name: string
  email: string
  phone: string
  file_data: any
  file_name: any
  // id: string | number
  // name: string
  // email: string
}

const NoScore = () => {
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
  const jobid = state?.jobid
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
  // const saveAcceptedJD = async (resume_id: any) => {
  //   const data = {
  //     resume_data: [{ id: resume_id, status: 'accepted' }],
  //     collection_name: 'default',
  //     user: {
  //       user_id: userId,
  //     },
  //   }
  //   dispatch(loaderOn())
  //   try {
  //     const res = await postCollectionJD(jobid, data, organisation)
  //     let tempResume: any = [...waitlistedCollOfJobid]
  //     tempResume = tempResume.filter((resumeId: any) => resumeId !== resume_id)
  //     setWaitlistedJdColl(tempResume)
  //     dispatch(loaderOff())
  //     dispatch(openSnackbar(t('storedInAcceptedJd'), 'green'))
  //   } catch (error) {
  //     console.error('Error fetching data:', error)
  //     dispatch(loaderOff())
  //   }
  // }
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const handleOpen = (proId: any) => {
    console.log('Opening resume with ID:', proId)
    // Find the resume in rows by ID
    const resume = rows.find((row) => row.id === proId)

    if (!resume) {
      dispatch(openSnackbar(t('resumeNotFound'), 'red'))
      return
    }

    if (!resume.file_data) {
      dispatch(openSnackbar(t('noResumeFileData'), 'red'))
      return
    }

    try {
      dispatch(loaderOn())
      // Convert base64 file_data to Blob
      const byteCharacters = atob(resume.file_data)
      const byteNumbers = new Array(byteCharacters.length)
        .fill(null)
        .map((_, i) => byteCharacters.charCodeAt(i))
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })
      const fileUrl = URL.createObjectURL(blob)
      setPdfUrl(fileUrl)
      setOpenModal(true)
      dispatch(loaderOff())
    } catch (error) {
      console.error('Error displaying resume:', error)
      dispatch(openSnackbar(t('failedToDisplay'), 'red'))
      dispatch(loaderOff())
    }
  }
  // const handleOpen = async (proId: any) => {
  //   const jsonData = {
  //     resume_id: [proId],
  //   }

  //   try {
  //     const res = await postResume(jsonData)

  //     if (res && res.length > 0) {
  //       const fileData = res[0].file_data

  //       if (fileData) {
  //         const byteCharacters = atob(fileData)
  //         const byteNumbers = new Array(byteCharacters.length)
  //           .fill(null)
  //           .map((_, i) => byteCharacters.charCodeAt(i))
  //         const byteArray = new Uint8Array(byteNumbers)
  //         const blob = new Blob([byteArray], { type: 'application/pdf' })

  //         const fileUrl = URL.createObjectURL(blob)
  //         setPdfUrl(fileUrl) // Set PDF URL to open in modal
  //       }
  //     }

  //     setProfile(res)
  //     setOpenModal(true)
  //     setPreview(proId)
  //     dispatch(loaderOff())
  //   } catch (error) {
  //     console.error('Error fetching data:', error)
  //     dispatch(loaderOff())
  //   }
  // }
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
  // const handleDownload = async (proId: any) => {
  //   const jsonData = {
  //     resume_id: [proId],
  //   }
  //   console.log('jsonData', jsonData)
  //   try {
  //     const res = await postResume(jsonData)
  //     console.log('res', res)
  //     const base64Data = res[0].file_data

  //     // Convert base64 string to a Blob
  //     const pdfBlob = await fetch(
  //       `data:application/pdf;base64,${base64Data}`,
  //     ).then((response) => response.blob())

  //     // Create a download link
  //     const link = document.createElement('a')
  //     link.href = URL.createObjectURL(pdfBlob)
  //     link.download = `resume_${proId}.pdf`

  //     // Trigger the download
  //     link.click()
  //     // Clean up the link
  //     URL.revokeObjectURL(link.href)
  //   } catch (error) {
  //     console.error('Error downloading the PDF:', error)
  //   }
  // }
  //added by pragatika
  const handleDownload = (proId: any) => {
    console.log('Downloading resume with ID:', proId)
    const resume = rows.find((row) => row.id === proId)

    if (!resume) {
      dispatch(openSnackbar(t('resumeNotFound'), 'red'))
      return
    }

    if (!resume.file_data) {
      dispatch(openSnackbar(t('noResumeFileData'), 'red'))
      return
    }

    try {
      const byteCharacters = atob(resume.file_data)
      const byteNumbers = new Array(byteCharacters.length)
        .fill(null)
        .map((_, i) => byteCharacters.charCodeAt(i))
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = resume.file_name || `resume_${proId}.pdf`
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error('Error downloading resume:', error)
      dispatch(openSnackbar(t('failedToDownload'), 'red'))
    }
  }

  const navigate = useNavigate()
  const fetchscore = async () => {
    if (!job_id) return
    dispatch(loaderOn())
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/resume_scoring/`,
        { job_id },
        {
          headers: {
            Organization: organisation,
            'Content-Type': 'application/json',
          },
        },
      )
      console.log(response)
      if (response) {
        dispatch(openSnackbar(t('scoringCompleted'), 'green'))
      } else {
        dispatch(openSnackbar(t('scoringFailed'), 'red'))
      }
      handleSkillChange() // Assuming handleSkillChange is defined and does something
      dispatch(loaderOff())
      navigate('/jdcollection')
      // counts[job.jobid] = response.data.matching_resume_count || 0
    } catch (err) {
      console.error(`Error fetching resumes for job ${job_id}:`, err)
      dispatch(loaderOff())
    }
  }

  const handleClickScore = () => {
    fetchscore()
    // Additional logic you want to execute on score button click
  }

  const handleJdCreation = async () => {
    const jsonDataa = { jd_id: String(jobid) }

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
      const res = await putResume(jobid, Jobdata, organisation)
      // Optionally update the jdcount state
      // setjdcount(jdcount + 1);

      // Dispatch a success message with openSnackbar
      dispatch(
        openSnackbar(
          `${t('storedIn')} ${jdTitle} ${t('jdCollectionBtn')}`,
          'green',
        ),
      )
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
  const handleSkillChange = async () => {
    // try {
    // const response = await getJobActive()
    const jdid = jobid

    console.log('jdid', jdid)
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
    } catch (err) {
      console.error('Request error:', err)
    } finally {
      dispatch(loaderOff())
    }
    // setProfileLength(resumeResponse.length)

    //   dispatch(loaderOff())
    // }
    // catch (error) {
    //   console.error('Request error:', error)
    //   dispatch(loaderOff())
    // }
    // }
    // }
    //  catch (error) {
    //   console.error('Error fetching active jobs:', error)
    // }
  }
  const checkExperienceRange = (experience: any, range: any) => {
    const [minExp, maxExp] = range.split('-').map(Number)
    return experience >= minExp && experience <= maxExp
  }
  // useEffect(() => {
  //   handleSkillChange()
  //   // handleJdCreation()
  // }, [])

  const classes = useStyles()
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await getJobActive(organisation)
        const jdid = jobid
        if (jdid != null) {
          const selectedValue = jdid
          const job = response.find((item: any) => item.jobid == selectedValue)
          dispatch(loaderOn())
          try {
            setJdTitle(job.job_title.trim())
            const searchText = job?.job_title.trim()
            const selectedExpValue = job?.experience_required
            const selectedSkillValue = job?.skills.trim()
              ? [job?.skills.trim()]
              : []
            const selectedLocValue = job?.location.trim()
            const jsonData: {
              skills?: string[]
              exp?: any
              designation?: string
              location?: string
            } = {}

            if (searchText) {
              jsonData.designation = searchText
            }
            if (selectedSkillValue.length > 0) {
              jsonData.skills = selectedSkillValue
            }
            if (selectedExpValue) {
              jsonData.exp = selectedExpValue
            }
            if (selectedLocValue) {
              jsonData.location = selectedLocValue
            }

            const resumeResponse = await getAllResume(jsonData,organisation)
            const jsonDataa = { jd_id: parseInt(jobid, 10) }

            // dispatch(loaderOn())
            try {
              const res = await getResumeScore(jsonDataa)
              console.log(res)

              if (res) {
                const sortedProfiles = res.sort(
                  (a: any, b: any) => b.score - a.score,
                )
                setProfile(sortedProfiles)
              }
              dispatch(loaderOff())
            } catch (err) {
              console.error('Request error:', err)
              dispatch(loaderOff())
            }
            // setProfile(resumeResponse)
            // setProfileLength(resumeResponse.length)

            // dispatch(loaderOff())
          } catch (error) {
            console.error('Request error:', error)
            dispatch(loaderOff())
          }
        }
      } catch (error) {
        console.error('Error fetching active jobs:', error)
      }
    }

    fetchJobData()
  }, [jobid])
  const [loading, setLoading] = useState(false) // Loading state

  const [selectAll, setSelectAll] = useState(false)
  const [checkedItems, setCheckedItems] = useState<number[]>([])
  // Select all function
  const handleSelectAll = () => {
    if (!selectAll) {
      const allItems = profile.map((_, index) => index)
      setCheckedItems(allItems)
    } else {
      // Deselect all items
      setCheckedItems([])
    }
    setSelectAll(!selectAll)
  }

  // Checkbox change handler for individual items
  const handleCheckboxChange = (index: number) => {
    if (checkedItems.includes(index)) {
      setCheckedItems(checkedItems.filter((item) => item !== index))
    } else {
      setCheckedItems([...checkedItems, index])
    }
  }

  // Add selected items to collection
  const handleAddToCollectionForSelected = () => {
    checkedItems.forEach((index) => {
      const interview = profile[index]
      saveJdCollectionName('default', interview.id)
    })
  }

  useEffect(() => {
    handleSkillChange()
  }, [base64Pdf])

  const [page, setPage] = useState(1)

  const { jobId } = useParams()
  // const location = useLocation()
  const job_id = location.state?.job_id || jobId
  const [rows, setRows] = useState<Row[]>([])
  console.log('Job ID:', job_id)
  const intJobId = parseInt(job_id, 10)
  useEffect(() => {
    if (job_id) {
      // Fetch data dynamically based on job_id
      const fetchData = async () => {
        dispatch(loaderOn())
        setLoading(true) // Start loading before making the API call

        try {
          const response = await axios.post(
            `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/matching-resumes/`,
            { job_id },
            {
              headers: {
                Organization: organisation,
                'Content-Type': 'application/json',
              },
            },
          )
          // Extract id, name, and email from response
          // const resumes = response.data.matching_resumes.map((resume: any) => ({
          //   id: resume.resume_data._id, // not _id
          //   name: resume.resume_data.name,
          //   email: resume.resume_data.email,
          // }))
          // const resumes = response.data.matching_resumes.map((resume: any) => ({
          //   id: resume.resume_data._id,
          //   name: resume.resume_data.name,
          //   email: resume.resume_data.email,
          //   file_data: resume.file_data || null, // Base64-encoded PDF
          //   file_name: resume.resume_name || null, // File name
          // }))

          // const resumes = response.data.matching_resumes.map((resume: any) => {
          //   console.log(resume) // Log to verify structure
          //   return {
          //     id: resume.resume_data._id,
          //     name: resume.resume_data.name,
          //     email: resume.resume_data.email,
          //     file_data: resume.file_data || null,
          //     file_name: resume.resume_name || null,
          //   }
          // })
          // console.log('Mapped resumes:', resumes) // Log the final array
          // setRows(resumes)
          const resumes = response.data.matching_resumes
            .map((resume: any, index: number) => {
              console.log(`Resume at index ${index}:`, resume) // Log to identify problematic resume

              // Check if resume and resume_data exist
              if (!resume || !resume.resume_data) {
                console.warn(
                  `Skipping resume at index ${index}: resume_data is missing`,
                )
                return null // Skip invalid resumes
              }

              return {
                id: resume.resume_data._id || null, // Fallback to null if _id is missing
                name: resume.resume_data.name || null,
                email: resume.resume_data.email || null,
                file_data: resume.file_data || null,
                file_name: resume.resume_name || null,
              }
            })
            .filter((resume: any) => resume !== null) // Remove skipped (null) resumes

          console.log('Mapped resumes:', resumes) // Log the final array
          setRows(resumes)
          dispatch(loaderOff())
          setLoading(false)
          // Stop loading after API call completes
          // Update rows with parsed data
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          dispatch(loaderOff())
          setLoading(false)
          console.log('Loading stopped') // Debug log
        }
      }

      fetchData()
    }
  }, [job_id])
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
    <div style={{ padding: '4px 33px 15px 38px' }}>
      <Header
        title={t('matchedResumesHeader')}
        userProfileImage={userProfileImage}
        path="/jdcollection"
      />

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
                {t('actionHeading')}
              </TableCell>
            </TableRow>
          </TableHead>
          {/* <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((row: any, index: any) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Typography
                      sx={{
                        fontFamily: 'SF Pro Display',
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '18.23px',
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontFamily: 'SF Pro Display',
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '18.23px',
                      }}
                    >
                      {row.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontFamily: 'SF Pro Display',
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '18.23px',
                      }}
                    >
                      {row.email}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <VisibilityIcon
                        onClick={() => handleOpen(row.id)}
                        sx={{ marginRight: '8px', cursor: 'pointer' }}
                      />
                      <FileDownloadOutlinedIcon
                        onClick={() => handleDownload(row.id)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody> */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {t('loading')}
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows
                .filter((row: any) => {
                  // Ensure row exists and has valid id, name, and email (not null, undefined, or empty)
                  return (
                    row &&
                    row.id != null &&
                    row.id !== '' &&
                    row.name != null &&
                    row.name !== '' &&
                    row.email != null &&
                    row.email !== ''
                  )
                })
                .map((row: any, index: number) => (
                  <TableRow key={row.id || `row-${index}`}>
                    <TableCell>
                      <Typography
                        sx={{
                          fontFamily: 'SF Pro Display',
                          fontWeight: 600,
                          fontSize: '14px',
                          lineHeight: '18.23px',
                        }}
                      >
                        {row.id != null && row.id !== ''
                          ? convertNumberToArabic(index + 1, selectedLanguage)
                          : ''}{' '}
                        {/* Show index + 1 only if row.id is valid */}{' '}
                        {/* Show index + 1 only if row.id is valid */}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontFamily: 'SF Pro Display',
                          fontWeight: 600,
                          fontSize: '14px',
                          lineHeight: '18.23px',
                        }}
                      >
                        {row.name}{' '}
                        {/* No need for N/A since filter ensures valid name */}{' '}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontFamily: 'SF Pro Display',
                          fontWeight: 600,
                          fontSize: '14px',
                          lineHeight: '18.23px',
                        }}
                      >
                        {row.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ padding: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <VisibilityIcon
                          onClick={() =>
                            row.id != null && row.id !== ''
                              ? handleOpen(row.id)
                              : console.warn('Invalid row.id for handleOpen')
                          }
                          sx={{
                            marginRight: '8px',
                            cursor:
                              row.id != null && row.id !== ''
                                ? 'pointer'
                                : 'not-allowed',
                          }}
                        />
                        <FileDownloadOutlinedIcon
                          onClick={() =>
                            row.id != null && row.id !== ''
                              ? handleDownload(row.id)
                              : console.warn(
                                  'Invalid row.id for handleDownload',
                                )
                          }
                          sx={{
                            cursor:
                              row.id != null && row.id !== ''
                                ? 'pointer'
                                : 'not-allowed',
                          }}
                        />
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          width: '100%',
          marginTop: '350px',
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
          onClick={handleClickScore}
        >
          {t('scoreBtn')}
        </Button>
      </div>
    </div>
  )
}

export default NoScore
