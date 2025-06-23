import React, { useState, useRef, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { useDispatch, useSelector } from 'react-redux'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Paper,
  TextField,
  Chip,
} from '@mui/material'
// import { getAllResume, getResumeById } from '../../services/ResumeService'
// import { getUserDetails } from '../../services/UserService'
// import { putResume } from '../../services/JobService'
// import Header from '../../components/topheader'
// import { t } from 'i18next'
// import i18n from '../../i18n'
import { makeStyles } from '@mui/styles'
import { Search } from 'lucide-react'
import { loaderOff, loaderOn, openSnackbar } from '../redux/actions'
import { useTranslation } from 'react-i18next'
import { putResume } from '../services/JobService'
import { getAllResume } from '../services/ResumeService'
import Header from '../CommonComponents/topheader'
import { getUserDetails } from '../services/UserService'

const useStyles = makeStyles({
  autocomplete: {
    // width: 100, // Set your desired fixed width here
  },
  inputRoot: {
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      // Prevent the first child (the input field) from affecting height
      minHeight: 'auto',
    },
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-tag': {
      // Set the height and margins for the tags
      margin: '2px',
      height: 'auto',
    },
  },
})

// Assuming putResume and dispatch are imported or available in scope
// import { putResume, loaderOn, loaderOff, openSnackbar } from '../../services' // Adjust import path as needed

// Updated saveJdCollectionName function

interface Collection {
  collection_name: string
  collection_id: number
}

interface Job {
  type: 'job'
  jobid: number
  job_title: string
  skills: string
  experience_required: string
  location: string
  resume_data: any
}

interface Collection {
  type: 'collection'
  collection_id: number
  collection_name: string
  resume_data: any
}
type Profile = {
  id: any
  resume_data: {
    id: any
    skills: any
    experiance_in_number: any
    name: any
    Resume_Category: any
    work: any
    phone: any
    location: any
    pdf_data: any
  }
  score: any
}

