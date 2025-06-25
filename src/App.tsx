

import './App.css'
import { Backdrop, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

const drawerWidth = 240
const AppContent: React.FC = () => {
  // const isAuthenticated = 'true'
  // const isAuthenticated = 1

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
  const showSideMenuBar =
    isAuthenticated && !noSideMenuRoutes.includes(location.pathname)
  const [validToken, setValidToken] = useState(false)
 

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
      <Routes>
          <Route path="/" element={<SignIn />} />
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
            <Route path="/interview_ai" element={<InterviewAI />} />
            <Route path="/reviewCv" element={<ReviewCV />} />
            <Route path="/interviewDetails/:id" element={<InterviewDetails />} />
             <Route path="/AIJDCreator" element={<AIJDCreator />} />
           <Route path="/ai_interview_ins/:organisation/:interviewId/:meetingId" element={<InterviewInstructions />} />
          <Route path="/UpcomingInterview" element={<UpcomingInterview />} />
            <Route path="/candidateLogIn" element={<CandidateLogIn />} /> {/* ✅ Add this */}


        </Routes>
      {/* Conditionally render the SideMenuBar */}
      {isAuthenticated === 'true' &&
        !noSideMenuRoutes.includes(location.pathname) && <SideMenuBars />}
      {isAuthenticated === 'true' &&
        !noSideMenuRoutes.includes(location.pathname) && (
          <Box
          
            component="main"
            sx={{
              flexGrow: 1,
              p: 0, // Reduced padding from 2 to 1.5 for a smaller internal gap
              width: { sm: `calc(100% - ${drawerWidth - 16}px)` }, // Reduced the drawerWidth by 16px to narrow the gap
              marginLeft: showSideMenuBar ? `${drawerWidth - 16}px` : 0,
              overflow: 'hidden',
            }}
          >
            <Routes>
             
            </Routes>
          </Box>
        )}
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
