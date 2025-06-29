import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE || 'http://localhost:8080'

export interface NotificationData {
  req_no: string
  message: string
  status: 'success' | 'error' | 'info' | 'warning'
  user_id: string
  organisation: string
  timestamp?: string
}

export const sendNotification = async (notificationData: NotificationData) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.post(
      `${API_BASE_URL}/notification/send`,
      notificationData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error sending notification:', error)
    throw error
  }
}

export const sendUploadStatusNotification = async (
  reqNo: string,
  fileName: string,
  status: 'success' | 'error' | 'uploading',
  errorMessage?: string
) => {
  const organisation = localStorage.getItem('organisation')
  const userId = localStorage.getItem('userId')
  
  if (!organisation || !userId) {
    console.error('Missing organisation or userId for notification')
    return
  }

  let message = ''
  let notificationStatus: 'success' | 'error' | 'info' | 'warning' = 'info'

  switch (status) {
    case 'success':
      message = `${fileName} uploaded successfully`
      notificationStatus = 'success'
      break
    case 'error':
      message = `Failed to upload ${fileName}${errorMessage ? `: ${errorMessage}` : ''}`
      notificationStatus = 'error'
      break
    case 'uploading':
      message = `Uploading ${fileName}...`
      notificationStatus = 'info'
      break
  }

  const notificationData: NotificationData = {
    req_no: reqNo,
    message,
    status: notificationStatus,
    user_id: userId,
    organisation,
    timestamp: new Date().toISOString()
  }

  try {
    await sendNotification(notificationData)
    console.log('Upload status notification sent successfully')
  } catch (error) {
    console.error('Failed to send upload status notification:', error)
  }
}

export const sendResumeProcessingNotification = async (
  reqNo: string,
  fileName: string,
  processingStatus: 'started' | 'completed' | 'failed',
  errorMessage?: string
) => {
  const organisation = localStorage.getItem('organisation')
  const userId = localStorage.getItem('userId')
  
  if (!organisation || !userId) {
    console.error('Missing organisation or userId for notification')
    return
  }

  let message = ''
  let notificationStatus: 'success' | 'error' | 'info' | 'warning' = 'info'

  switch (processingStatus) {
    case 'started':
      message = `Processing started for ${fileName}`
      notificationStatus = 'info'
      break
    case 'completed':
      message = `Processing completed for ${fileName}`
      notificationStatus = 'success'
      break
    case 'failed':
      message = `Processing failed for ${fileName}${errorMessage ? `: ${errorMessage}` : ''}`
      notificationStatus = 'error'
      break
  }

  const notificationData: NotificationData = {
    req_no: reqNo,
    message,
    status: notificationStatus,
    user_id: userId,
    organisation,
    timestamp: new Date().toISOString()
  }

  try {
    await sendNotification(notificationData)
    console.log('Resume processing notification sent successfully')
  } catch (error) {
    console.error('Failed to send resume processing notification:', error)
  }
} 