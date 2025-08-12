import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Modal, Typography, CircularProgress, Snackbar, Alert, LinearProgress, IconButton } from '@mui/material';
import { CheckCircle, Videocam, Mic, VolumeUp, Code, AttachFile } from '@mui/icons-material';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import { loaderOn, loaderOff } from '../redux/actions';
import { ReactMediaRecorder, ReactMediaRecorderRenderProps } from "react-media-recorder";
import { t } from "i18next";
import { useDispatch } from "react-redux";

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent { error: string; }

interface SpeechRecognitionResultList { [index: number]: SpeechRecognitionResult; length: number; }

interface SpeechRecognitionResult { isFinal: boolean; [index: number]: SpeechRecognitionAlternative; }

interface SpeechRecognitionAlternative { transcript: string; }

declare global {
  interface Window { SpeechRecognition: new () => SpeechRecognition; webkitSpeechRecognition: new () => SpeechRecognition; }
}

const ProfessionalLoader: React.FC<{ message: string; progress?: number }> = ({ message, progress }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(8px)'
  }}>
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '2rem 3rem',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
      minWidth: '300px',
      border: '1px solid rgba(255, 255, 255, 0.2)' 
    }}>
      <CircularProgress 
        size={60} 
        thickness={4}
        style={{ 
          color: '#1976d2', 
          marginBottom: '1.5rem',
          filter: 'drop-shadow(0 4px 8px rgba(25, 118, 210, 0.3))'
        }} 
      />
      <Typography 
        variant="h6" 
        style={{ 
          marginBottom: '1rem', 
          color: '#333',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}
      >
        {message}
      </Typography>
      {progress !== undefined && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            style={{
              height: '6px',
              borderRadius: '3px',
              backgroundColor: '#e0e0e0'
            }}
          />
          <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
            {Math.round(progress)}% Complete
          </Typography>
        </Box>
      )}
    </div>
  </div>
);

