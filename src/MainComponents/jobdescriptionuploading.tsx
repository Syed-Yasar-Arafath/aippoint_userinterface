import React, { useState, useEffect } from 'react'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  Snackbar,
  IconButton,
} from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs, { Dayjs } from 'dayjs'
import Autocomplete from '@mui/material/Autocomplete'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

// Type definition for states
type State = {
  name: string
  iso2: string
  cities: string[]
}

type States = {
  [key: string]: State[]
}

// Countries with flags
const countries = [
  {
    name: 'India',
    iso2: 'IN',
    flag: 'https://flagcdn.com/w40/in.png',
  },
  {
    name: 'USA',
    iso2: 'US',
    flag: 'https://flagcdn.com/w40/us.png',
  },
]

const states: States = {
  IN: [
    { name: 'Karnataka', iso2: 'KA', cities: ['Bengaluru', 'Mysore'] },
    { name: 'Maharashtra', iso2: 'MH', cities: ['Mumbai', 'Pune'] },
  ],
  US: [
    {
      name: 'California',
      iso2: 'CA',
      cities: ['San Francisco', 'Los Angeles'],
    },
    { name: 'Texas', iso2: 'TX', cities: ['Dallas', 'Austin'] },
  ],
}

// Alert component for Snackbar
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const JobDescriptionUpload: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([])
  const [openPositions, setOpenPositions] = useState<number>(0)
  const [openDate, setOpenDate] = useState<Dayjs | null>(dayjs('2025-03-18'))
  const [closureDate, setClosureDate] = useState<Dayjs | null>(
    dayjs('2025-03-28'),
  )

  const [selectedCountry, setSelectedCountry] = useState<any>(null)
  const [selectedState, setSelectedState] = useState<any>(null)
  const [selectedCity, setSelectedCity] = useState<any>(null)
  const [availableStates, setAvailableStates] = useState<any[]>([])
  const [availableCities, setAvailableCities] = useState<any[]>([])

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const [uploadedFileName, setUploadedFileName] = useState<string>('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'warning'
  >('warning')

  const [loading, setLoading] = useState(true) // Add loading state

  // Simulate loading on page refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000) // 2-second delay to simulate loading
    return () => clearTimeout(timer)
  }, [])

  const handleSkillAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value.trim()
      if (value && !skills.includes(value)) {
        setSkills([...skills, value])
        ;(e.target as HTMLInputElement).value = ''
      }
    }
  }

  const handleSkillDelete = (skillToDelete: string) => {
    setSkills(skills.filter((skill) => skill !== skillToDelete))
  }

  const handleCountryChange = (newValue: any) => {
    setSelectedCountry(newValue)
    const countryStates = states[newValue?.iso2 as keyof States] || []
    setAvailableStates(countryStates)
    setSelectedState(null)
    setSelectedCity(null)
  }

  const handleStateChange = (newValue: any) => {
    setSelectedState(newValue)
    setAvailableCities(newValue?.cities || [])
    setSelectedCity(null)
  }

  const validateForm = () => {
    if (
      skills.length === 0 ||
      !selectedCountry ||
      !selectedState ||
      !selectedCity ||
      !openDate ||
      !closureDate
    ) {
      setSnackbarMessage('Please fill in all required fields')
      setSnackbarSeverity('warning')
      setSnackbarOpen(true)
      return false
    }
    return true
  }

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <Box p={4} borderRadius={3} boxShadow={2} bgcolor="white">
      <Stack spacing={2}>
        {/* Title and Description Skeletons */}
        <Skeleton variant="text" sx={{ fontSize: '18px', width: '50%' }} />
        <Skeleton variant="text" sx={{ fontSize: '10px', width: '30%' }} />

        {/* Form Fields Skeletons */}
        <Grid container spacing={3}>
          {/* Job Category, Job Role, Job Type, Mode of Work */}
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={56} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={56} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={56} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={56} />
          </Grid>

          {/* Skills and Experience */}
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={56} />
            <Box mt={1}>
              <Skeleton variant="rectangular" height={30} width="30%" />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={56} />
          </Grid>

          {/* Open Positions and Dates */}
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={56} />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            display="flex"
            justifyContent="space-between"
          >
            <Skeleton variant="rectangular" height={56} width="48%" />
            <Skeleton variant="rectangular" height={56} width="48%" />
          </Grid>

          {/* Country, State, City */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
            </Grid>
          </Grid>

          {/* Domain Skills, Description */}
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={80} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={100} />
          </Grid>

          {/* Additional Info and Upload Section */}
          <Grid item xs={5.8}>
            <Skeleton variant="rectangular" height={56} />
          </Grid>
          <Grid item xs={5.8}>
            <Box display="flex" alignItems="flex-start" flexWrap="nowrap">
              <Skeleton
                variant="rectangular"
                width={48}
                height={48}
                sx={{ borderRadius: 2 }}
              />
              <Box display="flex" flexDirection="column" ml={2} flex={1}>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: '14px', width: '60%' }}
                />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: '14px', width: '40%' }}
                />
              </Box>
              <Box sx={{ ml: 10, mt: 1.2 }}>
                <Skeleton variant="rectangular" width={80} height={32} />
              </Box>
            </Box>
          </Grid>

          {/* Buttons */}
          <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
            <Skeleton variant="rectangular" width={100} height={40} />
            <Skeleton variant="rectangular" width={100} height={40} />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  )

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <>
          <Box p={4} borderRadius={3} boxShadow={2} bgcolor="white">
            <Typography
              sx={{
                fontFamily: 'SF Pro Display, sans-serif',
                fontWeight: 500,
                fontSize: '18px',
              }}
            >
              Enter the below fields to create Job Description
            </Typography>
            <p
              style={{
                fontSize: '10px',
                fontWeight: '400',
                color: 'gray',
                fontFamily: 'SF Pro Display',
              }}
            >
              Define role requirements, responsibilities, and qualifications
            </p>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Job Category</InputLabel>
                  <Select label="Job Category" defaultValue=" ">
                    <MenuItem value="Software Engineer">
                      Software Engineer
                    </MenuItem>
                    <MenuItem value="Data Scientist">Data Scientist</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Job Role</InputLabel>
                  <Select label="Job Role" defaultValue=" ">
                    <MenuItem value="Full-Stack Developer">
                      Full-Stack Developer
                    </MenuItem>
                    <MenuItem value="Frontend Developer">
                      Frontend Developer
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Job Type</InputLabel>
                  <Select label="Job Type" defaultValue=" ">
                    <MenuItem value="Full-Time">Full-Time</MenuItem>
                    <MenuItem value="Part-Time">Part-Time</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Mode of Work</InputLabel>
                  <Select label="Mode of Work" defaultValue=" ">
                    <MenuItem value="Onsite">Onsite</MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Type Skill here..."
                  onKeyDown={handleSkillAdd}
                />
                <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                  {skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={() => handleSkillDelete(skill)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Experience Required</InputLabel>
                  <Select label="Experience Required" defaultValue=" ">
                    <MenuItem value="0-1 Years">0-1 Years</MenuItem>
                    <MenuItem value="1-3 Years">1-3 Years</MenuItem>
                    <MenuItem value="3-4 Years">3-4 Years</MenuItem>
                    <MenuItem value="5+ Years">5+ Years</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="No. of Open Positions"
                  type="number"
                  value={openPositions}
                  onChange={(e) => setOpenPositions(Number(e.target.value))}
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
                display="flex"
                justifyContent="space-between"
              >
                <DatePicker
                  label="Date of Open Position"
                  value={openDate}
                  onChange={(newValue) => setOpenDate(newValue)}
                  sx={{
                    width: '48%',
                    '& .MuiInputBase-root': { height: '56px' },
                  }}
                />
                <DatePicker
                  label="Expected Date of Closure"
                  value={closureDate}
                  onChange={(newValue) => setClosureDate(newValue)}
                  sx={{
                    width: '48%',
                    '& .MuiInputBase-root': { height: '56px' },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      options={countries}
                      getOptionLabel={(option) => option.name}
                      value={selectedCountry}
                      onChange={(event, newValue) =>
                        handleCountryChange(newValue)
                      }
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          display="flex"
                          alignItems="center"
                        >
                          <img
                            loading="lazy"
                            width="20"
                            src={option.flag}
                            alt=""
                            style={{ marginRight: 10 }}
                          />
                          {option.name}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Country"
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: selectedCountry ? (
                              <img
                                loading="lazy"
                                width="20"
                                src={selectedCountry.flag}
                                alt=""
                                style={{ marginRight: 10 }}
                              />
                            ) : null,
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      options={availableStates}
                      getOptionLabel={(option) => option.name}
                      value={selectedState}
                      onChange={(event, newValue) =>
                        handleStateChange(newValue)
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Select State" fullWidth />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      options={availableCities}
                      getOptionLabel={(option) => option}
                      value={selectedCity}
                      onChange={(event, newValue) => setSelectedCity(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} label="Select City" fullWidth />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="Domain Skills"
                  placeholder="Please enter the Domain Skills..."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Description"
                  placeholder="Detailed Job Description Comes Here..."
                />
              </Grid>

              <Grid item xs={5.8}>
                <TextField
                  fullWidth
                  label="Additional Info"
                  placeholder="If you want to add any additional information you can add..."
                />
              </Grid>
              {/* Upload Section */}
              <Grid item xs={5.8}>
                <Box display="flex" alignItems="flex-start" flexWrap="nowrap">
                  <input
                    accept="*"
                    style={{ display: 'none' }}
                    id="upload-button-file"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const fileName = e.target.files[0].name
                        setUploadedFileName(fileName)
                        setSnackbarMessage(`Uploaded: ${fileName}`)
                        setSnackbarSeverity('success')
                        setSnackbarOpen(true)
                      }
                    }}
                  />
                  <label htmlFor="upload-button-file">
                    <IconButton
                      color="primary"
                      component="span"
                      sx={{
                        border: '1px dashed #ccc',
                        p: 1,
                        borderRadius: 2,
                      }}
                    >
                      <UploadFileIcon fontSize="large" />
                    </IconButton>
                  </label>

                  {/* Text Block */}
                  <Box display="flex" flexDirection="column" ml={2}>
                    <Typography variant="body2" color="text.secondary">
                      Click the icon to upload JD (PDF, DOC, etc.)
                    </Typography>
                    {uploadedFileName && (
                      <Typography variant="body2" color="text.primary">
                        Selected File: {uploadedFileName}
                      </Typography>
                    )}
                  </Box>

                  {/* Replace Button Block with horizontal and vertical spacing */}
                  {uploadedFileName && (
                    <Box
                      sx={{
                        ml: 10, // horizontal gap
                        mt: 1.2, // slight vertical alignment
                      }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          const fileInput = document.getElementById(
                            'upload-button-file',
                          ) as HTMLInputElement
                          fileInput?.click()
                        }}
                      >
                        Replace
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="flex-end"
                gap={2}
              >
                <Button variant="outlined" color="inherit">
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (validateForm()) {
                      console.log('All fields are valid. Proceed to next step.')
                    }
                  }}
                >
                  Continue
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              severity={snackbarSeverity}
              onClose={() => setSnackbarOpen(false)}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </LocalizationProvider>
  )
}

export default JobDescriptionUpload
