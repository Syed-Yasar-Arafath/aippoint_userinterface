import React from 'react'

const CandidateLogIn: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        fontFamily: 'SF Pro Display',
        backgroundColor: '#fff',
        boxSizing: 'border-box',
      }}
    >
      {/* Left Section - Login Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 'clamp(20px, 5vw, 40px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <h1
            style={{
              color: '#1E90FF',
              fontSize: 'clamp(24px, 5vw, 36px)',
              fontWeight: 'bold',
              marginBottom: 'clamp(10px, 2vw, 20px)',
            }}
          >
            aippont.ai
          </h1>
          <h2
            style={{
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '100%',
              marginBottom: 'clamp(8px, 1.5vw, 15px)',
              WebkitFontSmoothing: 'antialiased',
            }}
          >
            Log in
          </h2>
          <p
            style={{
              color: '#666',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '120%',
              marginBottom: 'clamp(15px, 3vw, 30px)',
              WebkitFontSmoothing: 'antialiased',
            }}
          >
            To access your interview details, assessments, and progress, log in
            and take the next step in your hiring journey!
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(10px, 2vw, 20px)',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '100%',
                  marginBottom: 'clamp(5px, 1vw, 8px)',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="priya.sharma@gmail.com"
                style={{
                  width: '100%',
                  padding: 'clamp(8px, 1.5vw, 12px)',
                  fontSize: '12px',
                  border: '0.5px solid #0284C7',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontWeight: 500,
                  fontSize: 'clamp(10px, 1.5vw, 14px)',
                  lineHeight: '100%',
                  marginBottom: 'clamp(5px, 1vw, 8px)',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="#priya123"
                style={{
                  width: '100%',
                  padding: 'clamp(8px, 1.5vw, 12px)',
                  fontSize: 'clamp(12px, 1.8vw, 14px)',
                  border: '1px solid #1E90FF',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <button
              style={{
                backgroundColor: '#1E90FF',
                color: '#fff',
                padding: 'clamp(10px, 2vw, 14px)',
                fontSize: 'clamp(12px, 2vw, 16px)',
                fontWeight: 500,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: 'clamp(5px, 1vw, 10px)',
                textTransform: 'uppercase',
              }}
            >
              Log in
            </button>
          </div>
        </div>
      </div>

      {/* Right Section - Image */}
      <div
        style={{
          flex: 1,
          backgroundImage: 'url("assets/static/images/Select Candidate.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '12px',
        }}
      />
    </div>
  )
}

export default CandidateLogIn
