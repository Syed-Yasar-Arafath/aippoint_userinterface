import React, { useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  Chip,
  Button,
  Paper,
  Modal,
  IconButton,
  TextField,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import EditNoteIcon from '@mui/icons-material/EditNote'
import WorkIcon from '@mui/icons-material/Work'
import BusinessIcon from '@mui/icons-material/Business'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ConstructionIcon from '@mui/icons-material/Construction'

type SkillCategory =
  | 'frontend'
  | 'apis'
  | 'devops'
  | 'versionControl'
  | 'backend'
  | 'database'
  | 'cloud'

const JDPreview: React.FC = () => {
  const [jobOverviewFormat, setJobOverviewFormat] = useState<
    'bullet' | 'step' | 'paragraph'
  >('paragraph')
  const [jobOverviewText, setJobOverviewText] = useState('')

  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const initialSkills: Record<SkillCategory, string[]> = {
    frontend: ['React.js', 'Vue.js', 'Angular'],
    apis: ['RESTful APIs', 'GraphQL'],
    devops: ['Docker', 'Jenkins'],
    versionControl: ['GitHub', 'GitLab'],
    backend: ['Node.js', 'Python', 'Java (Spring Boot)'],
    database: ['MySQL', 'MongoDB', 'PostgreSQL'],
    cloud: ['AWS', 'Azure', 'Google Cloud'],
  }

  const [skills, setSkills] = useState(initialSkills)
  const [newSkillValues, setNewSkillValues] = useState(
    Object.fromEntries(Object.keys(initialSkills).map((key) => [key, ''])),
  )

  const [jobInfo, setJobInfo] = useState({
    title: 'Full Stack Developer',
    department: 'Engineering',
    experience: 'Mid-Senior (3–5 Years)',
    location: 'Bengaluru, India (Hybrid)',
    jobType: 'Full-time',
    overview: ['Write job overview here...'] as string[],
    deadline: '31st March 2025',
    attachment: 'JD_Template.pdf',
    qualifications: `• Experience in Microservices architecture.
• Knowledge of authentication & security best practices (OAuth, JWT).
• Exposure to AI/ML frameworks is a plus.`,
  })
  const [newOverviewItem, setNewOverviewItem] = useState('')

  const handleDeleteSkill = (
    category: SkillCategory,
    skillToDelete: string,
  ) => {
    setSkills((prev) => ({
      ...prev,
      [category]: prev[category].filter((skill) => skill !== skillToDelete),
    }))
  }

  const handleAddSkill = (category: SkillCategory) => {
    const newSkill = newSkillValues[category].trim()
    if (newSkill && !skills[category].includes(newSkill)) {
      setSkills((prev) => ({
        ...prev,
        [category]: [...prev[category], newSkill],
      }))
      setNewSkillValues((prev) => ({ ...prev, [category]: '' }))
    }
  }

  const renderEditableChips = (items: string[], category: SkillCategory) => (
    <Box display="flex" flexWrap="wrap" alignItems="center" gap={1}>
      {items.map((item, index) => (
        <Chip
          key={index}
          label={item}
          onDelete={
            editMode ? () => handleDeleteSkill(category, item) : undefined
          }
          sx={{
            borderRadius: '8px',
            fontSize: '12px',
            backgroundColor: '#0284C7',
            color: 'white',
            fontFamily: 'SF Pro Display',
          }}
        />
      ))}
      {editMode && (
        <Box display="flex" gap={1} alignItems="center">
          <input
            type="text"
            value={newSkillValues[category]}
            placeholder="Add skill"
            onChange={(e) =>
              setNewSkillValues((prev) => ({
                ...prev,
                [category]: e.target.value,
              }))
            }
            style={{
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontFamily: 'SF Pro Display',
            }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleAddSkill(category)}
            sx={{
              fontSize: '10px',
              minWidth: 'auto',
              padding: '4px 8px',
              textTransform: 'none',
              color: '#0284C7',
              borderColor: '#0284C7',
            }}
          >
            Add
          </Button>
        </Box>
      )}
    </Box>
  )

  const sectionTitle = (title: string) => (
    <Typography
      sx={{
        fontSize: '16px',
        fontWeight: 'bold',
        paddingTop: '20px',
        fontFamily: 'SF Pro Display',
      }}
    >
      {title}
    </Typography>
  )

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: '600',
              fontFamily: 'SF Pro Display',
            }}
          >
            Preview JD to proceed
          </Typography>
          <Typography
            sx={{
              fontSize: '10px',
              fontWeight: '400',
              color: 'gray',
              fontFamily: 'SF Pro Display',
            }}
          >
            Check all the data provided is correct and modify to post
          </Typography>
        </Box>
        <IconButton
          onClick={() => setEditMode(!editMode)}
          sx={{
            border: '1px solid #ccc',
            borderRadius: '50%',
            width: 40,
            height: 40,
            backgroundColor: '#f9f9f9',
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#eee',
            },
            padding: 0,
          }}
        >
          <EditNoteIcon sx={{ color: '#333', fontSize: 20 }} />
        </IconButton>
      </Box>

      {sectionTitle('Job Description – Full Stack Developer')}
      <Paper sx={{ p: 2, mt: 2, border: '1px solid #e0e0e0' }}>
        <Box display="flex" flexDirection="column" gap={1}>
          {[
            { label: 'Job Title', icon: <WorkIcon />, key: 'title' },
            { label: 'Department', icon: <BusinessIcon />, key: 'department' },
            {
              label: 'Experience Level',
              icon: <AccessTimeIcon />,
              key: 'experience',
            },
            { label: 'Location', icon: <LocationOnIcon />, key: 'location' },
            { label: 'Job Type', icon: <ConstructionIcon />, key: 'jobType' },
          ].map(({ label, icon, key }) => (
            <Typography
              key={key}
              sx={{ fontFamily: 'SF Pro Display', fontSize: '14px' }}
            >
              {icon}{' '}
              {editMode ? (
                <TextField
                  variant="standard"
                  value={jobInfo[key as keyof typeof jobInfo]}
                  onChange={(e) =>
                    setJobInfo((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  sx={{ ml: 1 }}
                />
              ) : (
                `${label}: ${jobInfo[key as keyof typeof jobInfo]}`
              )}
            </Typography>
          ))}
        </Box>
      </Paper>

      {sectionTitle('Job Overview')}
      <Paper sx={{ p: 2, mt: 2, border: '1px solid #e0e0e0' }}>
        {editMode ? (
          <Box>
            <Box display="flex" gap={2} mb={2}>
              <Button
                variant={
                  jobOverviewFormat === 'bullet' ? 'contained' : 'outlined'
                }
                onClick={() => setJobOverviewFormat('bullet')}
                sx={{
                  backgroundColor:
                    jobOverviewFormat === 'bullet' ? '#0284C7' : 'transparent',
                  color: jobOverviewFormat === 'bullet' ? '#fff' : '#0284C7',
                  borderColor: '#0284C7',
                  '&:hover': {
                    backgroundColor:
                      jobOverviewFormat === 'bullet' ? '#005A9E' : '#E0F2FE',
                  },
                }}
              >
                Bullets
              </Button>
              <Button
                variant={
                  jobOverviewFormat === 'step' ? 'contained' : 'outlined'
                }
                onClick={() => setJobOverviewFormat('step')}
                sx={{
                  backgroundColor:
                    jobOverviewFormat === 'step' ? '#0284C7' : 'transparent',
                  color: jobOverviewFormat === 'step' ? '#fff' : '#0284C7',
                  borderColor: '#0284C7',
                  '&:hover': {
                    backgroundColor:
                      jobOverviewFormat === 'step' ? '#005A9E' : '#E0F2FE',
                  },
                }}
              >
                Steps
              </Button>
              <Button
                variant={
                  jobOverviewFormat === 'paragraph' ? 'contained' : 'outlined'
                }
                onClick={() => setJobOverviewFormat('paragraph')}
                sx={{
                  backgroundColor:
                    jobOverviewFormat === 'paragraph'
                      ? '#0284C7'
                      : 'transparent',
                  color: jobOverviewFormat === 'paragraph' ? '#fff' : '#0284C7',
                  borderColor: '#0284C7',
                  '&:hover': {
                    backgroundColor:
                      jobOverviewFormat === 'paragraph' ? '#005A9E' : '#E0F2FE',
                  },
                }}
              >
                Paragraph
              </Button>
            </Box>

            <TextField
              multiline
              fullWidth
              rows={6}
              value={jobOverviewText}
              placeholder="Write job overview here..."
              onChange={(e) => setJobOverviewText(e.target.value)}
            />

            <Box mt={2}>
              <Button
                variant="contained"
                onClick={() => {
                  const lines = jobOverviewText
                    .split('\n')
                    .map((line) => line.trim())
                    .filter((line) => line !== '')
                  setJobInfo((prev) => ({
                    ...prev,
                    overview:
                      jobOverviewFormat === 'paragraph'
                        ? [jobOverviewText.trim()]
                        : lines,
                  }))
                }}
                sx={{
                  backgroundColor: '#0284C7',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#005A9E',
                  },
                }}
              >
                Save Overview
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            {jobOverviewFormat === 'paragraph' ? (
              <Typography
                sx={{ fontSize: '14px', fontFamily: 'SF Pro Display' }}
              >
                {jobInfo.overview[0]}
              </Typography>
            ) : (
              <ul style={{ paddingLeft: '20px', fontFamily: 'SF Pro Display' }}>
                {jobInfo.overview.map((item, idx) => (
                  <li
                    key={idx}
                    style={{ fontSize: '12px', marginBottom: '4px' }}
                  >
                    {jobOverviewFormat === 'step'
                      ? `Step ${idx + 1}: ${item}`
                      : item}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </Paper>

      {sectionTitle('Required Skills & Technologies')}
      <Paper sx={{ p: 2, mt: 2, border: '1px solid #e0e0e0' }}>
        <Grid container spacing={2}>
          {Object.keys(skills).map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category}>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  fontFamily: 'SF Pro Display',
                  fontSize: '14px',
                }}
              >
                {category[0].toUpperCase() +
                  category.slice(1).replace(/([A-Z])/g, ' $1')}
                :
              </Typography>
              {renderEditableChips(
                skills[category as SkillCategory],
                category as SkillCategory,
              )}
            </Grid>
          ))}
        </Grid>
      </Paper>

      {sectionTitle('Other Information')}
      <Paper sx={{ p: 2, mt: 2, border: '1px solid #e0e0e0' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography
              sx={{
                fontWeight: 'bold',
                mb: 1,
                fontFamily: 'SF Pro Display',
                fontSize: '14px',
              }}
            >
              🎯 Preferred Qualifications:
            </Typography>
            {editMode ? (
              <TextField
                multiline
                fullWidth
                rows={4}
                value={jobInfo.qualifications}
                onChange={(e) =>
                  setJobInfo({ ...jobInfo, qualifications: e.target.value })
                }
                sx={{ fontSize: '12px' }}
              />
            ) : (
              <ul
                style={{
                  marginTop: 0,
                  fontFamily: 'SF Pro Display',
                  fontSize: '12px',
                  paddingLeft: '20px',
                }}
              >
                {jobInfo.qualifications.split('\n').map((line, idx) => (
                  <li key={idx}>{line.replace(/^•\s*/, '')}</li>
                ))}
              </ul>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ fontWeight: 'bold' }}>
              📅 Application Deadline:
            </Typography>
            {editMode ? (
              <TextField
                variant="standard"
                value={jobInfo.deadline}
                onChange={(e) =>
                  setJobInfo({ ...jobInfo, deadline: e.target.value })
                }
              />
            ) : (
              <Typography sx={{ fontSize: '12px' }}>
                {jobInfo.deadline}
              </Typography>
            )}

            <Typography sx={{ fontWeight: 'bold', mt: 1 }}>
              📂 Attachments:
            </Typography>
            {editMode ? (
              <TextField
                variant="standard"
                value={jobInfo.attachment}
                onChange={(e) =>
                  setJobInfo({ ...jobInfo, attachment: e.target.value })
                }
              />
            ) : (
              <Typography sx={{ fontSize: '12px' }}>
                {jobInfo.attachment}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Box mt={3} display="flex" justifyContent="center" gap={2}>
        <Button
          sx={{
            border: '1px solid #1976d2',
            color: '#1976d2',
            textTransform: 'none',
            padding: '10px 10px',
            height: '40px',
            width: '180px',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={editMode ? () => setEditMode(false) : handleOpen}
          sx={{
            backgroundColor: '#0284C7',
            color: '#fff',
            '&:hover': { backgroundColor: '#115293' },
            textTransform: 'none',
            height: '40px',
            width: '180px',
          }}
        >
          {editMode ? 'Save Changes' : 'Create JD'}
        </Button>
      </Box>

      {/* Modal */}
      <Modal keepMounted open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{
              mb: 3,
              fontSize: '18px',
              fontWeight: 500,
              color: '#1976d2',
            }}
          >
            Do you want to enhance the job description using AI
          </Typography>
          <img
            src="assets/static/images/Union.png"
            alt="Decorative icon"
            style={{ height: '100px', marginBottom: '24px' }}
          />
          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ height: '40px', width: '180px' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                height: '40px',
                width: '180px',
                backgroundColor: '#0284C7',
                '&:hover': { backgroundColor: '#005fa3' },
              }}
            >
              Enhance JD
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default JDPreview
