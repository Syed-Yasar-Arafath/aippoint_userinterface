// import React, { useState } from 'react'
// import {
//   Button,
//   Card,
//   Checkbox,
//   Divider,
//   Grid,
//   InputBase,
//   MenuItem,
//   Select,
//   Typography,
// } from '@mui/material'
// import { useNavigate } from 'react-router-dom';

// import {
//   Search,
//   ExpandMore,
//   MoreVert,
//   Padding,
//   Margin,
// } from '@mui/icons-material'

// // Define the Job type
// interface Job {
//   id: number
//   title: string
//   date: string
//   jobId: string
//   createdBy: string
//   description: string
//   experience: string
//   type: string
//   remote: boolean
//   openPositions: string
//   skills: number
//   location: string
//   matchingProfiles: number
//   newProfiles: number
// }

// const JdCollection: React.FC = () => {
//   const jobs: Job[] = Array(2)
//     .fill({
//       id: 1,
//       title: 'Full - Stack Developer',
//       date: '18-March-2024',
//       jobId: 'IOS-KIR-01',
//       createdBy: 'Rohan Das',
//       description:
//         'We are seeking a highly skilled Full Stack Developer with over 10 years of experience in building robust and scalable applications. Proficient in React.js, Node.js, and MongoDB, you will be responsible for crafting clean and efficient code that significantly boosts application performance. Your expertise in optimizing systems will ensure seamless operation and user satisfaction.',
//       experience: '10 Years',
//       type: 'Full-Time',
//       remote: true,
//       openPositions: '06',
//       skills: 15,
//       location: 'Bangalore, India',
//       matchingProfiles: 95,
//       newProfiles: 30,
//     })
//     .map((job, index) => ({ ...job, id: index + 1 }))

//   const [currentPage, setCurrentPage] = useState(1)
//   const totalPages = 4
//   const CustomExpandMore = () => (
//     <ExpandMore sx={{ fontSize: '20px', color: '#666', marginRight: '10px' }} /> // adjust size as needed
//   )

//   const pillStyle = {
//     fontSize: '10px',
//     backgroundColor: '#f5f5f5',
//     px: 1.5,
//     py: 0.5,
//     borderRadius: '6px',
//     display: 'inline-block',
//     color: '#555',
//     fontWeight: 400,
//     fontFamily: 'SF Pro Display',
//     margin: '5px',
//   }

//   //  useEffect(() => {
//   //   const fetchJobData = async () => {
//   //     try {
//   //       const response = await getJobActive(organisation)
//   //       const jdid = jobid
//   //       if (jdid != null) {
//   //         const selectedValue = jdid
//   //         const job = response.find((item: any) => item.jobid == selectedValue)
//   //         dispatch(loaderOn())
//   //         try {
//   //           setJdTitle(job.job_title.trim())
//   //           const searchText = job?.job_title.trim()
//   //           const selectedExpValue = job?.experience_required
//   //           const selectedSkillValue = job?.skills.trim()
//   //             ? [job?.skills.trim()]
//   //             : []
//   //           const selectedLocValue = job?.location.trim()
//   //           const jsonData: {
//   //             skills?: string[]
//   //             exp?: any
//   //             designation?: string
//   //             location?: string
//   //           } = {}

//   //           if (searchText) {
//   //             jsonData.designation = searchText
//   //           }
//   //           if (selectedSkillValue.length > 0) {
//   //             jsonData.skills = selectedSkillValue
//   //           }
//   //           if (selectedExpValue) {
//   //             jsonData.exp = selectedExpValue
//   //           }
//   //           if (selectedLocValue) {
//   //             jsonData.location = selectedLocValue
//   //           }

//   //           const resumeResponse = await getAllResume(jsonData)
//   //           const jsonDataa = { jd_id: parseInt(jobid, 10) }

