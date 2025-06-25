import React, { useRef, useEffect, useState } from "react";
import {
  ReactMediaRecorder,
  ReactMediaRecorderRenderProps,
} from "react-media-recorder";

// Sample questions
const questions = [
  "Imagine you're tasked with building a web application for an online bookstore. The application should allow users to browse books, add them to their cart, and complete purchases?",
  "Can you explain the concept of closures in JavaScript?",
  "How would you handle state management in a large React application?",
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
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [hasStarted, setHasStarted] = useState(false);

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
            if (currentQuestion < questions.length - 1) {
              setCurrentQuestion((prev) => prev + 1);
              setTimeLeft(300);
              setTimeout(() => startRecording(), 1000);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, currentQuestion, stopRecording, startRecording]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

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
            Start Recording
          </button>
        </div>
      ) : (
        <>
          {/* Video Preview */}
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

          {/* Overlay Content */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "2rem",
              color: "white",
            }}
          >
            {/* Top Bar - Question and Timer */}
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
                  Question: {currentQuestion + 1}
                </p>
                <p style={{ maxWidth: "600px" }}>{questions[currentQuestion]}</p>
              </div>
              <div style={{ alignSelf: "flex-start", fontWeight: "bold" }}>
                Time Remaining: <span style={{ color: "orange" }}>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Bottom Center Buttons */}
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button
                onClick={startRecording}
                disabled={status === "recording"}
                style={buttonStyle}
              >
                Start Recording
              </button>
              <button
                onClick={stopRecording}
                disabled={status !== "recording"}
                style={buttonStyle}
              >
                Stop Recording
              </button>
            </div>
          </div>

          {/* Bottom-Right Interviewer Image */}
          <img
            src="/assets/static/images/Rectangle34624281.png"
            alt="Speaker"
            style={{
              position: "absolute",
              bottom: "2rem",
              right: "2rem",
              width: "250px",
              borderRadius: "12px",
              zIndex: 3,
            }}
          />
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