import React, { useRef, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VideocamIcon from '@mui/icons-material/Videocam';
import CodeIcon from '@mui/icons-material/Code';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import { Editor } from '@monaco-editor/react';
import { Box, Button, IconButton } from '@mui/material';
import { ReactMediaRecorder, ReactMediaRecorderRenderProps } from "react-media-recorder";
import axios from 'axios';

const questions = [
  "Imagine you're tasked with building a web application for an online bookstore. The application should allow users to browse books, add them to their cart, and complete purchases.",
  "Can you explain the concept of closures in JavaScript?",
  "How would you handle state management in a large React application?",
  "What are the differences between REST and GraphQL APIs?",
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [hasStarted, setHasStarted] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [code, setCode] = useState('');
  const language = 'javascript';
  const [videos, setVideos] = useState<HTMLVideoElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get organisation and meetingId from location state
  const location = useLocation();
  const { organisation, meetingId } = location.state || { organisation: "default-org", meetingId: "default-meeting" };

  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  useEffect(() => {
    if (status === "recording") {
      setHasStarted(true);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, stopRecording]);

  // Save recording to backend when mediaBlobUrl is available
  const saveRecording = async (blobUrl: string) => {
    try {
      setIsUploading(true);
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const file = new File([blob], `recording-question-${currentQuestion + 1}.mp4`, { type: 'video/mp4' });

      const formData = new FormData();
      formData.append('videoFile', file);

      const apiUrl = `/recordings/${organisation}/${meetingId}/${currentQuestion + 1}`;
      const result = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Recording uploaded successfully:', result.data);
      alert('Recording uploaded successfully!');
      return true;
    } catch (error) {
      console.error('Failed to upload recording:', error);
      alert('Failed to upload recording. Please try again.');
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (mediaBlobUrl && status === "stopped") {
      saveRecording(mediaBlobUrl);
    }
  }, [mediaBlobUrl, status]);

  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      if (status === "recording") {
        stopRecording();
        // Wait for the mediaBlobUrl to be available
        const checkBlobUrl = setInterval(async () => {
          if (mediaBlobUrl && !isUploading) {
            clearInterval(checkBlobUrl);
            const uploadSuccess = await saveRecording(mediaBlobUrl);
            if (uploadSuccess) {
              setCurrentQuestion((prev) => prev + 1);
              setTimeLeft(300);
              setTimeout(() => startRecording(), 1000);
            }
          }
        }, 500);
      } else {
        setCurrentQuestion((prev) => prev + 1);
        setTimeLeft(300);
        setTimeout(() => startRecording(), 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showEditor &&
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        setShowEditor(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEditor]);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        backgroundColor: "black",
      }}
    >
      {!hasStarted && status !== "recording" ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
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
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,
              backgroundColor: "black",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: '10px',
              left: 0,
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "2rem",
              color: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                padding: "1rem",
                borderRadius: "12px",
                maxWidth: "600px",
              }}
            >
              <div>
                <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                  Question: {currentQuestion + 1}/{questions.length}
                </p>
                <p style={{ maxWidth: "600px" }}>{questions[currentQuestion]}</p>
              </div>
              <div style={{ alignSelf: "flex-start", fontWeight: "bold" }}>
                Time Remaining: <span style={{ color: "orange" }}>{formatTime(timeLeft)}</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginTop: '10px' }}>
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
                <input type="file" style={{ display: 'none' }} />
                <IconButton
                  sx={{
                    backgroundColor: '#0284C7',
                    color: '#fff',
                    width: '30px',
                    height: '30px',
                  }}
                >
                  <AttachFileIcon />
                </IconButton>
              </div>
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestion === questions.length - 1 || isUploading}
                style={{
                  borderRadius: '8px',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: '1px solid #fff',
                  padding: '6px 10px',
                  fontWeight: 500,
                  textTransform: 'none',
                  width: '50%',
                }}
              >
                {isUploading ? 'Uploading...' : 'Next Question'}
              </Button>
              <Button
                style={{
                  borderRadius: '8px',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: '1px solid #fff',
                  padding: '6px 10px',
                  fontWeight: 500,
                  textTransform: 'none',
                  width: '50%',
                }}
              >
                End Interview
              </Button>
              <button
                onClick={startRecording}
                disabled={status === "recording" || isUploading}
                style={buttonStyle}
              >
                Start Recording
              </button>
              <button
                onClick={stopRecording}
                disabled={status !== "recording" || isUploading}
                style={buttonStyle}
              >
                Stop Recording
              </button>
            </div>
          </div>
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
          <video
            ref={(ref) => setVideos(ref)}
            width="100%"
            height="auto"
            muted
            style={{
              position: "absolute",
              bottom: "20px",
              right: "2rem",
              width: "250px",
              borderRadius: "12px",
              zIndex: 3,
              flex: '0 0 auto',
              backgroundColor: 'transparent',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <source
              src={`${process.env.PUBLIC_URL}assets/static/images/20240913132119-119 (online-video-cutter.com).mp4`}
              type="video/mp4"
              style={{
                maxHeight: '300px',
                minWidth: '200px',
              }}
            />
          </video>
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
      render={(props: ReactMediaRecorderRenderProps) => (
        <RecorderView {...props} />
      )}
    />
  );
};

export default InterviewAI;