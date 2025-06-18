import { Button } from '@mui/material'
import React from 'react'

const InterviewConfirmation: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'SF Pro Display',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '40px 30px',
          borderRadius: '12px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          fontFamily: 'SF Pro Display',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <img
            src="assets/static/images/Group 1171277373.png"
            alt="Confirmation"
            style={{
              width: '150px',
              height: '120px',
              objectFit: 'contain',
            }}
          />
        </div>

        <div
          style={{
            color: '#0284C7',
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '12px',
            fontFamily: 'SF Pro Display',
          }}
        >
          Interview Invitation Sent!
        </div>
        <div
          style={{
            fontSize: '14px',
            color: '#333',
            marginBottom: '24px',
            fontFamily: 'SF Pro Display',
          }}
        >
          Candidates have been notified with the interview scheduling link.
          Check your email for confirmation and track responses in the Upcoming
          Interviews section.
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <Button
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'SF Pro Display',
              cursor: 'pointer',
              width: '150px',
              border: '1px solid #000',
              backgroundColor: '#fff',
              color: 'black',
              textTransform: 'initial',
              height: '40px',
            }}
          >
            Back
          </Button>
          <Button
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'SF Pro Display',
              cursor: 'pointer',
              width: '150px',
              backgroundColor: '#0284C7',
              color: '#fff',
              border: 'none',
              textTransform: 'initial',
              height: '40px',
            }}
          >
            Open Mail
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InterviewConfirmation
