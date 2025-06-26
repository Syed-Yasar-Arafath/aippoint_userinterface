import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

type SectionKeys = 'prerequisites' | 'systemRequirements' | 'duringInterview';
// Define interface for URL parameters
interface UrlParams extends Record<string, string | undefined> {
  organisation?: string;
  interviewId?: string;
  meetingId?: string;
}
const InterviewInstructions = () => {
  const [expandedSections, setExpandedSections] = useState<Record<SectionKeys, boolean>>({
    prerequisites: true,
    systemRequirements: true,
    duringInterview: true
  });

  const [isChecked, setIsChecked] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
// Fetch URL parameters
    const toggleSection = (section: SectionKeys) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleCamera = () => setIsCameraOn(prev => !prev);
  const toggleMicrophone = () => setIsMicrophoneOn(prev => !prev);

  // Check if all sections are collapsed
  const allSectionsCollapsed = Object.values(expandedSections).every(expanded => !expanded);
  const canProceed = allSectionsCollapsed && isChecked && isCameraOn && isMicrophoneOn;

 

  const containerStyle: React.CSSProperties = {
    margin: '0 60px',
    padding: '10px 10px',
    borderRadius:'12px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#ffffff',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '8px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#0066cc',
    margin: '0 0 8px 0'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666666',
    margin: '0 0 15px 0',
    lineHeight: '1.4'
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#ffffff'
  };

  const sectionHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    cursor: 'pointer',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px 8px 0 0',
    borderBottom: '1px solid #e0e0e0'
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333333',
    margin: '0'
  };

  const sectionContentStyle: React.CSSProperties = {
    padding: '10px'
  };

  const listStyle: React.CSSProperties = {
    margin: '0',
    padding: '0',
    listStyle: 'none'
  };

  const listItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '6px',
    fontSize: '14px',
    color: '#555555',
    lineHeight: '1.5'
  };

  const numberStyle: React.CSSProperties = {
    minWidth: '20px',
    color: '#666666',
    fontWeight: '500',
    marginRight: '8px',
    marginTop: '1px'
  };

  const cameraControlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    margin: '10px 0',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px'
  };

  const controlGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const controlLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#333333',
    fontWeight: '500'
  };

  const toggleStyle: React.CSSProperties = {
    width: '40px',
    height: '20px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.3s ease'
  };

  const toggleActiveStyle: React.CSSProperties = {
    ...toggleStyle,
    backgroundColor: '#0066cc'
  };

  const toggleInactiveStyle: React.CSSProperties = {
    ...toggleStyle,
    backgroundColor: '#cccccc'
  };

  const toggleKnobStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: '2px',
    transition: 'all 0.3s ease'
  };

  const importantBoxStyle: React.CSSProperties = {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '6px',
    padding: '16px',
    margin: '24px 0'
  };

  const importantTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#856404',
    margin: '0 0 8px 0'
  };

  const importantTextStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#856404',
    margin: '0',
    lineHeight: '1.4'
  };

  const checkboxContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    margin: '24px 0',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px'
  };

  const checkboxStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '2px solid #0066cc',
    backgroundColor: isChecked ? '#0066cc' : '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
    marginTop: '2px'
  };

  const checkboxTextStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#333333',
    lineHeight: '1.4',
    margin: '0'
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'block',
    margin: '20px auto 0',
    transition: 'background-color 0.2s ease'
  };

  const buttonHoverStyle: React.CSSProperties = {
    backgroundColor: '#0052a3'
  };

  const debugStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#ff0000',
    margin: '10px 0',
    textAlign: 'center'
  };
  const navigate = useNavigate();
    const { organisation, interviewId, meetingId } = useParams<UrlParams>();

