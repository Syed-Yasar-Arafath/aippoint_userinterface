
import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Radio,
  Select,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Paper,
  IconButton,
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from '@mui/x-date-pickers'
import {
  CalendarIcon,
  Clock,
  SearchIcon,
  Download,
  Mail,
  Phone,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Enhanced candidate type with resume details
export interface Candidate {
  id: number
  created_by: string
  resume_id: string
  name: string
  interviewDate: string
  interview_time: string
  timeSlot: string
  position: string
  email: string
  phone: string
  experience: string
  skills: string[]
  education: string
  avatarUrl?: string
  currentCompany?: string
  currentRole?: string
}

// Interface for filter state
interface FilterState {
  jobRole: string
  experience: string
  startDate: Date | null
  endDate: Date | null
  startTime: Date | null
  endTime: Date | null
}

// Interface for InterviewDto (matches backend)
interface InterviewDto {
  email: string
  candidateName: string
  interview_time: string
  organisation: string
  interviewStatus?: string
  date?: string
  meetingId?: string
  password?: string
  isInterviewLinkEmailSent?: boolean
  isTokenGenerated?: boolean
  warningCount?: number
}

const UpcomingInterview: React.FC = () => {
  // States
  const navigate = useNavigate()
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([])
  const [page, setPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filters, setFilters] = useState<FilterState>({
    jobRole: '',
    experience: '',
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
  })

  // Dialog states
  const [dateRangeOpen, setDateRangeOpen] = useState<boolean>(false)
  const [timeSelectOpen, setTimeSelectOpen] = useState<boolean>(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  )

  // Filtered candidates
  // const [filteredCandidates, setFilteredCandidates] =
  //   useState<Candidate[]>(allCandidates)
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([])


  // Backend API base URL
  const API_BASE_URL = 'http://localhost:8080'

  // Function to schedule interviews and send emails
  const scheduleInterviews = async () => {
    const selectedCandidateDetails = allCandidates.filter((candidate) =>
      selectedCandidates.includes(candidate.id),
    )

    // Hardcode organisation for now (replace with dynamic value if needed)
    const organisation = 'wipro'

    try {
      for (const candidate of selectedCandidateDetails) {
        const interviewDto: InterviewDto = {
          email: candidate.email,
          interview_time: candidate.interview_time,
          candidateName: candidate.name,
          organisation: organisation,
          interviewStatus: 'Scheduled',
          date: new Date(candidate.interviewDate).toISOString(),
          isInterviewLinkEmailSent: false, // Ensure email is triggered
        }

        await axios.post(`${API_BASE_URL}/interview/${organisation}`, interviewDto, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }

      alert(
        `Successfully scheduled ${selectedCandidateDetails.length} interview(s)! Email(s) will be sent soon.`,
      )
      setSelectedCandidates([]) // Clear selection after scheduling
    } catch (error: any) {
      console.error('Error scheduling interviews:', error)
      alert('Failed to schedule interviews: ' + error.message)
    }
  }

  // Apply filters
  const organisation = localStorage.getItem('organisation')
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([])
  const [jobRoles, setJobRoles] = useState<string[]>([])

  const getAvailableresumes = async (user_id: any) => {
    console.log(user_id)
    try {

      const res = await axios.post('http://localhost:8000/get_interview_count_by_user/', { created_by: String(user_id) },
        {
          headers: {
            Organization: organisation,
            'Content-Type': 'application/json'
          }
        }
      )
      if (res.status === 200 && res.data?.interviews) {
        const awaitedInterviews = res.data.interviews.filter(
          (interview: any) => interview.interview_status === 'awaited'
        )

        const formattedCandidates = awaitedInterviews.map(
          (item: any, index: number) => ({
            id: index + 1,
            created_by:item.resume_data?.created_by||'' ,
            resume_id:item.resume_data?.resume_id||'' ,
            name: item.resume_data?.name ?? 'Unknown',
            interviewDate: item.uploaded_at || 'N/A',
            interview_time: item.interview_time || 'N/A',
            timeSlot: '10:00AM - 10:35 AM',
            position: item.resume_data?.job_role ?? 'N/A',
            email: item.resume_data?.email ?? '',
            phone: item.resume_data?.phone ?? '',
            experience: item.resume_data?.experience_in_number
              ? `${item.resume_data.experience_in_number} years`
              : 'N/A',
            skills: item.resume_data?.skills || [],
            education: item.resume_data?.education?.Degree || 'N/A',
            currentCompany: item.resume_data?.work?.[0]?.company ?? '',
            currentRole:
              item.resume_data?.work?.[0]?.designation_at_company ?? '',
          })
        )

        setAllCandidates(formattedCandidates)
        setFilteredCandidates(formattedCandidates)
        const rolesSet: Set<string> = new Set(
          awaitedInterviews
            .map((i: any) => i.resume_data?.job_role)
            .filter((role: string | undefined): role is string => Boolean(role && role.trim()))
        )
        setJobRoles(Array.from(rolesSet))

      }
    } catch (error: any) {
      console.log('error', error)
    }
  }
  const email = localStorage.getItem('email')
  const getUserId = async () => {
    try {
      const res = await axios.get(`http://localhost:8082/user/getuserid/${organisation}/${email}`)
      if (res.status === 200) {
        console.log(res.data.user_id)
        const temp = res.data.user_id
        getAvailableresumes(temp)
      }
    } catch (error: any) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    getUserId()
  }, [])



  useEffect(() => {
    let results = [...allCandidates]

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      results = results.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchLower) ||
          candidate.position.toLowerCase().includes(searchLower) ||
          candidate.skills.some((skill) =>
            skill.toLowerCase().includes(searchLower),
          ),
      )
    }

    // Apply job role filter
    if (filters.jobRole) {
      results = results.filter((candidate) =>
        candidate.position
          .toLowerCase()
          .includes(filters.jobRole.toLowerCase()),
      )
    }

    // Apply experience filter
    if (filters.experience) {
      results = results.filter((candidate) =>
        candidate.experience
          .toLowerCase()
          .includes(filters.experience.toLowerCase()),
      )
    }

    // Apply date range filter
    if (filters.startDate && filters.endDate) {
      results = results.filter((_, index) => index % 2 === 0)
    }

    // Apply time filter
    if (filters.startTime && filters.endTime) {
      results = results.filter((_, index) => index % 3 === 0)
    }

    setFilteredCandidates(results)
  }, [searchTerm, filters])

  // Calculate pagination
  const itemsPerPage = 12
  const pageCount = Math.ceil(filteredCandidates.length / itemsPerPage)
  const displayedCandidates = filteredCandidates.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  )

  // Handlers
  const handleCandidateSelect = (id: number) => {
    if (selectedCandidates.includes(id)) {
      setSelectedCandidates(
        selectedCandidates.filter((candidateId) => candidateId !== id),
      )
    } else {
      setSelectedCandidates([...selectedCandidates, id])
    }
  }

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value)
  }

  const handleFilterChange = (field: keyof FilterState, value: any) => {
    setFilters({
      ...filters,
      [field]: value,
    })
  }

  const handleViewDetails = (candidate: Candidate) => {
    navigate(`/interviewDetails/${candidate.resume_id}`)
  }

  const resetFilters = () => {
    setFilters({
      jobRole: '',
      experience: '',
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
    })
    setSearchTerm('')
  }
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6
  const totalPages = Math.ceil(filteredCandidates.length / pageSize)
  const startIdx = (currentPage - 1) * pageSize
  const endIdx = startIdx + pageSize
  const paginatedCandidate = filteredCandidates.slice(startIdx, endIdx)


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container style={{ paddingTop: '20px' }}>
        {/* Search and Filter Section */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <TextField
              placeholder="Search..."
              size="small"
              fullWidth
              value={searchTerm}
              autoComplete="off"
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl size="small" fullWidth>
              <Select
                displayEmpty
                value={filters.jobRole}
                onChange={(e) => handleFilterChange('jobRole', e.target.value)}
                renderValue={
                  filters.jobRole !== '' ? undefined : () => 'Job Role'
                }
              >
                {/* <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="full-stack">Full-Stack Developer</MenuItem>
                <MenuItem value="frontend">Frontend Developer</MenuItem>
                <MenuItem value="backend">Backend Developer</MenuItem>
                <MenuItem value="ui/ux">UI/UX Developer</MenuItem> */}
                <MenuItem value="">All Roles</MenuItem>
                {jobRoles.map((role, index) => (
                  <MenuItem key={index} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <FormControl size="small" fullWidth>
              <Select
                displayEmpty
                value={filters.experience}
                onChange={(e) =>
                  handleFilterChange('experience', e.target.value)
                }
                renderValue={
                  filters.experience !== '' ? undefined : () => 'Experience'
                }
              >
                <MenuItem value="">All Experience</MenuItem>
                <MenuItem value="1 year">1 Year</MenuItem>
                <MenuItem value="2-3">2-3 Years</MenuItem>
                <MenuItem value="5+">5+ Years</MenuItem>
                <MenuItem value="fresh">Fresh Graduate</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2}>
            <Button
              variant="outlined"
              color="inherit"
              style={{textTransform:'none'}}
              fullWidth
              startIcon={<CalendarIcon size={20} />}
              onClick={() => setDateRangeOpen(true)}
            >
              Date Range
            </Button>
          </Grid>

          <Grid item xs={6} md={2}>
            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              style={{textTransform:'none'}}
              startIcon={<Clock size={20} />}
              onClick={() => setTimeSelectOpen(true)}
            >
              Select Time
            </Button>
          </Grid>

          <Grid item xs={6} md={1} sx={{display:'flex',gap:'10px'}} >
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={resetFilters}
            >
              Reset
            </Button>
            <Grid
            item
            xs={6}
            md={12}
            // sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={selectedCandidates.length === 0}
              onClick={scheduleInterviews}
            >
              Schedule{' '}
              {selectedCandidates.length > 0
                ? `(${selectedCandidates.length})`
                : ''}
            </Button>
          </Grid>
          </Grid>

          
        </Grid>

        {/* Active Filters Display */}
        {/* {(filters.jobRole ||
          filters.experience ||
          filters.startDate ||
          filters.startTime) && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ mr: 1, pt: 0.5 }}>
                Active Filters:
              </Typography>

              {filters.jobRole && (
                <Chip
                  label={`Job: ${filters.jobRole}`}
                  size="small"
                  onDelete={() => handleFilterChange('jobRole', '')}
                />
              )}

              {filters.experience && (
                <Chip
                  label={`Experience: ${filters.experience}`}
                  size="small"
                  onDelete={() => handleFilterChange('experience', '')}
                />
              )}

              {filters.startDate && filters.endDate && (
                <Chip
                  label={`Date: ${filters.startDate.toLocaleDateString()} - ${filters.endDate.toLocaleDateString()}`}
                  size="small"
                  onDelete={() => {
                    handleFilterChange('startDate', null)
                    handleFilterChange('endDate', null)
                  }}
                />
              )}

              {filters.startTime && filters.endTime && (
                <Chip
                  label={`Time: ${filters.startTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} - ${filters.endTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`}
                  size="small"
                  onDelete={() => {
                    handleFilterChange('startTime', null)
                    handleFilterChange('endTime', null)
                  }}
                />
              )}
            </Box>
          )} */}

        <Typography sx={{ mb: 2 }}>
          Upcoming Interviews:
          {/* {filteredCandidates.length > 0 && (
            <span style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>
              {' '}
              ({filteredCandidates.length} candidates)
            </span>
          )} */}
        </Typography>
        {filters.jobRole && (

          <div style={{display:'flex'}}><Typography sx={{ mb: 2 }}>
            Available profiles for
            <Chip
              label={`${filters.jobRole}`}
              size="small"
              variant='filled'
              sx={{
                backgroundColor: 'transparent',
                color: '#0284C7'
              }}
            // onDelete={() => handleFilterChange('jobRole', '')}
            />: {filteredCandidates.length}</Typography>
          </div>
        )}


        {/* Candidates Grid */}
        {displayedCandidates.length > 0 ? (
          <Grid container spacing={2}>
            {paginatedCandidate.map((candidate) => (
              <Grid item xs={12} sm={6} md={4} key={candidate.id}>
                <Card
                  sx={{
                    boxShadow: 1,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 },
                  }}
                >
                  <CardContent>
                    <Radio
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={() => handleCandidateSelect(candidate.id)}
                      size="small"
                      style={{ float: 'right' }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: '#e0e0e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                          alt={candidate.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                      <Box sx={{ ml: 1, flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 500 }}
                        >
                          {candidate.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {/* {candidate.interviewDate} • {candidate.timeSlot} */}
                          {candidate.interview_time}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ pl: 7, mt: 1 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          mt: 1,
                          background: '#1C1C1E1A',
                          borderRadius: '6px',
                          color: '#1C1C1E',
                          textTransform: 'none',
                          fontFamily: 'SF Pro Display',
                          fontSize: '10px',
                          fontWeight: 500,
                        }}
                      >
                        <div
                          style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: '#ff9800',
                            position: 'absolute',
                            left: '8px',
                          }}
                        />
                        {candidate.position}
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleViewDetails(candidate)}
                        sx={{
                          mt: 1,
                          background: '#0284C726',
                          borderRadius: '6px',
                          color: '#0284C7',
                          textTransform: 'none',
                          fontFamily: 'SF Pro Display',
                          fontSize: '10px',
                          fontWeight: 500,
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No candidates match your filters. Try adjusting your search
              criteria.
            </Typography>
            <Button onClick={resetFilters} sx={{ mt: 2 }}>
              Reset Filters
            </Button>
          </Paper>
        )}

        {/* Pagination */}
        {/* {pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )} */}
        <Grid container justifyContent="center" spacing={1} mt={2}>
          <Grid item>
            <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} sx={{ textTransform: 'none', fontSize: '12px' }}>
              Prev
            </Button>
          </Grid>
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
            <Grid item key={n}>
              <Button
                onClick={() => setCurrentPage(n)}
                sx={{
                  minWidth: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  backgroundColor: n === currentPage ? '#1976d2' : 'transparent',
                  color: n === currentPage ? 'white' : '#1976d2',
                  fontSize: '12px',
                }}
              >
                {n}
              </Button>
            </Grid>
          ))}
          <Grid item>
            <Typography sx={{ fontSize: '12px', color: '#666', padding: '8px' }}>...</Typography>
          </Grid>
          <Grid item>
            <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} sx={{ textTransform: 'none', fontSize: '12px' }}>
              Next
            </Button>
          </Grid>
        </Grid>

        {/* Date Range Dialog */}
        <Dialog open={dateRangeOpen} onClose={() => setDateRangeOpen(false)}>
          <DialogTitle>Select Date Range</DialogTitle>
          <DialogContent sx={{ width: '300px' }}>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
            >
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(date) => handleFilterChange('startDate', date)}
              />
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(date) => handleFilterChange('endDate', date)}
                minDate={filters.startDate || undefined}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDateRangeOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => setDateRangeOpen(false)}
              disabled={!filters.startDate || !filters.endDate}
            >
              Apply
            </Button>
          </DialogActions>
        </Dialog>

        {/* Time Selection Dialog */}
        <Dialog open={timeSelectOpen} onClose={() => setTimeSelectOpen(false)}>
          <DialogTitle>Select Time Range</DialogTitle>
          <DialogContent sx={{ width: '300px' }}>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
            >
              <TimePicker
                label="Start Time"
                value={filters.startTime}
                onChange={(time) => handleFilterChange('startTime', time)}
              />
              <TimePicker
                label="End Time"
                value={filters.endTime}
                onChange={(time) => handleFilterChange('endTime', time)}
                minTime={filters.startTime || undefined}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTimeSelectOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => setTimeSelectOpen(false)}
              disabled={!filters.startTime || !filters.endTime}
            >
              Apply
            </Button>
          </DialogActions>
        </Dialog>

        {/* Candidate Details Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          {selectedCandidate && (
            <>
              <DialogTitle
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6">Candidate Details</Typography>
                <IconButton onClick={() => setDetailDialogOpen(false)}>
                  <X size={20} />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                      alt={selectedCandidate.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h6">
                      {selectedCandidate.name}
                    </Typography>
                    <Typography variant="body1" color="primary">
                      {selectedCandidate.position}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Mail size={16} style={{ marginRight: 8 }} />
                      <Typography variant="body2">
                        {selectedCandidate.email}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Phone size={16} style={{ marginRight: 8 }} />
                      <Typography variant="body2">
                        {selectedCandidate.phone}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    Interview Schedule
                  </Typography>
                  <Typography variant="body2">
                    {selectedCandidate.interviewDate} •{' '}
                    {selectedCandidate.timeSlot}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Experience</Typography>
                  <Typography variant="body2">
                    {selectedCandidate.experience}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Education</Typography>
                  <Typography variant="body2">
                    {selectedCandidate.education}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Skills</Typography>
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}
                  >
                    {selectedCandidate.skills.map((skill, idx) => (
                      <Chip key={idx} label={skill} size="small" />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Download size={16} />}
                    fullWidth
                  >
                    Download Resume
                  </Button>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetailDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleCandidateSelect(selectedCandidate.id)
                    setDetailDialogOpen(false)
                  }}
                >
                  {selectedCandidates.includes(selectedCandidate.id)
                    ? 'Unselect Candidate'
                    : 'Select for Interview'}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </LocalizationProvider>
  )
}

export default UpcomingInterview
