// // // import React, { useRef, useEffect, useState } from "react";
// // // import { useLocation, useNavigate } from 'react-router-dom';
// // // import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Snackbar, Alert, LinearProgress, Typography, IconButton } from '@mui/material';
// // // import { CheckCircle } from '@mui/icons-material';
// // // import VideocamIcon from '@mui/icons-material/Videocam';
// // // import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// // // import CodeIcon from '@mui/icons-material/Code';
// // // import AttachFileIcon from '@mui/icons-material/AttachFile';
// // // import MicIcon from '@mui/icons-material/Mic';
// // // import { ReactMediaRecorder, ReactMediaRecorderRenderProps } from "react-media-recorder";
// // // import { Editor } from '@monaco-editor/react';
// // // import axios from 'axios';
// // // import { t } from "i18next";

// // // interface SpeechRecognition extends EventTarget {
// // //   continuous: boolean;
// // //   interimResults: boolean;
// // //   lang: string;
// // //   onresult: (event: SpeechRecognitionEvent) => void;
// // //   onerror: (event: SpeechRecognitionErrorEvent) => void;
// // //   onend: () => void;
// // //   start: () => void;
// // //   stop: () => void;
// // // }

// // // interface SpeechRecognitionEvent {
// // //   resultIndex: number;
// // //   results: SpeechRecognitionResultList;
// // // }

// // // interface SpeechRecognitionErrorEvent { error: string; }

// // // interface SpeechRecognitionResultList { [index: number]: SpeechRecognitionResult; length: number; }

// // // interface SpeechRecognitionResult { isFinal: boolean;[index: number]: SpeechRecognitionAlternative; }

// // // interface SpeechRecognitionAlternative { transcript: string; }

// // // declare global {
// // //   interface Window { SpeechRecognition: new () => SpeechRecognition; webkitSpeechRecognition: new () => SpeechRecognition; }
// // // }

// // // // Professional Loading Component
// // // const ProfessionalLoader: React.FC<{ message: string; progress?: number }> = ({ message, progress }) => (
// // //   <div style={{
// // //     position: 'fixed',
// // //     top: 0,
// // //     left: 0,
// // //     width: '100%',
// // //     height: '100%',
// // //     backgroundColor: 'rgba(0, 0, 0, 0.85)',
// // //     display: 'flex',
// // //     flexDirection: 'column',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     zIndex: 9999,
// // //     backdropFilter: 'blur(8px)'
// // //   }}>
// // //     <div style={{
// // //       backgroundColor: 'rgba(255, 255, 255, 0.95)',
// // //       padding: '2rem 3rem',
// // //       borderRadius: '16px',
// // //       boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
// // //       textAlign: 'center',
// // //       minWidth: '300px',
// // //       border: '1px solid rgba(255, 255, 255, 0.2)'
// // //     }}>
// // //       <CircularProgress
// // //         size={60}
// // //         thickness={4}
// // //         style={{
// // //           color: '#1976d2',
// // //           marginBottom: '1.5rem',
// // //           filter: 'drop-shadow(0 4px 8px rgba(25, 118, 210, 0.3))'
// // //         }}
// // //       />
// // //       <Typography
// // //         variant="h6"
// // //         style={{
// // //           marginBottom: '1rem',
// // //           color: '#333',
// // //           fontWeight: '600',
// // //           letterSpacing: '0.5px'
// // //         }}
// // //       >
// // //         {message}
// // //       </Typography>
// // //       {progress !== undefined && (
// // //         <Box sx={{ width: '100%', mt: 2 }}>
// // //           <LinearProgress
// // //             variant="determinate"
// // //             value={progress}
// // //             style={{
// // //               height: '6px',
// // //               borderRadius: '3px',
// // //               backgroundColor: '#e0e0e0'
// // //             }}
// // //           />
// // //           <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
// // //             {Math.round(progress)}% Complete
// // //           </Typography>
// // //         </Box>
// // //       )}
// // //     </div>
// // //   </div>
// // // );

// // // const RecorderView: React.FC<ReactMediaRecorderRenderProps> = ({
// // //   status, startRecording, stopRecording, previewStream, mediaBlobUrl,
// // // }) => {
// // //   const videoRef = useRef<HTMLVideoElement | null>(null);
// // //   const editorRef = useRef<HTMLDivElement | null>(null);
// // //   const lipSyncVideoRef = useRef<HTMLVideoElement | null>(null);
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   const organisation = localStorage.getItem('organisation') || '';
// // //   const selectedLanguage = localStorage.getItem('i18nextLng') || 'en';
// // //   const { meetingId, objId } = location.state || {};

// // //   const [questions, setQuestions] = useState<{ question: string; answer?: string }[]>([]);
// // //   const [currentQuestion, setCurrentQuestion] = useState(0);
// // //   const [showEditor, setShowEditor] = useState(false);
// // //   const [code, setCode] = useState('');
// // //   const [transcript, setTranscript] = useState('');
// // //   const [interimTranscript, setInterimTranscript] = useState('');
// // //   const [isUploading, setIsUploading] = useState(false);
// // //   const [openNextDialog, setOpenNextDialog] = useState(false);
// // //   const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const [lastBlobUrl, setLastBlobUrl] = useState<string | null>(null);
// // //   const [uploadStatus, setUploadStatus] = useState<boolean[]>([]);
// // //   const [errorMessage, setErrorMessage] = useState<string | null>(null);
// // //   const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);
// // //   const [hasSpokenQuestion, setHasSpokenQuestion] = useState<boolean[]>([]);
// // //   const [loadingMessage, setLoadingMessage] = useState('');
// // //   const [uploadProgress, setUploadProgress] = useState(0);
// // //   const [submissionProgress, setSubmissionProgress] = useState(0);
// // //   const [isVideoReady, setIsVideoReady] = useState(false);
// // //   const [voicesLoaded, setVoicesLoaded] = useState(false);
// // //   const fileInputRef = useRef<HTMLInputElement | null>(null);
// // //   const recognitionRef = useRef<SpeechRecognition | null>(null);

// // //   // Initialize Speech Recognition
// // //   useEffect(() => {
// // //     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// // //     if (SpeechRecognition) {
// // //       const recognition = new SpeechRecognition();
// // //       recognition.continuous = true;
// // //       recognition.interimResults = true;
// // //       recognition.lang = selectedLanguage;

// // //       recognition.onresult = (event: SpeechRecognitionEvent) => {
// // //         let interim = '';
// // //         let final = '';
// // //         for (let i = event.resultIndex; i < event.results.length; i++) {
// // //           const text = event.results[i][0].transcript;
// // //           if (event.results[i].isFinal) {
// // //             final += text + ' ';
// // //           } else {
// // //             interim = text;
// // //           }
// // //         }
// // //         setTranscript(prev => prev + final);
// // //         setInterimTranscript(interim);
// // //       };

// // //       recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
// // //         console.error('Speech recognition error:', event.error);
// // //         setErrorMessage(`Speech recognition error: ${event.error}`);
// // //       };

// // //       recognition.onend = () => {
// // //         if (status === 'recording' && !isProcessingQuestion) {
// // //           try {
// // //             recognition.start();
// // //           } catch (error) {
// // //             console.error('Failed to restart speech recognition:', error);
// // //           }
// // //         }
// // //       };

// // //       recognitionRef.current = recognition;
// // //       return () => recognition.stop();
// // //     } else {
// // //       setErrorMessage('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
// // //     }
// // //   }, [selectedLanguage, status, isProcessingQuestion]);

// // //   // Ensure voices are loaded before using speech synthesis
// // //   useEffect(() => {
// // //     const loadVoices = () => {
// // //       if (window.speechSynthesis.getVoices().length > 0) {
// // //         setVoicesLoaded(true);
// // //       } else {
// // //         window.speechSynthesis.onvoiceschanged = () => {
// // //           setVoicesLoaded(true);
// // //           window.speechSynthesis.onvoiceschanged = null; // Clean up
// // //         };
// // //       }
// // //     };
// // //     loadVoices();
// // //   }, []);

// // //   // Request microphone and camera permission
// // //   useEffect(() => {
// // //     const initializeMedia = async () => {
// // //       try {
// // //         setLoadingMessage('Initializing camera and microphone...');
// // //         const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
// // //         console.log('Media stream initialized:', stream);
// // //         if (videoRef.current) {
// // //           videoRef.current.srcObject = stream;
// // //           videoRef.current.play().then(() => {
// // //             console.log('Webcam video playing');
// // //             setIsVideoReady(true);
// // //           }).catch(error => {
// // //             console.error('Failed to play video stream:', error);
// // //             setErrorMessage('Failed to play webcam video. Please ensure camera permissions are granted.');
// // //           });
// // //         }
// // //         setLoadingMessage('');
// // //       } catch (error: any) {
// // //         console.error('Failed to access media devices:', error.message || error);
// // //         setErrorMessage('Failed to access microphone or camera. Please ensure permissions are granted and try again.');
// // //         setLoadingMessage('');
// // //       }
// // //     };
// // //     initializeMedia();
// // //     return () => {
// // //       if (videoRef.current?.srcObject) {
// // //         const stream = videoRef.current.srcObject as MediaStream;
// // //         stream.getTracks().forEach(track => track.stop());
// // //         videoRef.current.srcObject = null;
// // //         setIsVideoReady(false);
// // //       }
// // //     };
// // //   }, []);

// // //   // Update video stream from ReactMediaRecorder
// // //   useEffect(() => {
// // //     if (videoRef.current && previewStream && !isVideoReady) {
// // //       console.log('Assigning previewStream to videoRef:', previewStream);
// // //       videoRef.current.srcObject = previewStream;
// // //       videoRef.current.play().then(() => {
// // //         console.log('Preview stream playing');
// // //         setIsVideoReady(true);
// // //       }).catch(error => {
// // //         console.error('Failed to play previewStream:', error);
// // //         setErrorMessage('Failed to display webcam video. Please ensure camera permissions are granted.');
// // //       });
// // //     }
// // //   }, [previewStream, isVideoReady]);

// // //   // Timeout for video initialization
// // //   useEffect(() => {
// // //     if (!isVideoReady) {
// // //       const timeout = setTimeout(() => {
// // //         if (!isVideoReady) {
// // //           setErrorMessage('Webcam video failed to initialize. Please check your camera and permissions.');
// // //         }
// // //       }, 10000); // 10 seconds timeout
// // //       return () => clearTimeout(timeout);
// // //     }
// // //   }, [isVideoReady]);

// // //   // Log environment variables for debugging
// // //   useEffect(() => {
// // //     if (isVideoReady) {
// // //       console.log('Environment variables:', {
// // //         django: process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE,
// // //         springboot: process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE,
// // //         fileBaseUrl: process.env.REACT_APP_SPRINGBOOT_FILE_BASE_URL,
// // //         organisation,
// // //         selectedLanguage,
// // //       });
// // //     }
// // //   }, [organisation, selectedLanguage, isVideoReady]);

// // //   // Fetch questions only after video is ready
// // //   useEffect(() => {
// // //     if (!isVideoReady) return;

// // //     const fetchQuestions = async () => {
// // //       try {
// // //         setLoadingMessage('Loading interview questions...');
// // //         const response = await axios.post(
// // //           `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_interview_data/`,
// // //           { object_id: objId },
// // //           { headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation } }
// // //         );
// // //         setQuestions(response.data.data.questions);
// // //         setUploadStatus(new Array(response.data.data.questions.length).fill(false));
// // //         setHasSpokenQuestion(new Array(response.data.data.questions.length).fill(false));
// // //         setLoadingMessage('');
// // //       } catch (error: any) {
// // //         console.error('Error fetching questions:', error.message || error);
// // //         setErrorMessage('Failed to fetch questions. Please try again.');
// // //         setLoadingMessage('');
// // //       }
// // //     };
// // //     fetchQuestions();
// // //   }, [objId, organisation, isVideoReady]);

// // //   // Start/stop speech recognition with recording status
// // //   useEffect(() => {
// // //     if (recognitionRef.current && status === 'recording' && !isProcessingQuestion && isVideoReady) {
// // //       try {
// // //         recognitionRef.current.start();
// // //         console.log('Speech recognition started.');
// // //       } catch (error) {
// // //         console.error('Failed to start speech recognition:', error);
// // //         setErrorMessage('Failed to start speech recognition. Please check your microphone.');
// // //       }
// // //     } else if (recognitionRef.current) {
// // //       recognitionRef.current.stop();
// // //       console.log('Speech recognition stopped.');
// // //     }
// // //   }, [status, isProcessingQuestion, isVideoReady]);

// // //   // Text-to-speech for reading questions only after video is ready and voices are loaded
// // //   useEffect(() => {
// // //     if (
// // //       !isVideoReady ||
// // //       !voicesLoaded ||
// // //       questions.length === 0 ||
// // //       !questions[currentQuestion]?.question ||
// // //       hasSpokenQuestion[currentQuestion] ||
// // //       isUploading ||
// // //       isSubmitting ||
// // //       isProcessingQuestion ||
// // //       !lipSyncVideoRef.current
// // //     ) return;

// // //     const videoElement = lipSyncVideoRef.current;
// // //     const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].question);
// // //     utterance.lang = selectedLanguage;

// // //     // Select a female voice
// // //     const voices = window.speechSynthesis.getVoices();
// // //     const femaleVoice = voices.find(voice =>
// // //       voice.name.toLowerCase().includes('female') ||
// // //       voice.name.toLowerCase().includes('woman') ||
// // //       voice.name.includes('Samantha') ||
// // //       voice.name.includes('Victoria') ||
// // //       voice.name.includes('Zira') ||
// // //       voice.name.includes('Tessa') ||
// // //       voice.name.includes('Google US English')
// // //     );
// // //     if (femaleVoice) {
// // //       utterance.voice = femaleVoice;
// // //       console.log(`Using female voice: ${femaleVoice.name}`);
// // //     } else {
// // //       console.warn('No female voice found, using default voice.');
// // //     }

// // //     utterance.onstart = () => {
// // //       if (videoElement) {
// // //         videoElement.play().catch(error => {
// // //           console.error('Failed to play lip-sync video:', error);
// // //           setErrorMessage('Failed to play video avatar.');
// // //         });
// // //       }
// // //     };

// // //     utterance.onend = () => {
// // //       setHasSpokenQuestion(prev => {
// // //         const updated = [...prev];
// // //         updated[currentQuestion] = true;
// // //         return updated;
// // //       });

// // //       if (videoElement) {
// // //         videoElement.pause();
// // //         videoElement.currentTime = 0;
// // //       }

// // //       if (status !== 'recording') {
// // //         startRecording();
// // //         console.log(`Recording started for question ${currentQuestion + 1}.`);
// // //       }
// // //     };

// // //     utterance.onerror = (event) => {
// // //       console.error('Speech synthesis error:', event);
// // //       setErrorMessage('Failed to read question aloud.');
// // //       setHasSpokenQuestion(prev => {
// // //         const updated = [...prev];
// // //         updated[currentQuestion] = true;
// // //         return updated;
// // //       });
// // //     };

// // //     // Delay to ensure video and speech sync
// // //     setTimeout(() => {
// // //       window.speechSynthesis.speak(utterance);
// // //     }, 500);

// // //     return () => {
// // //       window.speechSynthesis.cancel();
// // //       if (videoElement) {
// // //         videoElement.pause();
// // //         videoElement.currentTime = 0;
// // //       }
// // //     };
// // //   }, [currentQuestion, questions, selectedLanguage, startRecording, status, isUploading, isSubmitting, isProcessingQuestion, hasSpokenQuestion, isVideoReady, voicesLoaded]);

// // //   const updateAnswer = async (
// // //     questionText: string,
// // //     answer: string,
// // //     index: number,
// // //     blobUrl?: string | null,
// // //     forceUpload = false
// // //   ) => {
// // //     try {
// // //       setIsUploading(true);
// // //       setLoadingMessage(`Processing Question ${index + 1}...`);
// // //       setUploadProgress(0);
// // //       let uploadedVideoUrl: string | null = null;

// // //       if (blobUrl && (!uploadStatus[index] || forceUpload)) {
// // //         setLoadingMessage(`Uploading video for Question ${index + 1}...`);
// // //         setUploadProgress(25);
// // //         const response = await fetch(blobUrl);
// // //         const blob = await response.blob();

// // //         if (blob.size > 0) {
// // //           const file = new File([blob], `interview-q${index + 1}.mp4`, { type: 'video/mp4' });
// // //           const formData = new FormData();
// // //           formData.append('videoFile', file);
// // //           formData.append('meetingId', objId);
// // //           formData.append('transcript', answer);

// // //           const uploadResponse = await axios.post(
// // //             `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/recording/write/${organisation}`,
// // //             formData,
// // //             {
// // //               headers: { 'Content-Type': 'multipart/form-data' },
// // //               onUploadProgress: (progressEvent) => {
// // //                 if (progressEvent.total) {
// // //                   const progress = Math.round((progressEvent.loaded * 50) / progressEvent.total);
// // //                   setUploadProgress(25 + progress);
// // //                 }
// // //               }
// // //             }
// // //           );

// // //           // Use the outputFileName from the backend response
// // //           uploadedVideoUrl = uploadResponse.data.outputFileName;
// // //           setUploadProgress(75);

