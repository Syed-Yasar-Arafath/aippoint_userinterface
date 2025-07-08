import React, { useState, useRef, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
// import { useDispatch, useSelector } from 'react-redux'
import { useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close'

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
  Divider,
  Typography,
} from '@mui/material'
// import { getAllResume, getResumeById } from '../../services/ResumeService'
// import { getUserDetails } from '../../services/UserService'
// import { putResume } from '../../services/JobService'
// import Header from '../../components/topheader'
import { t } from 'i18next'
// import i18n from '../../i18n'
import { makeStyles } from '@mui/styles'
import { Search } from 'lucide-react'
// import { loaderOff, loaderOn, openSnackbar } from '../../redux/actions'
import { useTranslation } from 'react-i18next'
import { loaderOff, loaderOn, openSnackbar } from '../redux/actions'
import { putResume } from '../services/JobService'
import { getAllResume, postResume, saveNotes } from '../services/ResumeService'
import { getUserDetails } from '../services/UserService'
import Header from '../CommonComponents/topheader'
// import { useDispatch } from 'react-redux'

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
    profile_summary : any
    notes:any  }
  score: any
}

const ResumeList = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<any[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [profile, setProfile] = React.useState<Profile[]>([])
  const [profileLength, setProfileLength] = useState<number>(0)
  const [selectedExperience, setSelectedExperience] = useState<string | null>(
    null,
  )
  const [selectedSkill, setSelectedSkill] = useState<string[]>([])
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
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');
  const [objectId, setObjectId] = useState('');


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [resumesPerPage] = useState(5) // Show 6 resumes per page for laptop screen
  
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
    // dispatch(loaderOn())
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
      // dispatch(loaderOff())
      throw error
    }
  }
  const handleClose = () => setOpenModal(false)
     const handleSaveNotes = async () => {
    if (!objectId || !notes.trim()) {
      setResponseMsg('Object ID and notes are required');
      return;
    }

    setLoading(true);
    setResponseMsg('');
    const jsonData =JSON.stringify({
        object_id: objectId,
        notes: notes,
      })

        try {
      const res = await saveNotes(jsonData)
     
      if (res && res.status === 200) {
        setNotes(notes)
        setResponseMsg('✅ Notes saved successfully!');
        dispatch(openSnackbar('Notes saved successfully!', 'green'));
        
        // Update the candidate's notes in the profile data
        const updatedProfile = profile.map((candidate) => {
          if (candidate.resume_data?.id === objectId || candidate.id === objectId) {
            return {
              ...candidate,
              resume_data: {
                ...candidate.resume_data,
                notes: notes
              }
            };
          }
          return candidate;
        });
        setProfile(updatedProfile);
        
        // Close modal after successful save
        setTimeout(() => {
          handleNotesClose();
        }, 1500);
      } else {
        setResponseMsg('Error saving notes. Please try again.');
        dispatch(openSnackbar('Failed to save notes. Please try again.', 'red'));
      }
    } catch (err : any) {
      setResponseMsg('Something went wrong: ' + err.message);
      dispatch(openSnackbar('Something went wrong while saving notes.', 'red'));
    } 
    finally {
      setLoading(false);
    }
  };
  const handleNotesClick = (candidate: any) => {
    setSelectedCandidateForNotes(candidate)
    setObjectId(candidate.resume_data?.id || candidate.id)
    // Load existing notes if present, otherwise reset to empty
    setNotes(candidate.resume_data?.notes || '')
    setNotesText(candidate.resume_data?.notes || '') // Reset notes text for new candidate
    setResponseMsg('') // Clear any previous messages
    setNotesModalOpen(true)
  }
  
  const handleNotesClose = () => {
    setNotesModalOpen(false)
    setSelectedCandidateForNotes(null)
    setNotesText('')
    setNotes('')
    setObjectId('')
    setResponseMsg('')
  }
 
  const handleSkillChange = async () => {
    // dispatch(loaderOn())
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
      // dispatch(loaderOn())
      const response = await getAllResume(jsonData)
      if (response) {
        setProfile(response)
        setProfileLength(response.length)
        setNoFilterProfiles(response) // Set the noFilterProfiles for search functionality
      }
      // dispatch(loaderOff())
    } catch (error) {
      console.error('Request error:', error)
    }
  }

  const handleExpChange = (event: React.SyntheticEvent, newValue: any) => {
    setSelectedExperience(newValue)
  }
  const autocompleteRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    handleSkillChange()
  }, [])

  // Set noFilterProfiles when profile data is loaded


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
  const [base64Pdf, setBase64Pdf] = useState('')
  const [notesModalOpen, setNotesModalOpen] = useState(false)
  const [selectedCandidateForNotes, setSelectedCandidateForNotes] = useState<any>(null)
  const [notesText, setNotesText] = useState('')

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
 const handleOpen = async (proId: any) => {
    const jsonData = {
      resume_id: [proId],
    }
    try {
      const res = await postResume(jsonData)
      setBase64Pdf(res[0].file_data)
      setOpenModal(true)
    } catch (error) {
      // Handle errors
      console.error('Error fetching data:', error)
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all
      setSelectedCandidates([])
      setSelectAll(false)
    } else {
      // Select all resumes across all pages
      const allResumeIds = filteredData.map((candidate) => 
        candidate.resume_data.id || candidate.id
      ).filter(id => id !== null && id !== undefined)
      setSelectedCandidates(allResumeIds)
      setSelectAll(true)
    }
  }

  const handleOpenModal = () => {
    if (selectedCandidates.length === 0) {
      console.log('Please select at  one candidate')
      // dispatch(
      //   openSnackbar(
      //     t('pleaseSelectAtLeastOneCandidateSnackbar'),
      //     'light blue',
      //   ),
      // )
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
      // Use selectedCandidates directly since they contain the resume IDs
      const resumeIds = selectedCandidates.filter((id) => id !== null && id !== undefined)

      if (resumeIds.length === 0) {
        console.warn('No valid resume IDs found for selected candidates.')
        // dispatch(openSnackbar('No valid resumes selected', 'red'))
        return
      }

      // Find the job title for the collection name
      const selectedJob = jobs.find((job) => job.jobid === jobId)
      const collectionName = selectedJob?.job_title || 'Unknown Job'

      console.log(`Adding ${resumeIds.length} resumes to collection: ${collectionName}`)
      console.log('Resume IDs:', resumeIds)

      // Call saveJdCollectionName with multiple resume IDs
      await saveJdCollectionName(
        collectionName,
        resumeIds,
        jobId.toString(),
        organisation || '',
      )

      setOpenModal(false)
      setSelectedCandidates([]) // Clear selected candidates after adding
      setSelectAll(false) // Reset select all state
      await getAllCollection() // Refresh collections
      
      // Show success message
      console.log(`Successfully added ${resumeIds.length} resumes to collection: ${collectionName}`)
    } catch (error) {
      console.error('Error adding resumes to collection:', error)
    }
  }
  useEffect(() => {
    if (inputValue === null) {
      setInputValue('')
    }
  }, [inputValue])


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

  const handleReset = () => {
    setSelectedDesignation('')
    setSelectedExperience('')
    setSelectedSkill([])
    setSelectedLoc('')
    setValue([])
    setInputValue('')
    setInputExpValue('')
    setSelectedRole('')
    setSelectedCandidates([])
    setSelectAll(false)
    setCurrentPage(1) // Reset to first page when filters are reset
  }

  // Pagination functions
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
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

  // Pagination functions that depend on filteredData
  const getCurrentPageResumes = () => {
    const startIndex = (currentPage - 1) * resumesPerPage
    const endIndex = startIndex + resumesPerPage
    return filteredData.slice(startIndex, endIndex)
  }

  const totalPages = Math.ceil(filteredData.length / resumesPerPage)

  // Update selectAll state when individual selections change
  useEffect(() => {
    const allResumeIds = filteredData.map((candidate) => 
      candidate.resume_data.id || candidate.id
    ).filter(id => id !== null && id !== undefined)
    
    const allSelected = allResumeIds.length > 0 && 
      allResumeIds.every(id => selectedCandidates.includes(id))
    
    setSelectAll(allSelected)
  }, [selectedCandidates, filteredData])

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
    'Bengaluru',
    'Hyderabad',
    'Chennai',
    'Mumbai',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    // t('bengaluruCity'),
    // t('hyderabadCity'),
    // t('chennaiCity'),
    // t('mumbaiCity'),
    // t('ahmedabadCity'),
    // t('jaipurCity'),
    // t('lucknowCity'),
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
    const [selectedStatus, setSelectedStatus] = useState('Select Status');
    useEffect(() => {
    handleSkillChange()
  }, [selectedExperience, selectedLoc, value, selectedRole, inputValue])
  useEffect(() => {
    if (profile.length > 0 && noFilterProfiles.length === 0) {
      setNoFilterProfiles(profile)
    }
  }, [profile, noFilterProfiles.length])
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedExperience, selectedLoc, value, selectedRole, inputValue, filteredData.length])

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
        minHeight: '80vh',
        // marginLeft: '140px',
        padding: '10px',
      }}
    >
      {/* Header */}
      <Header
        title="Review Resume"
        userProfileImage={''}
        path="/jdccollection"
      />

      {/* Filters */}

     <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding: '10px',
          gap: '4px', // Reduced gap to fit more elements
          flexWrap: 'nowrap', // Prevent wrapping to keep in single line
          overflowX: 'auto', // Allow horizontal scroll if needed
          alignItems: 'center',
        }}
      >
        {/* Designation Search */}
        <div style={{ flex: '1 1 140px', minWidth: '120px', flexShrink: 0 }}>
          <TextField
            id="filled-basic"
            variant="standard"
            autoComplete="off"
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
                fontSize: '12px',
                border: '2px solid #0284C7',
                borderRadius: '10px',
                alignItems: 'center',
                background: '#ffffff',
                justifyContent: 'center',
                height: '38px',
                direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
              },
              startAdornment: (
                <IconButton size="small">
                  <SearchIcon sx={{ color: '#0284C7', fontSize: '18px' }} />
                </IconButton>
              ),
            }}
          />
        </div>

        {/* Experience */}
        <div style={{ flex: '1 1 120px', minWidth: '100px', flexShrink: 0 }}>
          <Autocomplete
            id="combo-box-demo"
            options={exp}
            inputValue={inputExpValue}
            onInputChange={(event, newInputValue) => {
              setInputExpValue(newInputValue)
            }}
            sx={{
              height: '38px', // Standardized height
              borderRadius: '10px',
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
            PaperComponent={(props) => (
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
                // placeholder={t('profileExperience')}
                placeholder={t('experience')}
                {...params}
                sx={{
                  '& input': {
                    backgroundColor: '#FFFFFF !important',
                    fontSize: '12px',
                    height: '9px',
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
        </div>

        {/* Location */}
        <div style={{ flex: '1 1 120px', minWidth: '100px', flexShrink: 0 }}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={loc}
            inputValue={inputLocValue}
            onInputChange={(event, newInputValue) => {
              setInputLocValue(newInputValue)
              setSelectedLoc(newInputValue)
            }}
            sx={{
              height: '38px', // Standardized height
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
            PaperComponent={(props) => (
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
                placeholder={t('location')}
                {...params}
                sx={{
                  '& input': {
                    color: '#000000',
                    backgroundColor: '#FFFFFF !important',
                    fontSize: '12px',
                    height: '8px',
                    direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
                  },
                  '& .MuiAutocomplete-popupIndicator': {
                    color: '#000000 !important',
                  },
                }}
              />
            )}
            value={selectedLoc}
            onChange={handleLocChange}
            noOptionsText=""
          />
        </div>

        {/* Status */}
        {/* <div style={{ flex: '1 1 120px', minWidth: '100px', flexShrink: 0 }}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              width: '100%',
              height: '38px', // Standardized height
              padding: '8px 10px', // Reduced padding
              border: '2px solid #0284C7',
              borderRadius: '10px',
              fontSize: '12px',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option>Select Status</option>
            <option>Top Candidate</option>
            <option>Looks Promising</option>
            <option>Good in Parts</option>
            <option>Follow Up Required</option>
            <option>Not Relevant</option>
          </select>
        </div> */}

        {/* Skills */}
              <div style={{ flex: '1 1 140px', minWidth: '140px', flexShrink: 0 }}>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={value}
            ref={autocompleteRef}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue)
            }}
            onChange={(event, newValue) => {
              setValue(newValue)
            }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  size="small"
                  sx={{
                    color: '#000000',
                    backgroundColor: '#E5E7EB',
                    fontSize: '10px',
                    height: '20px',
                  }}
                />
              ))
            }
            classes={{
              root: classes.autocomplete,
              inputRoot: classes.inputRoot,
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search skills"
                multiline
                minRows={1}
                maxRows={9}
                InputProps={{
                  style: {
                    color: '#000000',
                    background: '#FFFFFF',
                    borderColor: 'none',
                    borderRadius: '10px',
                    width: '100%',
                    fontSize: '12px',
                    border: '2px solid #0284C7',
                    minHeight: '38px', // Standardized height
                    height: 'auto',
                    padding: '4px',
                    direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
                    overflow: 'auto',
                  },
                  ...params.InputProps,
                }}
                sx={{
                  '& input': { 
                    color: '#000000', 
                    fontSize: '12px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                  '& textarea': {
                    color: '#000000',
                    fontSize: '12px',
                    lineHeight: '1.2',
                    resize: 'none',
                    overflow: 'auto',
                  },
                  label: { color: '#FFFFFF' },
                }}
              />
            )}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'none',
                  color: '#000000',
                },
                '& .MuiAutocomplete-popper': {
                  background: '#FFFFFF',
                },
                '& .MuiChip-root': {
                  color: '#000000',
                  margin: '1px',
                  fontSize: '10px',
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
                padding: '2px',
                minHeight: '38px', // Standardized height
                height: 'auto',
                alignItems: 'flex-start',
                '& .MuiAutocomplete-inputRoot': {
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  // paddingTop: '6px',
                },
              },
            }}
          />
        </div>

         <div style={{ flex: '1 1 90px', minWidth: '80px', flexShrink: 0 }}>
          <input
            type="date"
            style={{
              width: '80%',
              height: '38px', // Standardized height
              padding: '0px 6px',
              border: '2px solid #0284C7',
              borderRadius: '10px',
              fontSize: '12px',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              outline: 'none'
            }}
          />
        </div>
        {/* Reset Button */}
        <div style={{ flex: '0 0 70px', flexShrink: 0 }}>
          <Button
            onClick={handleReset}
            style={{
              color: '#FFFFFF',
              backgroundColor: '#0284C7',
              borderRadius: '10px',
              textTransform: 'none',
              width: '100%',
              height: '38px',
              fontSize: '11px',
              margin: '0',
            }}
          >
            Reset
          </Button>
        </div>

        {/* Search Button */}
        <div style={{ flex: '0 0 80px', flexShrink: 0 }}>
          <Button
            onClick={handleSkillChange}
            style={{
              color: '#FFFFFF',
              backgroundColor: '#0284C7',
              borderRadius: '10px',
              textTransform: 'none',
              width: '100%',
              height: '38px',
              fontSize: '11px',
              margin: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <SearchIcon sx={{ fontSize: '16px' }} />
            Search
          </Button>
        </div>

        {/* Select All */}
        <div style={{ flex: '0 0 80px', flexShrink: 0 }}>
          <button
            onClick={handleSelectAll}
            style={{
              width: '100%',
              height: '38px',
              padding: '8px 12px',
              backgroundColor: selectAll ? '#0284C7' : '#F3F4F6',
              border: '2px solid #D1D5DB',
              borderRadius: '10px',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              color: selectAll ? '#FFFFFF' : '#000000'
            }}
          >
            <input 
              type="checkbox" 
              checked={selectAll}
              onChange={handleSelectAll}
              style={{ margin: 0, transform: 'scale(0.8)' }}
            />
            {selectAll ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>
<div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          marginLeft: '20px',
          position: 'relative',
        }}
        className="candidate-list"
      >
        <div
          style={{
            paddingBottom: '6px', // Reduced from 10px
          }}
        >
          {/* Selection Counter */}
          {selectedCandidates.length > 0 && (
            <div
              style={{
                padding: '6px 16px', // Reduced from 8px
                backgroundColor: '#dbeafe',
                borderBottom: '1px solid #93c5fd',
                fontSize: '12px',
                color: '#1e40af',
                fontWeight: '500',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>
                {selectedCandidates.length} candidate{selectedCandidates.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => {
                  setSelectedCandidates([])
                  setSelectAll(false)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1e40af',
                  fontSize: '11px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Clear Selection
              </button>
            </div>
          )}
          
          {profile.length === 0 ? (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '16px',
              }}
            >
              Loading..
            </div>
          ) : (
            getCurrentPageResumes().map((candidate, index) => (
              <div
                key={candidate.id || index}
                style={{
                  height: '80px', // Fixed height to fit 5 resumes on laptop screen
                  padding: '5px 20px', // Reduced top/bottom padding to reduce gaps
                  borderBottom: index < getCurrentPageResumes().length - 1 ? '1px solid #e5e7eb' : 'none',
                  display: 'flex',
                  gap: '2px', // Reduced gap between elements
                  alignItems: 'flex-start',
                  overflow: 'hidden', // Prevent content overflow
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
                    width: '14px',
                    height: '14px',
                    marginTop: '2px',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                />

                {/* Avatar */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#0284C7',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    flexShrink: 0,
                  }}
                >
                  {getInitials(candidate.resume_data?.name || 'NA')}
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, display: 'flex', gap: '8px', minWidth: 0 }}>
                  {/* Left Column - Basic Info */}
                  <div style={{ flex: '0 0 200px', minWidth: 0 }}>
                    <h3
                      style={{
                        margin: '0 0 2px 0',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#0284C7',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontFamily: 'SF Pro Display'
                      }}
                    >
                      {candidate.resume_data?.name || 'N/A'}
                    </h3>
                    <span  style={{
                        margin: '0 0 4px 0',
                        fontSize: '11px',
                        color: '#6b7280',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>Current Position:</span>

                    <span
                      style={{
                        margin: '0 0 4px 0',
                        fontSize: '11px',
                        color: '#1C1C1E',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {candidate?.resume_data?.Resume_Category || 'N/A'}
                    </span>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1px',
                        fontSize: '10px',
                        color: '#6b7280',
                        marginBottom: '4px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ fontWeight: '500', minWidth: '30px' }}>Exp:</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis',                        color: '#1C1C1E',
 }}>
                          {candidate.resume_data?.experiance_in_number || 'N/A'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ fontWeight: '500', minWidth: '30px' }}>Loc:</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis',color: '#1C1C1E',
 }}>
                          {candidate.resume_data?.location || 'N/A'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ fontWeight: '500', minWidth: '30px' }}>Tel:</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis',                        color: '#1C1C1E',
 }}>
                          {candidate.resume_data?.phone || 'N/A'}
                        </span>
                      </div>
                    </div>

                  
                  </div>
                   
                     <Divider
                                        orientation="vertical"
                                        sx={{
                                          display: { xs: 'none', sm: 'block' },
                                          borderColor: '#1C1C1E59',
                                          alignSelf: 'stretch',
                                          width: '1px',
                                          margin: '0 10px',
                                        }}
                                      />
                                      <div
                                        style={{
                                          fontSize: '0.75rem',
                                          color: '#4B5563',
                                          fontFamily: 'SF Pro Display',
                                          flex: 1,
                                          minWidth: 0,
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '2px',
                                          justifyContent: 'space-between',
                                          height: '78px', // fixed height to fit in 100px container
                                        }}
                                      >
                                       <p
  style={{
    margin: 0,
    fontFamily: 'SF Pro Display',
    fontWeight: 400,
    fontSize: '10px',
    color: '#4B5563',
    maxHeight: '4em', // 2 lines to fit in 100px height
    overflowY: 'auto',
    lineHeight: '1.2em',
    display: '-webkit-box',
    WebkitLineClamp: 3, // 2 lines maximum
    WebkitBoxOrient: 'vertical',
    wordBreak: 'break-word',
    padding: '4px',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    flexShrink: 0, // prevent shrinking
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
  {candidate.resume_data?.profile_summary || 'N/A'}
</p>

                                        <div style={{ 
                                          display: 'flex', 
                                          gap: '4px', 
                                          justifyContent: 'flex-start',
                                          marginTop: '4px',
                                          flexShrink: 0, // prevent shrinking
                                        }}>
                                        <Button
  variant="outlined"
  style={{
    fontSize: '10px',
    padding: '2px 8px',
    border: '1px solid #E5E7EB',
    borderRadius: '4px',
    backgroundColor: 'white',
    color: '#4B5563',
    fontFamily: 'SF Pro Display',
    textTransform: 'inherit',
    minWidth: '70px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    height: '14px',
  }}
  onClick={() => handleOpen(candidate.resume_data?.id)} // ✅ Fixed here
>
  View CV
</Button>

                                          <Button
                                            variant="outlined"
                                            style={{
                                              fontSize: '10px',
                                              padding: '4px 8px',
                                              border: candidate.resume_data?.notes ? '1px solid #0284C7' : '1px solid #E5E7EB',
                                              borderRadius: '4px',
                                              backgroundColor: candidate.resume_data?.notes ? '#f0f9ff' : 'white',
                                              color: candidate.resume_data?.notes ? '#0284C7' : '#4B5563',
                                              fontFamily: 'SF Pro Display',
                                              textTransform: 'inherit',
                                              minWidth: '50px',
                                              whiteSpace: 'nowrap',
                                              overflow: 'hidden',
                                              textOverflow: 'ellipsis',
                                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                              height: '14px',
                                            }}
                                            onClick={() => handleNotesClick(candidate)}
                                          >
                                            {candidate.resume_data?.notes ? 'Notes ✓' : 'Notes'}
                                          </Button>
                                        </div>
                                      </div>

                  {/* Key Skills Column */}
                  <div style={{ width: '100px', flexShrink: 0 }}>
                    <h4
                      style={{
                        margin: '0 0 4px 0',
                        fontSize: '10px',
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
                        gap: '1px',
                        maxHeight: '50px',
                        overflow: 'hidden',
                      }}
                    >
                      {(candidate.resume_data?.skills || [])
                        .slice(0, 4) // Reduced to fit in 100px height
                        .map((skill : any, idx : any) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '9px',
                              color: '#6b7280',
                              display: 'flex',
                              alignItems: 'center',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            <span
                              style={{
                                width: '3px',
                                height: '3px',
                                backgroundColor: '#d1d5db',
                                borderRadius: '50%',
                                marginRight: '4px',
                                flexShrink: 0,
                              }}
                            ></span>
                            {typeof skill === 'string'
                              ? skill
                              : skill.name || skill.skill || 'N/A'}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Previous Interview Column */}
                  <div style={{ width: '80px', flexShrink: 0 }}>
                    {/* <h4
                      style={{
                        margin: '0 0 4px 0',
                        fontSize: '10px',
                        fontWeight: '600',
                        color: '#374151',
                      }}
                    >
                      Previous Interview
                    </h4> */}
                    <p
                      style={{
                        margin: 0,
                        fontSize: '9px',
                        color: '#6b7280',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {/* {candidate.previousInterview ||
                        candidate.interviewHistory ||
                        '-'} */}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Pagination and Add to Collection Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '2px 16px', // Reduced from 16px
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}
        >
          {/* Pagination Info */}
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Showing {((currentPage - 1) * resumesPerPage) + 1} to {Math.min(currentPage * resumesPerPage, filteredData.length)} of {filteredData.length} resumes
          </div>

          {/* Pagination Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '4px 10px',
                backgroundColor: currentPage === 1 ? '#f3f4f6' : '#ffffff',
                color: currentPage === 1 ? '#9ca3af' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div style={{ display: 'flex', gap: '2px' }}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber : any;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: currentPage === pageNumber ? '#0284C7' : '#ffffff',
                      color: currentPage === pageNumber ? '#ffffff' : '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      minWidth: '28px'
                    }}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '2px 10px',
                backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#ffffff',
                color: currentPage === totalPages ? '#9ca3af' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              Next
            </button>

            {/* Add to Collection Button */}
            <button
              aria-label="Add selected candidates to collection"
              style={{
                padding: '6px 14px', // Reduced from 8px 16px
                backgroundColor: selectedCandidates.length > 0 ? '#0284C7' : '#9CA3AF',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: selectedCandidates.length > 0 ? 'pointer' : 'not-allowed',
                marginLeft: '10px', // Reduced from 12px
                whiteSpace: 'nowrap'
              }}
              onClick={selectedCandidates.length > 0 ? handleOpenModal : undefined}
              onKeyDown={(e) => e.key === 'Enter' && selectedCandidates.length > 0 && handleOpenModal()}
            >
              {selectedCandidates.length > 0 
                ? `${t('addCollectionBtn')} (${selectedCandidates.length})`
                : t('addCollectionBtn')
              }
            </button>
          </div>
        </div>
      </div>

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
                maxHeight: '195px',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#d1d5db #f8fafc',
              }}
              className="job-list"
            >
              <style>
                {`
                  .job-list::-webkit-scrollbar {
                    width: 10px;
                  }
                  .job-list::-webkit-scrollbar-track {
                    background: #f8fafc;
                  }
                  .job-list::-webkit-scrollbar-thumb {
                    background: #9ca3af;
                    border-radius: 4px;
                  }
                  .job-list::-webkit-scrollbar-thumb:hover {
                    background: #6b7280;
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
        <Modal
                open={openModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    display: 'flex',
                    position: 'fixed',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  }}
                >
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    {' '}
                  </Typography>
      
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {' '}
                  </Typography>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                    }}
                  >
                    <iframe
                      title="PDF Preview"
                      src={'data:application/pdf;base64,' + base64Pdf}
                      style={{
                        width: '100vw',
                        height: '100vh',
                        border: 'none',
                        padding: '10px 0px 0px 100px',
                      }}
                    ></iframe>
                    <CloseIcon
                      onClick={handleClose}
                      style={{
                        top: '25px',
                        right: '0px',
                        width: '25px',
                        height: '25px',
                        color: '#000000',
                        position: 'absolute',
                        background: '#FFFFFF',
                        padding: '1px 1px 1px 1px',
                      }}
                    />
                  </div>
                </Box>
              </Modal>

      {/* Notes Modal */}
      <Modal
        open={notesModalOpen}
        onClose={handleNotesClose}
        aria-labelledby="notes-modal"
        aria-describedby="add-notes-for-candidate"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'white',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2
              id="notes-modal"
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
              }}
            >
              {selectedCandidateForNotes?.resume_data?.notes ? 'Edit Notes' : 'Add Notes'}
            </h2>
            <CloseIcon
              onClick={handleNotesClose}
              style={{
                cursor: 'pointer',
                color: '#6b7280',
                fontSize: '20px',
              }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151', fontWeight: '500' }}>
              Candidate: {selectedCandidateForNotes?.resume_data?.name || 'N/A'}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
              Position: {selectedCandidateForNotes?.resume_data?.Resume_Category || 'N/A'}
            </p>
          </div>

          <TextField
            multiline
            rows={6}
            fullWidth
            variant="outlined"
            placeholder={selectedCandidateForNotes?.resume_data?.notes ? 'Update your notes about this candidate...' : 'Enter your notes about this candidate...'}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{
              marginBottom: '20px',
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                fontFamily: 'SF Pro Display',
              },
            }}
          />
          {responseMsg && (
  <p
    style={{
      marginBottom: '20px',
      color: responseMsg.includes('✅') ? 'green' : 'red',
      fontSize: '13px',
      fontFamily: 'SF Pro Display',
    }}
  >
    {responseMsg}
  </p>
)}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleNotesClose}
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderColor: '#d1d5db',
                color: '#6b7280',
                '&:hover': {
                  borderColor: '#9ca3af',
                  backgroundColor: '#f9fafb',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNotes}
              variant="contained"
              disabled={loading}
              sx={{
                textTransform: 'none',
                backgroundColor: '#0284C7',
                '&:hover': {
                  backgroundColor: '#0369a1',
                },
                '&:disabled': {
                  backgroundColor: '#9ca3af',
                },
              }}
            >
              {loading ? 'Saving...' : 'Save Notes'}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default ResumeList
