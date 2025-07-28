import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VideocamIcon from '@mui/icons-material/Videocam';
import CodeIcon from '@mui/icons-material/Code';
import MicIcon from '@mui/icons-material/Mic';
import { Editor } from '@monaco-editor/react';
import { Box, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { ReactMediaRecorder, ReactMediaRecorderRenderProps } from "react-media-recorder";
import axios from 'axios';

// Declare SpeechRecognition types for TypeScript
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

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const questions = [
  "Imagine you're tasked with building a web application for an online bookstore. The application should allow users to browse books, add them to their cart, and complete purchases.",
  "Can you explain the concept of closures in JavaScript?",
  "How would you handle state management in a large React application?",
  "What are the differences between REST and GraphQL çekAPI?",
  "How would you optimize the performance of a React application?",
];

const buttonStyle: React.CSSProperties = {
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: "bold",
  backgroundColor: "#007AC1",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const RecorderView: React.FC<ReactMediaRecorderRenderProps> = ({
  status,
  startRecording,
  stopRecording,
  previewStream,
  mediaBlobUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [code, setCode] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [openNextDialog, setOpenNextDialog] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [transcript, setTranscript] = useState(''); // State for speech-to-text transcript
  const recognitionRef = useRef<SpeechRecognition | null>(null); // Ref for SpeechRecognition
  const [questions, setQuestions] = useState([])
  const [questionGenerated, setQuestionGenerated] = useState<string[]>([])
  const location = useLocation();
    const organisation = localStorage.getItem('organisation')
  const {  meetingId } = location.state || {  meetingId: "default-meeting" };
// fetching questions
  const generateQuestions = async () => {
    try {
      const params = new URLSearchParams()
      params.append('object_id', meetingId)
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_interview_data/`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            organization: organisation,
          },
        },
      )
      const responseData = response.data.data.questions
      const candidatename = response.data.data.resume_data.name
      setQuestions(responseData)
      const concatenatedQuestions: string[] = []
      if (Array.isArray(responseData)) {
        responseData.forEach((questionObj) => {
          concatenatedQuestions.push(questionObj.question)
        })
        setQuestionGenerated(concatenatedQuestions)
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    }
  }

  useEffect(() => {
    generateQuestions()
  }, [meetingId])
// 
  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Continuous listening
      recognition.interimResults = true; // Show interim results
      recognition.lang = 'en-US'; // Set language to English

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart + ' ';
          } else {
            interimTranscript += transcriptPart;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          console.log('No speech detected, restarting recognition...');
          recognition.start();
        }
      };

      recognition.onend = () => {
        if (status === 'recording') {
          recognition.start(); // Restart recognition if still recording
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('SpeechRecognition API is not supported in this browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [status]);

  // Sync speech recognition with recording status
  useEffect(() => {
    if (recognitionRef.current) {
      if (status === 'recording') {
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
      }
    }
  }, [status]);

  const apiBaseUrl = "https://parseez.ai/parseez-spring-service";

  const saveRecording = async (blobUrl: string) => {
    try {
      setIsUploading(true);
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const file = new File([blob], `interview-${Date.now()}.mp4`, { type: 'video/mp4' });

      const formData = new FormData();
      formData.append('videoFile', file);
      formData.append('transcript', transcript); // Optionally send transcript to backend

      const apiUrl = `${apiBaseUrl}/recordings/${organisation}/${meetingId}/${currentQuestion + 1}`;
      const result = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Recording uploaded:', result.data);
      return true;
    } catch (error: any) {
      console.error('Upload failed:', error);
      if (error.response && error.response.status === 413) {
        alert('The recording file is too large. Please keep it under 50MB and try again.');
      } else {
        alert('Failed to upload the recording. Please try again.');
      }
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTranscript(''); // Reset transcript for the next question
    }
  };

  const handleSubmitInterview = () => {
    setOpenSubmitDialog(false);
    stopRecording(); // Stop recording and wait for mediaBlobUrl to be ready
  };

  // Handle submission after recording stops
  useEffect(() => {
    if (!openSubmitDialog && mediaBlobUrl && !isUploading && status === "stopped") {
      saveRecording(mediaBlobUrl).then((uploadSuccess) => {
        if (uploadSuccess) {
          setIsSubmitted(true);
          navigate('/submitinterview');
        }
      });
    }
  }, [openSubmitDialog, mediaBlobUrl, isUploading, status, navigate]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEditor && editorRef.current && !editorRef.current.contains(event.target as Node)) {
        setShowEditor(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEditor]);

  return (
    <div style={{ position: "relative", height: "100vh", backgroundColor: "black" }}>
      {!hasStarted ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <button
            onClick={() => {
              setHasStarted(true);
              startRecording();
            }}
            style={buttonStyle}
          >
            Join The Meeting
          </button>
        </div>
      ) : isSubmitted ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "white" }}>
          Interview submitted. Redirecting...
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
          />

          <div style={{ position: "absolute", bottom: '10px', left: 0, zIndex: 2, padding: "2rem", color: "white" }}>
            <div style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", padding: "1rem", borderRadius: "12px", maxWidth: "600px" }}>
              <p style={{ fontWeight: "bold" }}>Question: {currentQuestion + 1}/{questions.length}</p>
              <p>{questions[currentQuestion]}</p>
              <p><strong>Answer:</strong> {transcript || 'Start speaking to see your answer here...'}</p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '32px', height: '32px', pointerEvents: 'none', opacity: 0.5 }}><MicIcon /></IconButton>
                <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '32px', height: '32px', pointerEvents: 'none', opacity: 0.5 }}><VideocamIcon /></IconButton>
                <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '32px', height: '32px', textTransform: 'none' }}><VolumeUpIcon /></IconButton>
                <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '32px', height: '32px', textTransform: 'none' }} onClick={() => setShowEditor(true)}><CodeIcon /></IconButton>
              </div>

              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={() => setOpenSubmitDialog(true)}
                  style={{ borderRadius: '8px', backgroundColor: '#007AC1', color: '#fff', width: '50%', textTransform: 'none' }}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      Submitting... <CircularProgress size={24} color="inherit" style={{ marginLeft: '8px' }} />
                    </>
                  ) : (
                    'Submit Interview'
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => setOpenNextDialog(true)}
                  style={{ borderRadius: '8px', backgroundColor: '#007AC1', color: '#fff', width: '50%', textTransform: 'none' }}
                  disabled={isUploading}
                >
                  Next Question
                </Button>
              )}
              <Button
                onClick={() => setOpenSubmitDialog(true)}
                style={{ borderRadius: '8px', backgroundColor: '#007AC1', color: '#fff', width: '50%', textTransform: 'none' }}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    Submitting... <CircularProgress size={24} color="inherit" style={{ marginLeft: '8px' }} />
                  </>
                ) : (
                  'End Interview'
                )}
              </Button>
            </div>
          </div>

          <video
            width="100%"
            height="auto"
            muted
            style={{
              flex: '0 0 auto',
              backgroundColor: 'transparent',
              zIndex: 2,
              height: '400px',
              width: '300px',
              borderRadius: '12px',
              position: "absolute", bottom: '0px', right: '20px'
            }}
          >
            <source
              src={`${process.env.PUBLIC_URL}/assets/static/images/20240913132119-119 (online-video-cutter.com).mp4`}
              type="video/mp4"
            />
          </video>

          {showEditor && (
            <Box ref={editorRef} sx={{ width: '60%', height: '45vh', bgcolor: 'background.paper', borderRadius: '8px', boxShadow: 24, p: 1 }}>
              <Editor
                height="100%"
                width="100%"
                language='javascript'
                value={code}
                onChange={handleEditorChange}
                theme="vs-light"
                options={{ fontSize: 16, minimap: { enabled: true }, automaticLayout: true, contextmenu: false }}
              />
            </Box>
          )}

          <Dialog open={openNextDialog} onClose={() => setOpenNextDialog(false)}>
            <DialogTitle>Next Question</DialogTitle>
            <DialogContent>Are you sure you want to proceed to the next question?</DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenNextDialog(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  setOpenNextDialog(false);
                  handleNextQuestion();
                }}
                color="primary"
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openSubmitDialog} onClose={() => setOpenSubmitDialog(false)}>
            <DialogTitle>Submit Interview</DialogTitle>
            <DialogContent>Are you sure you want to submit the interview?</DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenSubmitDialog(false)}>Cancel</Button>
              <Button onClick={handleSubmitInterview} color="primary" autoFocus>
                {isUploading ? (
                  <>
                    Submitting... <CircularProgress size={24} color="inherit" style={{ marginLeft: '8px' }} />
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

const InterviewAI: React.FC = () => {
  return (
    <ReactMediaRecorder
      video
      audio
      render={(props: ReactMediaRecorderRenderProps) => <RecorderView {...props} />}
    />
  );
};

export default InterviewAI;