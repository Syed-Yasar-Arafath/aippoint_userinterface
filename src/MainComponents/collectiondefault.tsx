import { ExpandMore } from '@mui/icons-material';
import {
  Button,
  Grid,
  InputBase,
  MenuItem,
  Select,
  Typography,
  Popover,
  Modal,
  Box,
  Avatar,
  TextField,
} from '@mui/material';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import EventIcon from '@mui/icons-material/Event';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface JobDescription {
  jobid: number;
  job_title: string;
  resume_data: { id: string; status: string }[];
  created_on: string;
  job_description?: string; // Add job_description to interface
}

interface UserData {
  email: string;
  job_description: JobDescription[];
}

interface ResumeData {
  id: string;
  resume_name: string;
  resume_data: any;
  file_data: string | null;
  explanation: any;
}

const CollectionDefault: React.FC = () => {
  const token = localStorage.getItem('token');
  const organisation = localStorage.getItem('organisation');
  const [loading, setLoading] = useState(false);
  const [dispatchLoading, setDispatchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [createdBy, setCreatedBy] = useState('');
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<any[]>([]);
  const [openNoteModal, setOpenNoteModal] = useState(false); // State for note modal
  const [note, setNote] = useState<string>(''); // State for note input
  const [noteLoading, setNoteLoading] = useState(false); // State for note submission loading

  // Filter states
  const [jobRole, setJobRole] = useState('');
  const [experience, setExperience] = useState('');
  const [user, setUser] = useState('');
  const [status, setStatus] = useState('');
  const [select, setSelect] = useState('');
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      setDispatchLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/user/read/${organisation}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setUserData(res.data);
        setCreatedBy(res.data.email);
        setDispatchLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch user data');
        setDispatchLoading(false);
      }
    };

    getUserData();
  }, [organisation, token]);

  // Transform API data for table display
  const collectionList = userData?.job_description?.map((job) => ({
    jobid: job.jobid,
    job_title: job.job_title,
    profiles: job.resume_data?.length || 0,
    addedBy: userData.email,
    lastUpdated: job.created_on,
    resume_ids: job.resume_data.map((resume) => resume.id),
    status: job.resume_data[0]?.status || 'Not interviewed',
    job_description: job.job_description || '', // Include job_description
  })) || [];

  // Apply filters to collectionList
  useEffect(() => {
    let filtered = collectionList;

    if (jobRole) {
      filtered = filtered.filter((collection) =>
        collection.job_title.toLowerCase().includes(jobRole.toLowerCase()),
      );
    }

    if (experience) {
      const expYears = parseInt(experience);
      filtered = filtered.filter((collection) =>
        collection.resume_ids.some(async (resumeId: string) => {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_resume/`,
              { resume_id: [resumeId] },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Organization: organisation,
                },
              },
            );
            const resume = response.data[0];
            const resumeExp = resume?.resume_data?.experience_in_number || 0;
            return resumeExp >= expYears;
          } catch (error) {
            return false;
          }
        }),
      );
    }

    if (user) {
      filtered = filtered.filter((collection) =>
        collection.addedBy.toLowerCase().includes(user.toLowerCase()),
      );
    }

    if (status) {
      filtered = filtered.filter((collection) =>
        collection.status.toLowerCase().includes(status.toLowerCase()),
      );
    }

    if (select) {
      filtered = filtered.filter((collection) =>
        collection.job_title.toLowerCase().includes(select.toLowerCase()),
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((collection) =>
        dayjs(collection.lastUpdated).isSame(selectedDate, 'day'),
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (collection) =>
          collection.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          collection.addedBy.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredCollections(filtered);
  }, [jobRole, experience, user, status, select, selectedDate, searchQuery, collectionList]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  const paginatedCollections = filteredCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const CustomExpandMore = () => (
    <ExpandMore sx={{ fontSize: '20px', color: '#000', marginRight: '10px' }} />
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleDateClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDateClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'date-picker-popover' : undefined;

  const jobRoleOptions = [
    'Software Engineer - Frontend',
    'Software Analyst',
    'Software Engineer - Full Stack',
    'Senior Product Manager',
    'DevOps Engineer',
    'Java Developer',
  ];
  const experienceOptions = ['1 years', '3 years', '5 years', '7 years', '9 years'];
  const userOptions = userData ? [userData.email] : [];
  const statusOptions = ['Not interviewed', 'Scheduled', 'Interview Completed'];
  const selectOptions = ['Option 1', 'Option 2', 'Option 3'];

  const navigate = useNavigate();

  const handleViewProfiles = async (job: any) => {
    setSelectedJob(job);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_resume/`,
        { resume_id: job.resume_ids },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Organization: organisation,
          },
        },
      );
      setResumeData(response.data);
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching resume data:', error);
      setError('Failed to fetch resume data');
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setResumeData([]);
  };

  const handleViewResume = (fileData: string | null) => {
    if (fileData) {
      const byteCharacters = atob(fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else {
      alert('No resume file available.');
    }
  };

  const [scoreLoading, setScoreLoading] = useState(false);

  const handleScoreNow = async () => {
    if (!selectedJob?.jobid) {
      setError('Job ID is missing');
      return;
    }
    setScoreLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_jd_score/`,
        { jd_id: selectedJob.jobid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Organization: organisation,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        setResumeData((prevResumeData) =>
          prevResumeData.map((resume) => {
            const scoredResume = response.data.find((scored: any) => scored.id === resume.id);
            if (scoredResume) {
              return {
                ...resume,
                score: scoredResume.score,
                explanation: scoredResume.explanation,
              };
            }
            return resume;
          }),
        );
      } else if (response.status === 404) {
        setError('No matching resumes found for this job description.');
      } else {
        setError('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error scoring resumes:', error);
      setError('Failed to score resumes');
    } finally {
      setScoreLoading(false);
    }
  };

  // Handle Note Modal
  const handleOpenNoteModal = (jobDescription: string) => {
    setNote(jobDescription || ''); // Pre-fill with existing job_description
    setOpenNoteModal(true);
  };

  const handleCloseNoteModal = () => {
    setOpenNoteModal(false);
    setNote('');
  };

  const handleSaveNote = async () => {
    if (!selectedJob?.jobid) {
      setError('Job ID is missing');
      return;
    }
    setNoteLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/job/update/${selectedJob.jobid}`,
        { job_description: note },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        // Update userData to reflect the new job_description
        setUserData((prev) =>
          prev
            ? {
                ...prev,
                job_description: prev.job_description.map((job) =>
                  job.jobid === selectedJob.jobid ? { ...job, job_description: note } : job,
                ),
              }
            : prev,
        );
        // Update selectedJob to reflect the new job_description
        setSelectedJob((prev: any) => ({ ...prev, job_description: note }));
        handleCloseNoteModal();
      } else {
        // setError('Failed to save note');
                setError('');

      }
    } catch (error) {
      console.error('Error saving note:', error);
      setError('');
    } finally {
      setNoteLoading(false);
    }
  };

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#000',
                }}
              />
            </div>
          </Grid>

          {/* Filter Selects */}
          <Grid item>
            <Select
              displayEmpty
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value as string)}
              IconComponent={CustomExpandMore}
              sx={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
                '& .MuiSelect-select': { color: '#0284C7' },
              }}
              renderValue={(selected) => (
                <Typography sx={{ color: selected ? '#0284C7' : '#000', fontSize: '12px' }}>
                  {selected || 'Select Job Role'}
                </Typography>
              )}
            >
              <MenuItem value="" sx={{ color: '#000', fontSize: '12px' }}>
                Select Job Role
              </MenuItem>
              {jobRoleOptions.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    color: '#000',
                    fontSize: '12px',
                    '&:hover': { color: '#0284C7', backgroundColor: '#f1f5f9' },
                    '&.Mui-selected': {
                      color: '#0284C7',
                      backgroundColor: '#e3f2fd',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Select
              displayEmpty
              value={experience}
              onChange={(e) => setExperience(e.target.value as string)}
              IconComponent={CustomExpandMore}
              sx={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
                '& .MuiSelect-select': { color: '#0284C7' },
              }}
              renderValue={(selected) => (
                <Typography sx={{ color: selected ? '#0284C7' : '#000', fontSize: '12px' }}>
                  {selected || 'Select Experience'}
                </Typography>
              )}
            >
              <MenuItem value="" sx={{ color: '#000', fontSize: '12px' }}>
                Select Experience
              </MenuItem>
              {experienceOptions.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    color: '#000',
                    fontSize: '12px',
                    '&:hover': { color: '#0284C7', backgroundColor: '#f1f5f9' },
                    '&.Mui-selected': {
                      color: '#0284C7',
                      backgroundColor: '#e3f2fd',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Select
              displayEmpty
              value={user}
              onChange={(e) => setUser(e.target.value as string)}
              IconComponent={CustomExpandMore}
              sx={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
                '& .MuiSelect-select': { color: '#0284C7' },
              }}
              renderValue={(selected) => (
                <Typography sx={{ color: selected ? '#0284C7' : '#000', fontSize: '12px' }}>
                  {selected || 'Select User'}
                </Typography>
              )}
            >
              <MenuItem value="" sx={{ color: '#000', fontSize: '12px' }}>
                Select User
              </MenuItem>
              {userOptions.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    color: '#000',
                    fontSize: '12px',
                    '&:hover': { color: '#0284C7', backgroundColor: '#f1f5f9' },
                    '&.Mui-selected': {
                      color: '#0284C7',
                      backgroundColor: '#e3f2fd',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Select
              displayEmpty
              value={status}
              onChange={(e) => setStatus(e.target.value as string)}
              IconComponent={CustomExpandMore}
              sx={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
                '& .MuiSelect-select': { color: '#0284C7' },
              }}
              renderValue={(selected) => (
                <Typography sx={{ color: selected ? '#0284C7' : '#000', fontSize: '12px' }}>
                  {selected || 'Select Status'}
                </Typography>
              )}
            >
              <MenuItem value="" sx={{ color: '#000', fontSize: '12px' }}>
                Select Status
              </MenuItem>
              {statusOptions.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    color: '#000',
                    fontSize: '12px',
                    '&:hover': { color: '#0284C7', backgroundColor: '#f1f5f9' },
                    '&.Mui-selected': {
                      color: '#0284C7',
                      backgroundColor: '#e3f2fd',
                      '&:hover': { backgroundColor: '#f1f5f9' },
                    },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Select
              displayEmpty
              value={select}
              onChange={(e) => setSelect(e.target.value as string)}
              IconComponent={CustomExpandMore}
              sx={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
                '& .MuiSelect-select': { color: '#0284C7' },
              }}
              renderValue={(selected) => (
                <Typography sx={{ color: selected ? '#0284C7' : '#000', fontSize: '12px' }}>
                  {selected || 'Select'}
                </Typography>
              )}
            >
              <MenuItem value="" sx={{ color: '#000', fontSize: '12px' }}>
                Select
              </MenuItem>
              {selectOptions.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    color: '#000',
                    fontSize: '12px',
                    '&:hover': { color: '#0284C7', backgroundColor: '#f1f5f9' },
                    '&.Mui-selected': {
                      color: '#0284C7',
                      backgroundColor: '#e3f2fd',
                      '&:hover': { backgroundColor: '#f1f5f929' },
                    },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>
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
                color: '#000',
                justifyContent: 'flex-start',
                textTransform: 'none',
                paddingRight: '35px',
                '& .MuiButton-endIcon': { marginLeft: '20px' },
              }}
              endIcon={<EventIcon />}
            >
              {selectedDate ? selectedDate.format('DD-MMM-YYYY') : 'Select Date'}
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleDateClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
              <DatePicker
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                  handleDateClose();
                }}
              />
            </Popover>
          </Grid>
        </Grid>

        {dispatchLoading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        <p
          style={{
            fontSize: '0.875rem',
            color: '#4B5563',
            margin: '0',
            fontFamily: 'SF Pro Display',
          }}
        >
          Available Collections: {filteredCollections.length}
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
                    style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}
                  >
                    {text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedCollections.map((collection: any, index: number) => (
                <tr
                  key={index}
                  onClick={() => setSelectedRow(index)}
                  style={{
                    backgroundColor: selectedRow === index ? '#bfdbfe' : '#fff',
                    borderBottom: '1px solid #ddd',
                    fontFamily: 'SF Pro Display',
                    fontWeight: '400',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    selectedRow !== index && (e.currentTarget.style.backgroundColor = '#f1f5f9')
                  }
                  onMouseLeave={(e) =>
                    selectedRow !== index && (e.currentTarget.style.backgroundColor = '#fff')
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
                    {collection.job_title}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {collection.addedBy}
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
                      {dayjs(collection.lastUpdated).format('DD-MMM-YYYY')}
                    </span>
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewProfiles(collection)}
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
              ))}
            </tbody>
          </table>
        </div>

        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ position: 'fixed', bottom: 20, left: '0', right: '0', zIndex: 10 }}
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
                  backgroundColor: i + 1 === currentPage ? '#1976d2' : 'transparent',
                  color: i + 1 === currentPage ? 'white' : '#1976d2',
                  fontSize: '12px',
                }}
              >
                {i + 1}
              </Button>
            </Grid>
          ))}
          <Grid item>
            <Typography sx={{ fontSize: '12px', color: '#0284C7', padding: '8px' }}>
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
              onClick={() => navigate('/interviewSchedule')}
            >
              Schedule Interview
            </Button>
          </Grid>
        </Grid>

        {/* Resume Details Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              maxHeight: '80vh',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 2,
              overflowY: 'auto',
            }}
          >
            <Typography variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
              Available profiles for {selectedJob?.job_title}: {resumeData.length}
            </Typography>
            <Grid container spacing={2}>
              {resumeData.map((resume) => (
                <Grid item xs={12} key={resume.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      p: 2,
                      mb: 2,
                    }}
                  >
                    <Avatar sx={{ mr: 2 }}>
                      {resume.resume_data?.name?.charAt(0) || 'N'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Current Position:</strong>{' '}
                        {resume.resume_data?.work?.[0]?.designation_at_company || 'N/A'}
                      </Typography>
                      <Typography variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Experience:</strong>{' '}
                        {resume.resume_data?.experience_in_number
                          ? `${resume.resume_data.experience_in_number} year(s)`
                          : 'N/A'}
                      </Typography>
                      <Typography variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Education:</strong>{' '}
                        {`${resume.resume_data?.education?.Degree || ''} - ${
                          resume.resume_data?.education?.institution || ''
                        } (${resume.resume_data?.education?.year_of_graduation || ''})` || 'N/A'}
                      </Typography>
                      <Typography variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Contact:</strong>{' '}
                        {resume.resume_data?.phone || resume.resume_data?.email || 'N/A'}
                      </Typography>
                      <Typography variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Prev Interview:</strong> N/A
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleViewResume(resume.file_data)}
                        >
                          View CV/Resume
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenNoteModal(selectedJob?.job_description)}
                        >
                          Note
                        </Button>
                      </Box>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>About:</strong> N/A
                      </Typography>
                      <Typography variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Key Skills:</strong>
                        <ul>
                          {resume.resume_data?.skills?.map((skill: string, idx: number) => (
                            <li key={idx}>{skill}</li>
                          )) || <li>N/A</li>}
                        </ul>
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 1 }}
                        onClick={handleScoreNow}
                        disabled={scoreLoading}
                      >
                        {scoreLoading ? 'Scoring...' : 'Score Now'}
                      </Button>
                      <Typography variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Uploaded By:</strong> {resume.resume_data?.created_by || createdBy}
                      </Typography>
                      <Typography variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Upcoming Interview:</strong> Not Scheduled
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 1 }}
                        onClick={() => navigate('/interviewSchedule')}
                      >
                        Schedule Interview
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Modal>

        {/* Note Modal */}
        <Modal open={openNoteModal} onClose={handleCloseNoteModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: '8px',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add/Edit Note for {selectedJob?.job_title}
            </Typography>
            <TextField
              label="Note"
              multiline
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={handleCloseNoteModal}
                disabled={noteLoading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveNote}
                disabled={noteLoading}
              >
                {noteLoading ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </LocalizationProvider>
  );
};

export default CollectionDefault;