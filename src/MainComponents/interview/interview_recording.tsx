import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
 
interface Question {
  question: string;
  problem_statement?: string;
}
 
interface Recording {
  sessionId: string;
  videoUrl: string;
}
 
export default function InterviewRecording() {
  const { t } = useTranslation();
  const location = useLocation();
  const { id } = location.state || {};
  const [videoUrls, setVideoUrls] = useState<Recording[]>([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(-1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const smallVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const organisation = localStorage.getItem('organisation');
 
  const fetchRecordings = async (objectId: string) => {
    setIsLoading(true);
    try {
      // Fetch recordings metadata
      const response = await axios.get(
        `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/recording/meeting/${objectId}/${organisation}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
 
      if (Array.isArray(response.data)) {
        const recordings: Recording[] = [];
 
        for (const recording of response.data) {
          if (recording.outputFileName) {
            // Use the outputFileName directly as the video URL
            recordings.push({
              sessionId: recording.sessionId || `recording_${recording.id}`,
              videoUrl: recording.outputFileName,
            });
          }
        }
 
        // Sort recordings by id since sessionId is null
        const sortedRecordings = recordings.sort((a, b) => {
          const aId = parseInt(a.sessionId.split('_')[1]) || 0;
          const bId = parseInt(b.sessionId.split('_')[1]) || 0;
          return aId - bId;
        });
 
        setVideoUrls(sortedRecordings);
        if (sortedRecordings.length > 0) {
          setSelectedVideoUrl(sortedRecordings[0].videoUrl);
          setSelectedVideoIndex(0);
        } else {
          setError(t('noRecordingsAvailable', 'No recordings available for this interview'));
        }
      } else {
        console.error('Unexpected data format:', response.data);
        setError(t('invalidDataFormat', 'Invalid data format received'));
      }
    } catch (error) {
      console.error('Error fetching recordings:', error);
      setError(t('errorFetchingRecordings', 'Failed to fetch recordings'));
    } finally {
      setIsLoading(false);
    }
  };
 
  const generateQuestions = async (objectId: string) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_interview_data/`,
        { object_id: objectId },
        {
          headers: {
            'Content-Type': 'application/json',
            organization: organisation,
          },
        }
      );
      const responseData = response.data.data.questions;
      if (Array.isArray(responseData)) {
        setQuestions(responseData);
        // Initialize smallVideoRefs based on number of questions
        smallVideoRefs.current = Array(responseData.length).fill(null);
      } else {
        console.error('Invalid response format: questions array not found');
        setQuestions([]);
      }
    } catch (error: any) {
      console.error('Error fetching questions:', error);
      if (error.response) {
        console.log('Error response:', error.response.data);
      }
      setError(t('errorFetchingQuestions', 'Failed to fetch questions'));
    }
  };
 
  useEffect(() => {
    if (id) {
      fetchRecordings(id);
      generateQuestions(id);
    } else {
      setError(t('noIdProvided', 'No interview ID provided'));
    }
  }, [id, t]);
 
  useEffect(() => {
    // Cleanup object URLs to prevent memory leaks, only for blob URLs
    return () => {
      videoUrls.forEach((recording) => {
        if (recording.videoUrl.startsWith('blob:')) {
          URL.revokeObjectURL(recording.videoUrl);
        }
      });
    };
  }, [videoUrls]);
 
  const handleVideoSelect = (index: number) => {
    if (videoUrls[index]?.videoUrl) {
      setSelectedVideoUrl(videoUrls[index].videoUrl);
      setSelectedVideoIndex(index);
      if (mainVideoRef.current) {
        mainVideoRef.current.load();
        mainVideoRef.current.play();
      }
      smallVideoRefs.current.forEach((video, i) => {
        if (i !== index && video) video.pause();
      });
      if (videoContainerRef.current && smallVideoRefs.current[index]) {
        smallVideoRefs.current[index]?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
        });
      }
    }
  };
 
  const handleNextVideo = () => {
    if (selectedVideoIndex < videoUrls.length - 1) {
      handleVideoSelect(selectedVideoIndex + 1);
    }
  };
 
  const handlePreviousVideo = () => {
    if (selectedVideoIndex > 0) {
      handleVideoSelect(selectedVideoIndex - 1);
    }
  };
 
  const handleDownload = () => {
    if (selectedVideoUrl) {
      const link = document.createElement('a');
      link.href = selectedVideoUrl;
      link.download = `interview-video-${selectedVideoIndex + 1}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
 
  return (
    <Box sx={{ padding: '15px', bgcolor: '#F7F7F7', overflowY: 'auto' }}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: 'SF Pro Display',
          fontWeight: 700,
          fontSize: { xs: '18px', sm: '20px' },
          mb: 1,
          color: '#1C1C1E',
        }}
      >
        {t('interviewRecordings', 'Interview Recordings')}
      </Typography>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress size={60} sx={{ color: '#0284C7' }} />
        </Box>
      ) : error ? (
        <Typography
          variant="h6"
          sx={{
            color: '#FF3B30',
            textAlign: 'center',
            py: 2,
            fontFamily: 'SF Pro Display',
            fontSize: { xs: '16px', sm: '18px' },
          }}
        >
          {error}
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              mb: 2,
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: { xs: '12px', sm: '14px' },
                lineHeight: { xs: '18px', sm: '20px' },
                fontFamily: 'SF Pro Display',
              }}
            >
              {t('recordingInterviewMessage', 'View the interview recordings below')}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}
              disabled={!selectedVideoUrl}
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                backgroundColor: '#0284C7',
                fontSize: { xs: '12px', sm: '14px' },
                padding: { xs: '6px 12px', sm: '8px 16px' },
                fontFamily: 'SF Pro Display',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              {t('downloadVideoBtn', 'Download Video')}
            </Button>
          </Box>
          <Box sx={{ mb: 3 }}>
            {selectedVideoUrl ? (
              <video
                ref={mainVideoRef}
                width="100%"
                controls
                autoPlay
                style={{
                  borderRadius: '8px',
                  backgroundColor: '#000',
                  maxHeight: '60vh',
                  height: 'auto',
                  [theme.breakpoints.down('xs')]: { maxHeight: '200px' },
                  [theme.breakpoints.between('xs', 'sm')]: { maxHeight: '300px' },
                  [theme.breakpoints.up('md')]: { maxHeight: '400px' },
                }}
                onPlay={() => {
                  smallVideoRefs.current.forEach((video) => {
                    if (video) video.pause();
                  });
                }}
              >
                <source src={selectedVideoUrl} type="video/mp4" />
                {t('browserDoesNotSupportVideotag', 'Your browser does not support the video tag')}
              </video>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  fontSize: { xs: '12px', sm: '14px' },
                  textAlign: 'center',
                  py: 2,
                  fontFamily: 'SF Pro Display',
                }}
              >
                {t('noVideoSelected', 'No video selected')}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '16px', sm: '18px' },
                lineHeight: { xs: '22px', sm: '24px' },
                color: '#1C1C1E',
                fontFamily: 'SF Pro Display',
              }}
            >
              {t('questionWiseVideo', 'Question-wise Videos')}
            </Typography>
            <Box>
              <IconButton
                onClick={handlePreviousVideo}
                disabled={selectedVideoIndex <= 0}
                aria-label={t('previousVideo', 'Previous video')}
                sx={{
                  color: '#0284C7',
                  '&:hover': { backgroundColor: '#0284C71A' },
                  '&:disabled': { color: '#94A3B8' },
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton
                onClick={handleNextVideo}
                disabled={selectedVideoIndex >= videoUrls.length - 1}
                aria-label={t('nextVideo', 'Next video')}
                sx={{
                  color: '#0284C7',
                  '&:hover': { backgroundColor: '#0284C71A' },
                  '&:disabled': { color: '#94A3B8' },
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          </Box>
          <Box
            ref={videoContainerRef}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              overflowX: 'auto',
              gap: 2,
              pb: 2,
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#0284C7',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              },
            }}
          >
            {questions.map((q, index) =>
              videoUrls[index]?.videoUrl ? (
                <Tooltip
                  key={index}
                  title={q.question ?? q.problem_statement ?? t('noQuestionAvailable', 'No question available')}
                  placement="top"
                  arrow
                  sx={{
                    '& .MuiTooltip-tooltip': {
                      fontFamily: 'SF Pro Display',
                      fontSize: { xs: '12px', sm: '13px' },
                      maxWidth: '300px',
                      backgroundColor: '#1C1C1E',
                      padding: '8px',
                      borderRadius: '4px',
                    },
                    '& .MuiTooltip-arrow': {
                      color: '#1C1C1E',
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: { xs: '160px', sm: '200px' },
                      minWidth: { xs: '160px', sm: '200px' },
                      maxWidth: { xs: '160px', sm: '200px' },
                      height: '120px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: selectedVideoIndex === index ? '2px solid #0284C7' : '1px solid #e0e0e0',
                      cursor: 'pointer',
                      flexShrink: 0,
                      bgcolor: '#000',
                    }}
                    onClick={() => handleVideoSelect(index)}
                  >
                    <video
                      ref={(el) => (smallVideoRefs.current[index] = el)}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onPlay={() => {
                        if (mainVideoRef.current) mainVideoRef.current.pause();
                        smallVideoRefs.current.forEach((video, i) => {
                          if (i !== index && video) video.pause();
                        });
                      }}
                    >
                      <source src={videoUrls[index].videoUrl} type="video/mp4" />
                      {t('browserDoesNotSupportVideotag', 'Your browser does not support the video tag')}
                    </video>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        color: '#fff',
                        px: 1,
                        py: 0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontSize: { xs: '12px', sm: '13px' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          fontFamily: 'SF Pro Display',
                        }}
                      >
                        {q.question ?? q.problem_statement ?? t('noQuestionAvailable', 'No question available')}
                      </Typography>
                    </Box>
                  </Box>
                </Tooltip>
              ) : null
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
 
 