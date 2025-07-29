import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { DyteMeeting, DyteUiProvider, DyteGrid } from '@dytesdk/react-ui-kit';
import { useDyteClient } from '@dytesdk/react-web-core';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CodeIcon from '@mui/icons-material/Code';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CircularProgress from '@mui/material/CircularProgress';
import useProctoring from '../useProctoring';
import { loaderOn, loaderOff } from '../../redux/actions';
 
interface MergeVideoRequest {
  video_urls: string[];
  meeting_id: string;
  object_id?: string;
}
 
interface MergeVideoResponse {
  message: string;
}
 
export default function InterviewAttend() {
  const location = useLocation();
  const { authToken, meetingId, objId } = location.state || {};
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { warning } = useProctoring(objId);
  const selectedLanguage = localStorage.getItem('i18nextLng') || 'en';
  const organisation = localStorage.getItem('organisation') || '';
 
  // State Management
  const [meeting, initMeeting] = useDyteClient();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionGenerated, setQuestionGenerated] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [hasTriggeredNext, setHasTriggeredNext] = useState(false);
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [liveParticipant, setLiveParticipant] = useState<number>(0);
  const [initialConditionMet, setInitialConditionMet] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [code, setCode] = useState('');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [openWarning, setOpenWarning] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'next' | 'submit' | null>(null);
  const [candidateName, setCandidateName] = useState('');
  const [readQuestions, setReadQuestions] = useState(new Set<number>());
  const [isReadingQuestion, setIsReadingQuestion] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
 
  // Refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  let speechInstance: SpeechSynthesisUtterance | null = null;
 
  // Utility Functions
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
 
  const convertNumberToArabic = (num: number) => {
    return selectedLanguage === 'ar' ? num.toLocaleString('ar-EG') : num.toString();
  };
 
  const sanitizeText = (text: string): string => {
    return text.replace(/[`"'“”]/g, '');
  };
 
  // Speech Synthesis
  const loadVoices = () => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices);
  };
 
  const speak = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    const femaleVoice =
      voices.find((voice) => voice.name.toLowerCase().includes('female')) ||
      voices.find((voice) => voice.name.toLowerCase().includes('woman')) ||
      voices[0];
    speech.voice = femaleVoice;
    speech.onstart = () => {
      setIsReadingQuestion(true);
      if (videoRef.current) videoRef.current.play();
    };
    speech.onend = () => {
      setIsReadingQuestion(false);
      if (videoRef.current) videoRef.current.pause();
    };
    window.speechSynthesis.speak(speech);
  };
 
  const readQuestion = (index: number) => {
    if (liveParticipant > 0 && !readQuestions.has(index) && questionGenerated[index]) {
      if (speechInstance) {
        window.speechSynthesis.cancel();
        speechInstance = null;
      }
      const sanitizedQuestion = sanitizeText(questionGenerated[index]);
      speechInstance = new SpeechSynthesisUtterance(sanitizedQuestion);
      speak(sanitizedQuestion);
      setReadQuestions((prev) => new Set([...prev, index]));
    }
  };
 
  // API Calls
  const generateQuestions = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_interview_data/`,
        { object_id: objId },
        { headers: { 'Content-Type': 'application/json', organization: organisation } }
      );
      const responseData = response.data.data.questions;
      const candidateName = response.data.data.resume_data.name;
      setQuestions(responseData);
      setCandidateName(candidateName);
      setQuestionGenerated(responseData.map((q: any) => q.question));
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
 
  const updateAnswer = async (questionText: string, answer: string) => {
    try {
      const data = {
        object_id: objId,
        question_text: questionText,
        answer: answer || 'No answer provided',
      };
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/update_answer/`,
        data,
        { headers: { organization: organisation } }
      );
      setTranscript('');
      setInterimTranscript('');
    } catch (error) {
      console.error('Error updating answer:', error);
      throw error;
    }
  };
 
  const startRecording = async () => {
    try {
      const response = await axios.post(
        'https://api.dyte.io/v2/recordings',
        { meeting_id: meetingId, allow_multiple_recordings: true },
        { auth: { username: '955e223b-76a8-4c24-a9c6-ecbfea717290', password: '26425221301ce90b9244' } }
      );
      setRecordingId(response.data.data.id);
      console.log(`Started recording for question ${currentQuestionIndex + 1}: ${response.data.data.id}`);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };
 
  const stopRecording = async () => {
    if (!recordingId) return;
    try {
      await axios.put(
        `https://api.dyte.io/v2/recordings/${recordingId}`,
        { action: 'stop' },
        { auth: { username: '955e223b-76a8-4c24-a9c6-ecbfea717290', password: '26425221301ce90b9244' } }
      );
      console.log(`Stopped recording: ${recordingId}`);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };
 
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

    await handleProcessVideo(); // Updated function with polling

    console.log('Video processed...');

    if (currentQuestionIndex < questionGenerated.length - 1) {

      await startRecording();

      console.log('New recording started...');

    }

  } catch (error) {

    console.error('Error in handleRecordingSubmit:', error);

  }

};
 
 
  const checkSessionStatus = async () => {
    try {
      const response = await axios.get(
        `https://api.dyte.io/v2/meetings/${meetingId}/active-session`,
        { auth: { username: '955e223b-76a8-4c24-a9c6-ecbfea717290', password: '26425221301ce90b9244' } }
      );
      const participant = response.data.data.live_participants;
      setLiveParticipant(participant);
      if (participant > 0) {
        setInitialConditionMet(true);
      }
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.data.error?.code === 404) {
        setLiveParticipant(0);
      }
    }
  };
 
  const sendThankYouMail = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/interview/Thankingmail/${organisation}`,
        { meetingId },
        { headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error sending thank-you email:', error);
    }
  };
 
  const handleInterviewStatus = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/interview_status/`,
        { object_id: objId, interview_status: 'completed' },
        { headers: { 'Content-Type': 'application/json', organization: organisation } }
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };
 
  const generateFeedback = async () => {
    try {
      const formData = new FormData();
      formData.append('object_id', objId);
      formData.append('language_selected', selectedLanguage);
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/generate_feedback/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data', organization: organisation } }
      );
    } catch (error) {
      console.error('Error generating feedback:', error);
    }
  };
 
  const handleQuestionAnalysis = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/analyze_questions/`,
        { object_id: objId, language_selected: selectedLanguage },
        { headers: { 'Content-Type': 'application/json', organization: organisation } }
      );
    } catch (error) {
      console.error('Error analyzing questions:', error);
    }
  };
 
  const handleBatchInterviewAnalysis = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/batch_process_interview_analysis/`,
        { object_id: objId, language_selected: selectedLanguage },
        { headers: { 'Content-Type': 'application/json', organization: organisation } }
      );
    } catch (error) {
      console.error('Error in batch interview analysis:', error);
    }
  };
 
  const handleSoftSkills = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract_soft_skills/`,
        { object_id: objId, language_selected: selectedLanguage },
        { headers: { 'Content-Type': 'application/json', organization: organisation } }
      );
    } catch (error) {
      console.error('Error extracting soft skills:', error);
    }
  };
 
  const handleStrengths = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract_strengths_areas/`,
        { object_id: objId, language_selected: selectedLanguage },
        { headers: { 'Content-Type': 'application/json', organization: organisation } }
      );
    } catch (error) {
      console.error('Error extracting strengths:', error);
    }
  };
 
  const handleTechnicalScore = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract-techskills-scores/`,
        { object_id: objId, language_selected: selectedLanguage },
        { headers: { 'Content-Type': 'application/json', organization: organisation } }
      );
    } catch (error) {
      console.error('Error extracting technical scores:', error);
    }
  };
 
 
 
  // Event Handlers
  const handleNextQuestion = async () => {
    setConfirmAction('next');
    setOpenConfirmDialog(true);
  };
 
  const handleSubmit = async () => {
    setConfirmAction('submit');
    setOpenConfirmDialog(true);
  };
 
  const handleConfirmAction = async () => {
    setOpenConfirmDialog(false);
    dispatch(loaderOn());
    try {
      const finalAnswer = code.trim() || transcript + interimTranscript || 'No answer provided';
      await updateAnswer(questionGenerated[currentQuestionIndex], finalAnswer);
      await handleRecordingSubmit();
 
      if (confirmAction === 'submit' || currentQuestionIndex === questionGenerated.length - 1) {
        // Disable audio and video
        if (meeting) {
          meeting.self.disableAudio();
          meeting.self.disableVideo();
        }
        await Promise.all([
          generateFeedback(),
          handleQuestionAnalysis(),
          handleSoftSkills(),
          handleStrengths(),
          handleTechnicalScore(),
          handleInterviewStatus(),
          handleBatchInterviewAnalysis(),
          sendThankYouMail(),
          // handleProctoring(),
        ]);
        navigate('/signin');
      } else {
        setCode('');
        setCurrentQuestionIndex((prev) => prev + 1);
        setTimeLeft(300);
        setTranscript('');
        setInterimTranscript('');
      }
    } catch (error) {
      console.error('Error in handleConfirmAction:', error);
    } finally {
      dispatch(loaderOff());
      setLoading(false);
    }
  };
 
  const handleExit = async () => {
    if (recordingId) {
      await handleRecordingSubmit();
    }
    try {
      await axios.post(
        `https://api.dyte.io/v2/meetings/${meetingId}/active-session/kick-all`,
        null,
        { auth: { username: '955e223b-76a8-4c24-a9c6-ecbfea717290', password: '26425221301ce90b9244' } }
      );
      // Disable audio and video
      if (meeting) {
        meeting.self.disableAudio();
        meeting.self.disableVideo();
      }
      navigate('/signin');
    } catch (error) {
      console.error('Error kicking session:', error);
    } finally {
      dispatch(loaderOff());
      setLoading(false);
    }
  };
 
  const handleUpload = () => {
    fileInputRef.current?.click();
  };
 
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('meetingid', meetingId);
    try {
      await axios.post(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/LiveUpload/upload/${organisation}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      alert(t('fileUploadSuccessfully'));
    } catch (error) {
      console.error('Upload failed:', error);
      alert(t('uploadFailed'));
    }
  };
 
  const handleVolumeUp = () => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(audioRef.current.volume + 0.1, 1);
    }
  };
 
  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };
 
  // Effects
  useEffect(() => {
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);
 
  useEffect(() => {
    readQuestion(currentQuestionIndex);
    return () => {
      if (speechInstance) {
        window.speechSynthesis.cancel();
        speechInstance = null;
      }
    };
  }, [currentQuestionIndex, liveParticipant]);
 
  useEffect(() => {
    const setupMeeting = async () => {
      if (!authToken) {
        setLoading(false);
        return;
      }
      try {
        await initMeeting({ authToken, defaults: { audio: true, video: true } });
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize Dyte meeting:', error);
        setLoading(false);
      } finally {
        dispatch(loaderOff());
      }
    };
    setupMeeting();
    generateQuestions();
  }, [authToken, objId]);
 
  useEffect(() => {
    if (initialConditionMet && authToken && !recordingId && questionGenerated.length > 0) {
      startRecording();
    }
  }, [initialConditionMet, authToken, recordingId, questionGenerated]);
 
  useEffect(() => {
    const intervalId = setInterval(checkSessionStatus, 3000);
    return () => clearInterval(intervalId);
  }, [meetingId]);
 
  useEffect(() => {
    if (warning) setOpenWarning(true);
  }, [warning]);
 
  useEffect(() => {
    if (timeLeft <= 0 && !hasTriggeredNext) {
      handleNextQuestion();
      setHasTriggeredNext(true);
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, hasTriggeredNext]);
 
  useEffect(() => {
    setTimeLeft(300);
    setHasTriggeredNext(false);
  }, [currentQuestionIndex]);
 
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
 
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const onPopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEditor && editorRef.current && !editorRef.current.contains(event.target as Node)) {
        setShowEditor(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEditor]);
 
  // Speech Recognition
  useEffect(() => {
    if (liveParticipant > 0 && !isReadingQuestion) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
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
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptPart + ' ';
          } else {
            interim += transcriptPart;
          }
        }
        setTranscript(final);
        setInterimTranscript(interim);
      };
      mic.onerror = (event: any) => {
        setTranscript('Error in speech recognition');
      };
      mic.start();
      return () => mic.stop();
    }
  }, [liveParticipant, currentQuestionIndex, isReadingQuestion, selectedLanguage]);
 
  return (
    <div style={{ minHeight: '100vh', background: '#000000', padding: '20px', overflow: 'auto' }}>
      {loading ? (
        <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '100%', background: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <CircularProgress size={50} style={{ color: '#0284C7' }} />
        </div>
      ) : (
        <Grid container spacing={2}>
          <Grid item lg={9} style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center' }}>
            <DyteUiProvider meeting={meeting}>
              <DyteGrid meeting={meeting} style={{ width: '100%', height: showEditor ? '60vh' : '100vh' }} />
            </DyteUiProvider>
            {showEditor && (
              <Box ref={editorRef} sx={{ width: '60%', height: '45vh', bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 24, p: 1, display: 'flex', flexDirection: 'column' }}>
                <Editor
                  height="100%"
                  width="100%"
                  language="javascript"
                  value={code}
                  onChange={handleEditorChange}
                  theme="vs-light"
                  options={{ fontSize: 16, minimap: { enabled: true }, automaticLayout: true, contextmenu: false }}
                />
              </Box>
            )}
          </Grid>
          <Grid item lg={3} style={{ padding: '30px 10px 5px 10px' }}>
            <video
              ref={videoRef}
              width="100%"
              height="auto"
              muted
              style={{ borderRadius: '10px', backgroundColor: 'transparent', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', zIndex: 1, maxHeight: '300px', minWidth: '200px', width: '100%' }}
            >
              <source src={`${process.env.PUBLIC_URL}assets/static/images/20240913132119-119 (online-video-cutter.com).mp4`} type="video/mp4" />
            </video>
            {initialConditionMet && (
              <div style={{ background: '#263D4A', backdropFilter: 'blur(12px)', marginTop: '10px', width: '100%', height: '250px', borderRadius: '8px', padding: '11px 6px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#FFFFFF' }}>
                    {t('question')} {convertNumberToArabic(currentQuestionIndex + 1)}
                  </Typography>
                  <Typography style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'SF Pro Display', color: '#0284C7' }}>
                    ⏱ {formatTime(timeLeft)}
                  </Typography>
                </Box>
                <Typography style={{ fontSize: '12px', color: '#FFFFFF', fontFamily: 'Inter', letterSpacing: '0%', fontWeight: 400 }}>
                  {questionGenerated[currentQuestionIndex]}
                </Typography>
              </div>
            )}
            {initialConditionMet && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '30px 0 20px 0px', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'nowrap', width: '100%' }}>
                  <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '32px', height: '32px', pointerEvents: 'none', opacity: 0.5 }}>
                    <MicIcon />
                  </IconButton>
                  <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '32px', height: '32px', pointerEvents: 'none', opacity: 0.5 }}>
                    <VideocamIcon />
                  </IconButton>
                  <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '32px', height: '32px' }} onClick={handleVolumeUp}>
                    <VolumeUpIcon />
                  </IconButton>
                  <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '32px', height: '32px' }} onClick={() => setShowEditor(true)}>
                    <CodeIcon />
                  </IconButton>
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                  <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '30px', height: '30px' }} onClick={handleUpload}>
                    <AttachFileIcon />
                  </IconButton>
                </div>
              </div>
            )}
            {initialConditionMet && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'nowrap', width: '100%' }}>
                <Button
                  style={{ borderRadius: '8px', backgroundColor: '#000', color: '#fff', border: '1px solid #fff', padding: '6px 16px', fontWeight: 500, textTransform: 'none', width: '50%' }}
                  onClick={handleNextQuestion}
                >
                  {currentQuestionIndex === questionGenerated.length - 1 ? t('submitBtn') : t('nextQuestion')}
                </Button>
                <Button
                  style={{ borderRadius: '8px', backgroundColor: '#0284C7', color: '#fff', padding: '6px 16px', fontWeight: '500', textTransform: 'none', width: '50%' }}
                  onClick={handleSubmit}
                >
                  {t('endInterview')}
                </Button>
              </div>
            )}
          </Grid>
          <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
            <DialogContent>
              <DialogContentText style={{ color: '#0284C7' }}>{t('beforeAttending')}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setShowPopup(false);
                }}
                style={{ background: '#0284C7', color: '#FFFFFF', textTransform: 'none' }}
              >
                {t('okBtn')}
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
            <DialogTitle>{t('confirm Submission')}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {confirmAction === 'submit' || currentQuestionIndex === questionGenerated.length - 1
                  ? t('submitFinalConfirmation')
                  : t('submitQuestionConfirmation')}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirmDialog(false)} style={{ background: '#0284C7', color: '#E8F1FF', textTransform: 'none' }}>
                {t('cancelButton')}
              </Button>
              <Button onClick={handleConfirmAction} style={{ background: '#0284C7', color: '#FFFFFF', textTransform: 'none' }}>
                {t('confirmBtn')}
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar open={openWarning} autoHideDuration={5000} onClose={() => setOpenWarning(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={() => setOpenWarning(false)} severity="warning" sx={{ width: '100%' }}>
              {warning}
            </Alert>
          </Snackbar>
        </Grid>
      )}
    </div>
  );
}
 