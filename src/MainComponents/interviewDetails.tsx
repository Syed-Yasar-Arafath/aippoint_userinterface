// import React, { useEffect, useState } from 'react'
// import {
//   Box,
//   Button,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   TextField,
//   IconButton,
// } from '@mui/material'
// import { Trash2, Edit2 } from 'lucide-react'
// import { useParams } from 'react-router-dom'
// import { Candidate } from './upcomingInterview'
// import axios from 'axios'

// // Interface for questions
// interface Question {
//   id: number
//   type: 'AI' | 'Question Bank'
//   text: string
//   editable?: boolean
// }


// // Interface for interview settings
// interface InterviewSettings {
//   mode: 'AI Avatar' | 'No Avatar' | 'Custom Avatar'
//   country: string
//   language: string
//   questionFormat: string
//   numberOfQuestions: string
//   difficultyLevel: string
//   voiceTone: string
// }

// const InterviewDetails: React.FC = () => {
//   const { id } = useParams<{ id: string }>()
//   // const candidate = allCandidates.find((c: any) => c.id === parseInt(id || '0'))


//   // State for interview settings
//   // const [settings, setSettings] = useState<InterviewSettings>({
//   //   mode: 'AI Avatar',
//   //   country: 'America',
//   //   language: 'English US',
//   //   questionFormat: 'AI + Question Format',
//   //   numberOfQuestions: 'AI (04) + Question Bank (02)',
//   //   difficultyLevel: 'Beginner',
//   //   voiceTone: 'Angel (Female)',
//   // })
// const [settings, setSettings] = useState<InterviewSettings | null>(null)

//   // State for questions
//   // const [questions, setQuestions] = useState<Question[]>([
//   //   {
//   //     id: 1,
//   //     type: 'AI',
//   //     text: 'Can you explain the SOLID principles in object-oriented programming and provide examples?',
//   //   },
//   //   {
//   //     id: 2,
//   //     type: 'Question Bank',
//   //     text: 'What are the key differences between microservices and monolithic architecture?',
//   //   },
//   // ])
//   const [questions, setQuestions] = useState<Question[]>([])


//   // Handlers
// const handleSettingChange = (
//   field: keyof InterviewSettings,
//   value: string,
// ) => {
//   setSettings((prev) => {
//     if (!prev) return prev // or optionally: throw an error or show a warning
//     return { ...prev, [field]: value }
//   })
// }


//   const handleDeleteQuestion = (id: number) => {
//     setQuestions((prev) => prev.filter((q) => q.id !== id))
//   }

//   const handleEditQuestion = (id: number) => {
//     setQuestions((prev) =>
//       prev.map((q) => (q.id === id ? { ...q, editable: !q.editable } : q)),
//     )
//   }

//   const handleQuestionTextChange = (id: number, text: string) => {
//     setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, text } : q)))
//   }

//   const handleSaveChanges = () => {
//     console.log('Saving changes:', { settings, questions })
//     // In a real app, send to backend API
//   }

//   // if (!candidate) {
//   //   return <Typography variant="h6">Candidate not found</Typography>
//   // }
//  const [candidate, setCandidate] :any= useState(null)
//   const organisation = localStorage.getItem('organisation')

//   useEffect(() => {
//   const fetchCandidateDetails = async () => {
//     try {
//       const res = await axios.post(
//         'http://localhost:8000/get_interview_data/',
//         { object_id: id },
//         {
//           headers: {
//             Organization: organisation,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (res.status === 200 && res.data && res.data.data) {
//         const data = res.data.data;

//         // Interview Settings (not available in this response, but placeholder)
//         // setSettings(data.interview_settings || defaultInterviewSettings)

//         // Questions Mapping (You may want to map more fields if needed)
//         if (Array.isArray(data.questions)) {
//           const mappedQuestions = data.questions.map((q:any, index:any) => ({
//             id: index + 1,
//             type: 'AI',
//             text: q.question,
//             editable: false,
//           }));
//           setQuestions(mappedQuestions);
//         }

//         // Resume Data → Candidate Object
//         if (data.resume_data) {
//           const resume = data.resume_data;

