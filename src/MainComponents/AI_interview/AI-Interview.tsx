import React, { useEffect, useRef, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import { DyteMeeting } from '@dytesdk/react-ui-kit'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VideocamIcon from '@mui/icons-material/Videocam'
import CodeIcon from '@mui/icons-material/Code'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import CircularProgress from '@mui/material/CircularProgress'
import {
  DyteUiProvider,
  DyteGrid,
  DyteMicToggle,
  DyteCameraToggle,
  DyteLeaveButton,
} from '@dytesdk/react-ui-kit'
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core'
import MicIcon from '@mui/icons-material/Mic'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextareaAutosize,
  FormControlLabel,
  Typography,
  Switch,
  IconButton,
  Modal,
} from '@mui/material'
import axios, { AxiosResponse } from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { t } from 'i18next'
import { Snackbar, Alert } from '@mui/material'
import useProctoring from '../useProctoring'
import { useDispatch } from 'react-redux'
import { loaderOff, loaderOn } from '../../redux/actions'
import { useTranslation } from 'react-i18next';
import { OutputOutlined } from '@mui/icons-material'
interface MergeVideoRequest {
  video_urls: string[]
  meeting_id: string
  object_id?: string
}

interface MergeVideoResponse {
  message: string
}

export default function InterviewAttend() {
  const location = useLocation()
  const { authToken, meetingId, objId } = location.state || {}
  const selectedLanguage: any = localStorage.getItem('i18nextLng')

  const currentLanguage = selectedLanguage === 'ar' ? 'Arabic' : 'English'
  console.log(currentLanguage)

  const [meeting, initMeeting] = useDyteClient()
  const organisation = localStorage.getItem('organisation')
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)
  const [isEnable, setIsEnable] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLimit, setTimeLimit] = useState(300)
  const [showPopup, setShowPopup] = useState(false)
  const [recordingId, setRecordingId] = useState<string | null>(null)
  const [liveParticipant, setLiveParticipant] = useState<number>(0)
  const [questions, setQuestions] = useState([])
  const [questionGenerated, setQuestionGenerated] = useState<string[]>([])
  const [questionsSubmitted, setQuestionsSubmitted] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)
  const [nextClicked, setNextClicked] = useState(false)
  const [initialConditionMet, setInitialConditionMet] = useState(false)
  const [candidateName, setCandidateName] = useState('')
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null)
  const [readQuestions, setReadQuestions] = useState(new Set())
  let speechInstance: SpeechSynthesisUtterance | null = null
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isReadingQuestion, setIsReadingQuestion] = useState(false)
  const { warning, violations } = useProctoring(objId)
  const [open, setOpen] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [code, setCode] = useState('')
  const language = 'javascript'
  const [openVideoModal, setOpenVideoModal] = useState(false)
  const [videoUrls, setVideoUrls] = useState<string[]>([])
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null)
  const [transcript, setTranscript] = useState<string>('')
  const [interimTranscript, setInterimTranscript] = useState<string>('')
  const [showDialog, setShowDialog] = useState(false)
  const [isCheckedInstruction, setIsCheckedInstruction] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(300)
  const [hasTriggeredNext, setHasTriggeredNext] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { t } = useTranslation();

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked1(event.target.checked)
  }

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked2(event.target.checked)
  }

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnable(event.target.checked)
    setIsCheckedInstruction(event.target.checked)
  }

  const handleEditorChange = (value: any) => {
    setCode(value)
  }

  const loadVoices = () => {
    const availableVoices = window.speechSynthesis.getVoices()
    setVoices(availableVoices)
  }

  useEffect(() => {
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
    loadVoices()
  }, [])

  const dispatch = useDispatch()

  const speak = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text)
    const femaleVoice =
      voices.find((voice) => voice.name.toLowerCase().includes('female')) ||
      voices.find((voice) => voice.name.toLowerCase().includes('woman')) ||
      voices[0]
    speech.voice = femaleVoice
    speech.onstart = () => {
      setIsReadingQuestion(true)
      if (videoRef) videoRef.play()
    }
    speech.onend = () => {
      setIsReadingQuestion(false)
      if (videoRef) videoRef.pause()
    }
    window.speechSynthesis.speak(speech)
  }

  const sanitizeText = (text: string): string => {
    return text.replace(/[`"'“”]/g, '')
  }

  const readQuestion = (index: number) => {
    if (
      liveParticipant > 0 &&
      !readQuestions.has(index) &&
      questionGenerated[index]
    ) {
      if (speechInstance) {
        window.speechSynthesis.cancel()
        speechInstance = null
      }
      const sanitizedQuestion = sanitizeText(questionGenerated[index])
      speechInstance = new SpeechSynthesisUtterance(sanitizedQuestion)
      speak(sanitizedQuestion)
      setReadQuestions((prev) => new Set([...prev, index]))
    }
  }

  useEffect(() => {
    readQuestion(currentQuestionIndex)
    return () => {
      if (speechInstance) {
        window.speechSynthesis.cancel()
        speechInstance = null
      }
    }
  }, [currentQuestionIndex, liveParticipant])

  const handleMergeVideos = async (objectId: string): Promise<File | null> => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/recording/meeting/${objectId}`,
      )

      if (Array.isArray(response.data)) {
        // Extract valid URLs, filter non-empty, and deduplicate
        const urls = [
          ...new Set(
            response.data
              .map((recording: any) => recording.outputFileName)
              .filter((url: string) => url),
          ),
        ]

        if (urls.length > 0) {
          // Call the merge API with the collected video URLs
          const mergeResponse = await axios.post(
            `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/merge_videos/`, // Update with actual backend URL
            { video_urls: urls },
            { responseType: 'blob' }, // To handle binary data
          )

          if (mergeResponse.status === 200) {
            const blob = new Blob([mergeResponse.data], { type: 'video/mp4' })
            const mergedVideoFile = new File([blob], 'merged_video.mp4', {
              type: 'video/mp4',
            })

            console.log('Merged video created successfully')
            return mergedVideoFile
          }
        } else {
          console.error('No valid video URLs found')
        }
      } else {
        console.error('Unexpected data format:', response.data)
      }
    } catch (error) {
      console.error('Error fetching recordings or merging videos:', error)
    }

    return null // Return null if the process fails
  }


  const handleProctoring = async (objectId?: string): Promise<File | null> => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/recording/meeting/${objId}/${organisation}`,
      )
      if (Array.isArray(response.data)) {
        const videoUrls = [
          ...new Set(
            response.data
              .map((recording: any) => recording.outputFileName)
              .filter((url: string) => url),
          ),
        ]
        if (videoUrls.length === 0) return null
        const requestData: MergeVideoRequest = {
          video_urls: videoUrls,
          meeting_id: objId,
        }
        if (objectId) requestData.object_id = objId
        const mergeResponse = await axios.post<MergeVideoResponse>(
          `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/merge_videos/`,
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
              Organization: organisation,
            },
          },
        )
        if (mergeResponse.status === 202) {
          console.log('Video processing queued:', mergeResponse.data.message)
          return null
        }
      }
      return null
    } catch (error) {
      console.error('Error in proctoring:', error)
      return null
    }
  }

  const analyzeVoice = async (file: File) => {
    try {
      if (!file) return
      const formData = new FormData()
      formData.append('video_file', file)
      const response = await axios.post(
        'https://aippoint.ai/aippoint-django-proctoring/voice_analysis/',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error('Error during voice analysis:', error)
    }
  }

  const saveFaceAnalysisResult = async (objectId: any, analysisResult: any) => {
    try {
      if (!objectId || !analysisResult) return
      const payload = { object_id: objectId, analysis_result: analysisResult }
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/save_multiple_face_analysis/`,
        payload,
        { headers: { 'Content-Type': 'application/json' } },
      )
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error('Error saving face analysis:', error)
    }
  }

  const multipleFaceDetection = async (file: File) => {
    try {
      if (!file) return
      const formData = new FormData()
      formData.append('video_file', file)
      const response = await axios.post(
        'https://aippoint.ai/aippoint-django-proctoring/multiple-faces-detection/',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error('Error during face detection:', error)
    }
  }

  const saveEyeGazeAnalysis = async (objectId: any, analysisResult: any) => {
    try {
      const payload = { object_id: objectId, analysis_result: analysisResult }
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/save_eye_tracking_results/`,
        payload,
        { headers: { 'Content-Type': 'application/json' } },
      )
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error('Error saving eye gaze analysis:', error)
    }
  }

  const saveVoiceAnalysis = async (objectId: any, analysisResult: any) => {
    try {
      const payload = { object_id: objectId, analysis_result: analysisResult }
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/save_voice_analysis_results/`,
        payload,
        { headers: { 'Content-Type': 'application/json' } },
      )
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error('Error saving voice analysis:', error)
    }
  }

  const saveNoiseDetectionResult = async (
    objectId: any,
    noiseDetectionResult: any,
  ) => {
    try {
      const payload = {
        object_id: objectId,
        analysis_result: noiseDetectionResult,
      }
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/save_noise_detection_results/`,
        payload,
        { headers: { 'Content-Type': 'application/json' } },
      )
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error('Error saving noise detection:', error)
    }
  }

  const saveWarningCount = async (count: number) => {
    try {
      const payload = { object_id: objId, warning_count: count }
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/warning_message_count/`,
        payload,
        { headers: { 'Content-Type': 'application/json' } },
      )
    } catch (error) {
      console.error('Error saving warning count:', error)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    disableOtherTabsAndOptions()
    return () => {
      document.body.style.overflow = 'unset'
      enableOtherTabsAndOptions()
    }
  }, [])

  const disableOtherTabsAndOptions = () => {
    const navLinks = document.querySelectorAll('nav a')
    navLinks.forEach((link) => {
      const anchor = link as HTMLAnchorElement
      anchor.style.pointerEvents = 'none'
      anchor.setAttribute('aria-disabled', 'true')
      anchor.setAttribute('tabindex', '-1')
    })
    const buttons = document.querySelectorAll('button')
    buttons.forEach((button) => {
      const btn = button as HTMLButtonElement
      btn.disabled = true
      btn.style.pointerEvents = 'none'
    })
  }

  const enableOtherTabsAndOptions = () => {
    const navLinks = document.querySelectorAll('nav a')
    navLinks.forEach((link) => {
      const anchor = link as HTMLAnchorElement
      anchor.style.pointerEvents = 'auto'
      anchor.removeAttribute('aria-disabled')
      anchor.removeAttribute('tabindex')
    })
    const buttons = document.querySelectorAll('button')
    buttons.forEach((button) => {
      const btn = button as HTMLButtonElement
      btn.disabled = false
      btn.style.pointerEvents = 'auto'
    })
  }

  useEffect(() => {
    if (warning) setOpen(true)
  }, [warning])

  const handlefetchrecording = async (objectId: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/recording/meeting/${objectId}`,
      )
      if (Array.isArray(response.data)) {
        const urls = [
          ...new Set(
            response.data
              .map((recording: any) => recording.outputFileName)
              .filter((url: string) => url),
          ),
        ]
        setVideoUrls(urls.length > 0 ? urls : [])
      }
      setOpenVideoModal(true)
    } catch (error) {
      console.error('Error fetching recordings:', error)
      setVideoUrls([])
      setOpenVideoModal(true)
    }
  }

  const handlePostVideoUrls = async (videoUrls: any[]) => {
    try {
      if (videoUrls.length === 0) return
      const payload = { videoUrls }
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/mergevideo`,
        payload,
      )
      if (response.status === 200) {
        console.log('Videos merged successfully:', response.data)
      }
    } catch (error) {
      console.error('Error posting video URLs:', error)
    }
  }

  const noiseDetection = async (file: File) => {
    try {
      if (!file) return
      const formData = new FormData()
      formData.append('video_file', file)
      const response = await axios.post(
        'https://aippoint.ai/aippoint-django-proctoring/noise_analysis/',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error('Error during noise detection:', error)
    }
  }

  const postureDetection = async (file: File) => {
    try {
      if (!file) return
      const formData = new FormData()
      formData.append('video_file', file)
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/posture-detection/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      console.error('Error during posture detection:', error)
    }
  }

  // const generateQuestions = async () => {
  //   try {
  //     const params = new URLSearchParams()
  //     params.append('object_id', objId)
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_interview_data/`,
  //       params,
  //       {
  //         headers: {
  //           'Content-Type': 'application/x-www-form-urlencoded',
  //           organization: organisation,
  //         },
  //       },
  //     )
  //     const responseData = response.data.data.questions
  //     const candidatename = response.data.data.resume_data.name
  //     setQuestions(responseData)
  //     setCandidateName(candidatename)
  //     const concatenatedQuestions: string[] = []
  //     if (Array.isArray(responseData)) {
  //       responseData.forEach((questionObj) => {
  //         concatenatedQuestions.push(questionObj.question)
  //       })
  //       setQuestionGenerated(concatenatedQuestions)
  //     }
  //   } catch (error) {
  //     console.error('Error fetching questions:', error)
  //   }
  // }
  const generateQuestions = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_interview_data/`,
        { object_id: objId }, // Send JSON
        {
          headers: {
            'Content-Type': 'application/json',
            organization: organisation,
          },
        },
      );
      const responseData = response.data.data.questions;
      const candidatename = response.data.data.resume_data.name;
      setQuestions(responseData);
      setCandidateName(candidatename);
      const concatenatedQuestions = responseData.map((questionObj: any) => questionObj.question);
      setQuestionGenerated(concatenatedQuestions);
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      if (error.response) {
        console.log('Error response:', error.response.data); // Log the server error message
      }
    }
  };
  useEffect(() => {
    generateQuestions()
  }, [objId])

  useEffect(() => {
    setShowPopup(true)
  }, [])

  // useEffect(() => {
  //   if (liveParticipant > 0 && !isReadingQuestion) {
  //     const SpeechRecognition =
  //       (window as any).SpeechRecognition ||
  //       (window as any).webkitSpeechRecognition
  //     if (!SpeechRecognition) {
  //       console.error('Speech Recognition not supported')
  //       return
  //     }
  //     const mic = new SpeechRecognition()
  //     mic.continuous = true
  //     mic.interimResults = true
  //     mic.lang = 'en-US'
  //     mic.onresult = (event: any) => {
  //       let interim = ''
  //       let final = ''
  //       for (let i = 0; i < event.results.length; i++) {
  //         const result = event.results[i]
  //         const transcriptPart = result[0].transcript
  //         if (result.isFinal) {
  //           final += transcriptPart + ' '
  //         } else {
  //           interim += transcriptPart
  //         }
  //       }
  //       // if (!isReadingQuestion) {
  //       setTranscript(final)
  //       setInterimTranscript(interim)
  //       // }
  //     }
  //     mic.start()
  //     return () => mic.stop()
  //   }
  // }, [liveParticipant, currentQuestionIndex, isReadingQuestion])
  useEffect(() => {
    if (liveParticipant > 0 && !isReadingQuestion) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error('Speech Recognition not supported');
        setTranscript('Speech recognition not supported');
        return;
      }
      const mic = new SpeechRecognition();
      mic.continuous = true;
      mic.interimResults = true;
      mic.lang = selectedLanguage === 'ar' ? 'ar-EG' : 'en-US';
      mic.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptPart = result[0].transcript;
          if (result.isFinal) {
            final += transcriptPart + ' ';
          } else {
            interim += transcriptPart;
          }
        }
        console.log('Speech Recognition - Final:', final, 'Interim:', interim);
        setTranscript(final);
        setInterimTranscript(interim);
      };
      mic.onerror = (event: any) => {
        console.error('Speech Recognition error:', event.error);
        setTranscript('Error in speech recognition');
      };
      mic.start();
      return () => mic.stop();
    }
  }, [liveParticipant, currentQuestionIndex, isReadingQuestion, selectedLanguage]);
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
      if (
        error.response?.status === 404 ||
        error.response?.data.error?.code === 404
      ) {
        setLiveParticipant(0)
      }
    }
  }

  useEffect(() => {
    if (meetingId) checkSessionStatus()
  }, [meetingId])

  useEffect(() => {
    if (
      currentQuestionIndex === questions.length - 1 &&
      liveParticipant === 0
    ) {
      setShowDialog(true)
    }
  }, [currentQuestionIndex, liveParticipant])

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleNextQuestion = async () => {
    if (nextClicked) {
      console.log('Next button already clicked, skipping...');
      return;
    }
    setNextClicked(true);
    try {
      console.log('Starting handleNextQuestion for question index:', currentQuestionIndex);
      if (currentQuestionIndex === 0 && liveParticipant === 0) {
        await checkSessionStatus();
        setShowDialog(true);
        return;
      }
      if (liveParticipant > 0) {
        setShowDialog(false);
      }
      if (currentQuestionIndex >= 1 && liveParticipant === 0) {
        await checkSessionStatus();
        setShowDialog(true);
        return;
      }
      if (currentQuestionIndex < questionGenerated.length - 1) {
        if (recordingId) {
          console.log('Stopping recording:', recordingId);
          await stopRecording();
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log('Downloading recording');
          await handleDownloadRecording();
          setRecordingId(null);
        }
        setCode('');
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(300);
        setTranscript('');
        setInterimTranscript('');
        console.log('Starting new recording');
        await startRecording();
      }
    } catch (error) {
      console.error('Error handling next question:', error);
    } finally {
      setNextClicked(false);
      console.log('Finished handleNextQuestion');
    }
  };

  const SendThankYouMail = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/interview/Thankingmail/${organisation}`,
        { meetingId },
        { headers: { 'Content-Type': 'application/json' } },
      )
    } catch (error) {
      console.error('Error sending thank-you email:', error)
    }
  }
  // const handleQuestionDistribution = async (
  //   objId: any,
  //   organisation: any,
  // ): Promise<any | null> => {
  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/question_distribution/`,
  //       {
  //         object_id: objId,
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Organization: organisation,
  //         },
  //       }
  //     )

  //     if (response.status === 200) {
  //       console.log('✅ Question distribution completed:', response.data)
  //       return response.data
  //     } else {
  //       console.warn('⚠️ Unexpected response:', response)
  //       return null
  //     }
  //   } catch (error: any) {
  //     if (error.response) {
  //       console.error('❌ Server error:', error.response.data)
  //     } else if (error.request) {
  //       console.error('❌ No response received:', error.request)
  //     } else {
  //       console.error('❌ Request setup error:', error.message)
  //     }
  //     return null
  //   }
  // }
  // const handleInterviewStatus = async (
  //   objId: string,
  //   organisation: any
  // ): Promise<{ object_id: string; updated_status: string } | null> => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/interview_status/${objId}/`,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Organization: organisation,
  //         },
  //       }
  //     )
  //     console.log('✅ Interview status updated:', response.data)
  //     return response.data
  //   } catch (error: any) {
  //     if (error.response) {
  //       console.error('❌ Server error:', error.response.data)
  //     } else if (error.request) {
  //       console.error('❌ No response received:', error.request)
  //     } else {
  //       console.error('❌ Request setup error:', error.message)
  //     }
  //     return null
  //   }
  // }
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
    );
    console.log(response.data.message);
  } catch (error) {
    console.error('Failed to update status:', error);
  }
};

  const handleSubmit = async () => {
    try {
      dispatch(loaderOn());
      if (liveParticipant >= 0 && recordingId) {
        // Ensure the last answer is saved
        const codeInput = code.trim();
        const voiceInput = transcript + interimTranscript;
        const finalAnswer = codeInput !== '' ? codeInput : voiceInput;
        console.log('handleSubmit - Saving last answer:', finalAnswer);
        await updateanswer(
          objId,
          questionGenerated[currentQuestionIndex],
          finalAnswer || 'No answer provided',
        );

        console.log('Stopping recording in handleSubmit');
        await stopRecording();
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Downloading recording in handleSubmit');
        await handleDownloadRecording();
        setQuestionsSubmitted(true);

        await Promise.all([
          generatefeedback(),
          handleQuestionAnalysis(),
          handleSoftSkills(),
          handleStrengths(),
          handleTechnicalScore(),
          handleInterviewStatus(objId, organisation),
          handleBatchInterviewAnalysis(),
          SendThankYouMail(),
          handleProctoring(objId),
        ]);

        setOpenDialog(true);
        dispatch(loaderOff());
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setOpenDialog(true);
      setTimeout(() => {
        navigate('/SubmitInterview');
      }, 1000);
    } finally {
      dispatch(loaderOff());
      setLoading(false)
    }
  };
  // const handleSubmit = async () => {
  //   try {
  //     if (liveParticipant >= 0 && recordingId) {
  //       await stopRecording()
  //       await new Promise((resolve) => setTimeout(resolve, 1500))
  //       await handleDownloadRecording()
  //       setQuestionsSubmitted(true)
  //       setTimeout(() => {
  //         generatefeedback()
  //         handleQuestionAnalysis()
  //         handleSoftSkills()
  //         handleStrengths()
  //         handleTechnicalScore()
  //         SendThankYouMail()
  //         handleProctoring(objId)
  //         setOpenDialog(true)
  //       }, 1000)
  //     }
  //   } catch (error) {
  //     console.error('Error submitting questions:', error)
  //   }
  // }

  const updateanswer = async (
    reference_number: any,
    question_text: any,
    answer: any,
  ) => {
    try {
      const data = {
        object_id: reference_number,
        question_text: question_text,
        answer: answer || 'No answer provided',
      };
      console.log('Calling update_answer API with:', data);

      const axiosPromise = axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/update_answer/`,
        data,
        { headers: { organization: organisation } }
      );

      const response = await Promise.race([
        axiosPromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('API timeout')), 5000)
        ),
      ]) as AxiosResponse<any>; // 👈 Cast the response type here

      console.log('update_answer response:', response.data);
      setTranscript('');
      setInterimTranscript('');
      return response.data;

    } catch (error: any) {
      console.error('Error updating answer:', error.response?.data || error.message);
      throw error;
    }
  };


  const sendOrg = async (dbName: any) => {
    try {
      await axios.get(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get-organization-name/`,
        { headers: { Organization: dbName } },
      )
    } catch (error: any) {
      console.error(
        'Error:',
        error.response ? error.response.data : error.message,
      )
    }
  }

  useEffect(() => {
    sendOrg(organisation)
  }, [])

  const generatefeedback = async () => {
    try {
      const formData = new FormData()
      formData.append('object_id', objId)
      formData.append('language_selected', selectedLanguage)
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/generate_feedback/`,
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
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/analyze_questions/`,
        {
          object_id: objId,
          language_selected: localStorage.getItem('i18nextLng'),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            organization: organisation,
          },
        },
      )
    } catch (error) {
      console.error('Error analyzing questions:', error)
    }
  }

  const handleBatchInterviewAnalysis = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/batch_process_interview_analysis/`,
        {
          object_id: objId,
          language_selected: localStorage.getItem('i18nextLng'),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            organization: organisation,
          },
        },
      )

      console.log('Batch analysis completed:', response.data)
      return response.data
    } catch (error) {
      console.error('Error in batch interview analysis:', error)
      throw error
    }
  }

  const handleSoftSkills = async () => {
    try {
      console.log('Calling extract_soft_skills with:', {
        object_id: objId,
        language_selected: localStorage.getItem('i18nextLng'),
        organization: organisation,
        url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract_soft_skills/`,
      })
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract_soft_skills/`,
        {
          object_id: objId,
          language_selected: localStorage.getItem('i18nextLng'),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            organization: organisation,
          },
        },
      )
      console.log('Soft skills response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error extracting soft skills:', {
        // message: error.message,
        // response: error.response?.data,
        // status: error.response?.status,
      })
      throw error // Rethrow to allow Promise.all to catch it
    }
  }
  const handleStrengths = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract_strengths_areas/`,
        {
          object_id: objId,
          language_selected: localStorage.getItem('i18nextLng'),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            organization: organisation,
          },
        },
      )
    } catch (error) {
      console.error('Error extracting strengths:', error)
    }
  }

  const handleTechnicalScore = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract-techskills-scores/`,
        {
          object_id: objId,
          language_selected: localStorage.getItem('i18nextLng'),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            organization: organisation,
          },
        },
      )
    } catch (error) {
      console.error('Error extracting technical scores:', error)
    }
  }

  const handleExit = async () => {
    if (recordingId) {
      await stopRecording()
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await handleDownloadRecording()
    }
    setOpenDialog(true)
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
      setTimeout(() => {
        navigate('/SubmitInterview')
      }, 1000)
    } catch (error) {
      console.error('Error kicking session:', error)
    } finally {
      dispatch(loaderOff());
      setLoading(false)
    }
  }

  const handleClick = async () => {
    if (!questionGenerated[currentQuestionIndex]) {
      console.error('Invalid question at index:', currentQuestionIndex);
      return;
    }
    const codeInput = code.trim();
    const voiceInput = transcript + interimTranscript;
    const finalAnswer = codeInput !== '' ? codeInput : voiceInput;
    console.log('handleClick - finalAnswer:', finalAnswer, 'codeInput:', codeInput, 'voiceInput:', voiceInput);

    // Always call updateanswer, even if no answer is provided
    await updateanswer(
      objId,
      questionGenerated[currentQuestionIndex],
      finalAnswer || 'No answer provided',
    );

    if (currentQuestionIndex === questionGenerated.length - 1) {
      await handleSubmit();
    } else {
      await handleNextQuestion();
    }
  };

  const startRecording = async () => {
    // Feathers (https://feathersjs.com/) recommends adding a delay to ensure the recording starts properly
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
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Add delay
      setRecordingId(response.data.data.id)
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
      console.log(`Stopped recording with ID: ${recordingId}`)
    } catch (error) {
      console.error('Error stopping recording:', error)
    }
  }

  const handleDownloadRecording = async () => {
    if (!recordingId) return
    try {
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
      if (!url) {
        console.error('No download URL available')
        return
      }
      const recordingEntity = {
        outputFileName: url,
        meetingid: objId,
        sessionId: `question_${currentQuestionIndex + 1}.mp4`,
      }
      await axios.post(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/recording/write/${organisation}`,
        recordingEntity,
      )
      console.log(
        `Recording written to backend: question_${currentQuestionIndex + 1
        }.mp4`,
      )
      setUserProfileImage(url)
    } catch (error) {
      console.error('Error downloading recording:', error)
    }
  }

  useEffect(() => {
    const setupMeeting = async () => {
      if (!authToken) {
        console.error('Missing authToken')
        setLoading(false)
        return
      }
      try {
        await initMeeting({
          authToken,
          defaults: { audio: true, video: true },
        })
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error('Failed to initialize Dyte meeting:', error)
      }finally{
        dispatch(loaderOff())
        setLoading(false)
      }
    }
    setupMeeting()
  }, [authToken])

  useEffect(() => {
    if (initialConditionMet && authToken && !recordingId) {
      startRecording()
    }
  }, [initialConditionMet, authToken])

  const handleClosePopup = () => {
    setShowPopup(false)
    setShowQuestions(true)
  }

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

  const convertNumberToArabic = (num: number, selectedLanguage: any) => {
    if (selectedLanguage === 'ar') {
      return num.toLocaleString('ar-EG')
    }
    return num
  }

  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPopState = () => {
      window.history.pushState(null, '', window.location.href)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    handleClosePopup()
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  useEffect(() => {
    if (timeLeft <= 0 && !hasTriggeredNext) {
      handleNextQuestion()
      setHasTriggeredNext(true)
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, hasTriggeredNext])

  useEffect(() => {
    setTimeLeft(300)
    setHasTriggeredNext(false)
  }, [currentQuestionIndex])

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('meetingid', meetingId)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/LiveUpload/upload/${organisation}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      console.log('Upload successful:', response.data)
      alert(t('fileUploadSuccessfully'))
    } catch (error: any) {
      console.error('Upload failed:', error)
      alert(t('uploadFailed'))
    }
  }

  const handleVolumeUp = () => {
    if (audioRef.current) {
      const currentVolume = audioRef.current.volume
      const newVolume = Math.min(currentVolume + 0.1, 1)
      audioRef.current.volume = newVolume
      console.log('Volume:', newVolume)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showEditor &&
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        setShowEditor(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showEditor])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        padding: '20px',
        overflow: 'auto',
      }}
    >
      {loading ? (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress size={50} style={{ color: '#0284C7' }} />
        </div>
      ) : (
        <Grid container spacing={2}>
          <Grid
            item
            lg={9}
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
              alignItems: 'center',
            }}
          >
            <DyteUiProvider meeting={meeting}>
              <DyteGrid
                meeting={meeting}
                style={{
                  width: '100%',
                  height: showEditor ? '60vh' : '100vh',
                }}
              />
            </DyteUiProvider>
            {showEditor && (
              <Box
                ref={editorRef}
                sx={{
                  width: '60%',
                  height: '45vh',
                  bgcolor: 'background.paper',
                  borderRadius: '8px',
                  boxShadow: 24,
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Editor
                  height="100%"
                  width="100%"
                  language={language}
                  value={code}
                  onChange={handleEditorChange}
                  theme="vs-light"
                  options={{
                    fontSize: 16,
                    minimap: { enabled: true },
                    automaticLayout: true,
                    contextmenu: false,
                  }}
                />
              </Box>
            )}
          </Grid>

          <Grid item lg={3} style={{ padding: '30px 10px 5px 10px' }}>
            <video
              ref={(ref) => setVideoRef(ref)}
              width="100%"
              height="auto"
              muted
              style={{
                flex: '0 0 auto',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                zIndex: 1,
                maxHeight: '300px',
                minWidth: '200px',
                width: '100%',
              }}
            >
              <source
                src={`${process.env.PUBLIC_URL}assets/static/images/20240913132119-119 (online-video-cutter.com).mp4`}
                type="video/mp4"
              />
            </video>
            {initialConditionMet && (
              <div
                style={{
                  background: '#263D4A',
                  backdropFilter: 'blur(12px)',
                  marginTop: '10px',
                  width: '100%',
                  height: '250px',
                  borderRadius: '8px',
                  padding: '11px 6px 11px 6px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    style={{
                      fontWeight: 'bold',
                      fontSize: '16px',
                      marginBottom: '10px',
                      color: '#FFFFFF',
                    }}
                  >
                    {t('question')}{' '}
                    {convertNumberToArabic(
                      currentQuestionIndex + 1,
                      selectedLanguage,
                    )}
                  </Typography>
                  <Typography
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      fontFamily: 'SF Pro Display',
                      color: '#0284C7',
                    }}
                  >
                    ⏱ {formatTime(timeLeft)}
                  </Typography>
                </Box>
                {initialConditionMet && (
                  <Typography
                    style={{
                      fontSize: '12px',
                      color: '#FFFFFF',
                      fontFamily: 'Inter',
                      letterSpacing: '0%',
                      fontWeight: 400,
                    }}
                  >
                    {questionGenerated[currentQuestionIndex]}
                    {/* {convertNumberToArabic(
                      parseInt(questionGenerated[currentQuestionIndex]),
                      selectedLanguage,
                    )} */}
                  </Typography>
                )}
              </div>
            )}
            {initialConditionMet && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  padding: '30px 0 20px 0px',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    flexWrap: 'nowrap',
                    width: '100%',
                  }}
                >
                  <IconButton
                    sx={{
                      backgroundColor: '#0284C7',
                      color: '#fff',
                      width: '32px',
                      height: '32px',
                      pointerEvents: 'none',
                      opacity: 0.5,
                    }}
                  >
                    <MicIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      backgroundColor: '#0284C7',
                      color: '#fff',
                      width: '32px',
                      height: '32px',
                      pointerEvents: 'none',
                      opacity: 0.5,
                    }}
                  >
                    <VideocamIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      backgroundColor: '#0284C7',
                      color: '#fff',
                      width: '32px',
                      height: '32px',
                    }}
                    onClick={handleVolumeUp}
                  >
                    <VolumeUpIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      backgroundColor: '#0284C7',
                      color: '#fff',
                      width: '32px',
                      height: '32px',
                    }}
                    onClick={() => setShowEditor(true)}
                  >
                    <CodeIcon />
                  </IconButton>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <IconButton
                    sx={{
                      backgroundColor: '#0284C7',
                      color: '#fff',
                      width: '30px',
                      height: '30px',
                    }}
                    onClick={handleUpload}
                  >
                    <AttachFileIcon />
                  </IconButton>
                </div>
              </div>
            )}
            {initialConditionMet && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'nowrap',
                  width: '100%',
                }}
              >
                <Button
                  style={{
                    borderRadius: '8px',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: '1px solid #fff',
                    padding: '6px 16px',
                    fontWeight: 500,
                    textTransform: 'none',
                    width: '50%',
                  }}
                  onClick={handleClick}
                >
                  {currentQuestionIndex === questionGenerated.length - 1
                    ? t('submitBtn')
                    : t('nextQuestion')}
                </Button>
                <Button
                  style={{
                    borderRadius: '8px',
                    backgroundColor: '#0284C7',
                    color: '#fff',
                    padding: '6px 16px',
                    fontWeight: 500,
                    textTransform: 'none',
                    width: '50%',
                  }}
                  onClick={async () => {
                    await handleSubmit()
                    setOpenDialog(true)
                  }}
                >
                  {t('endInterview')}
                </Button>
              </div>
            )}
          </Grid>

          <Dialog open={showDialog}>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '8px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                maxWidth: '300px',
                textAlign: 'center',
              }}
            >
              <Typography
                style={{
                  color: '#000000',
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}
              >
                {t('attention')}
              </Typography>
              <Typography
                style={{
                  color: '#000000',
                  fontSize: '16px',
                  marginTop: '10px',
                  fontFamily: 'Overpass',
                }}
              >
                {t('beforeAttending')}
              </Typography>
              <div style={{ marginTop: '20px' }}>
                <Button
                  onClick={() => setShowDialog(false)}
                  style={{
                    background: '#4CAF50',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    marginRight: '10px',
                  }}
                >
                  {t('okBtn')}
                </Button>
              </div>
            </div>
          </Dialog>
          <Grid
            item
            style={{
              flex: 1,
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#EBF2F6',
              padding: '10px',
              marginTop: '10px',
              display: 'none',
            }}
          >
            <textarea
              value={
                interimTranscript ? transcript + interimTranscript : transcript
              }
              readOnly
              placeholder={t('whatYouSpeak')}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                color: '#000000',
                fontFamily: 'DM Sans',
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                padding: '10px',
                resize: 'none',
                overflowY: 'visible',
                whiteSpace: 'pre-wrap',
              }}
              rows={7}
            />
          </Grid>
          <div>
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
            <Dialog open={openDialog} onClose={handleClose}>
              <DialogContent>
                <DialogContentText style={{ color: '#0A0B5C' }}>
                  {t('youAreLeaving')}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  style={{
                    background: '#0284C7',
                    color: '#E8F1FF',
                    textTransform: 'none',
                  }}
                >
                  {t('cancelButton')}
                </Button>
                <Link to="/SubmitInterview">
                  <Button
                    onClick={handleExit}
                    style={{
                      background: '#0284C7',
                      color: '#E8F1FF',
                      textTransform: 'none',
                    }}
                  //{t('exitButton')}
                  >
                    {t('confirmBtn')}
                  </Button>
                </Link>
              </DialogActions>
            </Dialog>
          </div>
        </Grid>
      )}
    </div>
  )
}
