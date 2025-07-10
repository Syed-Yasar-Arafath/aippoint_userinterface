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
    Switch,
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
import InterviewScheduler from './interviewSchedule'
function InterviewScheduleCoding() {

    const [aiAvatar, setAiAvatar] = useState(true)
    const [voiceTone, setVoiceTone] = useState('')
    const [accent, setAccent] = useState('')
    const [questionFormat, setQuestionFormat] = useState('')
    const [numQuestions, setNumQuestions] = useState('')
    const [difficulty, setDifficulty] = useState('')
    const [codingExercise, setCodingExercise] = useState('')
    const [programmingLanguage, setProgrammingLanguage] = useState('')

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

    // const handleJDChange = (e: any) => {
    //     const selectedJobId = e.target.value
    //     setJD(selectedJobId)

    //     setFormValues((prev) => ({
    //         ...prev,
    //         jobDescription: {
    //             ...prev.jobDescription,
    //             value: selectedJobId,
    //             error: false,
    //             errorMessage: '',
    //         },
    //     }))

    //     const selectedJobObject =
    //         jobs.find((job) => job.jobid === selectedJobId) || null
    //     // setSelectedJob(selectedJobObject)
    //     if (selectedJobObject) {
    //         const { skills, job_title, experience_required, location } =
    //             selectedJobObject
    //         const filteredJobObject = {
    //             skills,
    //             job_title,
    //             experience_required,
    //             location,
    //         }

    //         // Set the selected job with filtered data
    //         setSelectedJob(filteredJobObject)

    //         const selectedJob = jobs.find((job) => job.jobid === selectedJobId)
    //         if (selectedJob) {
    //             const resumes = selectedJob.resume_data.map((resume: any) => resume.id)
    //             // setResumeIds(resumes);
    //         }
    //     }
    // }

    const handleJDChange = async (e: any) => {
        const selectedJobId = e.target.value;
        setJD(selectedJobId);

        setFormValues((prev) => ({
            ...prev,
            jobDescription: {
                ...prev.jobDescription,
                value: selectedJobId,
                error: false,
                errorMessage: '',
            },
        }));

        const selectedJobObject = jobs.find((job) => job.jobid === selectedJobId) || null;

        if (selectedJobObject) {
            const { skills, job_title, experience_required, location } = selectedJobObject;
            const filteredJobObject = {
                skills,
                job_title,
                experience_required,
                location,
            };
            setSelectedJob(filteredJobObject);

            // 🔥 Resume fetching logic added here
            const resumeDataArray = selectedJobObject.resume_data || [];
            if (resumeDataArray.length > 0) {
                const resumeIds = resumeDataArray.map((resume: any) => resume.id);

                try {
                    const requestData = { resume_id: resumeIds };
                    const resumeResponse = await getResumeById(requestData);

                    const resumeData = resumeResponse.map(
                        (resume: any) => resume.resume_data,
                    );
                    setProfile(resumeData); // ✅ set the resumes to display
                } catch (error) {
                    console.error('Error fetching resumes for job:', error);
                }
            } else {
                console.warn('No resume data found for the selected job.');
            }
        }
    };


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

    const [select, setSelect] = useState(false)
    const [loading, setLoading] = useState(false)
    const [dispatchLoading, setDispatchLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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

    const { formValues, setFormValues } = useQuestionFormatForm()


    const disabledFields: any = {
        jobDescription: Boolean(formValues.programmingLanguage.value),
        programmingLanguage: Boolean(formValues.jobDescription.value),
        questionLevel: false,
        questionLength: false,
    }

    const handleSubmit = async () => {
        let valid = true

        // for (const key in formValues) {
        //     if (formValues[key].value === '') {
        //         valid = false
        //         setFormValues((prevState) => ({
        //             ...prevState,
        //             [key]: {
        //                 ...prevState[key],
        //                 error: true,
        //             },
        //         }))
        //     }
        // }

        for (const key in formValues) {
            if (formValues[key].value === '' && !disabledFields[key]) {
                valid = false;
                setFormValues((prevState) => ({
                    ...prevState,
                    [key]: {
                        ...prevState[key],
                        error: true,
                    },
                }));
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

    // const handleChange = (field: string) => (e: any) => {
    //     const selectedValue = e.target.value
    //     setFormValues((prevState: any) => ({
    //         ...prevState,
    //         [field]: {
    //             ...prevState[field],
    //             value: selectedValue,
    //             error: false,
    //         },
    //     }))
    // }

    const handleChange = (field: string) => async (e: any) => {
        const selectedValue = e.target.value;

        // setFormValues((prevState: any) => ({
        //     ...prevState,
        //     [field]: {
        //         ...prevState[field],
        //         value: selectedValue,
        //         error: false,
        //     },
        // }));

        setFormValues((prevState: any) => {
    const newState = {
      ...prevState,
      [field]: {
        ...prevState[field],
        value: selectedValue,
        error: false,
      },
    };

   // Reset the opposite field if this one is selected
    if (field === 'jobDescription') {
      newState.programmingLanguage = {
        ...prevState.programmingLanguage,
        value: '',
        error: false,
      };
    } else if (field === 'programmingLanguage') {
      newState.jobDescription = {
        ...prevState.jobDescription,
        value: '',
        error: false,
      };
    }

    return newState;
    });

        if (field === 'jobDescription' || field === 'programmingLanguage') {
            const selectedJobObject = jobs.find((job) => job.jobid === selectedValue);

            if (selectedJobObject) {
                const { skills, job_title, experience_required, location } = selectedJobObject;
                const filteredJobObject = {
                    skills,
                    job_title,
                    experience_required,
                    location,
                };
                setSelectedJob(filteredJobObject);

                const resumeDataArray = selectedJobObject.resume_data || [];
                if (resumeDataArray.length > 0) {
                    const resumeIds = resumeDataArray.map((resume: any) => resume.id);
                    try {
                        const requestData = { resume_id: resumeIds };
                        const resumeResponse = await getResumeById(requestData);
                        const resumeData = resumeResponse.map((resume: any) => resume.resume_data);
                        setProfile(resumeData);
                    } catch (error) {
                        console.error('Error fetching resumes:', error);
                    }
                }
            }
        }
    };

    const handleCancel = () => {
        setFormValues((prevState: any) => ({
            ...prevState,
            jobDescription: {
                ...prevState.jobDescription,
                value: '',
                error: false,
            },
            programmingLanguage: {
                ...prevState.programmingLanguage,
                value: '',
                error: false,
            },
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

    const [select1, setSelect1] = useState(false)
    const [select2, setSelect2] = useState(false)
    const [select3, setSelect3] = useState(false)

    const convertNumberToArabic = (num: number, selectedLanguage: any) => {
        if (selectedLanguage === 'ar') {
            return num.toLocaleString('ar-EG')
        }
        return num
    }

    const toggleLabel = { inputProps: { 'aria-label': 'Switch demo' } };


    return (
        <>
            <Header
                // title="Collection"
                title={t('collectionHeader')}
                userProfileImage={userProfileImage}
                path="/collectionai"
            />
            <div style={{
                backgroundColor: '#F7F7F7',
                borderRadius: '12px',
                padding: '16px',
                maxWidth: '1300px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                margin: '20px auto',
            }}>
                <div
                    style={{
                        // backgroundColor: '#F7F7F7',
                        // borderRadius: '12px',
                        // padding: '16px',
                        // maxWidth: '1300px',
                        // margin: '20px auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '10px',
                        // boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                        fontFamily: 'SF Pro Display',
                    }}
                >
                    {/* AI Avatar Toggle */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            fontFamily: 'SF Pro Display',
                        }}
                    >
                        <label
                            style={{
                                fontSize: '14px',
                                marginBottom: '6px',
                                fontWeight: 500,
                                fontFamily: 'SF Pro Display',
                            }}
                        >
                            AI Avatar
                        </label>
                        {/* <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0px 12px',
            borderRadius: '6px',
            // border: '1px solid #ccc',
            border: '1px solid #1C1C1E80',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            fontFamily: 'SF Pro Display',
            height: '58px',
          }}
          onClick={() => setAiAvatar(!aiAvatar)}
        >
          <span style={{ fontFamily: 'SF Pro Display' }}>AI Avatar</span>
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              width: '36px',
              height: '20px',
              fontFamily: 'SF Pro Display',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: aiAvatar ? '#0284C7' : '#ccc',
                borderRadius: '20px',
                transition: 'background-color 0.3s',
                fontFamily: 'SF Pro Display',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  top: '2px',
                  left: aiAvatar ? '18px' : '2px',
                  transition: 'left 0.3s',
                  fontFamily: 'SF Pro Display',
                }}
              ></div>
            </div>
          </div> 
        </div> */}
                        <div
                            style={{
                                border: isDisabled ? '1px solid #1C1C1E80' : '1px solid #1C1C1E50',
                                borderRadius: '6px',
                                padding: '0px 12px',
                                height: '40px',
                                backgroundColor: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontFamily: 'SF Pro Display',
                            }}
                        >
                            <span style={{ fontFamily: 'SF Pro Display', color: isDisabled ? '#1C1C1C' : '#1C1C1E80' }}>AI Avatar</span>
                            <Switch {...toggleLabel} defaultChecked disabled />
                        </div>
                    </div>

                    {/* Voice Tone */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            fontFamily: 'SF Pro Display',
                        }}
                    >
                        <label
                            style={{
                                fontSize: '14px',
                                marginBottom: '6px',
                                fontWeight: 500,
                                fontFamily: 'SF Pro Display',
                            }}
                        >
                            Select Voice Tone
                        </label>
                        <Select
                            value={voiceTone}
                            // onChange={handleChange(setVoiceTone)}
                            disabled
                            displayEmpty
                            style={{
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'SF Pro Display',
                                height: '40px',
                                background: '#FFFFFF'
                            }}
                            sx={{
                                '.MuiOutlinedInput-notchedOutline': { border: '1px solid #1C1C1E80', },
                                '& .MuiSelect-select': { padding: '10px 12px', color: '#757575' },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        '& .MuiMenuItem-root:hover': {
                                            backgroundColor: '#0284C7',
                                            color: '#fff',
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem disabled value="">
                                Select Voice Tone
                            </MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                        </Select>
                    </div>

                    {/* Accent */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            fontFamily: 'SF Pro Display',
                        }}
                    >
                        <label
                            style={{
                                fontSize: '14px',
                                marginBottom: '6px',
                                fontWeight: 500,
                                fontFamily: 'SF Pro Display',
                            }}
                        >
                            Select Accent
                        </label>
                        <Select
                            value={accent}
                            // onChange={handleChange(setAccent)}
                            disabled
                            displayEmpty
                            style={{
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'SF Pro Display',
                                height: '40px',
                                background: '#FFFFFF'
                            }}
                            sx={{
                                '.MuiOutlinedInput-notchedOutline': { border: '1px solid #1C1C1E80', },
                                '& .MuiSelect-select': { padding: '10px 12px', color: '#757575' },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        '& .MuiMenuItem-root:hover': {
                                            backgroundColor: '#0284C7',
                                            color: '#fff',
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem disabled value="">
                                Select Accent
                            </MenuItem>
                            <MenuItem value="English (USA)">English (USA)</MenuItem>
                            <MenuItem value="English (UK)">English (UK)</MenuItem>
                        </Select>
                    </div>

                    {/* Include Coding Exercise */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            fontFamily: 'SF Pro Display',
                        }}
                    >
                        <label
                            style={{
                                fontSize: '14px',
                                marginBottom: '6px',
                                fontWeight: 500,
                                fontFamily: 'SF Pro Display',
                            }}
                        >
                            Do you want to include coding exercise?
                        </label>
                        <Select
                            value={codingExercise}
                            // onChange={handleChange(setCodingExercise)}
                            disabled
                            displayEmpty
                            style={{
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'SF Pro Display',
                                height: '40px',
                                background: '#FFFFFF'
                            }}
                            sx={{
                                '.MuiOutlinedInput-notchedOutline': { border: '1px solid #1C1C1E80', },
                                '& .MuiSelect-select': { padding: '10px 12px', color: '#757575' },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        '& .MuiMenuItem-root:hover': {
                                            backgroundColor: '#0284C7',
                                            color: '#fff',
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem disabled value="">
                                Yes/No
                            </MenuItem>
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                        </Select>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            fontFamily: 'SF Pro Display',
                        }}
                    >
                        <label
                            style={{
                                fontSize: '14px',
                                marginBottom: '6px',
                                fontWeight: 500,
                                fontFamily: 'SF Pro Display',
                            }}
                        >
                            Select JD Collection
                        </label>

                        <FormControl fullWidth>
                            <Select
                                displayEmpty
                                // value={jd}
                                value={formValues.jobDescription.value}
                                // onChange={handleJDChange}
                                onChange={handleChange('jobDescription')}
                                onClick={() => setSelect1(true)}
                                // disabled={Boolean(collection)}
                                disabled={Boolean(formValues.programmingLanguage.value)}
                                sx={{
                                    border: '1px solid #1C1C1E80',
                                    borderRadius: '6px',
                                    height: '40px',
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
                                    '& .MuiSelect-select': {
                                        fontSize: '14px',
                                        fontFamily: 'SF Pro Display',
                                        color: '#9e9e9e',
                                    },
                                }}
                                // renderValue={
                                //   jd !== '' ? undefined : () => t('selectJobDescription')
                                // }
                                renderValue={
                                    formValues.jobDescription.value !== '' ? undefined : () => t('selectJobDescription')
                                }

                            >
                                <MenuItem disabled value="">
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
                    </div>

                    {/* Number of Questions */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            fontFamily: 'SF Pro Display',
                        }}
                    >
                        <label
                            style={{
                                fontSize: '14px',
                                marginBottom: '6px',
                                fontWeight: 500,
                                fontFamily: 'SF Pro Display',
                            }}
                        >
                            Select No.of Questions
                        </label>
                        {/* <Select
          value={numQuestions}
          // onChange={handleChange(setNumQuestions)}
          displayEmpty
          style={{
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'SF Pro Display',
            height: '50px',
          }}
          sx={{
            '.MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
            '& .MuiSelect-select': { padding: '10px 12px', color: '#757575' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root:hover': {
                  backgroundColor: '#0284C7',
                  color: '#fff',
                },
              },
            },
          }}
        >
          <MenuItem disabled value="">
            No.of Questions
          </MenuItem>
          <MenuItem value="AI (04) + Question Bank (02)">
            AI (04) + Question Bank (02)
          </MenuItem>
          <MenuItem value="AI (05) + QB (03)">AI (05) + QB (03)</MenuItem>
        </Select> */}
                        <FormControl fullWidth>
                            <Select
                                displayEmpty
                                // value={questionLength}
                                value={formValues.questionLength.value}
                                onChange={handleChange('questionLength')}
                                onClick={() => setSelect2(true)}
                                sx={{
                                    border: '1px solid #1C1C1E80',
                                    borderRadius: '6px',
                                    height: '40px',
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
                                    '& .MuiSelect-select': {
                                        fontSize: '14px',
                                        fontFamily: 'SF Pro Display',
                                        color: '#9e9e9e',
                                    },
                                }}
                                renderValue={
                                    formValues.questionLength.value !== ''
                                        ? undefined
                                        : () => 'Select Number Of Questions'
                                }
                                error={formValues.questionLength.error}
                            >
                                <MenuItem disabled value="">
                                    Select Number Of Questions
                                    {/* {t('selectNumberHeader')} */}
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
                    </div>

                    {/* Question Format */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            fontFamily: 'SF Pro Display',
                        }}
                    >
                        <label
                            style={{
                                fontSize: '14px',
                                marginBottom: '6px',
                                fontWeight: 500,
                                fontFamily: 'SF Pro Display',
                            }}
                        >
                            Select Question Format
                        </label>
                        <Select
                            value={questionFormat}
                            // onChange={handleChange(setQuestionFormat)}
                            displayEmpty
                            disabled
                            style={{
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'SF Pro Display',
                                height: '40px',
                                background: '#FFFFFF'
                            }}
                            sx={{
                                '.MuiOutlinedInput-notchedOutline': { border: '1px solid #1C1C1E80', },
                                '& .MuiSelect-select': { padding: '10px 12px', color: '#757575' },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        '& .MuiMenuItem-root:hover': {
                                            backgroundColor: '#0284C7',
                                            color: '#fff',
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem disabled value="">
                                Select Question Format
                            </MenuItem>
                            <MenuItem value="AI + Question Bank">AI + Question Bank</MenuItem>
                            <MenuItem value="Only AI">Only AI</MenuItem>
                        </Select>
                    </div>

                    {/* Difficulty Level */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            fontFamily: 'SF Pro Display',
                        }}
                    >
                        <label
                            style={{
                                fontSize: '14px',
                                marginBottom: '6px',
                                fontWeight: 500,
                                fontFamily: 'SF Pro Display',
                            }}
                        >
                            Select Question Difficulty Level
                        </label>
                        {/* <Select
          value={difficulty}
          // onChange={handleChange(setDifficulty)}
          displayEmpty
          style={{
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'SF Pro Display',
            height: '50px',
          }}
          sx={{
            '.MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
            '& .MuiSelect-select': { padding: '10px 12px', color: '#757575' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root:hover': {
                  backgroundColor: '#0284C7',
                  color: '#fff',
                },
              },
            },
          }}
        >
          <MenuItem disabled value="">
            Question Difficulty Level
          </MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </Select> */}
                        <FormControl fullWidth>
                            <Select
                                displayEmpty
                                // value={questionLevel}
                                value={formValues.questionLevel.value}
                                onChange={handleChange('questionLevel')}
                                onClick={() => setSelect3(true)}
                                sx={{
                                    border: '1px solid #1C1C1E80',
                                    borderRadius: '6px',
                                    height: '40px',
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
                                    '& .MuiSelect-select': {
                                        fontSize: '14px',
                                        fontFamily: 'SF Pro Display',
                                        color: '#9e9e9e',
                                    },
                                }}
                                renderValue={
                                    formValues.questionLevel.value !== ''
                                        ? undefined
                                        : () => 'Select Question Difficulty Level'
                                }
                                error={formValues.questionLevel.error}
                            >
                                <MenuItem disabled value="">
                                    Select Question Difficulty Level
                                    {/* {t('selectQuestionLevelPlaceholder')} */}
                                </MenuItem>
                                {/* <MenuItem value="Easy">Easy</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Hard">Hard</MenuItem> */}
                                <MenuItem value="Easy">{t('easyDropdown')}</MenuItem>
                                <MenuItem value="Medium">{t('mediumDropdown')}</MenuItem>
                                <MenuItem value="Hard">{t('hardDropdown')}</MenuItem>
                            </Select>
                            {formValues.questionLevel.error && (
                                <div style={{ color: 'red' }}>
                                    {formValues.questionLevel.errorMessage}
                                </div>
                            )}
                        </FormControl>
                    </div>

                    {/* Programming Language */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            fontFamily: 'SF Pro Display',
                        }}
                    >
                        <label
                            style={{
                                fontSize: '14px',
                                marginBottom: '6px',
                                fontWeight: 500,
                                fontFamily: 'SF Pro Display',
                            }}
                        >
                            Select Programming language
                        </label>
                        {/* <Select
          value={programmingLanguage}
          // onChange={handleChange(setProgrammingLanguage)}
          displayEmpty
          style={{
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'SF Pro Display',
            height: '50px',
          }}
          sx={{
            '.MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
            '& .MuiSelect-select': { padding: '10px 12px', color: '#757575' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root:hover': {
                  backgroundColor: '#0284C7',
                  color: '#fff',
                },
              },
            },
          }}
        >
          <MenuItem disabled value="">
            Programming language for coding exercise
          </MenuItem>
          <MenuItem value="Java Script">Java Script</MenuItem>
          <MenuItem value="Python">Python</MenuItem>
          <MenuItem value="Java">Java</MenuItem>
        </Select> */}
                        {/* <FormControl fullWidth>
              <Select
                displayEmpty
                value={collection} // Ensure value matches the state
                onChange={handleCollectionChange} // Update the state on change
                onClick={() => setSelect1(true)}
                disabled={Boolean(jd)}
                sx={{
                  border: '1px solid #1C1C1E80',
                  borderRadius: '6px',
                  height: '40px',
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
                  '& .MuiSelect-select': {
                    fontSize: '14px',
                    fontFamily: 'SF Pro Display',
                    color: '#9e9e9e',
                  },
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
            </FormControl> */}
                        <FormControl fullWidth>
                            <Select
                                displayEmpty
                                // value={jd}
                                value={formValues.programmingLanguage.value}
                                // onChange={handleJDChange}
                                onChange={handleChange('programmingLanguage')}
                                onClick={() => setSelect1(true)}
                                disabled={Boolean(formValues.jobDescription.value)}
                                sx={{
                                    border: '1px solid #1C1C1E80',
                                    borderRadius: '6px',
                                    height: '40px',
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
                                    '& .MuiSelect-select': {
                                        fontSize: '14px',
                                        fontFamily: 'SF Pro Display',
                                        color: '#9e9e9e',
                                    },
                                }}
                                // renderValue={
                                //   jd !== '' ? undefined : () => t('selectJobDescription')
                                // }
                                renderValue={
                                    formValues.programmingLanguage.value !== '' ? undefined : () => 'Select Programming Language'
                                }

                            >
                                <MenuItem disabled value="">
                                    Select Programming Language
                                </MenuItem>
                                {jobs.map((job) => (
                                    <MenuItem key={job.jobid} value={job.jobid}>
                                        {job.job_title}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formValues.programmingLanguage.error && (
                                <div style={{ color: 'red' }}>
                                    {formValues.programmingLanguage.errorMessage}
                                </div>
                            )}
                        </FormControl>
                    </div>

                    {/* Buttons in the same row (3rd column) */}
                    {/* <div
        style={{
          display:'flex',
          justifyContent:'center',
          flexDirection:'row',
          gap:'12px',
        }}
      >
        <Button
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            border: '1px solid #000',
            cursor: 'pointer',
            fontFamily: 'SF Pro Display',
            width: '100%',
            maxWidth: '140px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            backgroundColor: '#fff',
            textTransform: 'initial',
            color: 'black',
          }}
        >
          Cancel
        </Button>

        <Button
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid transparent',
            cursor: 'pointer',
            fontFamily: 'SF Pro Display',
            width: '100%',
            maxWidth: '140px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            backgroundColor: '#0284C7',
            color: '#fff',
            textTransform: 'none',
          }}
        >
          Schedule Interview
        </Button>
      </div> */}
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        gap: '12px',
                        marginTop: '10px'
                    }}
                >
                    <Button
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            border: '1px solid #000',
                            cursor: 'pointer',
                            fontFamily: 'SF Pro Display',
                            width: '100%',
                            maxWidth: '140px',
                            height: '40px',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            boxSizing: 'border-box',
                            backgroundColor: '#fff',
                            textTransform: 'initial',
                            color: 'black',
                        }}
                        onClick={() => {
                            setJD('')
                            setCollection('')
                            handleCancel()
                            setSelect1(false)
                            setSelect2(false)
                            setSelect3(false)
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            border: '1px solid transparent',
                            cursor: 'pointer',
                            fontFamily: 'SF Pro Display',
                            width: '100%',
                            maxWidth: '140px',
                            height: '40px',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            boxSizing: 'border-box',
                            backgroundColor: '#0284C7',
                            color: '#fff',
                            textTransform: 'none',
                        }}
                        onChange={handleJDChange}
                        onClick={handleSubmit}
                        disabled={isDisabled}
                    >
                        Schedule Interview
                    </Button>
                </div>
                <div style={{ marginTop: '10px' }}>
                    {select1 && select2 && select3 && (
                        <div style={{ height: 230, width: '100%' }}>
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
                                                <TableRow key={e.profile}
                                                    sx={{
                                                        '& td': {
                                                            padding: '0px',
                                                        },
                                                    }}
                                                >
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
                                                                ? e.work[0].designation_at_company || 'N/A' // Extract designation or use 'N/A' if missing
                                                                : 'N/A'}{' '}
                                                            {/* Handle missing work array */}
                                                        </p>
                                                    </TableCell>

                                                    <TableCell>
                                                        <p style={tableRow}>{e.email}</p>
                                                    </TableCell>
                                                    {/* <TableCell>
                                <p
                                  style={{
                                    border: '2px solid #0284C7',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    padding: '10px 0px',
                                    color: '#0284C7',
                                  }}
                                >
                                  100%
                                </p>
                              </TableCell> */}
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
                                                    {/* <TableCell>
                                <p
                                  style={{
                                    color: '#808080',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                  }}
                                >
                                  <EditOutlinedIcon />
                                  <DeleteOutlineIcon />
                                </p>
                              </TableCell> */}
                                                    <TableCell>
                                                        <p>
                                                            {' '}
                                                            <Checkbox
                                                                {...label}
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

                    {select1 && select2 && select3 && (
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
                </div>
            </div>
        </>
    )
}

export default InterviewScheduleCoding