// // //           // Verify video availability with retries
// // //           if (uploadedVideoUrl) {
// // //             let retries = 5;
// // //             let delay = 2000;
// // //             while (retries > 0) {
// // //               try {
// // //                 const verifyResponse = await axios.get(uploadedVideoUrl, {
// // //                   responseType: 'blob',
// // //                   headers: { Accept: 'video/mp4' },
// // //                 });
// // //                 if (verifyResponse.status === 200 && verifyResponse.data.type === 'video/mp4') {
// // //                   break;
// // //                 }
// // //               } catch (urlError: any) {
// // //                 console.error(`Attempt ${6 - retries} failed for Question ${index + 1}: ${urlError.message}`);
// // //                 retries--;
// // //                 if (retries === 0) {
// // //                   uploadedVideoUrl = null;
// // //                   setErrorMessage(`Failed to verify video for Question ${index + 1} after multiple attempts.`);
// // //                   break;
// // //                 }
// // //                 await new Promise(resolve => setTimeout(resolve, delay));
// // //                 delay *= 2;
// // //               }
// // //             }
// // //           } else {
// // //             setErrorMessage(`No video URL returned from backend for Question ${index + 1}.`);
// // //           }

// // //           setUploadStatus((prev) => {
// // //             const updated = [...prev];
// // //             updated[index] = true;
// // //             return updated;
// // //           });
// // //         }
// // //       }

// // //       setLoadingMessage(`Updating answer for Question ${index + 1}...`);
// // //       setUploadProgress(85);
// // //       await axios.post(
// // //         `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/update_answer/`,
// // //         {
// // //           object_id: objId,
// // //           question_text: questionText,
// // //           answer: answer || 'No answer provided',
// // //         },
// // //         { headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation } }
// // //       );

// // //       if (uploadedVideoUrl) {
// // //         setUploadProgress(95);
// // //         await axios.post(
// // //           `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/process_video/`,
// // //           {
// // //             video_url: uploadedVideoUrl,
// // //             meeting_id: meetingId,
// // //             object_id: objId,
// // //             question_index: index,
// // //           },
// // //           { headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation } }
// // //         );
// // //       }

// // //       setUploadProgress(100);
// // //       setTranscript('');
// // //       setInterimTranscript('');
// // //       setLastBlobUrl(null);
// // //     } catch (error: any) {
// // //       console.error(`Error processing Question ${index + 1}:`, error.message || error);
// // //       setErrorMessage(`Failed to process Question ${index + 1}. Please try again.`);
// // //     } finally {
// // //       setIsUploading(false);
// // //       setLoadingMessage('');
// // //       setUploadProgress(0);
// // //     }
// // //   };

// // //   const handleNextQuestion = () => {
// // //     stopRecording();
// // //     setLastBlobUrl(mediaBlobUrl ?? null);
// // //     setOpenNextDialog(true);
// // //   };

// // //   const handleDialogYes = async () => {
// // //     setOpenNextDialog(false);
// // //     if (questions[currentQuestion]?.question) {
// // //       setIsProcessingQuestion(true);
// // //       await updateAnswer(questions[currentQuestion].question, transcript, currentQuestion, lastBlobUrl ?? mediaBlobUrl);
// // //       setCurrentQuestion((prev) => prev + 1);
// // //       setIsProcessingQuestion(false);
// // //     } else {
// // //       setErrorMessage('No question available to process.');
// // //     }
// // //   };

// // //   const handleSubmitInterview = async () => {
// // //     setIsSubmitting(true);
// // //     setLoadingMessage('Submitting your interview...');
// // //     setSubmissionProgress(0);
// // //     stopRecording();

// // //     // Process current question if it exists
// // //     if (questions[currentQuestion]?.question) {
// // //       await updateAnswer(questions[currentQuestion].question, transcript, currentQuestion, mediaBlobUrl ?? null);
// // //     }

// // //     // Process any unanswered questions
// // //     for (let i = 0; i < questions.length; i++) {
// // //       if (!uploadStatus[i]) {
// // //         const emptyBlob = new Blob([], { type: 'video/mp4' });
// // //         const fileUrl = URL.createObjectURL(emptyBlob);
// // //         await updateAnswer(questions[i].question, '', i, fileUrl, true);
// // //       }
// // //     }

// // //     setLoadingMessage('Processing interview results...');
// // //     try {
// // //       const apiEndpoints = [
// // //         {
// // //           url: `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/interview/Thankingmail/${organisation}`,
// // //           data: { meetingId },
// // //           headers: { 'Content-Type': 'application/json' },
// // //           name: 'Thanking Email'
// // //         },
// // //         {
// // //           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/interview_status/`,
// // //           data: { object_id: objId, interview_status: 'completed' },
// // //           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
// // //           name: 'Interview Status'
// // //         },
// // //         {
// // //           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/generate_feedback/`,
// // //           data: { object_id: objId, language_selected: selectedLanguage },
// // //           headers: { 'Content-Type': 'multipart/form-data', organization: organisation, Organization: organisation },
// // //           name: 'Generate Feedback'
// // //         },
// // //         {
// // //           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/analyze_questions/`,
// // //           data: { object_id: objId, language_selected: selectedLanguage },
// // //           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
// // //           name: 'Analyze Questions'
// // //         },
// // //         {
// // //           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/batch_process_interview_analysis/`,
// // //           data: { object_id: objId, language_selected: selectedLanguage },
// // //           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
// // //           name: 'Batch Process Analysis'
// // //         },
// // //         {
// // //           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract_soft_skills/`,
// // //           data: { object_id: objId, language_selected: selectedLanguage },
// // //           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
// // //           name: 'Extract Soft Skills'
// // //         },
// // //         {
// // //           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract_strengths_areas/`,
// // //           data: { object_id: objId, language_selected: selectedLanguage },
// // //           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
// // //           name: 'Extract Strengths Areas'
// // //         },
// // //         {
// // //           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract-techskills-scores/`,
// // //           data: { object_id: objId, language_selected: selectedLanguage },
// // //           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
// // //           name: 'Extract Tech Skills Scores'
// // //         },
// // //       ];

// // //       const totalApis = apiEndpoints.length;
// // //       let completedApis = 0;
// // //       const failedApis: string[] = [];

// // //       const apiPromises = apiEndpoints.map(async (api, index) => {
// // //         try {
// // //           setLoadingMessage(`Processing ${api.name} (${index + 1} of ${totalApis})...`);
// // //           const response = await axios.post(api.url, api.data, { headers: api.headers });
// // //           console.log(`API ${api.name} completed with status: ${response.status}`);
// // //           completedApis += 1;
// // //           setSubmissionProgress((completedApis / totalApis) * 100);
// // //           return response;
// // //         } catch (error: any) {
// // //           console.error(`Failed to process ${api.name}:`, error.response?.data || error.message || error);
// // //           failedApis.push(api.name);
// // //           completedApis += 1;
// // //           setSubmissionProgress((completedApis / totalApis) * 100);
// // //           return null;
// // //         }
// // //       });

// // //       await Promise.all(apiPromises);

// // //       setLoadingMessage('All processing complete, redirecting...');
// // //       setSubmissionProgress(100);

// // //       if (failedApis.length > 0) {
// // //         setErrorMessage(`Some processes failed: ${failedApis.join(', ')}. Redirecting to sign-in page.`);
// // //       }

// // //       console.log('Attempting navigation to /signin');
// // //       navigate('/signin');
// // //     } catch (error: any) {
// // //       console.error('Unexpected error during submission:', error.message || error);
// // //       setErrorMessage(`Unexpected error during submission: ${error.message}. Redirecting to sign-in page.`);
// // //       setSubmissionProgress(100);
// // //       navigate('/signin');
// // //     } finally {
// // //       setIsSubmitting(false);
// // //       setLoadingMessage('');
// // //       setSubmissionProgress(0);
// // //     }
// // //   };

// // //   const handleEditorChange = (value: string | undefined) => setCode(value || '');
// // //   const handleUpload = () => fileInputRef.current?.click();

// // //   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
// // //     const file = event.target.files?.[0];
// // //     if (!file) return;
// // //     const formData = new FormData();
// // //     formData.append('file', file);
// // //     formData.append('meetingid', meetingId);
// // //     try {
// // //       await axios.post(
// // //         `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/LiveUpload/upload/${organisation}`,
// // //         formData,
// // //         { headers: { 'Content-Type': 'multipart/form-data' } }
// // //       );
// // //       alert('File uploaded successfully');
// // //     } catch (error: any) {
// // //       console.error('Upload failed:', error.message || error);
// // //       alert('File upload failed');
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     const handleClickOutside = (event: MouseEvent) => {
// // //       if (showEditor && editorRef.current && !editorRef.current.contains(event.target as Node)) {
// // //         setShowEditor(false);
// // //       }
// // //     };
// // //     document.addEventListener('mousedown', handleClickOutside);
// // //     return () => document.removeEventListener('mousedown', handleClickOutside);
// // //   }, [showEditor]);

// // //   return (
// // //     <div style={{ position: "relative", height: "100vh", backgroundColor: "black", overflow: "hidden" }}>
// // //       {(isUploading || isSubmitting || isProcessingQuestion || loadingMessage) && (
// // //         <ProfessionalLoader
// // //           message={loadingMessage || 'Processing'}
// // //           progress={isSubmitting ? submissionProgress : uploadProgress > 0 ? uploadProgress : undefined}
// // //         />
// // //       )}

// // //       {/* Two Column Layout */}
// // //       <div style={{
// // //         display: "flex",
// // //         height: "100vh",
// // //         backgroundColor: "black"
// // //       }}>

// // //         {/* First Column - React Media Recorder Video */}
// // //         <div style={{
// // //           flex: "0 0 55%",
// // //           position: "relative",
// // //           backgroundColor: "black"
// // //         }}>
// // //           <video
// // //             ref={videoRef}
// // //             autoPlay
// // //             muted
// // //             playsInline
// // //             style={{
// // //               width: "100%",
// // //               height: "100%",
// // //               objectFit: "cover",
// // //               backgroundColor: "black"
// // //             }}
// // //           />
// // //         </div>

// // //         {/* Second Column - Video, Questions, and Buttons */}
// // //         <div style={{
// // //           flex: "0 0 45%",
// // //           display: "flex",
// // //           flexDirection: "column",
// // //           backgroundColor: "black",
// // //           padding: "1rem"
// // //         }}>

// // //           {/* Row 1: Lip Sync Video */}
// // //           <div style={{
// // //             flex: "0 0 200px",
// // //             display: "flex",

// // //             marginBottom: "1rem"
// // //           }}>
// // //             <video
// // //               ref={lipSyncVideoRef}

// // //               muted
// // //               style={{
// // //                 width: '90%',       // full width
// // //                 height: '200px',     // fixed height
// // //                 backgroundColor: 'transparent',
// // //                 borderRadius: '16px',
// // //                 boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
// // //                 objectFit: 'cover'   // keeps video aspect ratio and fills
// // //               }}
// // //             >
// // //               <source
// // //                 src={`${process.env.PUBLIC_URL}/assets/static/images/20240913132119-119 (online-video-cutter.com).mp4`}
// // //                 type="video/mp4"
// // //               />
// // //             </video>
// // //           </div>

// // //           {/* Row 2: Questions Section */}
// // //           <div style={{
// // //             flex: "1",
// // //             marginBottom: "1rem"
// // //           }}>
// // //             <div style={{
// // //               background: "rgba(0,0,0,0.7)",
// // //               padding: "1rem",
// // //               borderRadius: "16px",
// // //               backdropFilter: 'blur(10px)',
// // //               border: '1px solid rgba(255,255,255,0.1)',
// // //               height: "70%",
// // //               color: "white",
// // //               width: "85%"
// // //             }}>
// // //               <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
// // //                 <Typography variant="h6" style={{ fontWeight: 'bold', marginRight: '1rem' }}>
// // //                   Question {currentQuestion + 1}/{questions.length}
// // //                 </Typography>
// // //                 {uploadStatus[currentQuestion] ? (
// // //                   <CheckCircle style={{ color: '#4caf50', fontSize: '24px' }} />
// // //                 ) : (
// // //                   <div style={{ display: 'flex', alignItems: 'center' }}>
// // //                     <MicIcon style={{ color: status === 'recording' ? '#f44336' : '#fff', fontSize: '20px', marginRight: '0.5rem' }} />
// // //                     {status === 'recording' && <div style={{ width: '8px', height: '8px', backgroundColor: '#f44336', borderRadius: '50%', animation: 'pulse 1s infinite' }} />}
// // //                   </div>
// // //                 )}
// // //               </div>
// // //               <Typography variant="body1" style={{ marginBottom: '1rem', lineHeight: '1.4' }}>
// // //                 {isVideoReady && questions[currentQuestion]?.question ? questions[currentQuestion].question : "Waiting for webcam to initialize..."}
// // //               </Typography>
// // //               <div style={{
// // //                 background: 'rgba(255,255,255,0.1)',
// // //                 padding: '1rem',
// // //                 borderRadius: '8px',
// // //                 minHeight: '80px',
// // //                 display: 'none'
// // //               }}>
// // //                 <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
// // //                   Your Answer:
// // //                 </Typography>
// // //                 <Typography variant="body2" style={{ fontStyle: transcript || interimTranscript ? 'normal' : 'italic' }}>
// // //                   {transcript || interimTranscript || 'Start speaking to see your answer here...'}
// // //                 </Typography>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Row 3: Control Buttons */}
// // //           <div style={{
// // //             flex: "0 0 auto",
// // //             display: 'flex',
// // //             flexDirection: 'column',
// // //             width:"90%",
// // //             padding:'5px'
// // //           }}>


// // //             {/* Main Action Buttons Row */}
// // //             <div style={{
// // //               display: 'flex',
// // //               gap: "1rem",
// // //               justifyContent: 'center'
// // //             }}>
// // //               <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px', pointerEvents: 'none', opacity: 0.5 }}>
// // //                 <MicIcon />
// // //               </IconButton>
// // //               <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px', pointerEvents: 'none', opacity: 0.5 }}>
// // //                 <VideocamIcon />
// // //               </IconButton>
// // //               {/* <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px' }}>
// // //                 <VolumeUpIcon />
// // //               </IconButton> */}
// // //               <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px' }} onClick={() => setShowEditor(true)}>
// // //                 <CodeIcon />
// // //               </IconButton>
// // //               <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
// // //               <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px' }} onClick={handleUpload}>
// // //                 <AttachFileIcon />
// // //               </IconButton>
// // //               {currentQuestion === questions.length - 1 ? (
// // //                 <Button
// // //                   onClick={() => setOpenSubmitDialog(true)}
// // //                   variant="contained"
// // //                   disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
// // //                   style={{
// // //                     backgroundColor: '#4caf50',
// // //                     color: 'white',

// // //                     display: "flex",
// // //                     alignItems: "center",
// // //                     justifyContent: "center",
// // //                     padding: "10px 15px",
// // //                     borderRadius: "8px",
// // //                     fontWeight: "bold",
// // //                     minWidth: "150px",
// // //                   }}
// // //                 >
// // //                   {isUploading || isSubmitting || isProcessingQuestion ? (
// // //                     <div style={{ display: 'flex', alignItems: 'center' }}>
// // //                       <CircularProgress size={20} style={{ marginRight: '8px', color: 'white' }} />
// // //                       Processing...
// // //                     </div>
// // //                   ) : (
// // //                     "Submit Interview"
// // //                   )}
// // //                 </Button>
// // //               ) : (
// // //                 <Button
// // //                   onClick={handleNextQuestion}
// // //                   variant="contained"
// // //                   disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
// // //                   style={{
// // //                     backgroundColor: '#2196f3',
// // //                     display: "flex",
// // //                     alignItems: "center",
// // //                     justifyContent: "center",
// // //                     padding: "12px 15px",
// // //                     borderRadius: "8px",
// // //                     fontWeight: "bold",
// // //                     minWidth: "150px",
// // //                   }}
// // //                 >
// // //                   {isUploading || isSubmitting || isProcessingQuestion ? (
// // //                     <div style={{ display: 'flex', alignItems: 'center' }}>
// // //                       <CircularProgress size={20} style={{ marginRight: '8px', color: 'white' }} />
// // //                       Processing...
// // //                     </div>
// // //                   ) : (
// // //                     "Next Question"
// // //                   )}
// // //                 </Button>
// // //               )}

// // //               <Button
// // //                 onClick={() => setOpenSubmitDialog(true)}
// // //                 variant="outlined"
// // //                 disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
// // //                 style={{
// // //                   backgroundColor: '#2196f3',
// // //                   display: "flex",
// // //                   alignItems: "center",
// // //                   justifyContent: "center",
// // //                   padding: "10px 15px",
// // //                   borderRadius: "8px",
// // //                   fontWeight: "bold",
// // //                   minWidth: "150px",
// // //                   color:"#fff"
// // //                 }}
// // //               >
// // //                 {isUploading || isSubmitting || isProcessingQuestion ? (
// // //                   <div style={{ display: 'flex', alignItems: 'center' }}>
// // //                     <CircularProgress size={16} style={{ marginRight: '8px', color: '#ff9800' }} />
// // //                     Processing...
// // //                   </div>
// // //                 ) : (
// // //                   "End Interview"
// // //                 )}
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Code Editor Modal */}
// // //       {showEditor && (
// // //         <Box
// // //           ref={editorRef}
// // //           sx={{
// // //             position: 'absolute',
// // //             top: '50%',
// // //             left: '50%',
// // //             transform: 'translate(-50%, -50%)',
// // //             width: '60%',
// // //             height: '45vh',
// // //             bgcolor: 'background.paper',
// // //             borderRadius: '12px',
// // //             boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
// // //             p: 1,
// // //             border: '1px solid rgba(255,255,255,0.2)',
// // //             zIndex: 4
// // //           }}
// // //         >
// // //           <Editor
// // //             height="100%"
// // //             width="100%"
// // //             language="javascript"
// // //             value={code}
// // //             onChange={handleEditorChange}
// // //             theme="vs-dark"
// // //           />
// // //         </Box>
// // //       )}

