import React, { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  Box,
  LinearProgress,
  Backdrop,
} from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import Header from '../CommonComponents/topheader'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next';
 

const AssessmentSelection: React.FC = () => {
  const [selected, setSelected] = useState<
    'ai-interview' | 'coding-assessment' | null
  >(null)
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width:600px)')

  const blueImages: Record<'ai-interview' | 'coding-assessment', string> = {
    'ai-interview': 'assets/static/images/blue1.png',
    'coding-assessment': 'assets/static/images/blue2.png',
  }

  const blackImages: Record<'ai-interview' | 'coding-assessment', string> = {
    'ai-interview': 'assets/static/images/black1.png',
    'coding-assessment': 'assets/static/images/black2.png',
  }

  const getImage = (card: 'ai-interview' | 'coding-assessment'): string => {
    return selected === card ? blueImages[card] : blackImages[card]
  }
const { t } = useTranslation();

  const handleContinue = () => {
    if (!selected) return
    setLoading(true)

    // Simulate loading before navigation
    setTimeout(() => {
      if (selected === 'ai-interview') {
        navigate('/questionformat')
      } else if (selected === 'coding-assessment') {
        navigate('/codingassessmentscreen')
      }
    }, 1000)
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '4px 33px 8px 38px',
      }}
    >
      {/* Loader at the top */}
      {loading && (
        <LinearProgress
          color="primary"
          sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1300 }}
        />
      )}

      {/* Optional: Block UI during loading */}
      <Backdrop open={loading} sx={{ zIndex: 1200, color: '#fff' }} />

      <Header
        title={t('selectTypeOfAssessment')}
        userProfileImage={userProfileImage}
        path="/assessmentselection"
      />

      <Typography
        sx={{
          color: '#000000',
          fontFamily: 'SF Pro Display',
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '28px',
          padding: '8px',
          paddingLeft: '18px',
        }}
      >
       {t('modifyQuestionTypeAndLevel')}
      </Typography>

      <Box
        sx={{
          width: '100%',
          maxWidth: '800px',
          height: isMobile ? 'auto' : '500px',
          borderRadius: '12px',
          boxShadow: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '10px auto',
          backgroundColor: 'white',
          p: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          {(['ai-interview', 'coding-assessment'] as const).map((card) => (
            <Box
              key={card}
              sx={{ position: 'relative', width: isMobile ? '90%' : '45%' }}
            >
              {selected === card && (
                <CheckCircle
                  sx={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    fontSize: 26,
                    color: '#0284C7',
                    p: 0.4,
                    zIndex: 2,
                  }}
                />
              )}

              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 0.8,
                  border: '2px solid',
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  width: '100%',
                  backgroundColor: 'white',
                  color: 'black',
                  borderColor: selected === card ? '#0284C7' : 'black',
                  position: 'relative',
                }}
                onClick={() => setSelected(card)}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <img
                    src={getImage(card)}
                    alt={card}
                    style={{ width: 80, height: 80 }}
                  />
                  <Typography
                    sx={{
                      mt: 0.8,
                      fontSize: 13,
                      fontWeight: 500,
                      color: selected === card ? '#0284C7' : 'black',
                    }}
                  >
                    {card === 'ai-interview'
                      ? t('aiInterview')
                      : t('codingAssessment')}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              width: 160,
              height: 36,
              borderRadius: 1.5,
              p: 0.8,
              backgroundColor: selected ? '#0284C7' : '#A0A0A0',
              color: 'white',
              textTransform: 'none',
              cursor: selected ? 'pointer' : 'not-allowed',
            }}
            disabled={!selected || loading}
            onClick={handleContinue}
          >
            {loading ? 'Loading...' : t('continueBtn')}
          </Button>
        </Box>
      </Box>
    </div>
  )
}

export default AssessmentSelection
