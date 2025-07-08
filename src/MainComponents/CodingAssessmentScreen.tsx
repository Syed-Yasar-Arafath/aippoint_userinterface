import React, { ChangeEvent, useEffect, useState } from 'react'
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Modal,
  TextField,
  Typography,
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Avatar,
  useTheme,
  IconButton,
  LinearProgress,
} from '@mui/material'
import axios from 'axios'
import Header from '../CommonComponents/topheader'
import {
  CodingAssessment,
  generateQuestions,
  getResumeById,
  postResume,
} from '../services/ResumeService'
import { useDispatch, useSelector } from 'react-redux'
import { loaderOff, loaderOn, openSnackbar } from '../redux/actions'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
// import Success from './successstory'
import { useQuestionFormatForm } from '../custom-components/custom_forms/QuestionFormatForm'
import { t } from 'i18next'
import i18n from '../i18n'
// import JobDescription from './JobDescription' //
import { useTranslation } from 'react-i18next';
import { useCodingAssessmentForm } from '../custom-components/custom_forms/CodingAssessmentForm'
function CodingAssessmentScreen() {
  const selectedLanguage: any = localStorage.getItem('i18nextLng')

  const currentLanguage = selectedLanguage === 'ar' ? 'Arabic' : 'English'
  console.log(currentLanguage)

  const organisation = localStorage.getItem('organisation')
  const { t } = useTranslation();

  const [questionLength, setQuestionLength] = useState('')
  const [questionLevel, setQuestionLevel] = useState('')
  const [userProfileImage, setUserProfileImage]: any = React.useState(null)
  const dispatch = useDispatch()
  interface Jd_Id {
    job_title: string
    skills: string
    experience_required: string
    location: string
  }

  interface Jd {
    job_title: string
    jobid: number
    skills: string
    experience_required: string
    location: string
    resume_data: any
  }

  interface Job {
    type: 'job'
    jobid: number
    job_title: string
    skills: string
    experience_required: string
    location: string
    resume_data: any
  }

  interface Collection {
    type: 'collection'
    collection_id: number
    collection_name: string
    resume_data: any
  }
  const [jobs, setJobs] = useState<Jd[]>([])
  const [selectedJob, setSelectedJob] = useState<Jd_Id | null>(null)
  const [jd, setJD] = useState('')
  const [userId, setUserId] = useState('')
  const [open, setOpen] = React.useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleJDChange = (e: any) => {
    const selectedJobId = e.target.value
    setJD(selectedJobId)
    
    setFormValues((prev) => ({
      ...prev,
      jobDescription: {
        ...prev.jobDescription,
        value: selectedJobId,
        error: false,
        errorMessage: '',
      },
    }))

    const selectedJobObject =
      jobs.find((job) => job.jobid === selectedJobId) || null
    // setSelectedJob(selectedJobObject)
    if (selectedJobObject) {
      const { skills, job_title, experience_required, location } =
        selectedJobObject
      const filteredJobObject = {
        skills,
        job_title,
        experience_required,
        location,
      }

      // Set the selected job with filtered data
      setSelectedJob(filteredJobObject)

      const selectedJob = jobs.find((job) => job.jobid === selectedJobId)
      if (selectedJob) {
        const resumes = selectedJob.resume_data.map((resume: any) => resume.id)
        // setResumeIds(resumes);
      }
    }
  }
  const selectedJobJson = selectedJob
    ? JSON.stringify(selectedJob, null, 2)
    : ''

  interface Collection {
    collection_name: string
    collection_id: number
    resume_data: any
  }

  const [collection, setCollection] = useState<string | number>('')
  const [base64Pdf, setBase64Pdf] = useState('')

  const [collections, setCollections] = useState<Collection[]>([])
  const [profile, setProfile] = useState<any[]>([])
  const [collectionId, setCollectionId] = useState<number | null>(null)
  const [resumes, setResumes] = useState<any[]>([])
  const handleSaveClick = async (id: number) => {
    try {
      const updatedProfile = { ...profile.find((item) => item.id === id) }
      updatedProfile.resume_data.email = editedEmail

      await axios.put(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/collection/edit/${id}/${organisation}`,
        updatedProfile,
      )

      // setProfile((prevProfile) =>
      //   prevProfile.map((item) =>
      //     item.id === id
      //       ? {
      //           ...item,
      //           resume_data: { ...item.resume_data, email: editedEmail },
      //         }
      //       : item,
      //   ),
      // )
      setEditingRowId(null)
    } catch (error) {
      console.error('Error updating email:', error)
    }
  }
  const fetchResumes = async () => {
    try {
      console.log('This is resumeid', resumeId)
      const requestData = { resume_id: resumeId }
      const resumeResponse = await getResumeById(requestData)
      const resumeData = resumeResponse.map((resume: any) => resume.resume_data)
      console.log('This is resumeid', resumeData)
      setResumes(resumeData)
    } catch (error) {
      console.error('Error fetching resumes for job:', error)
    }
  }
  const handleCollectionChange = async (e: any) => {
    const selectedId = e.target.value
    console.log('Selected ID:', selectedId)

    if (selectedId) {
      setCollection(selectedId)

        setFormValues((prev) => ({
      ...prev,
      collection: {
        ...prev.collection,
        value: selectedId,
        error: false,
        errorMessage: '',
      },
    }));

      const selectedItem = combinedData.find(
        (item) =>
          (item.type === 'job' && item.jobid === selectedId) ||
          (item.type === 'collection' && item.collection_id === selectedId),
      )

      if (!selectedItem) {
        console.warn('No matching item found for the selected ID.')
        return
      }

      if (selectedItem.type === 'job') {
        // Fetch resumes for the selected job
        const resumeDataArray = selectedItem.resume_data || []
        if (resumeDataArray.length > 0) {
          const resumeIds = resumeDataArray.map((resume: any) => resume.id)

          try {
            const requestData = { resume_id: resumeIds }
            const resumeResponse = await getResumeById(requestData)

            const resumeData = resumeResponse.map(
              (resume: any) => resume.resume_data,
            )
            setProfile(resumeData)
          } catch (error) {
            console.error('Error fetching resumes for job:', error)
          }
        } else {
          console.warn('No resume data found for the selected job.')
        }
      } else if (selectedItem.type === 'collection') {
        // Fetch resumes for the selected collection
        const resumeDataArray = selectedItem.resume_data || []
        if (resumeDataArray.length > 0) {
          const resumeIds = resumeDataArray.map((resume: any) => resume.id)

          try {
            const requestData = { resume_id: resumeIds }
            const resumeResponse = await getResumeById(requestData)

            const resumeData = resumeResponse.map(
              (resume: any) => resume.resume_data,
            )
            setProfile(resumeData)
          } catch (error) {
            console.error('Error fetching resumes for collection:', error)
          }
        } else {
          console.warn('No resume data found for the selected collection.')
        }
      }
    }
  }
  const sendOrg = async (dbName: any) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get-organization-name/`,
        {
          headers: { Organization: dbName },
        },
      )
      console.log(response.data) // Log the whole response
    } catch (error: any) {
      console.error(
        'Error:',
        error.response ? error.response.data : error.message,
      )
    }
  }

  // const handleCollectionChange = async (e: any) => {
  //   const selectedId = e.target.value
  //   console.log('This the selected Id', selectedId)

  //   if (selectedId) {
  //     setCollection(selectedId)
  //     const isNumber =
  //       typeof selectedId === 'number' || !isNaN(Number(selectedId))
  //     console.log('isnummm', isNumber)
  //     if (isNumber) {
  //       const numericId = Number(selectedId)
  //       console.log('this', numericId)

  //       // Check if selectedId matches a jobid
  //       const selectedJob = jobs.find((job) => job.jobid === numericId)
  //       if (selectedJob) {
  //         const resumeDataArray = selectedJob.resume_data || []
  //         if (resumeDataArray.length > 0) {
  //           const resumeIds = resumeDataArray.map((resume: any) => resume.id)

  //           try {
  //             const requestData = { resume_id: resumeIds }
  //             const resumeResponse = await getResumeById(requestData)

  //             const resumeData = resumeResponse.map(
  //               (resume: any) => resume.resume_data,
  //             )
  //             setResumes(resumeData)
  //           } catch (error) {
  //             console.error('Error fetching resumes for job:', error)
  //           }
  //         } else {
  //           console.error('No resume data found for the selected job.')
  //         }
  //       }

  //       // Check if selectedId matches a collection_id
  //       const selectedCollection = collections.find(
  //         (collection) => collection.collection_id === numericId,
  //       )
  //       console.log('This is the cccc', selectedCollection)
  //       if (selectedCollection) {
  //         const resumeDataArray = selectedCollection.resume_data || []
  //         if (resumeDataArray.length > 0) {
  //           const resumeIds = resumeDataArray.map((resume: any) => resume.id)

  //           try {
  //             const requestData = { resume_id: resumeIds }
  //             const resumeResponse = await getResumeById(requestData)

  //             const resumeData = resumeResponse.map(
  //               (resume: any) => resume.resume_data,
  //             )
  //             console.log('This is the resumedata', resumeData)
  //             setProfile(resumeData)
  //             // setResumes(resumeData)
  //           } catch (error) {
  //             console.error('Error fetching resumes for collection:', error)
  //           }
  //         } else {
  //           console.warn('No resume data found for the selected collection.')
  //         }
  //       } else {
  //         console.warn('Invalid Collection ID selected:', numericId)
  //       }
  //     } else {
  //       console.warn('Invalid ID type selected:', selectedId)
  //     }
  //   }
  // }

  // const handleCollectionChange = async (e: any) => {
  //   const selectedId = e.target.value
  //   console.log('This the selected Id', selectedId)

  //   setFormValues((prev) => ({
  //     ...prev,
  //     collection: {
  //       ...prev.collection,
  //       value: selectedId,
  //       error: false,
  //       errorMessage: '',
  //     },
  //   }))
  //   if (selectedId) {
  //     setCollection(selectedId)
  //     const isNumber =
  //       typeof selectedId === 'number' || !isNaN(Number(selectedId))
  //     console.log('isnummm', isNumber)
  //     if (isNumber) {
  //       const numericId = Number(selectedId)
  //       console.log('this', numericId)

  //       // Check if selectedId matches a jobid
  //       const selectedJob = jobs.find((job) => job.jobid === numericId)
  //       if (selectedJob) {
  //         const resumeDataArray = selectedJob.resume_data || []
  //         if (resumeDataArray.length > 0) {
  //           const resumeIds = resumeDataArray.map((resume: any) => resume.id)

  //           try {
  //             const requestData = { resume_id: resumeIds }
  //             const resumeResponse = await getResumeById(requestData)

  //             const resumeData = resumeResponse.map(
  //               (resume: any) => resume.resume_data,
  //             )
  //             setResumes(resumeData)
  //           } catch (error) {
  //             console.error('Error fetching resumes for job:', error)
  //           }
  //         } else {
  //           console.error('No resume data found for the selected job.')
  //         }
  //       }

  //       // Check if selectedId matches a collection_id
  //       const selectedCollection = collections.find(
  //         (collection) => collection.collection_id === numericId,
  //       )
  //       console.log('This is the cccc', selectedCollection)
  //       if (selectedCollection) {
  //         const resumeDataArray = selectedCollection.resume_data || []
  //         if (resumeDataArray.length > 0) {
  //           const resumeIds = resumeDataArray.map((resume: any) => resume.id)

  //           try {
  //             const requestData = { resume_id: resumeIds }
  //             const resumeResponse = await getResumeById(requestData)

  //             const resumeData = resumeResponse.map(
  //               (resume: any) => resume.resume_data,
  //             )
  //             console.log('This is the resumedata', resumeData)
  //             setProfile(resumeData)
  //             // setResumes(resumeData)
  //           } catch (error) {
  //             console.error('Error fetching resumes for collection:', error)
  //           }
  //         } else {
  //           console.warn('No resume data found for the selected collection.')
  //         }
  //       } else {
  //         console.warn('Invalid Collection ID selected:', numericId)
  //       }
  //     } else {
  //       console.warn('Invalid ID type selected:', selectedId)
  //     }
  //   }
  // }

  // const handleQuestionLevel = (e: any) => {
  //   const selectedValue = e.target.value
  //   setQuestionLevel(selectedValue)
  // }

  // const handleQuestionLength = (e: any) => {
  //   const selectedLength = e.target.value
  //   setQuestionLength(selectedLength)
  // }

  // useEffect(() => {
  //   const fetchCollections = async () => {
  //     try {
  //       const response = await axios.get(
  //         'https://aippoint.ai/aippoint-spring-service/collection/read',
  //       )
  //       console.log('this is userid', response.data)
  //       const filteredCollections = response.data.filter(
  //         (collection: any) =>
  //           collection.user === userId && collection.deleteStatus !== 'deleted',
  //       )
  //       setCollections(filteredCollections)
  //       console.log('Collection data', response.data)
  //     } catch (error) {
  //       console.log('error' + error)
  //     }
  //   }

  //   fetchCollections()
  // }, [])
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/user/read/${organisation}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        setUserId(response.data.user_id)
        console.log('this is res', response.data.job_description)
        console.log('this is res', response)

        const filteredJobs = response.data.job_description.filter(
          (job: any) => job.type === 'active' && job.deleteStatus !== 'true',
        )
        const filteredcollData = response.data.collection.filter(
          (item: any) => item.deleteStatus != 'deleted',
        )
        console.log('this is filteredcollData', filteredcollData)
        console.log('this is filteredJobs', filteredcollData)
        setJobs(filteredJobs)
        setCollections(filteredcollData)
      } catch (error) {
        console.log('error' + error)
      }
    }
    fetchJobs()
  }, [])
  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     try {
  //       const response = await axios.get('https://aippoint.ai/aippoint-spring-service/job/read')
  //       console.log('this is res', response.data)
  //       const filteredJobs = response.data.filter(
  //         (job: any) => job.type === 'active' && job.deleteStatus !== 'deleted',
  //       )
  //       setJobs(filteredJobs)
  //     } catch (error) {
  //       console.log('error' + error)
  //     }
  //   }
  //   fetchJobs()
  // }, [])

  // const combinedData = [
  //   ...jobs,
  //   ...collections.map((item) => ({
  //     collection_name: item.collection_name,
  //     collection_id: item.collection_id,
  //     isCollection: true,
  //   })),
  // ]
  type CombinedData = Job | Collection
  const seenIds = new Set()
  const combinedData: CombinedData[] = [
    ...jobs.map(
      (job): Job => ({
        ...job,
        type: 'job',
      }),
    ),
    ...collections.map(
      (collection): Collection => ({
        collection_name: collection.collection_name,
        collection_id: collection.collection_id,
        type: 'collection',
        resume_data: collection.resume_data,
      }),
    ),
  ]

  // const combinedData = [
  //   ...jobs.map((job) => ({
  //     ...job,
  //     isCollection: false, // Add a flag to distinguish jobs
  //   })),
  //   ...collections
  //     .map((item) => ({
  //       collection_name: item.collection_name,
  //       collection_id: item.collection_id,
  //       isCollection: true, // Add a flag to indicate collections
  //     }))
  //     .filter((item) => {
  //       const id = `collection-${item.collection_id}`
  //       if (seenIds.has(id)) return false
  //       seenIds.add(id)
  //       return true
  //     }),
  // ]

  const fetchCollectiondata = async () => {
    try {
      // Fetch collections data
      const response = await axios.get(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/collection/read/${organisation}`,
      )
      let collectionsData = response.data
      collectionsData = collectionsData.filter(
        (collection: any) => collection.deleteStatus !== 'deleted',
      )
      setCollections(collectionsData)

      let resumeIds: any[] = []
      if (Array.isArray(collectionsData)) {
        collectionsData.forEach((collection: any) => {
          if (collection.resume_data && Array.isArray(collection.resume_data)) {
            resumeIds = [
              ...resumeIds,
              ...collection.resume_data.map((resume: any) => resume.id),
            ]
          } else {
            console.warn(
              'Skipping collection with invalid resume_data:',
              collection,
            )
          }
        })
        // console.log('Resume IDs for collection:', resumeIds)
      } else {
        console.error('Expected collectionsData to be an array.')
      }
      if (resumeIds.length > 0) {
        const requestData = { resume_id: resumeIds }

        const resumeResponse = await getResumeById(requestData)

        // Extract only the resume_data from each resume object
        const resumeData = resumeResponse.map(
          (resume: any) => resume.resume_data,
        )
        setResumes(resumeData)

        // console.log('Resumes retrieved successfully:', resumeData)

        if (Array.isArray(resumeData)) {
          resumeData.forEach((resume: any, index: number) => {
            // console.log(`Resume ${index + 1}:`, resume)
          })
        } else {
          console.error('Expected resumeData to be an array.')
        }
        // console.log('Resumes retrieved successfully:', resumeResponse)
      } else {
        // console.log('No resume IDs to fetch.')
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }

  const [createdBy, setCreatedBy] = useState('')
  const [editedEmail, setEditedEmail] = useState<string>('')
  const token = localStorage.getItem('token')
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedEmail(event.target.value)
  }

  useEffect(() => {
    const getUserData = async () => {
      setDispatchLoading(true)
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/user/read/${organisation}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        const user = res.data
        setCreatedBy(user.email)
        setDispatchLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    getUserData()
  }, [])

  const [files, setFiles] = useState<FileList | null>(null)

  // useEffect(() => {
  //   const fetchFiles = async () => {
  //     try {
  //       const response = await axios.get('https://aippoint.ai/aippoint-spring-service/files/list')
  //       setFiles(response.data)
  //       console.log('Files', response.data)
  //     } catch (error) {
  //       console.log('error', error)
  //     }
  //   }
  //   fetchFiles()
  // }, [])
  const [editingRowId, setEditingRowId] = useState<number | null>(null)
  const [questionLevelError, setQuestionLevelError] = useState(false)
  const [questionLengthError, setQuestionLengthError] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

  const columnName = [
    t('candidateName'),
    t('designation'),
    t('email'),
    // 'Score',
    t('viewDownload'),
    // 'Action',
    t('select'),
  ]

  const tableColumn: React.CSSProperties = {
    color: '#000000',
    fontSize: '14px',
    fontWeight: 700,
  }

  const tableRow: React.CSSProperties = {
    color: '#000000',
    fontSize: '14px',
    fontWeight: 400,
  }

  const [resumeId, setResumeId] = useState<any[]>([])

  const handleCheckboxClick = (
    id: any,
    email: string | null,
    isChecked: boolean,
  ) => {
    if (isChecked) {
      if (id && email && email !== 'Missing') {
        setResumeId((prevIds) => {
          // Avoid adding duplicate IDs
          if (!prevIds.includes(id)) {
            return [...prevIds, id]
          }
          return prevIds
        })
      } else {
        dispatch(openSnackbar(t('emailMandatorySnackbar'), 'red'))
      }
    } else {
      setResumeId((prevIds) => prevIds.filter((prevId) => prevId !== id))
    }
    console.log('Current resumeId state:', resumeId) // Debug log
  }
  useEffect(() => {
    fetchResumes()
  }, [resumeId])
  const theme = useTheme()

  const [page, setPage] = useState(0)
  const fixedRowsPerPage = 3

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

  const [openModal, setOpenModal] = React.useState(false)

  const handleClose = () => setOpenModal(false)

  const handleOpen = async (proId: any) => {
    const jsonData = {
      resume_id: [proId],
    }
    try {
      const res = await postResume(jsonData)
      setBase64Pdf(res[0].file_data)
      setOpenModal(true)
    } catch (error) {
      // Handle errors
      console.error('Error fetching data:', error)
    }
  }

  const handleDownload = async (proId: any) => {
    const jsonData = {
      resume_id: [proId],
    }

    try {
      const res = await postResume(jsonData)
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

  // const queLength = [3, 5, 10, 15, 20]
  const queLength = [t('three'), t('five'), t('ten'), t('fifteen'), t('twenty')]

  const { formValues, setFormValues } = useCodingAssessmentForm()

  const handleSubmit = async () => {
    let valid = true
    for (const key in formValues) {
      if (formValues[key].value === '') {
        valid = false
        setFormValues((prevState) => ({
          ...prevState,
          [key]: {
            ...prevState[key],
            error: true,
          },
        }))
      }
    }
    // if (valid) {
    console.log('Form submitted successfully!')
    const formData = new FormData()
    formData.append('resumes', JSON.stringify(resumes))
    formData.append('jd_data', selectedJobJson)
    // formData.append('que_level', formValues.questionLevel.value)
    formData.append('created_by', createdBy)
    // formData.append('len_que', formValues.questionLength.value)
    formData.append('ref_num', 'INT-091')
    formData.append('particular_skill', formValues.questionLevel.value)

    formData.append('language_selected', currentLanguage)

    // ✅ Use questionLength as num_question
    formData.append('num_question', formValues.questionLength.value)
    dispatch(loaderOn())
    console.log('payload', formData)
    try {
      const response = await CodingAssessment(formData)
      console.log('tHIS IS THE RESPONSE', response)

      if (response?.message === 'Questions generated successfully') {
        dispatch(openSnackbar(t('successPleaseProceedSnackbar'), 'blue'))
      } else {
        dispatch(
          // openSnackbar('Kindly provide all the necessary information.', 'blue'),
          openSnackbar(t('kindlyProvideSnackbar'), 'blue'),
          // openSnackbar(t('kindlyProvideSnackbar'), 'blue'),
        )
        console.log('Response message did not match the expected value.')
      }
    } catch (error) {
      console.error('Error:', error)
      // dispatch(openSnackbar('Error', 'red'))
      dispatch(openSnackbar(t('error'), 'red'))
    } finally {
      dispatch(loaderOff())
    }
  }

  const handleChange = (field: string) => (e: any) => {
    const selectedValue = e.target.value
    setFormValues((prevState: any) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        value: selectedValue,
        error: false,
      },
    }))
  }

  const handleCancel = () => {
    setFormValues((prevState: any) => ({
      ...prevState,
      questionLength: {
        ...prevState.questionLength,
        value: '',
        error: false,
      },
      questionLevel: {
        ...prevState.questionLevel,
        value: '',
        error: false,
      }
    }));
  };

  const [select, setSelect] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dispatchLoading, setDispatchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const convertNumberToArabic = (num: number, selectedLanguage: any) => {
    if (selectedLanguage === 'ar') {
      return num.toLocaleString('ar-EG')
    }
    return num
  }

  return (
    <div style={{ padding: '4px 33px 15px 38px' }}>
      {dispatchLoading && <LinearProgress />}
      {loading ? (
        <LinearProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Header
          title={t('collectionHeader')}
          userProfileImage={userProfileImage}
          path="/assessmentselection"
        />
      )}
      <Typography
        style={{
          color: '#0A0B5C',
          fontFamily: 'SF Pro Display',
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '25.32px',
          textAlign: 'left',
        }}
      >
        Manage and collaborate on job-based candidate collections.
        {/* {t('selectionQuestionTypeandModify')} */}
      </Typography>
      <Grid
        container
        spacing={2}
        style={{
          background: '#F7F7F7',
          borderRadius: '14px',
          boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.1)',
          padding: '40px',
          marginTop: '20px',
          // height: '100vh',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Grid
          item
          lg={12}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <Grid item lg={5}>
            {' '}
            <p>
              {/* Select Job Description */}
              {t('selectJobDescription')}
            </p>
            <FormControl fullWidth>
              <Select
                displayEmpty
                value={jd}
                onChange={handleJDChange}
                // onChange={handleChange('jobDescription')}
                // value={formValues.jobDescription.value}
                sx={{
                  border: '1px solid #1C1C1E80',
                  borderRadius: '6px',
                  direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  backgroundColor: '#FFFFFF',
                }}
                renderValue={
                  jd !== '' ? undefined : () => t('selectJobDescription')
                }
              // renderValue={
              //   formValues.jobDescription.value !== ''
              //     ? undefined
              //     : () => 'Select Job Description'
              // }
              // error={formValues.jobDescription.error}
              >
                <MenuItem disabled value="">
                  {/* Select Job Description */}
                  {t('selectJobDescription')}
                </MenuItem>
                {jobs.map((job) => (
                  <MenuItem key={job.jobid} value={job.jobid}>
                    {job.job_title}
                  </MenuItem>
                ))}
              </Select>
              {formValues.jobDescription.error && (
                <div style={{ color: 'red' }}>
                  {formValues.jobDescription.errorMessage}
                </div>
              )}
            </FormControl>
            <p
              style={{
                marginTop: '50px',
              }}
            >
              {/* {t('selectNumberHeader')} */}
              Select No.of Questions
            </p>
            <FormControl fullWidth>
              <Select
                displayEmpty
                value={formValues.questionLength.value}
                onChange={handleChange('questionLength')}
                sx={{
                  border: '1px solid #1C1C1E80',
                  borderRadius: '6px',
                  direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  backgroundColor: '#FFFFFF',
                }}
                renderValue={
                  formValues.questionLength.value !== ''
                    ? undefined
                    : () => 'Select Number Of Questions'
                }
                error={formValues.questionLength.error}
              >
                <MenuItem disabled value="">
                  {/* {t('selectNumberHeader')} */}
                  Select Number Of Questions
                </MenuItem>
                {queLength.map((length: any, index: number) => (
                  <MenuItem key={index} value={length}>
                    {length}
                  </MenuItem>
                ))}
              </Select>
              {formValues.questionLength.error && (
                <div style={{ color: 'red' }}>
                  {formValues.questionLength.errorMessage}
                </div>
              )}
            </FormControl>
          </Grid>
          <Grid item lg={5}>
            {' '}
            <p>
              {/* Select Collection */}
              {t('selectCollection')}
            </p>
            <FormControl fullWidth>
              <Select
                onClick={() => setSelect(true)}
                displayEmpty
                value={collection} // Ensure value matches the state
                onChange={handleCollectionChange} // Update the state on change
                sx={{
                  border: '1px solid #1C1C1E80',
                  borderRadius: '6px',
                  direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  backgroundColor: '#FFFFFF',
                }}
                renderValue={(selected) => {
                  if (!selected) return t('selectCollection')

                  const selectedItem = combinedData.find((item) => {
                    if (item.type === 'job') {
                      return item.jobid === collection // Use the collection state
                    }
                    if (item.type === 'collection') {
                      return item.collection_id === collection // Use the collection state
                    }
                    return false
                  })

                  return selectedItem
                    ? selectedItem.type === 'job'
                      ? selectedItem.job_title
                      : selectedItem.collection_name
                    : 'Select Collection'
                }}
              >
                <MenuItem disabled value="">
                  {t('selectCollection')}
                </MenuItem>
                {combinedData.map((item) => (
                  <MenuItem
                    key={`${item.type}-${item.type === 'job' ? item.jobid : item.collection_id
                      }`}
                    value={
                      item.type === 'job' ? item.jobid : item.collection_id
                    }
                  >
                    {item.type === 'job'
                      ? item.job_title
                      : item.collection_name}
                  </MenuItem>
                ))}
              </Select>
              {formValues.collection.error && (
                <div style={{ color: 'red' }}>
                  {formValues.collection.errorMessage}
                </div>
              )}
            </FormControl>
            <p
              style={{
                marginTop: '50px',
              }}
            >
              {t('selectProgrammingLanguage')}
              {/* {t('typeQuestionLevelHeader')} */}
            </p>
            <FormControl fullWidth>
              <Select
                displayEmpty
                value={formValues.questionLevel.value}
                onChange={handleChange('questionLevel')}
                sx={{
                  border: '1px solid #1C1C1E80',
                  borderRadius: '6px',
                  direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  backgroundColor: '#FFFFFF',
                }}
                renderValue={
                  formValues.questionLevel.value !== ''
                    ? undefined
                    : () => 'Select Programming Language'
                }
                error={formValues.questionLevel.error}
              >
                <MenuItem disabled value="">
                  {t('selectProgrammingLanguage')}
                </MenuItem>
                <MenuItem value="javascript">{t('javaScript')}</MenuItem>
                <MenuItem value="python">{t('python')}</MenuItem>
                <MenuItem value="java">{t('java')}</MenuItem>
                <MenuItem value="c">{t('c')}</MenuItem>
                <MenuItem value="cpp">{t('cPlusPlus')}</MenuItem>
                <MenuItem value="csharp">{t('cSharp')}</MenuItem>
                <MenuItem value="php">{t('php')}</MenuItem>
                <MenuItem value="ruby">{t('ruby')}</MenuItem>
                <MenuItem value="swift">{t('swift')}</MenuItem>
                <MenuItem value="kotlin">{t('kotlin')}</MenuItem>
                <MenuItem value="rust">{t('rust')}</MenuItem>
                <MenuItem value="go">{t('go')}</MenuItem>
                <MenuItem value="typescript">{t('typeScript')}</MenuItem>
                <MenuItem value="dart">{t('dart')}</MenuItem>
              </Select>
              {formValues.questionLevel.error && (
                <div style={{ color: 'red' }}>
                  {formValues.questionLevel.errorMessage}
                </div>
              )}
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          item
          lg={12}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 5
          }}
        >
          <Button
            style={{
              color: '#1C1C1E',
              border: '1px solid #1C1C1E',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 700,
              height: '40px',
              width: '250px',
              textTransform: 'none',
              margin: '20px 0px',
            }}
            onClick={() => {
              setJD('')
              setCollection('')
              handleCancel()
              setSelect(false)
            }}
          >
            Cancel
          </Button>
          <Button
            style={{
              background: isDisabled ? '#CCCCCC' : '#0284C7',
              color: '#FFFFFF',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 700,
              height: '40px',
              width: '250px',
              textTransform: 'none',
              margin: '20px 0px',
            }}
            onChange={handleJDChange}
            onClick={handleSubmit}
            disabled={isDisabled}
          >
            {/* Schedule Interview */}
            {t('scheduleInterviewBtn')}
          </Button>
        </Grid>
        {select && (
          <div style={{ height: 400, width: '100%' }}>
            <TableContainer
              component={Paper}
              style={{ boxShadow: '0px 4px 6px rgba(0, 0, 255, 0.38)' }}
            >
              <Table
                sx={{ minWidth: 700 }}
                aria-label="interview history table"
              >
                <TableHead>
                  <TableRow>
                    {columnName.map((column: any, index: number) => (
                      <TableCell key={index} style={tableColumn}>
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profile
                    .slice(
                      page * fixedRowsPerPage,
                      page * fixedRowsPerPage + fixedRowsPerPage,
                    )
                    .map((e: any) => (
                      <TableRow key={e.id}>
                        <TableCell>
                          <p
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-evenly',
                              alignItems: 'center',
                              ...tableRow,
                            }}
                          >
                            <Avatar src="/broken-image.jpg" />
                            {e.name}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p style={tableRow}>
                            {e.work && e.work.length > 0
                              ? e.work[0].designation_at_company || 'N/A'
                              : 'N/A'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p style={tableRow}>{e.email}</p>
                        </TableCell>
                        <TableCell>
                          <p
                            style={{
                              color: '000000',
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-evenly',
                            }}
                          >
                            <VisibilityIcon onClick={() => handleOpen(e.id)} />
                            <FileDownloadOutlinedIcon
                              onClick={() => handleDownload(e.id)}
                            />
                          </p>
                        </TableCell>
                        <TableCell>
                          <p>
                            <Checkbox
                              {...label}
                              checked={resumeId.includes(e.resume_id)} // Explicitly bind checked state
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                              ) =>
                                handleCheckboxClick(
                                  e.resume_id,
                                  e.email,
                                  event.target.checked,
                                )
                              }
                            />
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
        {select && (
          <div>
            <Box display="flex" justifyContent="center" marginTop={7}>
              <Box sx={{ flexShrink: 0 }}>
                <IconButton
                  onClick={handleBackButtonClick}
                  disabled={page === 0}
                  aria-label="previous page"
                  sx={{
                    fontSize: '16px',
                    color: '#0284C7',
                    '&:hover': {
                      background: 'inherit',
                    },
                  }}
                >
                  {theme.direction === 'rtl' ? t('nextBtn') : t('previousBtn')}
                </IconButton>
                {[
                  ...Array(Math.ceil(profile.length / fixedRowsPerPage)).keys(),
                ].map((pageNumber) => {
                  const startPage = Math.max(0, page - 1)
                  const endPage = Math.min(
                    Math.ceil(profile.length / fixedRowsPerPage) - 1,
                    startPage + 2,
                  )

                  if (pageNumber >= startPage && pageNumber <= endPage) {
                    return (
                      <span
                        key={pageNumber}
                        style={{
                          alignSelf: 'center',
                          margin: '0 8px',
                          color: page === pageNumber ? '#FFFFFF' : '#0284C7',
                          border: '1px solid #0284C7',
                          fontSize: '16px',
                          padding: '5px 10px',
                          background:
                            page === pageNumber ? '#0284C7' : 'inherit',
                        }}
                        onClick={() => setPage(pageNumber)}
                      >
                        {/* {pageNumber + 1} */}
                        {convertNumberToArabic(
                          pageNumber + 1,
                          selectedLanguage,
                        )}
                      </span>
                    )
                  }
                  return null
                })}
                <IconButton
                  onClick={handleNextButtonClick}
                  disabled={
                    page >= Math.ceil(profile.length / fixedRowsPerPage) - 1
                  }
                  aria-label="next page"
                  sx={{
                    fontSize: '16px',
                    color: '#0284C7',
                    '&:hover': {
                      background: 'inherit',
                    },
                  }}
                >
                  {theme.direction === 'rtl' ? t('previousBtn') : t('nextBtn')}
                </IconButton>
              </Box>
            </Box>
          </div>
        )}
        <Modal
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
                onClick={handleClose}
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
        </Modal>
      </Grid>
    </div>
  )
}

export default CodingAssessmentScreen