// // //       {/* Dialog for Next Question */}
// // //       <Dialog
// // //         open={openNextDialog}
// // //         onClose={() => setOpenNextDialog(false)}
// // //         PaperProps={{
// // //           style: {
// // //             borderRadius: '16px',
// // //             padding: '8px',
// // //             zIndex: 5
// // //           }
// // //         }}
// // //       >
// // //         <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
// // //           Proceed to Next Question
// // //         </DialogTitle>
// // //         <DialogContent style={{ textAlign: 'center', padding: '20px' }}>
// // //           <Typography variant="body1">
// // //             Are you ready to move to the next question? Your current answer will be saved.
// // //           </Typography>
// // //         </DialogContent>
// // //         <DialogActions style={{ justifyContent: 'center', padding: '16px' }}>
// // //           <Button
// // //             onClick={() => setOpenNextDialog(false)}
// // //             variant="outlined"
// // //             style={{ marginRight: '12px' }}
// // //           >
// // //             Cancel
// // //           </Button>
// // //           <Button
// // //             onClick={handleDialogYes}
// // //             variant="contained"
// // //             disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
// // //             style={{ backgroundColor: '#2196f3' }}
// // //           >
// // //             {isUploading || isSubmitting || isProcessingQuestion ? (
// // //               <CircularProgress size={24} style={{ color: 'white' }} />
// // //             ) : (
// // //               "Yes, Continue"
// // //             )}
// // //           </Button>
// // //         </DialogActions>
// // //       </Dialog>

// // //       {/* Dialog for Submit Interview */}
// // //       <Dialog
// // //         open={openSubmitDialog}
// // //         onClose={() => setOpenSubmitDialog(false)}
// // //         PaperProps={{
// // //           style: {
// // //             borderRadius: '16px',
// // //             padding: '8px',
// // //             zIndex: 5
// // //           }
// // //         }}
// // //       >
// // //         <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
// // //           Submit Interview
// // //         </DialogTitle>
// // //         <DialogContent style={{ textAlign: 'center', padding: '20px' }}>
// // //           <Typography variant="body1" style={{ marginBottom: '16px' }}>
// // //             Are you sure you want to submit your interview? This action cannot be undone.
// // //           </Typography>
// // //           <Typography variant="body2" color="textSecondary">
// // //             We will process your responses and send you feedback via email.
// // //           </Typography>
// // //         </DialogContent>
// // //         <DialogActions style={{ justifyContent: 'center', padding: '16px' }}>
// // //           <Button
// // //             onClick={() => setOpenSubmitDialog(false)}
// // //             variant="outlined"
// // //             style={{ marginRight: '12px' }}
// // //           >
// // //             Cancel
// // //           </Button>
// // //           <Button
// // //             onClick={handleSubmitInterview}
// // //             variant="contained"
// // //             disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
// // //             style={{ backgroundColor: '#4caf50' }}
// // //           >
// // //             {isUploading || isSubmitting || isProcessingQuestion ? (
// // //               <CircularProgress size={24} style={{ color: 'white' }} />
// // //             ) : (
// // //               "Submit Interview"
// // //             )}
// // //           </Button>
// // //         </DialogActions>
// // //       </Dialog>

// // //       {/* Error Message Snackbar */}
// // //       <Snackbar
// // //         open={!!errorMessage}
// // //         autoHideDuration={6000}
// // //         onClose={() => setErrorMessage(null)}
// // //         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
// // //       >
// // //         <Alert
// // //           severity="error"
// // //           onClose={() => setErrorMessage(null)}
// // //           style={{ borderRadius: '12px', zIndex: 6 }}
// // //         >
// // //           {errorMessage}
// // //         </Alert>
// // //       </Snackbar>

// // //       {/* CSS Animation */}
// // //       <style>{`
// // //         @keyframes pulse {
// // //           0% { opacity: 1; }
// // //           50% { opacity: 0.5; }
// // //           100% { opacity: 1; }
// // //         }
// // //       `}</style>
// // //     </div>
// // //   );
// // // };

// // // const InterviewAttend: React.FC = () => (
// // //   <ReactMediaRecorder
// // //     video
// // //     audio
// // //     render={(props: ReactMediaRecorderRenderProps) => <RecorderView {...props} />}
// // //   />
// // // );

// // // export default InterviewAttend;
// // import React, { useRef, useEffect, useState } from "react";
// // import { useLocation, useNavigate } from 'react-router-dom';
// // import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, LinearProgress, Typography, IconButton } from '@mui/material';
// // import { CheckCircle } from '@mui/icons-material';
// // import VideocamIcon from '@mui/icons-material/Videocam';
// // import CodeIcon from '@mui/icons-material/Code';
// // import AttachFileIcon from '@mui/icons-material/AttachFile';
// // import MicIcon from '@mui/icons-material/Mic';
// // import { ReactMediaRecorder, ReactMediaRecorderRenderProps } from "react-media-recorder";
// // import { Editor } from '@monaco-editor/react';
// // import axios from 'axios';
// // import { t } from "i18next";

// // // Speech Recognition Interfaces
// // interface SpeechRecognition extends EventTarget {
// //   continuous: boolean;
// //   interimResults: boolean;
// //   lang: string;
// //   onresult: (event: SpeechRecognitionEvent) => void;
// //   onerror: (event: SpeechRecognitionErrorEvent) => void;
// //   onend: () => void;
// //   start: () => void;
// //   stop: () => void;
// // }

// // interface SpeechRecognitionEvent {
// //   resultIndex: number;
// //   results: SpeechRecognitionResultList;
// // }

// // interface SpeechRecognitionErrorEvent { error: string; }

// // interface SpeechRecognitionResultList { [index: number]: SpeechRecognitionResult; length: number; }

// // interface SpeechRecognitionResult { isFinal: boolean; [index: number]: SpeechRecognitionAlternative; }

// // interface SpeechRecognitionAlternative { transcript: string; }

// // declare global {
// //   interface Window { SpeechRecognition: new () => SpeechRecognition; webkitSpeechRecognition: new () => SpeechRecognition; }
// // }

// // // Professional Loading Component
// // const ProfessionalLoader: React.FC<{ message: string; progress?: number }> = ({ message, progress }) => (
// //   <div style={{
// //     position: 'fixed',
// //     top: 0,
// //     left: 0,
// //     width: '100%',
// //     height: '100%',
// //     backgroundColor: 'rgba(0, 0, 0, 0.85)',
// //     display: 'flex',
// //     flexDirection: 'column',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     zIndex: 9999,
// //     backdropFilter: 'blur(8px)'
// //   }}>
// //     <div style={{
// //       backgroundColor: 'rgba(255, 255, 255, 0.95)',
// //       padding: '2rem 3rem',
// //       borderRadius: '16px',
// //       boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
// //       textAlign: 'center',
// //       minWidth: '300px',
// //       border: '1px solid rgba(255, 255, 255, 0.2)'
// //     }}>
// //       <CircularProgress
// //         size={60}
// //         thickness={4}
// //         style={{
// //           color: '#1976d2',
// //           marginBottom: '1.5rem',
// //           filter: 'drop-shadow(0 4px 8px rgba(25, 118, 210, 0.3))'
// //         }}
// //       />
// //       <Typography
// //         variant="h6"
// //         style={{
// //           marginBottom: '1rem',
// //           color: '#333',
// //           fontWeight: '600',
// //           letterSpacing: '0.5px'
// //         }}
// //       >
// //         {message}
// //       </Typography>
// //       {progress !== undefined && (
// //         <Box sx={{ width: '100%', mt: 2 }}>
// //           <LinearProgress
// //             variant="determinate"
// //             value={progress}
// //             style={{
// //               height: '6px',
// //               borderRadius: '3px',
// //               backgroundColor: '#e0e0e0'
// //             }}
// //           />
// //           <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
// //             {Math.round(progress)}% Complete
// //           </Typography>
// //         </Box>
// //       )}
// //     </div>
// //   </div>
// // );

// // const RecorderView: React.FC<ReactMediaRecorderRenderProps> = ({
// //   status, startRecording, stopRecording, previewStream, mediaBlobUrl,
// // }) => {
// //   const videoRef = useRef<HTMLVideoElement | null>(null);
// //   const editorRef = useRef<HTMLDivElement | null>(null);
// //   const lipSyncVideoRef = useRef<HTMLVideoElement | null>(null);
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const organisation = localStorage.getItem('organisation') || '';
// //   const selectedLanguage = localStorage.getItem('i18nextLng') || 'en';
// //   const { meetingId, objId } = location.state || {};

// //   // State Management
// //   const [questions, setQuestions] = useState<{ question: string; answer?: string }[]>([]);
// //   const [currentQuestion, setCurrentQuestion] = useState(0);
// //   const [showEditor, setShowEditor] = useState(false);
// //   const [code, setCode] = useState('');
// //   const [transcript, setTranscript] = useState('');
// //   const [interimTranscript, setInterimTranscript] = useState('');
// //   const [isUploading, setIsUploading] = useState(false);
// //   const [openNextDialog, setOpenNextDialog] = useState(false);
// //   const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [lastBlobUrl, setLastBlobUrl] = useState<string | null>(null);
// //   const [uploadStatus, setUploadStatus] = useState<boolean[]>([]);
// //   const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);
// //   const [hasSpokenQuestion, setHasSpokenQuestion] = useState<boolean[]>([]);
// //   const [loadingMessage, setLoadingMessage] = useState('');
// //   const [uploadProgress, setUploadProgress] = useState(0);
// //   const [submissionProgress, setSubmissionProgress] = useState(0);
// //   const [isVideoReady, setIsVideoReady] = useState(false);
// //   const [voicesLoaded, setVoicesLoaded] = useState(false);
// //   const [isReadingQuestion, setIsReadingQuestion] = useState(false);
// //   const fileInputRef = useRef<HTMLInputElement | null>(null);
// //   const recognitionRef = useRef<SpeechRecognition | null>(null);

// //   // Debug transcript changes
// //   useEffect(() => {
// //     console.log(`Question ${currentQuestion + 1} - Transcript: "${transcript}", Interim: "${interimTranscript}"`);
// //   }, [transcript, interimTranscript, currentQuestion]);

// //   // Initialize Speech Recognition
// //   useEffect(() => {
// //     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// //     if (SpeechRecognition) {
// //       const recognition = new SpeechRecognition();
// //       recognition.continuous = true;
// //       recognition.interimResults = true;
// //       recognition.lang = selectedLanguage === 'ar' ? 'ar-EG' : 'en-US';

// //       recognition.onresult = (event: SpeechRecognitionEvent) => {
// //         if (isReadingQuestion || isProcessingQuestion) {
// //           console.log(`Question ${currentQuestion + 1} - Ignoring speech (TTS: ${isReadingQuestion}, Processing: ${isProcessingQuestion})`);
// //           return;
// //         }

// //         let interim = '';
// //         let final = '';
// //         for (let i = event.resultIndex; i < event.results.length; i++) {
// //           const text = event.results[i][0].transcript;
// //           if (event.results[i].isFinal) {
// //             final += text + ' ';
// //           } else {
// //             interim = text;
// //           }
// //         }

// //         if (final) {
// //           setTranscript(prev => {
// //             const newTranscript = prev + final;
// //             console.log(`Question ${currentQuestion + 1} - Final transcript: "${newTranscript}"`);
// //             setQuestions(prevQuestions => {
// //               const updated = [...prevQuestions];
// //               updated[currentQuestion] = { ...updated[currentQuestion], answer: newTranscript };
// //               console.log(`Question ${currentQuestion + 1} - Stored answer: "${newTranscript}"`);
// //               return updated;
// //             });
// //             return newTranscript;
// //           });
// //         }
// //         setInterimTranscript(interim);
// //         console.log(`Question ${currentQuestion + 1} - Interim transcript: "${interim}"`);
// //       };

// //       recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
// //         console.error(`Question ${currentQuestion + 1} - Speech recognition error: ${event.error}`);
// //       };

// //       recognition.onend = () => {
// //         console.log(`Question ${currentQuestion + 1} - Speech recognition ended`);
// //         if (status === 'recording' && !isProcessingQuestion && !isReadingQuestion && isVideoReady && questions.length > 0) {
// //           try {
// //             recognition.start();
// //             console.log(`Question ${currentQuestion + 1} - Speech recognition restarted`);
// //           } catch (error) {
// //             console.error(`Question ${currentQuestion + 1} - Failed to restart speech recognition:`, error);
// //           }
// //         }
// //       };

// //       recognitionRef.current = recognition;
// //       return () => {
// //         console.log('Cleaning up speech recognition');
// //         recognition.stop();
// //       };
// //     } else {
// //       console.error('Speech recognition not supported in this browser');
// //     }
// //   }, [selectedLanguage, currentQuestion]);

// //   // Control speech recognition
// //   useEffect(() => {
// //     if (recognitionRef.current) {
// //       if (status === 'recording' && !isProcessingQuestion && !isReadingQuestion && isVideoReady && questions.length > 0) {
// //         try {
// //           recognitionRef.current.start();
// //           console.log(`Question ${currentQuestion + 1} - Speech recognition started (status: ${status})`);
// //         } catch (error) {
// //           console.error(`Question ${currentQuestion + 1} - Failed to start speech recognition:`, error);
// //         }
// //       } else {
// //         recognitionRef.current.stop();
// //         console.log(`Question ${currentQuestion + 1} - Speech recognition stopped (status: ${status}, isReading: ${isReadingQuestion}, isProcessing: ${isProcessingQuestion})`);
// //       }
// //     }
// //   }, [status, isProcessingQuestion, isReadingQuestion, isVideoReady, currentQuestion, questions.length]);

// //   // Reset transcript on question change
// //   useEffect(() => {
// //     const storedAnswer = questions[currentQuestion]?.answer || '';
// //     setTranscript(storedAnswer);
// //     setInterimTranscript('');
// //     console.log(`Question ${currentQuestion + 1} - Reset transcript to: "${storedAnswer}"`);
// //   }, [currentQuestion, questions]);

// //   // Load voices for speech synthesis
// //   useEffect(() => {
// //     const loadVoices = () => {
// //       if (window.speechSynthesis.getVoices().length > 0) {
// //         setVoicesLoaded(true);
// //         console.log('Voices loaded');
// //       } else {
// //         window.speechSynthesis.onvoiceschanged = () => {
// //           setVoicesLoaded(true);
// //           window.speechSynthesis.onvoiceschanged = null;
// //           console.log('Voices loaded via onvoiceschanged');
// //         };
// //       }
// //     };
// //     loadVoices();
// //   }, []);

// //   // Initialize media
// //   useEffect(() => {
// //     const initializeMedia = async () => {
// //       try {
// //         setLoadingMessage('Initializing camera and microphone...');
// //         const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
// //         console.log('Media stream initialized');
// //         if (videoRef.current) {
// //           videoRef.current.srcObject = stream;
// //           videoRef.current.play().then(() => {
// //             console.log('Webcam video playing');
// //             setIsVideoReady(true);
// //           }).catch(error => {
// //             console.error('Failed to play video stream:', error);
// //           });
// //         }
// //         setLoadingMessage('');
// //       } catch (error: any) {
// //         console.error('Failed to access media devices:', error.message || error);
// //         setLoadingMessage('');
// //       }
// //     };
// //     initializeMedia();
// //     return () => {
// //       if (videoRef.current?.srcObject) {
// //         const stream = videoRef.current.srcObject as MediaStream;
// //         stream.getTracks().forEach(track => track.stop());
// //         videoRef.current.srcObject = null;
// //         setIsVideoReady(false);
// //       }
// //     };
// //   }, []);

// //   // Update video stream
// //   useEffect(() => {
// //     if (videoRef.current && previewStream && !isVideoReady) {
// //       console.log('Assigning previewStream to videoRef');
// //       videoRef.current.srcObject = previewStream;
// //       videoRef.current.play().then(() => {
// //         console.log('Preview stream playing');
// //         setIsVideoReady(true);
// //       }).catch(error => {
// //         console.error('Failed to play previewStream:', error);
// //       });
// //     }
// //   }, [previewStream, isVideoReady]);

// //   // Video initialization timeout
// //   useEffect(() => {
// //     if (!isVideoReady) {
// //       const timeout = setTimeout(() => {
// //         if (!isVideoReady) {
// //           console.error('Webcam video failed to initialize');
// //         }
// //       }, 10000);
// //       return () => clearTimeout(timeout);
// //     }
// //   }, [isVideoReady]);

// //   // Log environment variables
// //   useEffect(() => {
// //     if (isVideoReady) {
// //       console.log('Environment variables:', {
// //         django: process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE,
// //         springboot: process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE,
// //         fileBaseUrl: process.env.REACT_APP_SPRINGBOOT_FILE_BASE_URL,
// //         organisation,
// //         selectedLanguage,
// //       });
// //     }
// //   }, [organisation, selectedLanguage, isVideoReady]);

// //   // Fetch questions
// //   useEffect(() => {
// //     if (!isVideoReady) return;

