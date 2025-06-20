import { Button, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'

const InterviewScheduler: React.FC = () => {
  const [aiAvatar, setAiAvatar] = useState(true)
  const [voiceTone, setVoiceTone] = useState('')
  const [accent, setAccent] = useState('')
  const [questionFormat, setQuestionFormat] = useState('')
  const [numQuestions, setNumQuestions] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [codingExercise, setCodingExercise] = useState('')
  const [programmingLanguage, setProgrammingLanguage] = useState('')

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: SelectChangeEvent<string>) => {
      setter(event.target.value)
    }

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '16px',
        maxWidth: '1300px',
        margin: '20px auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        fontFamily: 'SF Pro Display',
      }}
    >
      {/* AI Avatar Toggle */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'SF Pro Display',
        }}
      >
        <label
          style={{
            fontSize: '14px',
            marginBottom: '6px',
            fontWeight: 500,
            fontFamily: 'SF Pro Display',
          }}
        >
          AI Avatar
        </label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontFamily: 'SF Pro Display',
            height: '50px',
          }}
          onClick={() => setAiAvatar(!aiAvatar)}
        >
          <span style={{ fontFamily: 'SF Pro Display' }}>AI Avatar</span>
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              width: '36px',
              height: '20px',
              fontFamily: 'SF Pro Display',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: aiAvatar ? '#0284C7' : '#ccc',
                borderRadius: '20px',
                transition: 'background-color 0.3s',
                fontFamily: 'SF Pro Display',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  top: '2px',
                  left: aiAvatar ? '18px' : '2px',
                  transition: 'left 0.3s',
                  fontFamily: 'SF Pro Display',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Tone */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'SF Pro Display',
        }}
      >
        <label
          style={{
            fontSize: '14px',
            marginBottom: '6px',
            fontWeight: 500,
            fontFamily: 'SF Pro Display',
          }}
        >
          Select Voice Tone
        </label>
        <Select
          value={voiceTone}
          onChange={handleChange(setVoiceTone)}
          displayEmpty
          style={{
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'SF Pro Display',
            height: '50px',
          }}
          sx={{
            '.MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
            '& .MuiSelect-select': { padding: '10px 12px', color: '#757575' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root:hover': {
                  backgroundColor: '#0284C7',
                  color: '#fff',
                },
              },
            },
          }}
        >
          <MenuItem disabled value="">
            Select Voice Tone
          </MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
        </Select>
      </div>

      {/* Accent */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'SF Pro Display',
        }}
      >
        <label
          style={{
            fontSize: '14px',
            marginBottom: '6px',
            fontWeight: 500,
            fontFamily: 'SF Pro Display',
          }}
        >
          Select Accent
        </label>
        <Select
          value={accent}
          onChange={handleChange(setAccent)}
          displayEmpty
          style={{
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'SF Pro Display',
            height: '50px',
          }}
          sx={{
            '.MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
            '& .MuiSelect-select': { padding: '10px 12px', color: '#757575' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root:hover': {
                  backgroundColor: '#0284C7',
                  color: '#fff',
                },
              },
            },
          }}
        >
          <MenuItem disabled value="">
            Select Accent
          </MenuItem>
          <MenuItem value="English (USA)">English (USA)</MenuItem>
          <MenuItem value="English (UK)">English (UK)</MenuItem>
        </Select>
      </div>

      {/* Question Format */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'SF Pro Display',
        }}
      >
        <label
          style={{
            fontSize: '14px',
            marginBottom: '6px',
            fontWeight: 500,
            fontFamily: 'SF Pro Display',
          }}
        >
          Select Question Format
        </label>
        <Select
          value={questionFormat}
          onChange={handleChange(setQuestionFormat)}
          displayEmpty
          style={{
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'SF Pro Display',
            height: '50px',
          }}
          sx={{
            '.MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
            '& .MuiSelect-select': { padding: '10px 12px', color: '#757575' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root:hover': {
                  backgroundColor: '#0284C7',
                  color: '#fff',
                },
              },
            },
          }}
        >
          <MenuItem disabled value="">
            Select Question Format
          </MenuItem>
          <MenuItem value="AI + Question Bank">AI + Question Bank</MenuItem>
          <MenuItem value="Only AI">Only AI</MenuItem>
        </Select>
      </div>

      {/* Number of Questions */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'SF Pro Display',
        }}
      >
        <label
          style={{
            fontSize: '14px',
            marginBottom: '6px',
            fontWeight: 500,
            fontFamily: 'SF Pro Display',
          }}
        >
          Select No.of Questions
        </label>
        <Select
          value={numQuestions}
          onChange={handleChange(setNumQuestions)}
          displayEmpty
          style={{
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'SF Pro Display',
            height: '50px',
          }}
          sx={{
            '.MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
            '& .MuiSelect-select': { padding: '10px 12px', color: '#757575' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root:hover': {
                  backgroundColor: '#0284C7',
                  color: '#fff',
                },
              },
            },
          }}
        >
          <MenuItem disabled value="">
            No.of Questions
          </MenuItem>
          <MenuItem value="AI (04) + Question Bank (02)">
            AI (04) + Question Bank (02)
          </MenuItem>
          <MenuItem value="AI (05) + QB (03)">AI (05) + QB (03)</MenuItem>
        </Select>
      </div>

      {/* Difficulty Level */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'SF Pro Display',
        }}
      >
        <label
          style={{
            fontSize: '14px',
            marginBottom: '6px',
            fontWeight: 500,
            fontFamily: 'SF Pro Display',
          }}
        >
          Select Question Difficulty Level
        </label>
        <Select
          value={difficulty}
          onChange={handleChange(setDifficulty)}
          displayEmpty
          style={{
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'SF Pro Display',
            height: '50px',
          }}
          sx={{
            '.MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
            '& .MuiSelect-select': { padding: '10px 12px', color: '#757575' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root:hover': {
                  backgroundColor: '#0284C7',
                  color: '#fff',
                },
              },
            },
          }}
        >
          <MenuItem disabled value="">
            Question Difficulty Level
          </MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </Select>
      </div>

      {/* Include Coding Exercise */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'SF Pro Display',
        }}
      >
        <label
          style={{
            fontSize: '14px',
            marginBottom: '6px',
            fontWeight: 500,
            fontFamily: 'SF Pro Display',
          }}
        >
          Do you want to include coding exercise?
        </label>
        <Select
          value={codingExercise}
          onChange={handleChange(setCodingExercise)}
          displayEmpty
          style={{
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'SF Pro Display',
            height: '50px',
          }}
          sx={{
            '.MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
            '& .MuiSelect-select': { padding: '10px 12px', color: '#757575' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root:hover': {
                  backgroundColor: '#0284C7',
                  color: '#fff',
                },
              },
            },
          }}
        >
          <MenuItem disabled value="">
            Yes/No
          </MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </Select>
      </div>

      {/* Programming Language */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'SF Pro Display',
        }}
      >
        <label
          style={{
            fontSize: '14px',
            marginBottom: '6px',
            fontWeight: 500,
            fontFamily: 'SF Pro Display',
          }}
        >
          Select Programming language for coding exercise?
        </label>
        <Select
          value={programmingLanguage}
          onChange={handleChange(setProgrammingLanguage)}
          displayEmpty
          style={{
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'SF Pro Display',
            height: '50px',
          }}
          sx={{
            '.MuiOutlinedInput-notchedOutline': { borderColor: '#ccc' },
            '& .MuiSelect-select': { padding: '10px 12px', color: '#757575' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root:hover': {
                  backgroundColor: '#0284C7',
                  color: '#fff',
                },
              },
            },
          }}
        >
          <MenuItem disabled value="">
            Programming language for coding exercise
          </MenuItem>
          <MenuItem value="Java Script">Java Script</MenuItem>
          <MenuItem value="Python">Python</MenuItem>
          <MenuItem value="Java">Java</MenuItem>
        </Select>
      </div>

      {/* Buttons in the same row (3rd column) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '12px',
          fontFamily: 'SF Pro Display',
          flexWrap: 'wrap',
        }}
      >
        <Button
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            border: '1px solid #000',
            cursor: 'pointer',
            fontFamily: 'SF Pro Display',
            width: '100%',
            maxWidth: '140px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            backgroundColor: '#fff',
            textTransform: 'initial',
            color: 'black',
          }}
        >
          Cancel
        </Button>

        <Button
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid transparent',
            cursor: 'pointer',
            fontFamily: 'SF Pro Display',
            width: '100%',
            maxWidth: '140px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            backgroundColor: '#0284C7',
            color: '#fff',
            textTransform: 'none',
          }}
        >
          Schedule Interview
        </Button>
      </div>
    </div>
  )
}

export default InterviewScheduler