const ResumeList = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<any[]>([])
  const [profile, setProfile] = React.useState<Profile[]>([])
  const [profileLength, setProfileLength] = useState<number>(0)
  const [selectedExperience, setSelectedExperience] = useState<string | null>(
    null,
  ) // const [selectedSkill, setSelectedSkill] = useState<string>('')
  const [selectedLoc, setSelectedLoc] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [value, setValue] = useState<any[]>([])
  const [collectionNames, setCollectionNames] = useState<Collection[]>([])
  const [userId, setUserId] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [collection, setCollection] = useState<string | number>('')
  const [resumes, setResumes] = useState<any[]>([])
  const [resumeId, setResumeId] = useState<any[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const organisation = localStorage.getItem('organisation')
  const searchRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState<any | null>('')
  const [inputExpValue, setInputExpValue] = useState<string>('')
  const [inputLocValue, setInputLocValue] = useState<string>('')
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const saveJdCollectionName = async (
    collectionName: string,
    resumeIds: any[],
    jobId: string,
    organisation: string,
  ) => {
    const resumedata = resumeIds.map((id) => ({ id, status: 'accepted' }))
    const Jobdata = {
      resume_data: resumedata,
    }
    dispatch(loaderOn())
    try {
      const res = await putResume(jobId, Jobdata, organisation)
      dispatch(
        openSnackbar(
          `${t('storedResume')} ${resumeIds.length} ${t(
            'resumesIn',
          )} ${collectionName} ${t('jdCollectionBtn')}`,
          'green',
        ),
      )
      dispatch(loaderOff())
    } catch (error) {
      console.error('Error storing resumes:', error)
      dispatch(loaderOff())
      throw error
    }
  }

  const handleSkillChange = async () => {
    dispatch(loaderOn())
    try {
      const searchText: string | undefined = searchRef.current?.value
      const selectedExpValue: any | undefined = selectedExperience
      const selectedSkillValue: any | undefined = selectedSkill
      const selectedLocValue: any | undefined = selectedLoc
      const jsonData: {
        skills?: any
        exp?: any
        designation?: any
        location?: any
        name?: any
      } = {}
      if (searchText) {
        jsonData.designation = searchText
      }

      if (value.length > 0) {
        jsonData.skills = value
      }
      if (selectedExpValue) {
        jsonData.exp = selectedExpValue
      }
      if (selectedLocValue) {
        jsonData.location = selectedLocValue
      }
      dispatch(loaderOn())
      const response = await getAllResume(jsonData)
      if (response) {
        setProfile(response)
        setProfileLength(response.length)
      }
      dispatch(loaderOff())

      dispatch(loaderOff())
    } catch (error) {
      console.error('Request error:', error)
    }
  }
  // const fetchResumes = async () => {
  //   if (!resumeId) {
  //     console.warn('No resume IDs provided for fetchResumes')
  //     setResumes([])
  //     return
  //   }
  //   try {
  //     const requestData = { resume_id: resumeId }
  //     const resumeResponse = await getResumeById(requestData)
  //     if (resumeResponse) {
  //       const resumeData = resumeResponse.map(
  //         (resume: any) => resume.resume_data,
  //       )
  //       setResumes(resumeData)
  //     }
  //   } catch (error) {
  //     console.error('Error fetching resumes for job:')
  //   }
  // }

  // useEffect(() => {
  //   fetchResumes()
  // }, [resumeId])

  const handleExpChange = (event: React.SyntheticEvent, newValue: any) => {
    setSelectedExperience(newValue)

    // handleSkillChange()
  }
  const autocompleteRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    handleSkillChange()
  }, [])

  type CombinedData = Job | Collection
  const combinedData: CombinedData[] = [
    ...jobs.map(
      (job): Job => ({
        ...job,
        type: 'job',
      }),
    ),
    ...collections.map(
      (collection): Collection => ({
        collection_name: collection.collection_name,
        collection_id: collection.collection_id,
        type: 'collection',
        resume_data: collection.resume_data,
      }),
    ),
  ]

  const classes = useStyles()

  const getAllCollection = async () => {
    try {
      const response = await getUserDetails(organisation)
      console.log('This is the response', response)
      setUserId(response.user_id)
      const filteredJobs = response.job_description.filter(
        (job: any) => job.type === 'active' && job.deleteStatus !== 'deleted',
      )
      const filteredCollections = response.collection.filter(
        (item: any) => item.deleteStatus !== 'deleted',
      )
      console.log('filteredJobs', filteredJobs)
      setJobs(filteredJobs)
      setCollectionNames(filteredCollections)
    } catch (error) {
      console.log('error' + error)
    }
  }

  useEffect(() => {
    getAllCollection()
  }, [])

  const toggleSelectCandidate = (candidateId: any) => {
    setSelectedCandidates((prev: any) =>
      prev.includes(candidateId)
        ? prev.filter((id: any) => id !== candidateId)
        : [...prev, candidateId],
    )
  }

  const handleOpenModal = () => {
    if (selectedCandidates.length === 0) {
      console.log('Please select at  one candidate')
      dispatch(
        openSnackbar(
          t('pleaseSelectAtLeastOneCandidateSnackbar'),
          'light blue',
        ),
      )
      return
    }
    setOpenModal(true)
  }
  const handleLocChange = (event: React.SyntheticEvent, newValue: any) => {
    setSelectedLoc(newValue)
    // Log the current value of selectedExp
  }
  const handleAddJobToCollection = async (jobId: number) => {
    try {
      const resumeIds = selectedCandidates
        .map((candidateId) => {
          const candidate = profile.find(
            (cand) => cand.id === candidateId || cand.id === candidateId,
          )
          return candidate?.id || null
        })
        .filter((id) => id !== null)

      if (resumeIds.length === 0) {
        console.warn('No valid resume IDs found for selected candidates.')
        // dispatch(openSnackbar('No valid resumes selected', 'red'))
        return
      }

      // Find the job title for the collection name
      const selectedJob = jobs.find((job) => job.jobid === jobId)
      const collectionName = selectedJob?.job_title || 'Unknown Job'

      // Call saveJdCollectionName with multiple resume IDs
      await saveJdCollectionName(
        collectionName,
        resumeIds,
        jobId.toString(),
        organisation || '',
      )

      setOpenModal(false)
      setSelectedCandidates([]) // Clear selected candidates after adding
      await getAllCollection() // Refresh collections
    } catch (error) {
      console.error('Error adding resumes to collection:', error)
    }
  }
  useEffect(() => {
    if (inputValue === null) {
      setInputValue('')
    }
  }, [inputValue])

  useEffect(() => {
    handleSkillChange()
  }, [selectedExperience, selectedLoc, value, selectedRole, inputValue])
  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const colors = {
    green: '#dcfce7',
    blue: '#dbeafe',
    orange: '#fed7aa',
    yellow: '#fef3c7',
  }

  const getInsightBadgeColor = (color: keyof typeof colors) => {
    return colors[color] || colors.blue
  }

  const getProfileInsights = (candidate: any) => {
    if (candidate.rating && candidate.rating > 4) {
      return { insight: 'Top Candidate', color: 'green' }
    } else if (candidate.experience && parseInt(candidate.experience) > 3) {
      return { insight: 'Lead Promising', color: 'blue' }
    } else if (candidate.status === 'rejected') {
      return { insight: 'Good to Reject', color: 'orange' }
    } else if (candidate.followUp) {
      return { insight: 'Follow Up Required', color: 'yellow' }
    }
    return { insight: 'Not Relevant', color: 'blue' }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
  }

  const [noFilterProfiles, setNoFilterProfiles] = useState<any[]>([])

  const [selectedJobRole, setSelectedJobRole] = useState('')
  const handleJobRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Job Role:', event.target.value)
    setSelectedJobRole(event.target.value)
  }

  const [selectedRangeExperience, setSelectedRangeExperience] = useState('')
  const [experienceRange, setExperienceRange] = useState<{
    min: number
    max: number
  } | null>(null)
  const handleRangeExperience = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = event.target.value
    setSelectedRangeExperience(value)
    if (value === '5+') {
      setExperienceRange({ min: 5, max: Infinity })
    } else if (value.includes('-')) {
      const [min, max] = value.split('-').map(Number)
      setExperienceRange({ min, max })
    } else {
      setExperienceRange(null)
    }
  }
  const [selectedDesignation, setSelectedDesignation] = useState<string | any>(
    null,
  )
  const [selectedSkill, setSelectedSkill] = useState<string[]>([])

  const handleReset = () => {
    setSelectedDesignation('')
    setSelectedExperience('')
    setSelectedSkill([])
    setSelectedLoc('')
    setValue([])
    setInputValue('')
    setInputExpValue('')
    setSelectedRole('')
  }
  const [selectedLocation, setSelectedLocation] = useState('')
  const handleLocation = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Location:', event.target.value)
    setSelectedLocation(event.target.value)
  }

  const [selectedInterviewStatus, setSelectedInterviewStatus] = useState('')
  const handleInterviewStatus = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    console.log('Interview Status:', event.target.value)
    setSelectedInterviewStatus(event.target.value)
  }
  // const filteredData = profile.filter(
  //   (item) =>
  //     (!selectedJobRole ||
  //       item.resume_data.Resume_Category === selectedJobRole) &&
  //     (!experienceRange ||
  //       (item.resume_data.experiance_in_number >= experienceRange.min &&
  //         item.resume_data.experiance_in_number <= experienceRange.max)) &&
  //     (!selectedLocation ||
  //       item.resume_data.location.split(',')[0].trim() === selectedLocation),
  // )

  const filteredData = profile.filter((item) => {
    // Skill matching
    const resumeSkills = item.resume_data.skills || []
    const normalizedResumeSkills = resumeSkills.map((skill: any) =>
      skill.toLowerCase(),
    )
    const normalizedValue = selectedSkill
      ? selectedSkill.map((skill: any) => skill.toLowerCase())
      : []
    const skillMatch =
      normalizedValue.length === 0 ||
      normalizedValue.some(
        (skill: any) =>
          normalizedResumeSkills.includes(skill) ||
          normalizedResumeSkills.some((resumeSkill: any) =>
            resumeSkill.startsWith(skill),
          ),
      )

    // Experience matching
    const expMatch = experienceRange
      ? item.resume_data.experiance_in_number >= experienceRange.min &&
        item.resume_data.experiance_in_number <= experienceRange.max
      : true

    // Location matching
    const locMatch = selectedLocation
      ? item.resume_data.location
          .toLowerCase()
          .startsWith(selectedLocation.toLowerCase())
      : true

    // Designation/Resume_Category matching
    const desigMatch = selectedJobRole
      ? item.resume_data.Resume_Category.toLowerCase().startsWith(
          selectedJobRole.toLowerCase(),
        )
      : true

    return skillMatch && expMatch && locMatch && desigMatch
  })
  const [searchCandidate, setSearchCandidate] = useState('')
  const handleSearch = (value: string) => {
    if (value.trim() === '') {
      setProfile(noFilterProfiles)
    } else {
      const filteredData = profile.filter((item) =>
        item.resume_data.name.toLowerCase().includes(value.toLowerCase()),
      )
      setProfile(filteredData)
    }
  }

  const loc: any = [
    // 'Bengaluru',
    // 'Hyderabad',
    // 'Chennai',
    // 'Mumbai',
    // 'Ahmedabad',
    // 'Jaipur',
    // 'Lucknow',
    t('bengaluruCity'),
    t('hyderabadCity'),
    t('chennaiCity'),
    t('mumbaiCity'),
    t('ahmedabadCity'),
    t('jaipurCity'),
    t('lucknowCity'),
  ]
  // const exp: any = [
  //   // '1-3',
  //   // '2-5',
  //   // '3-6',
  //   // '6-8',
  //   // '8-10',
  //   // '10-12',
  //   // '12-15',
  //   // '15-18',
  //   // '18-20',
  //   t('oneToThree'),
  //   t('twoToFive'),
  //   t('threeToSix'),
  //   t('sixToEigth'),
  //   t('eightToTen'),
  //   t('tenToTwelve'),
  //   t('twelveToFifteen'),
  //   t('fifteenToEighteen'),
  //   t('eighteenToTwenty'),
  // ]
  const exp: any = [
    '1-3',
    '2-5',
    '3-6',
    '6-8',
    '8-10',
    '10-12',
    '12-15',
    '15-18',
    '18-20',
  ]
  return (
    <div
      style={{
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        marginLeft: '140px',
        padding: '29px',
      }}
    >
      {/* Header */}
      <Header
        title={t('searchResume')}
        userProfileImage={''}
        path="/jdccollection"
      />

      {/* Filters */}

      <div
        style={{
          // boxShadow: '15px 0px 32px 0px #040B5B1A',
          display: 'flex',
          // padding: '30px 38px 10px 30px',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        <Grid
          container
          spacing={2}
          style={{
            display: 'flex',
            // justifyContent: 'space-between',
            flexDirection: 'row',
            padding: '19px',
          }}
        >
          <Grid item xs={4}>
            <div>
              <TextField //ji
                id="filled-basic"
                variant="standard"
                autoComplete="off"
                // placeholder="Designation "
                placeholder={t('designation')}
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value)
                }}
                style={{ width: '100%' }}
                inputRef={searchRef}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    color: '#000000',
                    fontSize: '14px',
                    border: '2px solid #0284C7',
                    borderRadius: '10px',
                    alignItems: 'center',
                    background: '#ffffff',
                    justifyContent: 'center',
                    padding: '0px 0px 5px 0px',
                    direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
                  },
                  startAdornment: (
                    <IconButton>
                      <SearchIcon sx={{ color: '#0284C7' }} />
                    </IconButton>
                  ),
                }}
              />
            </div>
          </Grid>
          {/* <Grid item xs={2}> */}
          {/* <div>
              {' '}
              <Autocomplete
                // disablePortal
                id="combo-box-demo"
                options={exp}
                inputValue={inputExpValue}
                onInputChange={(event, newInputValue: any) => {
                  setInputExpValue(newInputValue)
                  // setSelectedExperience(newInputValue)
                }}
                // getOptionLabel={(ex: any) => ex.value}
                sx={{
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #0284C7',
                  // borderColor: 'none',
                  '& .MuiAutocomplete-clearIndicator': {
                    color: '#000000 !important', // Set the color of the clear indicator (cross icon) to white
                  },
                  '& .MuiAutocomplete-noOptions': {
                    color: '#000000 !important', // Set the color of the "No Options" message to white
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none !important', // Remove the border
                  },
                }}
                PaperComponent={(props: any) => (
                  <Paper
                    {...props}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                      borderColor: 'none',
                    }}
                  />
                )}
                freeSolo
                renderInput={(params: any) => (
                  <TextField
                    // placeholder="Experience"
                    placeholder={t('profileExperience')}
                    {...params}
                    sx={{
                      '& input': {
                        backgroundColor: '#FFFFFF !important',
                        fontSize: '14px',
                      },
                      '& .MuiAutocomplete-popupIndicator': {
                        color: '#000000 !important',
                      },
                    }}
                  />
                )}
                value={selectedExperience}
                onChange={handleExpChange}
                noOptionsText=""
              />
            </div> */}
          {/* </Grid> */}
          <Grid item xs={2}>
            <div>
              {' '}
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={loc}
                inputValue={inputLocValue}
                onInputChange={(event, newInputValue: any) => {
                  setInputLocValue(newInputValue)
                  setSelectedLoc(newInputValue)
                }}
                // getOptionLabel={(lo: any) => lo.value}
                sx={{
                  // marginLeft: '13px',
                  height: '48px',
                  borderRadius: '10px',
                  justifyContent: 'center',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #0284C7',
                  '& .MuiAutocomplete-clearIndicator': {
                    color: '#000000 !important',
                  },
                  '& .MuiAutocomplete-noOptions': {
                    color: '#000000 !important',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none !important',
                  },
                }}
                PaperComponent={(props: any) => (
                  <Paper
                    {...props}
                    sx={{
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                      borderColor: 'none',
                    }}
                  />
                )}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    // placeholder="Location"
                    placeholder={t('location')}
                    {...params}
                    sx={{
                      '& input': {
                        color: '#000000', // Set the text color for the input
                        backgroundColor: '#FFFFFFF !important',
                        fontSize: '14px', // Set the background color of the text input to grey
                        height: '1.5vh',
                        direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
                      },
                      '& .MuiAutocomplete-popupIndicator': {
                        color: '#000000 !important', // Set the color of the dropdown indicator to grey
                      },
                    }}
                  />
                )}
                value={selectedLoc}
                onChange={handleLocChange}
                noOptionsText="" // Set the "No Options" message to an empty string
              />
            </div>
          </Grid>
          <Grid item xs={2}>
            <div>
              {' '}
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={value}
                ref={autocompleteRef}
                inputValue={inputValue}
                // onChange={(event, newValue: any) => {
                //   setValue(newValue)
                // }}
                onInputChange={(event, newInputValue: any) => {
                  setInputValue(newInputValue)
                  // setValue(newInputValue)
                  // handleSkillChange()
                }}
                onChange={(event, newValue) => {
                  setValue(newValue)
                  // handleSkillChange()
                }}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      sx={{
                        color: '#000000',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  ))
                }
                classes={{
                  root: classes.autocomplete,
                  inputRoot: classes.inputRoot,
                }}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    // placeholder="Search skill"
                    placeholder={t('searchSkillPlaceholder')}
                    InputProps={{
                      style: {
                        color: '#000000',
                        background: '#FFFFFF',
                        borderColor: 'none',
                        borderRadius: '10px',
                        width: '100%',
                        fontSize: '15px',
                        border: '2px solid #0284C7',
                        height: '7  vh',
                        padding: '4px',
                        direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
                      },
                      ...params.InputProps,
                    }}
                    sx={{
                      input: { color: '#000000' },
                      label: { color: '#FFFFFF' },
                      // Optional: change label color
                    }}
                  />
                )}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'none',
                      color: '#000000',
                      height: '48px',
                    },

                    '& .MuiAutocomplete-popper': {
                      background: '#FFFFFF',
                    },

                    '& .MuiChip-root': {
                      color: '#000000',
                    },
                    '& .MuiAutocomplete-clearIndicator': {
                      color: '#000000',
                    },
                    '& .MuiAutocomplete-tag .MuiChip-deleteIcon': {
                      color: '#000000',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none !important',
                    },

                    padding: '6px',
                  },
                }}
              />
            </div>
          </Grid>
          <Grid item xs={1}>
            <Button
              onClick={handleReset}
              style={{
                color: '#FFFFFF',
                backgroundColor: '#0284C7',
                borderRadius: '15px',
                textTransform: 'none',
                width: '100%',
                height: '45px',
                margin: '0', // Set margin to 0
              }}
            >
              {/* Reset */}
              {t('resetBtn')}
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button
              onClick={handleSkillChange}
              style={{
                color: '#FFFFFF',
                backgroundColor: '#0284C7',
                borderRadius: '15px',
                textTransform: 'none',
                width: '100%',
                height: '45px',
                margin: '0',
              }}
            >
              <SearchIcon />
              {/* Search */}
              {t('searchBtn')}
            </Button>
          </Grid>
        </Grid>
      </div>
      {/* <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      > */}
      {/* Search Bar */}
      {/* <div
          style={{ position: 'relative', flex: '1 1 300px', maxWidth: '300px' }}
        >
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
            }}
          />
          <input
            type="text"
            placeholder="Search by name..."
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
            }}
            value={searchCandidate}
            onChange={(e) => {
              setSearchCandidate(e.target.value)
              handleSearch(e.target.value)
            }}
          />
        </div> */}

      {/* Job Role Filter */}
      {/* <select
          value={selectedJobRole}
          onChange={handleJobRole}
          style={{
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            minWidth: '120px',
            color: selectedJobRole ? '#1f2937' : '#6b7280',
          }}
        >
          <option value="">Select Job Role</option>
          <option value="Java Developer">Java Developer</option>
          <option value="DevOps Engineer">DevOps Engineer</option>
          <option value="AI/ML Engineer">AI/ML Engineer</option>
          <option value="Mobile App Developer">Mobile App Developer</option>
          <option value="Product Manager">Product Manager</option>
          <option value="UI/UX Designer">UI/UX Designer</option>
        </select> */}

      {/* Experience Filter */}
      {/* <select
          value={selectedRangeExperience}
          onChange={handleRangeExperience}
          style={{
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            minWidth: '140px',
            color: selectedRangeExperience ? '#1f2937' : '#6b7280',
          }}
        >
          <option value="">Select Experience</option>
          <option value="0-1">0-1 Years</option>
          <option value="1-3">1-3 Years</option>
          <option value="3-5">3-5 Years</option>
          <option value="5+">5+ Years</option>
        </select> */}

      {/* Location Filter */}
      {/* <select
          value={selectedLocation}
          onChange={handleLocation}
          style={{
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            minWidth: '120px',
            color: selectedLocation ? '#1f2937' : '#6b7280',
          }}
        >
          <option value="">Select Location</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bengaluru">Bengaluru</option>
          <option value="Chennai">Chennai</option>
          <option value="Delhi">Delhi</option>
          <option value="Pune">Pune</option>
        </select>
      </div> */}

      {/* Candidates List with Scrollbar */}
      <div
        style={{
          maxHeight: '410px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          marginLeft: '20px',
          position: 'relative', // For sticky button
        }}
        className="candidate-list"
      >
        <div
          style={{
            maxHeight: '100px', // Height for 3 resumes (~200px each)
            overflowY: 'auto', // Enable vertical scrollbar
            scrollbarWidth: 'thin', // Firefox
            scrollbarColor: '#d1d5db #f8fafc', // Firefox
            paddingBottom: '418px', // Space for sticky button
          }}
        >
          <style>
            {`
              .candidate-list::-webkit-scrollbar {
                width: 100px;
              }
              .candidate-list::-webkit-scrollbar-track {
                background: #f8fafc;
              }
              .candidate-list::-webkit-scrollbar-thumb {
                background: #d1d5db;
                border-radius: 4px;
              }
              .candidate-list::-webkit-scrollbar-thumb:hover {
                background: #9ca3af;
              }
              @media (min-width: 1024px) and (max-width: 1440px) {
                .candidate-list > div {
                  max-height: 100px; /* Fit 3 resumes on laptop screens */
                }
              }
              @media (max-width: 1023px) {
                .candidate-list > div {
                  max-height: 100px; /* Allow full height on smaller screens */
                }
              }
            `}
          </style>
          {profile.length === 0 ? (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '16px',
              }}
            >
              Loading
            </div>
          ) : (
            filteredData.map((candidate, index) => (
              <div
                key={candidate.id || index}
                style={{
                  padding: '20px',
                  borderBottom:
                    index < profile.length - 1 ? '1px solid #e5e7eb' : 'none',
                  display: 'flex',
                  gap: '16px',
                }}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedCandidates.includes(
                    candidate.resume_data.id || index,
                  )}
                  onChange={() =>
                    toggleSelectCandidate(candidate.resume_data.id || index)
                  }
                  style={{
                    width: '16px',
                    height: '16px',
                    marginTop: '4px',
                    cursor: 'pointer',
                  }}
                />

                {/* Avatar */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#0284C7',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: '600',
                    flexShrink: 0,
                  }}
                >
                  {getInitials(candidate.resume_data?.name || 'NA')}
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, display: 'flex', gap: '24px' }}>
                  {/* Left Column */}
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        margin: '0 0 4px 0',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      {candidate.resume_data?.name || 'N/A'}
                    </h3>
                    <p
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '14px',
                        color: '#6b7280',
                        fontWeight: '500',
                      }}
                    >
                      {candidate?.resume_data?.Resume_Category || 'N/A'}
                    </p>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        gap: '4px 12px',
                        fontSize: '12px',
                        color: '#6b7280',
                        marginBottom: '12px',
                      }}
                    >
                      <span style={{ fontWeight: '500' }}>
                        {t('profileExperience')}:
                      </span>
                      <span>
                        {candidate.resume_data?.experiance_in_number || 'N/A'}
                      </span>
                      <span style={{ fontWeight: '500' }}>
                        {t('location')}:
                      </span>
                      <span>{candidate.resume_data?.location || 'N/A'}</span>
                      <span style={{ fontWeight: '500' }}>{t('contact')}:</span>
                      <span>{candidate.resume_data?.phone || 'N/A'}</span>
                    </div>

                    {/* <div style={{ marginBottom: '12px' }}>
                      <p
                        style={{
                          margin: '0 0 4px 0',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#374151',
                        }}
                      >
                        About:
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '12px',
                          color: '#6b7280',
                          lineHeight: '1.4',
                        }}
                      >
                        {candidate.about ||
                          candidate.summary ||
                          candidate.description ||
                          'No description available'}
                      </p>
                    </div> */}

                    {/* <div
                      style={{ display: 'flex', gap: '16px', fontSize: '12px' }}
                    >
                      <button
                        style={{
                          padding: '0',
                          border: 'none',
                          background: 'none',
                          color: '#0284C7',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                      >
                        View CV/Resume
                      </button>
                      <button
                        style={{
                          padding: '0',
                          border: 'none',
                          background: 'none',
                          color: '#0284C7',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                      >
                        Notes
                      </button>
                    </div> */}
                  </div>

                  {/* Key Skills Column */}
                  <div style={{ width: '140px' }}>
                    <h4
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#374151',
                      }}
                    >
                      {t('keySkill')}
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      {(candidate.resume_data?.skills || [])
                        .slice(0, 5)
                        .map((skill: any, idx: any) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '11px',
                              color: '#6b7280',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <span
                              style={{
                                width: '4px',
                                height: '4px',
                                backgroundColor: '#d1d5db',
                                borderRadius: '50%',
                                marginRight: '6px',
                              }}
                            ></span>
                            {typeof skill === 'string'
                              ? skill
                              : skill.name || skill.skill || 'N/A'}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Previous Interview Column
                  <div style={{ width: '120px' }}>
                    <h4
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#374151',
                      }}
                    >
                      Previous Interview
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '11px',
                        color: '#6b7280',
                      }}
                    >
                      {candidate.previousInterview ||
                        candidate.interviewHistory ||
                        '-'}
                    </p>
                  </div> */}
                </div>
              </div>
            ))
          )}
        </div>
        {/* Fixed Button */}
        <button
          aria-label="Add selected candidates to collection"
          style={{
            width: '140px',
            padding: '8px 16px',
            backgroundColor: '#0284C7',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            float: 'right',
            boxShadow: '0 -1px 3px rgba(0,0,0,0.1)',
          }}
          onClick={handleOpenModal}
          onKeyDown={(e) => e.key === 'Enter' && handleOpenModal()}
        >
          {t('addCollectionBtn')}
        </button>
      </div>

      {/* Modal for Job Selection */}
      {/* <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="job-selection-modal"
        aria-describedby="select-job-to-add-to-collection"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'white',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2
            id="job-selection-modal"
            style={{
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            Select Job Title
          </h2>
          {jobs.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No active jobs available.</p>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {jobs.map((job) => (
                <div
                  key={job.jobid}
                  style={{
                    padding: '8px 0',
                    cursor: 'pointer',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                  onClick={() => handleAddJobToCollection(job.jobid)}
                >
                  <span style={{ fontSize: '14px', color: '#1f2937' }}>
                    {job.job_title} ({job.job_role})
                  </span>
                </div>
              ))}
            </div>
          )}
          <Button
            onClick={handleCloseModal}
            sx={{ mt: 2, textTransform: 'none' }}
          >
            Cancel
          </Button>
        </Box>
      </Modal> */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="job-selection-modal"
        aria-describedby="select-job-to-add-to-collection"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'white',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2
            id="job-selection-modal"
            style={{
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '600',
            }}
          >
            {t('selectJobTitle')}
          </h2>
          {jobs.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No active jobs available.</p>
          ) : (
            <div
              style={{
                maxHeight: '195px', // Show 5 jobs (~37px each)
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#d1d5db #f8fafc',
              }}
              className="job-list"
            >
              {/* <style>
                {`
                  .job-list::-webkit-scrollbar { width: 8px; }
                  .job-list::-webkit-scrollbar-track { background: #f8fafc; }
                  .job-list::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
                  .job-list::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
                `}
              </style> */}
              <style>
                {`
    .job-list::-webkit-scrollbar {
    background: #9ca3af; 
      width: 10px; /* Increased width for visibility */
    }
    .job-list::-webkit-scrollbar-track {
      background: #f8fafc; /* Same track color */
    }
    .job-list::-webkit-scrollbar-thumb {
      background: #9ca3af; /* Darker thumb for contrast */
      border-radius: 4px;
    }
    .job-list::-webkit-scrollbar-thumb:hover {
      background: #6b7280; /* Slightly darker on hover */
    }
  `}
              </style>
              {jobs.map((job) => (
                <div
                  key={job.jobid}
                  style={{
                    padding: '8px 0',
                    cursor: 'pointer',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                  onClick={() => handleAddJobToCollection(job.jobid)}
                >
                  <span style={{ fontSize: '14px', color: '#1f2937' }}>
                    {job.job_title} ({job.job_role || 'N/A'})
                  </span>
                </div>
              ))}
            </div>
          )}
          <Button
            onClick={handleCloseModal}
            sx={{ mt: 2, textTransform: 'none' }}
          >
            {t('cancelBtn')}
          </Button>
        </Box>
      </Modal>
    </div>
  )
}

export default ResumeList
