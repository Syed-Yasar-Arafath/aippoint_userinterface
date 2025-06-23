import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const drawerWidth = 250;

const AppContent: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <SideMenuBars />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', sm: `calc(100% - ${isSmallScreen ? 200 : drawerWidth}px)` },
          marginLeft: !isSmallScreen ? `${drawerWidth}px` : 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowY: 'auto', // Disable vertical scrollbar
          height: '100vh',
          
          bgcolor: '#f5f5f5',
          p: { xs: 2, sm: 2 },
        }}
      >
        <Routes>
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
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;