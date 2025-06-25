import React, { useState, ChangeEvent, FocusEvent, MouseEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CandidateLogIn = () => {
  const [formData, setFormData] = useState({
    email: 'priya.sharma@gmail.com',
    password: '#@priya123'
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email: any) => {
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password: any) => {
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
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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
      password: passwordError
    });

    // If no errors, proceed with login
    if (!emailError && !passwordError) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setLoginSuccess(true);
        console.log('Login successful:', formData);
      }, 1500);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
const navigate = useNavigate();
const handleDirectNavigation = () => {
  navigate('/ai_interview_ins');
};
  if (loginSuccess) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <div style={{
            fontSize: '3rem',
            color: '#10b981',
            marginBottom: '1rem'
          }}>✓</div>
          <h2 style={{
            color: '#1f2937',
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            margin: '0 0 0.5rem 0'
          }}>Login Successful!</h2>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            margin: '0'
          }}>Welcome back, you're now logged in.</p>
        </div>
      </div>
    );
  }

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
          <div onSubmit={handleSubmit}>
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
              onClick={handleDirectNavigation}
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
          </div>

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
        {/* <div style={{
          width: '100%',
          height: '100%',
          maxHeight: 'calc(100vh - 1.5rem)',
       
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
           */}
           
            <img src="assets/static/images/Select Candidate.png"
          // style={{
          //   height:'57px',
          //   width:'198.79px'
          // }}
          />
       
        {/* </div> */}
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