// //     const fetchQuestions = async () => {
// //       try {
// //         setLoadingMessage('Loading interview questions...');
// //         const response = await axios.post(
// //           `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_interview_data/`,
// //           { object_id: objId },
// //           { headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation } }
// //         );
// //         setQuestions(response.data.data.questions.map((q: any) => ({ question: q.question, answer: '' })));
// //         setUploadStatus(new Array(response.data.data.questions.length).fill(false));
// //         setHasSpokenQuestion(new Array(response.data.data.questions.length).fill(false));
// //         setLoadingMessage('');
// //       } catch (error: any) {
// //         console.error('Error fetching questions:', error.message || error);
// //         setLoadingMessage('');
// //       }
// //     };
// //     fetchQuestions();
// //   }, [objId, organisation, isVideoReady]);

// //   // Text-to-speech
// //   useEffect(() => {
// //     if (
// //       !isVideoReady ||
// //       !voicesLoaded ||
// //       questions.length === 0 ||
// //       !questions[currentQuestion]?.question ||
// //       hasSpokenQuestion[currentQuestion] ||
// //       isUploading ||
// //       isSubmitting ||
// //       isProcessingQuestion ||
// //       !lipSyncVideoRef.current
// //     ) return;

// //     const videoElement = lipSyncVideoRef.current;
// //     const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].question);
// //     utterance.lang = selectedLanguage;

// //     const voices = window.speechSynthesis.getVoices();
// //     const femaleVoice = voices.find(voice =>
// //       voice.name.toLowerCase().includes('female') ||
// //       voice.name.toLowerCase().includes('woman') ||
// //       voice.name.includes('Samantha') ||
// //       voice.name.includes('Victoria') ||
// //       voice.name.includes('Zira') ||
// //       voice.name.includes('Tessa') ||
// //       voice.name.includes('Google US English')
// //     );
// //     if (femaleVoice) {
// //       utterance.voice = femaleVoice;
// //       console.log(`Question ${currentQuestion + 1} - Using voice: ${femaleVoice.name}`);
// //     } else {
// //       console.warn(`Question ${currentQuestion + 1} - No female voice found`);
// //     }

// //     utterance.onstart = () => {
// //       setIsReadingQuestion(true);
// //       if (recognitionRef.current) {
// //         recognitionRef.current.stop();
// //         console.log(`Question ${currentQuestion + 1} - Speech recognition stopped during TTS`);
// //       }
// //       if (videoElement) {
// //         videoElement.play().catch(error => {
// //           console.error(`Question ${currentQuestion + 1} - Failed to play lip-sync video:`, error);
// //         });
// //       }
// //     };

// //     utterance.onend = () => {
// //       setIsReadingQuestion(false);
// //       setHasSpokenQuestion(prev => {
// //         const updated = [...prev];
// //         updated[currentQuestion] = true;
// //         return updated;
// //       });

// //       if (videoElement) {
// //         videoElement.pause();
// //         videoElement.currentTime = 0;
// //       }

// //       if (status !== 'recording') {
// //         startRecording();
// //         console.log(`Question ${currentQuestion + 1} - Recording started`);
// //       }
// //       if (recognitionRef.current) {
// //         try {
// //           recognitionRef.current.start();
// //           console.log(`Question ${currentQuestion + 1} - Speech recognition started after TTS`);
// //         } catch (error) {
// //           console.error(`Question ${currentQuestion + 1} - Failed to start speech recognition after TTS:`, error);
// //         }
// //       }
// //     };

// //     utterance.onerror = (event) => {
// //       console.error(`Question ${currentQuestion + 1} - Speech synthesis error:`, event);
// //       setIsReadingQuestion(false);
// //       setHasSpokenQuestion(prev => {
// //         const updated = [...prev];
// //         updated[currentQuestion] = true;
// //         return updated;
// //       });
// //     };

// //     setTimeout(() => {
// //       window.speechSynthesis.speak(utterance);
// //       console.log(`Question ${currentQuestion + 1} - Speaking question: "${questions[currentQuestion].question}"`);
// //     }, 500);

// //     return () => {
// //       window.speechSynthesis.cancel();
// //       if (videoElement) {
// //         videoElement.pause();
// //         videoElement.currentTime = 0;
// //       }
// //     };
// //   }, [currentQuestion, questions, selectedLanguage, startRecording, status, isUploading, isSubmitting, isProcessingQuestion, hasSpokenQuestion, isVideoReady, voicesLoaded]);

// //   const updateAnswer = async (
// //     questionText: string,
// //     answer: string,
// //     index: number,
// //     blobUrl?: string | null,
// //     forceUpload = false
// //   ) => {
// //     console.log(`Question ${index + 1} - Updating answer: "${answer}"`);
// //     try {
// //       setIsUploading(true);
// //       setLoadingMessage(`Processing Question ${index + 1}...`);
// //       setUploadProgress(0);
// //       let uploadedVideoUrl: string | null = null;

// //       if (blobUrl && (!uploadStatus[index] || forceUpload)) {
// //         setLoadingMessage(`Uploading video for Question ${index + 1}...`);
// //         setUploadProgress(25);
// //         const response = await fetch(blobUrl);
// //         const blob = await response.blob();

// //         if (blob.size > 0) {
// //           const file = new File([blob], `interview-q${index + 1}.mp4`, { type: 'video/mp4' });
// //           const formData = new FormData();
// //           formData.append('videoFile', file);
// //           formData.append('meetingId', objId);
// //           formData.append('transcript', answer);

// //           const uploadResponse = await axios.post(
// //             `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/recording/write/${organisation}`,
// //             formData,
// //             {
// //               headers: { 'Content-Type': 'multipart/form-data' },
// //               onUploadProgress: (progressEvent) => {
// //                 if (progressEvent.total) {
// //                   const progress = Math.round((progressEvent.loaded * 50) / progressEvent.total);
// //                   setUploadProgress(25 + progress);
// //                 }
// //               }
// //             }
// //           );

// //           uploadedVideoUrl = uploadResponse.data.outputFileName;
// //           setUploadProgress(75);
// //           console.log(`Question ${index + 1} - Video uploaded: ${uploadedVideoUrl}`);

// //           if (uploadedVideoUrl) {
// //             let retries = 5;
// //             let delay = 2000;
// //             while (retries > 0) {
// //               try {
// //                 const verifyResponse = await axios.get(uploadedVideoUrl, {
// //                   responseType: 'blob',
// //                   headers: { Accept: 'video/mp4' },
// //                 });
// //                 if (verifyResponse.status === 200 && verifyResponse.data.type === 'video/mp4') {
// //                   console.log(`Question ${index + 1} - Video URL verified`);
// //                   break;
// //                 }
// //               } catch (urlError: any) {
// //                 console.error(`Question ${index + 1} - Attempt ${6 - retries} failed to verify video: ${urlError.message}`);
// //                 retries--;
// //                 if (retries === 0) {
// //                   uploadedVideoUrl = null;
// //                   console.error(`Question ${index + 1} - Failed to verify video after multiple attempts`);
// //                   break;
// //                 }
// //                 await new Promise(resolve => setTimeout(resolve, delay));
// //                 delay *= 2;
// //               }
// //             }
// //           } else {
// //             console.error(`Question ${index + 1} - No video URL returned`);
// //           }

// //           setUploadStatus((prev) => {
// //             const updated = [...prev];
// //             updated[index] = true;
// //             return updated;
// //           });
// //         }
// //       }

// //       setLoadingMessage(`Updating answer for Question ${index + 1}...`);
// //       setUploadProgress(85);
// //       const finalAnswer = answer.trim() || code.trim() || 'No answer provided';
// //       console.log(`Question ${index + 1} - Submitting to API: "${finalAnswer}"`);
// //       await axios.post(
// //         `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/update_answer/`,
// //         {
// //           object_id: objId,
// //           question_text: questionText,
// //           answer: finalAnswer,
// //         },
// //         { headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation } }
// //       );

// //       if (uploadedVideoUrl) {
// //         setUploadProgress(95);
// //         await axios.post(
// //           `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/process_video/`,
// //           {
// //             video_url: uploadedVideoUrl,
// //             meeting_id: meetingId,
// //             object_id: objId,
// //             question_index: index,
// //           },
// //           { headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation } }
// //         );
// //         console.log(`Question ${index + 1} - Video processed`);
// //       }

// //       setUploadProgress(100);
// //     } catch (error: any) {
// //       console.error(`Question ${index + 1} - Error processing:`, error.message || error);
// //     } finally {
// //       setIsUploading(false);
// //       setLoadingMessage('');
// //       setUploadProgress(0);
// //     }
// //   };

// //   const handleNextQuestion = () => {
// //     stopRecording();
// //     setLastBlobUrl(mediaBlobUrl ?? null);
// //     if (interimTranscript) {
// //       setTranscript(prev => {
// //         const newTranscript = prev + interimTranscript;
// //         setQuestions(prevQuestions => {
// //           const updated = [...prevQuestions];
// //           updated[currentQuestion] = { ...updated[currentQuestion], answer: newTranscript };
// //           console.log(`Question ${currentQuestion + 1} - Captured interim transcript: "${newTranscript}"`);
// //           return updated;
// //         });
// //         return newTranscript;
// //       });
// //       setInterimTranscript('');
// //     }
// //     setOpenNextDialog(true);
// //   };

// //   const handleDialogYes = async () => {
// //     setOpenNextDialog(false);
// //     if (questions[currentQuestion]?.question) {
// //       setIsProcessingQuestion(true);
// //       const currentAnswer = questions[currentQuestion].answer || interimTranscript || '';
// //       console.log(`Question ${currentQuestion + 1} - Processing with answer: "${currentAnswer}"`);
// //       await updateAnswer(questions[currentQuestion].question, currentAnswer, currentQuestion, lastBlobUrl ?? mediaBlobUrl);
// //       setTranscript('');
// //       setInterimTranscript('');
// //       setLastBlobUrl(null);
// //       setCurrentQuestion((prev) => prev + 1);
// //       setIsProcessingQuestion(false);
// //     } else {
// //       console.error('No question available to process');
// //     }
// //   };

// //   const handleSubmitInterview = async () => {
// //     setIsSubmitting(true);
// //     setLoadingMessage('Submitting your interview...');
// //     setSubmissionProgress(0);
// //     stopRecording();

// //     if (interimTranscript) {
// //       setTranscript(prev => {
// //         const newTranscript = prev + interimTranscript;
// //         setQuestions(prevQuestions => {
// //           const updated = [...prevQuestions];
// //           updated[currentQuestion] = { ...updated[currentQuestion], answer: newTranscript };
// //           console.log(`Question ${currentQuestion + 1} - Captured interim transcript for submission: "${newTranscript}"`);
// //           return updated;
// //         });
// //         return newTranscript;
// //       });
// //       setInterimTranscript('');
// //     }

// //     if (questions[currentQuestion]?.question) {
// //       const currentAnswer = questions[currentQuestion].answer || interimTranscript || '';
// //       console.log(`Question ${currentQuestion + 1} - Final submission with answer: "${currentAnswer}"`);
// //       await updateAnswer(questions[currentQuestion].question, currentAnswer, currentQuestion, mediaBlobUrl ?? null);
// //     }

// //     for (let i = 0; i < questions.length; i++) {
// //       if (!uploadStatus[i]) {
// //         const emptyBlob = new Blob([], { type: 'video/mp4' });
// //         const fileUrl = URL.createObjectURL(emptyBlob);
// //         await updateAnswer(questions[i].question, questions[i].answer || '', i, fileUrl, true);
// //       }
// //     }

// //     setLoadingMessage('Processing interview results...');
// //     try {
// //       const apiEndpoints = [
// //         {
// //           url: `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/interview/Thankingmail/${organisation}`,
// //           data: { meetingId },
// //           headers: { 'Content-Type': 'application/json' },
// //           name: 'Thanking Email'
// //         },
// //         {
// //           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/interview_status/`,
// //           data: { object_id: objId, interview_status: 'completed' },
// //           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
// //           name: 'Interview Status'
// //         },
// //         {
// //           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/generate_feedback/`,
// //           data: { object_id: objId, language_selected: selectedLanguage },
// //           headers: { 'Content-Type': 'multipart/form-data', organization: organisation, Organization: organisation },
// //           name: 'Generate Feedback'
// //         },
// //         {
// //           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/analyze_questions/`,
// //           data: { object_id: objId, language_selected: selectedLanguage },
// //           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
// //           name: 'Analyze Questions'
// //         },
// //         {
// //           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/batch_process_interview_analysis/`,
// //           data: { object_id: objId, language_selected: selectedLanguage },
// //           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
// //           name: 'Batch Process Analysis'
// //         },
// //         {
// //           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract_soft_skills/`,
// //           data: { object_id: objId, language_selected: selectedLanguage },
// //           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
// //           name: 'Extract Soft Skills'
// //         },
// //         {
// //           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract_strengths_areas/`,
// //           data: { object_id: objId, language_selected: selectedLanguage },
// //           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
// //           name: 'Extract Strengths Areas'
// //         },
// //         {
// //           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract-techskills-scores/`,
// //           data: { object_id: objId, language_selected: selectedLanguage },
// //           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
// //           name: 'Extract Tech Skills Scores'
// //         },
// //       ];

// //       const totalApis = apiEndpoints.length;
// //       let completedApis = 0;

// //       const apiPromises = apiEndpoints.map(async (api, index) => {
// //         try {
// //           setLoadingMessage(`Processing ${api.name} (${index + 1} of ${totalApis})...`);
// //           const response = await axios.post(api.url, api.data, { headers: api.headers });
// //           console.log(`API ${api.name} completed with status: ${response.status}`);
// //           completedApis += 1;
// //           setSubmissionProgress((completedApis / totalApis) * 100);
// //           return response;
// //         } catch (error: any) {
// //           console.error(`Failed to process ${api.name}:`, error.response?.data || error.message || error);
// //           completedApis += 1;
// //           setSubmissionProgress((completedApis / totalApis) * 100);
// //           return null;
// //         }
// //       });

// //       await Promise.all(apiPromises);

// //       setLoadingMessage('All processing complete, redirecting...');
// //       setSubmissionProgress(100);
// //       setTranscript('');
// //       setInterimTranscript('');
// //       console.log('Navigating to /signin');
// //       navigate('/signin');
// //     } catch (error: any) {
// //       console.error('Unexpected error during submission:', error.message || error);
// //       setSubmissionProgress(100);
// //       setTranscript('');
// //       setInterimTranscript('');
// //       navigate('/signin');
// //     } finally {
// //       setIsSubmitting(false);
// //       setLoadingMessage('');
// //       setSubmissionProgress(0);
// //     }
// //   };

// //   const handleEditorChange = (value: string | undefined) => setCode(value || '');
// //   const handleUpload = () => fileInputRef.current?.click();

// //   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = event.target.files?.[0];
// //     if (!file) return;
// //     const formData = new FormData();
// //     formData.append('file', file);
// //     formData.append('meetingid', meetingId);
// //     try {
// //       await axios.post(
// //         `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/LiveUpload/upload/${organisation}`,
// //         formData,
// //         { headers: { 'Content-Type': 'multipart/form-data' } }
// //       );
// //       alert('File uploaded successfully');
// //     } catch (error: any) {
// //       console.error('Upload failed:', error.message || error);
// //       alert('File upload failed');
// //     }
// //   };

// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       if (showEditor && editorRef.current && !editorRef.current.contains(event.target as Node)) {
// //         setShowEditor(false);
// //       }
// //     };
// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => document.removeEventListener('mousedown', handleClickOutside);
// //   }, [showEditor]);

// //   return (
// //     <div style={{ position: "relative", height: "100vh", backgroundColor: "black", overflow: "hidden" }}>
// //       {(isUploading || isSubmitting || isProcessingQuestion || loadingMessage) && (
// //         <ProfessionalLoader
// //           message={loadingMessage || 'Processing'}
// //           progress={isSubmitting ? submissionProgress : uploadProgress > 0 ? uploadProgress : undefined}
// //         />
// //       )}

// //       <div style={{
// //         display: "flex",
// //         height: "100vh",
// //         backgroundColor: "black"
// //       }}>
// //         <div style={{
// //           flex: "0 0 55%",
// //           position: "relative",
// //           backgroundColor: "black"
// //         }}>
// //           <video
// //             ref={videoRef}
// //             autoPlay
// //             muted
// //             playsInline
// //             style={{
// //               width: "100%",
// //               height: "100%",
// //               objectFit: "cover",
// //               backgroundColor: "black"
// //             }}
// //           />
// //         </div>

// //         <div style={{
// //           flex: "0 0 45%",
// //           display: "flex",
// //           flexDirection: "column",
// //           backgroundColor: "black",
// //           padding: "1rem"
// //         }}>
// //           <div style={{
// //             flex: "0 0 200px",
// //             display: "flex",
// //             marginBottom: "1rem"
// //           }}>
// //             <video
// //               ref={lipSyncVideoRef}
// //               muted
// //               style={{
// //                 width: '90%',
// //                 height: '200px',
// //                 backgroundColor: 'transparent',
// //                 borderRadius: '16px',
// //                 boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
// //                 objectFit: 'cover'
// //               }}
// //             >
// //               <source
// //                 src={`${process.env.PUBLIC_URL}/assets/static/images/20240913132119-119 (online-video-cutter.com).mp4`}
// //                 type="video/mp4"
// //               />
// //             </video>
// //           </div>

