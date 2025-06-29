import './App.css'
import { Backdrop, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import RecruitmentDashboard from './MainComponents/RecruitmentDashboard';
import { useTheme, useMediaQuery } from '@mui/material';
import SideMenuBars from './MainComponents/sideMenubar';
import AIjdCreation from './MainComponents/aiJdCreation';
import CollectionAvailable from './MainComponents/collectionavailable';
import CollectionDefault from './MainComponents/collectiondefault';
import CollectionDefaultfilter from './MainComponents/collectiondefaultfilter';
import InterviewScheduler from './MainComponents/interviewSchedule';
import JobDescriptionForm from './MainComponents/jobDescriptionForm';
import JdCollection from './MainComponents/jdcollection';
import JDPreview from './MainComponents/jdPreview';
import JobDescriptionSelection from './MainComponents/jobdescriptionselection';
import JobDescriptionUpload from './MainComponents/jobdescriptionuploading';
import Settings from './MainComponents/settings';
import UpcomingInterview from './MainComponents/upcomingInterview';
import UploadCV from './MainComponents/uploadCV';
import ReviewCV from './MainComponents/reviewCv';
import AIJDCreator from './MainComponents/AIJDCreator';
import InterviewDetails from './MainComponents/interviewDetails';
import SignIn from './MainComponents/signIn';
import { Provider, useSelector } from 'react-redux';
import store from './redux/store';
import ScrollToTop from './MainComponents/scrollbartop';
import InterviewInstructions from './MainComponents/interview/ai_interview_ins';
import InterviewAI from './MainComponents/interview/interview_ai';
import CandidateLogIn from './MainComponents/interview/candidateLogIn';
import Snackbar from './CommonComponents/snackbar';
import SubmitInterview from './MainComponents/interview/submitinterview';
import AnalyticsReport from './MainComponents/analyticsReport';
import CandidateInterviewAnalytics from './MainComponents/candidateInterviewAnalytics';
import CandidateCodingAssessment from './MainComponents/candidateCodingAssessment';
import FileUploadInterface from './MainComponents/uploadstatus';
import ResumeList from './MainComponents/resumelist';
// import QuestionFormat from './MainComponents/question_format';

const drawerWidth = 240

const AppContent: React.FC = () => {
  const isLoading = useSelector((state: any) => state.loading.isLoading)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  let isAuthenticated: any = useSelector(
    (state: any) => state.tokenChange.inValue,
  )

  useEffect(() => {
    setOpen(isLoading)
  }, [isLoading])

  if (isAuthenticated != '') {
    isAuthenticated = 'true'
  } else {
    isAuthenticated = 'false'
  }

  // List of routes where SideMenuBar should not be displayed
  const noSideMenuRoutes = [
    '/',
    '/signin_ai',
    '/signup_ai',
    '/forgotpassword_ai',
    '/resetpassword_ai',
    '/AI-Interview',
    '/candidateLogIn'
  ]

  const showSideMenuBar = isAuthenticated === 'true' && !noSideMenuRoutes.includes(location.pathname)

  return (
    <Box
      sx={{
        width: '100%',
        fontSize: '12px',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar />
      <ScrollToTop />

      {/* Conditionally render the SideMenuBar */}
      {showSideMenuBar && <SideMenuBars />}

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: showSideMenuBar ? { sm: `calc(100% - ${drawerWidth - 16}px)` } : '100%',
          marginLeft: showSideMenuBar ? `${drawerWidth - 16}px` : 0,
          overflow: 'hidden',
        }}
      >
        <Routes>
          {/* Public routes (no authentication required) */}
          <Route path="/" element={<SignIn />} />
          <Route path="/candidateLogIn" element={<CandidateLogIn />} />
          <Route path="/ai_interview_ins/:organisation/:interviewId/:meetingId" element={<InterviewInstructions />} />
          <Route path="/interview_ai" element={<InterviewAI />} />
          <Route path="/submitinterview" element={<SubmitInterview />} />

          {/* Protected routes (authentication required) */}
          {isAuthenticated === 'true' ? (
            <>
              {/* Redirect to dashboard after login */}
              <Route path="/dashboard" element={<Navigate to="/RecruitmentDashboard" replace />} />
              <Route path="/RecruitmentDashboard" element={<RecruitmentDashboard />} />
              <Route path="/aiJdCreation" element={<AIjdCreation />} />
              <Route path="/collectionavailable" element={<CollectionAvailable />} />
              <Route path="/collectiondefault" element={<CollectionDefault />} />
              <Route path="/collectiondefaultfilter" element={<CollectionDefaultfilter />} />
              <Route path="/interviewSchedule" element={<InterviewScheduler />} />
              <Route path="/jobDescriptionForm" element={<JobDescriptionForm />} />
              <Route path="/jdcollection" element={<JdCollection />} />
              <Route path="/jdPreview" element={<JDPreview />} />
              <Route path="/jobdescriptionselection" element={<JobDescriptionSelection />} />
              <Route path="/jobdescriptionuploading" element={<JobDescriptionUpload />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/uploadCV" element={<UploadCV />} />
              <Route path="/reviewCv" element={<ReviewCV />} />
              <Route path="/interviewDetails/:id" element={<InterviewDetails />} />
              <Route path="/AIJDCreator" element={<AIJDCreator />} />
              <Route path="/UpcomingInterview" element={<UpcomingInterview />} />
              <Route path="/uploadstatus" element={<FileUploadInterface />} />
              <Route path="/resumelist" element={<ResumeList />} />
              {/* <Route path="/questionformat" element={<QuestionFormat />} /> */}

              <Route path="/analytics_report" element={<AnalyticsReport />} />
              <Route path="/candidate_interview_analytics" element={<CandidateInterviewAnalytics />} />
              <Route path="/candidate_coding_assessment" element={<CandidateCodingAssessment />} />
            </>
          ) : (
            // Redirect unauthenticated users to sign in
            <Route path="*" element={<Navigate to="/" replace />} />
          )}
        </Routes>
      </Box>
    </Box>
  )
}

const App: React.FC = () => {
  return (
    <Router>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </Router>
  )
}

export default App