//   //           // dispatch(loaderOn())
//   //           try {
//   //             const res = await getResumeScore(jsonDataa)
//   //             console.log(res)

//   //             if (res) {
//   //               const sortedProfiles = res.sort(
//   //                 (a: any, b: any) => b.score - a.score,
//   //               )
//   //               setProfile(sortedProfiles)
//   //             }
//   //             dispatch(loaderOff())
//   //           } catch (err) {
//   //             console.error('Request error:', err)
//   //             dispatch(loaderOff())
//   //           }
//   //           // setProfile(resumeResponse)
//   //           // setProfileLength(resumeResponse.length)

//   //           // dispatch(loaderOff())
//   //         } catch (error) {
//   //           console.error('Request error:', error)
//   //           dispatch(loaderOff())
//   //         }
//   //       }
//   //     } catch (error) {
//   //       console.error('Error fetching active jobs:', error)
//   //     }
//   //   }

//   //   fetchJobData()
//   // }, [jobid])

//   const JobCard: React.FC<{ job: Job }> = ({ job }) => (
//     <Card
//       variant="outlined"
//       sx={{
//         mb: 2,
//         borderRadius: '8px',
//         borderColor: '#e0e0e0',
//         px: 2,
//         py: 1.5,
//       }}
//     >
//       <Grid container spacing={2} alignItems="flex-start">
//         <Grid item>
//           <Checkbox />
//         </Grid>

//         <Grid item xs>
//           <Typography
//             variant="h6"
//             sx={{ color: '#1976d2', fontWeight: 600, fontSize: 12 }}
//           >
//             {job.title}
//           </Typography>
//           <Typography variant="body2" sx={{ fontSize: 10, color: '#666' }}>
//             <strong>Created:</strong> {job.date} | <strong>Job ID:</strong>{' '}
//             {job.jobId} |{' '}
//             <strong>
//               Created By:
//               <img
//                 src="assets/static/images/Group 1171277791.png" // replace with your actual image path or URL
//                 alt="Creator"
//                 style={{
//                   width: 14,
//                   height: 14,
//                   marginLeft: 4,
//                   verticalAlign: 'middle',
//                 }}
//               />
//             </strong>{' '}
//             {job.createdBy}{' '}
//           </Typography>

//           <Typography
//             variant="body2"
//             sx={{
//               fontSize: 12,
//               color: '#666',
//               mt: 1,
//               fontFamily: 'SF Pro Display',
//             }}
//           >
//             {job.description}
//           </Typography>
//         </Grid>

//         <Divider
//           orientation="vertical"
//           flexItem
//           sx={{
//             mx: 2,
//             my: 2,
//             borderColor: '#333',
//             borderWidth: '1.5px',
//           }}
//         />

//         <Grid item xs={3}>
//           <Grid container spacing={1}>
//             <Grid item xs={6}>
//               <Typography sx={pillStyle}>
//                 Experience: {job.experience}
//               </Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <Typography sx={pillStyle}>{job.type}</Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <Typography sx={pillStyle}>Remote</Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <Typography sx={pillStyle}>Open: {job.openPositions}</Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <Typography sx={pillStyle}>{job.skills} Skills</Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <Typography sx={pillStyle}>{job.location}</Typography>
//             </Grid>
//           </Grid>
//         </Grid>

//         <Divider
//           orientation="vertical"
//           flexItem
//           sx={{
//             mx: 2,
//             my: 2,
//             borderColor: '#333',
//             borderWidth: '1.5px',
//           }}
//         />

