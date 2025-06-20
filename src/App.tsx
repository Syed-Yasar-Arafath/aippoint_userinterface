import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import RecruitmentDashboard from './MainComponents/RecruitmentDashboard';
import { useTheme, useMediaQuery } from '@mui/material';
import SideMenuBars from './MainComponents/sideMenubar';

// Placeholder components for routes
const CVManager = () => <div>CV Manager Page</div>;
const UploadFiles = () => <div>Upload Files Page</div>;
const Review = () => <div>Review Page</div>;
const JDManager = () => <div>JD Manager Page</div>;
const CreateNewJobPost = () => <div>Create JD Page</div>;
const JobDescriptionAI = () => <div>JD Collection Page</div>;
const SearchResumes = () => <div>Search Resumes Page</div>;
const CollectionAI = () => <div>Collections Page</div>;
const AIInterviewSuite = () => <div>AI Interview Suite Page</div>;
const ScheduleInterviewAI = () => <div>Schedule Interview Page</div>;
const Upcoming = () => <div>Upcoming Interviews Page</div>;
const FeedbackScore = () => <div>Interview Status Page</div>;
const CodingAssessment = () => <div>Coding Assessment Page</div>;
const Analytics = () => <div>Analytics Page</div>;
const SettingGeneral = () => <div>Settings Page</div>;
const Support = () => <div>Support Page</div>;

const drawerWidth = 250;

const AppContent: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', width: '100%', overflow: 'hidden' }}>
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
          overflowY: 'auto',
          height: '100vh',
          bgcolor: '#f5f5f5',
          p: { xs: 2, sm: 3 },
        }}
      >
        <Routes>
          <Route path="/RecruitmentDashboard" element={<RecruitmentDashboard />} />
          <Route path="/cvmanager" element={<CVManager />} />
          <Route path="/uploadfiles" element={<UploadFiles />} />
          <Route path="/review" element={<Review />} />
          <Route path="/jdmanager" element={<JDManager />} />
          <Route path="/createnewjobpost" element={<CreateNewJobPost />} />
          <Route path="/jobdescriptionai" element={<JobDescriptionAI />} />
          <Route path="/jdccollection" element={<SearchResumes />} />
          <Route path="/collectionai" element={<CollectionAI />} />
          <Route path="/aiinterviewsuite" element={<AIInterviewSuite />} />
          <Route path="/scheduleinterview_ai" element={<ScheduleInterviewAI />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/feedbackscore" element={<FeedbackScore />} />
          <Route path="/codingassessment" element={<CodingAssessment />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settinggeneral" element={<SettingGeneral />} />
          <Route path="/support" element={<Support />} />
          <Route path="/" element={<RecruitmentDashboard />} />
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