// //           <div style={{
// //             flex: "1",
// //             marginBottom: "1rem"
// //           }}>
// //             <div style={{
// //               background: "rgba(0,0,0,0.7)",
// //               padding: "1rem",
// //               borderRadius: "16px",
// //               backdropFilter: 'blur(10px)',
// //               border: '1px solid rgba(255,255,255,0.1)',
// //               height: "70%",
// //               color: "white",
// //               width: "85%"
// //             }}>
// //               <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
// //                 <Typography variant="h6" style={{ fontWeight: 'bold', marginRight: '1rem' }}>
// //                   Question {currentQuestion + 1}/{questions.length}
// //                 </Typography>
// //                 {uploadStatus[currentQuestion] ? (
// //                   <CheckCircle style={{ color: '#4caf50', fontSize: '24px' }} />
// //                 ) : (
// //                   <div style={{ display: 'flex', alignItems: 'center' }}>
// //                     <MicIcon style={{ color: status === 'recording' && !isReadingQuestion ? '#f44336' : '#fff', fontSize: '20px', marginRight: '0.5rem' }} />
// //                     {status === 'recording' && !isReadingQuestion && (
// //                       <div style={{ width: '8px', height: '8px', backgroundColor: '#f44336', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
// //                     )}
// //                     {isReadingQuestion && (
// //                       <div style={{ fontSize: '12px', color: '#ffa726', marginLeft: '0.5rem' }}>
// //                         Reading question...
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //               <Typography variant="body1" style={{ marginBottom: '1rem', lineHeight: '1.4' }}>
// //                 {isVideoReady && questions[currentQuestion]?.question ? questions[currentQuestion].question : "Waiting for webcam to initialize..."}
// //               </Typography>
// //               <div style={{
// //                 background: 'rgba(255,255,255,0.1)',
// //                 padding: '1rem',
// //                 borderRadius: '8px',
// //                 minHeight: '80px',
// //                 display:'none'
// //               }}>
// //                 <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
// //                   Your Answer:
// //                 </Typography>
// //                 <Typography variant="body2" style={{
// //                   fontStyle: transcript || interimTranscript ? 'normal' : 'italic',
// //                   color: transcript || interimTranscript ? '#fff' : '#bbb'
// //                 }}>
// //                   {transcript || interimTranscript || (isReadingQuestion ? 'Please wait for the question to finish...' : 'Start speaking to see your answer here...')}
// //                 </Typography>
// //               </div>
// //             </div>
// //           </div>

// //           <div style={{
// //             flex: "0 0 auto",
// //             display: 'flex',
// //             flexDirection: 'column',
// //             width: "90%",
// //             padding: '5px'
// //           }}>
// //             <div style={{
// //               display: 'flex',
// //               gap: "1rem",
// //               justifyContent: 'center'
// //             }}>
// //               <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px', pointerEvents: 'none', opacity: 0.5 }}>
// //                 <MicIcon />
// //               </IconButton>
// //               <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px', pointerEvents: 'none', opacity: 0.5 }}>
// //                 <VideocamIcon />
// //               </IconButton>
// //               <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px' }} onClick={() => setShowEditor(true)}>
// //                 <CodeIcon />
// //               </IconButton>
// //               <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
// //               <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px' }} onClick={handleUpload}>
// //                 <AttachFileIcon />
// //               </IconButton>
// //               {currentQuestion === questions.length - 1 ? (
// //                 <Button
// //                   onClick={() => setOpenSubmitDialog(true)}
// //                   variant="contained"
// //                   disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
// //                   style={{
// //                     backgroundColor: '#4caf50',
// //                     color: 'white',
// //                     display: "flex",
// //                     alignItems: "center",
// //                     justifyContent: "center",
// //                     padding: "10px 15px",
// //                     borderRadius: "8px",
// //                     fontWeight: "bold",
// //                     minWidth: "150px",
// //                   }}
// //                 >
// //                   {isUploading || isSubmitting || isProcessingQuestion ? (
// //                     <div style={{ display: 'flex', alignItems: 'center' }}>
// //                       <CircularProgress size={20} style={{ marginRight: '8px', color: 'white' }} />
// //                       Processing...
// //                     </div>
// //                   ) : (
// //                     "Submit Interview"
// //                   )}
// //                 </Button>
// //               ) : (
// //                 <Button
// //                   onClick={handleNextQuestion}
// //                   variant="contained"
// //                   disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
// //                   style={{
// //                     backgroundColor: '#2196f3',
// //                     display: "flex",
// //                     alignItems: "center",
// //                     justifyContent: "center",
// //                     padding: "12px 15px",
// //                     borderRadius: "8px",
// //                     fontWeight: "bold",
// //                     minWidth: "150px",
// //                   }}
// //                 >
// //                   {isUploading || isSubmitting || isProcessingQuestion ? (
// //                     <div style={{ display: 'flex', alignItems: 'center' }}>
// //                       <CircularProgress size={20} style={{ marginRight: '8px', color: 'white' }} />
// //                       Processing...
// //                     </div>
// //                   ) : (
// //                     "Next Question"
// //                   )}
// //                 </Button>
// //               )}

// //               <Button
// //                 onClick={() => setOpenSubmitDialog(true)}
// //                 variant="outlined"
// //                 disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
// //                 style={{
// //                   backgroundColor: '#2196f3',
// //                   display: "flex",
// //                   alignItems: "center",
// //                   justifyContent: "center",
// //                   padding: "10px 15px",
// //                   borderRadius: "8px",
// //                   fontWeight: "bold",
// //                   minWidth: "150px",
// //                   color: "#fff"
// //                 }}
// //               >
// //                 {isUploading || isSubmitting || isProcessingQuestion ? (
// //                   <div style={{ display: 'flex', alignItems: 'center' }}>
// //                     <CircularProgress size={16} style={{ marginRight: '8px', color: '#ff9800' }} />
// //                     Processing...
// //                   </div>
// //                 ) : (
// //                   "End Interview"
// //                 )}
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {showEditor && (
// //         <Box
// //           ref={editorRef}
// //           sx={{
// //             position: 'absolute',
// //             top: '50%',
// //             left: '50%',
// //             transform: 'translate(-50%, -50%)',
// //             width: '60%',
// //             height: '45vh',
// //             bgcolor: 'background.paper',
// //             borderRadius: '12px',
// //             boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
// //             p: 1,
// //             border: '1px solid rgba(255,255,255,0.2)',
// //             zIndex: 4
// //           }}
// //         >
// //           <Editor
// //             height="100%"
// //             width="100%"
// //             language="javascript"
// //             value={code}
// //             onChange={handleEditorChange}
// //             theme="vs-dark"
// //           />
// //         </Box>
// //       )}

// //       <Dialog
// //         open={openNextDialog}
// //         onClose={() => setOpenNextDialog(false)}
// //         PaperProps={{
// //           style: {
// //             borderRadius: '16px',
// //             padding: '8px',
// //             zIndex: 5
// //           }
// //         }}
// //       >
// //         <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
// //           Proceed to Next Question
// //         </DialogTitle>
// //         <DialogContent style={{ textAlign: 'center', padding: '20px' }}>
// //           <Typography variant="body1">
// //             Are you ready to move to the next question? Your current answer will be saved.
// //           </Typography>
// //         </DialogContent>
// //         <DialogActions style={{ justifyContent: 'center', padding: '16px' }}>
// //           <Button
// //             onClick={() => setOpenNextDialog(false)}
// //             variant="outlined"
// //             style={{ marginRight: '12px' }}
// //           >
// //             Cancel
// //           </Button>
// //           <Button
// //             onClick={handleDialogYes}
// //             variant="contained"
// //             disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
// //             style={{ backgroundColor: '#2196f3' }}
// //           >
// //             {isUploading || isSubmitting || isProcessingQuestion ? (
// //               <CircularProgress size={24} style={{ color: 'white' }} />
// //             ) : (
// //               "Yes, Continue"
// //             )}
// //           </Button>
// //         </DialogActions>
// //       </Dialog>

// //       <Dialog
// //         open={openSubmitDialog}
// //         onClose={() => setOpenSubmitDialog(false)}
// //         PaperProps={{
// //           style: {
// //             borderRadius: '16px',
// //             padding: '8px',
// //             zIndex: 5
// //           }
// //         }}
// //       >
// //         <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
// //           Submit Interview
// //         </DialogTitle>
// //         <DialogContent style={{ textAlign: 'center', padding: '20px' }}>
// //           <Typography variant="body1" style={{ marginBottom: '16px' }}>
// //             Are you sure you want to submit your interview? This action cannot be undone.
// //           </Typography>
// //           <Typography variant="body2" color="textSecondary">
// //             We will process your responses and send you feedback via email.
// //           </Typography>
// //         </DialogContent>
// //         <DialogActions style={{ justifyContent: 'center', padding: '16px' }}>
// //           <Button
// //             onClick={() => setOpenSubmitDialog(false)}
// //             variant="outlined"
// //             style={{ marginRight: '12px' }}
// //           >
// //             Cancel
// //           </Button>
// //           <Button
// //             onClick={handleSubmitInterview}
// //             variant="contained"
// //             disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
// //             style={{ backgroundColor: '#4caf50' }}
// //           >
// //             {isUploading || isSubmitting || isProcessingQuestion ? (
// //               <CircularProgress size={24} style={{ color: 'white' }} />
// //             ) : (
// //               "Submit Interview"
// //             )}
// //           </Button>
// //         </DialogActions>
// //       </Dialog>

// //       <style>{`
// //         @keyframes pulse {
// //           0% { opacity: 1; }
// //           50% { opacity: 0.5; }
// //           100% { opacity: 1; }
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // const InterviewAttend: React.FC = () => (
// //   <ReactMediaRecorder
// //     video
// //     audio
// //     render={(props: ReactMediaRecorderRenderProps) => <RecorderView {...props} />}
// //   />
// // );

// // export default InterviewAttend;



// import React, { useRef, useEffect, useState } from "react";
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, LinearProgress, Typography, IconButton } from '@mui/material';
// import { CheckCircle } from '@mui/icons-material';
// import VideocamIcon from '@mui/icons-material/Videocam';
// import CodeIcon from '@mui/icons-material/Code';
// import AttachFileIcon from '@mui/icons-material/AttachFile';
// import MicIcon from '@mui/icons-material/Mic';
// import { ReactMediaRecorder, ReactMediaRecorderRenderProps } from "react-media-recorder";
// import { Editor } from '@monaco-editor/react';
// import axios from 'axios';
// import { t } from "i18next";

// // Speech Recognition Interfaces
// interface SpeechRecognition extends EventTarget {
//   continuous: boolean;
//   interimResults: boolean;
//   lang: string;
//   onresult: (event: SpeechRecognitionEvent) => void;
//   onerror: (event: SpeechRecognitionErrorEvent) => void;
//   onend: () => void;
//   start: () => void;
//   stop: () => void;
// }

// interface SpeechRecognitionEvent {
//   resultIndex: number;
//   results: SpeechRecognitionResultList;
// }

// interface SpeechRecognitionErrorEvent { error: string; }

// interface SpeechRecognitionResultList { [index: number]: SpeechRecognitionResult; length: number; }

// interface SpeechRecognitionResult { isFinal: boolean; [index: number]: SpeechRecognitionAlternative; }

// interface SpeechRecognitionAlternative { transcript: string; }

// declare global {
//   interface Window { SpeechRecognition: new () => SpeechRecognition; webkitSpeechRecognition: new () => SpeechRecognition; }
// }

// // Professional Loading Component
// const ProfessionalLoader: React.FC<{ message: string; progress?: number }> = ({ message, progress }) => (
//   <div style={{
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.85)',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 9999,
//     backdropFilter: 'blur(8px)'
//   }}>
//     <div style={{
//       backgroundColor: 'rgba(255, 255, 255, 0.95)',
//       padding: '2rem 3rem',
//       borderRadius: '16px',
//       boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
//       textAlign: 'center',
//       minWidth: '300px',
//       border: '1px solid rgba(255, 255, 255, 0.2)'
//     }}>
//       <CircularProgress
//         size={60}
//         thickness={4}
//         style={{
//           color: '#1976d2',
//           marginBottom: '1.5rem',
//           filter: 'drop-shadow(0 4px 8px rgba(25, 118, 210, 0.3))'
//         }}
//       />
//       <Typography
//         variant="h6"
//         style={{
//           marginBottom: '1rem',
//           color: '#333',
//           fontWeight: '600',
//           letterSpacing: '0.5px'
//         }}
//       >
//         {message}
//       </Typography>
//       {progress !== undefined && (
//         <Box sx={{ width: '100%', mt: 2 }}>
//           <LinearProgress
//             variant="determinate"
//             value={progress}
//             style={{
//               height: '6px',
//               borderRadius: '3px',
//               backgroundColor: '#e0e0e0'
//             }}
//           />
//           <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
//             {Math.round(progress)}% Complete
//           </Typography>
//         </Box>
//       )}
//     </div>
//   </div>
// );

// const RecorderView: React.FC<ReactMediaRecorderRenderProps> = ({
//   status, startRecording, stopRecording, previewStream, mediaBlobUrl,
// }) => {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const editorRef = useRef<HTMLDivElement | null>(null);
//   const lipSyncVideoRef = useRef<HTMLVideoElement | null>(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const organisation = localStorage.getItem('organisation') || '';
//   const selectedLanguage = localStorage.getItem('i18nextLng') || 'en';
//   const { meetingId, objId } = location.state || {};

//   // State Management
//   const [questions, setQuestions] = useState<{ question: string; answer?: string }[]>([]);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [showEditor, setShowEditor] = useState(false);
//   const [code, setCode] = useState('');
//   const [transcript, setTranscript] = useState('');
//   const [interimTranscript, setInterimTranscript] = useState('');
//   const [isUploading, setIsUploading] = useState(false);
//   const [openNextDialog, setOpenNextDialog] = useState(false);
//   const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [lastBlobUrl, setLastBlobUrl] = useState<string | null>(null);
//   const [uploadStatus, setUploadStatus] = useState<boolean[]>([]);
//   const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);
//   const [hasSpokenQuestion, setHasSpokenQuestion] = useState<boolean[]>([]);
//   const [loadingMessage, setLoadingMessage] = useState('');
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [submissionProgress, setSubmissionProgress] = useState(0);
//   const [isVideoReady, setIsVideoReady] = useState(false);
//   const [voicesLoaded, setVoicesLoaded] = useState(false);
//   const [isReadingQuestion, setIsReadingQuestion] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const recognitionRef = useRef<SpeechRecognition | null>(null);

//   // Debug transcript changes
//   useEffect(() => {
//     console.log(`Question ${currentQuestion + 1} - Transcript: "${transcript}", Interim: "${interimTranscript}"`);
//   }, [transcript, interimTranscript, currentQuestion]);

//   // Initialize Speech Recognition
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       const recognition = new SpeechRecognition();
//       recognition.continuous = true;
//       recognition.interimResults = true;
//       recognition.lang = selectedLanguage === 'ar' ? 'ar-EG' : 'en-US';

//       recognition.onresult = (event: SpeechRecognitionEvent) => {
//         if (isReadingQuestion || isProcessingQuestion) {
//           console.log(`Question ${currentQuestion + 1} - Ignoring speech (TTS: ${isReadingQuestion}, Processing: ${isProcessingQuestion})`);
//           return;
//         }

//         let interim = '';
//         let final = '';
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const text = event.results[i][0].transcript;
//           if (event.results[i].isFinal) {
//             final += text + ' ';
//           } else {
//             interim = text;
//           }
//         }

//         if (final) {
//           setTranscript(prev => {
//             const newTranscript = prev + final;
//             console.log(`Question ${currentQuestion + 1} - Final transcript: "${newTranscript}"`);
//             setQuestions(prevQuestions => {
//               const updated = [...prevQuestions];
//               updated[currentQuestion] = { ...updated[currentQuestion], answer: newTranscript };
//               console.log(`Question ${currentQuestion + 1} - Stored answer: "${newTranscript}"`);
//               return updated;
//             });
//             return newTranscript;
//           });
//         }
//         setInterimTranscript(interim);
//         console.log(`Question ${currentQuestion + 1} - Interim transcript: "${interim}"`);
//       };

//       recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
//         console.error(`Question ${currentQuestion + 1} - Speech recognition error: ${event.error}`);
//       };

//       recognition.onend = () => {
//         console.log(`Question ${currentQuestion + 1} - Speech recognition ended`);
//         if (status === 'recording' && !isProcessingQuestion && !isReadingQuestion && isVideoReady && questions.length > 0) {
//           try {
//             recognition.start();
//             console.log(`Question ${currentQuestion + 1} - Speech recognition restarted`);
//           } catch (error) {
//             console.error(`Question ${currentQuestion + 1} - Failed to restart speech recognition:`, error);
//           }
//         }
//       };

//       recognitionRef.current = recognition;
//       return () => {
//         console.log('Cleaning up speech recognition');
//         recognition.stop();
//       };
//     } else {
//       console.error('Speech recognition not supported in this browser');
//     }
//   }, [selectedLanguage, currentQuestion]);

//   // Control speech recognition
//   useEffect(() => {
//     if (recognitionRef.current) {
//       if (status === 'recording' && !isProcessingQuestion && !isReadingQuestion && isVideoReady && questions.length > 0) {
//         try {
//           recognitionRef.current.start();
//           console.log(`Question ${currentQuestion + 1} - Speech recognition started (status: ${status})`);
//         } catch (error) {
//           console.error(`Question ${currentQuestion + 1} - Failed to start speech recognition:`, error);
//         }
//       } else {
//         recognitionRef.current.stop();
//         console.log(`Question ${currentQuestion + 1} - Speech recognition stopped (status: ${status}, isReading: ${isReadingQuestion}, isProcessing: ${isProcessingQuestion})`);
//       }
//     }
//   }, [status, isProcessingQuestion, isReadingQuestion, isVideoReady, currentQuestion, questions.length]);

