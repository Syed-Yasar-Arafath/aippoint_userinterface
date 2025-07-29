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
  const organisation = localStorage.getItem('organisation')
  const selectedLanguage: any = localStorage.getItem('i18nextLng')
  const { t } = useTranslation();
  const currentLanguage = selectedLanguage === 'ar' ? 'Arabic' : 'English'
  const [openDialog, setOpenDialog] = useState(false)
  const [initialConditionMet, setInitialConditionMet] = useState(false)
  const [liveParticipant, setLiveParticipant] = useState<number>(0)
  const [timeLimit, setTimeLimit] = useState(300)
  const [meeting, initMeeting] = useDyteClient()
  const location = useLocation()
  const { authToken, meetingId, objId } = location.state || {}
  const { warning, violations } = useProctoring(objId)
  const [open, setOpen] = useState(false)
  const [recordingId, setRecordingId] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [codingQuestions, setCodingQuestions] = useState([])
  const [language, setLanguage] = useState<string>('java')
  const [code, setCode] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<number>(10 * 60)
  const [enableTimeLeft, setEnableTimeLeft] = useState(false)
  const [submitClicked, setSubmitClicked] = useState(false)
  const [nextQuestionClicked, setNextQuestionClicked] = useState(false)
  const [modalSubmitClicked, setModalSubmitClicked] = useState(false)
  const [modalContinueTestClicked, setModalContinueTestClicked] = useState(false)
  const [modalStayQuestionClicked, setModalStayQuestionClicked] = useState(false)
  const [modalSkipClicked, setModalSkipClicked] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const hasFetched = useRef(false)
  const id = objId

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
    if (!recordingId) return
    try {
      await axios.put(
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

  const handleProcessVideo = async () => {

  const maxRetries = 10; // Maximum number of retries

  const retryInterval = 3000; // Wait 3 seconds between retries
 
  try {

    let attempts = 0;

    let downloadUrl = null;
 
    // Polling loop to check for download_url

    while (attempts < maxRetries) {

      const response = await axios.get(

        `https://api.dyte.io/v2/recordings/${recordingId}`,

        {

          auth: {

            username: '955e223b-76a8-4c24-a9c6-ecbfea717290',

            password: '26425221301ce90b9244',

          },

        }

      );
 
      downloadUrl = response.data.data.download_url;
 
      if (downloadUrl) {

        console.log(`Download URL available: ${downloadUrl}`);

        break; // Exit the loop if download_url is available

      }
 
      console.log(`Download URL not available yet, retrying (${attempts + 1}/${maxRetries})...`);

      attempts++;

      await new Promise((resolve) => setTimeout(resolve, retryInterval)); // Wait before retrying

    }
 
    if (!downloadUrl) {

      console.error('No download URL available after maximum retries');

      return;

    }
 
    // Proceed with processing the video

    const recordingEntity = {

      outputFileName: downloadUrl,

      meetingid: objId,

      sessionId: `question_${currentQuestionIndex + 1}.mp4`,

    };
 
    await axios.post(

      `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/recording/write/${organisation}`,

      recordingEntity

    );
 
    await axios.post(

      `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/process_video/`,

      {

        video_url: downloadUrl,

        meeting_id: meetingId,

        object_id: objId,

        question_index: currentQuestionIndex,

      },

      {

        headers: { 'Content-Type': 'application/json', Organization: organisation },

      }

    );
 
    console.log(`Processed video for question ${currentQuestionIndex + 1}`);

  } catch (error) {

    console.error('Error processing video:', error);

  }

};
 
  const handleRecordingSubmit = async () => {
    try {
      await stopRecording();

    console.log('Recording stopped...');

    await new Promise((resolve) => setTimeout(resolve, 3000)); // Existing delay

    await handleProcessVideo(); 
      console.log('Video processed...')
      if (currentQuestionIndex < codingQuestions.length - 1) {
        await startRecording()
        console.log('New recording started...')
      }
    } catch (error) {
      console.error('Error in handleRecordingSubmit:', error)
    }
  }

  useEffect(() => {
    if (warning) {
      setOpen(true)
    }
  }, [warning])

  useEffect(() => {
    const setupMeeting = async () => {
      if (!authToken) {
        console.error('Missing authToken')
        return
      }
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
  }, [authToken])

  useEffect(() => {
    const timer = setTimeout(() => {
      meeting?.self?.enableVideo()
      meeting?.self?.enableAudio()
    }, 1000)
    return () => clearTimeout(timer)
  }, [meeting])

  useEffect(() => {
    if (initialConditionMet && authToken && !recordingId) {
      startRecording()
    }
  }, [initialConditionMet, authToken, recordingId])

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
      if (error.response?.status === 404 || error.response?.data.error?.code === 404) {
        setLiveParticipant(0)
      }
    }
  }

  const initialCode = {
    javascript: '// JavaScript\nfunction main() {\n\tconsole.log("Hello World");\n}\n\nmain();\n',
    python: '# Python\ndef main():\n\tprint("Hello World")\n\nmain()\n',
    java: '// Java\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n',
    c: '// C\n#include <stdio.h>\nint main() {\n\tprintf("Hello World\\n");\n\treturn 0;\n}\n',
    cpp: '// C++\n#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Hello World" << endl;\n\treturn 0;\n}\n',
    csharp: '// C#\nusing System;\n\nclass Program {\n\tstatic void Main() {\n\t\tConsole.WriteLine("Hello World");\n\t}\n}\n',
    php: '// PHP\n<?php\necho "Hello World";\n?>\n',
    ruby: '# Ruby\ndef main\n\tputs "Hello World"\nend\n\nmain\n',
    swift: '// Swift\nimport Foundation\n\nfunc main() {\n\tprint("Hello World")\n}\n\nmain()\n',
    kotlin: '// Kotlin\nfun main() {\n\tprintln("Hello World")\n}\n',
    rust: '// Rust\nfn main() {\n\tprintln!("Hello World");\n}\n',
    go: '// Go\npackage main\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello World")\n}\n',
    typescript: '// TypeScript\nfunction main(): void {\n\tconsole.log("Hello World");\n}\n\nmain();\n',
    dart: '// Dart\nvoid main() {\n\tprint("Hello World");\n}\n',
  }

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '')
  }

  const submitCode = async () => {
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
      await handleRecordingSubmit()
      await handleQuestionAnalysis()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
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

  const resetTimer = () => {
    setTimeLeft(10 * 60)
    setEnableTimeLeft(false)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const preventPaste = (e: ClipboardEvent) => {
    e.preventDefault()
    alert(t('pastingIsDisabled'))
  }

  const preventCopyCut = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
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

  const handleInterviewStatus = async (objectId: string, organisation: any) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/interview_status/`,
        {
          object_id: objectId,
          interview_status: "completed",
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Organization: organisation,
          },
        }
      )
      console.log(response.data.message)
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const generatefeedback = async () => {
    try {
      const formData = new FormData()
      formData.append('object_id', id)
      formData.append('language_selected', currentLanguage)
      await axios.post(
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
      console.error('Error generating feedback:', error)
    }
  }

  const handleQuestionAnalysis = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/analyze_questions_coding/`,
        {
          object_id: id,
          language_selected: currentLanguage,
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
      console.error('Error analyzing questions:', error)
    }
  }

  const handleNextQuestion = async () => {
    if (!initialConditionMet) {
      console.log('Condition not met, skipping function execution.')
      return
    }
    if (currentQuestionIndex === codingQuestions.length - 1) {
      try {
        await handleRecordingSubmit()
        await Promise.all([
          generatefeedback(),
          handleQuestionAnalysis(),
          SendThankYouMail(),
          handleInterviewStatus(objId, organisation),
        ])
        if (meeting) {
          meeting.self.disableAudio()
          meeting.self.disableVideo()
        }
        navigate('/coding_submit')
      } catch (error) {
        console.error('Error during final question processing:', error)
      }
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
      setCode('')
      resetTimer()
    }
  }

  const handleExit = async () => {
    if (recordingId) {
      await handleRecordingSubmit()
    }
    try {
      await axios.post(
        `https://api.dyte.io/v2/meetings/${meetingId}/active-session/kick-all`,
        null,
        {
          auth: {
            username: '955e223b-76a8-4c24-a9c6-ecbfea717290',
            password: '26425221301ce90b9244',
          },
        },
      )
      if (meeting) {
        meeting.self.disableAudio()
        meeting.self.disableVideo()
      }
      await Promise.all([
        generatefeedback(),
        handleQuestionAnalysis(),
        SendThankYouMail(),
        handleInterviewStatus(objId, organisation),
      ])
      navigate('/coding_submit')
    } catch (error) {
      console.error('Error kicking session:', error)
    }
  }

  const handleSubmit = async () => {
    try {
      dispatch(loaderOn())
      await handleRecordingSubmit()
      if (currentQuestionIndex === codingQuestions.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        await Promise.all([
          generatefeedback(),
          handleQuestionAnalysis(),
          SendThankYouMail(),
          handleInterviewStatus(objId, organisation),
        ])
        if (meeting) {
          meeting.self.disableAudio()
          meeting.self.disableVideo()
        }
        navigate('/coding_submit')
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
        setCode('')
        resetTimer()
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      setOpenDialog(true)
    } finally {
      dispatch(loaderOff())
    }
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

  useEffect(() => {
    if (!id || hasFetched.current) return
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_interview_data/`,
          { object_id: objId },
          {
            headers: {
              'Content-Type': 'application/json',
              organization: organisation,
            },
          },
        )
        const codingQuestions = response.data.data.questions.map(
          (que: any) => que.problem_statement,
        )
        setCodingQuestions(codingQuestions)
        hasFetched.current = true
      } catch (error) {
        console.error('Failed to fetch interview data:', error)
      }
    }
    fetchData()
  }, [id, objId])

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

  const SendThankYouMail = async () => {
    if (!meetingId) {
      alert(t('pleaseProvideValidMeetingId'))
      return
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/interview/Thankingmailcoding/${organisation}`,
        { meetingId },
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

  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPopState = () => {
      window.history.pushState(null, '', window.location.href)
    }
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  const convertNumberToArabic = (num: number | string, selectedLanguage: any) => {
    if (selectedLanguage === 'ar') {
      return num.toLocaleString('ar-EG')
    }
    return num
  }

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
            <Box
              sx={{
                background: '#263D4A',
                backdropFilter: 'blur(12px)',
                marginTop: '10px',
                width: '100%',
                borderRadius: '8px',
                padding: '11px 6px',
                maxHeight: { xs: '150px', sm: '200px', md: '250px' },
                overflowY: 'auto',
                wordBreak: 'break-word',
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
                      {convertNumberToArabic(
                        formatTime(timeLeft),
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
          </DyteUiProvider>
        </Grid>
        {initialConditionMet && (
          <Grid item lg={8} sx={{}}>
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
                  background: '#0284C7',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  '&:hover': {
                    background: '#0284C7',
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
                {convertNumberToArabic(
                  formatTime(timeLeft),
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
              {initialConditionMet
                ? convertNumberToArabic(
                    formatTime(timeLeft),
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
                handleSubmit()
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
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="warning"
          sx={{ width: '100%' }}
        >
          {warning}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default CodingSection