//         <Grid
//           item
//           xs={2}
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'flex-end',
//             justifyContent: 'center',
//             marginLeft: '140px',
//           }}
//         >
//           <div
//             style={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               gap: '16px',
//             }}
//           >
//             {/* Matching Profiles Info Boxes */}
//             <div style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap' }}>
//               {/* Total Matching Profiles */}
//               <div
//                 style={{
//                   border: '1px solid #e5e7eb',
//                   borderRadius: '8px',
//                   padding: '8px 16px',
//                   color: '#6b7280',
//                   fontSize: '10px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   height: '40px',
//                   justifyContent: 'flex-start', // Align both elements on the same line
//                   whiteSpace: 'nowrap', // Prevent wrapping
//                 }}
//               >
//                 <span
//                   style={{ fontFamily: 'SF Pro Display', fontSize: '10px' }}
//                 >
//                   Matching Profiles:
//                 </span>
//                 <span
//                   style={{
//                     fontWeight: 400,
//                     color: '#000',
//                     fontSize: '10px',
//                     marginLeft: '8px', // Only apply it once here
//                     fontFamily: 'SF Pro Display',
//                   }}
//                 >
//                   {job.matchingProfiles}
//                 </span>
//               </div>

//               {/* New Matching Profiles */}
//               <div
//                 style={{
//                   border: '1px solid #e5e7eb',
//                   borderRadius: '8px',
//                   padding: '8px 16px',
//                   color: '#6b7280',
//                   fontSize: '10px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   height: '40px',
//                   justifyContent: 'flex-start', // Align both elements on the same line
//                   whiteSpace: 'nowrap', // Prevent wrapping
//                   fontFamily: 'SF Pro Display',
//                 }}
//               >
//                 New Matching Profiles
//                 <span
//                   style={{
//                     marginLeft: '4px',
//                     color: 'green',
//                     fontWeight: 400,
//                     fontFamily: 'SF Pro Display',
//                     fontSize: '10px',
//                   }}
//                 >
//                   + {job.newProfiles} New
//                 </span>
//               </div>
//             </div>

//             {/* Quick View Button */}
//             <button
//               style={{
//                 backgroundColor: '#007AC1',
//                 color: 'white',
//                 padding: '10px 24px',
//                 border: 'none',
//                 borderRadius: '8px',
//                 fontSize: '10px',
//                 fontWeight: 500,
//                 cursor: 'pointer',
//                 fontFamily: 'SF Pro Display',
//               }}
// onClick={()=>navigate('/collectionavailable')}
//             >
//               Quick View
//             </button>
//           </div>
//         </Grid>

//         <Grid item>
//           <MoreVert sx={{ color: '#666', fontSize: '15px' }} />
//         </Grid>
//       </Grid>
//     </Card>
//   )
// const navigate = useNavigate();

//   return (
//     <div style={{ padding: '16px', maxWidth: '1280px', margin: '0 auto' }}>
//       {/* Filters */}
//       <Grid
//         container
//         spacing={2}
//         alignItems="center"
//         wrap="nowrap"
//         sx={{ overflowX: 'auto', mb: 2 }}
//       >
//         {/* Search Input */}
//         <Grid item>
//           <div
//             style={{
//               position: 'relative',
//               width: '200px',
//               height: '40px',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               display: 'flex',
//               alignItems: 'center',
//               paddingLeft: '12px',
//             }}
//           >
//             <InputBase
//               placeholder="Search..."
//               sx={{
//                 fontSize: '12px',
//                 width: '100%',
//               }}
//             />
//             <Search
//               fontSize="small" // options: "small", "medium", "large", or default
//               sx={{
//                 position: 'absolute',
//                 right: '8px',
//                 top: '50%',
//                 transform: 'translateY(-50%)',
//                 color: '#666',
//               }}
//             />
//           </div>
//         </Grid>

