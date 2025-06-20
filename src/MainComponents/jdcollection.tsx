import React, { useState } from 'react'
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
import {
  Search,
  ExpandMore,
  MoreVert,
  Padding,
  Margin,
} from '@mui/icons-material'

// Define the Job type
interface Job {
  id: number
  title: string
  date: string
  jobId: string
  createdBy: string
  description: string
  experience: string
  type: string
  remote: boolean
  openPositions: string
  skills: number
  location: string
  matchingProfiles: number
  newProfiles: number
}

const JdCollection: React.FC = () => {
  const jobs: Job[] = Array(2)
    .fill({
      id: 1,
      title: 'Full - Stack Developer',
      date: '18-March-2024',
      jobId: 'IOS-KIR-01',
      createdBy: 'Rohan Das',
      description:
        'We are seeking a highly skilled Full Stack Developer with over 10 years of experience in building robust and scalable applications. Proficient in React.js, Node.js, and MongoDB, you will be responsible for crafting clean and efficient code that significantly boosts application performance. Your expertise in optimizing systems will ensure seamless operation and user satisfaction.',
      experience: '10 Years',
      type: 'Full-Time',
      remote: true,
      openPositions: '06',
      skills: 15,
      location: 'Bangalore, India',
      matchingProfiles: 95,
      newProfiles: 30,
    })
    .map((job, index) => ({ ...job, id: index + 1 }))

  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 4
  const CustomExpandMore = () => (
    <ExpandMore sx={{ fontSize: '20px', color: '#666', marginRight: '10px' }} /> // adjust size as needed
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
          <Typography
            variant="h6"
            sx={{ color: '#1976d2', fontWeight: 600, fontSize: 12 }}
          >
            {job.title}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 10, color: '#666' }}>
            <strong>Created:</strong> {job.date} | <strong>Job ID:</strong>{' '}
            {job.jobId} |{' '}
            <strong>
              Created By:
              <img
                src="assets/static/images/Group 1171277791.png" // replace with your actual image path or URL
                alt="Creator"
                style={{
                  width: 14,
                  height: 14,
                  marginLeft: 4,
                  verticalAlign: 'middle',
                }}
              />
            </strong>{' '}
            {job.createdBy}{' '}
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
            {job.description}
          </Typography>
        </Grid>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            mx: 2,
            my: 2,
            borderColor: '#333',
            borderWidth: '1.5px',
          }}
        />

        <Grid item xs={3}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography sx={pillStyle}>
                Experience: {job.experience}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={pillStyle}>{job.type}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={pillStyle}>Remote</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={pillStyle}>Open: {job.openPositions}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={pillStyle}>{job.skills} Skills</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={pillStyle}>{job.location}</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            mx: 2,
            my: 2,
            borderColor: '#333',
            borderWidth: '1.5px',
          }}
        />

        <Grid
          item
          xs={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'center',
            marginLeft: '140px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {/* Matching Profiles Info Boxes */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap' }}>
              {/* Total Matching Profiles */}
              <div
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#6b7280',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  height: '40px',
                  justifyContent: 'flex-start', // Align both elements on the same line
                  whiteSpace: 'nowrap', // Prevent wrapping
                }}
              >
                <span
                  style={{ fontFamily: 'SF Pro Display', fontSize: '10px' }}
                >
                  Matching Profiles:
                </span>
                <span
                  style={{
                    fontWeight: 400,
                    color: '#000',
                    fontSize: '10px',
                    marginLeft: '8px', // Only apply it once here
                    fontFamily: 'SF Pro Display',
                  }}
                >
                  {job.matchingProfiles}
                </span>
              </div>

              {/* New Matching Profiles */}
              <div
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#6b7280',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  height: '40px',
                  justifyContent: 'flex-start', // Align both elements on the same line
                  whiteSpace: 'nowrap', // Prevent wrapping
                  fontFamily: 'SF Pro Display',
                }}
              >
                New Matching Profiles
                <span
                  style={{
                    marginLeft: '4px',
                    color: 'green',
                    fontWeight: 400,
                    fontFamily: 'SF Pro Display',
                    fontSize: '10px',
                  }}
                >
                  + {job.newProfiles} New
                </span>
              </div>
            </div>

            {/* Quick View Button */}
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
    <div style={{ padding: '16px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Filters */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        wrap="nowrap"
        sx={{ overflowX: 'auto', mb: 2 }}
      >
        {/* Search Input */}
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
              sx={{
                fontSize: '12px',
                width: '100%',
              }}
            />
            <Search
              fontSize="small" // options: "small", "medium", "large", or default
              sx={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666',
              }}
            />
          </div>
        </Grid>

        {/* Filter Selects */}
        {[
          'Select Job Role',
          'Select Experience',
          'Select Location',
          'Active Jobs',
          'Select Date',
          'Select',
        ].map((label, i) => (
          <Grid item key={i}>
            <Select
              displayEmpty
              value=""
              IconComponent={CustomExpandMore}
              sx={{
                height: '40px',
                width: '158px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
              }}
              renderValue={() => (
                <Typography sx={{ color: '#666', fontSize: '12px' }}>
                  {label}
                </Typography>
              )}
            >
              <MenuItem
                value=""
                disabled
                sx={{ color: '#666', fontSize: '12px' }}
              >
                {label}
              </MenuItem>
            </Select>
          </Grid>
        ))}
      </Grid>

      {/* Job Cards */}
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}

      {/* Pagination */}
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
        {[1, 2, 3, 4].map((n) => (
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
          <Typography sx={{ fontSize: '12px', color: '#666', padding: '8px' }}>
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
  )
}

export default JdCollection
