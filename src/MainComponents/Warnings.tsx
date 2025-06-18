import React, { useState } from 'react'
import Switch from '@mui/material/Switch'
import { Padding } from '@mui/icons-material'

const Warnings: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)

  const section_style = {
    marginBottom: '11px',
    borderRadius: '12px',
    backgroundColor: '#f5f5f5',
    padding: '13px 0px 13px 9px',
  }
  const sub_heading = {
    fontFamily: 'SF Pro Display',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '100%',
    letterSpacing: '0%',
    color: '#1C1C1E',
  }
  const descriptions = {
    fontFamily: 'SF Pro Display',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0%',
    color: '#1C1C1E80',
  }

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'space-between',
    // width: '120px',
    gap: '36px',
    // Padding: '9px 4px 9px 40px',
    marginRight: '15px',
    border: '0.5px solid #1C1C1E1A',
    borderRadius: '24px',
  }

  const bothSwitchesOn = isCameraOn && isMicOn
  return (
    <div
      style={{
        height: '100vh',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
        <h2
          style={{
            fontFamily: 'SF Pro Display',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#0284C7',
            marginBottom: '10px',
          }}
        >
          Interview Instructions
        </h2>
        <p
          style={{
            fontFamily: 'SF Pro Display',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#1C1C1E',
            marginBottom: '15px',
          }}
        >
          Ensure a smooth interview experience by following these guidelines on
          setup, system requirements, and best practices.
        </p>

        <section style={section_style}>
          <h3 style={sub_heading}>Pre-requisites</h3>
          <ol style={descriptions}>
            <li>
              Ensure a stable internet connection (Minimum 5 Mbps recommended).
            </li>
            <li>
              Use a quiet environment with no background noise or distractions.
            </li>
            <li>
              Keep a valid government-issued ID for identity verification.
            </li>
            <li>Have a copy of your resume handy for reference.</li>
            <li>Dress appropriately for a professional video interview.</li>
          </ol>
        </section>

        <section style={section_style}>
          <h3 style={sub_heading}>System Requirements</h3>
          <ol style={descriptions}>
            <li>
              Device: Laptop or desktop (Mobile devices are not recommended).
            </li>
            <li>Browser: Google Chrome or Microsoft Edge (Latest version).</li>
            <li>
              Camera & Microphone: Ensure your webcam and microphone are
              working.
              <div
                style={{
                  marginTop: '5px',
                  marginBottom: '10px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                <label style={labelStyle}>
                  <span
                    style={{
                      fontFamily: 'SF Pro Display',
                      fontWeight: 400,
                      fontSize: '10px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#1C1C1E',
                      marginLeft: '4px',
                    }}
                  >
                    Camera
                  </span>
                  <Switch
                    checked={isCameraOn}
                    onChange={() => setIsCameraOn(!isCameraOn)}
                    color="primary"
                    size="small"
                  />
                </label>
                <label style={labelStyle}>
                  <span
                    style={{
                      fontFamily: 'SF Pro Display',
                      fontWeight: 400,
                      fontSize: '10px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#1C1C1E',
                      marginLeft: '4px',
                    }}
                  >
                    Microphone
                  </span>
                  <Switch
                    checked={isMicOn}
                    onChange={() => setIsMicOn(!isMicOn)}
                    color="primary"
                    size="small"
                  />
                </label>
              </div>
            </li>
            <li>Power Backup: Keep your device charged or plugged in.</li>
            <li>
              Disable Notifications: Turn off pop-ups and notifications for a
              distraction-free experience.
            </li>
          </ol>
        </section>

        <section style={section_style}>
          <h3 style={sub_heading}>During the Interview/Assessment</h3>
          <ol style={descriptions}>
            <li>
              Stay in Frame: Ensure your face is clearly visible at all times.
            </li>
            <li>
              Answer Clearly: Speak confidently and provide structured answers.
            </li>
            <li>
              Follow Instructions: Read questions carefully and answer fully.
            </li>
            <li>
              No External Help: Do not use notes, another device, or external
              help.
            </li>
            <li>
              Avoid Connectivity Issues: If disconnected, reconnect immediately.
            </li>
          </ol>
        </section>

        <div style={section_style}>
          <p
            style={{
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '12px',
            }}
          >
            <strong
              style={{
                fontFamily: 'SF Pro Display',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '100%',
                letterSpacing: '0%',
              }}
            >
              Important
            </strong>
            <br />
            <span style={descriptions}>
              Your interview is being recorded and monitored for authenticity.
              Any violation of the guidelines may lead to disqualification.
            </span>
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px',
          }}
        >
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            disabled={!bothSwitchesOn}
            style={{ cursor: bothSwitchesOn ? 'pointer' : 'not-allowed' }}
          />
          <label
            style={{
              fontFamily: 'SF Pro Display',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#1C1C1E',
            }}
          >
            By proceeding, you agree to the terms and conditions of the
            interview, including proctoring and assessment guidelines.
          </label>
        </div>

        <button
          style={{
            backgroundColor: isChecked ? '#1e90ff' : '#ccc',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: isChecked ? 'pointer' : 'not-allowed',
            fontSize: '14px',
          }}
          disabled={!isChecked}
        >
          Continue to Interview
        </button>
      </div>
    </div>
  )
}

export default Warnings
