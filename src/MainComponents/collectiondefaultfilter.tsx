import { ExpandMore } from '@mui/icons-material'
import {
  Button,
  Grid,
  InputBase,
  MenuItem,
  Select,
  Typography,
  Popover,
} from '@mui/material'
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import EventIcon from '@mui/icons-material/Event'
import dayjs from 'dayjs'

const ProfileCollectionDashboardf: React.FC = () => {
  const collections = [
    {
      name: 'Software Engineer - Frontend',
      profiles: 100,
      addedBy: 'Rahul Sharma',
      lastUpdated: '05-May-2025',
      image: 'assets/static/images/Rectangle 34624281.png',
      experience: '5 years',
      status: 'Not interviewed',
    },
    {
      name: 'Software Analyst',
      profiles: 83,
      addedBy: 'Kiran Naidu',
      lastUpdated: '02-May-2025',
      image: 'assets/static/images/Rectangle 34624282 (2).png',
      experience: '3 years',
      status: 'Scheduled',
    },
    {
      name: 'Software Engineer - Full Stack',
      profiles: 43,
      addedBy: 'Samer Khan',
      lastUpdated: '04-May-2025',
      image: 'assets/static/images/Rectangle 34624282 (4).png',
      experience: '4 years',
      status: 'Interview Completed',
    },
    {
      name: 'Senior Product Manager',
      profiles: 83,
      addedBy: 'Samer Khan',
      lastUpdated: '02-Apr-2025',
      image: 'assets/static/images/Rectangle 34624282.png',
      experience: '7 years',
      status: 'Not interviewed',
    },
    {
      name: 'Software Engineer - Full Stack II',
      profiles: 130,
      addedBy: 'Samer Khan',
      lastUpdated: '04-May-2025',
      image: 'assets/static/images/Rectangle 34624282 (4).png',
      experience: '6 years',
      status: 'Scheduled',
    },
    {
      name: 'DevOps Engineer',
      profiles: 90,
      addedBy: 'Samer Khan',
      lastUpdated: '28-Mar-2025',
      image: 'assets/static/images/Rectangle 34624282.png',
      experience: '5 years',
      status: 'Interview Completed',
    },
    {
      name: 'Senior UI/UX Designer',
      profiles: 160,
      addedBy: 'Samer Khan',
      lastUpdated: '06-May-2025',
      image: 'assets/static/images/Rectangle 34624282 (4).png',
      experience: '8 years',
      status: 'Not interviewed',
    },
    {
      name: 'Senior Software Engineer - Backend',
      profiles: 100,
      addedBy: 'Rahul Sharma',
      lastUpdated: '27-Mar-2025',
      image: 'assets/static/images/Rectangle 34624282.png',
      experience: '9 years',
      status: 'Scheduled',
    },
    {
      name: 'Digital Marketing Intern',
      profiles: 200,
      addedBy: 'Rahul Sharma',
      lastUpdated: '26-Mar-2025',
      image: 'assets/static/images/Rectangle 34624281.png',
      experience: '1 years',
      status: 'Interview Completed',
    },
    {
      name: 'Junior Sales Executive',
      profiles: 200,
      addedBy: 'Samer Khan',
      lastUpdated: '26-Mar-2025',
      image: 'https://picsum.photos/seed/samer6/24/24',
      experience: '2 years',
      status: 'Not interviewed',
    },
    {
      name: 'Junior UI/UX Designer',
      profiles: 160,
      addedBy: 'Samer Khan',
      lastUpdated: '26-Mar-2025',
      image: 'https://picsum.photos/seed/samer7/24/24',
      experience: '3 years',
      status: 'Scheduled',
    },
    {
      name: 'Junior Product Manager',
      profiles: 96,
      addedBy: 'Kiran Naidu',
      lastUpdated: '25-Mar-2025',
      image: 'https://picsum.photos/seed/kiran2/24/24',
      experience: '4 years',
      status: 'Interview Completed',
    },
    {
      name: 'DevOps Engineer Intern',
      profiles: 35,
      addedBy: 'Kiran Naidu',
      lastUpdated: '25-Mar-2025',
      image: 'https://picsum.photos/seed/kiran3/24/24',
      experience: '1 years',
      status: 'Not interviewed',
    },
    {
      name: 'Junior Data Analyst',
      profiles: 63,
      addedBy: 'Kiran Naidu',
      lastUpdated: '25-Mar-2025',
      image: 'https://picsum.photos/seed/kiran4/24/24',
      experience: '2 years',
      status: 'Scheduled',
    },
    {
      name: 'Software Engineer - Java Developer',
      profiles: 120,
      addedBy: 'Rahul Sharma',
      lastUpdated: '25-Mar-2025',
      image: 'https://picsum.photos/seed/rahul4/24/24',
      experience: '6 years',
      status: 'Interview Completed',
    },
  ]

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  const [selectedJobRole, setSelectedJobRole] = useState<string>('')
  const [selectedExperience, setSelectedExperience] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)

  const itemsPerPage = 9

  // Filter collections based on selections
  const filteredCollections = collections.filter((collection) => {
    return (
      (!selectedJobRole || collection.name === selectedJobRole) &&
      (!selectedExperience || collection.experience === selectedExperience) &&
      (!selectedUser || collection.addedBy === selectedUser) &&
      (!selectedStatus || collection.status === selectedStatus) &&
      (!selectedDate ||
        collection.lastUpdated === selectedDate.format('DD-MMM-YYYY'))
    )
  })

  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage)
  const paginatedCollections = filteredCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const CustomExpandMore = () => (
    <ExpandMore sx={{ fontSize: '20px', color: '#666', marginRight: '10px' }} />
  )

  // Date Picker States
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleDateClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDateClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'date-picker-popover' : undefined

  // Get unique job roles and users
  const uniqueJobRoles = Array.from(new Set(collections.map((c) => c.name)))
  const uniqueUsers = Array.from(
    new Set(
      collections.map((c) =>
        JSON.stringify({ name: c.addedBy, image: c.image }),
      ),
    ),
    (item) => JSON.parse(item),
  )
  const experienceOptions = Array.from(
    { length: 10 },
    (_, i) => `${i + 1} years`,
  )
  const statusOptions = ['Not interviewed', 'Scheduled', 'Interview Completed']

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ padding: '16px', maxWidth: '1280px', margin: '0 auto' }}>
        {/* Search and Filters */}
        <Grid
          container
          spacing={2}
          alignItems="center"
          wrap="nowrap"
          sx={{ overflowX: 'auto', mb: 2 }}
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
                sx={{ fontSize: '12px', width: '100%' }}
              />
              <Search
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666',
                }}
              />
            </div>
          </Grid>

          {/* Filter Selects */}
          <Grid item>
            <Select
              displayEmpty
              value={selectedJobRole}
              onChange={(e) => {
                setSelectedJobRole(e.target.value as string)
                setCurrentPage(1) // Reset to first page on filter change
              }}
              IconComponent={CustomExpandMore}
              sx={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
              }}
              renderValue={(value) => (
                <Typography sx={{ color: '#666', fontSize: '12px' }}>
                  {value || 'Select Job Role'}
                </Typography>
              )}
            >
              <MenuItem
                value=""
                sx={{
                  color: '#666',
                  fontSize: '12px',
                  fontFamily: 'SF Pro Display',
                  '&:hover': { color: '#0284C7' },
                }}
              >
                Available Job Roles
              </MenuItem>
              {uniqueJobRoles.map((role) => (
                <MenuItem
                  key={role}
                  value={role}
                  sx={{
                    color: '#666',
                    fontSize: '12px',
                    fontFamily: 'SF Pro Display',
                    '&:hover': { color: '#0284C7' },
                  }}
                >
                  {role}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Select
              displayEmpty
              value={selectedExperience}
              onChange={(e) => {
                setSelectedExperience(e.target.value as string)
                setCurrentPage(1) // Reset to first page on filter change
              }}
              IconComponent={CustomExpandMore}
              sx={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
              }}
              renderValue={(value) => (
                <Typography sx={{ color: '#666', fontSize: '12px' }}>
                  {value || 'Select Experience'}
                </Typography>
              )}
            >
              <MenuItem
                value=""
                sx={{
                  color: '#666',
                  fontSize: '12px',
                  fontFamily: 'SF Pro Display',
                  '&:hover': { color: '#0284C7' },
                }}
              >
                Select Experience
              </MenuItem>
              {experienceOptions.map((exp) => (
                <MenuItem
                  key={exp}
                  value={exp}
                  sx={{
                    color: '#666',
                    fontSize: '12px',
                    fontFamily: 'SF Pro Display',
                    '&:hover': { color: '#0284C7' },
                  }}
                >
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
                setSelectedUser(e.target.value as string)
                setCurrentPage(1) // Reset to first page on filter change
              }}
              IconComponent={CustomExpandMore}
              sx={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
              }}
              renderValue={(value) => (
                <Typography sx={{ color: '#666', fontSize: '12px' }}>
                  {value || 'Select User'}
                </Typography>
              )}
            >
              <MenuItem
                value=""
                sx={{
                  color: '#666',
                  fontSize: '12px',
                  fontFamily: 'SF Pro Display',
                  '&:hover': { color: '#0284C7' },
                }}
              >
                Select User
              </MenuItem>
              {uniqueUsers.map((user) => (
                <MenuItem
                  key={user.name}
                  value={user.name}
                  sx={{
                    color: '#666',
                    fontSize: '12px',
                    fontFamily: 'SF Pro Display',
                    '&:hover': {
                      color: '#0284C7',
                      fontFamily: 'SF Pro Display',
                    },
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <img
                      src={user.image}
                      alt={user.name}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        fontFamily: 'SF Pro Display',
                      }}
                    />
                    {user.name}
                  </div>
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Select
              displayEmpty
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as string)
                setCurrentPage(1) // Reset to first page on filter change
              }}
              IconComponent={CustomExpandMore}
              sx={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
              }}
              renderValue={(value) => (
                <Typography sx={{ color: '#666', fontSize: '12px' }}>
                  {value || 'Select Status'}
                </Typography>
              )}
            >
              <MenuItem
                value=""
                sx={{
                  color: '#666',
                  fontSize: '12px',
                  fontFamily: 'SF Pro Display',
                  '&:hover': { color: '#0284C7' },
                }}
              >
                Select Status
              </MenuItem>
              {statusOptions.map((status) => (
                <MenuItem
                  key={status}
                  value={status}
                  sx={{
                    color: '#666',
                    fontSize: '12px',
                    fontFamily: 'SF Pro Display',
                    '&:hover': { color: '#0284C7' },
                  }}
                >
                  {status}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Select
              displayEmpty
              value=""
              IconComponent={CustomExpandMore}
              sx={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
              }}
              renderValue={() => (
                <Typography sx={{ color: '#666', fontSize: '12px' }}>
                  Select
                </Typography>
              )}
            >
              <MenuItem
                value=""
                disabled
                sx={{
                  color: '#666',
                  fontSize: '12px',
                  fontFamily: 'SF Pro Display',
                  '&:hover': { color: '#0284C7' },
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
              }}
              endIcon={<EventIcon />}
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
        {/* Table */}
        <p
          style={{
            fontSize: '0.875rem',
            color: '#4B5563',
            margin: '0',
            fontFamily: 'SF Pro Display',
          }}
        >
          Available Collections:
        </p>
        <div style={{ overflowX: 'auto', borderRadius: '10px' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#fff',
              fontFamily: 'SF Pro Display',
              fontWeight: '700',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#0284C7',
                  color: 'white',
                  fontFamily: 'SF Pro Display',
                }}
              >
                {[
                  'Collection Name',
                  'Available Profile',
                  'Profile Added By',
                  'Last Updated',
                  'Quick Action',
                ].map((text, i) => (
                  <th
                    key={i}
                    style={{
                      padding: '10px',
                      textAlign: 'left',
                      border: '1px solid #ddd',
                    }}
                  >
                    {text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedCollections.length > 0 ? (
                paginatedCollections.map((collection, index) => (
                  <tr
                    key={index}
                    onClick={() => setSelectedRow(index)}
                    style={{
                      backgroundColor:
                        selectedRow === index ? '#bfdbfe' : '#fff',
                      borderBottom: '1px solid #ddd',
                      fontFamily: 'SF Pro Display',
                      fontWeight: '400',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      selectedRow !== index &&
                      (e.currentTarget.style.backgroundColor = '#f1f5f9')
                    }
                    onMouseLeave={(e) =>
                      selectedRow !== index &&
                      (e.currentTarget.style.backgroundColor = '#fff')
                    }
                  >
                    <td
                      style={{
                        padding: '10px',
                        border: '1px solid #ddd',
                        fontFamily: 'SF Pro Display',
                        fontWeight: '400',
                      }}
                    >
                      {collection.name}
                    </td>
                    <td
                      style={{
                        padding: '10px',
                        border: '1px solid #ddd',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      <span
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          display: 'inline-block',
                          fontFamily: 'SF Pro Display',
                          width: '48px',
                          minWidth: '48px',
                          height: '24px',
                          lineHeight: '16px',
                          textAlign: 'center',
                          boxSizing: 'border-box',
                        }}
                      >
                        {collection.profiles}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '10px',
                        border: '1px solid #ddd',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <img
                          src={collection.image}
                          alt={collection.addedBy}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            fontFamily: 'SF Pro Display',
                            fontWeight: 400,
                          }}
                        />
                        {collection.addedBy}
                        {index < 3 && (
                          <span
                            style={{
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              display: 'inline-block',
                              fontFamily: 'SF Pro Display',
                            }}
                          >
                            <span
                              style={{
                                color: '#0284C7',
                                fontFamily: 'SF Pro Display',
                              }}
                            >
                              +{index + 1} more
                            </span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '10px',
                        border: '1px solid #ddd',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      <span
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          display: 'inline-block',
                          fontFamily: 'SF Pro Display',
                        }}
                      >
                        {collection.lastUpdated}
                      </span>
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          backgroundColor: 'transparent',
                          borderColor: '#0284C7',
                          color: '#0284C7',
                          fontFamily: 'SF Pro Display',
                          textTransform: 'none',
                          fontSize: '12px',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderColor: 'black',
                            color: 'black',
                          },
                        }}
                      >
                        View Profiles
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      fontFamily: 'SF Pro Display',
                      color: '#666',
                    }}
                  >
                    No profiles match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination & Button */}
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{
            position: 'fixed',
            bottom: 20,
            left: '0',
            right: '0',
            zIndex: 10,
          }}
        >
          <Grid item>
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              sx={{ textTransform: 'none', fontSize: '12px', color: '#0284C7' }}
            >
              Prev
            </Button>
          </Grid>

          {[...Array(totalPages)].map((_, i) => (
            <Grid item key={i}>
              <Button
                onClick={() => setCurrentPage(i + 1)}
                sx={{
                  minWidth: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  backgroundColor:
                    i + 1 === currentPage ? '#1976d2' : 'transparent',
                  color: i + 1 === currentPage ? 'white' : '#1976d2',
                  fontSize: '12px',
                }}
              >
                {i + 1}
              </Button>
            </Grid>
          ))}

          <Grid item>
            <Typography
              sx={{ fontSize: '12px', color: '#0284C7', padding: '8px' }}
            >
              ...
            </Typography>
          </Grid>

          <Grid item>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              sx={{ textTransform: 'none', fontSize: '12px', color: '#0284C7' }}
            >
              Next
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                fontSize: '12px',
                ml: 2,
                backgroundColor: '#0284C7',
                '&:hover': { backgroundColor: '#0284C7' },
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

export default ProfileCollectionDashboardf
