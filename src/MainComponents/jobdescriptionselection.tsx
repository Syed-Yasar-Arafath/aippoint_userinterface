import React, { useState, useRef, useEffect } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

export default function JobDescriptionSelection() {
  const labelStyle: React.CSSProperties = {
    fontFamily: 'SF Pro Display',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '18px',
    textAlign: 'left',
    color: '#0284C7',
    padding: '5px 8px 5px 0px',
  }
  const [selectedOption, setSelectedOption] = useState('')
  const [optionsEnabled, setOptionsEnabled] = useState(false)
  const [clickedButton, setClickedButton] = useState<'upload' | 'ats' | null>(
    null,
  )
  const [loading, setLoading] = useState(true) // Add loading state

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Simulate loading on page refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000) // 2-second delay to simulate loading
    return () => clearTimeout(timer)
  }, [])

  const handleOptionClick = (option: string) => {
    if (!optionsEnabled) {
      setOptionsEnabled(true)
    }
    setSelectedOption(option)
  }

  const handleButtonClick = (button: 'upload' | 'ats') => {
    setClickedButton(button)
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log('File selected:', file.name)
    }
  }

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <Stack
      spacing={2}
      style={{ width: '100%', maxWidth: '768px', padding: '32px' }}
    >
      {/* Title and Description Skeletons */}
      <Skeleton variant="text" sx={{ fontSize: '18px', width: '50%' }} />
      <Skeleton variant="text" sx={{ fontSize: '10px', width: '30%' }} />

      {/* Create JD Card Skeleton */}
      <Stack
        direction="row"
        spacing={2}
        style={{
          padding: '24px',
          border: '2px solid #d1d5db',
          borderRadius: '12px',
          backgroundColor: '#f3f4f6',
        }}
      >
        <Skeleton
          variant="rectangular"
          width={56}
          height={56}
          sx={{ borderRadius: '8px' }}
        />
        <Stack spacing={1} style={{ flex: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: '16px', width: '40%' }} />
          <Skeleton variant="text" sx={{ fontSize: '14px', width: '60%' }} />
        </Stack>
      </Stack>

      {/* Upload JD Card Skeleton */}
      <Stack
        direction="row"
        spacing={2}
        style={{
          padding: '24px',
          border: '2px solid #d1d5db',
          borderRadius: '12px',
          backgroundColor: '#f3f4f6',
        }}
      >
        <Skeleton
          variant="rectangular"
          width={56}
          height={56}
          sx={{ borderRadius: '8px' }}
        />
        <Stack spacing={1} style={{ flex: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: '16px', width: '40%' }} />
          <Skeleton variant="text" sx={{ fontSize: '14px', width: '60%' }} />
          <Stack direction="row" spacing={1} style={{ marginTop: '8px' }}>
            <Skeleton
              variant="rectangular"
              width={100}
              height={36}
              sx={{ borderRadius: '6px' }}
            />
            <Skeleton
              variant="rectangular"
              width={120}
              height={36}
              sx={{ borderRadius: '6px' }}
            />
          </Stack>
        </Stack>
      </Stack>

      {/* Footer Buttons Skeleton */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        style={{ marginTop: '32px' }}
      >
        <Skeleton
          variant="rectangular"
          width={100}
          height={40}
          sx={{ borderRadius: '8px' }}
        />
        <Skeleton
          variant="rectangular"
          width={100}
          height={40}
          sx={{ borderRadius: '8px' }}
        />
      </Stack>
    </Stack>
  )

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '24px',
        fontFamily: 'SF Pro Display',
      }}
    >
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            padding: '32px',
            width: '100%',
            maxWidth: '768px',
            fontFamily: 'SF Pro Display',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '2px',
              fontFamily: 'SF Pro Display',
            }}
          >
            Select the type of JD you want to create
          </h2>
          <p
            style={{
              fontSize: '10px',
              fontWeight: '400',
              color: 'gray',
              fontFamily: 'SF Pro Display',
            }}
          >
            Select an option to continue and create job description
          </p>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Create JD Option */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '24px',
                border: '2px solid',
                borderColor:
                  selectedOption === 'create' ? '#0284C7' : '#d1d5db',
                borderRadius: '12px',
                cursor: 'pointer',
                backgroundColor:
                  selectedOption === 'create'
                    ? '#e6f0ff'
                    : optionsEnabled
                    ? '#ffffff'
                    : '#f3f4f6',
                opacity: optionsEnabled || selectedOption ? 1 : 0.6,
                fontFamily: 'SF Pro Display',
              }}
              onClick={() => handleOptionClick('create')}
            >
              <div
                style={{
                  backgroundColor:
                    selectedOption === 'create'
                      ? '#0284C7'
                      : optionsEnabled
                      ? '#d1d5db'
                      : '#e5e7eb',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  marginRight: '16px',
                  fontSize: '24px',
                }}
              >
                📄
              </div>
              <div>
                <h3
                  style={{
                    color:
                      selectedOption === 'create'
                        ? '#0284C7'
                        : optionsEnabled
                        ? '#6b7280'
                        : '#9ca3af',
                    fontWeight: '600',
                    marginBottom: '4px',
                    fontFamily: 'SF Pro Display',
                  }}
                >
                  Create Job Description
                </h3>
                <p
                  style={{
                    color:
                      optionsEnabled || selectedOption ? '#6b7280' : '#9ca3af',
                    fontSize: '14px',
                    fontFamily: 'SF Pro Display',
                  }}
                >
                  Define role requirements, responsibilities, and
                  qualifications.
                </p>
              </div>
            </div>

            {/* Upload JD Option */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '24px',
                border: '2px solid',
                borderColor:
                  selectedOption === 'upload' ? '#0284C7' : '#d1d5db',
                borderRadius: '12px',
                cursor: 'pointer',
                backgroundColor:
                  selectedOption === 'upload'
                    ? '#e6f0ff'
                    : optionsEnabled
                    ? '#ffffff'
                    : '#f3f4f6',
                opacity: optionsEnabled || selectedOption ? 1 : 0.6,
                fontFamily: 'SF Pro Display',
              }}
              onClick={() => handleOptionClick('upload')}
            >
              <div
                style={{
                  backgroundColor:
                    selectedOption === 'upload'
                      ? '#0284C7'
                      : optionsEnabled
                      ? '#d1d5db'
                      : '#e5e7eb',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  marginRight: '16px',
                  fontSize: '24px',
                }}
              >
                <CloudUploadIcon />
              </div>
              <div>
                <h3
                  style={{
                    color:
                      selectedOption === 'upload'
                        ? '#0284C7'
                        : optionsEnabled
                        ? '#6b7280'
                        : '#9ca3af',
                    fontWeight: '600',
                    marginBottom: '4px',
                    fontFamily: 'SF Pro Display',
                  }}
                >
                  Upload Job Description
                </h3>
                <p
                  style={{
                    color:
                      optionsEnabled || selectedOption ? '#6b7280' : '#9ca3af',
                    fontSize: '14px',
                    fontFamily: 'SF Pro Display',
                  }}
                >
                  Upload from Local or ATS
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button
                    style={{
                      backgroundColor:
                        clickedButton === 'upload' ? '#0284C7' : '#e5e7eb',
                      color: 'white',
                      fontSize: '14px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'SF Pro Display',
                    }}
                    onClick={() => handleButtonClick('upload')}
                  >
                    <CloudUploadIcon
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '8px',
                      }}
                    />
                    Upload
                  </button>
                  <button
                    style={{
                      backgroundColor:
                        clickedButton === 'ats' ? '#0284C7' : '#e5e7eb',
                      color: 'white',
                      fontSize: '14px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'SF Pro Display',
                    }}
                    onClick={() => handleButtonClick('ats')}
                  >
                    <img
                      src="assets/static/images/icon1.png"
                      alt="ATS"
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '8px',
                      }}
                    />
                    Connect to ATS
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '32px',
              gap: '16px',
            }}
          >
            <button
              style={{
                padding: '8px 24px',
                borderRadius: '8px',
                border: '1px solid #9ca3af',
                backgroundColor: selectedOption ? 'white' : '#e5e7eb',
                color: '#6b7280',
                cursor: selectedOption ? 'pointer' : 'not-allowed',
                fontFamily: 'SF Pro Display',
              }}
              disabled={!selectedOption}
            >
              Cancel
            </button>
            <button
              style={{
                padding: '8px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: selectedOption ? '#0284C7' : '#d1d5db',
                color: 'white',
                cursor: selectedOption ? 'pointer' : 'not-allowed',
                fontFamily: 'SF Pro Display',
              }}
              disabled={!selectedOption}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  )
}
