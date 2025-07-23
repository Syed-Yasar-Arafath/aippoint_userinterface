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
  Card,
  CardContent,
  Divider,
  Tooltip,
} from '@mui/material';
import { Search } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import EventIcon from '@mui/icons-material/Event';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../redux/actions';
import { useTranslation } from 'react-i18next';

interface JobDescription {
  jobid: number;
  job_title: string;
  resume_data: { id: string; status: string }[];
  created_on: string;
  job_description?: string;
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
  showAllSkills?: boolean;
}

type Profile = {
  id: any;
  resume_data: {
    id: any;
    skills: any;
    experience_in_number: any;
    name: any;
    Resume_Category: any;
    work: any;
    phone: any;
    location: any;
    pdf_data: any;
    profile_summary: any;
    notes: any;
  };
  score: any;
};

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
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [note, setNote] = useState<string>('');
  const [noteLoading, setNoteLoading] = useState(false);

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
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(res.data);
        setCreatedBy(res.data.email);
        setDispatchLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setDispatchLoading(false);
      }
    };
    getUserData();
  }, [organisation, token]);

  const collectionList = userData?.job_description?.map((job) => ({
    jobid: job.jobid,
    job_title: job.job_title,
    profiles: job.resume_data?.length || 0,
    addedBy: userData.email,
    lastUpdated: job.created_on,
    resume_ids: job.resume_data.map((resume) => resume.id),
    status: job.resume_data[0]?.status || 'Not interviewed',
    job_description: job.job_description || '',
  })) || [];

  useEffect(() => {
    let filtered = collectionList;
    if (jobRole) filtered = filtered.filter((collection) => collection.job_title.toLowerCase().includes(jobRole.toLowerCase()));
    if (experience) {
      const expYears = parseInt(experience);
      filtered = filtered.filter((collection) =>
        collection.resume_ids.some(async (resumeId: string) => {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_resume/`,
              { resume_id: [resumeId] },
              { headers: { Authorization: `Bearer ${token}`, Organization: organisation } }
            );
            const resume = response.data[0];
            const resumeExp = resume?.resume_data?.experience_in_number || 0;
            return resumeExp >= expYears;
          } catch (error) {
            return false;
          }
        })
      );
    }
    if (user) filtered = filtered.filter((collection) => collection.addedBy.toLowerCase().includes(user.toLowerCase()));
    if (status) filtered = filtered.filter((collection) => collection.status.toLowerCase().includes(status.toLowerCase()));
    if (select) filtered = filtered.filter((collection) => collection.job_title.toLowerCase().includes(select.toLowerCase()));
    if (selectedDate) filtered = filtered.filter((collection) => dayjs(collection.lastUpdated).isSame(selectedDate, 'day'));
    if (searchQuery) filtered = filtered.filter(
      (collection) =>
        collection.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.addedBy.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCollections(filtered);
  }, [jobRole, experience, user, status, select, selectedDate, searchQuery, collectionList]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  const paginatedCollections = filteredCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const CustomExpandMore = () => <ExpandMore sx={{ fontSize: '20px', color: '#000', marginRight: '10px' }} />;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleDateClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleDateClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const id = open ? 'date-picker-popover' : undefined;

  const jobRoleOptions = ['Software Engineer - Frontend', 'Software Analyst', 'Software Engineer - Full Stack', 'Senior Product Manager', 'DevOps Engineer', 'Java Developer'];
  const experienceOptions = ['1 years', '3 years', '5 years', '7 years', '9 years'];
  const userOptions = userData ? [userData.email] : [];
  const statusOptions = ['Not interviewed', 'Scheduled', 'Interview Completed'];
  const selectOptions = ['Option 1', 'Option 2', 'Option 3'];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleViewProfiles = async (job: any) => {
    setSelectedJob(job);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_resume/`,
        { resume_id: job.resume_ids },
        { headers: { Authorization: `Bearer ${token}`, Organization: organisation } }
      );
      const updatedResumeData = response.data.map((resume: any) => ({
        ...resume,
        showAllSkills: false,
      }));
      setResumeData(updatedResumeData);
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching resume data:', error);
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
      for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else alert('No resume file available.');
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
        { headers: { Authorization: `Bearer ${token}`, Organization: organisation, 'Content-Type': 'application/json' } }
      );
      if (response.status === 200 && Array.isArray(response.data)) {
        setResumeData((prevResumeData) =>
          prevResumeData.map((resume) => {
            const scoredResume = response.data.find((scored: any) => scored.id === resume.id);
            return scoredResume ? { ...resume, score: scoredResume.score, explanation: scoredResume.explanation } : resume;
          })
        );
      } else if (response.status === 404) setError('No matching resumes found for this job description.');
      else setError('Unexpected response from server.');
    } catch (error) {
      console.error('Error scoring resumes:', error);
    } finally {
      setScoreLoading(false);
    }
  };

  const handleOpenNoteModal = (resumeId: any, existingNote: any = '') => {
    setNote(existingNote);
    setSelectedJob((prev: any) => ({ ...prev, resumeId }));
    setOpenNoteModal(true);
  };

  const handleCloseNoteModal = () => {
    setOpenNoteModal(false);
    setNote('');
    setSelectedJob((prev: any) => ({ ...prev, resumeId: null }));
    setError(null);
  };

  const handleSaveNotes = async () => {
    if (!selectedJob?.resumeId || !note.trim()) {
      setError('Resume ID and notes are required');
      dispatch(openSnackbar('Resume ID and notes are required', 'red'));
      return;
    }
    setNoteLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/save_notes/`,
        { object_id: selectedJob.resumeId, notes: note },
        { headers: { Authorization: `Bearer ${token}`, Organization: organisation, 'Content-Type': 'application/json' } }
      );
      if (response.status === 200) {
        dispatch(openSnackbar('Notes saved successfully!', 'green'));
        setResumeData((prevResumeData) =>
          prevResumeData.map((resume) =>
            resume.id === selectedJob.resumeId ? { ...resume, resume_data: { ...resume.resume_data, notes: note } } : resume
          )
        );
        setTimeout(() => handleCloseNoteModal(), 1500);
      } else {
        setError('Failed to save notes');
        dispatch(openSnackbar('Failed to save notes', 'red'));
      }
    } catch (err: any) {
      console.error('Error saving notes:', err);
      setError(err.response?.data?.error || 'Something went wrong');
      dispatch(openSnackbar('Something went wrong while saving notes', 'red'));
    } finally {
      setNoteLoading(false);
    }
  };

  const [selectedCandidates, setSelectedCandidates] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [profile, setProfile] = useState<Profile[]>([]);
  const [profileLength, setProfileLength] = useState<number>(0);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [value, setValue] = useState<any[]>([]);
  const [userId, setUserId] = useState('');
  const [openModal1, setOpenModal1] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [collection, setCollection] = useState<string | number>('');
  const [resumes, setResumes] = useState<any[]>([]);
  const [resumeId, setResumeId] = useState<any[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<any | null>('');
  const [inputExpValue, setInputExpValue] = useState<string>('');
  const [inputLocValue, setInputLocValue] = useState<string>('');
  const { t } = useTranslation();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ padding: '16px', maxWidth: '1280px', margin: '0 auto' }}>
        <Grid container spacing={2} alignItems="center" wrap="nowrap" sx={{ overflowX: 'auto', mb: 2 }}>
          <Grid item>
            <div style={{ position: 'relative', width: '200px', height: '40px', border: '1px solid #ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
              <InputBase placeholder="Search..." sx={{ fontSize: '12px', width: '100%' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <Search style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#000' }} />
            </div>
          </Grid>
          <Grid item><Select displayEmpty value={jobRole} onChange={(e) => setJobRole(e.target.value as string)} IconComponent={CustomExpandMore} sx={{ height: '40px', width: '158px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', '& .MuiSelect-select': { color: '#0284C7' } }} renderValue={(selected) => <Typography sx={{ color: selected ? '#0284C7' : '#000', fontSize: '12px' }}>{selected || 'Select Job Role'}</Typography>}><MenuItem value="" sx={{ color: '#000', fontSize: '12px' }}>Select Job Role</MenuItem>{jobRoleOptions.map((option) => <MenuItem key={option} value={option} sx={{ color: '#000', fontSize: '12px', '&:hover': { color: '#0284C7', backgroundColor: '#f1f5f9' }, '&.Mui-selected': { color: '#0284C7', backgroundColor: '#e3f2fd', '&:hover': { backgroundColor: '#f1f5f9' } } }}>{option}</MenuItem>)}</Select></Grid>
          <Grid item><Select displayEmpty value={experience} onChange={(e) => setExperience(e.target.value as string)} IconComponent={CustomExpandMore} sx={{ height: '40px', width: '158px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', '& .MuiSelect-select': { color: '#0284C7' } }} renderValue={(selected) => <Typography sx={{ color: selected ? '#0284C7' : '#000', fontSize: '12px' }}>{selected || 'Select Experience'}</Typography>}><MenuItem value="" sx={{ color: '#000', fontSize: '12px' }}>Select Experience</MenuItem>{experienceOptions.map((option) => <MenuItem key={option} value={option} sx={{ color: '#000', fontSize: '12px', '&:hover': { color: '#0284C7', backgroundColor: '#f1f5f9' }, '&.Mui-selected': { color: '#0284C7', backgroundColor: '#e3f2fd', '&:hover': { backgroundColor: '#f1f5f9' } } }}>{option}</MenuItem>)}</Select></Grid>
          <Grid item><Select displayEmpty value={user} onChange={(e) => setUser(e.target.value as string)} IconComponent={CustomExpandMore} sx={{ height: '40px', width: '158px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', '& .MuiSelect-select': { color: '#0284C7' } }} renderValue={(selected) => <Typography sx={{ color: selected ? '#0284C7' : '#000', fontSize: '12px' }}>{selected || 'Select User'}</Typography>}><MenuItem value="" sx={{ color: '#000', fontSize: '12px' }}>Select User</MenuItem>{userOptions.map((option) => <MenuItem key={option} value={option} sx={{ color: '#000', fontSize: '12px', '&:hover': { color: '#0284C7', backgroundColor: '#f1f5f9' }, '&.Mui-selected': { color: '#0284C7', backgroundColor: '#e3f2fd', '&:hover': { backgroundColor: '#f1f5f9' } } }}>{option}</MenuItem>)}</Select></Grid>
          <Grid item><Select displayEmpty value={status} onChange={(e) => setStatus(e.target.value as string)} IconComponent={CustomExpandMore} sx={{ height: '40px', width: '158px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', '& .MuiSelect-select': { color: '#0284C7' } }} renderValue={(selected) => <Typography sx={{ color: selected ? '#0284C7' : '#000', fontSize: '12px' }}>{selected || 'Select Status'}</Typography>}><MenuItem value="" sx={{ color: '#000', fontSize: '12px' }}>Select Status</MenuItem>{statusOptions.map((option) => <MenuItem key={option} value={option} sx={{ color: '#000', fontSize: '12px', '&:hover': { color: '#0284C7', backgroundColor: '#f1f5f9' }, '&.Mui-selected': { color: '#0284C7', backgroundColor: '#e3f2fd', '&:hover': { backgroundColor: '#f1f5f9' } } }}>{option}</MenuItem>)}</Select></Grid>
          <Grid item><Select displayEmpty value={select} onChange={(e) => setSelect(e.target.value as string)} IconComponent={CustomExpandMore} sx={{ height: '40px', width: '158px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', '& .MuiSelect-select': { color: '#0284C7' } }} renderValue={(selected) => <Typography sx={{ color: selected ? '#0284C7' : '#000', fontSize: '12px' }}>{selected || 'Select'}</Typography>}><MenuItem value="" sx={{ color: '#000', fontSize: '12px' }}>Select</MenuItem>{selectOptions.map((option) => <MenuItem key={option} value={option} sx={{ color: '#000', fontSize: '12px', '&:hover': { color: '#0284C7', backgroundColor: '#f1f5f9' }, '&.Mui-selected': { color: '#0284C7', backgroundColor: '#e3f2fd', '&:hover': { backgroundColor: '#f1f5f9' } } }}>{option}</MenuItem>)}</Select></Grid>
          <Grid item><Button onClick={handleDateClick} sx={{ height: '40px', width: '158px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', color: '#000', justifyContent: 'flex-start', textTransform: 'none', paddingRight: '35px', '& .MuiButton-endIcon': { marginLeft: '20px' } }} endIcon={<EventIcon />}>{selectedDate ? selectedDate.format('DD-MMM-YYYY') : 'Select Date'}</Button><Popover id={id} open={open} anchorEl={anchorEl} onClose={handleDateClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}><DatePicker value={selectedDate} onChange={(newValue) => { setSelectedDate(newValue); handleDateClose(); }} /></Popover></Grid>
        </Grid>

        {dispatchLoading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        <p style={{ fontSize: '0.875rem', color: '#4B5563', margin: '0', fontFamily: 'SF Pro Display' }}>Available Collections: {filteredCollections.length}</p>
        <div style={{ overflowX: 'auto', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', fontFamily: 'SF Pro Display', fontWeight: '700', border: 'none' }}>
            <thead>
              <tr style={{ backgroundColor: '#0284C7', color: 'white', fontFamily: 'SF Pro Display' }}>
                {['Collection Name', 'Available Profile', 'Profile Added By', 'Last Updated', 'Quick Action'].map((text, i) => (
                  <th key={i} style={{ padding: '10px', textAlign: 'left', border: 'none' }}>{text}</th>
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
                    fontFamily: 'SF Pro Display',
                    fontWeight: '400',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => selectedRow !== index && (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => selectedRow !== index && (e.currentTarget.style.backgroundColor = '#fff')}
                >
                  <td style={{ padding: '10px', fontFamily: 'SF Pro Display', fontWeight: '400' }}>{collection.job_title}</td>
                  <td style={{ padding: '10px', fontFamily: 'SF Pro Display' }}>
                    <span style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px', display: 'inline-block', fontFamily: 'SF Pro Display', width: '48px', minWidth: '48px', height: '24px', lineHeight: '16px', textAlign: 'center', boxSizing: 'border-box' }}>{collection.profiles}</span>
                  </td>
                  <td style={{ padding: '10px', fontFamily: 'SF Pro Display' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Avatar sx={{ width: 30, height: 30, mr: 2, bgcolor: '#0284C7' }}>{collection.addedBy?.charAt(0) || 'N'}</Avatar>
                      <div>{collection.addedBy}</div>
                    </div>
                  </td>
                  <td style={{ padding: '10px', fontFamily: 'SF Pro Display' }}>
                    <span style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px 6px', display: 'inline-block', fontFamily: 'SF Pro Display' }}>{dayjs(collection.lastUpdated).format('DD-MMM-YYYY')}</span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewProfiles(collection)}
                      sx={{ backgroundColor: 'transparent', borderColor: '#0284C7', color: '#0284C7', fontFamily: 'SF Pro Display', textTransform: 'none', fontSize: '12px', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'black', color: 'black' } }}
                    >
                      View Profiles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Grid container justifyContent="center" alignItems="center" spacing={1} sx={{ position: 'fixed', bottom: 20, left: '0', right: '0', zIndex: 10 }}>
          <Grid item><Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} sx={{ textTransform: 'none', fontSize: '12px', color: '#0284C7' }}>Prev</Button></Grid>
          {[...Array(totalPages)].map((_, i) => <Grid item key={i}><Button onClick={() => setCurrentPage(i + 1)} sx={{ minWidth: '32px', height: '32px', borderRadius: '4px', backgroundColor: i + 1 === currentPage ? '#1976d2' : 'transparent', color: i + 1 === currentPage ? 'white' : '#1976d2', fontSize: '12px' }}>{i + 1}</Button></Grid>)}
          <Grid item><Typography sx={{ fontSize: '12px', color: '#0284C7', padding: '8px' }}>...</Typography></Grid>
          <Grid item><Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} sx={{ textTransform: 'none', fontSize: '12px', color: '#0284C7' }}>Next</Button></Grid>
          <Grid item><Button variant="contained" sx={{ textTransform: 'none', fontSize: '12px', ml: 2, backgroundColor: '#0284C7', '&:hover': { backgroundColor: '#0284C7' } }} onClick={() => navigate('/interviewSchedule')}>Schedule Interview</Button></Grid>
        </Grid>

        <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '95%', maxHeight: '95vh', bgcolor: 'background.paper', boxShadow: 24, p: 2, overflowY: 'auto' }}>
            <Typography variant="h6" sx={{ fontSize: 14, color: '#000', fontWeight: 'bold', mb: 2 }}>
              Available profiles for {selectedJob?.job_title}: {resumeData.length}
            </Typography>
            <Grid container spacing={1}>
              {resumeData.map((resume) => (
                <Grid item xs={12} key={resume.id}>
                  <Card sx={{ display: 'flex', p: 2, border: '1px solid #ddd', borderRadius: 4 }}>
                    <Avatar sx={{ width: 50, height: 50, mr: 2, bgcolor: '#0284C7' }}>
                      {resume.resume_data?.name?.charAt(0) || 'N'}
                    </Avatar>
                    <CardContent sx={{ flexGrow: 1, p: 0 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={3}>
                          <Typography variant="body2" sx={{ fontSize: 12, color: '#333' }}>
                            <strong>Current Position:</strong> {resume.resume_data?.work?.[0]?.designation_at_company || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: 12, color: '#333' }}>
                            <strong>Experience:</strong> {resume.resume_data?.experience_in_number ? `${resume.resume_data.experience_in_number} year(s)` : 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: 12, color: '#333' }}>
                            <strong>Education:</strong> {`${resume.resume_data?.education?.Degree || ''} - ${resume.resume_data?.education?.institution || ''} (${resume.resume_data?.education?.year_of_graduation || ''})` || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: 12, color: '#333' }}>
                            <strong>Contact:</strong> {resume.resume_data?.phone || resume.resume_data?.email || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: 12, color: '#333' }}>
                            <strong>Prev Interview:</strong> N/A
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" sx={{ fontSize: 12, color: '#333' }}>
                            <strong>Projects:</strong>
                            {resume.resume_data?.projects?.length > 0 ? (
                              <ul style={{ paddingLeft: 16, margin: 0 }}>
                                {resume.resume_data.projects.map((project: any, index: number) => (
                                  <Tooltip key={index} title={project.description} placement="top">
                                    <li style={{ fontSize: 12, color: '#333', marginBottom: 4, cursor: 'pointer' }}>
                                      {project.project_name}
                                    </li>
                                  </Tooltip>
                                ))}
                              </ul>
                            ) : (
                              <Typography variant="body2" sx={{ fontSize: 12, color: '#333' }}>
                                N/A
                              </Typography>
                            )}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Button
                              variant="outlined"
                              sx={{ mr: 1, color: '#000', borderColor: '#ccc', textTransform: 'none', fontSize: 12, '&:hover': { borderColor: '#0284C7', color: '#0284C7' } }}
                              onClick={() => handleViewResume(resume.file_data)}
                            >
                              View CV/Resume
                            </Button>
                            <Button
                              variant="outlined"
                              sx={{ color: '#000', borderColor: '#ccc', textTransform: 'none', fontSize: 12, '&:hover': { borderColor: '#0284C7', color: '#0284C7' } }}
                              onClick={() => handleOpenNoteModal(resume.id, resume.resume_data?.notes || '')}
                            >
                              {resume.resume_data?.notes ? 'Edit Note' : 'Note'}
                            </Button>
                          </Box>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body2" sx={{ fontSize: 12, color: '#333' }}>
                            <strong>Key Skills:</strong>
                            <ul style={{ paddingLeft: 16, margin: 0 }}>
                              {resume.resume_data?.skills?.length > 0 ? (
                                <>
                                  {resume.resume_data.skills.slice(0, 5).map((skill: string, idx: number) => (
                                    <li key={idx} style={{ fontSize: 12, color: '#333', marginBottom: 4 }}>{skill}</li>
                                  ))}
                                  {resume.resume_data.skills.length > 5 && (
                                    <li>
                                      <Button
                                        sx={{ textTransform: 'none', fontSize: 12, color: '#0284C7', padding: 0, minWidth: 'auto' }}
                                        onClick={() =>
                                          setResumeData((prev) =>
                                            prev.map((r) => (r.id === resume.id ? { ...r, showAllSkills: !r.showAllSkills } : r))
                                          )
                                        }
                                      >
                                        {resume.showAllSkills ? 'Show Less' : 'More'}
                                      </Button>
                                    </li>
                                  )}
                                  {resume.showAllSkills &&
                                    resume.resume_data.skills.slice(5).map((skill: string, idx: number) => (
                                      <li key={idx + 5} style={{ fontSize: 12, color: '#333', marginBottom: 4 }}>{skill}</li>
                                    ))}
                                </>
                              ) : (
                                <li style={{ fontSize: 12, color: '#333' }}>N/A</li>
                              )}
                            </ul>
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="body2" sx={{ fontSize: 12, color: '#333' }}>
                            <strong>Uploaded By:</strong> {resume.resume_data?.created_by || createdBy}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: 12, color: '#333' }}>
                            <strong>Upcoming Interview:</strong> Not Scheduled
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 1, textTransform: 'none', fontSize: 12, backgroundColor: '#0284C7', '&:hover': { backgroundColor: '#0267B1' } }}
                            onClick={() => navigate('/interviewSchedule')}
                          >
                            Schedule Interview
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Modal>

        <Modal open={openNoteModal} onClose={handleCloseNoteModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 8 }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: 16, fontWeight: 'bold' }}>
              {note ? 'Edit' : 'Add'} Note for{' '}
              <strong>
                {resumeData.find((r) => r.id === selectedJob?.resumeId)?.resume_data?.name || 'Candidate'}
              </strong>
            </Typography>
            <TextField label="Note" multiline rows={4} value={note} onChange={(e) => setNote(e.target.value)} fullWidth variant="outlined" sx={{ mb: 2 }} error={!!error} helperText={error} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="outlined" onClick={handleCloseNoteModal} disabled={noteLoading} sx={{ textTransform: 'none', fontSize: 12, color: '#000', borderColor: '#ccc', '&:hover': { borderColor: '#0284C7', color: '#0284C7' } }}>Cancel</Button>
              <Button variant="contained" color="primary" onClick={handleSaveNotes} disabled={noteLoading} sx={{ textTransform: 'none', fontSize: 12, backgroundColor: '#0284C7', '&:hover': { backgroundColor: '#0267B1' } }}>{noteLoading ? 'Saving...' : 'Save'}</Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </LocalizationProvider>
  );
};

export default CollectionDefault;