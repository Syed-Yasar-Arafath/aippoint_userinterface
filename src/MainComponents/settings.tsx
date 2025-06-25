import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Email } from '@mui/icons-material'

const tabs = [
  'General Settings',
  'Role Access & Collaboration',
  'Privacy & Security',
  'Interview Settings',
  'Notification Preferences',
  'Accessibility',
]

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('General Settings')
  const [userName, setUserName] = useState('')
  const [appearancegeneral, setAppearancegeneral] = useState('System')
  const [userEmail, setUserEmail] = useState('')
  const [editField, setEditField] = useState<{ field: string | null }>({
    field: null,
  })
  const [profileImage, setProfileImage] = useState<string>(
    'https://www.gravatar.com/avatar/?d=mp',
  )
  const [selectedImage, setSelectedImage] = useState<File | null>(null) // Store selected file

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = (field: string) => {
    setEditField({ field: null })
  }

  const handleReset = () => {
    setAppearancegeneral('System')
    setEditField({ field: null })
    setProfileImage('https://www.gravatar.com/avatar/?d=mp') // Reset profile image
    setSelectedImage(null) // Reset selected image
    getUserData();
  }

  const handleSaveChanges = async () => {
    if (selectedImage) {
      const formData = new FormData()
      formData.append('image', selectedImage)

      try {
        const response = await axios.post('http://localhost:8082', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        if (response.status === 200) {
          console.log('Image uploaded successfully')
          setProfileImage(response.data.imageUrl) // Update profile image URL
          alert('Changes Saved!')
        } else {
          console.error('Image upload failed')
        }
      } catch (error) {
        console.error('Error uploading image:', error)
      }
    } else {
      alert('No image selected.')
    }
  }

  const handleUpdateClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click() // Open file picker
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file) // Store the selected file
      const objectUrl = URL.createObjectURL(file) // Create object URL for the preview
      setProfileImage(objectUrl) // Update the profile image preview with the selected image
    }
  }
  interface TeamMember {
    id: number
    name: string
    email: string
    avatar: string
    permissions: string
    role: 'Viewer' | 'Editor'
  }

  interface ActivityLog {
    id: number
    memberId: number
    action: string
    dateTime: string
  }
  interface TeamMember {
    id: number
    name: string
    email: string
    avatar: string
    permissions: string
    role: 'Viewer' | 'Editor'
  }

  interface ActivityLog {
    id: number
    memberId: number
    action: string
    dateTime: string
  }
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      avatar: '/path-to-avatar/john.jpg',
      permissions: 'JD Collection',
      role: 'Viewer',
    },
    {
      id: 2,
      name: 'Sarah Smith',
      email: 'sarah.smith@company.com',
      avatar: '/path-to-avatar/sarah.jpg',
      permissions: 'JD Creation',
      role: 'Editor',
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@company.com',
      avatar: '/path-to-avatar/michael.jpg',
      permissions: 'Conduct Interviews',
      role: 'Editor',
    },
    {
      id: 4,
      name: 'Emily Johnson',
      email: 'emily.johnson@company.com',
      avatar: '/path-to-avatar/emily.jpg',
      permissions: 'Upload Resumes',
      role: 'Editor',
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@company.com',
      avatar: '/path-to-avatar/david.jpg',
      permissions: 'Conduct Assessments',
      role: 'Viewer',
    },
  ])

  // State for activity logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: 1,
      memberId: 1,
      action: 'Viewed JD collection.',
      dateTime: '24-03-2025 10:15 AM',
    },
    {
      id: 2,
      memberId: 2,
      action: 'Created JD for Full-Stack Developer role.',
      dateTime: '24-03-2025 05:30 PM',
    },
    {
      id: 3,
      memberId: 3,
      action: 'Conducted Interview for Full-Stack Developer role.',
      dateTime: '24-03-2025 02:45 PM',
    },
    {
      id: 4,
      memberId: 4,
      action: 'Uploaded bunch of resumes.',
      dateTime: '24-03-2025 11:10 AM',
    },
    {
      id: 5,
      memberId: 5,
      action: 'Viewed assessment details for few candidates.',
      dateTime: '24-03-2025 10:15 AM',
    },
  ])

  // State for new member invite dialog
  const [openInviteDialog, setOpenInviteDialog] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')

  // Find team member by ID
  const findMemberById = (id: number) => {
    return teamMembers.find((member) => member.id === id)
  }

  // Handle permission change
  const handlePermissionChange = (memberId: number, newPermission: string) => {
    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId
          ? { ...member, permissions: newPermission }
          : member,
      ),
    )
  }

  // Handle role change
  const handleRoleChange = (memberId: number, newRole: 'Viewer' | 'Editor') => {
    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId ? { ...member, role: newRole } : member,
      ),
    )
  }

  // Handle invite dialog
  const handleOpenInviteDialog = () => {
    setOpenInviteDialog(true)
  }

  const handleCloseInviteDialog = () => {
    setOpenInviteDialog(false)
    setNewMemberEmail('')
  }

  const handleSendInvite = () => {
    // Here you would typically send the invite via API
    console.log('Sending invite to:', newMemberEmail)
    handleCloseInviteDialog()
  }

  // Reset to default handler
  const handleResetSecondtab = () => {
    // Logic to reset permissions to default
    console.log('Resetting to default')
  }

  // Save changes handler
  const handleSaveChangesSecondtab = () => {
    // Logic to save all changes
    console.log('Saving changes')
  }
  const token = localStorage.getItem('token')
  const getUserData=async ()=>{
      const organisation=localStorage.getItem('organisation')
    try{
      const res=await axios.get(`http://localhost:8082/admin/getuserbytoken/${organisation}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if(res.status===200){
        setUserName(res.data.first_name)
        setUserEmail(res.data.email)
      }
    }catch(error){

    }
  }

  const updateUserData=async ()=>{
      const organisation=localStorage.getItem('organisation')
      const data={
        first_name:userName,
        email:userEmail
      }
    try{
      const res=await axios.post(`http://localhost:8082/admin/updateuserbytoken/${organisation}`,
        {
          data
        },
        {
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if(res.status===200){
        setUserName(res.data.first_name)
        setUserEmail(res.data.email)
      }
    }catch(error){

    }
  }

  useEffect(()=>{
    getUserData()
  },[])
  const handleSaveChangesFirsttab = async () => {
  try {
    const formData = new FormData()
    formData.append('name', userName)
    formData.append('email', userEmail)
    // formData.append('appearance', appearancegeneral)

    if (selectedImage) {
      formData.append('image', selectedImage)
    }
    const res = await axios.post('http://localhost:8082/user/update-profile', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    if (res.status === 200) {
      setProfileImage(`http://localhost:8082${res.data.imageUrl}`)
      alert('Profile updated successfully!')
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Failed to save profile.')
  }
}

  // const handleSaveChangesFirsttab=async ()=>{
  //   try{
  //     const data={
  //       name:userName,
  //       email:userEmail,
  //       appearance:appearance
  //     }
  //     const res=await axios.post('http://localhost:8082/user',data,{
  //       headers:{
  //         Authorization:`Bearer ${token}`
  //       }
  //     })
  //     if(res.status===200){
  //       console.log('data updated successfully')
  //     }

  //   }catch(error){

  //   }
  // }
  const handleSaveChangeSecondtab = () => {
    // Save all changes
    console.log('2FA settings saved:', twoFactorOptions)
  }
  //3rd tab code
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // State for password change
  const [newPassword, setNewPassword] = useState('')

  // State for 2FA options
  const [twoFactorOptions, setTwoFactorOptions] = useState({
    sms: false,
    email: true,
    authenticatorApp: false,
  })

  // State for last updated times (in a real app, these would come from an API)
  const lastUpdatedPassword = '05/01/2025 11:30 AM.'
  const lastSuccessfulLogin = '05/01/2025 11:30 AM.'

  // Event handlers
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value)
  }

  const handleTwoFactorChange = (option: keyof typeof twoFactorOptions) => {
    setTwoFactorOptions({
      ...twoFactorOptions,
      [option]: !twoFactorOptions[option],
    })
  }

  const handleUpdatePassword = () => {
    // Handle password update logic
    console.log('Password updated:', newPassword)
    setNewPassword('')
  }

  const handleCancel = () => {
    setNewPassword('')
  }

  const handleResetToDefaultThirdtab = () => {
    // Reset settings to default
    setTwoFactorOptions({
      sms: false,
      email: true,
      authenticatorApp: false,
    })
  }

  const handleSaveChangesThirdtab = () => {
    // Save all changes
    console.log('2FA settings saved:', twoFactorOptions)
  }

  const handleReset2FA = () => {
    // Reset 2FA settings
    setTwoFactorOptions({
      sms: false,
      email: false,
      authenticatorApp: false,
    })
  }

  const handleUpdate2FA = () => {
    // Update 2FA settings
    console.log('2FA settings updated:', twoFactorOptions)
  }
  //4th tab
  const [settings, setSettings] = useState({
    country: 'USA',
    language: 'English USA',
    aiAvatar: 'Enabled',
    voiceTone: 'Female',
    accent: 'English USA',
    questionFormat: 'AI + Question Bank',
    numberOfQuestions: 'AI (04) + Question Bank (02)',
    difficultyLevel: 'Medium',
  })

  const defaultSettings = {
    country: 'USA',
    language: 'English USA',
    aiAvatar: 'Enabled',
    voiceTone: 'Female',
    accent: 'English USA',
    questionFormat: 'AI + Question Bank',
    numberOfQuestions: 'AI (04) + Question Bank (02)',
    difficultyLevel: 'Medium',
  }

  const handleChange = (field: string) => (event: SelectChangeEvent) => {
    setSettings((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
  }

  const handleSaveFourthtab = (field: string) => {
    console.log(`Saving ${field}: ${settings[field as keyof typeof settings]}`)
    // Integrate with backend API here
  }

  const handleSaveAllFourthtab = () => {
    console.log('Saving all settings:', settings)
    // Integrate with backend API here
  }

  const handleResetFourthtab = () => {
    setSettings(defaultSettings)
  }

  const rows = [
    {
      label: 'Country/Region',
      field: 'country',
      options: ['USA', 'India', 'UK'],
    },
    {
      label: 'Language',
      field: 'language',
      options: ['English USA', 'English UK', 'Hindi'],
    },
    { label: 'AI Avatar', field: 'aiAvatar', options: ['Enabled', 'Disabled'] },
    {
      label: 'Select Voice Tone',
      field: 'voiceTone',
      options: ['Female', 'Male'],
    },
    {
      label: 'Select Accent',
      field: 'accent',
      options: ['English USA', 'English UK'],
    },
    {
      label: 'Select Question Format',
      field: 'questionFormat',
      options: ['AI + Question Bank', 'Only AI', 'Only Question Bank'],
    },
    {
      label: 'Select No. of Questions',
      field: 'numberOfQuestions',
      options: ['AI (04) + Question Bank (02)', 'AI (03) + Question Bank (03)'],
    },
    {
      label: 'Select Question Difficulty level',
      field: 'difficultyLevel',
      options: ['Easy', 'Medium', 'Hard'],
    },
  ]
  const [textSize, setTextSize] = React.useState(0)
  const [appearance, setAppearance] = React.useState('Light')
  const [captions, setCaptions] = React.useState('On')
  const options = ['Dark', 'Light']

  return (
    <div
      style={{
        margin: '11px auto',
        padding: '20px',
        backgroundColor: '#F7F7F7',
        borderRadius: 10,
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 30,
          flexWrap: 'wrap',
          border: '0.5px solid #1C1C1E40',
          padding: '8px',
          borderRadius: '6px',
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab}
            style={{
              padding: '10px 20px',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '12px',
              fontFamily: 'SF Pro Display',
              lineHeight: '100%',
              backgroundColor: activeTab === tab ? '#0284C7' : '',
              color: activeTab === tab ? '#FFFFFF' : '#1C1C1E',
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div
        style={{ backgroundColor: '#FFFFFF', padding: 30, borderRadius: 12 }}
      >
        {activeTab === 'General Settings' && (
          <>
            <Typography
              style={{
                fontWeight: 700,
                fontSize: 12,
                color: '#1C1C1E',
                fontFamily: 'SF Pro Display',
              }}
            >
              Profile Picture
            </Typography>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 30,
              }}
            >
              <img
                src={profileImage}
                alt="Profile"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  marginBottom: 10,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  paddingLeft: '29px',
                  fontWeight: 700,
                  fontSize: '12px',
                }}
              >
                <span
                  style={{
                    color: '#1C1C1E',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '12px',
                    fontFamily: 'SF Pro Display',
                  }}
                onClick={handleReset}
                >
                  Delete
                </span>
                <span
                  style={{
                    color: '#0284C7',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '12px',
                    fontFamily: 'SF Pro Display',
                  }}
                  onClick={handleUpdateClick}
                >
                  Update
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            <hr
              style={{
                border: 'none',
                borderTop: '1px solid #ddd',
                margin: '30px 0',
              }}
            />

            {/* <div style={{ display: 'flex', paddingBottom: 22, gap: 30, alignItems: 'center' }}>
                            <Typography style={{ color: '#1C1C1E', fontWeight: 700, fontSize: 12 }}>
                                User Name
                            </Typography>
                            <TextField
                                variant='outlined'
                                value={userName}
                                disabled={editField.field !== 'name'}
                                onChange={(e) => setUserName(e.target.value)}
                                size='small'
                                // fullWidth
                                style={{ width: 'auto' }}
                                InputProps={{
                                    style: { borderRadius: 8 },
                                }}
                            />
                            {editField.field !== 'name' ? (
                                <span style={{ color: '#1C1C1E', fontWeight: 700, fontSize: 12, cursor: 'pointer' }} onClick={() => setEditField({ field: 'name' })}>
                                    Edit
                                </span>
                            ) : (
                                <span
                                    style={{ color: '#007bce', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
                                    onClick={() => handleSave('name')}
                                >
                                    Save
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 30, paddingBottom: 22 }}>

                            <Typography style={{ color: '#1C1C1E', fontWeight: 700, fontSize: 12 }}>
                                User Mail
                            </Typography>
                            <TextField
                                variant='outlined'
                                value={userEmail}
                                disabled={editField.field !== 'email'}
                                onChange={(e) => setUserEmail(e.target.value)}
                                size='small'
                                // fullWidth
                                style={{ width: 'auto' }}
                                InputProps={{
                                    style: { borderRadius: 8 },
                                }}
                            />
                            {editField.field !== 'email' ? (
                                <span style={{ color: '#1C1C1E', fontWeight: 700, fontSize: 12, cursor: 'pointer' }} onClick={() => setEditField({ field: 'email' })}>
                                    Edit
                                </span>
                            ) : (
                                <span
                                    style={{ color: '#0284C7', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                                    onClick={() => handleSave('email')}
                                >
                                    Save
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                            <Typography style={{ color: '#1C1C1E', fontWeight: 700, fontSize: 12 }}>
                                Appearance
                            </Typography>
                            <Select
                                value={appearancegeneral}
                                onChange={(e) => setAppearancegeneral(e.target.value)}
                                size='small'
                                style={{ borderRadius: 8, width: 'auto' }}
                            >
                                <MenuItem value='Light'>Light</MenuItem>
                                <MenuItem value='Dark'>Dark</MenuItem>
                                <MenuItem value='System'>System</MenuItem>
                            </Select>


                            <span
                                style={{ color: '#007bce', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
                                onClick={() => handleSave('name')}
                            >
                                Save
                            </span>
                        </div> */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {/* USER NAME */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                <Grid
                  container
                  spacing={0}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Grid item lg={4.5}>
                    <div style={{ width: 100 }}>
                      <Typography
                        style={{
                          color: '#1C1C1E',
                          fontWeight: 700,
                          fontSize: 12,
                          fontFamily: 'SF Pro Display',
                        }}
                      >
                        User Name
                      </Typography>
                    </div>
                  </Grid>
                  <Grid
                    item
                    lg={4}
                    sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                  >
                    <TextField
                      variant="outlined"
                      value={userName}
                      disabled={editField.field !== 'name'}
                      onChange={(e) => setUserName(e.target.value)}
                      size="small"
                      style={{ flex: 1, maxWidth: 300 }}
                      InputProps={{
                        style: { borderRadius: 8 },
                      }}
                    />
                    {editField.field !== 'name' ? (
                      <span
                        style={{
                          color: '#1C1C1E',
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: 'pointer',
                          fontFamily: 'SF Pro Display',
                        }}
                        onClick={() => setEditField({ field: 'name' })}
                      >
                        Edit
                      </span>
                    ) : (
                      <span
                        style={{
                          color: '#007bce',
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: 'pointer',
                          fontFamily: 'SF Pro Display',
                        }}
                        onClick={() => handleSave('name')}
                      >
                        Save
                      </span>
                    )}
                  </Grid>
                </Grid>
              </div>

              {/* USER EMAIL */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                <Grid
                  container
                  spacing={0}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Grid item lg={4.5}>
                    <div style={{ width: 100 }}>
                      <Typography
                        style={{
                          color: '#1C1C1E',
                          fontWeight: 700,
                          fontSize: 12,
                          fontFamily: 'SF Pro Display',
                        }}
                      >
                        User Mail
                      </Typography>
                    </div>
                  </Grid>
                  <Grid
                    item
                    lg={4}
                    sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                  >
                    <TextField
                      variant="outlined"
                      value={userEmail}
                      disabled={editField.field !== 'email'}
                      onChange={(e) => setUserEmail(e.target.value)}
                      size="small"
                      style={{ flex: 1, maxWidth: 300 }}
                      InputProps={{
                        style: { borderRadius: 8 },
                      }}
                    />
                    {editField.field !== 'email' ? (
                      <span
                        style={{
                          color: '#1C1C1E',
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: 'pointer',
                          fontFamily: 'SF Pro Display',
                        }}
                        onClick={() => setEditField({ field: 'email' })}
                      >
                        Edit
                      </span>
                    ) : (
                      <span
                        style={{
                          color: '#0284C7',
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: 'pointer',
                          fontFamily: 'SF Pro Display',
                        }}
                        onClick={() => handleSave('email')}
                      >
                        Save
                      </span>
                    )}
                  </Grid>
                </Grid>
              </div>

              {/* APPEARANCE */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                <Grid
                  container
                  spacing={0}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Grid item lg={4.5}>
                    <div style={{ width: 100 }}>
                      <Typography
                        style={{
                          color: '#1C1C1E',
                          fontWeight: 700,
                          fontSize: 12,
                          fontFamily: 'SF Pro Display',
                        }}
                      >
                        Appearance
                      </Typography>
                    </div>
                  </Grid>
                  <Grid
                    item
                    lg={4}
                    sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                  >
                    <Select
                      value={appearancegeneral}
                      onChange={(e) => setAppearancegeneral(e.target.value)}
                      size="small"
                      style={{ flex: 1, maxWidth: 300 }}
                    >
                      <MenuItem value="Light">Light</MenuItem>
                      <MenuItem value="Dark">Dark</MenuItem>
                      <MenuItem value="System">System</MenuItem>
                    </Select>
                    <span
                      style={{
                        color: '#007bce',
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: 'pointer',
                        fontFamily: 'SF Pro Display',
                      }}
                      onClick={() => handleSave('appearance')}
                    >
                      Save
                    </span>
                  </Grid>
                </Grid>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 20,
                marginTop: 30,
              }}
            >
              <Button
                style={{
                  padding: '14px 41px',
                  textTransform: 'none',
                  backgroundColor: 'white',
                  border: '1px solid #1C1C1E',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '12px',
                  color: '#1C1C1E',
                  fontFamily: 'SF Pro Display',
                  lineHeight: '100%',
                }}
                onClick={handleReset}
              >
                Reset to Default
              </Button>
              <Button
                style={{
                  padding: '14px 41px',
                  textTransform: 'none',
                  backgroundColor: '#007bce',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: 12,
                  fontFamily: 'SF Pro Display',
                  lineHeight: '100%',
                }}
                onClick={handleSaveChangesFirsttab}
              >
                Save Changes
              </Button>
            </div>
          </>
        )}
        {activeTab === 'Role Access & Collaboration' && (
          <>
            <Box sx={{ p: 3 }}>
              {/* Invite Team Members Section */}
              <Box sx={{ mb: 4 }}>
                <div style={{}}>
                  <Grid container spacing={0}>
                    <Grid item lg={3.6}>
                      <Typography
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#1C1C1E',
                          lineHeight: '100%',
                        }}
                      >
                        Invite Team Members
                      </Typography>
                    </Grid>
                    <Grid item lg={4}>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleOpenInviteDialog}
                        sx={{
                          borderRadius: 1,
                          padding: '10px 40px 10px 40px',
                          textTransform: 'none',
                          fontFamily: 'SF Pro Display',
                          fontWeight: 500,
                          fontSize: '12px',
                        }}
                      >
                        Add Member
                      </Button>
                    </Grid>
                  </Grid>
                </div>

                <Dialog
                  open={openInviteDialog}
                  onClose={handleCloseInviteDialog}
                >
                  <DialogTitle>Invite New Team Member</DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Email Address"
                      type="email"
                      fullWidth
                      variant="outlined"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleCloseInviteDialog}
                      style={{ textTransform: 'none' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendInvite}
                      color="primary"
                      style={{ textTransform: 'none' }}
                    >
                      Send Invite
                    </Button>
                  </DialogActions>
                </Dialog>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    justifyContent: 'center',
                    paddingTop: '11px',
                  }}
                >
                  <TextField
                    // fullWidth
                    placeholder="Enter email of the team member..."
                    variant="outlined"
                    size="small"
                    sx={{ mr: 2, width: '313px' }}
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                  />
                  <Button
                    variant="text"
                    style={{
                      color: '#1C1C1E',
                      fontSize: '12px',
                      fontWeight: 700,
                      textTransform: 'none',
                    }}
                    onClick={handleCloseInviteDialog}
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="text"
                    style={{
                      color: '#0284C7',
                      fontSize: '12px',
                      fontWeight: 700,
                      textTransform: 'none',
                    }}
                    onClick={handleSendInvite}
                    disabled={!newMemberEmail}
                  >
                    Send Invite
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Recruiters with Access Section */}
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={0}>
                  <Grid item lg={3.6}>
                    <Typography
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#1C1C1E',
                        lineHeight: '100%',
                      }}
                    >
                      Recruiters with Access
                    </Typography>
                  </Grid>

                  <Grid item lg={8}>
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      variant="outlined"
                    >
                      <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Mail</TableCell>
                            <TableCell>Permissions</TableCell>
                            <TableCell>Role</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {teamMembers.map((member) => (
                            <TableRow key={member.id}>
                              <TableCell>
                                <Box
                                  sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                  <Avatar
                                    src={member.avatar}
                                    alt={member.name}
                                    sx={{ mr: 2 }}
                                  >
                                    {member.name.charAt(0)}
                                  </Avatar>
                                  <Typography>{member.name}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>{member.email}</TableCell>
                              <TableCell>
                                <FormControl fullWidth size="small">
                                  <Select
                                    value={member.permissions}
                                    onChange={(e) =>
                                      handlePermissionChange(
                                        member.id,
                                        e.target.value,
                                      )
                                    }
                                    IconComponent={ExpandMoreIcon}
                                    sx={{ minWidth: 200 }}
                                  >
                                    <MenuItem value="JD Collection">
                                      JD Collection
                                    </MenuItem>
                                    <MenuItem value="JD Creation">
                                      JD Creation
                                    </MenuItem>
                                    <MenuItem value="Conduct Interviews">
                                      Conduct Interviews
                                    </MenuItem>
                                    <MenuItem value="Upload Resumes">
                                      Upload Resumes
                                    </MenuItem>
                                    <MenuItem value="Conduct Assessments">
                                      Conduct Assessments
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              </TableCell>
                              <TableCell>
                                <FormControl fullWidth size="small">
                                  <Select
                                    value={member.role}
                                    onChange={(e) =>
                                      handleRoleChange(
                                        member.id,
                                        e.target.value as 'Viewer' | 'Editor',
                                      )
                                    }
                                    IconComponent={ExpandMoreIcon}
                                    sx={{ minWidth: 150 }}
                                  >
                                    <MenuItem value="Viewer">Viewer</MenuItem>
                                    <MenuItem value="Editor">Editor</MenuItem>
                                  </Select>
                                </FormControl>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Activity & Access Logs Section */}
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={0}>
                  <Grid item lg={3.6}>
                    <Typography
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#1C1C1E',
                        lineHeight: '100%',
                      }}
                    >
                      Activity & Access Logs
                    </Typography>
                  </Grid>
                  <Grid item lg={8}>
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      variant="outlined"
                    >
                      <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Action Performed</TableCell>
                            <TableCell>Date & Time</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {activityLogs.map((log) => {
                            const member = findMemberById(log.memberId)
                            return (
                              <TableRow key={log.id}>
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Avatar
                                      src={member?.avatar}
                                      alt={member?.name}
                                      sx={{ mr: 2 }}
                                    >
                                      {member?.name.charAt(0)}
                                    </Avatar>
                                    <Typography>{member?.name}</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell>{log.dateTime}</TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  mt: 4,
                }}
              >
                {/* <Button
                                    variant='outlined'
                                    color='inherit'
                                    onClick={handleResetSecondtab}
                                    sx={{ padding: '14px 41px', textTransform: 'none', fontSize: '12px', fontWeight: 500, fontFamily: 'SF Pro Display' }}
                                >
                                    Reset to Default
                                </Button>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={handleSaveChangesSecondtab}
                                    sx={{ padding: '14px 41px', textTransform: 'none', fontSize: '12px', fontWeight: 500, fontFamily: 'SF Pro Display' }}
                                >
                                    Save Changes
                                </Button> */}
                <Button
                  style={{
                    padding: '14px 41px',
                    textTransform: 'none',
                    backgroundColor: 'white',
                    border: '1px solid #1C1C1E',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '12px',
                    color: '#1C1C1E',
                    fontFamily: 'SF Pro Display',
                    lineHeight: '100%',
                  }}
                  onClick={handleReset}
                >
                  Reset to Default
                </Button>
                <Button
                  style={{
                    padding: '14px 41px',
                    textTransform: 'none',
                    backgroundColor: '#007bce',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: 12,
                    fontFamily: 'SF Pro Display',
                    lineHeight: '100%',
                  }}
                  onClick={handleSaveChangesSecondtab}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </>
        )}
        {activeTab === 'Privacy & Security' && (
          <>
            <Box
              sx={{ width: '100%', p: { xs: 2, md: 3, alignItems: 'center' } }}
            >
              {/* Password Change Section */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} lg={2}>
                  <Typography
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      lineHeight: '100%',
                      fontFamily: 'SF Pro Display',
                      color: '#1C1C1E',
                    }}
                  >
                    Last Password Change
                  </Typography>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'flex-start', md: 'flex-end' },
                    }}
                  >
                    <Typography
                      variant="body1"
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        lineHeight: '100%',
                        fontFamily: 'SF Pro Display',
                        color: '#1C1C1E',
                      }}
                    >
                      Last updated on: {lastUpdatedPassword}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
                <Grid item xs={12} lg={3.8}>
                  <Typography
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      lineHeight: '100%',
                      fontFamily: 'SF Pro Display',
                      color: '#1C1C1E',
                    }}
                  >
                    Change Password
                  </Typography>
                </Grid>

                <Grid item xs={12} lg={7.5}>
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 2,
                    }}
                  >
                    <TextField
                      fullWidth
                      placeholder="Enter new password to update your password"
                      variant="outlined"
                      type="password"
                      value={newPassword}
                      onChange={handlePasswordChange}
                      size="small"
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        mt: { xs: 1, sm: 0 },
                        width: { xs: '100%' },
                      }}
                    >
                      <Button
                        variant="text"
                        color="inherit"
                        onClick={handleCancel}
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          lineHeight: '100%',
                          fontFamily: 'SF Pro Display',
                          color: '#1C1C1E',
                          textTransform: 'none',
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={handleUpdatePassword}
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          lineHeight: '100%',
                          fontFamily: 'SF Pro Display',
                          color: '#0284C7',
                          textTransform: 'none',
                        }}
                      >
                        Update Password
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Two-Factor Authentication Section */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} lg={3.8}>
                  <Typography
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      lineHeight: '100%',
                      fontFamily: 'SF Pro Display',
                      color: '#1C1C1E',
                    }}
                  >
                    Two-Factor Authentication (2FA)
                  </Typography>
                </Grid>

                <Grid item xs={12} lg={7}>
                  <Typography
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      lineHeight: '100%',
                      fontFamily: 'SF Pro Display',
                      color: '#1C1C1E',
                    }}
                  >
                    Select how you want to receive verification codes
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ flexGrow: 1, paddingTop: '6px' }}
                    >
                      <div
                        style={{
                          border: '0.5px solid #1C1C1E40',
                          borderRadius: '6px',
                          paddingLeft: '6px',
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={twoFactorOptions.sms}
                              onChange={() => handleTwoFactorChange('sms')}
                            />
                          }
                          label="SMS"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={twoFactorOptions.email}
                              onChange={() => handleTwoFactorChange('email')}
                            />
                          }
                          label="Email"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={twoFactorOptions.authenticatorApp}
                              onChange={() =>
                                handleTwoFactorChange('authenticatorApp')
                              }
                            />
                          }
                          label="Authenticator App"
                        />
                      </div>
                      <Button
                        variant="text"
                        color="inherit"
                        onClick={handleReset2FA}
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          lineHeight: '100%',
                          fontFamily: 'SF Pro Display',
                          color: '#1C1C1E',
                          textTransform: 'none',
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={handleUpdate2FA}
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          lineHeight: '100%',
                          fontFamily: 'SF Pro Display',
                          color: '#0284C7',
                          textTransform: 'none',
                        }}
                      >
                        Update
                      </Button>
                    </Stack>

                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        mt: { xs: 1, sm: 0 },
                        width: { xs: '100%', sm: 'auto' },
                      }}
                    >
                      {/* <Button
                                                variant='text'
                                                color='inherit'
                                                onClick={handleReset2FA}
                                                sx={{ minWidth: { xs: '45%', sm: 'auto', textTransform: 'none' } }}
                                            >
                                                Reset
                                            </Button>
                                            <Button
                                                variant='text'
                                                color='primary'
                                                onClick={handleUpdate2FA}
                                                sx={{ minWidth: { xs: '45%', sm: 'auto', textTransform: 'none' } }}
                                            >
                                                Update
                                            </Button> */}
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Last Login Section */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} lg={1.8}>
                  <Typography
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      lineHeight: '100%',
                      fontFamily: 'SF Pro Display',
                      color: '#1C1C1E',
                    }}
                  >
                    Last Login
                  </Typography>
                </Grid>

                <Grid item xs={12} lg={5}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'flex-start', md: 'flex-end' },
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        lineHeight: '100%',
                        fontFamily: 'SF Pro Display',
                        color: '#1C1C1E',
                      }}
                    >
                      Your last successful login was on {lastSuccessfulLogin}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                  mt: 4,
                }}
              >
                {/* <Button
                                    variant='outlined'
                                    color='inherit'
                                    onClick={handleResetToDefaultThirdtab}
                                    sx={{
                                        padding: '14px 41px', textTransform: 'none', fontSize: '12px', fontWeight: 500, color: '#1C1C1E', lineHeight: '100%', fontFamily: 'SF Pro Display'
                                    }}
                                >
                                    Reset to Default
                                </Button>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    onClick={handleSaveChangesThirdtab}
                                    sx={{
                                        padding: '14px 41px', textTransform: 'none', fontSize: '12px', fontWeight: 500, lineHeight: '100%', fontFamily: 'SF Pro Display', color: '#FFFFFF'
                                    }}
                                >
                                    Save Changes
                                </Button> */}
                <Button
                  style={{
                    padding: '14px 41px',
                    textTransform: 'none',
                    backgroundColor: 'white',
                    border: '1px solid #1C1C1E',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '12px',
                    color: '#1C1C1E',
                    fontFamily: 'SF Pro Display',
                    lineHeight: '100%',
                  }}
                  onClick={handleReset}
                >
                  Reset to Default
                </Button>
                <Button
                  style={{
                    padding: '14px 41px',
                    textTransform: 'none',
                    backgroundColor: '#007bce',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: 12,
                    fontFamily: 'SF Pro Display',
                    lineHeight: '100%',
                  }}
                  onClick={handleSaveChangesSecondtab}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </>
        )}
        {activeTab === 'Interview Settings' && (
          <>
            <Box p={4}>
              <Grid container spacing={3}>
                {rows.map((row) => (
                  <React.Fragment key={row.field}>
                    <Grid item xs={12} sm={4}>
                      <Typography
                        style={{
                          fontFamily: 'SF Pro Display',
                          fontSize: '12px',
                          fontWeight: 700,
                          lineHeight: '100%',
                        }}
                      >
                        {row.label}
                      </Typography>
                    </Grid>
                    <Grid item xs={8} sm={5}>
                      <Select
                        fullWidth
                        value={settings[row.field as keyof typeof settings]}
                        onChange={handleChange(row.field)}
                      >
                        {row.options.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={4} sm={3}>
                      <Button
                        variant="text"
                        onClick={() => handleSaveFourthtab(row.field)}
                        style={{ textTransform: 'none' }}
                      >
                        Save
                      </Button>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 20,
                  paddingTop: 25,
                }}
              >
                {/* <Button variant='outlined' onClick={handleResetFourthtab} style={{ textTransform: 'none', padding: '14px 41px 14px 41px', color: '#1C1C1E', fontSize: '12px', fontWeight: 500, borderRadius: '6px' }}>
                                    Reset to Default
                                </Button>
                                <Button variant='contained' onClick={handleSaveAllFourthtab} style={{ textTransform: 'none', padding: '14px 41px 14px 41px', color: '#FFFFFF', fontSize: '12px', fontWeight: 500, borderRadius: '6px' }}>
                                    Save Changes
                                </Button> */}
                <Button
                  style={{
                    padding: '14px 41px',
                    textTransform: 'none',
                    backgroundColor: 'white',
                    border: '1px solid #1C1C1E',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '12px',
                    color: '#1C1C1E',
                    fontFamily: 'SF Pro Display',
                    lineHeight: '100%',
                  }}
                  onClick={handleReset}
                >
                  Reset to Default
                </Button>
                <Button
                  style={{
                    padding: '14px 41px',
                    textTransform: 'none',
                    backgroundColor: '#007bce',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: 12,
                    fontFamily: 'SF Pro Display',
                    lineHeight: '100%',
                  }}
                  onClick={handleSaveChangesSecondtab}
                >
                  Save Changes
                </Button>
              </div>
            </Box>
          </>
        )}
        {activeTab === 'Notification Preferences' && (
          <>
            <Box p={4} width="100%" mx="auto">
              {/* In-App Notifications Section */}
              <Grid container spacing={0} sx={{ display: 'flex' }}>
                <Grid item lg={5}>
                  <Typography
                    style={{
                      fontWeight: 700,
                      fontSize: '12px',
                      color: '#1C1C1E',
                      lineHeight: '100%',
                    }}
                  >
                    In-App Notifications
                  </Typography>
                </Grid>
                <Grid item lg={6} sx={{}}>
                  <div>
                    <Typography
                      style={{
                        color: '#1C1C1E',
                        fontWeight: 700,
                        fontSize: '12px',
                        paddingBottom: '11px',
                      }}
                    >
                      Select how you want to receive verification codes
                    </Typography>
                  </div>
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    padding="10px"
                    border="0.5px solid #1C1C1E40 "
                    borderRadius="6px"
                  >
                    {[
                      'Interview Reminders',
                      'Interview Schedule Updates',
                      'Interview Confirmation',
                      'Upcoming Interview Reminders',
                      'Assessment Status Updates',
                      'Job Application Updates',
                      'Security Alerts',
                      'Enable Email/SMS Notifications',
                      'New Messages from Recruiters',
                      'Platform Announcements',
                    ].map((label, index) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            defaultChecked={label !== 'Security Alerts'}
                          />
                        }
                        label={label}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={0} sx={{ display: 'flex' }}>
                {/* Notification Control & Customization Section */}
                <Grid item lg={5}>
                  <Typography
                    style={{
                      fontWeight: 700,
                      fontSize: '12px',
                      color: '#1C1C1E',
                      lineHeight: '100%',
                    }}
                  >
                    Notification Control & Customization
                  </Typography>
                </Grid>

                <Grid item lg={6}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={3}
                    maxWidth="400px"
                  >
                    <Box>
                      <Typography
                        style={{
                          fontWeight: 700,
                          fontSize: '12px',
                          color: '#1C1C1E',
                          lineHeight: '100%',
                          paddingBottom: '10.75px',
                        }}
                      >
                        Do Not Disturb Mode
                      </Typography>
                      <Select fullWidth defaultValue="Off">
                        <MenuItem value="Off">Off</MenuItem>
                        <MenuItem value="On">On</MenuItem>
                      </Select>
                    </Box>

                    <Box>
                      <Typography
                        style={{
                          fontWeight: 700,
                          fontSize: '12px',
                          color: '#1C1C1E',
                          lineHeight: '100%',
                          paddingBottom: '10.75px',
                        }}
                      >
                        Set Preferred Notification Time
                      </Typography>
                      <Select fullWidth defaultValue="Off">
                        <MenuItem value="Off">Off</MenuItem>
                        <MenuItem value="Morning">Morning</MenuItem>
                        <MenuItem value="Evening">Evening</MenuItem>
                      </Select>
                    </Box>

                    <Box>
                      <Typography
                        style={{
                          fontWeight: 700,
                          fontSize: '12px',
                          color: '#1C1C1E',
                          lineHeight: '100%',
                          paddingBottom: '10.75px',
                        }}
                      >
                        Select Preferred Communication Channel
                      </Typography>
                      <Select fullWidth defaultValue="Email">
                        <MenuItem value="Email">Email</MenuItem>
                        <MenuItem value="SMS">SMS</MenuItem>
                        <MenuItem value="Both">Both</MenuItem>
                      </Select>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box mt={4} display="flex" gap={2} justifyContent="center">
                {/* <Button variant='outlined' style={{ textTransform: 'none', color: '#1C1C1E', fontWeight: 500, fontSize: '12px', padding: '14px 41px 14px 41px' }}>Reset to Default</Button>
                                <Button variant='contained' style={{ textTransform: 'none', color: '#FFFFFF', fontWeight: 500, fontSize: '12px', padding: '14px 41px 14px 41px' }}>Save Changes</Button> */}
                <Button
                  style={{
                    padding: '14px 41px',
                    textTransform: 'none',
                    backgroundColor: 'white',
                    border: '1px solid #1C1C1E',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '12px',
                    color: '#1C1C1E',
                    fontFamily: 'SF Pro Display',
                    lineHeight: '100%',
                  }}
                  onClick={handleReset}
                >
                  Reset to Default
                </Button>
                <Button
                  style={{
                    padding: '14px 41px',
                    textTransform: 'none',
                    backgroundColor: '#007bce',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: 12,
                    fontFamily: 'SF Pro Display',
                    lineHeight: '100%',
                  }}
                  onClick={handleSaveChangesSecondtab}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </>
        )}
        {activeTab == 'Accessibility' && (
          <>
            <Grid container spacing={0}>
              <Grid item lg={5}>
                <Box>
                  <Typography fontWeight="bold">
                    Text Size Adjustment
                  </Typography>
                </Box>
                <Box>
                  <Typography fontWeight="bold">Appearance</Typography>
                </Box>
                <Box>
                  {[
                    {
                      label: 'Text-to-Speech (TTS)',
                    },
                    {
                      label: 'Speech-to-Text (STT) Input',
                    },
                    {
                      label: 'Voice Navigation Assistance',
                    },
                  ].map((item, idx) => (
                    <Box
                      key={idx}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={3}
                      paddingTop="22px"
                    >
                      <Box>
                        <Typography fontWeight="bold">{item.label}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box paddingTop="22px">
                  <Typography fontWeight="bold">
                    Enable Captions & Subtitles
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={4}>
                <Box width="200px">
                  <Slider
                    value={textSize}
                    min={-5}
                    max={5}
                    onChange={(e: any, value: any) =>
                      setTextSize(value as number)
                    }
                    aria-labelledby="text-size-slider"
                  />
                  <Typography align="center">{textSize}</Typography>
                </Box>
                Notification Preferences
                <Box>
                  {[
                    {
                      label: 'Text-to-Speech (TTS)',
                    },
                    {
                      label: 'Speech-to-Text (STT) Input',
                    },
                    {
                      label: 'Voice Navigation Assistance',
                    },
                  ].map((item, idx) => (
                    <Box
                      key={idx}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={3}
                    >
                      <Box display="flex" gap={2} alignItems="center">
                        <FormControl
                          variant="outlined"
                          size="small"
                          sx={{ width: 200 }}
                        >
                          <Select value="Off" disabled>
                            <MenuItem value="Off">Off</MenuItem>
                          </Select>
                        </FormControl>
                        <Chip
                          label="Coming Soon"
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box>
                  <FormControl
                    variant="outlined"
                    size="small"
                    sx={{ width: 200, paddingTop: '22px' }}
                  >
                    <Select
                      value={captions}
                      onChange={(e) => setCaptions(e.target.value)}
                    >
                      <MenuItem value="On">On</MenuItem>
                      <MenuItem value="Off">Off</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <Box
              display="flex"
              gap={2}
              justifyContent="center"
              paddingTop="30px"
            >
              {/* <Button variant='outlined' style={{ padding: '14px 41px 14px 41px', color: '#1C1C1E', fontWeight: 500, fontSize: 12 }}>Reset to Default</Button>
                            <Button variant='contained' style={{ padding: '14px 41px 14px 41px', color: '#FFFFFF', fontWeight: 500, fontSize: 12 }}>Save Changes</Button> */}
              <Button
                style={{
                  padding: '14px 41px',
                  textTransform: 'none',
                  backgroundColor: 'white',
                  border: '1px solid #1C1C1E',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '12px',
                  color: '#1C1C1E',
                  fontFamily: 'SF Pro Display',
                  lineHeight: '100%',
                }}
                onClick={handleReset}
              >
                Reset to Default
              </Button>
              <Button
                style={{
                  padding: '14px 41px',
                  textTransform: 'none',
                  backgroundColor: '#007bce',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: 12,
                  fontFamily: 'SF Pro Display',
                  lineHeight: '100%',
                }}
                onClick={handleSaveChangesSecondtab}
              >
                Save Changes
              </Button>
            </Box>

            {/* <Box p={4} width='100%' mx='auto'>
                            <Box display='flex' alignItems='center' justifyContent='space-between' mb={3}>
                                <Box>
                                    <Typography fontWeight='bold'>Text Size Adjustment</Typography>
                                </Box>
                                <Box width='200px'>
                                    <Slider
                                        value={textSize}
                                        min={-5}
                                        max={5}
                                        onChange={(e: any, value: any) => setTextSize(value as number)}
                                        aria-labelledby='text-size-slider'
                                    />
                                    <Typography align='center'>{textSize}</Typography>
                                </Box>
                            </Box>

                            <Box display='flex' alignItems='center' justifyContent='space-between' mb={3}>
                                <Box>
                                    <Typography fontWeight='bold'>Appearance</Typography>
                                </Box>
                                <FormControl variant='outlined' size='small' sx={{ width: 200 }}>
                                    <Select value={appearance} onChange={(e) => setAppearance(e.target.value)}>
                                        <MenuItem value='Light'>Light</MenuItem>
                                        <MenuItem value='Dark'>Dark</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            {[
                                {
                                    label: 'Text-to-Speech (TTS)',
                                },
                                {
                                    label: 'Speech-to-Text (STT) Input',
                                },
                                {
                                    label: 'Voice Navigation Assistance',
                                }
                            ].map((item, idx) => (
                                <Box key={idx} display='flex' alignItems='center' justifyContent='space-between' mb={3}>
                                    <Box>
                                        <Typography fontWeight='bold'>{item.label}</Typography>
                                    </Box>
                                    <Box display='flex' gap={2} alignItems='center'>
                                        <FormControl variant='outlined' size='small' sx={{ width: 200 }}>
                                            <Select value='Off' disabled>
                                                <MenuItem value='Off'>Off</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Chip label='Coming Soon' color='success' variant='outlined' />
                                    </Box>
                                </Box>
                            ))}

                            <Box display='flex' alignItems='center' justifyContent='space-between' mb={4}>
                                <Box>
                                    <Typography fontWeight='bold'>Enable Captions & Subtitles</Typography>
                                </Box>
                                <FormControl variant='outlined' size='small' sx={{ width: 200 }}>
                                    <Select value={captions} onChange={(e) => setCaptions(e.target.value)}>
                                        <MenuItem value='On'>On</MenuItem>
                                        <MenuItem value='Off'>Off</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box display='flex' gap={2} justifyContent='center'>
                                <Button variant='outlined' style={{ padding: '14px 41px 14px 41px', color: '#1C1C1E', fontWeight: 500, fontSize: 12 }}>Reset to Default</Button>
                                <Button variant='contained' style={{ padding: '14px 41px 14px 41px', color: '#FFFFFF', fontWeight: 500, fontSize: 12 }}>Save Changes</Button>
                            </Box>
                        </Box> */}
          </>
        )}
      </div>
    </div>
  )
}

export default Settings
