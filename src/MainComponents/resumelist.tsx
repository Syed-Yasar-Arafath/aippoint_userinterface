import React, { useState, useRef, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
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
import { useTranslation } from 'react-i18next'
import { loaderOff, loaderOn, openSnackbar } from '../redux/actions'
import { putResume } from '../services/JobService'
import { getAllResume, postResume, saveNotes } from '../services/ResumeService'
import { getUserDetails } from '../services/UserService'
import Header from '../CommonComponents/topheader'
import { makeStyles } from '@mui/styles'

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
    profile_summary: any
    notes: any
  }
  score: any
}

const ResumeList = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<any[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [profile, setProfile] = React.useState<Profile[]>([])
  const [profileLength, setProfileLength] = useState<number>(0)
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<string[]>([])
  const [selectedLoc, setSelectedLoc] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [value, setValue] = useState<any[]>([])
  const [collectionNames, setCollectionNames] = useState<Collection[]>([])
  const [userId, setUserId] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [openModal1, setOpenModal1] = useState(false)
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
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [responseMsg, setResponseMsg] = useState('')
  const [objectId, setObjectId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [resumesPerPage] = useState(5)
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
      throw error
    }
  }

  const handleClose = () => setOpenModal(false)

  const handleSaveNotes = async () => {
    if (!objectId || !notes.trim()) {
      setResponseMsg('Object ID and notes are required')
      return
    }
    setLoading(true)
    setResponseMsg('')
    const jsonData = JSON.stringify({
      object_id: objectId,
      notes: notes,
    })
    try {
      const res = await saveNotes(jsonData)
      if (res && res.status === 200) {
        setNotes(notes)
        setResponseMsg('✅ Notes saved successfully!')
        dispatch(openSnackbar('Notes saved successfully!', 'green'))
        const updatedProfile = profile.map((candidate) => {
          if (candidate.resume_data?.id === objectId || candidate.id === objectId) {
            return {
              ...candidate,
              resume_data: {
                ...candidate.resume_data,
                notes: notes
              }
            }
          }
          return candidate
        })
        setProfile(updatedProfile)
        setTimeout(() => {
          handleNotesClose()
        }, 1500)
      } else {
        setResponseMsg('Error saving notes. Please try again.')
        dispatch(openSnackbar('Failed to save notes. Please try again.', 'red'))
      }
    } catch (err: any) {
      setResponseMsg('Something went wrong: ' + err.message)
      dispatch(openSnackbar('Something went wrong while saving notes.', 'red'))
    } finally {
      setLoading(false)
    }
  }

  const handleNotesClick = (candidate: any) => {
    setSelectedCandidateForNotes(candidate)
    setObjectId(candidate.resume_data?.id || candidate.id)
    setNotes(candidate.resume_data?.notes || '')
    setNotesText(candidate.resume_data?.notes || '')
    setResponseMsg('')
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
    const organisation = localStorage.getItem('organisation')
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
      const response = await getAllResume(jsonData, organisation)
      if (response) {
        setProfile(response)
        setProfileLength(response.length)
        setNoFilterProfiles(response)
      }
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
      setUserId(response.user_id)
      const filteredJobs = response.job_description.filter(
        (job: any) => job.type === 'active' && job.deleteStatus !== 'deleted',
      )
      const filteredCollections = response.collection.filter(
        (item: any) => item.deleteStatus !== 'deleted',
      )
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

  const handleOpen1 = async (proId: any) => {
    const jsonData = {
      resume_id: [proId],
    }
    try {
      const res = await postResume(jsonData)
      setBase64Pdf(res[0].file_data)
      setOpenModal1(true)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCandidates([])
      setSelectAll(false)
    } else {
      const allResumeIds = filteredData.map((candidate) =>
        candidate.resume_data.id || candidate.id
      ).filter(id => id !== null && id !== undefined)
      setSelectedCandidates(allResumeIds)
      setSelectAll(true)
    }
  }

  const handleOpenModal = () => {
    if (selectedCandidates.length === 0) {
      console.log('Please select at least one candidate')
      return
    }
    setOpenModal(true)
  }

  const handleLocChange = (event: React.SyntheticEvent, newValue: any) => {
    setSelectedLoc(newValue)
  }

  const handleAddJobToCollection = async (jobId: number) => {
    try {
      const resumeIds = selectedCandidates.filter((id) => id !== null && id !== undefined)
      if (resumeIds.length === 0) {
        console.warn('No valid resume IDs found for selected candidates.')
        return
      }
      const selectedJob = jobs.find((job) => job.jobid === jobId)
      const collectionName = selectedJob?.job_title || 'Unknown Job'
      await saveJdCollectionName(
        collectionName,
        resumeIds,
        jobId.toString(),
        organisation || '',
      )
      setOpenModal(false)
      setSelectedCandidates([])
      setSelectAll(false)
      await getAllCollection()
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

  const handleClose1 = () => setOpenModal1(false)

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

  const [selectedDesignation, setSelectedDesignation] = useState<string | any>(null)

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
    setCurrentPage(1)
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const [selectedLocation, setSelectedLocation] = useState('')
  const handleLocation = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(event.target.value)
  }

  const [selectedInterviewStatus, setSelectedInterviewStatus] = useState('')
  const handleInterviewStatus = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedInterviewStatus(event.target.value)
  }

  const filteredData = profile.filter((item) => {
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
    const expMatch = experienceRange
      ? item.resume_data.experiance_in_number >= experienceRange.min &&
        item.resume_data.experiance_in_number <= experienceRange.max
      : true
    const locMatch = selectedLocation
      ? item.resume_data.location
          .toLowerCase()
          .startsWith(selectedLocation.toLowerCase())
      : true
    const desigMatch = selectedJobRole
      ? item.resume_data.Resume_Category.toLowerCase().startsWith(
          selectedJobRole.toLowerCase(),
        )
      : true
    return skillMatch && expMatch && locMatch && desigMatch
  })

  const getCurrentPageResumes = () => {
    const startIndex = (currentPage - 1) * resumesPerPage
    const endIndex = startIndex + resumesPerPage
    return filteredData.slice(startIndex, endIndex)
  }

  const totalPages = Math.ceil(filteredData.length / resumesPerPage)

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
  ]

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

  const [selectedStatus, setSelectedStatus] = useState('Select Status')

  useEffect(() => {
    handleSkillChange()
  }, [selectedExperience, selectedLoc, value, selectedRole, inputValue])

  useEffect(() => {
    if (profile.length > 0 && noFilterProfiles.length === 0) {
      setNoFilterProfiles(profile)
    }
  }, [profile, noFilterProfiles.length])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedExperience, selectedLoc, value, selectedRole, inputValue, filteredData.length])

  return (
    <div
      style={{
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '80vh',
        padding: '12px',
      }}
    >
      <Header
        title="Review Resume"
        userProfileImage={''}
        path="/jdccollection"
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding: '12px',
          gap: '6px',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: '1 1 160px', minWidth: '140px', flexShrink: 0 }}>
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
                fontSize: '16px',
                border: '2px solid #0284C7',
                borderRadius: '12px',
                alignItems: 'center',
                background: '#ffffff',
                justifyContent: 'center',
                height: '42px',
                direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
              },
              startAdornment: (
                <IconButton size="small">
                  <SearchIcon sx={{ color: '#0284C7', fontSize: '20px' }} />
                </IconButton>
              ),
            }}
          />
        </div>

        <div style={{ flex: '1 1 140px', minWidth: '120px', flexShrink: 0 }}>
          <Autocomplete
            id="combo-box-demo"
            options={exp}
            inputValue={inputExpValue}
            onInputChange={(event, newInputValue) => {
              setInputExpValue(newInputValue)
            }}
            sx={{
              height: '42px',
              borderRadius: '12px',
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
                placeholder={t('experience')}
                {...params}
                sx={{
                  '& input': {
                    backgroundColor: '#FFFFFF !important',
                    fontSize: '16px',
                    height: '10px',
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

        <div style={{ flex: '1 1 140px', minWidth: '120px', flexShrink: 0 }}>
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
              height: '42px',
              borderRadius: '12px',
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
                    fontSize: '16px',
                    height: '10px',
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

        <div style={{ flex: '1 1 160px', minWidth: '150px', flexShrink: 0 }}>
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
                    fontSize: '14px',
                    height: '24px',
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
                    borderRadius: '12px',
                    width: '100%',
                    fontSize: '16px',
                    border: '2px solid #0284C7',
                    minHeight: '42px',
                    height: 'auto',
                    padding: '6px',
                    direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
                    overflow: 'auto',
                  },
                  ...params.InputProps,
                }}
                sx={{
                  '& input': {
                    color: '#000000',
                    fontSize: '16px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                  '& textarea': {
                    color: '#000000',
                    fontSize: '16px',
                    lineHeight: '1.3',
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
                  margin: '2px',
                  fontSize: '14px',
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
                padding: '3px',
                minHeight: '42px',
                height: 'auto',
                alignItems: 'flex-start',
                '& .MuiAutocomplete-inputRoot': {
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                },
              },
            }}
          />
        </div>

        <div style={{ flex: '1 1 100px', minWidth: '90px', flexShrink: 0 }}>
          <input
            type="date"
            style={{
              width: '80%',
              height: '42px',
              padding: '0px 8px',
              border: '2px solid #0284C7',
              borderRadius: '12px',
              fontSize: '16px',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ flex: '0 0 80px', flexShrink: 0 }}>
          <Button
            onClick={handleReset}
            style={{
              color: '#FFFFFF',
              backgroundColor: '#0284C7',
              borderRadius: '12px',
              textTransform: 'none',
              width: '100%',
              height: '42px',
              fontSize: '14px',
              margin: '0',
            }}
          >
            Reset
          </Button>
        </div>

        <div style={{ flex: '0 0 90px', flexShrink: 0 }}>
          <Button
            onClick={handleSkillChange}
            style={{
              color: '#FFFFFF',
              backgroundColor: '#0284C7',
              borderRadius: '12px',
              textTransform: 'none',
              width: '100%',
              height: '42px',
              fontSize: '14px',
              margin: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <SearchIcon sx={{ fontSize: '20px' }} />
            Search
          </Button>
        </div>

        <div style={{ flex: '0 0 90px', flexShrink: 0 }}>
          <button
            onClick={handleSelectAll}
            style={{
              width: '100%',
              height: '42px',
              padding: '10px 14px',
              backgroundColor: selectAll ? '#0284C7' : '#F3F4F6',
              border: '2px solid #D1D5DB',
              borderRadius: '12px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: selectAll ? '#FFFFFF' : '#000000',
            }}
          >
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              style={{ margin: 0, transform: 'scale(1.0)' }}
            />
            {selectAll ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          marginLeft: '24px',
          position: 'relative',
        }}
        className="candidate-list"
      >
        <div style={{ paddingBottom: '8px' }}>
          {selectedCandidates.length > 0 && (
            <div
              style={{
                padding: '8px 20px',
                backgroundColor: '#dbeafe',
                borderBottom: '1px solid #93c5fd',
                fontSize: '16px',
                color: '#1e40af',
                fontWeight: '500',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
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
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear Selection
              </button>
            </div>
          )}

          {profile.length === 0 ? (
            <div
              style={{
                padding: '48px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '18px',
              }}
            >
              Loading...
            </div>
          ) : (
            getCurrentPageResumes().map((candidate, index) => (
              <div
                key={candidate.id || index}
                style={{
                  height: '90px',
                  padding: '6px 24px',
                  borderBottom: index < getCurrentPageResumes().length - 1 ? '1px solid #e5e7eb' : 'none',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'flex-start',
                  overflow: 'hidden',
                }}
              >
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
                    flexShrink: 0,
                  }}
                />

                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#0284C7',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                    flexShrink: 0,
                  }}
                >
                  {getInitials(candidate.resume_data?.name || 'NA')}
                </div>

                <div style={{ flex: 1, display: 'flex', gap: '10px', minWidth: 0 }}>
                  <div style={{ flex: '0 0 220px', minWidth: 0 }}>
                    <h3
                      style={{
                        margin: '0 0 4px 0',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#0284C7',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontFamily: 'SF Pro Display',
                      }}
                    >
                      {candidate.resume_data?.name || 'N/A'}
                    </h3>
                    <span
                      style={{
                        margin: '0 0 6px 0',
                        fontSize: '14px',
                        color: '#6b7280',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      Current Position:
                    </span>
                    <span
                      style={{
                        margin: '0 0 6px 0',
                        fontSize: '14px',
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
                        gap: '2px',
                        fontSize: '12px',
                        color: '#6b7280',
                        marginBottom: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ fontWeight: '500', minWidth: '35px' }}>Exp:</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', color: '#1C1C1E' }}>
                          {candidate.resume_data?.experiance_in_number || 'N/A'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ fontWeight: '500', minWidth: '35px' }}>Loc:</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', color: '#1C1C1E' }}>
                          {candidate.resume_data?.location || 'N/A'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ fontWeight: '500', minWidth: '35px' }}>Tel:</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', color: '#1C1C1E' }}>
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
                      margin: '0 12px',
                    }}
                  />

                  <div
                    style={{
                      fontSize: '0.875rem',
                      color: '#4B5563',
                      fontFamily: 'SF Pro Display',
                      flex: 1,
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      justifyContent: 'space-between',
                      height: '88px',
                    }}
                  >
                    <Typography
                      variant="inherit"
                      style={{
                        margin: 0,
                        fontFamily: 'SF Pro Display',
                        fontWeight: 400,
                        fontSize: '14px',
                        color: '#4B5563',
                        maxHeight: '4.8em',
                        overflowY: 'auto',
                        lineHeight: '1.3em',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        wordBreak: 'break-word',
                        padding: '6px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          fontFamily: 'SF Pro Display',fontSize: '14px',
                        }}
                      >
                        About:
                      </span>{' '}
                      {candidate.resume_data?.profile_summary || 'N/A'}
                    </Typography>

                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-start', marginTop: '6px', flexShrink: 0 }}>
                      <Button
                        variant="outlined"
                        style={{
                          fontSize: '12px',
                          padding: '4px 10px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          color: '#4B5563',
                          fontFamily: 'SF Pro Display',
                          textTransform: 'inherit',
                          minWidth: '80px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          height: '20px',
                        }}
                        onClick={() => handleOpen1(candidate.resume_data?.id)}
                      >
                        View CV
                      </Button>

                      <Button
                        variant="outlined"
                        style={{
                          fontSize: '12px',
                          padding: '4px 10px',
                          border: candidate.resume_data?.notes ? '1px solid #0284C7' : '1px solid #E5E7EB',
                          borderRadius: '6px',
                          backgroundColor: candidate.resume_data?.notes ? '#f0f9ff' : 'white',
                          color: candidate.resume_data?.notes ? '#0284C7' : '#4B5563',
                          fontFamily: 'SF Pro Display',
                          textTransform: 'inherit',
                          minWidth: '60px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          height: '20px',
                        }}
                        onClick={() => handleNotesClick(candidate)}
                      >
                        {candidate.resume_data?.notes ? 'Notes ✓' : 'Notes'}
                      </Button>
                    </div>
                  </div>

                  <div style={{ width: '120px', flexShrink: 0 }}>
                    <h4
                      style={{
                        margin: '0 0 6px 0',
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
                        gap: '2px',
                        maxHeight: '60px',
                        overflow: 'hidden',
                      }}
                    >
                      {(candidate.resume_data?.skills || [])
                        .slice(0, 4)
                        .map((skill: any, idx: any) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '11px',
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
                                width: '4px',
                                height: '4px',
                                backgroundColor: '#d1d5db',
                                borderRadius: '50%',
                                marginRight: '6px',
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

                  <div style={{ width: '100px', flexShrink: 0 }}>
                    <Typography
                      variant="inherit"
                      style={{
                        margin: 0,
                        fontSize: '11px',
                        color: '#6b7280',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                    </Typography>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4px 20px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}
        >
          <div style={{ fontSize: '16px', color: '#6b7280' }}>
            Showing {((currentPage - 1) * resumesPerPage) + 1} to {Math.min(currentPage * resumesPerPage, filteredData.length)} of {filteredData.length} resumes
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '6px 12px',
                backgroundColor: currentPage === 1 ? '#f3f4f6' : '#ffffff',
                color: currentPage === 1 ? '#9ca3af' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '500',
              }}
            >
              Previous
            </button>

            <div style={{ display: 'flex', gap: '4px' }}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber: any;
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
                      padding: '6px 10px',
                      backgroundColor: currentPage === pageNumber ? '#0284C7' : '#ffffff',
                      color: currentPage === pageNumber ? '#ffffff' : '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      minWidth: '32px',
                    }}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px 12px',
                backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#ffffff',
                color: currentPage === totalPages ? '#9ca3af' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: '500',
              }}
            >
              Next
            </button>

            <button
              aria-label="Add selected candidates to collection"
              style={{
                padding: '8px 16px',
                backgroundColor: selectedCandidates.length > 0 ? '#0284C7' : '#9CA3AF',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: selectedCandidates.length > 0 ? 'pointer' : 'not-allowed',
                marginLeft: '12px',
                whiteSpace: 'nowrap',
              }}
              onClick={selectedCandidates.length > 0 ? handleOpenModal : undefined}
              onKeyDown={(e) => e.key === 'Enter' && selectedCandidates.length > 0 && handleOpenModal()}
            >
              {selectedCandidates.length > 0
                ? `${t('addCollectionBtn')} (${selectedCandidates.length})`
                : t('addCollectionBtn')}
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
            width: 450,
            bgcolor: 'white',
            borderRadius: '10px',
            boxShadow: 24,
            p: 5,
          }}
        >
          <h2
            id="job-selection-modal"
            style={{
              margin: '0 0 20px 0',
              fontSize: '20px',
              fontWeight: '600',
            }}
          >
            {t('selectJobTitle')}
          </h2>
          {jobs.length === 0 ? (
            <Typography
              variant="inherit"
              style={{ color: '#6b7280', fontSize: '16px' }}
            >
              No active jobs available.
            </Typography>
          ) : (
            <div
              style={{
                maxHeight: '220px',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#d1d5db #f8fafc',
              }}
              className="job-list"
            >
              <style>
                {`
                  .job-list::-webkit-scrollbar {
                    width: 12px;
                  }
                  .job-list::-webkit-scrollbar-track {
                    background: #f8fafc;
                  }
                  .job-list::-webkit-scrollbar-thumb {
                    background: #9ca3af;
                    borderRadius: 6px;
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
                    padding: '10px 0',
                    cursor: 'pointer',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                  onClick={() => handleAddJobToCollection(job.jobid)}
                >
                  <span style={{ fontSize: '16px', color: '#1f2937' }}>
                    {job.job_title} ({job.job_role || 'N/A'})
                  </span>
                </div>
              ))}
            </div>
          )}
          <Button
            onClick={handleCloseModal}
            sx={{ mt: 3, textTransform: 'none', fontSize: '16px' }}
          >
            {t('cancelBtn')}
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openModal1}
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
                padding: '12px 0px 0px 120px',
              }}
            ></iframe>
            <CloseIcon
              onClick={handleClose1}
              style={{
                top: '30px',
                right: '0px',
                width: '30px',
                height: '30px',
                color: '#000000',
                position: 'absolute',
                background: '#FFFFFF',
                padding: '2px',
              }}
            />
          </div>
        </Box>
      </Modal>

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
            width: 550,
            bgcolor: 'white',
            borderRadius: '10px',
            boxShadow: 24,
            p: 5,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2
              id="notes-modal"
              style={{
                margin: 0,
                fontSize: '20px',
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
                fontSize: '24px',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <Typography
              variant="inherit"
              style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#374151', fontWeight: '500' }}
            >
              Candidate: {selectedCandidateForNotes?.resume_data?.name || 'N/A'}
            </Typography>
            <Typography
              variant="inherit"
              style={{ margin: 0, fontSize: '16px', color: '#6b7280' }}
            >
              Position: {selectedCandidateForNotes?.resume_data?.Resume_Category || 'N/A'}
            </Typography>
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
              marginBottom: '24px',
              '& .MuiOutlinedInput-root': {
                fontSize: '16px',
                fontFamily: 'SF Pro Display',
              },
            }}
          />
          {responseMsg && (
            <Typography
              variant="inherit"
              style={{
                marginBottom: '24px',
                color: responseMsg.includes('✅') ? 'green' : 'red',
                fontSize: '15px',
                fontFamily: 'SF Pro Display',
              }}
            >
              {responseMsg}
            </Typography>
          )}

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleNotesClose}
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderColor: '#d1d5db',
                color: '#6b7280',
                fontSize: '16px',
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
                fontSize: '16px',
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