//         {/* Filter Selects */}
//         {[
//           'Select Job Role',
//           'Select Experience',
//           'Select Location',
//           'Active Jobs',
//           'Select Date',
//           'Select',
//         ].map((label, i) => (
//           <Grid item key={i}>
//             <Select
//               displayEmpty
//               value=""
//               IconComponent={CustomExpandMore}
//               sx={{
//                 height: '40px',
//                 width: '158px',
//                 fontSize: '14px',
//                 border: '1px solid #ccc',
//                 borderRadius: '4px',
//                 backgroundColor: '#fff',
//               }}
//               renderValue={() => (
//                 <Typography sx={{ color: '#666', fontSize: '12px' }}>
//                   {label}
//                 </Typography>
//               )}
//             >
//               <MenuItem
//                 value=""
//                 disabled
//                 sx={{ color: '#666', fontSize: '12px' }}
//               >
//                 {label}
//               </MenuItem>
//             </Select>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Job Cards */}
//       {jobs.map((job) => (
//         <JobCard key={job.id} job={job} />
//       ))}

//       {/* Pagination */}
//       <Grid container justifyContent="center" spacing={1} mt={2}>
//         <Grid item>
//           <Button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(currentPage - 1)}
//             sx={{ textTransform: 'none', fontSize: '12px' }}
//           >
//             Prev
//           </Button>
//         </Grid>
//         {[1, 2, 3, 4].map((n) => (
//           <Grid item key={n}>
//             <Button
//               onClick={() => setCurrentPage(n)}
//               sx={{
//                 minWidth: '32px',
//                 height: '32px',
//                 borderRadius: '4px',
//                 backgroundColor: n === currentPage ? '#1976d2' : 'transparent',
//                 color: n === currentPage ? 'white' : '#1976d2',
//                 fontSize: '12px',
//               }}
//             >
//               {n}
//             </Button>
//           </Grid>
//         ))}
//         <Grid item>
//           <Typography sx={{ fontSize: '12px', color: '#666', padding: '8px' }}>
//             ...
//           </Typography>
//         </Grid>
//         <Grid item>
//           <Button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(currentPage + 1)}
//             sx={{ textTransform: 'none', fontSize: '12px' }}
//           >
//             Next
//           </Button>
//         </Grid>
//       </Grid>
//     </div>
//   )
// }

// export default JdCollection
import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  InputBase,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import {
  Search,
  ExpandMore,
  MoreVert,
} from '@mui/icons-material'
import { loaderOff, loaderOn, openSnackbar } from '../redux/actions'
import { t } from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';

interface Job {
  jobid: number
  referenceNumber: string
  job_title: string
  job_role: string
  createdBy:string
  experience_required: string
  location: string
  type: string
  job_type: string[]
  skills: string
  company_name: string | null
  modeOfWork: string
  specificDomainSkills: string
  primarySkills: string
  secondarySkills: string
  job_description: string
  created_on: string
  rolecategory: string
  newLocation: {
    country: string
    state: string
    city: string
  }
}


const JdCollection: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  // const totalPages = 4
  

  const navigate = useNavigate()
  const organisation = localStorage.getItem('organisation')
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()
  
