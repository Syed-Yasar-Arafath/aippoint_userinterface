import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { t } from 'i18next'
import i18n from '../i18n'
import { useTranslation } from 'react-i18next';
const useProctoring = (objId: string) => {
  const [warning, setWarning] = useState<string | null>(null)
  const [violations, setViolations] = useState(0)
  const activeViolations = useRef<Set<string>>(new Set()) 
  const { t } = useTranslation();
// Prevent duplicate violations
  const saveWarningCount = async (count: number) => {
    try {
      // Construct the request payload
      const payload = {
        object_id: objId, // Ensure objId is defined and accessible
        warning_count: count, // Pass the count as a number
      }

      console.log('Saving count:', count)

      // Send JSON payload using axios
      await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/warning_message_count/`,
        payload, // Send JSON object
        {
          headers: {
            'Content-Type': 'application/json', // Use JSON content type
          },
        },
      )
      console.log('Warning count successfully saved.')
    } catch (error) {
      console.error('Error saving warning count:', error)
    }
  }

  const showWarning = (message: string) => {
    if (!activeViolations.current.has(message)) {
      activeViolations.current.add(message) // Add to active violations
      setWarning(message)
      setViolations((prev) => {
        const newCount = prev + 1
        saveWarningCount(newCount) // Save the updated count
        return newCount
      })

      // Clear the warning after 5 seconds
      setTimeout(() => {
        activeViolations.current.delete(message) // Remove from active violations
        setWarning((prevWarning) =>
          prevWarning === message ? null : prevWarning,
        )
      }, 5000)
    }
  }

  // Detect Tab Switching & Screen Minimization
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // showWarning('🚨 Please remain on the interview screen.')
        showWarning('🚨 ' + t('pleaseRemainOnTheInterviewScreen'));
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Detect Multiple Tabs Opened
  useEffect(() => {
    const tabId = Math.random().toString(36).substr(2, 9)
    localStorage.setItem('interviewTab', tabId)

    const checkMultipleTabs = () => {
      if (localStorage.getItem('interviewTab') !== tabId) {
        // showWarning('🚨 Please remain on the interview screen.')
        showWarning('🚨 ' + t('pleaseRemainOnTheInterviewScreen'));
      }
    }

    window.addEventListener('storage', checkMultipleTabs)
    return () => window.removeEventListener('storage', checkMultipleTabs)
  }, [])

  // Detect Screen Minimization & Focus Loss
  useEffect(() => {
    const handleBlur = () => {
      // showWarning('🚨 Please remain on the interview screen.')
      showWarning('🚨 ' + t('pleaseRemainOnTheInterviewScreen'));
    }

    window.addEventListener('blur', handleBlur)
    return () => {
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  return { warning, violations }
}

export default useProctoring
