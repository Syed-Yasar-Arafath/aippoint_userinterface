import React, { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Select,
  MenuItem,
  Grid,
  InputBase,
  Typography,
  Box,
  Popover,
  Divider,
  Skeleton,
} from '@mui/material'
import { MoreVertical, Search, Calendar as CalendarIcon } from 'lucide-react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'

// Define Candidate interface
interface Candidate {
  name: string
  position: string
  experience: string
  location: string
  education: string
  contact: string
  prevInterview: string
  about: string
  keySkills: string[]
  uploadedBy: string
  profileImage: string
  uploaderImage: string
}

const initialCandidates: Candidate[] = [
 {
    name: 'Karan Singh',
    position: 'Data Scientist',
    experience: '03 Years 10 Months',
    location: 'Delhi, NCR',
    education: 'M.Sc. - DU',
    contact: '+91-7890123456',
    prevInterview: 'ML... +2',
    about:
      'Skilled in machine learning, data analysis, and statistical modeling. Experienced in Python, TensorFlow, and big data technologies for predictive analytics.',
    keySkills: ['Python', 'TensorFlow', 'Pandas', 'SQL', 'Hadoop'],
    uploadedBy: 'Neha Gupta',
    profileImage: 'https://picsum.photos/200/200?random=5',
    uploaderImage: 'https://picsum.photos/200/200?random=15',
  },
  {
    name: 'Meera Nair',
    position: 'UI/UX Designer',
    experience: '02 Years 06 Months',
    location: 'Kochi, Kerala',
    education: 'B.Des - NID',
    contact: '+91-9012345678',
    prevInterview: 'Figma... +1',
    about:
      'Creative designer specializing in user-centered design. Proficient in Figma, Adobe XD, and prototyping tools to create seamless user experiences.',
    keySkills: [
      'Figma',
      'Adobe XD',
      'Prototyping',
      'Wireframing',
      'Usability Testing',
    ],
    uploadedBy: 'Sanjay Pillai',
    profileImage: 'https://picsum.photos/200/200?random=6',
    uploaderImage: 'https://picsum.photos/200/200?random=16',
  },
 
]

// Skeleton loader component for a single profile card
const SkeletonCard = () => (
  <Card
    style={{
      display: 'flex',
      padding: '1rem',
      gap: '1rem',
      alignItems: 'flex-start',
      border: '1px solid #E5E7EB',
      borderRadius: '0.375rem',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      marginBottom: '1rem',
    }}
  >
    <Skeleton
      variant="rectangular"
      width={20}
      height={20}
      style={{ marginTop: '0.5rem' }}
    />
    <Skeleton variant="circular" width={48} height={48} />
    <Box
      sx={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr) auto repeat(2, 1fr)',
          md: '1fr auto 1fr auto 1fr auto 1fr',
        },
        gap: '1rem',
        alignItems: 'stretch',
      }}
    >
      <div>
        <Skeleton variant="text" width="60%" sx={{ fontSize: '0.875rem' }} />
        <Skeleton variant="text" width="80%" sx={{ fontSize: '0.75rem' }} />
        <Skeleton variant="text" width="70%" sx={{ fontSize: '0.75rem' }} />
        <Skeleton variant="text" width="65%" sx={{ fontSize: '0.75rem' }} />
        <Skeleton variant="text" width="75%" sx={{ fontSize: '0.75rem' }} />
        <Skeleton variant="text" width="55%" sx={{ fontSize: '0.75rem' }} />
        <Skeleton variant="text" width="60%" sx={{ fontSize: '0.75rem' }} />
      </div>
      <Divider
        orientation="vertical"
        sx={{
          display: { xs: 'none', sm: 'block' },
          borderColor: '#1C1C1E59',
          alignSelf: 'stretch',
          width: '1px',
        }}
      />
      <div>
        <Skeleton
          variant="text"
          width="90%"
          sx={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Skeleton variant="rectangular" width={100} height={24} />
          <Skeleton variant="rectangular" width={60} height={24} />
        </div>
      </div>
      <Divider
        orientation="vertical"
        sx={{
          display: { xs: 'none', sm: 'block' },
          borderColor: '#1C1C1E59',
          alignSelf: 'stretch',
          width: '1px',
        }}
      />
      <div>
        <Skeleton
          variant="text"
          width="50%"
          sx={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}
        />
        <Skeleton variant="text" width="40%" sx={{ fontSize: '0.75rem' }} />
        <Skeleton variant="text" width="45%" sx={{ fontSize: '0.75rem' }} />
        <Skeleton variant="text" width="35%" sx={{ fontSize: '0.75rem' }} />
      </div>
      <Divider
        orientation="vertical"
        sx={{
          display: { xs: 'none', sm: 'block' },
          borderColor: '#1C1C1E59',
          alignSelf: 'stretch',
          width: '1px',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.25rem',
          }}
        >
          <Skeleton variant="text" width="70%" sx={{ fontSize: '0.75rem' }} />
          <Skeleton variant="rectangular" width={60} height={20} />
        </div>
        <Skeleton variant="text" width="50%" sx={{ fontSize: '0.75rem' }} />
        <Skeleton variant="text" width="60%" sx={{ fontSize: '0.75rem' }} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="rectangular" width={80} height={24} />
        </div>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={32}
          style={{ marginTop: '0.5rem' }}
        />
      </div>
    </Box>
    <Skeleton variant="rectangular" width={20} height={20} />
  </Card>
)