//   // Reset transcript on question change
//   useEffect(() => {
//     const storedAnswer = questions[currentQuestion]?.answer || '';
//     setTranscript(storedAnswer);
//     setInterimTranscript('');
//     console.log(`Question ${currentQuestion + 1} - Reset transcript to: "${storedAnswer}"`);
//   }, [currentQuestion, questions]);

//   // Load voices for speech synthesis
//   useEffect(() => {
//     const loadVoices = () => {
//       if (window.speechSynthesis.getVoices().length > 0) {
//         setVoicesLoaded(true);
//         console.log('Voices loaded');
//       } else {
//         window.speechSynthesis.onvoiceschanged = () => {
//           setVoicesLoaded(true);
//           window.speechSynthesis.onvoiceschanged = null;
//           console.log('Voices loaded via onvoiceschanged');
//         };
//       }
//     };
//     loadVoices();
//   }, []);

//   // Initialize media
//   useEffect(() => {
//     const initializeMedia = async () => {
//       try {
//         setLoadingMessage('Initializing camera and microphone...');
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
//         console.log('Media stream initialized');
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play().then(() => {
//             console.log('Webcam video playing');
//             setIsVideoReady(true);
//           }).catch(error => {
//             console.error('Failed to play video stream:', error);
//           });
//         }
//         setLoadingMessage('');
//       } catch (error: any) {
//         console.error('Failed to access media devices:', error.message || error);
//         setLoadingMessage('');
//       }
//     };
//     initializeMedia();
//     return () => {
//       if (videoRef.current?.srcObject) {
//         const stream = videoRef.current.srcObject as MediaStream;
//         stream.getTracks().forEach(track => track.stop());
//         videoRef.current.srcObject = null;
//         setIsVideoReady(false);
//       }
//     };
//   }, []);

//   // Update video stream
//   useEffect(() => {
//     if (videoRef.current && previewStream && !isVideoReady) {
//       console.log('Assigning previewStream to videoRef');
//       videoRef.current.srcObject = previewStream;
//       videoRef.current.play().then(() => {
//         console.log('Preview stream playing');
//         setIsVideoReady(true);
//       }).catch(error => {
//         console.error('Failed to play previewStream:', error);
//       });
//     }
//   }, [previewStream, isVideoReady]);

//   // Video initialization timeout
//   useEffect(() => {
//     if (!isVideoReady) {
//       const timeout = setTimeout(() => {
//         if (!isVideoReady) {
//           console.error('Webcam video failed to initialize');
//         }
//       }, 10000);
//       return () => clearTimeout(timeout);
//     }
//   }, [isVideoReady]);

//   // Log environment variables
//   useEffect(() => {
//     if (isVideoReady) {
//       console.log('Environment variables:', {
//         django: process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE,
//         springboot: process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE,
//         fileBaseUrl: process.env.REACT_APP_SPRINGBOOT_FILE_BASE_URL,
//         organisation,
//         selectedLanguage,
//       });
//     }
//   }, [organisation, selectedLanguage, isVideoReady]);

//   // Fetch questions
//   useEffect(() => {
//     if (!isVideoReady) return;

//     const fetchQuestions = async () => {
//       try {
//         setLoadingMessage('Loading interview questions...');
//         const response = await axios.post(
//           `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_interview_data/`,
//           { object_id: objId },
//           { headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation } }
//         );
//         setQuestions(response.data.data.questions.map((q: any) => ({ question: q.question, answer: '' })));
//         setUploadStatus(new Array(response.data.data.questions.length).fill(false));
//         setHasSpokenQuestion(new Array(response.data.data.questions.length).fill(false));
//         setLoadingMessage('');
//       } catch (error: any) {
//         console.error('Error fetching questions:', error.message || error);
//         setLoadingMessage('');
//       }
//     };
//     fetchQuestions();
//   }, [objId, organisation, isVideoReady]);

//   // Text-to-speech
//   useEffect(() => {
//     if (
//       !isVideoReady ||
//       !voicesLoaded ||
//       questions.length === 0 ||
//       !questions[currentQuestion]?.question ||
//       hasSpokenQuestion[currentQuestion] ||
//       isUploading ||
//       isSubmitting ||
//       isProcessingQuestion ||
//       !lipSyncVideoRef.current
//     ) return;

//     const videoElement = lipSyncVideoRef.current;
//     const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].question);
//     utterance.lang = selectedLanguage;

//     const voices = window.speechSynthesis.getVoices();
//     const femaleVoice = voices.find(voice =>
//       voice.name.toLowerCase().includes('female') ||
//       voice.name.toLowerCase().includes('woman') ||
//       voice.name.includes('Samantha') ||
//       voice.name.includes('Victoria') ||
//       voice.name.includes('Zira') ||
//       voice.name.includes('Tessa') ||
//       voice.name.includes('Google US English')
//     );
//     if (femaleVoice) {
//       utterance.voice = femaleVoice;
//       console.log(`Question ${currentQuestion + 1} - Using voice: ${femaleVoice.name}`);
//     } else {
//       console.warn(`Question ${currentQuestion + 1} - No female voice found`);
//     }

//     utterance.onstart = () => {
//       setIsReadingQuestion(true);
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//         console.log(`Question ${currentQuestion + 1} - Speech recognition stopped during TTS`);
//       }
//       if (videoElement) {
//         videoElement.play().catch(error => {
//           console.error(`Question ${currentQuestion + 1} - Failed to play lip-sync video:`, error);
//         });
//       }
//     };

//     utterance.onend = () => {
//       setIsReadingQuestion(false);
//       setHasSpokenQuestion(prev => {
//         const updated = [...prev];
//         updated[currentQuestion] = true;
//         return updated;
//       });

//       if (videoElement) {
//         videoElement.pause();
//         videoElement.currentTime = 0;
//       }

//       if (status !== 'recording') {
//         startRecording();
//         console.log(`Question ${currentQuestion + 1} - Recording started`);
//       }
//       if (recognitionRef.current) {
//         try {
//           recognitionRef.current.start();
//           console.log(`Question ${currentQuestion + 1} - Speech recognition started after TTS`);
//         } catch (error) {
//           console.error(`Question ${currentQuestion + 1} - Failed to start speech recognition after TTS:`, error);
//         }
//       }
//     };

//     utterance.onerror = (event) => {
//       console.error(`Question ${currentQuestion + 1} - Speech synthesis error:`, event);
//       setIsReadingQuestion(false);
//       setHasSpokenQuestion(prev => {
//         const updated = [...prev];
//         updated[currentQuestion] = true;
//         return updated;
//       });
//     };

//     setTimeout(() => {
//       window.speechSynthesis.speak(utterance);
//       console.log(`Question ${currentQuestion + 1} - Speaking question: "${questions[currentQuestion].question}"`);
//     }, 500);

//     return () => {
//       window.speechSynthesis.cancel();
//       if (videoElement) {
//         videoElement.pause();
//         videoElement.currentTime = 0;
//       }
//     };
//   }, [currentQuestion, questions, selectedLanguage, startRecording, status, isUploading, isSubmitting, isProcessingQuestion, hasSpokenQuestion, isVideoReady, voicesLoaded]);

//   const updateAnswer = async (
//     questionText: string,
//     answer: string,
//     index: number,
//     blobUrl?: string | null,
//     forceUpload = false
//   ) => {
//     console.log(`Question ${index + 1} - Updating answer: "${answer}"`);
//     try {
//       setIsUploading(true);
//       setLoadingMessage(`Processing Question ${index + 1}...`);
//       setUploadProgress(0);
//       let uploadedVideoUrl: string | null = null;

//       if (blobUrl && (!uploadStatus[index] || forceUpload)) {
//         setLoadingMessage(`Uploading video for Question ${index + 1}...`);
//         setUploadProgress(25);
//         const response = await fetch(blobUrl);
//         const blob = await response.blob();

//         if (blob.size > 0) {
//           const file = new File([blob], `interview-q${index + 1}.mp4`, { type: 'video/mp4' });
//           const formData = new FormData();
//           formData.append('videoFile', file);
//           formData.append('meetingId', objId);
//           formData.append('transcript', answer);

//           const uploadResponse = await axios.post(
//             `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/recording/write/${organisation}`,
//             formData,
//             {
//               headers: { 'Content-Type': 'multipart/form-data' },
//               onUploadProgress: (progressEvent) => {
//                 if (progressEvent.total) {
//                   const progress = Math.round((progressEvent.loaded * 50) / progressEvent.total);
//                   setUploadProgress(25 + progress);
//                 }
//               }
//             }
//           );

//           uploadedVideoUrl = uploadResponse.data.outputFileName;
//           setUploadProgress(75);
//           console.log(`Question ${index + 1} - Video uploaded: ${uploadedVideoUrl}`);

//           if (uploadedVideoUrl) {
//             let retries = 5;
//             let delay = 2000;
//             while (retries > 0) {
//               try {
//                 const verifyResponse = await axios.get(uploadedVideoUrl, {
//                   responseType: 'blob',
//                   headers: { Accept: 'video/mp4' },
//                 });
//                 if (verifyResponse.status === 200 && verifyResponse.data.type === 'video/mp4') {
//                   console.log(`Question ${index + 1} - Video URL verified`);
//                   break;
//                 }
//               } catch (urlError: any) {
//                 console.error(`Question ${index + 1} - Attempt ${6 - retries} failed to verify video: ${urlError.message}`);
//                 retries--;
//                 if (retries === 0) {
//                   uploadedVideoUrl = null;
//                   console.error(`Question ${index + 1} - Failed to verify video after multiple attempts`);
//                   break;
//                 }
//                 await new Promise(resolve => setTimeout(resolve, delay));
//                 delay *= 2;
//               }
//             }
//           } else {
//             console.error(`Question ${index + 1} - No video URL returned`);
//           }

//           setUploadStatus((prev) => {
//             const updated = [...prev];
//             updated[index] = true;
//             return updated;
//           });
//         }
//       }

//       setLoadingMessage(`Updating answer for Question ${index + 1}...`);
//       setUploadProgress(85);
//       const finalAnswer = answer.trim() || code.trim() || 'No answer provided';
//       console.log(`Question ${index + 1} - Submitting to API: "${finalAnswer}"`);
//       await axios.post(
//         `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/update_answer/`,
//         {
//           object_id: objId,
//           question_text: questionText,
//           answer: finalAnswer,
//         },
//         { headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation } }
//       );

//       if (uploadedVideoUrl) {
//         setUploadProgress(95);
//         await axios.post(
//           `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/process_video/`,
//           {
//             video_url: uploadedVideoUrl,
//             meeting_id: meetingId,
//             object_id: objId,
//             question_index: index,
//           },
//           { headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation } }
//         );
//         console.log(`Question ${index + 1} - Video processed`);
//       }

//       setUploadProgress(100);
//     } catch (error: any) {
//       console.error(`Question ${index + 1} - Error processing:`, error.message || error);
//     } finally {
//       setIsUploading(false);
//       setLoadingMessage('');
//       setUploadProgress(0);
//     }
//   };

//   const handleNextQuestion = () => {
//     stopRecording();
//     setLastBlobUrl(mediaBlobUrl ?? null);
//     if (interimTranscript) {
//       setTranscript(prev => {
//         const newTranscript = prev + interimTranscript;
//         setQuestions(prevQuestions => {
//           const updated = [...prevQuestions];
//           updated[currentQuestion] = { ...updated[currentQuestion], answer: newTranscript };
//           console.log(`Question ${currentQuestion + 1} - Captured interim transcript: "${newTranscript}"`);
//           return updated;
//         });
//         return newTranscript;
//       });
//       setInterimTranscript('');
//     }
//     setOpenNextDialog(true);
//   };

//   const handleDialogYes = async () => {
//     setOpenNextDialog(false);
//     if (questions[currentQuestion]?.question) {
//       setIsProcessingQuestion(true);
//       const currentAnswer = questions[currentQuestion].answer || interimTranscript || '';
//       console.log(`Question ${currentQuestion + 1} - Processing with answer: "${currentAnswer}"`);
//       await updateAnswer(questions[currentQuestion].question, currentAnswer, currentQuestion, lastBlobUrl ?? mediaBlobUrl);
//       setTranscript('');
//       setInterimTranscript('');
//       setLastBlobUrl(null);
//       setCurrentQuestion((prev) => prev + 1);
//       setIsProcessingQuestion(false);
//     } else {
//       console.error('No question available to process');
//     }
//   };

//   const handleSubmitInterview = async () => {
//     setIsSubmitting(true);
//     setLoadingMessage('Submitting your interview...');
//     setSubmissionProgress(0);
//     stopRecording();

//     if (interimTranscript) {
//       setTranscript(prev => {
//         const newTranscript = prev + interimTranscript;
//         setQuestions(prevQuestions => {
//           const updated = [...prevQuestions];
//           updated[currentQuestion] = { ...updated[currentQuestion], answer: newTranscript };
//           console.log(`Question ${currentQuestion + 1} - Captured interim transcript for submission: "${newTranscript}"`);
//           return updated;
//         });
//         return newTranscript;
//       });
//       setInterimTranscript('');
//     }

//     if (questions[currentQuestion]?.question) {
//       const currentAnswer = questions[currentQuestion].answer || interimTranscript || '';
//       console.log(`Question ${currentQuestion + 1} - Final submission with answer: "${currentAnswer}"`);
//       await updateAnswer(questions[currentQuestion].question, currentAnswer, currentQuestion, mediaBlobUrl ?? null);
//     }

//     for (let i = 0; i < questions.length; i++) {
//       if (!uploadStatus[i]) {
//         const emptyBlob = new Blob([], { type: 'video/mp4' });
//         const fileUrl = URL.createObjectURL(emptyBlob);
//         await updateAnswer(questions[i].question, questions[i].answer || '', i, fileUrl, true);
//       }
//     }

//     setLoadingMessage('Processing interview results...');
//     try {
//       const apiEndpoints = [
//         {
//           url: `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/interview/Thankingmail/${organisation}`,
//           data: { meetingId },
//           headers: { 'Content-Type': 'application/json' },
//           name: 'Thanking Email'
//         },
//         {
//           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/interview_status/`,
//           data: { object_id: objId, interview_status: 'completed' },
//           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
//           name: 'Interview Status'
//         },
//         {
//           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/generate_feedback/`,
//           data: { object_id: objId, language_selected: selectedLanguage },
//           headers: { 'Content-Type': 'multipart/form-data', organization: organisation, Organization: organisation },
//           name: 'Generate Feedback'
//         },
//         {
//           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/analyze_questions/`,
//           data: { object_id: objId, language_selected: selectedLanguage },
//           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
//           name: 'Analyze Questions'
//         },
//         {
//           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/batch_process_interview_analysis/`,
//           data: { object_id: objId, language_selected: selectedLanguage },
//           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
//           name: 'Batch Process Analysis'
//         },
//         {
//           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract_soft_skills/`,
//           data: { object_id: objId, language_selected: selectedLanguage },
//           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
//           name: 'Extract Soft Skills'
//         },
//         {
//           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract_strengths_areas/`,
//           data: { object_id: objId, language_selected: selectedLanguage },
//           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
//           name: 'Extract Strengths Areas'
//         },
//         {
//           url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract-techskills-scores/`,
//           data: { object_id: objId, language_selected: selectedLanguage },
//           headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
//           name: 'Extract Tech Skills Scores'
//         },
//       ];

//       const totalApis = apiEndpoints.length;
//       let completedApis = 0;

//       const apiPromises = apiEndpoints.map(async (api, index) => {
//         try {
//           setLoadingMessage(`Processing ${api.name} (${index + 1} of ${totalApis})...`);
//           const response = await axios.post(api.url, api.data, { headers: api.headers });
//           console.log(`API ${api.name} completed with status: ${response.status}`);
//           completedApis += 1;
//           setSubmissionProgress((completedApis / totalApis) * 100);
//           return response;
//         } catch (error: any) {
//           console.error(`Failed to process ${api.name}:`, error.response?.data || error.message || error);
//           completedApis += 1;
//           setSubmissionProgress((completedApis / totalApis) * 100);
//           return null;
//         }
//       });

//       await Promise.all(apiPromises);

//       setLoadingMessage('All processing complete, redirecting...');
//       setSubmissionProgress(100);
//       setTranscript('');
//       setInterimTranscript('');
//       console.log('Navigating to /signin');
//       navigate('/signin');
//     } catch (error: any) {
//       console.error('Unexpected error during submission:', error.message || error);
//       setSubmissionProgress(100);
//       setTranscript('');
//       setInterimTranscript('');
//       navigate('/signin');
//     } finally {
//       setIsSubmitting(false);
//       setLoadingMessage('');
//       setSubmissionProgress(0);
//     }
//   };

//   const handleEditorChange = (value: string | undefined) => setCode(value || '');
//   const handleUpload = () => fileInputRef.current?.click();

//   const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('meetingid', meetingId);
//     try {
//       await axios.post(
//         `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/LiveUpload/upload/${organisation}`,
//         formData,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
//       alert('File uploaded successfully');
//     } catch (error: any) {
//       console.error('Upload failed:', error.message || error);
//       alert('File upload failed');
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (showEditor && editorRef.current && !editorRef.current.contains(event.target as Node)) {
//         setShowEditor(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [showEditor]);

//   return (
//     <div style={{ position: "relative", height: "100vh", backgroundColor: "black", overflow: "hidden" }}>
//       {(isUploading || isSubmitting || isProcessingQuestion || loadingMessage) && (
//         <ProfessionalLoader
//           message={loadingMessage || 'Processing'}
//           progress={isSubmitting ? submissionProgress : uploadProgress > 0 ? uploadProgress : undefined}
//         />
//       )}

//       <div style={{
//         display: "flex",
//         height: "100vh",
//         backgroundColor: "black"
//       }}>
//         <div style={{
//           flex: "0 0 55%",
//           position: "relative",
//           backgroundColor: "black"
//         }}>
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             playsInline
//             style={{
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//               backgroundColor: "black"
//             }}
//           />
//         </div>

//         <div style={{
//           flex: "0 0 45%",
//           display: "flex",
//           flexDirection: "column",
//           backgroundColor: "black",
//           padding: "1rem"
//         }}>
//           <div style={{
//             flex: "0 0 200px",
//             display: "flex",
//             marginBottom: "1rem"
//           }}>
//             <video
//               ref={lipSyncVideoRef}
//               muted
//               style={{
//                 width: '90%',
//                 height: '200px',
//                 backgroundColor: 'transparent',
//                 borderRadius: '16px',
//                 boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
//                 objectFit: 'cover'
//               }}
//             >
//               <source
//                 src={`${process.env.PUBLIC_URL}/assets/static/images/20240913132119-119 (online-video-cutter.com).mp4`}
//                 type="video/mp4"
//               />
//             </video>
//           </div>

//           <div style={{
//             flex: "1",
//             marginBottom: "1rem"
//           }}>
//             <div style={{
//               background: "rgba(0,0,0,0.7)",
//               padding: "1rem",
//               borderRadius: "16px",
//               backdropFilter: 'blur(10px)',
//               border: '1px solid rgba(255,255,255,0.1)',
//               height: "70%",
//               color: "white",
//               width: "85%"
//             }}>
//               <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
//                 <Typography variant="h6" style={{ fontWeight: 'bold', marginRight: '1rem' }}>
//                   Question {currentQuestion + 1}/{questions.length}
//                 </Typography>
//                 {uploadStatus[currentQuestion] ? (
//                   <CheckCircle style={{ color: '#4caf50', fontSize: '24px' }} />
//                 ) : (
//                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                     <MicIcon style={{ color: status === 'recording' && !isReadingQuestion ? '#f44336' : '#fff', fontSize: '20px', marginRight: '0.5rem' }} />
//                     {status === 'recording' && !isReadingQuestion && (
//                       <div style={{ width: '8px', height: '8px', backgroundColor: '#f44336', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
//                     )}
//                     {isReadingQuestion && (
//                       <div style={{ fontSize: '12px', color: '#ffa726', marginLeft: '0.5rem' }}>
//                         Reading question...
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <Typography variant="body1" style={{ marginBottom: '1rem', lineHeight: '1.4' }}>
//                 {isVideoReady && questions[currentQuestion]?.question ? questions[currentQuestion].question : "Waiting for webcam to initialize..."}
//               </Typography>
//               <div style={{
//                 background: 'rgba(255,255,255,0.1)',
//                 padding: '1rem',
//                 borderRadius: '8px',
//                 minHeight: '80px',
//                 display:'none'
//               }}>
//                 <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
//                   Your Answer:
//                 </Typography>
//                 <Typography variant="body2" style={{
//                   fontStyle: transcript || interimTranscript ? 'normal' : 'italic',
//                   color: transcript || interimTranscript ? '#fff' : '#bbb'
//                 }}>
//                   {transcript || interimTranscript || (isReadingQuestion ? 'Please wait for the question to finish...' : 'Start speaking to see your answer here...')}
//                 </Typography>
//               </div>
//             </div>
//           </div>

//           <div style={{
//             flex: "0 0 auto",
//             display: 'flex',
//             flexDirection: 'column',
//             width: "90%",
//             padding: '5px'
//           }}>
//             <div style={{
//               display: 'flex',
//               gap: "1rem",
//               justifyContent: 'center'
//             }}>
//               <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px', pointerEvents: 'none', opacity: 0.5 }}>
//                 <MicIcon />
//               </IconButton>
//               <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px', pointerEvents: 'none', opacity: 0.5 }}>
//                 <VideocamIcon />
//               </IconButton>
//               <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px' }} onClick={() => setShowEditor(true)}>
//                 <CodeIcon />
//               </IconButton>
//               <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
//               <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px' }} onClick={handleUpload}>
//                 <AttachFileIcon />
//               </IconButton>
//               {currentQuestion === questions.length - 1 ? (
//                 <Button
//                   onClick={() => setOpenSubmitDialog(true)}
//                   variant="contained"
//                   disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
//                   style={{
//                     backgroundColor: '#4caf50',
//                     color: 'white',
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     padding: "10px 15px",
//                     borderRadius: "8px",
//                     fontWeight: "bold",
//                     minWidth: "150px",
//                   }}
//                 >
//                   {isUploading || isSubmitting || isProcessingQuestion ? (
//                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                       <CircularProgress size={20} style={{ marginRight: '8px', color: 'white' }} />
//                       Processing...
//                     </div>
//                   ) : (
//                     "Submit Interview"
//                   )}
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={handleNextQuestion}
//                   variant="contained"
//                   disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
//                   style={{
//                     backgroundColor: '#2196f3',
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     padding: "12px 15px",
//                     borderRadius: "8px",
//                     fontWeight: "bold",
//                     minWidth: "150px",
//                   }}
//                 >
//                   {isUploading || isSubmitting || isProcessingQuestion ? (
//                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                       <CircularProgress size={20} style={{ marginRight: '8px', color: 'white' }} />
//                       Processing...
//                     </div>
//                   ) : (
//                     "Next Question"
//                   )}
//                 </Button>
//               )}

//               <Button
//                 onClick={() => setOpenSubmitDialog(true)}
//                 variant="outlined"
//                 disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
//                 style={{
//                   backgroundColor: '#2196f3',
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   padding: "10px 15px",
//                   borderRadius: "8px",
//                   fontWeight: "bold",
//                   minWidth: "150px",
//                   color: "#fff"
//                 }}
//               >
//                 {isUploading || isSubmitting || isProcessingQuestion ? (
//                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                     <CircularProgress size={16} style={{ marginRight: '8px', color: '#ff9800' }} />
//                     Processing...
//                   </div>
//                 ) : (
//                   "End Interview"
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showEditor && (
//         <Box
//           ref={editorRef}
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: '60%',
//             height: '45vh',
//             bgcolor: 'background.paper',
//             borderRadius: '12px',
//             boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
//             p: 1,
//             border: '1px solid rgba(255,255,255,0.2)',
//             zIndex: 4
//           }}
//         >
//           <Editor
//             height="100%"
//             width="100%"
//             language="javascript"
//             value={code}
//             onChange={handleEditorChange}
//             theme="vs-dark"
//           />
//         </Box>
//       )}

//       <Dialog
//         open={openNextDialog}
//         onClose={() => setOpenNextDialog(false)}
//         PaperProps={{
//           style: {
//             borderRadius: '16px',
//             padding: '8px',
//             zIndex: 5
//           }
//         }}
//       >
//         <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
//           Proceed to Next Question
//         </DialogTitle>
//         <DialogContent style={{ textAlign: 'center', padding: '20px' }}>
//           <Typography variant="body1">
//             Are you ready to move to the next question? Your current answer will be saved.
//           </Typography>
//         </DialogContent>
//         <DialogActions style={{ justifyContent: 'center', padding: '16px' }}>
//           <Button
//             onClick={() => setOpenNextDialog(false)}
//             variant="outlined"
//             style={{ marginRight: '12px' }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleDialogYes}
//             variant="contained"
//             disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
//             style={{ backgroundColor: '#2196f3' }}
//           >
//             {isUploading || isSubmitting || isProcessingQuestion ? (
//               <CircularProgress size={24} style={{ color: 'white' }} />
//             ) : (
//               "Yes, Continue"
//             )}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openSubmitDialog}
//         onClose={() => setOpenSubmitDialog(false)}
//         PaperProps={{
//           style: {
//             borderRadius: '16px',
//             padding: '8px',
//             zIndex: 5
//           }
//         }}
//       >
//         <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
//           Submit Interview
//         </DialogTitle>
//         <DialogContent style={{ textAlign: 'center', padding: '20px' }}>
//           <Typography variant="body1" style={{ marginBottom: '16px' }}>
//             Are you sure you want to submit your interview? This action cannot be undone.
//           </Typography>
//           <Typography variant="body2" color="textSecondary">
//             We will process your responses and send you feedback via email.
//           </Typography>
//         </DialogContent>
//         <DialogActions style={{ justifyContent: 'center', padding: '16px' }}>
//           <Button
//             onClick={() => setOpenSubmitDialog(false)}
//             variant="outlined"
//             style={{ marginRight: '12px' }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmitInterview}
//             variant="contained"
//             disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
//             style={{ backgroundColor: '#4caf50' }}
//           >
//             {isUploading || isSubmitting || isProcessingQuestion ? (
//               <CircularProgress size={24} style={{ color: 'white' }} />
//             ) : (
//               "Submit Interview"
//             )}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <style>{`
//         @keyframes pulse {
//           0% { opacity: 1; }
//           50% { opacity: 0.5; }
//           100% { opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// };

// const InterviewAttend: React.FC = () => (
//   <ReactMediaRecorder
//     video
//     audio
//     render={(props: ReactMediaRecorderRenderProps) => <RecorderView {...props} />}
//   />
// );

// export default InterviewAttend;


import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, LinearProgress, Typography, IconButton } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import VideocamIcon from '@mui/icons-material/Videocam';
import CodeIcon from '@mui/icons-material/Code';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import { ReactMediaRecorder, ReactMediaRecorderRenderProps } from "react-media-recorder";
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import { t } from "i18next";

// Speech Recognition Interfaces
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

// Professional Loading Component
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

const RecorderView: React.FC<ReactMediaRecorderRenderProps> = ({
  status, startRecording, stopRecording, previewStream, mediaBlobUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const lipSyncVideoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const organisation = localStorage.getItem('organisation') || '';
  const selectedLanguage = localStorage.getItem('i18nextLng') || 'en';
  const { meetingId, objId } = location.state || {};

  // State Management
  const [questions, setQuestions] = useState<{ question: string; answer?: string }[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showEditor, setShowEditor] = useState(false);
  const [code, setCode] = useState('');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [openNextDialog, setOpenNextDialog] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastBlobUrl, setLastBlobUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<boolean[]>([]);
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);
  const [hasSpokenQuestion, setHasSpokenQuestion] = useState<boolean[]>([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [isReadingQuestion, setIsReadingQuestion] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Debug transcript changes
  useEffect(() => {
    console.log(`Question ${currentQuestion + 1} - Transcript: "${transcript}", Interim: "${interimTranscript}"`);
  }, [transcript, interimTranscript, currentQuestion]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage === 'ar' ? 'ar-EG' : 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (isReadingQuestion || isProcessingQuestion) {
          console.log(`Question ${currentQuestion + 1} - Ignoring speech (TTS: ${isReadingQuestion}, Processing: ${isProcessingQuestion})`);
          return;
        }

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

        if (final) {
          setTranscript(prev => {
            const newTranscript = prev + final;
            console.log(`Question ${currentQuestion + 1} - Final transcript: "${newTranscript}"`);
            setQuestions(prevQuestions => {
              const updated = [...prevQuestions];
              updated[currentQuestion] = { ...updated[currentQuestion], answer: newTranscript };
              console.log(`Question ${currentQuestion + 1} - Stored answer: "${newTranscript}"`);
              return updated;
            });
            return newTranscript;
          });
        }
        setInterimTranscript(interim);
        console.log(`Question ${currentQuestion + 1} - Interim transcript: "${interim}"`);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error(`Question ${currentQuestion + 1} - Speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        console.log(`Question ${currentQuestion + 1} - Speech recognition ended`);
        if (status === 'recording' && !isProcessingQuestion && !isReadingQuestion && isVideoReady && questions.length > 0) {
          try {
            recognition.start();
            console.log(`Question ${currentQuestion + 1} - Speech recognition restarted`);
          } catch (error) {
            console.error(`Question ${currentQuestion + 1} - Failed to restart speech recognition:`, error);
          }
        }
      };

      recognitionRef.current = recognition;
      return () => {
        console.log('Cleaning up speech recognition');
        recognition.stop();
      };
    } else {
      console.error('Speech recognition not supported in this browser');
    }
  }, [selectedLanguage, currentQuestion]);

  // Control speech recognition
  useEffect(() => {
    if (recognitionRef.current) {
      if (status === 'recording' && !isProcessingQuestion && !isReadingQuestion && isVideoReady && questions.length > 0) {
        try {
          recognitionRef.current.start();
          console.log(`Question ${currentQuestion + 1} - Speech recognition started (status: ${status})`);
        } catch (error) {
          console.error(`Question ${currentQuestion + 1} - Failed to start speech recognition:`, error);
        }
      } else {
        recognitionRef.current.stop();
        console.log(`Question ${currentQuestion + 1} - Speech recognition stopped (status: ${status}, isReading: ${isReadingQuestion}, isProcessing: ${isProcessingQuestion})`);
      }
    }
  }, [status, isProcessingQuestion, isReadingQuestion, isVideoReady, currentQuestion, questions.length]);

  // Reset transcript on question change
  useEffect(() => {
    const storedAnswer = questions[currentQuestion]?.answer || '';
    setTranscript(storedAnswer);
    setInterimTranscript('');
    console.log(`Question ${currentQuestion + 1} - Reset transcript to: "${storedAnswer}"`);
  }, [currentQuestion, questions]);

  // Load voices for speech synthesis
  useEffect(() => {
    const loadVoices = () => {
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoicesLoaded(true);
        console.log('Voices loaded');
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          setVoicesLoaded(true);
          window.speechSynthesis.onvoiceschanged = null;
          console.log('Voices loaded via onvoiceschanged');
        };
      }
    };
    loadVoices();
  }, []);

  // Initialize media
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        setLoadingMessage('Initializing camera and microphone...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        console.log('Media stream initialized');
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().then(() => {
            console.log('Webcam video playing');
            setIsVideoReady(true);
          }).catch(error => {
            console.error('Failed to play video stream:', error);
          });
        }
        setLoadingMessage('');
      } catch (error: any) {
        console.error('Failed to access media devices:', error.message || error);
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
  }, []);

  // Update video stream
  useEffect(() => {
    if (videoRef.current && previewStream && !isVideoReady) {
      console.log('Assigning previewStream to videoRef');
      videoRef.current.srcObject = previewStream;
      videoRef.current.play().then(() => {
        console.log('Preview stream playing');
        setIsVideoReady(true);
      }).catch(error => {
        console.error('Failed to play previewStream:', error);
      });
    }
  }, [previewStream, isVideoReady]);

  // Video initialization timeout
  useEffect(() => {
    if (!isVideoReady) {
      const timeout = setTimeout(() => {
        if (!isVideoReady) {
          console.error('Webcam video failed to initialize');
        }
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [isVideoReady]);

  // Log environment variables
  useEffect(() => {
    if (isVideoReady) {
      console.log('Environment variables:', {
        django: process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE,
        springboot: process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE,
        fileBaseUrl: process.env.REACT_APP_SPRINGBOOT_FILE_BASE_URL,
        organisation,
        selectedLanguage,
      });
    }
  }, [organisation, selectedLanguage, isVideoReady]);

  // Fetch questions
  useEffect(() => {
    if (!isVideoReady) return;

    const fetchQuestions = async () => {
      try {
        setLoadingMessage('Loading interview questions...');
        const response = await axios.post(
          `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_interview_data/`,
          { object_id: objId },
          { headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation } }
        );
        setQuestions(response.data.data.questions.map((q: any) => ({ question: q.question, answer: '' })));
        setUploadStatus(new Array(response.data.data.questions.length).fill(false));
        setHasSpokenQuestion(new Array(response.data.data.questions.length).fill(false));
        setLoadingMessage('');
      } catch (error: any) {
        console.error('Error fetching questions:', error.message || error);
        setLoadingMessage('');
      }
    };
    fetchQuestions();
  }, [objId, organisation, isVideoReady]);

  // Text-to-speech
  useEffect(() => {
    if (
      !isVideoReady ||
      !voicesLoaded ||
      questions.length === 0 ||
      !questions[currentQuestion]?.question ||
      hasSpokenQuestion[currentQuestion] ||
      isUploading ||
      isSubmitting ||
      isProcessingQuestion ||
      !lipSyncVideoRef.current
    ) return;

    const videoElement = lipSyncVideoRef.current;
    const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].question);
    utterance.lang = selectedLanguage;

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice =>
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('woman') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Victoria') ||
      voice.name.includes('Zira') ||
      voice.name.includes('Tessa') ||
      voice.name.includes('Google US English')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
      console.log(`Question ${currentQuestion + 1} - Using voice: ${femaleVoice.name}`);
    } else {
      console.warn(`Question ${currentQuestion + 1} - No female voice found`);
    }

    utterance.onstart = () => {
      setIsReadingQuestion(true);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        console.log(`Question ${currentQuestion + 1} - Speech recognition stopped during TTS`);
      }
      if (videoElement) {
        videoElement.play().catch(error => {
          console.error(`Question ${currentQuestion + 1} - Failed to play lip-sync video:`, error);
        });
      }
    };

    utterance.onend = () => {
      setIsReadingQuestion(false);
      setHasSpokenQuestion(prev => {
        const updated = [...prev];
        updated[currentQuestion] = true;
        return updated;
      });

      if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
      }

      if (status !== 'recording') {
        startRecording();
        console.log(`Question ${currentQuestion + 1} - Recording started`);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          console.log(`Question ${currentQuestion + 1} - Speech recognition started after TTS`);
        } catch (error) {
          console.error(`Question ${currentQuestion + 1} - Failed to start speech recognition after TTS:`, error);
        }
      }
    };

    utterance.onerror = (event) => {
      console.error(`Question ${currentQuestion + 1} - Speech synthesis error:`, event);
      setIsReadingQuestion(false);
      setHasSpokenQuestion(prev => {
        const updated = [...prev];
        updated[currentQuestion] = true;
        return updated;
      });
    };

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
      console.log(`Question ${currentQuestion + 1} - Speaking question: "${questions[currentQuestion].question}"`);
    }, 500);

    return () => {
      window.speechSynthesis.cancel();
      if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    };
  }, [currentQuestion, questions, selectedLanguage, startRecording, status, isUploading, isSubmitting, isProcessingQuestion, hasSpokenQuestion, isVideoReady, voicesLoaded]);

  const updateAnswer = async (
    questionText: string,
    answer: string,
    index: number,
    blobUrl?: string | null,
    forceUpload = false
  ) => {
    console.log(`Question ${index + 1} - Updating answer: "${answer}"`);
    try {
      setIsUploading(true);
      setLoadingMessage(`Processing Question ${index + 1}...`);
      setUploadProgress(0);
      let uploadedVideoUrl: string | null = null;

      if (blobUrl && (!uploadStatus[index] || forceUpload)) {
        setLoadingMessage(`Uploading video for Question ${index + 1}...`);
        setUploadProgress(25);
        const response = await fetch(blobUrl);
        const blob = await response.blob();

        if (blob.size > 0) {
          const file = new File([blob], `interview-q${index + 1}.mp4`, { type: 'video/mp4' });
          const formData = new FormData();
          formData.append('videoFile', file);
          formData.append('meetingId', objId);
          formData.append('transcript', answer);

          const uploadResponse = await axios.post(
            `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/recording/write/${organisation}`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  const progress = Math.round((progressEvent.loaded * 50) / progressEvent.total);
                  setUploadProgress(25 + progress);
                }
              }
            }
          );

          uploadedVideoUrl = uploadResponse.data.outputFileName;
          setUploadProgress(75);
          console.log(`Question ${index + 1} - Video uploaded: ${uploadedVideoUrl}`);

          if (uploadedVideoUrl) {
            let retries = 5;
            let delay = 2000;
            while (retries > 0) {
              try {
                const verifyResponse = await axios.get(uploadedVideoUrl, {
                  responseType: 'blob',
                  headers: { Accept: 'video/mp4' },
                });
                if (verifyResponse.status === 200 && verifyResponse.data.type === 'video/mp4') {
                  console.log(`Question ${index + 1} - Video URL verified`);
                  break;
                }
              } catch (urlError: any) {
                console.error(`Question ${index + 1} - Attempt ${6 - retries} failed to verify video: ${urlError.message}`);
                retries--;
                if (retries === 0) {
                  uploadedVideoUrl = null;
                  console.error(`Question ${index + 1} - Failed to verify video after multiple attempts`);
                  break;
                }
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
              }
            }
          } else {
            console.error(`Question ${index + 1} - No video URL returned`);
          }

          setUploadStatus((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
        }
      }

      setLoadingMessage(`Updating answer for Question ${index + 1}...`);
      setUploadProgress(85);
      const finalAnswer = answer.trim() || code.trim() || 'No answer provided';
      console.log(`Question ${index + 1} - Submitting to API: "${finalAnswer}"`);
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/update_answer/`,
        {
          object_id: objId,
          question_text: questionText,
          answer: finalAnswer,
        },
        { headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation } }
      );

      if (uploadedVideoUrl) {
        setUploadProgress(95);
        await axios.post(
          `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/process_video/`,
          {
            video_url: uploadedVideoUrl,
            meeting_id: meetingId,
            object_id: objId,
            question_index: index,
          },
          { headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation } }
        );
        console.log(`Question ${index + 1} - Video processed`);
      }

      setUploadProgress(100);
    } catch (error: any) {
      console.error(`Question ${index + 1} - Error processing:`, error.message || error);
    } finally {
      setIsUploading(false);
      setLoadingMessage('');
      setUploadProgress(0);
    }
  };

  const handleNextQuestion = () => {
    stopRecording();
    setLastBlobUrl(mediaBlobUrl ?? null);
    if (interimTranscript) {
      setTranscript(prev => {
        const newTranscript = prev + interimTranscript;
        setQuestions(prevQuestions => {
          const updated = [...prevQuestions];
          updated[currentQuestion] = { ...updated[currentQuestion], answer: newTranscript };
          console.log(`Question ${currentQuestion + 1} - Captured interim transcript: "${newTranscript}"`);
          return updated;
        });
        return newTranscript;
      });
      setInterimTranscript('');
    }
    setOpenNextDialog(true);
  };

  const handleDialogYes = async () => {
    setOpenNextDialog(false);
    if (questions[currentQuestion]?.question) {
      setIsProcessingQuestion(true);
      const currentAnswer = questions[currentQuestion].answer || interimTranscript || '';
      console.log(`Question ${currentQuestion + 1} - Processing with answer: "${currentAnswer}"`);
      await updateAnswer(questions[currentQuestion].question, currentAnswer, currentQuestion, lastBlobUrl ?? mediaBlobUrl);
      setTranscript('');
      setInterimTranscript('');
      setLastBlobUrl(null);
      setCurrentQuestion((prev) => prev + 1);
      setIsProcessingQuestion(false);
    } else {
      console.error('No question available to process');
    }
  };

  const handleSubmitInterview = async () => {
    setIsSubmitting(true);
    setLoadingMessage('Submitting your interview...');
    setSubmissionProgress(0);
    stopRecording();

    if (interimTranscript) {
      setTranscript(prev => {
        const newTranscript = prev + interimTranscript;
        setQuestions(prevQuestions => {
          const updated = [...prevQuestions];
          updated[currentQuestion] = { ...updated[currentQuestion], answer: newTranscript };
          console.log(`Question ${currentQuestion + 1} - Captured interim transcript for submission: "${newTranscript}"`);
          return updated;
        });
        return newTranscript;
      });
      setInterimTranscript('');
    }

    if (questions[currentQuestion]?.question) {
      const currentAnswer = questions[currentQuestion].answer || interimTranscript || '';
      console.log(`Question ${currentQuestion + 1} - Final submission with answer: "${currentAnswer}"`);
      await updateAnswer(questions[currentQuestion].question, currentAnswer, currentQuestion, mediaBlobUrl ?? null);
    }

    for (let i = 0; i < questions.length; i++) {
      if (!uploadStatus[i]) {
        const emptyBlob = new Blob([], { type: 'video/mp4' });
        const fileUrl = URL.createObjectURL(emptyBlob);
        await updateAnswer(questions[i].question, questions[i].answer || '', i, fileUrl, true);
      }
    }

    setLoadingMessage('Processing interview results...');
    try {
      const apiEndpoints = [
        {
          url: `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/interview/Thankingmail/${organisation}`,
          data: { meetingId },
          headers: { 'Content-Type': 'application/json' },
          name: 'Thanking Email'
        },
        {
          url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/interview_status/`,
          data: { object_id: objId, interview_status: 'completed' },
          headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
          name: 'Interview Status'
        },
        {
          url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/generate_feedback/`,
          data: { object_id: objId, language_selected: selectedLanguage },
          headers: { 'Content-Type': 'multipart/form-data', organization: organisation, Organization: organisation },
          name: 'Generate Feedback'
        },
        {
          url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/analyze_questions/`,
          data: { object_id: objId, language_selected: selectedLanguage },
          headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
          name: 'Analyze Questions'
        },
        // {
        //   url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/batch_process_interview_analysis/`,
        //   data: { object_id: objId, language_selected: selectedLanguage },
        //   headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
        //   name: 'Batch Process Analysis'
        // },
        {
          url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract_soft_skills/`,
          data: { object_id: objId, language_selected: selectedLanguage },
          headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
          name: 'Extract Soft Skills'
        },
        {
          url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract_strengths_areas/`,
          data: { object_id: objId, language_selected: selectedLanguage },
          headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
          name: 'Extract Strengths Areas'
        },
        {
          url: `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/extract-techskills-scores/`,
          data: { object_id: objId, language_selected: selectedLanguage },
          headers: { 'Content-Type': 'application/json', organization: organisation, Organization: organisation },
          name: 'Extract Tech Skills Scores'
        },
      ];

      const totalApis = apiEndpoints.length;
      let completedApis = 0;

      const apiPromises = apiEndpoints.map(async (api, index) => {
        try {
          setLoadingMessage(`Processing ${api.name} (${index + 1} of ${totalApis})...`);
          const response = await axios.post(api.url, api.data, { headers: api.headers });
          console.log(`API ${api.name} completed with status: ${response.status}`);
          completedApis += 1;
          setSubmissionProgress((completedApis / totalApis) * 100);
          return response;
        } catch (error: any) {
          console.error(`Failed to process ${api.name}:`, error.response?.data || error.message || error);
          completedApis += 1;
          setSubmissionProgress((completedApis / totalApis) * 100);
          return null;
        }
      });

      await Promise.all(apiPromises);

      setLoadingMessage('All processing complete, redirecting...');
      setSubmissionProgress(100);
      setTranscript('');
      setInterimTranscript('');
      console.log('Navigating to /signin');
      navigate('/signin');
    } catch (error: any) {
      console.error('Unexpected error during submission:', error.message || error);
      setSubmissionProgress(100);
      setTranscript('');
      setInterimTranscript('');
      navigate('/signin');
    } finally {
      setIsSubmitting(false);
      setLoadingMessage('');
      setSubmissionProgress(0);
    }
  };

  const handleEditorChange = (value: string | undefined) => setCode(value || '');
  const handleUpload = () => fileInputRef.current?.click();

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
      alert('File uploaded successfully');
    } catch (error: any) {
      console.error('Upload failed:', error.message || error);
      alert('File upload failed');
    }
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
    <div style={{ position: "relative", height: "100vh", backgroundColor: "black", overflow: "hidden" }}>
      {(isUploading || isSubmitting || isProcessingQuestion || loadingMessage) && (
        <ProfessionalLoader
          message={loadingMessage || 'Processing'}
          progress={isSubmitting ? submissionProgress : uploadProgress > 0 ? uploadProgress : undefined}
        />
      )}

      <div style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "black"
      }}>
        <div style={{
          flex: "0 0 55%",
          position: "relative",
          backgroundColor: "black"
        }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              backgroundColor: "black"
            }}
          />
        </div>

        <div style={{
          flex: "0 0 45%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "black",
          padding: "1rem"
        }}>
          <div style={{
            flex: "0 0 200px",
            display: "flex",
            marginBottom: "1rem"
          }}>
            <video
              ref={lipSyncVideoRef}
              muted
              style={{
                width: '90%',
                height: '200px',
                backgroundColor: 'transparent',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                objectFit: 'cover'
              }}
            >
              <source
                src={`${process.env.PUBLIC_URL}/assets/static/images/20240913132119-119 (online-video-cutter.com).mp4`}
                type="video/mp4"
              />
            </video>
          </div>

          <div style={{
            flex: "1",
            marginBottom: "1rem"
          }}>
            <div style={{
              background: "rgba(0,0,0,0.7)",
              padding: "1rem",
              borderRadius: "16px",
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              height: "70%",
              color: "white",
              width: "85%"
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <Typography variant="h6" style={{ fontWeight: 'bold', marginRight: '1rem' }}>
                  Question {currentQuestion + 1}/{questions.length}
                </Typography>
                {uploadStatus[currentQuestion] ? (
                  <CheckCircle style={{ color: '#4caf50', fontSize: '24px' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <MicIcon style={{ color: status === 'recording' && !isReadingQuestion ? '#f44336' : '#fff', fontSize: '20px', marginRight: '0.5rem' }} />
                    {status === 'recording' && !isReadingQuestion && (
                      <div style={{ width: '8px', height: '8px', backgroundColor: '#f44336', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                    )}
                    {isReadingQuestion && (
                      <div style={{ fontSize: '12px', color: '#ffa726', marginLeft: '0.5rem' }}>
                        Reading question...
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Typography variant="body1" style={{ marginBottom: '1rem', lineHeight: '1.4' }}>
                {isVideoReady && questions[currentQuestion]?.question ? questions[currentQuestion].question : "Waiting for webcam to initialize..."}
              </Typography>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '1rem',
                borderRadius: '8px',
                minHeight: '80px',
                display:'none'
              }}>
                <Typography variant="body2" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Your Answer:
                </Typography>
                <Typography variant="body2" style={{
                  fontStyle: transcript || interimTranscript ? 'normal' : 'italic',
                  color: transcript || interimTranscript ? '#fff' : '#bbb'
                }}>
                  {transcript || interimTranscript || (isReadingQuestion ? 'Please wait for the question to finish...' : 'Start speaking to see your answer here...')}
                </Typography>
              </div>
            </div>
          </div>

          <div style={{
            flex: "0 0 auto",
            display: 'flex',
            flexDirection: 'column',
            width: "90%",
            padding: '5px'
          }}>
            <div style={{
              display: 'flex',
              gap: "1rem",
              justifyContent: 'center'
            }}>
              <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px', pointerEvents: 'none', opacity: 0.5 }}>
                <MicIcon />
              </IconButton>
              <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px', pointerEvents: 'none', opacity: 0.5 }}>
                <VideocamIcon />
              </IconButton>
              <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px' }} onClick={() => setShowEditor(true)}>
                <CodeIcon />
              </IconButton>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
              <IconButton sx={{ backgroundColor: '#0284C7', color: '#fff', width: '35px', height: '35px' }} onClick={handleUpload}>
                <AttachFileIcon />
              </IconButton>
              {currentQuestion === questions.length - 1 ? (
                <Button
                  onClick={() => setOpenSubmitDialog(true)}
                  variant="contained"
                  disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
                  style={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    minWidth: "150px",
                  }}
                >
                  {isUploading || isSubmitting || isProcessingQuestion ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={20} style={{ marginRight: '8px', color: 'white' }} />
                      Processing...
                    </div>
                  ) : (
                    "Submit Interview"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  variant="contained"
                  disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
                  style={{
                    backgroundColor: '#2196f3',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px 15px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    minWidth: "150px",
                  }}
                >
                  {isUploading || isSubmitting || isProcessingQuestion ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={20} style={{ marginRight: '8px', color: 'white' }} />
                      Processing...
                    </div>
                  ) : (
                    "Next Question"
                  )}
                </Button>
              )}

              <Button
                onClick={() => setOpenSubmitDialog(true)}
                variant="outlined"
                disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
                style={{
                  backgroundColor: '#2196f3',
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  minWidth: "150px",
                  color: "#fff"
                }}
              >
                {isUploading || isSubmitting || isProcessingQuestion ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={16} style={{ marginRight: '8px', color: '#ff9800' }} />
                    Processing...
                  </div>
                ) : (
                  "End Interview"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showEditor && (
        <Box
          ref={editorRef}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            height: '45vh',
            bgcolor: 'background.paper',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            p: 1,
            border: '1px solid rgba(255,255,255,0.2)',
            zIndex: 4
          }}
        >
          <Editor
            height="100%"
            width="100%"
            language="javascript"
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
          />
        </Box>
      )}

      <Dialog
        open={openNextDialog}
        onClose={() => setOpenNextDialog(false)}
        PaperProps={{
          style: {
            borderRadius: '16px',
            padding: '8px',
            zIndex: 5
          }
        }}
      >
        <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
          Proceed to Next Question
        </DialogTitle>
        <DialogContent style={{ textAlign: 'center', padding: '20px' }}>
          <Typography variant="body1">
            Are you ready to move to the next question? Your current answer will be saved.
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center', padding: '16px' }}>
          <Button
            onClick={() => setOpenNextDialog(false)}
            variant="outlined"
            style={{ marginRight: '12px' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDialogYes}
            variant="contained"
            disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
            style={{ backgroundColor: '#2196f3' }}
          >
            {isUploading || isSubmitting || isProcessingQuestion ? (
              <CircularProgress size={24} style={{ color: 'white' }} />
            ) : (
              "Yes, Continue"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSubmitDialog}
        onClose={() => setOpenSubmitDialog(false)}
        PaperProps={{
          style: {
            borderRadius: '16px',
            padding: '8px',
            zIndex: 5
          }
        }}
      >
        <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
          Submit Interview
        </DialogTitle>
        <DialogContent style={{ textAlign: 'center', padding: '20px' }}>
          <Typography variant="body1" style={{ marginBottom: '16px' }}>
            Are you sure you want to submit your interview? This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            We will process your responses and send you feedback via email.
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center', padding: '16px' }}>
          <Button
            onClick={() => setOpenSubmitDialog(false)}
            variant="outlined"
            style={{ marginRight: '12px' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitInterview}
            variant="contained"
            disabled={isUploading || isSubmitting || isProcessingQuestion || !isVideoReady}
            style={{ backgroundColor: '#4caf50' }}
          >
            {isUploading || isSubmitting || isProcessingQuestion ? (
              <CircularProgress size={24} style={{ color: 'white' }} />
            ) : (
              "Submit Interview"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const InterviewAttend: React.FC = () => (
  <ReactMediaRecorder
    video
    audio
    render={(props: ReactMediaRecorderRenderProps) => <RecorderView {...props} />}
  />
);

export default InterviewAttend;