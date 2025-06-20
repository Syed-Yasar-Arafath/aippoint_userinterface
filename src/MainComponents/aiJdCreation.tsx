import React, { useState } from 'react'
import {
  ChevronLeft,
  Briefcase,
  Users,
  Heart,
  TrendingUp,
  MoreHorizontal,
  ChevronDown,
  Paperclip,
  Sparkles,
} from 'lucide-react'

export default function AIjdCreation() {
  const [selectedTab, setSelectedTab] = useState('Job Title')
  const [jobTitle, setJobTitle] = useState('')

  const tabs = [
    { name: 'Job Title', icon: Briefcase },
    { name: 'Key Responsibilities', icon: Users },
    { name: 'Required Skills', icon: Heart },
    { name: 'Experience Level', icon: TrendingUp },
    { name: 'More Suggestions', icon: MoreHorizontal },
  ]

  // Inline styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
    },
    header: {
      background: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #e5e7eb',
    },
    headerContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1rem',
      '@media (min-width: 640px)': {
        padding: '0 1.5rem',
      },
      '@media (min-width: 1024px)': {
        padding: '0 2rem',
      },
    },
    headerRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 0',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      color: '#6b7280',
      fontWeight: '500',
      fontSize: '0.875rem',
      transition: 'color 0.2s',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    },
    backButtonHover: {
      color: '#1f2937',
    },
    logoContainer: {
      width: '2.5rem',
      height: '2.5rem',
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    profileInfo: {
      textAlign: 'right' as const,
      display: 'none',
      '@media (min-width: 640px)': {
        display: 'block',
      },
    },
    profileInfoVisible: {
      textAlign: 'right' as const,
      display: 'block',
    },
    profileName: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#111827',
    },
    profileEmail: {
      fontSize: '0.75rem',
      color: '#6b7280',
    },
    profileImage: {
      width: '2.5rem',
      height: '2.5rem',
      background: '#d1d5db',
      borderRadius: '50%',
      overflow: 'hidden',
    },
    profileImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    mainContent: {
      maxWidth: '64rem',
      margin: '0 auto',
      padding: '2rem 1rem',
    },
    mainContentResponsive: {
      maxWidth: '64rem',
      margin: '0 auto',
      padding: '2rem 1.5rem',
    },
    titleSection: {
      textAlign: 'center' as const,
      marginBottom: '2rem',
    },
    mainTitle: {
      fontSize: '1.875rem',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '1rem',
      margin: 0,
    },
    mainTitleResponsive: {
      fontSize: '2.25rem',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '1rem',
      margin: '0 0 1rem 0',
    },
    subTitle: {
      fontSize: '1.125rem',
      color: '#6b7280',
      maxWidth: '32rem',
      margin: '0 auto',
    },
    tabsContainer: {
      marginBottom: '2rem',
    },
    tabsWrapper: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
      gap: '0.5rem',
    },
    tabsWrapperResponsive: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
      gap: '1rem',
    },
    tab: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      fontWeight: '500',
      fontSize: '0.875rem',
      transition: 'all 0.2s',
      border: '2px solid',
      background: 'none',
      cursor: 'pointer',
    },
    tabActive: {
      background: '#dbeafe',
      color: '#1d4ed8',
      borderColor: '#bfdbfe',
    },
    tabInactive: {
      background: 'white',
      color: '#6b7280',
      borderColor: '#e5e7eb',
    },
    tabInactiveHover: {
      background: '#f9fafb',
      borderColor: '#d1d5db',
    },
    proTip: {
      background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
      border: '1px solid #bfdbfe',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '2rem',
    },
    proTipContent: {
      display: 'flex',
      alignItems: 'flex-start',
    },
    proTipIcon: {
      width: '1.5rem',
      height: '1.5rem',
      background: '#3b82f6',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    proTipIconText: {
      fontSize: '0.75rem',
    },
    proTipText: {
      marginLeft: '0.75rem',
      fontSize: '0.875rem',
      color: '#1e40af',
    },
    proTipBold: {
      fontWeight: '600',
    },
    inputCard: {
      background: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
    },
    inputCardContent: {
      padding: '1.5rem',
    },
    inputCardContentResponsive: {
      padding: '2rem',
    },
    inputDescription: {
      color: '#6b7280',
      textAlign: 'center' as const,
      marginBottom: '1.5rem',
    },
    textAreaContainer: {
      position: 'relative' as const,
    },
    textArea: {
      width: '100%',
      height: '16rem',
      padding: '1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '0.5rem',
      resize: 'none' as const,
      fontFamily: 'inherit',
      color: '#374151',
      transition: 'all 0.2s',
      outline: 'none',
    },
    textAreaFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    characterCount: {
      position: 'absolute' as const,
      bottom: '0.75rem',
      right: '0.75rem',
      fontSize: '0.75rem',
      color: '#9ca3af',
    },
    actionButtons: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem',
      marginTop: '1.5rem',
    },
    actionButtonsResponsive: {
      display: 'flex',
      flexDirection: 'row' as const,
      gap: '0.75rem',
      marginTop: '1.5rem',
    },
    primaryButton: {
      flex: 1,
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    primaryButtonHover: {
      background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    secondaryButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem 1.5rem',
      border: '2px solid #d1d5db',
      color: '#374151',
      borderRadius: '0.5rem',
      fontWeight: '500',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    secondaryButtonHover: {
      background: '#f9fafb',
      borderColor: '#9ca3af',
    },
    bottomBar: {
      position: 'fixed' as const,
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderTop: '1px solid #e5e7eb',
      padding: '1rem',
    },
    bottomBarResponsive: {
      position: 'relative' as const,
      border: 'none',
      background: 'transparent',
      padding: 0,
      marginTop: '2rem',
      bottom: 'auto',
      left: 'auto',
      right: 'auto',
    },
    bottomBarContent: {
      maxWidth: '64rem',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bottomBarLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    bottomBarButton: {
      display: 'flex',
      alignItems: 'center',
      color: '#6b7280',
      fontWeight: '500',
      fontSize: '0.875rem',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s',
    },
    bottomBarButtonHover: {
      color: '#1f2937',
    },
    bottomBarButtonOrange: {
      color: '#ea580c',
    },
    bottomBarButtonOrangeHover: {
      color: '#c2410c',
    },
    bottomBarRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    copyright: {
      fontSize: '0.75rem',
      color: '#6b7280',
      display: 'none',
    },
    copyrightVisible: {
      fontSize: '0.75rem',
      color: '#6b7280',
      display: 'block',
    },
    continueButton: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      color: 'white',
      padding: '0.5rem 1.5rem',
      borderRadius: '0.5rem',
      fontWeight: '500',
      fontSize: '0.875rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    continueButtonHover: {
      background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
    },
  }

  // State for hover effects
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)

  // Check if screen is mobile (simplified for inline styles)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div
          style={
            isMobile
              ? styles.headerContent
              : { ...styles.headerContent, padding: '0 2rem' }
          }
        >
          <div style={styles.headerRow}>
            <div>
              <button
                style={{
                  ...styles.backButton,
                  ...(hoveredElement === 'backButton'
                    ? styles.backButtonHover
                    : {}),
                }}
                onMouseEnter={() => setHoveredElement('backButton')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <ChevronLeft size={20} style={{ marginRight: '0.25rem' }} />
                Back
              </button>
            </div>

            <div>
              <div style={styles.logoContainer}>
                <Sparkles size={24} color="white" />
              </div>
            </div>

            <div style={styles.profileSection}>
              <div
                style={
                  isMobile ? styles.profileInfo : styles.profileInfoVisible
                }
              >
                <div style={styles.profileName}>Alex Carter</div>
                <div style={styles.profileEmail}>alexcarter@gmail.com</div>
              </div>
              <div style={styles.profileImage}>
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  style={styles.profileImg}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={isMobile ? styles.mainContent : styles.mainContentResponsive}>
        {/* Title Section */}
        <div style={styles.titleSection}>
          <h1 style={isMobile ? styles.mainTitle : styles.mainTitleResponsive}>
            Hire Smarter with AI-Powered JD Creation
          </h1>
          <p style={styles.subTitle}>
            Just tell me about the role, and I&apos;ll generate a professional,
            tailored JD for you instantly.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={styles.tabsContainer}>
          <div
            style={isMobile ? styles.tabsWrapper : styles.tabsWrapperResponsive}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = selectedTab === tab.name
              const isHovered = hoveredElement === `tab-${tab.name}`

              return (
                <button
                  key={tab.name}
                  style={{
                    ...styles.tab,
                    ...(isActive ? styles.tabActive : styles.tabInactive),
                    ...(!isActive && isHovered ? styles.tabInactiveHover : {}),
                  }}
                  onClick={() => setSelectedTab(tab.name)}
                  onMouseEnter={() => setHoveredElement(`tab-${tab.name}`)}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <Icon
                    size={16}
                    style={{
                      marginRight: '0.5rem',
                      color: isActive ? '#2563eb' : '#6b7280',
                    }}
                  />
                  {tab.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Pro Tip */}
        <div style={styles.proTip}>
          <div style={styles.proTipContent}>
            <div style={styles.proTipIcon}>
              <span style={styles.proTipIconText}>💡</span>
            </div>
            <div style={styles.proTipText}>
              <span style={styles.proTipBold}>Pro Tip:</span> You can drag any
              card to the canvas or start typing freely — we&apos;ll format it
              automatically.
            </div>
          </div>
        </div>

        {/* Main Input Area */}
        <div style={styles.inputCard}>
          <div
            style={
              isMobile
                ? styles.inputCardContent
                : styles.inputCardContentResponsive
            }
          >
            <p style={styles.inputDescription}>
              Let&apos;s build your next great hire. Start by typing your job
              description, or use one of the smart options below.
            </p>

            {/* Text Input Area */}
            <div style={styles.textAreaContainer}>
              <textarea
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Start typing your job description here... For example: 'Looking for a Senior React Developer with 5+ years experience...'"
                style={{
                  ...styles.textArea,
                  ...(hoveredElement === 'textarea'
                    ? styles.textAreaFocus
                    : {}),
                }}
                onFocus={() => setHoveredElement('textarea')}
                onBlur={() => setHoveredElement(null)}
              />
              <div style={styles.characterCount}>
                {jobTitle.length} characters
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={
                isMobile ? styles.actionButtons : styles.actionButtonsResponsive
              }
            >
              <button
                style={{
                  ...styles.primaryButton,
                  ...(hoveredElement === 'primaryButton'
                    ? styles.primaryButtonHover
                    : {}),
                }}
                onMouseEnter={() => setHoveredElement('primaryButton')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                Generate with AI
              </button>
              <button
                style={{
                  ...styles.secondaryButton,
                  ...(hoveredElement === 'secondaryButton'
                    ? styles.secondaryButtonHover
                    : {}),
                }}
                onMouseEnter={() => setHoveredElement('secondaryButton')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <Paperclip size={16} style={{ marginRight: '0.5rem' }} />
                Upload JD
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div style={isMobile ? styles.bottomBar : styles.bottomBarResponsive}>
          <div style={styles.bottomBarContent}>
            <div style={styles.bottomBarLeft}>
              <button
                style={{
                  ...styles.bottomBarButton,
                  ...(hoveredElement === 'selectButton'
                    ? styles.bottomBarButtonHover
                    : {}),
                }}
                onMouseEnter={() => setHoveredElement('selectButton')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                Select Job Description
                <ChevronDown size={16} style={{ marginLeft: '0.25rem' }} />
              </button>

              <button
                style={{
                  ...styles.bottomBarButton,
                  ...styles.bottomBarButtonOrange,
                  ...(hoveredElement === 'attachButton'
                    ? styles.bottomBarButtonOrangeHover
                    : {}),
                }}
                onMouseEnter={() => setHoveredElement('attachButton')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <Paperclip size={16} style={{ marginRight: '0.25rem' }} />
                Attach Existing JD
              </button>
            </div>

            <div style={styles.bottomBarRight}>
              <div
                style={isMobile ? styles.copyright : styles.copyrightVisible}
              >
                © 2024 powered by • Empowering Recruiters with AI •
                support@support.ai
              </div>

              <button
                style={{
                  ...styles.continueButton,
                  ...(hoveredElement === 'continueButton'
                    ? styles.continueButtonHover
                    : {}),
                }}
                onMouseEnter={() => setHoveredElement('continueButton')}
                onMouseLeave={() => setHoveredElement(null)}
              >
                Continue with AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
