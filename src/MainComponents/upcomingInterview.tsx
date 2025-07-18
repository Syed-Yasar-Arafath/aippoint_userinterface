
import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  Avatar,
  SelectChangeEvent,
  useTheme,
} from '@mui/material'
import {
  LocalizationProvider,
  DatePicker,
} from '@mui/x-date-pickers'
import { SearchIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../CommonComponents/topheader'
import { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';

const UpcomingInterview: React.FC = () => {

  const [userId, setUserId] = useState('')
  const [awaitedInterview, setAwaitedInterview] = useState([]);
  const [awaitedInterviewData, setAwaitedInterviewData] = useState<any[]>([])

  const organisation = localStorage.getItem('organisation')
  const email = localStorage.getItem('email')

  const getUserId = async () => {
    try {
      const res = await axios.get(`http://localhost:8082/user/getuserid/${organisation}/${email}`)

      setUserId(res.data.user_id)

    } catch (error: any) {
      console.log('error', error)
    }
  }

  const fetchAllInterviewData = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8000/get_all_interview_data`,
        {
          headers: {
            "Content-Type": "application/json",
            Organization: organisation
          }
        }
      );

      const allData = Array.isArray(result.data.data)
        ? result.data.data
        : result.data;

      const filtered = allData.filter((item: any) =>
        item.resume_data?.created_by?.toString().trim() === userId.toString().trim() &&
        item.interview_status?.toLowerCase() === "awaited"
      );

      setAwaitedInterview(filtered);
      setAwaitedInterviewData(filtered)

    } catch (error: any) {
      console.error("Error fetching interview data:", error);
    }
  };

  useEffect(() => {
    getUserId()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchAllInterviewData();
    }
  }, [userId]);

  const navigate = useNavigate()

  const handleViewDetails = (id: any) => {
    navigate(`/interviewDetails/${id}`)
  }

  const handleResetFilters = () => {
    setSelectedJobRole('');
    setSelectedExperience('');
    setSelectedDate(null);
    setSearchCandidate('');
    setAwaitedInterviewData(awaitedInterview);
    setPage(0);
  };

  const jobRole = ['Java Developer', 'Python Developer', 'React Developer', 'Full Stack Developer']

  const [selectedJobRole, setSelectedJobRole] = useState('');

  const handleJobRole = (event: SelectChangeEvent) => {
    console.log('Job Role:', event.target.value)
    setSelectedJobRole(event.target.value);
  };

  const experience = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']

  const [selectedExperience, setSelectedExperience] = useState('');

  const handleExperience = (event: SelectChangeEvent) => {
    console.log('Experience:', event.target.value)
    setSelectedExperience(event.target.value);
  };

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null); //dayjs()
  const formattedDate = selectedDate?.format('DD-MM-YYYY');
  console.log(formattedDate);

  const filteredData = awaitedInterviewData.filter((item) => {

    const matchesJobRole =
      !selectedJobRole || item.resume_data?.job_role?.toLowerCase() === selectedJobRole.toLowerCase();

    const matchesExperience =
      !selectedExperience || item.resume_data?.experience_in_number?.toString() === selectedExperience;

    const matchesInterviewDate =
      !formattedDate || item.uploaded_at?.split(', ')[1] === formattedDate;

    return matchesJobRole && matchesExperience && matchesInterviewDate;
  });

  const [searchCandidate, setSearchCandidate] = useState('');

  const handleSearch = (value: string) => {
    if (value.trim() === '') {
      setAwaitedInterviewData(awaitedInterview);
      setPage(0);
    } else {
      const filteredData = awaitedInterview.filter((item: any) =>
        (item.resume_data?.name?.toLowerCase() || '').includes(value.toLowerCase()) ||
        (item.resume_data?.email?.toLowerCase() || '').includes(value.toLowerCase()) ||
        (item.resume_data?.job_role?.toLowerCase() || '').includes(value.toLowerCase()) ||
        (item.resume_data?.experience_in_number?.toString() || '').includes(value)
      );
      setAwaitedInterviewData(filteredData);
      setPage(0);
    }
  };


  const [page, setPage] = useState(0)

  const fixedRowsPerPage = 6

  const handleBackButtonClick = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const handleNextButtonClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const theme = useTheme()

  return (
    <>
      <Header
        title="Upcoming Interview"
        path=""
      />

      {awaitedInterview ? (
        <Grid container spacing={0} padding={1}>
          <Grid
            container
            padding={1}
            border='1px solid #1C1C1E40'
            borderRadius='8px'
            alignItems="center"
            justifyContent='space-between'
          >
            <Grid item xs={12} sm={12} md={3}>
              <TextField
                placeholder="Search.."
                variant="outlined"
                size="small"
                fullWidth
                value={searchCandidate}
                onChange={(e) => {
                  setSearchCandidate(e.target.value)
                  handleSearch(e.target.value)
                }
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon
                        // onClick={handleSearch}
                        style={{
                          color: '#FFFFFF',
                          background: '#0284C7',
                          borderRadius: '6px',
                          padding: '5px',
                          // cursor: 'pointer',
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <Select
                  value={selectedJobRole}
                  onChange={handleJobRole}
                  displayEmpty
                  renderValue={(selected) =>
                    selected === '' ? (
                      <span style={{
                        color: '#888',
                        fontSize: '10px',
                        fontWeight: 500,
                        fontFamily: 'SF Pro Display',
                      }}>Select Job Role</span>
                    ) : (
                      selected
                    )
                  }
                  sx={{
                    '& fieldset': { border: 'none' },
                    backgroundColor: 'transparent',
                    height: '36px',
                    fontSize: '10px',
                    fontFamily: 'SF Pro Display',
                  }}
                >
                  {jobRole.map((role, index) => (
                    <MenuItem
                      key={index}
                      value={role}
                      sx={{ fontFamily: 'SF Pro Display' }}
                      onClick={() => {
                        // setIsSelected(true)
                        setPage(0)
                      }}
                    >
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item display={{ xs: 'none', md: 'block' }}>
              <Box sx={{ height: '36px', width: '1px', backgroundColor: '#1C1C1E' }} />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <Select
                  value={selectedExperience}
                  onChange={handleExperience}
                  displayEmpty
                  renderValue={(selected) =>
                    selected === '' ? (
                      <span style={{
                        color: '#888',
                        fontSize: '10px',
                        fontWeight: 500,
                        fontFamily: 'SF Pro Display',
                      }}>Select Interview Status</span>
                    ) : (
                      selected
                    )
                  }
                  sx={{
                    '& fieldset': { border: 'none' },
                    backgroundColor: 'transparent',
                    height: '36px',
                    fontSize: '10px',
                    fontFamily: 'SF Pro Display',
                  }}
                >
                  {experience.map((exp, index) => (
                    <MenuItem
                      key={index}
                      value={exp}
                      sx={{ fontFamily: 'SF Pro Display' }}
                      onClick={() => {
                        // setIsSelected(true)
                        setPage(0)
                      }}
                    >
                      {exp}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item display={{ xs: 'none', md: 'block' }}>
              <Box sx={{ height: '36px', width: '1px', backgroundColor: '#1C1C1E' }} />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={selectedDate}
                    format="DD/MM/YYYY"
                    // onChange={(newValue) => {
                    onChange={(newValue: Dayjs | null) => {
                      setSelectedDate(newValue)
                      // setIsSelected(true)
                    }
                    }
                    slotProps={{
                      textField: {
                        variant: 'standard',
                        placeholder: 'Date Range',
                        InputProps: {
                          disableUnderline: true,
                          sx: {
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: '#1C1C1E',
                            fontSize: '10px',
                            fontWeight: 500,
                            fontFamily: 'SF Pro Display',
                            '& .MuiInputAdornment-root': {
                              marginLeft: { xl: '-50%', lg: '-50%' } // adjust icon spacing
                            }
                          },
                        },
                      } as any,
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Grid>

            <Grid item display={{ xs: 'none', md: 'block' }}>
              <Box sx={{ height: '36px', width: '1px', backgroundColor: '#1C1C1E' }} />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  sx={{
                    textTransform: 'none',
                    border: '0.5px solid #0284C780',
                    borderRadius: '6px',
                    color: '#1C1C1E',
                    fontSize: '10px',
                    fontWeight: 500,
                    fontFamily: 'SF Pro Display',
                  }}
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
                <Button
                  sx={{
                    textTransform: 'none',
                    background: '#0284C7',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 500,
                    fontFamily: 'SF Pro Display',
                    '&:hover': {
                      background: '#0284C7',
                    },
                  }}
                  onClick={() => navigate('/interviewSchedule')}
                >
                  Schedule Interview
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={12} mt={1}>
            <Typography
              variant="inherit"
              sx={{
                fontSize: '12px',
                fontFamily: 'SF Pro Display',
                fontWeight: 500,
                color: '#1C1C1E',
              }}>
              Upcoming Interviews for {' '}
              <span style={{
                fontWeight: 700,
                color: '#0284C7'
              }}>
                {selectedJobRole} : {selectedJobRole === '' ? '' : filteredData.length}
              </span>
            </Typography>
          </Grid>

          <Grid container spacing={0} height="400px">
            {filteredData.slice(
              page * fixedRowsPerPage,
              page * fixedRowsPerPage + fixedRowsPerPage,
            )
              .map((profile: any, index: number) => (
                <Grid item xs={12} sm={6} md={4} key={index} p={1}>
                  <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Avatar
                          alt={profile.resume_data?.name}
                          src={profile.profile_picture || ''}
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#0284C7',
                            fontSize: '14px',
                            fontWeight: 700,
                          }}
                        >
                          {!profile.profile_picture &&
                            (profile.resume_data?.name || '')
                              .split(' ')
                              .map((word: string) => word[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()}
                        </Avatar>
                        <Box ml={1}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {profile.resume_data?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {profile.uploaded_at}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-start"
                        bgcolor="#f0f0f0"
                        borderRadius={2}
                        py={0.5}
                        px={1.5}
                        mb={2}
                      >
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: 'orange',
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2" fontWeight={500}>
                          {profile.resume_data?.job_role || 'Job Role Not Available'}
                        </Typography>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          backgroundColor: '#e3f2fd',
                          color: '#007BFF',
                          fontWeight: 600,
                          borderRadius: 2,
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: '#d0e6f9',
                          },
                        }}
                        onClick={() => handleViewDetails(profile._id)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>

          <Grid item xs={12} sm={12} md={12} display='flex' justifyContent='center'>
            <Box display="flex" justifyContent="center" mt={2}>
              <Box sx={{ flexShrink: 0 }}>
                <IconButton
                  onClick={handleBackButtonClick}
                  disabled={page === 0}
                  aria-label="previous page"
                  sx={{
                    fontSize: '16px',
                    color: '#1C1C1E',
                    '&:hover': {
                      background: 'inherit',
                    },
                  }}
                >
                  {theme.direction === 'rtl' ? <EastIcon /> : <WestIcon />}
                </IconButton>
                {[
                  ...Array(Math.ceil(filteredData.length / fixedRowsPerPage)).keys(),
                ].map((pageNumber) => {
                  const startPage = Math.max(0, page - 1)
                  const endPage = Math.min(
                    Math.ceil(filteredData.length / fixedRowsPerPage) - 1,
                    startPage + 2,
                  )

                  if (pageNumber >= startPage && pageNumber <= endPage) {
                    return (
                      <span
                        key={pageNumber}
                        style={{
                          alignSelf: 'center',
                          margin: '0 8px',
                          color: page === pageNumber ? '#0284C7' : '#1C1C1E',
                          // border: '1px solid #0284C7',
                          fontSize: '16px',
                          // padding: '5px 10px',
                          // background:
                          //     page === pageNumber ? '#0284C7' : 'inherit',
                        }}
                        onClick={() => setPage(pageNumber)}
                      >
                        {pageNumber + 1}
                      </span>
                    )
                  }
                  return null
                })}
                <IconButton
                  onClick={handleNextButtonClick}
                  disabled={
                    page >= Math.ceil(filteredData.length / fixedRowsPerPage) - 1
                  }
                  aria-label="next page"
                  sx={{
                    fontSize: '16px',
                    color: '#1C1C1E',
                    '&:hover': {
                      background: 'inherit',
                    },
                  }}
                >
                  {theme.direction === 'rtl' ? <WestIcon /> : <EastIcon />}
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      ) : ('')}
    </>
  )
}

export default UpcomingInterview