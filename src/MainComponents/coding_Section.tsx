import { Editor } from '@monaco-editor/react'
import { Box, Button, Grid, Modal, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  DyteUiProvider,
  DyteGrid,
  DyteMicToggle,
  DyteCameraToggle,
  DyteLeaveButton,
} from '@dytesdk/react-ui-kit'
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core'
import useProctoring from './useProctoring'
import { Snackbar, Alert } from '@mui/material'
import { useDispatch } from 'react-redux'
import { loaderOff, loaderOn } from '../redux/actions'
import { t } from 'i18next'
import i18n from '../i18n'
import { useTranslation } from 'react-i18next';
interface MergeVideoRequest {
  video_urls: string[]
  meeting_id: string
  object_id?: string
}

interface MergeVideoResponse {
  message: string
}

function CodingSection() {
  // dyte integration////////////////////////////////
  const organisation = localStorage.getItem('organisation')
  const selectedLanguage: any = localStorage.getItem('i18nextLng')
const { t } = useTranslation();

  const currentLanguage = selectedLanguage === 'ar' ? 'Arabic' : 'English'
  console.log(currentLanguage)
  const [openDialog, setOpenDialog] = useState(false)
  const [initialConditionMet, setInitialConditionMet] = useState(false)
  const [liveParticipant, setLiveParticipant] = useState<number>(0)
  const [timeLimit, setTimeLimit] = useState(300)
  const [meeting, initMeeting] = useDyteClient()

  const location = useLocation()
  // const { objId } = location.state || {}
  const [recordingId, setRecordingId] = useState<string | null>(null)

  const { authToken, meetingId, objId } = location.state || {}
  console.log('object id is', objId)
  const { warning, violations } = useProctoring(objId)
  const [open, setOpen] = useState(false)

  const startRecording = async () => {
    try {
      const recordingData = {
        meeting_id: meetingId,
        allow_multiple_recordings: true,
      }
      const response = await axios.post(
        'https://api.dyte.io/v2/recordings',
        recordingData,
        {
          auth: {
            username: '955e223b-76a8-4c24-a9c6-ecbfea717290',
            password: '26425221301ce90b9244',
          },
        },
      )

      const newRecordingId = response.data.data.id
      setRecordingId(newRecordingId)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = async () => {
    try {
      const response = await axios.put(
        `https://api.dyte.io/v2/recordings/${recordingId}`,
        { action: 'stop' },
        {
          auth: {
            username: '955e223b-76a8-4c24-a9c6-ecbfea717290',
            password: '26425221301ce90b9244',
          },
        },
      )
    } catch (error) {
      console.error('Error stopping recording:', error)
    }
  }

  const handleDownloadRecording = async () => {
    try {
      await stopRecording()
      const response = await axios.get(
        `https://api.dyte.io/v2/recordings/${recordingId}`,
        {
          auth: {
            username: '955e223b-76a8-4c24-a9c6-ecbfea717290',
            password: '26425221301ce90b9244',
          },
        },
      )

      const url = response.data.data.download_url

      // setUserProfileImage(url)
      const recordingEntity = {
        outputFileName: url,
        meetingid: objId,
        sessionId: `question_${currentQuestionIndex + 1}.mp4`,
      }
      // fetchSkillScore(objId)

      await axios.post(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/recording/write/${organisation}`,
        recordingEntity,
      )
      const link = document.createElement('a')
      link.href = url

      // if (url) {
      //   await uploadRecording(url, meetingId)
      // } else {
      //   console.error('No download URL received')
      // }

      console.log('Starting new recording...')
      // await startRecording()
    } catch (error) {
      console.error('Error downloading recording:', error)
    }
  }
  React.useEffect(() => {
    if (warning) {
      setOpen(true)
    }
  }, [warning])
  console.log('authhhhh', authToken)
  // useEffect(() => {
  //   if (authToken) {
  //     initMeeting({
  //       authToken: authToken,
  //       defaults: {
  //         audio: true,
  //         video: true,
  //       },
  //     })
  //     // startRecording()
  //   }
  // }, [authToken])

  useEffect(() => {
    const setupMeeting = async () => {
      if (!authToken) {
        console.error('Missing authToken')
        return
      }

      // Prevent multiple join calls
      if (meeting) {
        console.log('Meeting already joining or joined, skipping initMeeting.')
        return
      }

      try {
        await initMeeting({
          authToken,
          defaults: {
            audio: true,
            video: true,
          },
        })
      } catch (error) {
        console.error('Failed to initialize Dyte meeting:', error)
      }
    }

    setupMeeting()
  }, [authToken]) // 👈 only depend on authToken, not initMeeting or meeting

  useEffect(() => {
    const timer = setTimeout(() => {
      meeting?.self?.enableVideo()
      meeting?.self?.enableAudio()
    }, 1000) // wait 1 second for safety

    return () => clearTimeout(timer)
  }, [meeting])
  useEffect(() => {
    if (initialConditionMet && authToken) {
      startRecording()
    }
  }, [initialConditionMet, authToken])
  const checkSessionStatus = async () => {
    try {
      const response = await axios.get(
        `https://api.dyte.io/v2/meetings/${meetingId}/active-session`,
        {
          auth: {
            username: '955e223b-76a8-4c24-a9c6-ecbfea717290',
            password: '26425221301ce90b9244',
          },
        },
      )
      const participant = response.data.data.live_participants
      setLiveParticipant(participant)
      if (participant > 0) {
        setInitialConditionMet(true)
      }
    } catch (error: any) {
      if (error.response) {
        if (
          error.response.status === 404 ||
          error.response.data.error?.code === 404
        ) {
          setLiveParticipant(0)
        }
      } else {
        // Handle other errors if needed
      }
    }
  }

  // ////////////////////////////////////////////////////
  const initialCode = {
    javascript:
      '// JavaScript\nfunction main() {\n\tconsole.log("Hello World");\n}\n\nmain();\n',
    python: '# Python\ndef main():\n\tprint("Hello World")\n\nmain()\n',
    java: '// Java\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n',
    c: '// C\n#include <stdio.h>\nint main() {\n\tprintf("Hello World\\n");\n\treturn 0;\n}\n',
    cpp: '// C++\n#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Hello World" << endl;\n\treturn 0;\n}\n',
    csharp:
      '// C#\nusing System;\n\nclass Program {\n\tstatic void Main() {\n\t\tConsole.WriteLine("Hello World");\n\t}\n}\n',
    php: '// PHP\n<?php\necho "Hello World";\n?>\n',
    ruby: '# Ruby\ndef main\n\tputs "Hello World"\nend\n\nmain\n',
    swift:
      '// Swift\nimport Foundation\n\nfunc main() {\n\tprint("Hello World")\n}\n\nmain()\n',
    kotlin: '// Kotlin\nfun main() {\n\tprintln("Hello World")\n}\n',
    rust: '// Rust\nfn main() {\n\tprintln!("Hello World");\n}\n',
    go: '// Go\npackage main\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello World")\n}\n',
    typescript:
      '// TypeScript\nfunction main(): void {\n\tconsole.log("Hello World");\n}\n\nmain();\n',
    dart: '// Dart\nvoid main() {\n\tprint("Hello World");\n}\n',
  }

  // const [language, setLanguage] = useState<string>('javascript')
  const [language, setLanguage] = useState<string>('java')
  // const [code, setCode] = useState<string>(initialCode.javascript)
  const [code, setCode] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<number>(10 * 60)
  const [enableTimeLeft, setEnableTimeLeft] = useState(false)
  console.log('codeeeee', code)
  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '')
  }

  const submitCode = async () => {
    const organisation = localStorage.getItem('organisation')

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/assess/`,
        {
          object_id: id,
          question: codingQuestions[currentQuestionIndex],
          answer: code,
        },
        {
          headers: {
            Organization: organisation,
          },
        },
      )
      console.log(response.data)
      if (response.status == 200) {
        // setTimeout(() => {
        // handleDownloadRecording()
        // }, 2000)
        // setTimeLimit(300)
      }
      handleRecordingSubmit()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)

      if (timeLeft === 180) {
        setEnableTimeLeft(true)
      }

      return () => clearInterval(timer)
    } else {
      submitCode()

      handleNextQuestion()
      resetTimer()
      handleSubmitClose()
      handleNextQuestionClose()
      setCode('')
    }
  }, [timeLeft])

  const resetTimer = () => {
    setTimeLeft(10 * 60)
    setEnableTimeLeft(false)
  }
  ////newl added bellow code
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          // Enable timer display when it drops to 180 seconds or less
          if (prevTime <= 180 && !enableTimeLeft) {
            setEnableTimeLeft(true)
          }
          return prevTime - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    } else {
      submitCode()
      handleNextQuestion()
      resetTimer()
      handleSubmitClose()
      handleNextQuestionClose()
      setCode('')
    }
  }, [timeLeft, enableTimeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0',
    )}`
  }

  const preventPaste = (e: ClipboardEvent) => {
    e.preventDefault()
    alert(t('pastingIsDisabled'))
  }

  const preventCopyCut = (e: KeyboardEvent) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      ['c', 'v', 'x'].includes(e.key.toLowerCase())
    ) {
      e.preventDefault()
      alert(t('cutCopyPasteRestricted'))
    }
  }

  useEffect(() => {
    document.addEventListener('paste', preventPaste)
    document.addEventListener('keydown', preventCopyCut)

    return () => {
      document.removeEventListener('paste', preventPaste)
      document.removeEventListener('keydown', preventCopyCut)
    }
  }, [])

  const [submitClicked, setSubmitClicked] = useState(false)
  const [nextQuestionClicked, setNextQuestionClicked] = useState(false)

  const handleMainButtonClicked = (e: any) => {
    if (e == 1) {
      setSubmitClicked(true)
      setNextQuestionClicked(false)
    }
    if (e == 2) {
      setSubmitClicked(false)
      setNextQuestionClicked(true)
    }
  }

  const [modalSubmitClicked, setModalSubmitClicked] = useState(false)
  const [modalContinueTestClicked, setModalContinueTestClicked] =
    useState(false)

  const handleModal1ButtonClicked = (e: any) => {
    if (e == 1) {
      setModalSubmitClicked(false)
      setModalContinueTestClicked(true)
    }
    if (e == 2) {
      setModalSubmitClicked(true)
      setModalContinueTestClicked(false)
    }
  }

  const [modalStayQuestionClicked, setModalStayQuestionClicked] =
    useState(false)
  const [modalSkipClicked, setModalSkipClicked] = useState(false)

  const handleModal2ButtonClicked = (e: any) => {
    if (e == 1) {
      setModalSkipClicked(false)
      setModalStayQuestionClicked(true)
    }
    if (e == 2) {
      setModalSkipClicked(true)
      setModalStayQuestionClicked(false)
    }
  }

  const generatefeedback = async () => {
    try {
      const formData = new FormData()
      formData.append('object_id', id)
      formData.append('language_selected', currentLanguage)

      // Send formData in the request body
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/generate_feedback_coding/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            organization: organisation,
          },
        },
      )
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const languge = localStorage.getItem('i18nextLng')
  console.log('Selected Language:', languge)

  const handleQuestionAnalysis = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/analyze_questions_coding/`,
        {
          object_id: id,
          language_selected: languge,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            organization: organisation,
          },
        },
      )
      console.log('question analysis response: ', response)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleSoftSkills = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract_soft_skills_coding/`,
        {
          object_id: id,
          language_selected: languge,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            organization: organisation,
          },
        },
      )
      console.log('soft skills response: ', response)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleStrengths = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract_strengths_areas_coding/`,
        {
          object_id: id,
          language_selected: languge,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            organization: organisation,
          },
        },
      )
      console.log('strengths response: ', response)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleTechnicalScore = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract-techskills-scores-coding/`,
        {
          object_id: id,
          language_selected: languge,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            organization: organisation,
          },
        },
      )

      console.log('technical score response: ', response)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const navigate = useNavigate()

  // const handleNextQuestion = () => {
  //   if (currentQuestionIndex === codingQuestions.length - 1) {
  //     generatefeedback()
  //     handleQuestionAnalysis()
  //     handleSoftSkills()
  //     handleStrengths()
  //     handleTechnicalScore()
  //     navigate('/coding_submit')
  //   } else {
  //     setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
  //   }
  // }
  const handleExit = async () => {
    stopRecording()
    handleSubmit()
    setOpenDialog(true)

    try {
      const response = await axios.post(
        `https://api.dyte.io/v2/meetings/${meetingId}/active-session/kick-all`,
        null,
        {
          auth: {
            username: '955e223b-76a8-4c24-a9c6-ecbfea717290',
            password: '26425221301ce90b9244',
          },
        },
      )
      SendThankYouMail()
      navigate('/coding_submit')
    } catch (error) {
      console.error('Error kicking session:', error)
    }
  }
  const dispatch = useDispatch()

  const handleSubmit = async () => {
    try {
      dispatch(loaderOn())

      if (currentQuestionIndex === codingQuestions.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Wait for all async operations to complete
        await Promise.all([
          generatefeedback(),
          handleQuestionAnalysis(),
          handleSoftSkills(),
          handleStrengths(),
          handleTechnicalScore(),

          handleProctoring(objId),
        ])
        dispatch(loaderOff())
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      // Optionally, still open the dialog or handle the error case
      setOpenDialog(true)
      // setTimeout(() => {
      //   navigate('/SubmitInterview')
      // }, 1000)
    }
  }

  const handleProctoring = async (objectId?: string): Promise<File | null> => {
    try {
      // Step 1: Fetch recording data
      const response = await axios.get(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/recording/meeting/${objectId}/${organisation}`,
      )

      if (Array.isArray(response.data)) {
        // Extract and deduplicate valid URLs
        const videoUrls = [
          ...new Set(
            response.data
              .map((recording: any) => recording.outputFileName)
              .filter((url: string) => url),
          ),
        ]

        if (videoUrls.length === 0) {
          console.error('No valid video URLs found')
          return null
        }

        // Step 2: Prepare request data for merge API
        const requestData: MergeVideoRequest = {
          video_urls: videoUrls,
          meeting_id: objId,
        }

        if (objectId) {
          requestData.object_id = objId
        }

        // Step 3: Call the merge API
        const mergeResponse = await axios.post<MergeVideoResponse>(
          `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/merge_videos/`, // Update with your actual Django endpoint
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
              Organization: organisation,
            },
          },
        )

        // Step 4: Handle response
        if (mergeResponse.status === 202) {
          console.log('Video processing queued:', mergeResponse.data.message)
          // Since processing is async, we can't return the file immediately
          // You might want to implement polling or websocket to get the result
          console.log(
            'Processing started. Implement polling/websocket to get final video.',
          )
          return null // Return null since the file isn't available yet
        } else {
          console.error('Unexpected status code:', mergeResponse.status)
          return null
        }
      } else {
        console.error('Unexpected data format:', response.data)
        return null
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Handle specific status codes from the backend
          switch (error.response.status) {
            case 400:
              console.error('Bad request:', error.response.data.error)
              break
            case 405:
              console.error('Method not allowed')
              break
            case 500:
              console.error('Server error:', error.response.data.error)
              break
            default:
              console.error('Unexpected error:', error.response.data)
          }
        } else {
          console.error('Network error:', error.message)
        }
      } else {
        console.error('Unknown error merging videos:', error)
      }
      return null
    }
  }
  const handleNextQuestion = async () => {
    if (!initialConditionMet) {
      console.log('Condition not met, skipping function execution.')
      return
    }

    if (currentQuestionIndex === codingQuestions.length - 1) {
      try {
        // Stop the recording first
        // await stopRecording()

        // Handle exit process
        await handleExit()

        // Call required functions
        generatefeedback()

        handleProctoring(id)
        handleQuestionAnalysis()
        handleSoftSkills()
        handleStrengths()
        handleTechnicalScore()
        // SendThankYouMail()
        // Navigate after all processes are complete
        navigate('/coding_submit')
      } catch (error) {
        console.error('Error during final question processing:', error)
      }
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
      // await startRecording();
    }
  }

  useEffect(() => {
    if (meetingId) {
      checkSessionStatus()
    }
  }, [currentQuestionIndex, meetingId])
  const textStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: 'SF Pro Display',
    color: '#0284C7',
  }
  const taskStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: 'SF Pro Display',
    color: '#ffffff',
    textAlign: 'center',
  }

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: '#FFFFFF',
    boxShadow: 24,
    p: 4,
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
  }

  const [submitOpen, setSubmitOpen] = React.useState(false)

  const handleSubmitOpen = () => setSubmitOpen(true)
  const handleSubmitClose = () => {
    setSubmitOpen(false)
    setModalSubmitClicked(false)
    setModalContinueTestClicked(false)
    setSubmitClicked(false)
    setNextQuestionClicked(false)
    setCode('')
  }

  const [nextQuestionOpen, setNextQuestionOpen] = React.useState(false)
  const handleNextQuestionOpen = () => setNextQuestionOpen(true)
  const handleNextQuestionClose = () => {
    setNextQuestionOpen(false)
    setModalStayQuestionClicked(false)
    setModalSkipClicked(false)
    setSubmitClicked(false)
    setNextQuestionClicked(false)
    setCode('')
  }

  const [codingQuestions, setCodingQuestions] = useState([])
  const hasFetched = useRef(false)

  const id = objId

  useEffect(() => {
    // if (!id) return
    if (!id || hasFetched.current) return

    const fetchData = async () => {
      const organisation: any = localStorage.getItem('organisation')
      try {
        const response = await fetch(
          `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_interview_data/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Organization: organisation,
            },
            body: new URLSearchParams({ object_id: id }),
          },
        )

        const result = await response.json()
        const codingQuestions = result.data.questions.map(
          (que: any) => que.problem_statement,
        )
        console.log('debugging:', codingQuestions)
        setCodingQuestions(codingQuestions)
      } catch (error) {
        console.log('Failed to fetch data')
      }
    }

    fetchData()
  }, [id])
  useEffect(() => {
    let interval = 5000
    const maxInterval = 3000

    const pollStatus = async () => {
      try {
        await checkSessionStatus()
        interval = interval < maxInterval ? interval * 2 : maxInterval
      } catch (error) {
        console.error('Error checking session status:', error)
      }
    }

    const intervalId = setInterval(pollStatus, interval)

    return () => clearInterval(intervalId)
  }, [])

  const SendThankYouMail = () => {
    const handleSendThankYouMail = async () => {
      const organisation = localStorage.getItem('organisation')

      if (!meetingId) {
        alert(t('pleaseProvideValidMeetingId'))
        return
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/interview/Thankingmailcoding/${organisation}`,
          { meetingId }, // Pass the meetingId in the request body
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        console.log('Thank-you email response:', response.data)
      } catch (error) {
        console.error('Error sending thank-you email:', error)
      }
    }
    handleSendThankYouMail()
  }

  // ////////////////////////
  const handleRecordingSubmit = async () => {
    try {
      // Step 1: Stop Recording
      await stopRecording()
      console.log('Recording stopped...')

      // Step 2: Wait for 3 seconds before downloading (optional, ensures recording stops)
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Step 3: Download Recording
      await handleDownloadRecording()
      console.log('Recording downloaded and saved...')

      // Step 4: Start a new recording
      await startRecording()
      console.log('New recording started...')
    } catch (error) {
      console.error('Error in handleSubmit:', error)
    }
  }

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

  const convertNumberToArabic = (num: number, selectedLanguage: any) => {
    if (selectedLanguage === 'ar') {
      return num.toLocaleString('ar-EG')
    }
    return num
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        padding: '20px',
        overflow: 'auto',
      }}
    >
      <Grid container spacing={2}>
        <Grid
          item
          lg={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <DyteUiProvider meeting={meeting}>
            {/* 1. Dyte Video */}
            <DyteGrid
              meeting={meeting}
              style={{
                flex: '0 0 auto',
                borderRadius: '10px',

                maxHeight: '300px',
                minWidth: '200px',
                width: '100%',
              }}
            />

            {/* 2. Questions and Timer */}
            <Box
              sx={{
                background: '#263D4A',
                backdropFilter: 'blur(12px)',
                marginTop: '10px',
                width: '100%',
                borderRadius: '8px',
                padding: '11px 6px',
                maxHeight: { xs: '150px', sm: '200px', md: '250px' }, // Example for responsive heights
                overflowY: 'auto', // Enable vertical scrolling
                wordBreak: 'break-word', // Ensure long text wraps
              }}
            >
              {initialConditionMet && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>
                    {t('questionNo')}{' '}
                    {convertNumberToArabic(
                      currentQuestionIndex + 1,
                      selectedLanguage,
                    )}
                  </Typography>
                  <Typography sx={textStyle}>
                    Time Left:{' '}
                    <span
                      style={{
                        paddingTop: '5px',
                        minWidth: '50px',
                        display: 'inline-block',
                      }}
                    >
                      {/* {formatTime(timeLeft)} */}
                      {convertNumberToArabic(
                        parseInt(formatTime(timeLeft)),
                        selectedLanguage,
                      )}
                    </span>
                  </Typography>
                </Box>
              )}
              <Box>
                {initialConditionMet ? (
                  <Typography
                    style={{
                      fontSize: '12px',
                      color: '#FFFFFF',
                      fontFamily: 'Inter',
                      fontWeight: 400,
                    }}
                  >
                    {/* {codingQuestions[currentQuestionIndex]} */}
                    {convertNumberToArabic(
                      codingQuestions[currentQuestionIndex],
                      selectedLanguage,
                    )}
                  </Typography>
                ) : (
                  <Typography sx={taskStyle}>
                    {t('pleaseJoinTheInterview')}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* 4. Buttons */}
            {initialConditionMet && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '20px',
                  marginTop: '20px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: '10px',
                    opacity: 0.5,
                    pointerEvents: 'none',
                    marginTop: '15px',
                    paddingLeft: '6px',
                  }}
                >
                  <DyteMicToggle meeting={meeting} />
                  <DyteCameraToggle meeting={meeting} />
                </Box>
                <Button
                  onClick={() => {
                    handleMainButtonClicked(2)
                    handleNextQuestionOpen()
                  }}
                  sx={{
                    padding: '10px 15px',
                    display: 'inline-flex',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    fontWeight: 500,
                    height: '36px',
                    minWidth: '120px',
                    textTransform: 'none',
                    background: nextQuestionClicked ? '#0284C7' : '#FFFFFF',
                    borderRadius: '8px',
                    border: nextQuestionClicked ? 'none' : '1px solid #000000',
                    color: nextQuestionClicked ? '#FFFFFF' : '#000000',
                    '&:hover': {
                      background: nextQuestionClicked ? '#0284C7' : '#F0F0F0',
                    },
                  }}
                >
                  {t('skipQuestion')}
                </Button>
                <Button
                  onClick={handleExit}
                  sx={{
                    display: 'inline-flex',
                    whiteSpace: 'nowrap',
                    padding: '10px 10px',
                    fontSize: '14px',
                    fontWeight: 500,
                    height: '36px',
                    minWidth: '120px',
                    textTransform: 'none',
                    background: '#0284C7',
                    borderRadius: '6px',
                    color: '#E8F1FF',
                    '&:hover': {
                      background: '#026A9E',
                    },
                  }}
                >
                  {t('endInterview')}
                </Button>
              </Box>
            )}
            {/* </Box> */}
          </DyteUiProvider>
        </Grid>

        {/* editor grid  */}
        {initialConditionMet && (
          <Grid item lg={8} sx={{}}>
            {/* Instruction */}
            <Typography
              variant="h6"
              sx={{
                fontSize: '14px',
                color: '#fff',
                pointerEvents: 'none',
              }}
            >
              {t('pleaseWriteTheCodeInBelowEditor')}
            </Typography>

            {/* Editor box */}
            <Box
              sx={{
                border: '2px solid #0284C7',
                borderRadius: '8px',
                padding: '8px',
                backgroundColor: '#F9FAFB',
                height: '80vh',
                width: '100%',
              }}
            >
              <Editor
                height="70%"
                width="100%"
                language={language}
                value={code}
                onChange={handleEditorChange}
                theme="#FFFFFF"
                options={{
                  fontSize: 16,
                  minimap: { enabled: true },
                  automaticLayout: true,
                  contextmenu: false,
                }}
              />
            </Box>

            {/* Submit button below */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '16px',
              }}
            >
              <Button
                onClick={() => {
                  handleMainButtonClicked(1)
                  handleSubmitOpen()
                }}
                sx={{
                  padding: '10px 70px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'none',
                  background: submitClicked ? '#0284C7' : '#FFFFFF',
                  borderRadius: '8px',
                  border: submitClicked ? 'none' : '1px solid #000000',
                  color: submitClicked ? '#FFFFFF' : '#000000',
                  '&:hover': {
                    background: submitClicked ? '#0284C7' : '#F3F4F6',
                  },
                  height: '36px',
                  minWidth: '100px',
                }}
              >
                {t('submitCode')}
              </Button>
            </Box>
          </Grid>
        )}
        <Grid item lg={12} height="20px" width="100%">
          {enableTimeLeft && timeLeft !== 0 && initialConditionMet && (
            <span style={{ color: '#FF3131' }}>
              You have only{' '}
              <span style={{ minWidth: '35px', display: 'inline-block' }}>
                {/* {formatTime(timeLeft)} */}
                {convertNumberToArabic(
                  parseInt(formatTime(timeLeft)),
                  selectedLanguage,
                )}
              </span>{' '}
              {t('timeLeftAlertMessage')}
            </span>
          )}
        </Grid>
      </Grid>
      <Modal
        open={submitOpen}
        onClose={handleSubmitClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            sx={{
              color: '#0284C7',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'SF Pro Display',
            }}
          >
            {t('youStillHaveTime')}
          </Typography>
          <Typography
            sx={{
              color: '#0A0A0A',
              fontSize: '14px',
              fontWeight: 400,
              fontFamily: 'SF Pro Display',
            }}
          >
            {t('youHave')}{' '}
            <span style={{ minWidth: '40px', display: 'inline-block' }}>
              {/* {formatTime(timeLeft)} */}
              {initialConditionMet
                ? convertNumberToArabic(
                    parseInt(formatTime(timeLeft)),
                    selectedLanguage,
                  )
                : '00:00'}
            </span>{' '}
            {t('codeSubmitAlertMessage')}
          </Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              flexDirection: 'row',
            }}
          >
            <Button
              onClick={() => {
                handleModal1ButtonClicked(1)
                handleSubmitClose()
              }}
              sx={{
                padding: '10px 70px',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'none',
                background: modalContinueTestClicked ? '#0284C7' : '#FFFFFF',
                borderRadius: '8px',
                border: modalContinueTestClicked ? '' : '1px solid #000000',
                color: modalContinueTestClicked ? '#FFFFFF' : '#000000',
                '&:hover': {
                  background: modalContinueTestClicked ? '#0284C7' : '#FFFFFF',
                },
              }}
            >
              {t('noContinueTest')}
            </Button>
            <Button
              onClick={() => {
                handleModal1ButtonClicked(2)
                submitCode()
                resetTimer()
                handleNextQuestion()
                handleSubmitClose()
              }}
              sx={{
                padding: '10px 70px',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'none',
                background: modalSubmitClicked ? '#0284C7' : '#FFFFFF',
                borderRadius: '8px',
                border: modalSubmitClicked ? '' : '1px solid #000000',
                color: modalSubmitClicked ? '#FFFFFF' : '#000000',
                '&:hover': {
                  background: modalSubmitClicked ? '#0284C7' : '#FFFFFF',
                },
              }}
            >
              {t('yesSubmit')}
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={nextQuestionOpen}
        onClose={handleNextQuestionClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            sx={{
              color: '#0284C7',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'SF Pro Display',
            }}
          >
            {t('skipThisQuestionAndGoToNextQuestion')}
          </Typography>
          <Typography
            sx={{
              color: '#0A0A0A',
              fontSize: '14px',
              fontWeight: 400,
              fontFamily: 'SF Pro Display',
            }}
          >
            {t('skipQuestionAlertMessage')}
          </Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              flexDirection: 'row',
            }}
          >
            <Button
              onClick={() => {
                handleModal2ButtonClicked(1)
                handleNextQuestionClose()
              }}
              sx={{
                padding: '10px 70px',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'none',
                background: modalStayQuestionClicked ? '#0284C7' : '#FFFFFF',
                borderRadius: '8px',
                border: modalStayQuestionClicked ? '' : '1px solid #000000',
                color: modalStayQuestionClicked ? '#FFFFFF' : '#000000',
                '&:hover': {
                  background: modalStayQuestionClicked ? '#0284C7' : '#FFFFFF',
                },
              }}
            >
              {t('noStayThisQuestion')}
            </Button>
            <Button
              onClick={() => {
                handleModal2ButtonClicked(2)
                submitCode()
                resetTimer()
                handleNextQuestion()
                handleNextQuestionClose()
              }}
              sx={{
                padding: '10px 70px',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'none',
                background: modalSkipClicked ? '#0284C7' : '#FFFFFF',
                borderRadius: '8px',
                border: modalSkipClicked ? '' : '1px solid #000000',
                color: modalSkipClicked ? '#FFFFFF' : '#000000',
                '&:hover': {
                  background: modalSkipClicked ? '#0284C7' : '#FFFFFF',
                },
              }}
            >
              {t('yesSkip')}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default CodingSection
