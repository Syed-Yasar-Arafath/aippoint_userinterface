import React, { useState, ChangeEvent, FocusEvent, MouseEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CandidateLogIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    apiError: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: '',
      apiError: ''
    }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = '';

    if (name === 'email') {
      error = validateEmail(value);
    } else if (name === 'password') {
      error = validatePassword(value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    setErrors({
      email: emailError,
      password: passwordError,
      apiError: ''
    });

    // If no validation errors, proceed with API call
    if (!emailError && !passwordError) {
      setIsLoading(true);
      
      try {
        // Make API call to fetch interviews
        const response = await fetch('https://parseez.ai/parseez-spring-service/interview/wipro', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch interviews');
        }

        const interviews = await response.json();
        
        // Find matching interview with email and password
        const matchingInterview = interviews.find(
          (interview: any) => 
            interview.email.toLowerCase() === formData.email.toLowerCase() && 
            interview.password === formData.password
        );

        if (!matchingInterview) {
          setErrors(prev => ({
            ...prev,
            apiError: 'Invalid email or password'
          }));
          return;
        }

        // Check if interview has already been joined (token generated)
        if (matchingInterview.isTokenGenerated) {
          setErrors(prev => ({
            ...prev,
            apiError: 'You have already attended'
          }));
          return;
        }

        // Update isTokenGenerated to true
        const updateResponse = await fetch(
          `https://parseez.ai/parseez-spring-service/interview/wipro/${matchingInterview.interviewId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...matchingInterview,
              isTokenGenerated: true
            })
          }
        );

        if (!updateResponse.ok) {
          throw new Error('Failed to update interview status');
        }

        // Navigate immediately to next page with organization and interviewId
        navigate(`/ai_interview_ins/${matchingInterview.organisation}/${matchingInterview.interviewId}/${matchingInterview.meetingId}`);
        
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          apiError: 'An error occurred while logging in. Please try again.'
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f8fafc',
      overflow: 'hidden'
    }}>
      {/* Left Panel - Login Form */}
      <div style={{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'white',
        minWidth: '320px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '380px'
        }}>
          {/* Logo */}
          <div style={{
            marginBottom: 'clamp(1rem, 4vh, 2rem)'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: '700',
              color: '#0ea5e9',
              margin: '0',
              letterSpacing: '-0.5px'
            }}>
              appoint.ai
            </h1>
          </div>

          {/* Login Header */}
          <div style={{
            marginBottom: 'clamp(1rem, 3vh, 1.5rem)'
          }}>
            <h2 style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 0.5rem 0'
            }}>
              Log in
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              lineHeight: '1.4',
              margin: '0'
            }}>
              To access your interview details, assessments, and progress. Stay prepared and take the next step in your hiring journey!
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* API Error Message */}
            {errors.apiError && (
              <div style={{
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                padding: '0.75rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
              }}>
                {errors.apiError}
              </div>
            )}

            {/* Email Field */}
            <div style={{
              marginBottom: 'clamp(0.8rem, 2vh, 1.2rem)'
            }}>
              <label style={{
                display: 'block',
                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.4rem'
              }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={{
                  width: '100%',
                  padding: 'clamp(0.6rem, 1.5vh, 0.75rem) 1rem',
                  border: errors.email ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
                onFocus={(e: FocusEvent<HTMLInputElement>) => {
                  if (!errors.email) {
                    e.target.style.borderColor = '#0ea5e9';
                    e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                  }
                }}
                onBlurCapture={(e: FocusEvent<HTMLInputElement>) => {
                  if (!errors.email) {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
              {errors.email && (
                <p style={{
                  color: '#ef4444',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
                  marginTop: '0.25rem',
                  margin: '0.25rem 0 0 0'
                }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div style={{
              marginBottom: 'clamp(1rem, 3vh, 1.5rem)'
            }}>
              <label style={{
                display: 'block',
                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.4rem'
              }}>
                Password
              </label>
              <div style={{
                position: 'relative'
              }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  style={{
                    width: '100%',
                    padding: 'clamp(0.6rem, 1.5vh, 0.75rem) 3rem clamp(0.6rem, 1.5vh, 0.75rem) 1rem',
                    border: errors.password ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e: FocusEvent<HTMLInputElement>) => {
                    if (!errors.password) {
                      e.target.style.borderColor = '#0ea5e9';
                      e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                    }
                  }}
                  onBlurCapture={(e: FocusEvent<HTMLInputElement>) => {
                    if (!errors.password) {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                    (e.target as HTMLButtonElement).style.color = '#374151';
                  }}
                  onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                    (e.target as HTMLButtonElement).style.color = '#6b7280';
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p style={{
                  color: '#ef4444',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
                  marginTop: '0.25rem',
                  margin: '0.25rem 0 0 0'
                }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: 'clamp(0.7rem, 2vh, 0.875rem)',
                backgroundColor: isLoading ? '#9ca3af' : '#0ea5e9',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                if (!isLoading) {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = '#0284c7';
                  target.style.transform = 'translateY(-1px)';
                  target.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.3)';
                }
              }}
              onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                if (!isLoading) {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = '#0ea5e9';
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = 'none';
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Additional Links */}
          <div style={{
            marginTop: 'clamp(0.8rem, 2vh, 1rem)',
            textAlign: 'center'
          }}>
            <a
              href="#"
              style={{
                color: '#0ea5e9',
                fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
                textDecoration: 'none',
                fontWeight: '500'
              }}
              onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => {
                (e.target as HTMLAnchorElement).style.textDecoration = 'underline';
              }}
              onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                (e.target as HTMLAnchorElement).style.textDecoration = 'none';
              }}
            >
              Forgot your password?
            </a>
          </div>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div style={{
        flex: '1',
        padding: '0.75rem 0.75rem 0.75rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '300px'
      }}>
        <img 
          src="assets/static/images/Select Candidate.png"
          alt="Select Candidate"
          style={{
            maxWidth: '100%',
            maxHeight: 'calc(100vh - 1.5rem)',
            borderRadius: '12px',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* CSS Animation for loading spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default CandidateLogIn;