export default function CollectionAvailable() {
  const [selectedJobRole, setSelectedJobRole] = useState<string>('')
  const [selectedExperience, setSelectedExperience] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  )
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)
  const [selectedProfile, setSelectedProfile] = useState<Candidate | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true) // Add loading state
  const profilesPerPage = 4 // Display 4 profiles per page

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000) // 2-second delay for demonstration
    return () => clearTimeout(timer)
  }, [])

  // Filter candidates based on selected user
  const filteredCandidates = candidates.filter((candidate) =>
    selectedUser ? candidate.uploadedBy === selectedUser : true,
  )

  const totalPages = Math.ceil(filteredCandidates.length / profilesPerPage)
  const startIndex = (currentPage - 1) * profilesPerPage
  const currentCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + profilesPerPage,
  )

  const uniqueJobRoles = Array.from(new Set(candidates.map((c) => c.position)))
  // Create a map of users to their uploaderImage (use first occurrence)
  const userImageMap = candidates.reduce((map, candidate) => {
    if (!map[candidate.uploadedBy]) {
      map[candidate.uploadedBy] = candidate.uploaderImage
    }
    return map
  }, {} as Record<string, string>)
  const uniqueUsers = Array.from(new Set(candidates.map((c) => c.uploadedBy)))
  const experienceOptions = Array.from(
    new Set(candidates.map((c) => c.experience)),
  )
  const statusOptions = ['Not interviewed', 'Scheduled', 'Interview Completed']

  const handleToggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index)
    setSelectedOption(null) // Reset selected option when dropdown toggles
  }

  const handleMoveProfile = (candidate: Candidate) => {
    setSelectedProfile(candidate)
    setOpenDropdownIndex(null)
  }

  const handleDeleteProfile = (index: number) => {
    const globalIndex = startIndex + index
    setCandidates(candidates.filter((_, i) => i !== globalIndex))
    setOpenDropdownIndex(null)
    const newTotalPages = Math.ceil(
      (filteredCandidates.length - 1) / profilesPerPage,
    )
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    }
  }

  const handleCloseModal = () => {
    setSelectedProfile(null)
  }

  const handleDateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDateClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'date-picker-popover' : undefined

  // Common MenuProps for Select components
  const menuProps = {
    PaperProps: {
      sx: {
        '& .MuiMenuItem-root': {
          color: '#666',
          fontSize: '12px',
          padding: '8px',
          fontFamily: 'SF Pro Display',
          '&:hover': {
            color: '#0284C7',
            backgroundColor: 'transparent', // Ensure no background color on hover
          },
          '&.Mui-selected': {
            color: '#0284C7',
            backgroundColor: 'rgba(2, 132, 199, 0.1)', // Light background for selected item
            '&:hover': {
              color: '#0284C7',
              backgroundColor: 'rgba(2, 132, 199, 0.1)',
            },
          },
        },
      },
    },
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        style={{
          padding: '16px',
          maxWidth: '1280px',
          margin: '0 auto',
          fontFamily: 'SF Pro Display',
        }}
      >
        {selectedProfile && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '0.5rem',
                width: '80%',
                maxWidth: '800px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                fontFamily: 'SF Pro Display',
              }}
            >
              <Button
                onClick={handleCloseModal}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  color: '#DC2626',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '2rem', // increase if needed
                  fontFamily: 'SF Pro Display',
                  cursor: 'pointer',
                }}
              >
                ×
              </Button>

              <Typography
                style={{
                  marginBottom: '1rem',
                  color: '#0284C7',
                  fontFamily: 'SF Pro Display',
                  fontSize: '1.5rem', // equivalent to h5
                  fontWeight: 600, // optional, to match h5 weight
                }}
              >
                {selectedProfile.name}
              </Typography>
              <div
                style={{
                  fontSize: '1rem',
                  color: '#4B5563',
                  fontFamily: 'SF Pro Display',
                }}
              >
                <p style={{ margin: '0.5rem 0', fontFamily: 'SF Pro Display' }}>
                  <strong style={{ fontFamily: 'SF Pro Display' }}>
                    Current Position:
                  </strong>{' '}
                  {selectedProfile.position}
                </p>
                <p style={{ margin: '0.5rem 0', fontFamily: 'SF Pro Display' }}>
                  <strong style={{ fontFamily: 'SF Pro Display' }}>
                    Experience:
                  </strong>{' '}
                  {selectedProfile.experience}
                </p>
                <p style={{ margin: '0.5rem 0', fontFamily: 'SF Pro Display' }}>
                  <strong style={{ fontFamily: 'SF Pro Display' }}>
                    Location:
                  </strong>{' '}
                  {selectedProfile.location}
                </p>
                <p style={{ margin: '0.5rem 0', fontFamily: 'SF Pro Display' }}>
                  <strong style={{ fontFamily: 'SF Pro Display' }}>
                    Education:
                  </strong>{' '}
                  {selectedProfile.education}
                </p>
                <p style={{ margin: '0.5rem 0', fontFamily: 'SF Pro Display' }}>
                  <strong style={{ fontFamily: 'SF Pro Display' }}>
                    Contact:
                  </strong>{' '}
                  {selectedProfile.contact}
                </p>
                <p style={{ margin: '0.5rem 0', fontFamily: 'SF Pro Display' }}>
                  <strong style={{ fontFamily: 'SF Pro Display' }}>
                    Previous Interview:
                  </strong>{' '}
                  {selectedProfile.prevInterview}
                </p>
                <p style={{ margin: '0.5rem 0', fontFamily: 'SF Pro Display' }}>
                  <strong style={{ fontFamily: 'SF Pro Display' }}>
                    About:
                  </strong>{' '}
                  {selectedProfile.about}
                </p>
                <p style={{ margin: '0.5rem 0', fontFamily: 'SF Pro Display' }}>
                  <strong style={{ fontFamily: 'SF Pro Display' }}>
                    Key Skills:
                  </strong>
                </p>
                <ul
                  style={{
                    listStyleType: 'disc',
                    paddingLeft: '1.5rem',
                    margin: '0',
                  }}
                >
                  {selectedProfile.keySkills.map(
                    (skill: string, idx: number) => (
                      <li
                        key={idx}
                        style={{
                          margin: '0.25rem 0',
                          fontFamily: 'SF Pro Display',
                        }}
                      >
                        {skill}
                      </li>
                    ),
                  )}
                </ul>
                <p style={{ margin: '0.5rem 0', fontFamily: 'SF Pro Display' }}>
                  <strong style={{ fontFamily: 'SF Pro Display' }}>
                    Uploaded By:
                  </strong>{' '}
                  {selectedProfile.uploadedBy}
                </p>
              </div>
            </div>
          </div>
        )}

        <Grid
          container
          spacing={2}
          alignItems="center"
          wrap="nowrap"
          style={{ overflowX: 'auto', marginBottom: '16px' }}
          sx={{
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}
        >
          <Grid item>
            <div
              style={{
                position: 'relative',
                width: '200px',
                height: '40px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '12px',
              }}
            >
              <InputBase
                placeholder="Search..."
                style={{
                  fontSize: '12px',
                  width: '100%',
                  fontFamily: 'SF Pro Display',
                }}
              />
              <Search
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666',
                  width: '20px',
                  height: '20px',
                }}
              />
            </div>
          </Grid>

          <Grid item>
            <Select
              displayEmpty
              value={selectedJobRole}
              onChange={(e) => setSelectedJobRole(e.target.value)}
              style={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
                fontFamily: 'SF Pro Display',
              }}
              renderValue={(value) => (
                <Typography
                  style={{
                    color: value ? '#0284C7' : '#666',
                    fontSize: '12px',
                    fontFamily: 'SF Pro Display',
                  }}
                >
                  {value || 'Select Job Role'}
                </Typography>
              )}
              MenuProps={menuProps}
            >
              <MenuItem value="">Available Job Roles</MenuItem>
              {uniqueJobRoles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item>
            <Select
              displayEmpty
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              style={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
                fontFamily: 'SF Pro Display',
              }}
              renderValue={(value) => (
                <Typography
                  style={{
                    color: value ? '#0284C7' : '#666',
                    fontSize: '12px',
                    fontFamily: 'SF Pro Display',
                  }}
                >
                  {value || 'Select Experience'}
                </Typography>
              )}
              MenuProps={menuProps}
            >
              <MenuItem value="">Select Experience</MenuItem>
              {experienceOptions.map((exp) => (
                <MenuItem key={exp} value={exp}>
                  {exp}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item>
            <Select
              displayEmpty
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value)
                setCurrentPage(1) // Reset to first page on filter change
              }}
              style={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
                fontFamily: 'SF Pro Display',
              }}
              renderValue={(value) => (
                <Typography
                  style={{
                    color: value ? '#0284C7' : '#666',
                    fontSize: '12px',
                    fontFamily: 'SF Pro Display',
                  }}
                >
                  {value || 'Select User'}
                </Typography>
              )}
              MenuProps={menuProps}
            >
              <MenuItem value="">Select User</MenuItem>
              {uniqueUsers.map((user) => (
                <MenuItem key={user} value={user}>
                  <img
                    src={userImageMap[user]}
                    alt={`${user}'s profile`}
                    style={{
                      height: '1.25rem',
                      width: '1.25rem',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: '8px',
                    }}
                  />
                  {user}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item>
            <Select
              displayEmpty
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
                fontFamily: 'SF Pro Display',
              }}
              renderValue={(value) => (
                <Typography
                  style={{
                    color: value ? '#0284C7' : '#666',
                    fontSize: '12px',
                    fontFamily: 'SF Pro Display',
                  }}
                >
                  {value || 'Select Status'}
                </Typography>
              )}
              MenuProps={menuProps}
            >
              <MenuItem value="">Select Status</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item>
            <Select
              displayEmpty
              value=""
              style={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
                fontFamily: 'SF Pro Display',
              }}
              renderValue={() => (
                <Typography
                  style={{
                    color: '#666',
                    fontSize: '12px',
                    fontFamily: 'SF Pro Display',
                  }}
                >
                  Select
                </Typography>
              )}
            >
              <MenuItem
                value=""
                disabled
                style={{
                  color: '#666',
                  fontSize: '12px',
                  padding: '8px',
                  fontFamily: 'SF Pro Display',
                }}
              >
                Select
              </MenuItem>
            </Select>
          </Grid>

          {/* Date Picker */}
          <Grid item>
            <Button
              onClick={handleDateClick}
              sx={{
                height: '40px',
                width: '158px',
                fontSize: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
                color: '#666',
                justifyContent: 'flex-start',
                textTransform: 'none',
                paddingRight: '35px',
                '& .MuiButton-endIcon': {
                  marginLeft: '20px',
                },
                fontFamily: 'SF Pro Display',
              }}
              endIcon={<CalendarIcon />}
            >
              {selectedDate
                ? selectedDate.format('DD-MMM-YYYY')
                : 'Select Date'}
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleDateClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <DatePicker
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue)
                  setCurrentPage(1) // Reset to first page on filter change
                  handleDateClose()
                }}
              />
            </Popover>
          </Grid>
        </Grid>

        <p
          style={{
            fontSize: '0.875rem',
            color: '#4B5563',
            margin: '0',
            fontFamily: 'SF Pro Display',
          }}
        >
          Available profiles for{' '}
          <span
            style={{
              color: '#0284C7',
              fontWeight: 500,
              fontFamily: 'SF Pro Display',
            }}
          >
            Various Roles ({filteredCandidates.length})
          </span>
          :
        </p>

        {loading ? (
          // Show skeleton loader while loading
          <>
            {[...Array(profilesPerPage)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </>
        ) : currentCandidates.length > 0 ? (
          currentCandidates.map((candidate, i) => {
            // Parse prevInterview to separate prefix and numeric part
            const match = candidate.prevInterview.match(/(.*?)(\+\d+)$/)
            const prefix = match ? match[1] : candidate.prevInterview
            const number = match ? match[2] : ''

            return (
              <Card
                key={i}
                style={{
                  display: 'flex',
                  padding: '1rem',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.375rem',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                  marginBottom: '1rem',
                }}
              >
                <input type="checkbox" style={{ marginTop: '0.5rem' }} />
                <img
                  src={candidate.profileImage}
                  alt={`${candidate.name}'s profile`}
                  style={{
                    height: '3rem',
                    width: '3rem',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr) auto repeat(2, 1fr)',
                      md: '1fr auto 1fr auto 1fr auto 1fr',
                    },
                    gap: '1rem',
                    alignItems: 'stretch',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: '#0284C7',
                        margin: '0 0 0.25rem 0',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      {candidate.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#4B5563',
                        margin: '0.25rem 0',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      Current Position: {candidate.position}
                    </p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#4B5563',
                        margin: '0.25rem 0',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      Experience: {candidate.experience}
                    </p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#4B5563',
                        margin: '0.25rem 0',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      Location: {candidate.location}
                    </p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#4B5563',
                        margin: '0.25rem 0',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      Education: {candidate.education}
                    </p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#4B5563',
                        margin: '0.25rem 0',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      Contact: {candidate.contact}
                    </p>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#4B5563',
                        margin: '0.25rem 0',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      Prev Interview: {prefix}
                      {number && (
                        <span
                          style={{
                            color: '#0284C7',
                            fontFamily: 'SF Pro Display',
                          }}
                        >
                          {number}
                        </span>
                      )}
                    </p>
                  </div>
                  <Divider
                    orientation="vertical"
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      borderColor: '#1C1C1E59',
                      alignSelf: 'stretch',
                      width: '1px',
                    }}
                  />
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#4B5563',
                      fontFamily: 'SF Pro Display',
                    }}
                  >
                    <p
                      style={{
                        margin: '0 0 0.5rem 0',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          fontFamily: 'SF Pro Display',
                        }}
                      >
                        About:
                      </span>{' '}
                      {candidate.about}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button
                        variant="outlined"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.25rem',
                          backgroundColor: 'white',
                          color: '#4B5563',
                          fontFamily: 'SF Pro Display',
                          textTransform: 'inherit',
                          width: '100%',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        View CV/Resume
                      </Button>
                      <Button
                        variant="outlined"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.25rem',
                          backgroundColor: 'white',
                          color: '#4B5563',
                          fontFamily: 'SF Pro Display',
                          textTransform: 'inherit',
                          width: '120px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        Notes
                      </Button>
                    </div>
                  </div>
                  <Divider
                    orientation="vertical"
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      borderColor: '#1C1C1E59',
                      alignSelf: 'stretch',
                      width: '1px',
                    }}
                  />
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#4B5563',
                      fontFamily: 'SF Pro Display',
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 600,
                        margin: '0 0 0.25rem 0',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      Key Skills
                    </p>
                    <ul
                      style={{
                        listStyleType: 'disc',
                        paddingLeft: '1rem',
                        margin: '0',
                      }}
                    >
                      {candidate.keySkills.map((skill: string, idx: number) => (
                        <li
                          key={idx}
                          style={{
                            margin: '0.25rem 0',
                            fontFamily: 'SF Pro Display',
                          }}
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Divider
                    orientation="vertical"
                    sx={{
                      display: { xs: 'none', sm: 'block' },
                      borderColor: '#1C1C1E59',
                      alignSelf: 'stretch',
                      width: '1px',
                    }}
                  />
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#4B5563',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      fontFamily: 'SF Pro Display',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        margin: '0',
                        fontFamily: 'SF Pro Display',
                        flexWrap: 'nowrap',
                        gap: '0.25rem',
                      }}
                    >
                      <p
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          margin: '0',
                          fontFamily: 'SF Pro Display',
                          flexShrink: 1,
                        }}
                      >
                        <img
                          src={candidate.uploaderImage}
                          alt={`${candidate.uploadedBy}'s profile`}
                          style={{
                            height: '1.25rem',
                            width: '1.25rem',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                        Uploaded By{' '}
                        <span
                          style={{
                            fontWeight: 500,
                            fontFamily: 'SF Pro Display',
                          }}
                        >
                          {candidate.uploadedBy}
                        </span>
                      </p>
                      <Box
                        sx={{
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.25rem',
                          padding: '0.125rem',
                          fontSize: '0.75rem',
                          color: '#4B5563',
                          fontFamily: 'SF Pro Display',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          minWidth: '60px',
                          maxWidth: '80px',
                          flexShrink: 0,
                        }}
                      >
                        <Button
                          style={{
                            fontSize: '0.75rem',
                            color: '#4B5563',
                            fontFamily: 'SF Pro Display',
                            textTransform: 'none',
                            padding: '0',
                            minWidth: 'unset',
                          }}
                          onClick={() => alert('Score Now clicked')}
                        >
                          Score Now
                        </Button>
                      </Box>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 500,
                          fontFamily: 'SF Pro Display',
                        }}
                      >
                        Upcoming Interview:
                      </span>
                      <span
                        style={{
                          fontWeight: '500',
                          fontFamily: 'SF Pro Display',
                        }}
                      >
                        Previous Interviews:
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      <Box
                        sx={{
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.25rem',
                          padding: '0.25rem',
                          fontSize: '0.75rem',
                          color: '#4B5563',
                          fontFamily: 'SF Pro Display',
                          flex: 1,
                          minWidth: '80px',
                          maxWidth: '120px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                        }}
                      >
                        Not Scheduled
                      </Box>
                      <Box
                        sx={{
                          border: '1px solid #E5E7EB',
                          borderRadius: '0.25rem',
                          padding: '0.25rem',
                          fontSize: '0.75rem',
                          color: '#4B5563',
                          fontFamily: 'SF Pro Display',
                          flex: 1,
                          minWidth: '80px',
                          maxWidth: '120px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                        }}
                      >
                        NA
                      </Box>
                    </div>
                    <Button
                      style={{
                        width: '100%',
                        fontSize: '0.75rem',
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.25rem',
                        backgroundColor: '#0284C7',
                        color: 'white',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      Schedule Interview
                    </Button>
                  </div>
                </Box>
                <div style={{ position: 'relative' }}>
                  <Button
                    onClick={() => handleToggleDropdown(i)}
                    style={{
                      minWidth: 'unset',
                      padding: '0.25rem',
                      color: '#4B5563',
                      backgroundColor: 'transparent',
                      border: 'none',
                      fontFamily: 'SF Pro Display',
                    }}
                  >
                    <MoreVertical style={{ width: '1rem', height: '1rem' }} />
                  </Button>
                  {openDropdownIndex === i && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        marginTop: '0.5rem',
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        padding: '0.5rem',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        width: '8rem',
                        zIndex: 1,
                        fontFamily: 'SF Pro Display',
                        textAlign: 'center',
                      }}
                    >
                      <p
                        style={{
                          padding: '0.25rem',
                          borderRadius: '0.25rem',
                          margin: '0',
                          fontWeight: '600',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'SF Pro Display',
                          color: '#4B5563',
                        }}
                      >
                        Select an Action
                      </p>
                      <Typography
                        onClick={() => {
                          setSelectedOption('move')
                          handleMoveProfile(candidate)
                        }}
                        sx={{
                          padding: '0.25rem',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          margin: '0',
                          fontFamily: 'SF Pro Display',
                          color:
                            selectedOption === 'move' ? '#DC2626' : '#000000',
                          '&:hover': { color: '#DC2626' },
                          fontSize: '0.75rem',
                        }}
                      >
                        Move Profile
                      </Typography>
                      <Typography
                        onClick={() => {
                          setSelectedOption('delete')
                          handleDeleteProfile(i)
                        }}
                        sx={{
                          padding: '0.25rem',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          margin: '0.25rem 0 0 0',
                          fontFamily: 'SF Pro Display',
                          color:
                            selectedOption === 'delete' ? '#DC2626' : '#000000',
                          '&:hover': { color: '#DC2626' },
                          fontSize: '0.75rem',
                        }}
                      >
                        Delete Profile
                      </Typography>
                    </div>
                  )}
                </div>
              </Card>
            )
          })
        ) : (
          <Typography
            style={{
              fontSize: '1rem',
              color: '#4B5563',
              textAlign: 'center',
              marginTop: '2rem',
              fontFamily: 'SF Pro Display',
            }}
          >
            No profiles match the selected user.
          </Typography>
        )}

        {/* Pagination Section - Moved to the bottom */}
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{
            marginTop: '2rem', // Add some space above the pagination
            padding: { xs: '8px', sm: '12px' },
            flexWrap: 'wrap',
            fontFamily: 'SF Pro Display',
          }}
        >
          <Grid item>
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              sx={{
                textTransform: 'none',
                fontSize: { xs: '10px', sm: '12px' },
                color: '#0284C7',
                padding: { xs: '4px 8px', sm: '6px 12px' },
                fontFamily: 'SF Pro Display',
              }}
            >
              Prev
            </Button>
          </Grid>

          {[...Array(totalPages)].map((_, i) => (
            <Grid item key={i}>
              <Button
                onClick={() => setCurrentPage(i + 1)}
                sx={{
                  minWidth: { xs: '28px', sm: '32px' },
                  height: { xs: '28px', sm: '32px' },
                  borderRadius: '4px',
                  backgroundColor:
                    i + 1 === currentPage ? '#1976d2' : 'transparent',
                  color: i + 1 === currentPage ? 'white' : '#1976d2',
                  fontSize: { xs: '10px', sm: '12px' },
                  padding: { xs: '4px', sm: '6px' },
                  fontFamily: 'SF Pro Display',
                }}
              >
                {i + 1}
              </Button>
            </Grid>
          ))}

          <Grid item>
            <Typography
              sx={{
                fontSize: { xs: '10px', sm: '12px' },
                color: '#0284C7',
                padding: { xs: '4px', sm: '8px' },
                fontFamily: 'SF Pro Display',
              }}
            >
              ...
            </Typography>
          </Grid>

          <Grid item>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              sx={{
                textTransform: 'none',
                fontSize: { xs: '10px', sm: '12px' },
                color: '#0284C7',
                padding: { xs: '4px 8px', sm: '6px 12px' },
                fontFamily: 'SF Pro Display',
              }}
            >
              Next
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                fontSize: { xs: '10px', sm: '12px' },
                ml: { xs: 1, sm: '2' },
                backgroundColor: '#0284C7',
                '&:hover': { backgroundColor: '#0284C7' },
                padding: { xs: '4px 8px', sm: '6px 12px' },
                fontFamily: 'SF Pro Display',
              }}
              onClick={() => alert('Schedule Interview clicked')}
            >
              Schedule Interview
            </Button>
          </Grid>
        </Grid>
      </div>
    </LocalizationProvider>
  )
}