//           const candidateObj = {
//             id: 1,
//             name: resume.name ?? 'Unknown',
//             uploaded_at: data.uploaded_at || 'N/A',
//             timeSlot: '10:00AM - 10:35 AM', // Hardcoded — replace if dynamic
//             position: resume.job_role ?? 'N/A',
//             email: resume.email ?? '',
//             phone: resume.phone ?? '',
//             experience: resume.experience_in_number
//               ? `${resume.experience_in_number} years`
//               : 'N/A',
//             skills: resume.skills || [],
//             education: resume.education?.Degree ?? 'N/A',
//             currentCompany: resume.work?.[0]?.company ?? '',
//             currentRole: resume.work?.[0]?.designation_at_company ?? '',
//             created_by: resume.created_by ?? '',
//             resume_id: resume.resume_id ?? ''
//           };

//           setCandidate(candidateObj);
//         }
//       }
//     } catch (error) {
//       console.error('Failed to fetch candidate details', error);
//     }
//   };

//   fetchCandidateDetails();
// }, [id]);


import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  TextField,
  IconButton,
} from '@mui/material'
import { Trash2, Edit2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

// Interfaces
interface Question {
  id: number
  type: 'AI' | 'Question Bank'
  text: string
  editable?: boolean
}

interface InterviewSettings {
  mode: 'AI Avatar' | 'No Avatar' | 'Custom Avatar'
  country: string
  language: string
  questionFormat: string
  numberOfQuestions: string
  difficultyLevel: string
  voiceTone: string
}

const InterviewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [settings, setSettings] = useState<InterviewSettings | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [candidate, setCandidate]: any = useState(null)
  const organisation = localStorage.getItem('organisation')

  const handleSettingChange = (field: keyof InterviewSettings, value: string) => {
    setSettings((prev) => {
      if (!prev) return prev
      return { ...prev, [field]: value }
    })
  }

  const handleDeleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const handleEditQuestion = (id: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, editable: !q.editable } : q)),
    )
  }

  const handleQuestionTextChange = (id: number, text: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, text } : q)))
  }

  const handleSaveChanges = () => {
    console.log('Saving changes:', { settings, questions })
    // You can call an API here to save the updated interview
  }
  const defaultSettings: InterviewSettings = {
    mode: 'AI Avatar',
    country: 'America',
    language: 'English US',
    questionFormat: 'AI + Question Format',
    numberOfQuestions: 'AI (04) + Question Bank (02)',
    difficultyLevel: 'Beginner',
    voiceTone: 'Angel (Female)',
  }

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const res = await axios.post(
          'http://localhost:8000/get_interview_data/',
          { object_id: id },
          {
            headers: {
              Organization: organisation,
              'Content-Type': 'application/json',
            },
          }
        )

        if (res.status === 202 && res.data && res.data.data) {
          const data = res.data.data

          // Set Interview Settings if available
          if (data.interview_settings) {
            setSettings({
              mode: data.interview_settings.mode ?? '',
              country: data.interview_settings.country ?? '',
              language: data.interview_settings.language ?? '',
              questionFormat: data.interview_settings.questionFormat ?? '',
              numberOfQuestions: data.interview_settings.numberOfQuestions ?? '',
              difficultyLevel: data.interview_settings.difficultyLevel ?? '',
              voiceTone: data.interview_settings.voiceTone ?? '',
            })
          } else {
            // setSettings({
            //   mode: '',
            //   country: '',
            //   language: '',
            //   questionFormat: '',
            //   numberOfQuestions: '',
            //   difficultyLevel: '',
            //   voiceTone: '',
            // })
            setSettings(defaultSettings)
          }

          // Set Questions
          if (Array.isArray(data.questions)) {
            const mappedQuestions = data.questions.map((q: any, index: number) => ({
              id: index + 1,
              type: 'AI',
              text: q.question,
              editable: false,
            }))
            setQuestions(mappedQuestions)
          }

          // Set Candidate Info
          if (data.resume_data) {
            const resume = data.resume_data

            setCandidate({
              id: 1,
              name: resume.name ?? 'Unknown',
              interview_time: data.interview_time || 'N/A',
              timeSlot: '10:00AM - 10:35 AM',
              position: resume.job_role ?? 'N/A',
              email: resume.email ?? '',
              phone: resume.phone ?? '',
              experience: resume.experience_in_number
                ? `${resume.experience_in_number} years`
                : 'N/A',
              skills: resume.skills || [],
              education: resume.education?.Degree ?? 'N/A',
              currentCompany: resume.work?.[0]?.company ?? '',
              currentRole: resume.work?.[0]?.designation_at_company ?? '',
              created_by: resume.created_by ?? '',
              resume_id: resume.resume_id ?? ''
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch candidate details', error)
      }
    }

    fetchCandidateDetails()
  }, [id])

  // if (!candidate) return <Typography>Loading candidate details...</Typography>
  return (
    <Box
      sx={{
        maxWidth: '1100px',
        margin: '0 auto',
        fontFamily: 'SF Pro Display',
        color: '#333',
        backgroundColor: '#f5f5f5',
        p: 2,
      }}
    >
      {/* Candidate Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 2,
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            {/* <img
              src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
              alt={candidate?.name||''}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            /> */}
            <Typography
              variant="h6"
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              {candidate?.name
                ? (() => {
                  const words = candidate.name.trim().split(' ').filter(Boolean)
                  if (words.length >= 2) {
                    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
                  } else if (words.length === 1) {
                    return words[0][0].toUpperCase()
                  }
                  return ''
                })()
                : ''
              }


            </Typography>

          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 0.5, fontWeight: 'bold', fontSize: '14px' }}
            >
              {candidate?.name || ''}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
              {candidate?.interview_time || ''}
              {/* {candidate?.timeSlot||''} */}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {candidate?.position || ''}
            </Typography>
            <Box
              sx={{
                display: 'inline-block',
                backgroundColor: '#FFECC5',
                padding: '5px 15px',
                borderRadius: '20px',
                mt: 1,
                fontSize: '14px',
                color: '#D99B00',
              }}
            >
              Upcoming Interview
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: '#0277BD',
            p: 2,
            borderRadius: '5px',
            color: 'white',
            width: '360px',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Current Company</Typography>
            <Typography>Total Years of Experience</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {candidate?.currentCompany || 'N/A'}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {candidate?.experience || ''}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Current Role</Typography>
            <Box />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {candidate?.currentRole || candidate?.position}
            </Typography>
            <Button
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                padding: '5px 15px',
                borderRadius: '5px',
                fontSize: '14px',
                textTransform: 'none',
              }}
            >
              View Resume
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Interview Details Section */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mt: 0 }}>
          Modify Interview Details
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ color: '#0277BD', mb: 2, fontWeight: 'normal' }}
          >
            Interview Details
          </Typography>

          {/* Interview Mode Selection */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Select Avatar Mode
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {['AI Avatar', 'No Avatar', 'Custom Avatar'].map((mode) => {
                const isSelected = (settings?.mode || '') === mode

                return (
                  <Box
                    key={mode}
                    sx={{
                      flex: 1,
                      p: 2,
                      border: isSelected ? '2px solid #0277BD' : '1px solid #ddd',
                      borderRadius: '5px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleSettingChange('mode', mode)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #0277BD' : '1px solid #aaa',
                          backgroundColor: isSelected ? '#0277BD' : 'transparent',
                          mr: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSelected && (
                          <Box
                            sx={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: 'white',
                            }}
                          />
                        )}
                      </Box>
                      <Typography>{mode}</Typography>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>


          {/* Country and Language Dropdowns */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography sx={{ display: 'block', mb: 1 }}>
                Selected Country/Region
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={settings?.country || ''}
                  onChange={(e) =>
                    handleSettingChange('country', e.target.value as string)
                  }
                  sx={{
                    p: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: 'white',
                    '.MuiSelect-select': { padding: '8px 14px' },
                  }}
                >
                  <MenuItem value="America">America</MenuItem>
                  <MenuItem value="India">India</MenuItem>
                  <MenuItem value="UK">UK</MenuItem>
                  <MenuItem value="Canada">Canada</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography sx={{ display: 'block', mb: 1 }}>
                Selected Language
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={settings?.language || ''}
                  onChange={(e) =>
                    handleSettingChange('language', e.target.value as string)
                  }
                  sx={{
                    p: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: 'white',
                    '.MuiSelect-select': { padding: '8px 14px' },
                  }}
                >
                  <MenuItem value="English US">English US</MenuItem>
                  <MenuItem value="English UK">English UK</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="Hindi">Hindi</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Question Format and Number of Questions Dropdowns */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography sx={{ display: 'block', mb: 1 }}>
                Selected Question Format
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={settings?.questionFormat || ''}
                  onChange={(e) =>
                    handleSettingChange(
                      'questionFormat',
                      e.target.value as string,
                    )
                  }
                  sx={{
                    p: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: 'white',
                    '.MuiSelect-select': { padding: '8px 14px' },
                  }}
                >
                  <MenuItem value="AI + Question Format">
                    AI + Question Format
                  </MenuItem>
                  <MenuItem value="AI Only">AI Only</MenuItem>
                  <MenuItem value="Question Bank Only">
                    Question Bank Only
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography sx={{ display: 'block', mb: 1 }}>
                Selected No. of Questions
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={settings?.numberOfQuestions || ''}
                  onChange={(e) =>
                    handleSettingChange(
                      'numberOfQuestions',
                      e.target.value as string,
                    )
                  }
                  sx={{
                    p: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: 'white',
                    '.MuiSelect-select': { padding: '8px 14px' },
                  }}
                >
                  <MenuItem value="AI (04) + Question Bank (02)">
                    AI (04) + Question Bank (02)
                  </MenuItem>
                  <MenuItem value="AI (06)">AI (06)</MenuItem>
                  <MenuItem value="Question Bank (04)">
                    Question Bank (04)
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Difficulty Level and Voice Tone Dropdowns */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography sx={{ display: 'block', mb: 1 }}>
                Selected Question Difficulty Level
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={settings?.difficultyLevel || ''}
                  onChange={(e) =>
                    handleSettingChange(
                      'difficultyLevel',
                      e.target.value as string,
                    )
                  }
                  sx={{
                    p: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: 'white',
                    '.MuiSelect-select': { padding: '8px 14px' },
                  }}
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography sx={{ display: 'block', mb: 1 }}>
                Selected Voice Tone
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={settings?.voiceTone || ''}
                  onChange={(e) =>
                    handleSettingChange('voiceTone', e.target.value as string)
                  }
                  sx={{
                    p: '12px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: 'white',
                    '.MuiSelect-select': { padding: '8px 14px' },
                  }}
                >
                  <MenuItem value="Angel (Female)">Angel (Female)</MenuItem>
                  <MenuItem value="James (Male)">James (Male)</MenuItem>
                  <MenuItem value="Neutral">Neutral</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        {/* Question Settings Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{ color: '#0277BD', mb: 2, fontWeight: 'normal' }}
          >
            Question Settings
          </Typography>

          {questions.map((question) => (
            <Box
              key={question.id}
              sx={{
                p: 2,
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: 'white',
                mb: 2,
              }}
            >
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Box
                    sx={{
                      backgroundColor: '#e6f7ff',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <Typography sx={{ color: '#0277BD' }}>🗣️</Typography>
                  </Box>
                  {question.editable ? (
                    <TextField
                      value={question.text}
                      onChange={(e) =>
                        handleQuestionTextChange(question.id, e.target.value)
                      }
                      fullWidth
                      multiline
                      rows={2}
                      sx={{ mr: 2 }}
                    />
                  ) : (
                    <Typography sx={{ color: '#0277BD', fontWeight: 'bold' }}>
                      Q{question.id} ({question.type}): {question.text}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={() => handleDeleteQuestion(question.id)}>
                    <Trash2 size={20} color="#ff6b6b" />
                  </IconButton>
                </Box>
              </Box>
              {question.id === 1 && (
                <></>
                // <Box
                //   sx={{
                //     display: 'flex',
                //     alignItems: 'center',
                //     borderTop: '1px solid #eee',
                //     pt: 2,
                //     color: '#666',
                //   }}
                // >
                //   <IconButton onClick={() => handleEditQuestion(question.id)}>
                //     <Edit2
                //       size={20}
                //       color={question.editable ? '#0277BD' : '#666'}
                //     />
                //   </IconButton>
                //   <Typography>
                //     Feel free to edit the question if it is needed in 1-2
                //     sentences to further tailor the question (optional)
                //   </Typography>
                // </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* Save Changes Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            disabled
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default InterviewDetails
