import React, { useState, useRef, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { loaderOff, loaderOn, openSnackbar } from '../redux/actions';
import { putResume } from '../services/JobService';
import { getAllResume, getResumeById } from '../services/ResumeService';
import { getUserDetails } from '../services/UserService';
import Header from '../CommonComponents/topheader';
import axios from 'axios';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  autocomplete: {},
  inputRoot: {
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      minHeight: 'auto',
    },
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-tag': {
      margin: '2px',
      height: 'auto',
    },
  },
});

interface Collection {
  collection_name: string;
  collection_id: number;
}

interface Job {
  type: 'job';
  jobid: number;
  job_title: any;
  skills: any;
  experience_required: any;
  location: any;
  resume_data: any;
}

interface Profile {
  id: any;
  name?: any;
  skills?: any;
  experience_in_number?: any;
  phone?: any;
  location?: any;
  Resume_Category?: any;
  work?: any;
  pdf_data?: any;
  resume_data?: {
    id: any;
    skills: any;
    experience_in_number: any;
    name: any;
    Resume_Category: any;
    work: any;
    phone: any;
    location: any;
    pdf_data: any;
  };
  score: any;
}

const JdProfile = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [profile, setProfile] = React.useState<Profile[]>([]);
  const [profileLength, setProfileLength] = useState<number>(0);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [value, setValue] = useState<any[]>([]);
  const [collectionNames, setCollectionNames] = useState<Collection[]>([]);
  const [userId, setUserId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [collection, setCollection] = useState<string | number>('');
  const [resumes, setResumes] = useState<any[]>([]);
  const [resumeId, setResumeId] = useState<any[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const organisation = localStorage.getItem('organisation');
  const searchRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<any | null>('');
  const [inputExpValue, setInputExpValue] = useState<string>('');
  const [inputLocValue, setInputLocValue] = useState<string>('');
  const { t } = useTranslation();
  const { jobId } = useParams();
  const token = localStorage.getItem('token');
  const [currentPage, setCurrentPage] = useState(1);
  const [resumesPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noFilterProfiles, setNoFilterProfiles] = useState<any[]>([]);
  const [scoredResumes, setScoredResumes] = useState<{ [key: string]: number }>({});
  const dispatch = useDispatch();

  const fetchScoredResumes = async () => {
    if (!jobId) {
      console.warn('No jobId provided');
      setError(t('noJobIdProvided'));
      return;
    }
    if (!organisation) {
      console.warn('No organisation provided');
      setError(t('organisationNotFound'));
      dispatch(openSnackbar(t('organisationNotFound'), 'red'));
      return;
    }

    const jobIdNum = parseInt(jobId, 10);
    console.log('Fetching scored resumes for jobId:', jobIdNum);
    setLoading(true);
    setError(null); // Clear any previous error
    dispatch(loaderOn());

    try {
      const response = await axios.post(
        `http://localhost:8000/count_scored_resumes_for_jd/`,
        { job_id: jobIdNum },
        {
          headers: {
            Organization: organisation,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('API Response:', response.data);
      // Check if response contains scored_resumes and handle empty array case
      if (response.status === 200 && Array.isArray(response.data.scored_resumes)) {
        const formattedProfiles = response.data.scored_resumes.map((resume: any) => ({
          id: resume.resume_id,
          resume_data: {
            id: resume.resume_id,
            name: resume.resume_data.name,
            skills: resume.resume_data.skills,
            experience_in_number: resume.resume_data.experiance_in_number,
            phone: resume.resume_data.phone,
            location: resume.resume_data.location,
            Resume_Category: resume.resume_data.Resume_Category,
            work: resume.resume_data.work,
            pdf_data: resume.resume_data.file_name,
          },
          score: resume.score,
        }));
        setScoredResumes({ [jobId]: response.data.scored_resumes_count || 0 });
        setProfile(formattedProfiles);
        setNoFilterProfiles(formattedProfiles);
        setProfileLength(formattedProfiles.length);
        if (formattedProfiles.length === 0) {
          setError(t('noResumesFound')); // Set error only if no resumes are found
        }
      } else {
        setError(t('invalidResponseFormat'));
        setProfile([]);
        setNoFilterProfiles([]);
        setProfileLength(0);
      }
      setLoading(false);
      dispatch(loaderOff());
    } catch (err) {
      console.error('Error fetching scored resumes:', err);
      setError(t('failedToFetchScoredResumes'));
      setProfile([]);
      setNoFilterProfiles([]);
      setProfileLength(0);
      setLoading(false);
      dispatch(loaderOff());
      dispatch(openSnackbar(t('failedToFetchScoredResumes'), 'red'));
    }
  };

  useEffect(() => {
    fetchScoredResumes();
  }, [jobId]);

  const handleProfile = async (jobIdParam: any) => {
    console.log('Selected Job ID:', jobIdParam);
    if (!jobIdParam) {
      console.warn('No Job ID provided.');
      setError('No Job ID provided.');
      return;
    }

    setLoading(true);
    setError(null);
    setCollection(jobIdParam);

    try {
      const selectedJob = jobs.find((job) => job.jobid === parseInt(jobIdParam));
      if (!selectedJob) {
        console.warn('No matching job found for the provided Job ID.');
        setError('No matching job found for the provided Job ID.');
        return;
      }

      console.log('Selected Job:', selectedJob);
      const resumeDataArray = selectedJob.resume_data || [];
      if (resumeDataArray.length === 0) {
        console.warn('No resumes found for the selected job.');
        setError('No resumes found for the selected job.');
        setProfile([]);
        setNoFilterProfiles([]);
        return;
      }

      const resumeIds = resumeDataArray.map((resume: any) => resume.id);
      console.log('Resume IDs found:', resumeIds);
      console.log('Total resumes to fetch:', resumeIds.length);

      const requestData = { resume_id: resumeIds };
      const resumeResponse = await getResumeById(requestData);
      if (resumeResponse && Array.isArray(resumeResponse)) {
        const resumeData = resumeResponse.map((resume: any) => resume.resume_data || resume);
        console.log('Fetched Resume Data:', resumeData);
        setProfile(resumeData);
        setNoFilterProfiles(resumeData);
        setProfileLength(resumeData.length);
      } else {
        console.error('Invalid response format from getResumeById');
        setError('Invalid response format from server.');
        setProfile([]);
        setNoFilterProfiles([]);
      }
    } catch (error) {
      console.error('Error fetching resumes for the selected job:', error);
      setError('Failed to fetch resumes for the selected job.');
      setProfile([]);
      setNoFilterProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8082/user/read/${organisation}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API response:', response.data);
        if (Array.isArray(response.data.job_description)) {
          setJobs(response.data.job_description);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Unexpected response format from server.');
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to fetch job data.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const saveJdCollectionName = async (
    collectionName: string,
    resumeIds: any[],
    jobId: string,
    organisation: string,
  ) => {
    const resumedata = resumeIds.map((id) => ({ id, status: 'accepted' }));
    const Jobdata = { resume_data: resumedata };
    try {
      const res = await putResume(jobId, Jobdata, organisation);
      dispatch(
        openSnackbar(
          `${t('storedResume')} ${resumeIds.length} ${t('resumesIn')} ${collectionName} ${t('jdCollectionBtn')}`,
          'green',
        ),
      );
      dispatch(loaderOff());
    } catch (error) {
      console.error('Error storing resumes:', error);
      throw error;
    }
  };

  const handleExpChange = (event: React.SyntheticEvent, newValue: any) => {
    setSelectedExperience(newValue);
  };

  const autocompleteRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (jobId) {
      handleProfile(jobId);
    }
  }, [jobId, jobs]);

  type CombinedData = Job | Collection;
  const combinedData: CombinedData[] = [
    ...jobs.map(
      (job): Job => ({
        ...job,
        type: 'job',
      }),
    ),
  ];

  const classes = useStyles();

  const getAllCollection = async () => {
    try {
      const response = await getUserDetails(organisation);
      console.log('This is the response', response);
      setUserId(response.user_id);
      const filteredJobs = response.job_description.filter(
        (job: any) => job.type === 'active' && job.deleteStatus !== 'deleted',
      );
      const filteredCollections = response.collection.filter(
        (item: any) => item.deleteStatus !== 'deleted',
      );
      setJobs(filteredJobs);
      setCollectionNames(filteredCollections);
    } catch (error) {
      console.log('error' + error);
    }
  };

  const toggleSelectCandidate = (candidateId: any) => {
    setSelectedCandidates((prev: any) =>
      prev.includes(candidateId)
        ? prev.filter((id: any) => id !== candidateId)
        : [...prev, candidateId],
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCandidates([]);
      setSelectAll(false);
    } else {
      const allResumeIds = filteredData.map((candidate) => {
        if (!candidate) return null;
        return candidate?.resume_data?.id || candidate?.id;
      }).filter(id => id !== null && id !== undefined);
      setSelectedCandidates(allResumeIds);
      setSelectAll(true);
    }
  };

  const handleSelectAllResumes = () => {
    const allResumeIds = profile.map((candidate) => {
      if (!candidate) return null;
      return candidate?.resume_data?.id || candidate?.id;
    }).filter(id => id !== null && id !== undefined);
    setSelectedCandidates(allResumeIds);
    setSelectAll(true);
  };

  const handleOpenModal = () => {
    if (selectedCandidates.length === 0) {
      dispatch(openSnackbar(t('pleaseSelectAtLeastOneCandidateSnackbar'), 'light blue'));
      return;
    }
    setOpenModal(true);
  };

  const handleLocChange = (event: React.SyntheticEvent, newValue: any) => {
    setSelectedLoc(newValue);
  };

  const handleAddJobToCollection = async (jobId: number) => {
    try {
      const resumeIds = selectedCandidates.filter((id) => id !== null && id !== undefined);
      if (resumeIds.length === 0) {
        dispatch(openSnackbar('No valid resumes selected', 'red'));
        return;
      }

      const selectedJob = jobs.find((job) => job.jobid === jobId);
      const collectionName = selectedJob?.job_title || 'Unknown Job';
      dispatch(openSnackbar(`Adding ${resumeIds.length} resumes to collection...`, 'blue'));
      await saveJdCollectionName(collectionName, resumeIds, jobId.toString(), organisation || '');
      setOpenModal(false);
      setSelectedCandidates([]);
      setSelectAll(false);
      await getAllCollection();
      dispatch(openSnackbar(`Successfully added ${resumeIds.length} resumes to collection: ${collectionName}`, 'green'));
    } catch (error) {
      console.error('Error adding resumes to collection:', error);
      dispatch(openSnackbar('Failed to add resumes to collection', 'red'));
    }
  };

  useEffect(() => {
    if (inputValue === null) {
      setInputValue('');
    }
  }, [inputValue]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const colors = {
    green: '#dcfce7',
    blue: '#dbeafe',
    orange: '#fed7aa',
    yellow: '#fef3c7',
  };

  const getInsightBadgeColor = (color: keyof typeof colors) => {
    return colors[color] || colors.blue;
  };

  const getProfileInsights = (candidate: any) => {
    if (candidate.rating && candidate.rating > 4) {
      return { insight: 'Top Candidate', color: 'green' };
    } else if (candidate.experience && parseInt(candidate.experience) > 3) {
      return { insight: 'Lead Promising', color: 'blue' };
    } else if (candidate.status === 'rejected') {
      return { insight: 'Good to Reject', color: 'orange' };
    } else if (candidate.followUp) {
      return { insight: 'Follow Up Required', color: 'yellow' };
    }
    return { insight: 'Not Relevant', color: 'blue' };
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  };

  const [selectedJobRole, setSelectedJobRole] = useState('');
  const handleJobRole = (event: any) => {
    setSelectedJobRole(event.target.value);
  };

  const [selectedRangeExperience, setSelectedRangeExperience] = useState('');
  const [experienceRange, setExperienceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const handleRangeExperience = (event: any) => {
    const value = event.target.value;
    setSelectedRangeExperience(value);
    if (value === '5+') {
      setExperienceRange({ min: 5, max: Infinity });
    } else if (value.includes('-')) {
      const [min, max] = value.split('-').map(Number);
      setExperienceRange({ min, max });
    } else {
      setExperienceRange(null);
    }
  };

  const [selectedDesignation, setSelectedDesignation] = useState<string | any>(null);

  const handleReset = () => {
    setSelectedDesignation('');
    setSelectedExperience('');
    setSelectedSkill([]);
    setSelectedLoc('');
    setValue([]);
    setInputValue('');
    setInputExpValue('');
    setSelectedRole('');
    setSelectedCandidates([]);
    setSelectAll(false);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const [selectedLocation, setSelectedLocation] = useState('');
  const handleLocation = (event: any) => {
    setSelectedLocation(event.target.value);
  };

  const [selectedInterviewStatus, setSelectedInterviewStatus] = useState('');
  const handleInterviewStatus = (event: any) => {
    setSelectedInterviewStatus(event.target.value);
  };

  const [searchCandidate, setSearchCandidate] = useState('');

  const handleSearch = (value: string) => {
    setSearchCandidate(value);
  };

  const filteredData = profile.filter((item) => {
    const name = item?.resume_data?.name || item?.name || '';
    const nameMatch = searchCandidate
      ? name.toLowerCase().includes(searchCandidate.toLowerCase())
      : true;

    const resumeSkills = item?.resume_data?.skills || item?.skills || [];
    const normalizedResumeSkills = resumeSkills.map((skill: any) =>
      typeof skill === 'string' ? skill.toLowerCase() : (skill?.name || skill?.skill || '').toLowerCase()
    );
    const normalizedValue = value.length > 0
      ? value.map((skill: any) => skill.toLowerCase())
      : [];
    const skillMatch =
      normalizedValue.length === 0 ||
      normalizedValue.some(
        (skill: any) =>
          normalizedResumeSkills.includes(skill) ||
          normalizedResumeSkills.some((resumeSkill: any) =>
            resumeSkill.includes(skill)
          ),
      );

    const experience = item?.resume_data?.experience_in_number || item?.experience_in_number;
    const expMatch = experienceRange
      ? experience >= experienceRange.min && experience <= experienceRange.max
      : true;

    const location = item?.resume_data?.location || item?.location || '';
    const locMatch = selectedLocation
      ? location.toLowerCase().includes(selectedLocation.toLowerCase())
      : true;

    const category = item?.resume_data?.Resume_Category || item?.Resume_Category || '';
    const desigMatch = selectedJobRole
      ? category.toLowerCase().includes(selectedJobRole.toLowerCase())
      : true;

    const statusMatch = selectedInterviewStatus === 'Select Status' || !selectedInterviewStatus
      ? true
      : getProfileInsights(item).insight === selectedInterviewStatus;

    return nameMatch && skillMatch && expMatch && locMatch && desigMatch && statusMatch;
  });

  const getCurrentPageResumes = () => {
    const startIndex = (currentPage - 1) * resumesPerPage;
    const endIndex = startIndex + resumesPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredData.length / resumesPerPage);

  const getTotalFilteredResumes = () => {
    return filteredData.length;
  };

  useEffect(() => {
    const allResumeIds = filteredData.map((candidate) =>
      candidate?.resume_data?.id || candidate?.id
    ).filter(id => id !== null && id !== undefined);
    const allSelected = allResumeIds.length > 0 &&
      allResumeIds.every(id => selectedCandidates.includes(id));
    setSelectAll(allSelected);
  }, [selectedCandidates, filteredData]);

  const loc: any = [
    'Bengaluru',
    'Hyderabad',
    'Chennai',
    'Mumbai',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
  ];

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
  ];

  return (
    <div
      style={{
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Header
        title="JD Collection"
        userProfileImage={''}
        path="/jdcollection"
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding: '10px',
          gap: '4px',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: '1 1 140px', minWidth: '120px', flexShrink: 0 }}>
          <TextField
            id="name-search"
            variant="standard"
            autoComplete="off"
            placeholder="Search by name"
            value={searchCandidate}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            style={{ width: '100%' }}
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
                direction: 'ltr',
              },
              startAdornment: (
                <IconButton size="small">
                  <SearchIcon sx={{ color: '#0284C7', fontSize: '18px' }} />
                </IconButton>
              ),
            }}
          />
        </div>
        <div style={{ flex: '1 1 140px', minWidth: '120px', flexShrink: 0 }}>
          <TextField
            id="filled-basic"
            variant="standard"
            autoComplete="off"
            placeholder={t('designation')}
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
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
                direction: 'ltr',
              },
              startAdornment: (
                <IconButton size="small">
                  <SearchIcon sx={{ color: '#0284C7', fontSize: '18px' }} />
                </IconButton>
              ),
            }}
          />
        </div>
        <div style={{ flex: '1 1 120px', minWidth: '100px', flexShrink: 0 }}>
          <select
            value={selectedExperience || ''}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedExperience(value);
              setInputExpValue(value);
              if (value === '1-3') {
                setExperienceRange({ min: 1, max: 3 });
              } else if (value === '2-5') {
                setExperienceRange({ min: 2, max: 5 });
              } else if (value === '3-6') {
                setExperienceRange({ min: 3, max: 6 });
              } else if (value === '6-8') {
                setExperienceRange({ min: 6, max: 8 });
              } else if (value === '8-10') {
                setExperienceRange({ min: 8, max: 10 });
              } else if (value === '10-12') {
                setExperienceRange({ min: 10, max: 12 });
              } else if (value === '12-15') {
                setExperienceRange({ min: 12, max: 15 });
              } else if (value === '15-18') {
                setExperienceRange({ min: 15, max: 18 });
              } else if (value === '18-20') {
                setExperienceRange({ min: 18, max: 20 });
              } else {
                setExperienceRange(null);
              }
            }}
            style={{
              width: '100%',
              height: '38px',
              padding: '8px 10px',
              border: '2px solid #0284C7',
              borderRadius: '10px',
              fontSize: '12px',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="">Select Experience</option>
            {exp.map((option: string) => (
              <option key={option} value={option}>
                {option} years
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: '1 1 120px', minWidth: '100px', flexShrink: 0 }}>
          <select
            value={selectedLocation}
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              setInputLocValue(e.target.value);
            }}
            style={{
              width: '100%',
              height: '38px',
              padding: '8px 10px',
              border: '2px solid #0284C7',
              borderRadius: '10px',
              fontSize: '12px',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="">Select Location</option>
            {loc.map((location: string) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: '1 1 120px', minWidth: '100px', flexShrink: 0 }}>
          <select
            value={selectedInterviewStatus}
            onChange={(e) => setSelectedInterviewStatus(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              padding: '8px 10px',
              border: '2px solid #0284C7',
              borderRadius: '10px',
              fontSize: '12px',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="">Select Status</option>
            <option value="Top Candidate">Top Candidate</option>
            <option value="Lead Promising">Lead Promising</option>
            <option value="Good to Reject">Good to Reject</option>
            <option value="Follow Up Required">Follow Up Required</option>
            <option value="Not Relevant">Not Relevant</option>
          </select>
        </div>
        <div style={{ flex: '1 1 140px', minWidth: '140px', flexShrink: 0 }}>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={value}
            ref={autocompleteRef}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            onChange={(event, newValue) => {
              setValue(newValue);
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
                    height: '38px',
                    fontSize: '12px',
                    border: '2px solid #0284C7',
                  },
                  ...params.InputProps,
                }}
              />
            )}
            sx={{
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
          />
        </div>
        <div style={{ flex: '0 0 80px', flexShrink: 0 }}>
          <Button
            onClick={() => {
              setSearchCandidate('');
              setSelectedRole('');
              setSelectedExperience(null);
              setInputExpValue('');
              setSelectedLocation('');
              setInputLocValue('');
              setSelectedInterviewStatus('');
              setValue([]);
              setInputValue('');
              setExperienceRange(null);
            }}
            style={{
              color: '#FFFFFF',
              backgroundColor: '#dc2626',
              borderRadius: '10px',
              textTransform: 'none',
              width: '100%',
              height: '38px',
              fontSize: '11px',
              margin: '0',
            }}
          >
            Clear All
          </Button>
        </div>
        <div style={{ flex: '1 1 90px', minWidth: '80px', flexShrink: 0 }}>
          <input
            type="date"
            style={{
              width: '80%',
              height: '38px',
              padding: '0px 6px',
              border: '2px solid #0284C7',
              borderRadius: '10px',
              fontSize: '12px',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              outline: 'none',
            }}
          />
        </div>
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
        <div style={{ flex: '0 0 80px', flexShrink: 0 }}>
          <Button
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
              color: selectAll ? '#FFFFFF' : '#000000',
            }}
          >
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              style={{ margin: 0, transform: 'scale(0.8)' }}
            />
            {selectAll
              ? `Deselect All (${selectedCandidates.length})`
              : `Select All (${getTotalFilteredResumes()})`}
          </button>
        </div>
        {profile.length > filteredData.length && (
          <div style={{ flex: '0 0 100px', flexShrink: 0 }}>
            <button
              onClick={handleSelectAllResumes}
              style={{
                width: '100%',
                height: '38px',
                padding: '8px 12px',
                backgroundColor: '#059669',
                border: '2px solid #059669',
                borderRadius: '10px',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              Select All ({profile.length})
            </button>
          </div>
        )}
      </div>
      {(searchCandidate || selectedRole || selectedExperience || selectedLocation || selectedInterviewStatus || value.length > 0) && (
        <div
          style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            margin: '0 20px 16px 20px',
            fontSize: '12px',
            color: '#374151',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Active Filters:</strong>
              {searchCandidate && <span style={{ marginLeft: '8px', backgroundColor: '#dbeafe', padding: '2px 6px', borderRadius: '4px' }}>Name: {searchCandidate}</span>}
              {selectedRole && <span style={{ marginLeft: '8px', backgroundColor: '#dbeafe', padding: '2px 6px', borderRadius: '4px' }}>Role: {selectedRole}</span>}
              {selectedExperience && <span style={{ marginLeft: '8px', backgroundColor: '#dbeafe', padding: '2px 6px', borderRadius: '4px' }}>Experience: {selectedExperience}</span>}
              {selectedLocation && <span style={{ marginLeft: '8px', backgroundColor: '#dbeafe', padding: '2px 6px', borderRadius: '4px' }}>Location: {selectedLocation}</span>}
              {selectedInterviewStatus && <span style={{ marginLeft: '8px', backgroundColor: '#dbeafe', padding: '2px 6px', borderRadius: '4px' }}>Status: {selectedInterviewStatus}</span>}
              {value.length > 0 && <span style={{ marginLeft: '8px', backgroundColor: '#dbeafe', padding: '2px 6px', borderRadius: '4px' }}>Skills: {value.join(', ')}</span>}
            </div>
            <div>
              <strong>{filteredData.length} result{filteredData.length !== 1 ? 's' : ''} found</strong>
            </div>
          </div>
        </div>
      )}
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
        <div style={{ paddingBottom: '6px' }}>
          {selectedCandidates.length > 0 && (
            <div
              style={{
                padding: '6px 16px',
                backgroundColor: '#dbeafe',
                borderBottom: '1px solid #93c5fd',
                fontSize: '12px',
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
                  setSelectedCandidates([]);
                  setSelectAll(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1e40af',
                  fontSize: '11px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear Selection
              </button>
            </div>
          )}
{loading && (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '16px',
              }}
            >
              Loading resumes...
            </div>
          )}
          {!loading && error && profile.length === 0 && (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: '#dc2626',
                fontSize: '16px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                margin: '16px',
              }}
            >
              <div style={{ marginBottom: '8px', fontWeight: '600' }}>
                Error Loading Resumes
              </div>
              <div style={{ fontSize: '14px', color: '#991b1b' }}>
                {error}
              </div>
              <button
                onClick={fetchScoredResumes}
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Retry
              </button>
            </div>
          )}
          {!loading && profile.length > 0 && (
            getCurrentPageResumes().map((candidate, index) => (
              <div
                key={candidate.id || index}
                style={{
                  height: '60px',
                  padding: '10px 16px',
                  borderBottom: index < getCurrentPageResumes().length - 1 ? '1px solid #e5e7eb' : 'none',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  overflow: 'hidden',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedCandidates.includes(
                    candidate?.resume_data?.id || candidate?.id || index,
                  )}
                  onChange={() =>
                    toggleSelectCandidate(candidate?.resume_data?.id || candidate?.id || index)
                  }
                  style={{
                    width: '14px',
                    height: '14px',
                    marginTop: '2px',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                />
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
                  {getInitials(candidate?.resume_data?.name || candidate?.name || 'NA')}
                </div>
                <div style={{ flex: 1, display: 'flex', gap: '16px', minWidth: 0 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        margin: '0 0 2px 0',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {candidate?.resume_data?.name || candidate?.name || 'N/A'}
                    </h3>
                    <p
                      style={{
                        margin: '0 0 2px 0',
                        fontSize: '11px',
                        color: '#6b7280',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {candidate?.resume_data?.experience_in_number || candidate?.experience_in_number || 'N/A'} years
                    </p>
                    <p
                      style={{
                        margin: '0 0 2px 0',
                        fontSize: '11px',
                        color: '#6b7280',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {candidate?.resume_data?.location || candidate?.location || 'N/A'}
                    </p>
                    <p
                      style={{
                        margin: '0',
                        fontSize: '11px',
                        color: '#6b7280',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {candidate?.resume_data?.phone || candidate?.phone || 'N/A'}
                    </p>
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
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {candidate.resume_data?.experience_in_number || 'N/A'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ fontWeight: '500', minWidth: '30px' }}>Loc:</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {candidate.resume_data?.location || 'N/A'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ fontWeight: '500', minWidth: '30px' }}>Tel:</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {candidate.resume_data?.phone || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '10px' }}>
                      <button
                        style={{
                          padding: '0',
                          border: 'none',
                          background: 'none',
                          color: '#0284C7',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontSize: '10px',
                        }}
                      >
                        CV
                      </button>
                      <button
                        style={{
                          padding: '0',
                          border: 'none',
                          background: 'none',
                          color: '#0284C7',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontSize: '10px',
                        }}
                      >
                        Notes
                      </button>
                    </div>
                  </div>
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
                      {(candidate?.resume_data?.skills || candidate?.skills || [])
                        .slice(0, 4)
                        .map((skill: any, idx: any) => (
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
                  <div style={{ width: '80px', flexShrink: 0 }}>
                    <h4
                      style={{
                        margin: '0 0 4px 0',
                        fontSize: '10px',
                        fontWeight: '600',
                        color: '#374151',
                      }}
                    >
                      Previous Interview
                    </h4>
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
                      -
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}
        >
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Showing {((currentPage - 1) * resumesPerPage) + 1} to {Math.min(currentPage * resumesPerPage, filteredData.length)} of {filteredData.length} resumes
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                fontWeight: '500',
              }}
            >
              Previous
            </button>
            <div style={{ display: 'flex', gap: '2px' }}>
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
                      padding: '4px 8px',
                      backgroundColor: currentPage === pageNumber ? '#0284C7' : '#ffffff',
                      color: currentPage === pageNumber ? '#ffffff' : '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      minWidth: '28px',
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
                padding: '4px 10px',
                backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#ffffff',
                color: currentPage === totalPages ? '#9ca3af' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: '500',
              }}
            >
              Next
            </button>
            <button
              aria-label="Add selected candidates to collection"
              style={{
                padding: '6px 14px',
                backgroundColor: selectedCandidates.length > 0 ? '#0284C7' : '#9CA3AF',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: selectedCandidates.length > 0 ? 'pointer' : 'not-allowed',
                marginLeft: '10px',
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
          <div
            style={{
              padding: '12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px',
              color: '#374151',
            }}
          >
            <strong>Selection Summary:</strong>
            <div style={{ marginTop: '4px' }}>
              • {selectedCandidates.length} resume{selectedCandidates.length !== 1 ? 's' : ''} selected
              {selectAll && (
                <span style={{ color: '#059669', marginLeft: '8px' }}>
                  (All filtered resumes)
                </span>
              )}
            </div>
          </div>
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
                    borderRadius: 4px;
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
    </div>
  );
};

export default JdProfile;