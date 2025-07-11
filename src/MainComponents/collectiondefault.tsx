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
  const [selectedJob, setSelectedJob] = useState<any | null>(null); // Adjusted type to any for flexibility
  const [openModal, setOpenModal] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData[]>([]);

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
    job_title: job.job_title,
    profiles: job.resume_data?.length || 0,
    addedBy: userData.email,
    lastUpdated: job.created_on,
    resume_ids: job.resume_data.map((resume) => resume.id),
  })) || [];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(collectionList.length / itemsPerPage);
  const paginatedCollections = collectionList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // State for filter selections
  const [jobRole, setJobRole] = useState('');
  const [experience, setExperience] = useState('');
  const [user, setUser] = useState('');
  const [status, setStatus] = useState('');
  const [select, setSelect] = useState('');

  const CustomExpandMore = () => (
    <ExpandMore sx={{ fontSize: '20px', color: '#000', marginRight: '10px' }} />
  );

  // Date Picker States
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const handleDateClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDateClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'date-picker-popover' : undefined;

  // Filter options
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
  // Handle View Profiles click
  const handleViewProfiles = async (job: any) => {
    setSelectedJob(job);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_resume/`,
        { resume_id: job.resume_ids },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Added token for authentication
            Organization: organisation,
          },
        },
      );
      setResumeData(response.data);
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching resume data:', error);
      setError('');
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
      // Optionally, revoke the URL after the tab is opened to free memory
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else {
      alert('No resume file available.');
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
              <InputBase placeholder="Search..." sx={{ fontSize: '12px', width: '100%' }} />
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
              <MenuItem
                value=""
                disabled
                sx={{ color: '#000', fontSize: '12px', '&:hover': { color: '#0284C7', backgroundColor: '#f1f5f9' } }}
              >
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
                    '&.Mui-selected': { color: '#0284C7', backgroundColor: '#e3f2fd', '&:hover': { backgroundColor: '#f1f5f9' } },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          {/* Other filter selects remain unchanged */}
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
              <MenuItem
                value=""
                disabled
                sx={{ color: '#000', fontSize: '12px', '&:hover': { color: '#0284C7', backgroundColor: '#f1f5f9' } }}
              >
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
                    '&.Mui-selected': { color: '#0284C7', backgroundColor: '#e3f2fd', '&:hover': { backgroundColor: '#f1f5f9' } },
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
              <MenuItem
                value=""
                disabled
                sx={{ color: '#000', fontSize: '12px', '&:hover': { color: '#0284C7', backgroundColor: '#f1f5f9' } }}
              >
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
                    '&.Mui-selected': { color: '#0284C7', backgroundColor: '#e3f2fd', '&:hover': { backgroundColor: '#f1f5f9' } },
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
              <MenuItem
                value=""
                disabled
                sx={{ color: '#000', fontSize: '12px', '&:hover': { color: '#0284C7', backgroundColor: '#f1f5f9' } }}
              >
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
                    '&.Mui-selected': { color: '#0284C7', backgroundColor: '#e3f2fd', '&:hover': { backgroundColor: '#f1f5f9' } },
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
              <MenuItem
                value=""
                disabled
                sx={{ color: '#000', fontSize: '12px', '&:hover': { color: '#0284C7', backgroundColor: '#f1f5f9' } }}
              >
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
                    '&.Mui-selected': { color: '#0284C7', backgroundColor: '#e3f2fd', '&:hover': { backgroundColor: '#f1f5f9' } },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
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

        {/* Loading and Error States */}
        {dispatchLoading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

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

        {/* Pagination & Button */}
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

        {/* Modal for Resume Details */}
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
            <Typography  variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
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
                      <Typography  variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Current Position:</strong>{' '}
                        {resume.resume_data?.work?.[0]?.designation_at_company || 'N/A'}
                      </Typography>
                      <Typography  variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Experience:</strong>{' '}
                        {resume.resume_data?.experience_in_number
                          ? `${resume.resume_data.experience_in_number} year(s)`
                          : 'N/A'}
                      </Typography>
                      <Typography  variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Education:</strong>{' '}
                        {`${resume.resume_data?.education?.Degree || ''} - ${
                          resume.resume_data?.education?.institution || ''
                        } (${resume.resume_data?.education?.year_of_graduation || ''})` || 'N/A'}
                      </Typography>
                      <Typography  variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Contact:</strong>{' '}
                        {resume.resume_data?.phone || resume.resume_data?.email || 'N/A'}
                      </Typography>
                      <Typography  variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Prev Interview:</strong> N/A
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 1 }}
                        // onClick={() =>
                        //   resume.file_data &&
                        //   window.open(`data:application/pdf;base64,${resume.file_data}`)
                        // }
                                                onClick={() => handleViewResume(resume.file_data)}

                      >
                        View CV/Resume
                      </Button>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography  variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>About:</strong> N/A
                      </Typography>
                      <Typography  variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Key Skills:</strong>
                        <ul>
                          {resume.resume_data?.skills?.map((skill: string, idx: number) => (
                            <li key={idx}>{skill}</li>
                          )) || <li>N/A</li>}
                        </ul>
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography  variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Uploaded By:</strong> {resume.resume_data?.created_by || createdBy}
                      </Typography>
                      <Typography  variant="h6" sx={{ fontSize: 10, color: '#000', paddingTop: '5px' }}>
                        <strong>Upcoming Interview:</strong> Not Scheduled
                      </Typography>
                      <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={() => navigate('/interviewSchedule')}>
                        Schedule Interview
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Modal>
      </div>
    </LocalizationProvider>
  );
};

export default CollectionDefault;