const { t } = useTranslation();
 const [matchingResumes, setMatchingResumes] = useState<{
    [key: string]: number
  }>({})
  const [scoredResumes, setScoredResumes] = useState<{
    [key: string]: number
  }>({})
 
  const fetchScoredResumes = async () => {
    if (!jobs.length) return

    const counts: { [key: string]: number } = {}
    dispatch(loaderOn())
    try {
      await Promise.all(
        jobs.map(async (job) => {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/count_scored_resumes_for_jd/`,
              { job_id: job.jobid },
              {
                headers: {
                  Organization: organisation,
                },
              },
            )
            counts[job.jobid] = response.data.scored_resumes_count || 0
          } catch (err) {
            console.error(
              `Error fetching scored resumes for job ${job.jobid}:`,
              err,
            )
          }
        }),
      )
      setScoredResumes(counts)
      dispatch(loaderOff())
    } catch (error) {
      setError(t('failedToFetchScoredResumes'))
    }
  }

  const fetchMatchingResumes = async () => {
    if (!jobs.length) return

    const counts: { [key: string]: number } = {}

    try {
      await Promise.all(
        jobs.map(async (job) => {
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
            )
            counts[job.jobid] = response.data.matching_resume_count || 0
          } catch (err) {
            console.error(
              `Error fetching matching resumes for job ${job.jobid}:`,
              err,
            )
          }
        }),
      )
      setMatchingResumes(counts)
    } catch (error) {
      setError(t('failedToFetchMatchingResumes'))
    }
  }

  useEffect(() => {
    fetchScoredResumes()
    fetchMatchingResumes()
  }, [jobs])
  // const navigate = useNavigate()
  // const job_id = location.state?.job_id || jobId

  
  const fetchscore = async (job_id : any) => {
    if (!job_id) return
    dispatch(loaderOn())
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
      )
      console.log(response)
      if (response) {
        dispatch(openSnackbar(t('scoringCompleted'), 'green'))
      } else {
        dispatch(openSnackbar(t('scoringFailed'), 'red'))
      }
      // handleSkillChange() // Assuming handleSkillChange is defined and does something
      dispatch(loaderOff())
      navigate('/jdccollection')
      // counts[job.jobid] = response.data.matching_resume_count || 0
    } catch (err) {
      console.error(`Error fetching resumes for job ${job_id}:`, err)
      dispatch(loaderOff())
    }
  }

   const handleClickScore = (a: any) => {
    fetchscore(a)
    // Additional logic you want to execute on score button click
  }
 useEffect(() => {
  const fetchJobs = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:8082/user/read/${organisation}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('API response:', response.data)

      // ✅ set jobs from job_description field
      if (Array.isArray(response.data.job_description)) {
        setJobs(response.data.job_description)
      } else {
        console.error('Unexpected response format:', response.data)
        setError('Unexpected response format from server.')
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setError('Failed to fetch job data.')
    } finally {
      setLoading(false)
    }
  }

  fetchJobs()
}, [])
  const handleViewClick = (jobId: any) => {
    // setDispatchLoading(true)
    navigate(`/noscore/${jobId}`, { state: { job_id: jobId } })
  }

  const handleScoreClick = (jobId: any) => {
    // setDispatchLoading(true)
    navigate(`/resumetable/${jobId}`, { state: { job_id: jobId } })
  }

const [jobRoleFilter, setJobRoleFilter] = useState('')
const [experienceFilter, setExperienceFilter] = useState('')
const [locationFilter, setLocationFilter] = useState('')
const jobRoles = Array.from(new Set(jobs.map((j) => j.job_role).filter(Boolean)))
const experiences = Array.from(new Set(jobs.map((j) => j.experience_required).filter(Boolean)))
const locations = Array.from(new Set(jobs.map((j) => j.location).filter(Boolean)))
const filteredJobs = jobs.filter((job) => {
  return (
    (jobRoleFilter === '' || job.job_role === jobRoleFilter) &&
    (experienceFilter === '' || job.experience_required === experienceFilter) &&
    (locationFilter === '' || job.location === locationFilter)
  )
})

 const pageSize = 4
const totalPages = Math.ceil(filteredJobs.length / pageSize)
const startIdx = (currentPage - 1) * pageSize
const endIdx = startIdx + pageSize
const paginatedJobs = filteredJobs.slice(startIdx, endIdx)



  const CustomExpandMore = () => (
    <ExpandMore sx={{ fontSize: '20px', color: '#666', marginRight: '10px' }} />
  )

  const pillStyle = {
    fontSize: '10px',
    backgroundColor: '#f5f5f5',
    px: 1.5,
    py: 0.5,
    borderRadius: '6px',
    display: 'inline-block',
    color: '#555',
    fontWeight: 400,
    fontFamily: 'SF Pro Display',
    margin: '5px',
  }

  const JobCard: React.FC<{ job: Job }> = ({ job }) => (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderRadius: '8px',
        borderColor: '#e0e0e0',
        px: 2,
        py: 1.5,
      }}
    >
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item>
          <Checkbox />
        </Grid>

        <Grid item xs>
          <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600, fontSize: 12 }}>
            {job.job_title}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 10, color: '#666' }}>
            <strong>Created:</strong> {job.created_on} | <strong>Job ID:</strong> {job.referenceNumber} |{' '}
            <strong>
              Created By:
              <img
                src="/assets/static/images/Group 1171277791.png"
                alt="Creator"
                style={{
                  width: 14,
                  height: 14,
                  marginLeft: 4,
                  verticalAlign: 'middle',
                }}
              />
            </strong>{' '}
            {job.createdBy}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: 12,
              color: '#666',
              mt: 1,
              fontFamily: 'SF Pro Display',
            }}
          >
            {job.job_description}
          </Typography>
        </Grid>

        <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 2, borderColor: '#333', borderWidth: '1.5px' }} />

        <Grid item xs={3}>
          <Grid container spacing={1}>
            <Grid item xs={6}><Typography sx={pillStyle}>Experience: {job.experience_required}</Typography></Grid>
            <Grid item xs={6}><Typography sx={pillStyle}>{job.type}</Typography></Grid>
            {/* <Grid item xs={6}><Typography sx={pillStyle}>{job.remote ? 'Remote' : 'On-Site'}</Typography></Grid> */}
            {/* <Grid item xs={6}><Typography sx={pillStyle}>Open: {job.openPositions}</Typography></Grid> */}
            <Grid item xs={6}><Typography sx={pillStyle}>Skills:{job.skills} </Typography></Grid>
            <Grid item xs={6}><Typography sx={pillStyle}>{job.location}</Typography></Grid>
          </Grid>
        </Grid>

        <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 2, borderColor: '#333', borderWidth: '1.5px' }} />

        <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', marginLeft: '180px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap' }}>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 16px', color: '#6b7280', fontSize: '10px', display: 'flex', alignItems: 'center', height: '40px', justifyContent: 'flex-start', whiteSpace: 'nowrap' }}>
                <span style={{ fontFamily: 'SF Pro Display', fontSize: '10px' }}>Matching Profiles:{scoredResumes[job.jobid]} <button onClick={() => handleScoreClick(job.jobid)}
>view</button></span>
                <span style={{ fontWeight: 400, color: '#000', fontSize: '10px', marginLeft: '8px', fontFamily: 'SF Pro Display' }}>
                  {/* {job.matchingProfiles} */}
                </span>
              </div>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 16px', color: '#6b7280', fontSize: '10px', display: 'flex', alignItems: 'center', height: '40px', justifyContent: 'flex-start', whiteSpace: 'nowrap', fontFamily: 'SF Pro Display' }}>
                New Matching Profiles : {matchingResumes[job.jobid]}<button onClick={() => handleViewClick(job.jobid)}
> view</button>
                <span style={{ marginLeft: '4px', color: 'green', fontWeight: 400, fontFamily: 'SF Pro Display', fontSize: '10px' }}>
                  {/* + {job.newProfiles} New */}
{/* <button onClick={() => handleClickScore(job.jobid)}>Score</button> */}
                </span>
              </div>
            </div>

          <button
  style={{
    backgroundColor: '#007AC1',
    color: 'white',
    padding: '10px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'SF Pro Display',
  }}
  onClick={() => navigate(`/jdprofileview/${job.jobid}`)}
>
  Quick View
</button>
          </div>
        </Grid>

        <Grid item>
          <MoreVert sx={{ color: '#666', fontSize: '15px' }} />
        </Grid>
      </Grid>
    </Card>
  )

  return (
    <div style={{ padding: '35px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Filters */}
      {/* <Grid container spacing={2} alignItems="center" wrap="nowrap" sx={{ overflowX: 'auto', mb: 2 }}>
        <Grid item>
          <div style={{ position: 'relative', width: '200px', height: '40px', border: '1px solid #ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
            <InputBase placeholder="Search..." sx={{ fontSize: '12px', width: '100%' }} />
            <Search fontSize="small" sx={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          </div>
        </Grid>
        {['Select Job Role', 'Select Experience', 'Select Location', 'Active Jobs', 'Select Date', 'Select'].map((label, i) => (
          <Grid item key={i}>
            <Select
              displayEmpty
              value=""
              IconComponent={CustomExpandMore}
              sx={{ height: '40px', width: '158px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}
              renderValue={() => (
                <Typography sx={{ color: '#666', fontSize: '12px' }}>{label}</Typography>
              )}
            >
              <MenuItem value="" disabled sx={{ color: '#666', fontSize: '12px' }}>{label}</MenuItem>
            </Select>
          </Grid>
        ))}
      </Grid> */}
      <Grid container spacing={2} alignItems="center" wrap="nowrap" sx={{  mb: 2 }}>
  <Grid item>
    <div style={{ position: 'relative', width: '200px', height: '40px', border: '1px solid #ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
      <InputBase placeholder="Search..." sx={{ fontSize: '12px', width: '100%' }} />
      <Search fontSize="small" sx={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
    </div>
  </Grid>

  <Grid item>
    <Select
      displayEmpty
      value={jobRoleFilter}
      onChange={(e) => setJobRoleFilter(e.target.value)}
      IconComponent={CustomExpandMore}
      sx={{ height: '40px', width: '158px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}
      renderValue={() => (
        <Typography sx={{ color: '#666', fontSize: '12px' }}>
          {jobRoleFilter || 'Select Job Role'}
        </Typography>
      )}
    >
      <MenuItem value="" disabled>Select Job Role</MenuItem>
      {jobRoles.map((role, idx) => (
        <MenuItem key={idx} value={role}>{role}</MenuItem>
      ))}
    </Select>
  </Grid>

  <Grid item>
    <Select
      displayEmpty
      value={experienceFilter}
      onChange={(e) => setExperienceFilter(e.target.value)}
      IconComponent={CustomExpandMore}
      sx={{ height: '40px', width: '158px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}
      renderValue={() => (
        <Typography sx={{ color: '#666', fontSize: '12px' }}>
          {experienceFilter || 'Select Experience'}
        </Typography>
      )}
    >
      <MenuItem value="" disabled>Select Experience</MenuItem>
      {experiences.map((exp, idx) => (
        <MenuItem key={idx} value={exp}>{exp}</MenuItem>
      ))}
    </Select>
  </Grid>

  <Grid item>
    <Select
      displayEmpty
      value={locationFilter}
      onChange={(e) => setLocationFilter(e.target.value)}
      IconComponent={CustomExpandMore}
      sx={{ height: '40px', width: '158px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}
      renderValue={() => (
        <Typography sx={{ color: '#666', fontSize: '12px' }}>
          {locationFilter || 'Select Location'}
        </Typography>
      )}
    >
      <MenuItem value="" disabled>Select Location</MenuItem>
      {locations.map((loc, idx) => (
        <MenuItem key={idx} value={loc}>{loc}</MenuItem>
      ))}
    </Select>
  </Grid>
</Grid>


      {/* Job Cards */}
      {loading ? (
        <Typography>Loading jobs...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : jobs.length === 0 ? (
        <Typography>No jobs found.</Typography>
      ) : (
        paginatedJobs.map((job) => <JobCard key={job.jobid} job={job} />)
      )}

      {/* Pagination */}
      <Grid container justifyContent="center" spacing={1} mt={2}>
        <Grid item>
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} sx={{ textTransform: 'none', fontSize: '12px' }}>
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
          <Typography sx={{ fontSize: '12px', color: '#666', padding: '8px' }}>...</Typography>
        </Grid>
        <Grid item>
          <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} sx={{ textTransform: 'none', fontSize: '12px' }}>
            Next
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default JdCollection
