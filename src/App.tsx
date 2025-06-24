// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Box } from '@mui/material';
// import RecruitmentDashboard from './MainComponents/RecruitmentDashboard';
// import { useTheme, useMediaQuery } from '@mui/material';
// import SideMenuBars from './MainComponents/sideMenubar';
// import AIjdCreation from './MainComponents/aiJdCreation';
// import CollectionAvailable from './MainComponents/collectionavailable';
// import CollectionDefault from './MainComponents/collectiondefault';
// import CollectionDefaultfilter from './MainComponents/collectiondefaultfilter';
// import InterviewScheduler from './MainComponents/interviewSchedule';
// import JobDescriptionForm from './MainComponents/jobDescriptionForm';
// import JdCollection from './MainComponents/jdcollection';
// import JDPreview from './MainComponents/jdPreview';
// import JobDescriptionSelection from './MainComponents/jobdescriptionselection';
// import JobDescriptionUpload from './MainComponents/jobdescriptionuploading';
// import Settings from './MainComponents/settings';
// import UpcomingInterview from './MainComponents/upcomingInterview';
// import UploadCV from './MainComponents/uploadCV';
// import ReviewCV from './MainComponents/reviewCv';
// import AIJDCreator from './MainComponents/AIJDCreator';
// import InterviewDetails from './MainComponents/interviewDetails';
// import SignIn from './MainComponents/signIn';
// import { Provider } from 'react-redux';
// import store from './redux/store';

// const drawerWidth = 250;

// const AppContent: React.FC = () => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

//   return (
//     <Box sx={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
//       <SideMenuBars />
                
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           width: { xs: '100%', sm: `calc(100% - ${isSmallScreen ? 200 : drawerWidth}px)` },
//           marginLeft: !isSmallScreen ? `${drawerWidth}px` : 0,
//           transition: theme.transitions.create(['margin', 'width'], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.enteringScreen,
//           }),
//           overflowY: 'auto', // Disable vertical scrollbar
//           height: '100vh',
          
//           bgcolor: '#f5f5f5',
//           p: { xs: 2, sm: 2 },
//         }}
//       >
//         <Routes>
//           <Route path="/signin" element={<SignIn />} />
//           <Route path="/RecruitmentDashboard" element={<RecruitmentDashboard />} />
//           <Route path="/aiJdCreation" element={<AIjdCreation />} />
//           <Route path="/collectionavailable" element={<CollectionAvailable />} />
//           <Route path="/collectiondefault" element={<CollectionDefault />} />
//           <Route path="/collectiondefaultfilter" element={<CollectionDefaultfilter />} />
//           <Route path="/interviewSchedule" element={<InterviewScheduler />} />
//           <Route path="/jobDescriptionForm" element={<JobDescriptionForm />} />
//           <Route path="/jdcollection" element={<JdCollection />} />
//           <Route path="/jdPreview" element={<JDPreview />} />
//           <Route path="/jobdescriptionselection" element={<JobDescriptionSelection />} />
//           <Route path="/jobdescriptionuploading" element={<JobDescriptionUpload />} />
//           <Route path="/settings" element={<Settings />} />
//            <Route path="/uploadCV" element={<UploadCV />} />
//             <Route path="/reviewCv" element={<ReviewCV />} />
//             <Route path="/interviewDetails" element={<InterviewDetails />} />
//              <Route path="/AIJDCreator" element={<AIJDCreator />} />
//           <Route path="/UpcomingInterview" element={<UpcomingInterview />} />
//         </Routes>
//       </Box>
//     </Box>
//   );
// };

// const App: React.FC = () => {
//   return (
//     <Router>
//       <Provider store={store}>
//       <AppContent />
//       </Provider>
//     </Router>
//   );
// };

// export default App;