function CodingSection({ status, startRecording, stopRecording, previewStream, mediaBlobUrl }: ReactMediaRecorderRenderProps) {
  const organisation = localStorage.getItem('organisation');
  const selectedLanguage: any = localStorage.getItem('i18nextLng');
  const currentLanguage = selectedLanguage === 'ar' ? 'Arabic' : 'English';
  const [openDialog, setOpenDialog] = useState(false);
  const [initialConditionMet, setInitialConditionMet] = useState(false);
  const [liveParticipant, setLiveParticipant] = useState<number>(0);
  const [timeLimit, setTimeLimit] = useState(300);
  const location = useLocation();
  const { meetingId, objId } = location.state || {};
  const [open, setOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [codingQuestions, setCodingQuestions] = useState([]);
  const [language, setLanguage] = useState<string>('java');
  const [code, setCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(10 * 60);
  const [enableTimeLeft, setEnableTimeLeft] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [nextQuestionClicked, setNextQuestionClicked] = useState(false);
  const [modalSubmitClicked, setModalSubmitClicked] = useState(false);
  const [modalContinueTestClicked, setModalContinueTestClicked] = useState(false);
  const [modalStayQuestionClicked, setModalStayQuestionClicked] = useState(false);
  const [modalSkipClicked, setModalSkipClicked] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<boolean[]>([]);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [nextQuestionOpen, setNextQuestionOpen] = useState(false);
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [questionBlobUrls, setQuestionBlobUrls] = useState<{ [key: number]: string }>({});
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  const id = objId;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const currentRecordingRef = useRef<string | null>(null);

  // Define missing modal handlers
  const handleSubmitOpen = () => setSubmitOpen(true);
  const handleSubmitClose = () => {
    setSubmitOpen(false);
    setModalSubmitClicked(false);
    setModalContinueTestClicked(false);
    setSubmitClicked(false);
    setNextQuestionClicked(false);
  };
  const handleNextQuestionOpen = () => setNextQuestionOpen(true);
  const handleNextQuestionClose = () => {
    setNextQuestionOpen(false);
    setModalStayQuestionClicked(false);
    setModalSkipClicked(false);
    setSubmitClicked(false);
    setNextQuestionClicked(false);
  };

  // Initialize uploadStatus based on codingQuestions length
  useEffect(() => {
    if (codingQuestions.length > 0) {
      setUploadStatus(new Array(codingQuestions.length).fill(false));
      console.log('Initialized uploadStatus:', new Array(codingQuestions.length).fill(false));
    }
  }, [codingQuestions]);

  // Store blob URL for current question when recording stops
  useEffect(() => {
    if (mediaBlobUrl && status === 'stopped' && recordingStarted) {
      console.log(`Storing blob URL for question ${currentQuestionIndex}:`, mediaBlobUrl);
      setQuestionBlobUrls(prev => ({
        ...prev,
        [currentQuestionIndex]: mediaBlobUrl
      }));
      currentRecordingRef.current = mediaBlobUrl;
    }
  }, [mediaBlobUrl, status, currentQuestionIndex, recordingStarted]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += text + ' ';
          } else {
            interim = text;
          }
        }
        setCode(prev => prev + final);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setErrorMessage(`Speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        if (status === 'recording' && !isUploading) {
          try {
            recognition.start();
          } catch (error) {
            console.error('Failed to restart speech recognition:', error);
          }
        }
      };

      recognitionRef.current = recognition;
      return () => recognition.stop();
    } else {
      setErrorMessage('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
    }
  }, [selectedLanguage, status, isUploading]);

  // Request microphone and camera permission and start recording
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        setLoadingMessage('Initializing camera and microphone...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        console.log('Media stream initialized:', stream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          console.log('Webcam video playing');
          setIsVideoReady(true);
          
          // Start recording immediately after video is ready
          if (!recordingStarted) {
            startRecording();
            setRecordingStarted(true);
            console.log('Recording started automatically on media initialization');
          }
        }
        setLoadingMessage('');
      } catch (error: any) {
        console.error('Failed to access media devices:', error.message || error);
        setErrorMessage('Failed to access microphone or camera. Please ensure permissions are granted and try again.');
        setLoadingMessage('');
      }
    };
    
    initializeMedia();
    
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
        setIsVideoReady(false);
      }
    };
  }, [startRecording, recordingStarted]);

  // Update video stream from ReactMediaRecorder
  useEffect(() => {
    if (videoRef.current && previewStream && !isVideoReady) {
      console.log('Assigning previewStream to videoRef:', previewStream);
      videoRef.current.srcObject = previewStream;
      videoRef.current.play().then(() => {
        console.log('Preview stream playing');
        setIsVideoReady(true);
      }).catch(error => {
        console.error('Failed to play previewStream:', error);
        setErrorMessage('Failed to display webcam video. Please ensure camera permissions are granted.');
      });
    }
  }, [previewStream, isVideoReady]);

  // Set initial condition met when video is ready
  useEffect(() => {
    if (isVideoReady && codingQuestions.length > 0 && !initialConditionMet) {
      setInitialConditionMet(true);
      console.log('Initial condition met - starting interview');
    }
  }, [isVideoReady, codingQuestions.length, initialConditionMet]);

  const updateAnswer = async (
    questionText: string,
    answer: string,
    index: number,
    blobUrl?: string | null
  ) => {
    try {
      setIsUploading(true);
      setLoadingMessage(`Processing Question ${index + 1}...`);
      setUploadProgress(0);

      console.log(`Processing question ${index + 1} with blob URL:`, blobUrl);

      // Parallel execution of APIs for better performance
      const promises: Promise<any>[] = [];

      // 1. Assess API call
      setUploadProgress(10);
      const assessPromise = axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/assess/`,
        {
          object_id: id,
          question: questionText,
          answer: answer || 'No code provided',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Organization: organisation,
          },
        }
      );
      promises.push(assessPromise);

      // 2. Video upload and processing
      let uploadedVideoUrl: string | null = null;
      if (blobUrl && (!uploadStatus[index] || index === 0)) {
        setLoadingMessage(`Uploading video for Question ${index + 1}...`);
        setUploadProgress(20);
        
        try {
          const response = await fetch(blobUrl);
          const blob = await response.blob();

          if (blob.size > 0) {
            console.log(`Question ${index + 1} - Blob type:`, blob.type, 'Blob size:', blob.size);
            const file = new File([blob], `coding-q${index + 1}.mp4`, { type: 'video/mp4' });
            const formData = new FormData();
            formData.append('videoFile', file);
            formData.append('meetingId', objId);
            formData.append('transcript', answer || '');

            const uploadPromise = axios.post(
              `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/recording/write/${organisation}`,
              formData,
              {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                  if (progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 40) / progressEvent.total);
                    setUploadProgress(20 + progress);
                  }
                }
              }
            ).then(async (uploadResponse) => {
              if (uploadResponse.status === 201) {
                uploadedVideoUrl = uploadResponse.data.outputFileName;
                console.log(`Question ${index + 1} - Uploaded video URL:`, uploadedVideoUrl);
                setUploadProgress(60);

                // Update upload status
                setUploadStatus((prev) => {
                  const updated = [...prev];
                  updated[index] = true;
                  return updated;
                });

                // Process video if uploaded successfully
                if (uploadedVideoUrl) {
                  setLoadingMessage(`Processing video for Question ${index + 1}...`);
                  setUploadProgress(70);
                  
                  return axios.post(
                    `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/process_video/`,
                    {
                      video_url: uploadedVideoUrl,
                      meeting_id: meetingId,
                      object_id: objId,
                      question_index: index,
                    },
                    { headers: { 'Content-Type': 'application/json', Organization: organisation } }
                  );
                }
              } else {
                throw new Error(`Recording/write API failed with status ${uploadResponse.status}`);
              }
            });

            promises.push(uploadPromise);
          } else {
            console.warn(`Question ${index + 1} - Empty blob, skipping video upload.`);
            setUploadStatus((prev) => {
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });
          }
        } catch (error: any) {
          console.error(`Question ${index + 1} - Video upload error:`, error);
          setErrorMessage(`Failed to upload video for Question ${index + 1}: ${error.message}`);
        }
      }

      // 3. Analysis API call (run in background, don't wait for it)
      setUploadProgress(80);
      const analysisPromise = axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/analyze_questions_coding/`,
        {
          object_id: id,
          language_selected: currentLanguage,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Organization: organisation,
          },
        }
      );

      // Don't wait for analysis to complete - let it run in background
      analysisPromise.then(response => {
        console.log(`Question ${index + 1} - Analysis response:`, response.data);
      }).catch(error => {
        console.error(`Question ${index + 1} - Analysis error:`, error);
      });

      // Wait for assess and upload/video processing
      await Promise.all(promises);
      console.log(`Question ${index + 1} - Processing completed successfully`);
      setUploadProgress(100);

    } catch (error: any) {
      console.error(`Error processing Question ${index + 1}:`, error);
      setErrorMessage(`Failed to process Question ${index + 1}: ${error.message || String(error)}`);
    } finally {
      setIsUploading(false);
      setLoadingMessage('');
      setUploadProgress(0);
    }
  };

  const handleRecordingSubmit = async () => {
    try {
      console.log('Stopping recording for question:', currentQuestionIndex);
      stopRecording();
      
      // Wait a bit for recording to properly stop and blob to be available
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const blobUrl = currentRecordingRef.current || questionBlobUrls[currentQuestionIndex];
      console.log('Using blob URL for submission:', blobUrl);
      
      if (codingQuestions[currentQuestionIndex]) {
        await updateAnswer(
          codingQuestions[currentQuestionIndex], 
          code, 
          currentQuestionIndex, 
          blobUrl
        );
      } else {
        console.warn('No question available for index:', currentQuestionIndex);
      }
      
      // Start recording for next question if not last question
      if (currentQuestionIndex < codingQuestions.length - 1) {
        console.log('Starting recording for next question...');
        startRecording();
        currentRecordingRef.current = null; // Reset for next question
      }
    } catch (error: any) {
      console.error('Error in handleRecordingSubmit:', error);
      setErrorMessage('Failed to process recording submission: ' + (error.message || String(error)));
    }
  };

  const handleNextQuestion = async () => {
    if (!initialConditionMet) {
      console.log('Condition not met, skipping function execution.');
      return;
    }
    
    try {
      await handleRecordingSubmit();
      
      if (currentQuestionIndex === codingQuestions.length - 1) {
        // Last question - complete interview
        await Promise.all([
          generatefeedback(),
          handleInterviewStatus(objId, organisation),
          SendThankYouMail(),
        ]);
        navigate('/coding_submit');
      } else {
        // Move to next question
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setCode('');
        resetTimer();
      }
    } catch (error: any) {
      console.error('Error during next question processing:', error);
      setErrorMessage('Failed to process next question: ' + (error.message || String(error)));
    }
  };

  const handleExit = async () => {
    try {
      stopRecording();
      await handleRecordingSubmit();
      await Promise.all([
        generatefeedback(),
        handleInterviewStatus(objId, organisation),
        SendThankYouMail(),
      ]);
      navigate('/coding_submit');
    } catch (error: any) {
      console.error('Error during exit:', error);
      setErrorMessage('Failed to exit interview: ' + (error.message || String(error)));
    }
  };

  const handleSubmit = async () => {
    try {
      // Don't use Redux loader - use our custom loader instead
      await handleRecordingSubmit();
      
      if (currentQuestionIndex === codingQuestions.length - 1) {
        await Promise.all([
          generatefeedback(),
          handleInterviewStatus(objId, organisation),
          SendThankYouMail(),
        ]);
        navigate('/coding_submit');
      } else {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setCode('');
        resetTimer();
      }
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      setErrorMessage('Failed to submit: ' + (error.message || String(error)));
      setOpenDialog(true);
    }
  };

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
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const resetTimer = () => {
    setTimeLeft(10 * 60);
    setEnableTimeLeft(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 180 && !enableTimeLeft) {
            setEnableTimeLeft(true);
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleRecordingSubmit();
      handleNextQuestion();
      resetTimer();
      handleSubmitClose();
      handleNextQuestionClose();
      setCode('');
    }
  }, [timeLeft, enableTimeLeft]);

  const preventPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    alert(t('pastingIsDisabled'));
  };

  const preventCopyCut = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      alert(t('cutCopyPasteRestricted'));
    }
  };

  useEffect(() => {
    document.addEventListener('paste', preventPaste);
    document.addEventListener('keydown', preventCopyCut);
    return () => {
      document.removeEventListener('paste', preventPaste);
      document.removeEventListener('keydown', preventCopyCut);
    };
  }, []);

  const handleMainButtonClicked = (e: any) => {
    if (e === 1) {
      setSubmitClicked(true);
      setNextQuestionClicked(false);
    }
    if (e === 2) {
      setSubmitClicked(false);
      setNextQuestionClicked(true);
    }
  };

  const handleModal1ButtonClicked = (e: any) => {
    if (e === 1) {
      setModalSubmitClicked(false);
      setModalContinueTestClicked(true);
    }
    if (e === 2) {
      setModalSubmitClicked(true);
      setModalContinueTestClicked(false);
    }
  };

  const handleModal2ButtonClicked = (e: any) => {
    if (e === 1) {
      setModalSkipClicked(false);
      setModalStayQuestionClicked(true);
    }
    if (e === 2) {
      setModalSkipClicked(true);
      setModalStayQuestionClicked(false);
    }
  };

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
      console.log('Interview status updated:', response.data.message);
    } catch (error) {
      console.error('Failed to update interview status:', error);
    }
  };

  const generatefeedback = async () => {
    try {
      const formData = new FormData();
      formData.append('object_id', id);
      formData.append('language_selected', currentLanguage);
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/generate_feedback_coding/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            organization: organisation,
          },
        },
      );
      console.log('Feedback generated successfully');
    } catch (error) {
      console.error('Error generating feedback:', error);
    }
  };

  const SendThankYouMail = async () => {
    if (!meetingId) {
      alert(t('pleaseProvideValidMeetingId'));
      return;
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
      );
      console.log('Thank-you email sent:', response.data);
    } catch (error) {
      console.error('Error sending thank-you email:', error);
    }
  };

  useEffect(() => {
    if (!id || hasFetched.current) return;
    const fetchData = async () => {
      try {
        setLoadingMessage('Loading interview questions...');
        const response = await axios.post(
          `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_interview_data/`,
          { object_id: objId },
          {
            headers: {
              'Content-Type': 'application/json',
              organization: organisation,
            },
          },
        );
        const codingQuestions = response.data.data.questions.map(
          (que: any) => que.problem_statement,
        );
        setCodingQuestions(codingQuestions);
        hasFetched.current = true;
        setLoadingMessage('');
        console.log('Loaded coding questions:', codingQuestions.length);
      } catch (error) {
        console.error('Failed to fetch interview data:', error);
        setErrorMessage('Failed to load interview questions. Please refresh and try again.');
        setLoadingMessage('');
      }
    };
    fetchData();
  }, [id, objId]);

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const onPopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  const convertNumberToArabic = (num: number | string, selectedLanguage: any) => {
    if (selectedLanguage === 'ar') {
      return num.toLocaleString('ar-EG');
    }
    return num;
  };

  const textStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: 'SF Pro Display',
    color: '#0284C7',
  };

  const taskStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    fontFamily: 'SF Pro Display',
    color: '#ffffff',
    textAlign: 'center',
  };

  const modalStyle = {
    position: 'absolute' as const,
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
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        padding: '20px',
        overflow: 'auto',
      }}
    >
      {(isUploading || loadingMessage) && (
        <ProfessionalLoader 
          message={loadingMessage || 'Processing'} 
          progress={uploadProgress > 0 ? uploadProgress : undefined}
        />
      )}
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
          <div style={{ 
            position: 'relative', 
            flex: '0 0 auto',
            borderRadius: '10px',
            maxHeight: '300px',
            minWidth: '200px',
            width: '100%',
            backgroundColor: 'black'
          }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '10px'
              }}
            />
            {!isVideoReady && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                textAlign: 'center'
              }}>
                <CircularProgress size={30} style={{ color: '#0284C7', marginBottom: '10px' }} />
                <Typography>Initializing camera...</Typography>
              </div>
            )}
          </div>
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
                      color: enableTimeLeft ? '#FF3131' : '#0284C7'
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
                    lineHeight: '1.4'
                  }}
                >
                  {convertNumberToArabic(
                    codingQuestions[currentQuestionIndex],
                    selectedLanguage,
                  )}
                </Typography>
              ) : (
                <Typography sx={taskStyle}>
                  {loadingMessage || t('pleaseJoinTheInterview')}
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
                  marginTop: '15px',
                  paddingLeft: '6px',
                }}
              >
                <IconButton 
                  sx={{ 
                    backgroundColor: status === 'recording' ? '#FF3131' : '#0284C7', 
                    color: '#fff', 
                    width: '32px', 
                    height: '32px',
                    '&:hover': {
                      backgroundColor: status === 'recording' ? '#FF3131' : '#0284C7',
                    }
                  }}
                >
                  <Mic />
                </IconButton>
                <IconButton 
                  sx={{ 
                    backgroundColor: isVideoReady ? '#0284C7' : '#666', 
                    color: '#fff', 
                    width: '32px', 
                    height: '32px',
                    '&:hover': {
                      backgroundColor: isVideoReady ? '#0284C7' : '#666',
                    }
                  }}
                >
                  <Videocam />
                </IconButton>
              </Box>
              <Button
                onClick={() => {
                  handleMainButtonClicked(2);
                  handleNextQuestionOpen();
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
                    background: nextQuestionClicked ? '#026A9E' : '#F0F0F0',
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
        </Grid>
        {initialConditionMet && (
          <Grid item lg={8}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '14px',
                color: '#fff',
                pointerEvents: 'none',
                marginBottom: '10px'
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
                theme="vs-dark"
                options={{
                  fontSize: 16,
                  minimap: { enabled: true },
                  automaticLayout: true,
                  contextmenu: false,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
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
                  handleMainButtonClicked(1);
                  handleSubmitOpen();
                }}
                disabled={isUploading}
                sx={{
                  padding: '10px 70px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'none',
                  background: isUploading ? '#ccc' : '#0284C7',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  '&:hover': {
                    background: isUploading ? '#ccc' : '#026A9E',
                  },
                  '&:disabled': {
                    background: '#ccc',
                    color: '#666'
                  },
                  height: '36px',
                  minWidth: '100px',
                }}
              >
                {isUploading ? 'Processing...' : t('submitCode')}
              </Button>
            </Box>
          </Grid>
        )}
        <Grid item lg={12} height="20px" width="100%">
          {enableTimeLeft && timeLeft !== 0 && initialConditionMet && (
            <span style={{ color: '#FF3131', fontSize: '14px', fontWeight: 'bold' }}>
              ⚠️ You have only{' '}
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
      
      {/* Submit Confirmation Modal */}
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
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'SF Pro Display',
              marginBottom: '10px'
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
              marginBottom: '20px'
            }}
          >
            {t('youHave')}{' '}
            <span style={{ minWidth: '40px', display: 'inline-block', fontWeight: 'bold', color: '#0284C7' }}>
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
              gap: '20px'
            }}
          >
            <Button
              onClick={() => {
                handleModal1ButtonClicked(1);
                handleSubmitClose();
              }}
              sx={{
                padding: '10px 30px',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'none',
                background: modalContinueTestClicked ? '#0284C7' : '#FFFFFF',
                borderRadius: '8px',
                border: modalContinueTestClicked ? 'none' : '1px solid #ccc',
                color: modalContinueTestClicked ? '#FFFFFF' : '#000000',
                '&:hover': {
                  background: modalContinueTestClicked ? '#026A9E' : '#F5F5F5',
                },
                flex: 1
              }}
            >
              {t('noContinueTest')}
            </Button>
            <Button
              onClick={() => {
                handleModal1ButtonClicked(2);
                handleSubmit();
                handleSubmitClose();
              }}
              sx={{
                padding: '10px 30px',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'none',
                background: modalSubmitClicked ? '#0284C7' : '#FFFFFF',
                borderRadius: '8px',
                border: modalSubmitClicked ? 'none' : '1px solid #ccc',
                color: modalSubmitClicked ? '#FFFFFF' : '#000000',
                '&:hover': {
                  background: modalSubmitClicked ? '#026A9E' : '#F5F5F5',
                },
                flex: 1
              }}
            >
              {t('yesSubmit')}
            </Button>
          </div>
        </Box>
      </Modal>
      
      {/* Skip Question Modal */}
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
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'SF Pro Display',
              marginBottom: '10px'
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
              marginBottom: '20px'
            }}
          >
            {t('skipQuestionAlertMessage')}
          </Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              flexDirection: 'row',
              gap: '20px'
            }}
          >
            <Button
              onClick={() => {
                handleModal2ButtonClicked(1);
                handleNextQuestionClose();
              }}
              sx={{
                padding: '10px 30px',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'none',
                background: modalStayQuestionClicked ? '#0284C7' : '#FFFFFF',
                borderRadius: '8px',
                border: modalStayQuestionClicked ? 'none' : '1px solid #ccc',
                color: modalStayQuestionClicked ? '#FFFFFF' : '#000000',
                '&:hover': {
                  background: modalStayQuestionClicked ? '#026A9E' : '#F5F5F5',
                },
                flex: 1
              }}
            >
              {t('noStayThisQuestion')}
            </Button>
            <Button
              onClick={() => {
                handleModal2ButtonClicked(2);
                handleNextQuestion();
                handleNextQuestionClose();
              }}
              sx={{
                padding: '10px 30px',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'none',
                background: modalSkipClicked ? '#0284C7' : '#FFFFFF',
                borderRadius: '8px',
                border: modalSkipClicked ? 'none' : '1px solid #ccc',
                color: modalSkipClicked ? '#FFFFFF' : '#000000',
                '&:hover': {
                  background: modalSkipClicked ? '#026A9E' : '#F5F5F5',
                },
                flex: 1
              }}
            >
              {t('yesSkip')}
            </Button>
          </div>
        </Box>
      </Modal>
      
      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default function CodingSectionWrapper() {
  return (
    <ReactMediaRecorder
      video
      audio
      render={(props: ReactMediaRecorderRenderProps) => <CodingSection {...props} />}
      onStop={(blobUrl, blob) => {
        console.log('Recording stopped, blob URL:', blobUrl, 'Blob size:', blob.size);
      }}
      mediaRecorderOptions={{
        mimeType: 'video/webm;codecs=vp8,opus'
      }}
    />
  );
}