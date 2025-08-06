import React, { useEffect, useState, useMemo } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  InputBase,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, ExpandMore, MoreVert } from '@mui/icons-material';
import { loaderOff, loaderOn, openSnackbar } from '../redux/actions';
import { t } from 'i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import Header from '../CommonComponents/topheader';

interface Job {
  jobid: number;
  email: string;
  no_of_open_positions: number;
  referenceNumber: string;
  job_title: string;
  job_role: string;
  createdBy: string;
  experience_required: string;
  location: string;
  type: string;
  job_type: string[];
  skills: string;
  company_name: string | null;
  modeOfWork: string;
  specificDomainSkills: string;
  primarySkills: string;
  secondarySkills: string;
  job_description: string;
  created_on: string;
  rolecategory: string;
  newLocation: {
    country: string;
    state: string;
    city: string;
  };
}

const JdCollection: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [creator, setCreator] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scoredResumesCache, setScoredResumesCache] = useState<{ [key: string]: number }>({});
  const [matchingResumesCache, setMatchingResumesCache] = useState<{ [key: string]: number }>({});
  const [scoredResumes, setScoredResumes] = useState<{ [key: string]: number }>({});
  const [matchingResumes, setMatchingResumes] = useState<{ [key: string]: number }>({});
  const [jobRoleFilter, setJobRoleFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [searchText, setSearchText] = useState('');

  const navigate = useNavigate();
  const organisation = localStorage.getItem('organisation');
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const fetchScoredResumes = async () => {
    if (!jobs.length) return;

    const jobsToFetch = jobs.filter((job) => !(job.jobid in scoredResumesCache));
    if (!jobsToFetch.length) return;

    dispatch(loaderOn());
    try {
      const newCounts: { [key: string]: number } = {};
      await Promise.all(
        jobsToFetch.map(async (job) => {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/count_scored_resumes_for_jd/`,
              { job_id: job.jobid },
              {
                headers: {
                  Organization: organisation,
                  'Content-Type': 'application/json',
                },
              },
            );
            newCounts[job.jobid] = response.data.scored_resumes_count || 0;
          } catch (err) {
            console.error(`Error fetching scored resumes for job ${job.jobid}:`, err);
          }
        }),
      );
      setScoredResumesCache((prev) => ({ ...prev, ...newCounts }));
      setScoredResumes((prev) => ({ ...prev, ...newCounts }));
      dispatch(loaderOff());
    } catch (error) {
      setError(t('failedToFetchScoredResumes'));
      dispatch(loaderOff());
    }
  };

  const fetchMatchingResumes = async () => {
    if (!jobs.length) return;

    const jobsToFetch = jobs.filter((job) => !(job.jobid in matchingResumesCache));
    if (!jobsToFetch.length) return;

    try {
      const newCounts: { [key: string]: number } = {};
      await Promise.all(
        jobsToFetch.map(async (job) => {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/matching-resumes-count/`,
              { job_id: job.jobid },
              {
                headers: {
                  Organization: organisation,
                  'Content-Type': 'application/json',
                },
              },
            );
            newCounts[job.jobid] = response.data.matching_resume_count || 0;
          } catch (err) {
            console.error(`Error fetching matching resumes for job ${job.jobid}:`, err);
          }
        }),
      );
      setMatchingResumesCache((prev) => ({ ...prev, ...newCounts }));
      setMatchingResumes((prev) => ({ ...prev, ...newCounts }));
    } catch (error) {
      setError(t('failedToFetchMatchingResumes'));
    }
  };

  // Debounce the fetch functions
  const debouncedFetchScoredResumes = debounce(fetchScoredResumes, 500);
  const debouncedFetchMatchingResumes = debounce(fetchMatchingResumes, 500);

  useEffect(() => {
    debouncedFetchScoredResumes();
    debouncedFetchMatchingResumes();

    return () => {
      debouncedFetchScoredResumes.cancel();
      debouncedFetchMatchingResumes.cancel();
    };
  }, [jobs]);

  // Clean up cache for removed jobs
  useEffect(() => {
    setScoredResumesCache((prev) => {
      const updatedCache = { ...prev };
      Object.keys(updatedCache).forEach((jobId) => {
        if (!jobs.some((job) => job.jobid.toString() === jobId)) {
          delete updatedCache[jobId];
        }
      });
      return updatedCache;
    });
    setMatchingResumesCache((prev) => {
      const updatedCache = { ...prev };
      Object.keys(updatedCache).forEach((jobId) => {
        if (!jobs.some((job) => job.jobid.toString() === jobId)) {
          delete updatedCache[jobId];
        }
      });
      return updatedCache;
    });
  }, [jobs]);

  const fetchscore = async (job_id: number) => {
    if (!job_id) return;
    dispatch(loaderOn());
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/resume_scoring/`,
        { job_id },
        {
          headers: {
            Organization: organisation,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data) {
        dispatch(openSnackbar(t('scoringCompleted'), 'green'));
      } else {
        dispatch(openSnackbar(t('scoringFailed'), 'red'));
      }
      dispatch(loaderOff());
      navigate('/jdccollection');
    } catch (err) {
      console.error(`Error fetching resumes for job ${job_id}:`, err);
      dispatch(openSnackbar(t('scoringFailed'), 'red'));
      dispatch(loaderOff());
    }
  };

  const handleClickScore = (jobId: number) => {
    fetchscore(jobId);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://parseez.ai/parseez-spring-service/user/read/${organisation}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setCreator(response.data.email);
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
  }, [organisation, token]);

  const handleViewClick = (jobId: number) => {
    navigate(`/noscore/${jobId}`, { state: { job_id: jobId } });
  };

  const handleScoreClick = (jobId: number) => {
    navigate(`/resumetable/${jobId}`, { state: { job_id: jobId } });
  };

  const jobRoles = Array.from(new Set(jobs.map((j) => j.job_role).filter(Boolean)));
  const experiences = Array.from({ length: 10 }, (_, i) => `${i + 1}`);
  const locations = Array.from(
    new Set(
      jobs
        .map((j) => `${j.newLocation.city}, ${j.newLocation.country}`)
        .filter(Boolean)
    )
  );

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = job.job_title.toLowerCase().includes(searchText.toLowerCase());
      return (
        matchesSearch &&
        (jobRoleFilter === '' || job.job_role === jobRoleFilter) &&
        (experienceFilter === '' || job.experience_required === experienceFilter) &&
        (locationFilter === '' ||
          `${job.newLocation.city}, ${job.newLocation.country}` === locationFilter)
      );
    });
  }, [jobs, searchText, jobRoleFilter, experienceFilter, locationFilter]);

  const pageSize = 3;
  const totalPages = Math.ceil(filteredJobs.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const paginatedJobs = filteredJobs.slice(startIdx, endIdx);

  const CustomExpandMore = () => (
    <ExpandMore sx={{ fontSize: '20px', color: '#666', marginRight: '10px' }} />
  );

  const pillStyle = {
    fontSize: '10px',
    backgroundColor: '#fff',
    border: '1px solid #f5f5f5',
    px: 1.5,
    py: 0.5,
    borderRadius: '6px',
    display: 'inline-block',
    color: '#555',
    fontWeight: 400,
    fontFamily: 'SF Pro Display',
    margin: '5px',
  };

  const JobCard: React.FC<{ job: Job }> = ({ job }) => (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderRadius: '8px',
        borderColor: '#e0e0e0',
        px: 2,
        py: 1.5,
        height: '90px',
        overflow: 'hidden',
      }}
    >
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item>
          <Checkbox />
        </Grid>
        <Grid item xs>
          <Typography
            variant="inherit"
            sx={{ fontFamily: 'SF Pro Display', color: '#0284C7', fontWeight: 500, fontSize: '14px', lineHeight: '100%' }}
          >
            {job.job_title}
          </Typography>
          <Typography variant="inherit" sx={{ fontSize: 10, color: '#666', paddingTop: '9px' }}>
            Created: <span>{job.created_on}</span>
          </Typography>
          <Typography variant="inherit" sx={{ fontSize: 10, color: '#666', paddingTop: '9px' }}>
            Job ID: <span>{job.referenceNumber}</span>
          </Typography>
          <Typography variant="inherit" sx={{ fontSize: 10, color: '#666', paddingTop: '9px' }}>
            Created By: <span>{creator}</span>
          </Typography>
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 2, borderColor: '#333', borderWidth: '1.5px' }} />
        <Grid item xs={3.5}>
          <Grid container spacing={1}>
            <Grid item>
              <Typography variant="inherit" sx={pillStyle}>
                Experience: {job.experience_required}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="inherit" sx={pillStyle}>{job.job_type[0]}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="inherit" sx={pillStyle}>{job.modeOfWork}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="inherit" sx={pillStyle}>
                Open: {job.no_of_open_positions}
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title={job.skills} arrow>
                <Typography variant="inherit" sx={pillStyle}>
                  Skills: {job.skills.split(',').slice(0, 1).join(', ')}
                  {job.skills.split(',').length > 2 ? ', ...' : ''}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography variant="inherit" sx={pillStyle}>
                {job.newLocation.city}, {job.newLocation.country}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 2, borderColor: '#333', borderWidth: '1.5px' }} />
        <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap' }}>
              <div
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '0px 16px',
                  color: '#6b7280',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  height: '40px',
                  justifyContent: 'flex-start',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontFamily: 'SF Pro Display', fontSize: '10px' }}>
                 New Matching Profiles: {matchingResumes[job.jobid] || 0}
                </span>
              </div>
              <div
                style={{
                  gap: '8px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '0px 16px',
                  color: '#6b7280',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  height: '40px',
                  justifyContent: 'flex-start',
                  whiteSpace: 'nowrap',
                  fontFamily: 'SF Pro Display',
                }}
              >
                
                 Matching Profiles: {scoredResumes[job.jobid] || 0}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
              <button
                style={{
                  backgroundColor: '#0284C7',
                  color: 'white',
                  padding: '10px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '10px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'SF Pro Display',
                }}
                onClick={() => handleViewClick(job.jobid)}
              >
                Score Profile
              </button>
              <button
                style={{
                  backgroundColor: '#0284C7',
                  color: 'white',
                  padding: '10px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '10px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'SF Pro Display',
                  marginLeft: '5px',
                }}
                onClick={() => navigate(`/jdprofileview/${job.jobid}`)}
              >
                Quick View
              </button>
            </div>
          </div>
        </Grid>
      </Grid>
    </Card>
  );

  return (
    <>
      <Header title="JD Collection" path="" />
      <div style={{ padding: '35px', maxWidth: '1280px', margin: '0 auto' }}>
        <Grid container spacing={2} alignItems="center" wrap="nowrap" sx={{ mb: 2 }}>
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
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Search
                fontSize="small"
                sx={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}
              />
            </div>
          </Grid>
          <Grid item>
            <Select
              displayEmpty
              value={jobRoleFilter}
              onChange={(e) => setJobRoleFilter(e.target.value)}
              IconComponent={CustomExpandMore}
              sx={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
              }}
              renderValue={(selected) =>
                selected ? (
                  <Typography variant="inherit" sx={{ color: '#666', fontSize: '12px' }}>
                    {selected}
                  </Typography>
                ) : (
                  <Typography variant="inherit" sx={{ color: '#aaa', fontSize: '12px' }}>
                    Select Job Role
                  </Typography>
                )
              }
            >
              <MenuItem value="" disabled>
                Select Job Role
              </MenuItem>
              {jobRoles.map((role, idx) => (
                <MenuItem key={idx} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Select
              displayEmpty
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              IconComponent={CustomExpandMore}
              sx={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
              }}
              renderValue={(selected) =>
                selected ? (
                  <Typography variant="inherit" sx={{ color: '#000', fontSize: '12px' }}>
                    {selected}
                  </Typography>
                ) : (
                  <Typography variant="inherit" sx={{ color: '#aaa', fontSize: '12px' }}>
                    Select Experience
                  </Typography>
                )
              }
            >
              <MenuItem value="" disabled>
                Select Experience
              </MenuItem>
              {experiences.map((exp, idx) => (
                <MenuItem key={idx} value={exp}>
                  {exp}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              displayEmpty
              sx={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
              }}
              renderValue={(selected) =>
                selected ? (
                  <Typography variant="inherit" sx={{ color: '#000', fontSize: '12px' }}>
                    {selected}
                  </Typography>
                ) : (
                  <Typography variant="inherit" sx={{ color: '#aaa', fontSize: '12px' }}>
                    Select Location
                  </Typography>
                )
              }
            >
              <MenuItem value="" disabled>
                Select Location
              </MenuItem>
              {locations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="small"
              sx={{
                height: '40px',
                textTransform: 'none',
                fontSize: '12px',
                borderRadius: '4px',
                padding: '0 16px',
              }}
              onClick={() => {
                setSearchText('');
                setJobRoleFilter('');
                setExperienceFilter('');
                setLocationFilter('');
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <Typography variant="inherit">Loading jobs...</Typography>
        ) : error ? (
          <Typography variant="inherit" color="error">
            {error}
          </Typography>
        ) : jobs.length === 0 ? (
          <Typography variant="inherit">No jobs found.</Typography>
        ) : (
          paginatedJobs.map((job) => <JobCard key={job.jobid} job={job} />)
        )}

        <Grid container justifyContent="center" spacing={1} mt={2}>
          <Grid item>
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              sx={{ textTransform: 'none', fontSize: '12px' }}
            >
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
            <Typography variant="inherit" sx={{ fontSize: '12px', color: '#666', padding: '8px' }}>
              ...
            </Typography>
          </Grid>
          <Grid item>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              sx={{ textTransform: 'none', fontSize: '12px' }}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default JdCollection;