import './App.css'
import { Backdrop, CircularProgress, Snackbar } from '@mui/material'
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
  ]
  const showSideMenuBar =
    isAuthenticated && !noSideMenuRoutes.includes(location.pathname)
  const [validToken, setValidToken] = useState(false)
  // const navigate = useNavigate()
  // useEffect(() => {
  //   const checkToken = async () => {
  //     const token = localStorage.getItem('token')
  //     if (token) {
  //       const res: any = await isVallidToken(token)
  //       if (!res) {
  //         setValidToken(false)
  //         navigate('/')
  //       }
  //     } else {
  //       setValidToken(false)
  //       navigate('/')
  //     }
  //   }

  //   checkToken() // ✅ Run immediately on mount

  //   const interval = setInterval(checkToken, 10 * 60 * 60 * 1000) // ✅ Then run every 10 hours

  //   return () => clearInterval(interval)
  // }, [])

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
            <Route path="/reviewCv" element={<ReviewCV />} />
            <Route path="/interviewDetails" element={<InterviewDetails />} />
             <Route path="/AIJDCreator" element={<AIJDCreator />} />
          <Route path="/UpcomingInterview" element={<UpcomingInterview />} />
        </Routes>
      {/* Conditionally render the SideMenuBar */}
      {isAuthenticated === 'true' &&
        !noSideMenuRoutes.includes(location.pathname) && <SideMenuBars />}
      {isAuthenticated === 'true' &&
        !noSideMenuRoutes.includes(location.pathname) && (
          <Box
            // sx={{
            // width: '100%',
            // overflow: 'hidden',
            // paddingLeft: '140px',
            // marginTop: '-18px',
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
             {/* <Route path="/questionformat" element={<QuestionFormat />} />
              <Route path="/joininterview" element={<JoinInterview />} />
              <Route path="/search" element={<SearchCandidateRequired />} />
              <Route path="/feedback_ai" element={<Feedback_Ai />} />
              <Route path="/uploadfiles" element={<UploadFile />} />
              <Route path="/analytics" element={<AnalyticsAI />} />
              <Route path="/jdccollection" element={<JDcCollection />} />
              <Route path="/noscore/:jobId" element={<NoScore />} />
              <Route path="/resumetable/:jobId" element={<ResumeTable />} />
              <Route path="/resumelist" element={<ResumeList />} /> */}
              {/* <Route path="/createnewjobpost" element={<AiJDCreation />} /> */}
              {/* <Route path="/createnewjobpost2" element={<AIJDPreview />} /> */}

              {/* <Route
                path="/updatedaijdcreation"
                element={<UpdatedCreationJd />}
              />
              <Route
                path="/createnewjobpost"
                element={<UpdatedCreateNewJobPost />}
              />

              <Route
                path="/updatedcreatenewjobpost"
                element={<UpdatedCreateNewJobPost />}
              /> */}
              {/* <Route path="/createnewjobpost" element={<CreateNewJobPost />} /> */}

              {/* <Route path="/collectionai" element={<CollectionsAI />} />
              <Route path="/profile" element={<Profile_Ai />} />
              <Route path="/pricingplans" element={<PricingPlans />} />

              <Route
                path="/jobdescriptionai"
                element={<JobDescriptionActive />}
              />
              <Route
                path="/viewjobdescription"
                element={<JobDescription_Jd />}
              />

              <Route path="/jdcollection" element={<JdCollection />} />
              <Route path="/creationjd" element={<CreationJd />} />
              <Route path="/creationjdview" element={<CreationJdView />} />
              <Route path="/emailconfirm" element={<EmailConfirm />} />
              <Route path="/viewjdcollection" element={<Viewjdcollection />} /> */}
              {/* <Route path="/viewjdcollection" element={<Viewjdcollection />} /> */}
              {/* <Route
                path="/viewpersonalcollection"
                element={<Viewpersonalcollection />}
              />
              <Route
                path="/uploadnotification"
                element={<UploadNotification />}
              />
              <Route
                path="/settingmanageyourteam"
                element={<SettingManageyourteam />}
              />
              <Route
                path="/settingmanagenewrole"
                element={<SettingManageNewRole />}
              />
              <Route
                path="/settingmanageaddnewrole"
                element={<SettingManageAddNewRole />}
              />
              <Route
                path="/schedule"
                element={<PersonalCollectionFunction />}
              />
              <Route path="/accountnewuser" element={<NewUser />} />
              <Route path="/settinggeneral" element={<General />} />
              <Route path="/interviewdetail" element={<InterviewDetail />} />
              <Route path="/feedback_ai" element={<Feedback_Ai />} /> */}
              {/* <Route path="/coding_analytics" element={<CodingAnalytics />} /> */}
              {/* <Route path="/coding_analytics" element={<CodingAnalytics />} />

              <Route
                path="/interviewrecording"
                element={<InterviewRecording />}
              />
              <Route path="/feedbackscore" element={<Feedbackscore />} />
              <Route
                path="/candidate_analytics"
                element={<CandidateAnalytics />}
              />
              <Route
                path="/assessmentselection"
                element={<AssessmentSelection />}
              />
              <Route
                path="/codingassessmentscreen"
                element={<CodingAssessmentScreen />}
              /> */}
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