const handleDirectNavigation = () => {
    // Ensure parameters are defined before navigating
    if (organisation && interviewId && meetingId) {
      navigate('/interview_ai', {
        state: { organisation, interviewId, meetingId },
      });
    } else {
      console.error('Missing URL parameters:', { organisation, interviewId, meetingId });
      alert('Error: Missing required URL parameters.');
    }
  };
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Interview Instructions</h1>
        <p style={subtitleStyle}>
          Ensure a smooth interview experience by following these guidelines on setup, system requirements, and best practices.
        </p>
      </div>

      {/* Pre-requisites Section */}
      <div style={sectionStyle}>
        <div 
          style={sectionHeaderStyle}
          onClick={() => toggleSection('prerequisites')}
        >
          <h2 style={sectionTitleStyle}>Pre-requisites</h2>
          {expandedSections.prerequisites ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        {expandedSections.prerequisites && (
          <div style={sectionContentStyle}>
            <ol style={listStyle}>
              <li style={listItemStyle}>
                <span style={numberStyle}>1.</span>
                <span>Ensure a stable internet connection (Minimum 5 Mbps recommended).</span>
              </li>
              <li style={listItemStyle}>
                <span style={numberStyle}>2.</span>
                <span>Use a quiet environment with no background noise or distractions.</span>
              </li>
              <li style={listItemStyle}>
                <span style={numberStyle}>3.</span>
                <span>Keep a valid government-issued ID for identity verification.</span>
              </li>
              <li style={listItemStyle}>
                <span style={numberStyle}>4.</span>
                <span>Have a copy of your resume handy for reference.</span>
              </li>
              <li style={listItemStyle}>
                <span style={numberStyle}>5.</span>
                <span>Dress appropriately for a professional video interview.</span>
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* System Requirements Section */}
      <div style={sectionStyle}>
        <div 
          style={sectionHeaderStyle}
          onClick={() => toggleSection('systemRequirements')}
        >
          <h2 style={sectionTitleStyle}>System Requirements</h2>
          {expandedSections.systemRequirements ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        {expandedSections.systemRequirements && (
          <div style={sectionContentStyle}>
            <ol style={listStyle}>
              <li style={listItemStyle}>
                <span style={numberStyle}>1.</span>
                <span>Device: Laptop or desktop (Mobile devices are not recommended).</span>
              </li>
              <li style={listItemStyle}>
                <span style={numberStyle}>2.</span>
                <span>Browser: Google Chrome or Microsoft Edge (Latest version).</span>
              </li>
              <li style={listItemStyle}>
                <span style={numberStyle}>3.</span>
                <span>Camera & Microphone: Ensure your webcam and microphone are working.</span>
              </li>
            </ol>
            
            <div style={cameraControlsStyle}>
              <div style={controlGroupStyle}>
                <span style={controlLabelStyle}>Camera</span>
                <div 
                  style={isCameraOn ? toggleActiveStyle : toggleInactiveStyle}
                  onClick={toggleCamera}
                >
                  <div style={{...toggleKnobStyle, left: isCameraOn ? '22px' : '2px'}}></div>
                </div>
              </div>
              <div style={controlGroupStyle}>
                <span style={controlLabelStyle}>Microphone</span>
                <div 
                  style={isMicrophoneOn ? toggleActiveStyle : toggleInactiveStyle}
                  onClick={toggleMicrophone}
                >
                  <div style={{...toggleKnobStyle, left: isMicrophoneOn ? '22px' : '2px'}}></div>
                </div>
              </div>
            </div>

            <ol style={listStyle}>
              <li style={listItemStyle}>
                <span style={numberStyle}>4.</span>
                <span>Power Backup: Keep your device charged or plugged in.</span>
              </li>
              <li style={listItemStyle}>
                <span style={numberStyle}>5.</span>
                <span>Disable Notifications: Turn off pop-ups and notifications for a distraction-free experience.</span>
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* During the Interview/Assessment Section */}
      <div style={sectionStyle}>
        <div 
          style={sectionHeaderStyle}
          onClick={() => toggleSection('duringInterview')}
        >
          <h2 style={sectionTitleStyle}>During the Interview/Assessment</h2>
          {expandedSections.duringInterview ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        {expandedSections.duringInterview && (
          <div style={sectionContentStyle}>
            <ol style={listStyle}>
              <li style={listItemStyle}>
                <span style={numberStyle}>1.</span>
                <span>Stay in Frame: Ensure your face is clearly visible at all times.</span>
              </li>
              <li style={listItemStyle}>
                <span style={numberStyle}>2.</span>
                <span>Answer Clearly: Speak confidently and provide structured answers.</span>
              </li>
              <li style={listItemStyle}>
                <span style={numberStyle}>3.</span>
                <span>Follow Instructions: Read questions carefully before answering.</span>
              </li>
              <li style={listItemStyle}>
                <span style={numberStyle}>4.</span>
                <span>No External Help: Do not use notes, another device, or external help.</span>
              </li>
              <li style={listItemStyle}>
                <span style={numberStyle}>5.</span>
                <span>Avoid Connectivity Issues: If disconnected, reconnect immediately.</span>
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* Important Notice */}
      <div style={importantBoxStyle}>
        <h3 style={importantTitleStyle}>Important</h3>
        <p style={importantTextStyle}>
          Your interview is being recorded and monitored for authenticity. Any violation of the guidelines may lead to disqualification.
        </p>
      </div>

      {/* Checkbox Agreement */}
      <div style={checkboxContainerStyle}>
        <div 
          style={checkboxStyle}
          onClick={() => setIsChecked(!isChecked)}
        >
          {isChecked && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path 
                d="M2 6L4.5 8.5L10 3" 
                stroke="#ffffff" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <p style={checkboxTextStyle}>
          By proceeding, you agree to the terms and conditions of the interview, including proctoring and assessment guidelines.
        </p>
      </div>

    

      {/* Continue Button */}
      {isChecked && isCameraOn && isMicrophoneOn && (
        <button 
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor!;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor!;
          }}
          onClick={handleDirectNavigation}
        >
          Continue To Interview
        </button>
      )}
    </div>
  );
};

export default InterviewInstructions;