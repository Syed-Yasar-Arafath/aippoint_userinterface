import React, { useState, useMemo } from 'react';
import { Search, Calendar, MoreHorizontal, Eye, User, CheckCircle } from 'lucide-react';
import BookmarkIcon from '@mui/icons-material/Bookmark';
interface Candidate {
  id: string;
  name: string;
  avatar: string;
  currentPosition: string;
  experience: string;
  location: string;
  education: string;
  contact: string;
  about: string;
  keySkills: string[];
  previousInterview: string;
  profileInsights: {
    status: 'Top Candidate' | 'Looks Promising' | 'Good in Parts' | 'Follow Up Required' | 'Not Relevant';
    color: string;
  };
  jobRole: string;
  experienceLevel: string;
  dateAdded: string;
  isSelected: boolean;
}

const ReviewCV: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobRole, setSelectedJobRole] = useState('Select Job Role');
  const [selectedExperience, setSelectedExperience] = useState('Select Experience');
  const [selectedLocation, setSelectedLocation] = useState('Select Location');
  const [selectedStatus, setSelectedStatus] = useState('Select Status');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'Nirav Patel',
      avatar: 'NP',
      currentPosition: 'DevOps Engineer',
      experience: '04 Years 06 Months',
      location: 'Pune, Maharashtra',
      education: 'B.Tech - VJTI',
      contact: '91+ 8888777766',
      about: 'As a DevOps specialist, I thrive in automation and CI/CD pipelines, ensuring smooth integration and delivery. My skills include managing cloud infrastructure, where I enhance deployment processes for better efficiency. With a strong background in container orchestration using...',
      keySkills: ['Docker', 'Kubernetes', 'Jenkins', 'GitLab', 'CI/CD'],
      previousInterview: 'DevOps... +1 more',
      profileInsights: {
        status: 'Top Candidate',
        color: '#10B981'
      },
      jobRole: 'DevOps Engineer',
      experienceLevel: '3-5 years',
      dateAdded: '2024-06-15',
      isSelected: false
    },
    {
      id: '2',
      name: 'Arjun Reddy',
      avatar: 'AR',
      currentPosition: 'ML Engineer',
      experience: '02 Years 09 Months',
      location: 'Bengaluru, Karnataka',
      education: 'B.Tech AI - SRM University',
      contact: '91+ 8888777766',
      about: 'Machine learning engineer working on real-time NLP pipelines and predictive models in SaaS domain.',
      keySkills: ['Python', 'Scikit-learn', 'PyTorch', 'NLP'],
      previousInterview: '',
      profileInsights: {
        status: 'Looks Promising',
        color: '#3B82F6'
      },
      jobRole: 'ML Engineer',
      experienceLevel: '2-3 years',
      dateAdded: '2024-06-14',
      isSelected: false
    },
    {
      id: '3',
      name: 'Karthik M',
      avatar: 'KM',
      currentPosition: 'Mobile App Developer',
      experience: '04 Years',
      location: 'Chennai, Tamil Nadu',
      education: 'B.E. ECE',
      contact: '91+ 8888777766',
      about: 'Versatile mobile developer with expertise in native Android and cross-platform apps, focusing on performance and UI responsiveness.',
      keySkills: ['Kotlin', 'Flutter', 'Firebase', 'Jetpack Compose'],
      previousInterview: 'Mobile App... +1 more',
      profileInsights: {
        status: 'Good in Parts',
        color: '#F59E0B'
      },
      jobRole: 'Mobile Developer',
      experienceLevel: '3-5 years',
      dateAdded: '2024-06-13',
      isSelected: false
    },
    {
      id: '4',
      name: 'Avani Jain',
      avatar: 'AJ',
      currentPosition: 'Product Manager',
      experience: '06 Years 03 Months',
      location: 'Mumbai, Maharashtra',
      education: 'MBA - IBS Hyderabad',
      contact: '91+ 8888777766',
      about: 'Strategic product leader with experience scaling 0-1 products and leading cross-functional squads in e-commerce and SaaS.',
      keySkills: ['Agile', 'PRD Writing', 'Jira', 'Market Research'],
      previousInterview: 'Product Manager',
      profileInsights: {
        status: 'Follow Up Required',
        color: '#F97316'
      },
      jobRole: 'Product Manager',
      experienceLevel: '5+ years',
      dateAdded: '2024-06-12',
      isSelected: false
    },
    {
      id: '5',
      name: 'Riya Shah',
      avatar: 'RS',
      currentPosition: 'UI/UX Designer',
      experience: '02 Years 04 Months',
      location: 'Ahmedabad, Gujarat',
      education: 'B.Des, NID Ahmedabad',
      contact: '91+ 8888777766',
      about: 'Creative UI/UX designer with a user-centric approach and expertise in mobile-first design principles. Experience in fintech UX flows.',
      keySkills: ['Figma', 'Wireframes', 'Prototyping', 'Adobe XD'],
      previousInterview: '',
      profileInsights: {
        status: 'Not Relevant',
        color: '#EF4444'
      },
      jobRole: 'UI/UX Designer',
      experienceLevel: '2-3 years',
      dateAdded: '2024-06-11',
      isSelected: false
    }
  ]);

  const itemsPerPage = 5;

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.currentPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.keySkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesJobRole = selectedJobRole === 'Select Job Role' || candidate.jobRole === selectedJobRole;
      const matchesExperience = selectedExperience === 'Select Experience' || candidate.experienceLevel === selectedExperience;
      const matchesLocation = selectedLocation === 'Select Location' || candidate.location.includes(selectedLocation);
      const matchesStatus = selectedStatus === 'Select Status' || candidate.profileInsights.status === selectedStatus;

      return matchesSearch && matchesJobRole && matchesExperience && matchesLocation && matchesStatus;
    });
  }, [candidates, searchTerm, selectedJobRole, selectedExperience, selectedLocation, selectedStatus]);

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectCandidate = (id: string) => {
    setCandidates(prev => prev.map(candidate => 
      candidate.id === id ? { ...candidate, isSelected: !candidate.isSelected } : candidate
    ));
  };

  const handleSelectAll = () => {
    const allSelected = paginatedCandidates.every(candidate => candidate.isSelected);
    setCandidates(prev => prev.map(candidate => 
      paginatedCandidates.some(pc => pc.id === candidate.id) 
        ? { ...candidate, isSelected: !allSelected }
        : candidate
    ));
  };

  const handleAddToCollection = (candidateId: string) => {
    alert(`Added ${candidates.find(c => c.id === candidateId)?.name} to collection!`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#F8FAFC',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Search and Filters */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 40px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <Search size={16} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6B7280'
          }} />
          <button style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#0EA5E9',
            border: 'none',
            borderRadius: '4px',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Search size={14} color="white" />
          </button>
        </div>

        {/* Filters */}
        <select
          value={selectedJobRole}
          onChange={(e) => setSelectedJobRole(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option>Select Job Role</option>
          <option>DevOps Engineer</option>
          <option>ML Engineer</option>
          <option>Mobile Developer</option>
          <option>Product Manager</option>
          <option>UI/UX Designer</option>
        </select>

        <select
          value={selectedExperience}
          onChange={(e) => setSelectedExperience(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option>Select Experience</option>
          <option>0-2 years</option>
          <option>2-3 years</option>
          <option>3-5 years</option>
          <option>5+ years</option>
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option>Select Location</option>
          <option>Mumbai</option>
          <option>Bangalore</option>
          <option>Pune</option>
          <option>Chennai</option>
          <option>Hyderabad</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option>Select Status</option>
          <option>Top Candidate</option>
          <option>Looks Promising</option>
          <option>Good in Parts</option>
          <option>Follow Up Required</option>
          <option>Not Relevant</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            outline: 'none'
          }}
        />

        <button
          onClick={handleSelectAll}
          style={{
            padding: '8px 16px',
            backgroundColor: '#F3F4F6',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <input 
            type="checkbox" 
            checked={paginatedCandidates.length > 0 && paginatedCandidates.every(c => c.isSelected)}
            onChange={handleSelectAll}
            style={{ margin: 0 }}
          />
          Select
        </button>
      </div>

      {/* Candidates List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {paginatedCandidates.map((candidate) => (
          <div
            key={candidate.id}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '40px 1fr 200px 150px 150px',
              gap: '20px',
              alignItems: 'start'
            }}
          >
            {/* Checkbox and Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={candidate.isSelected}
                onChange={() => handleSelectCandidate(candidate.id)}
                style={{ cursor: 'pointer' }}
              />
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: candidate.avatar.length === 2 ? '#3B82F6' : '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {candidate.avatar}
              </div>
            </div>

            {/* Candidate Info */}
            <div>
              <h3 style={{
                margin: '0 0 4px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1F2937'
              }}>
                {candidate.name}
              </h3>
              
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '2px' }}>
                  <strong>Current Position:</strong> {candidate.currentPosition}
                </div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '2px' }}>
                  <strong>Experience:</strong> {candidate.experience}
                </div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '2px' }}>
                  <strong>Location:</strong> {candidate.location}
                </div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '2px' }}>
                  <strong>Education:</strong> {candidate.education}
                </div>
                <div style={{ fontSize: '14px', color: '#6B7280' }}>
                  <strong>Contact:</strong> {candidate.contact}
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
                  <strong>About:</strong>
                </div>
                <p style={{
                  margin: '0',
                  fontSize: '12px',
                  color: '#4B5563',
                  lineHeight: '1.4'
                }}>
                  {candidate.about}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  View CV/Resume
                </button>
                <button
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Recruiter Insights
                </button>
              </div>
            </div>

            {/* Key Skills */}
            <div>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1F2937'
              }}>
                Key Skills
              </h4>
              <ul style={{
                margin: '0',
                padding: '0 0 0 16px',
                fontSize: '12px',
                color: '#4B5563'
              }}>
                {candidate.keySkills.map((skill, index) => (
                  <li key={index} style={{ marginBottom: '2px' }}>{skill}</li>
                ))}
              </ul>
            </div>

            {/* Previous Interview */}
            <div>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1F2937'
              }}>
                Previous Interview
              </h4>
              <div style={{
                fontSize: '12px',
                color: '#4B5563',
                marginBottom: '16px'
              }}>
                {candidate.previousInterview || 'No previous interviews'}
              </div>
              
              <button
                onClick={() => handleAddToCollection(candidate.id)}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  backgroundColor: '#0EA5E9',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Add to Collection
              </button>
            </div>

            {/* Profile Insights */}
            <div style={{ position: 'relative' }}>
              <h4 style={{
                margin: '0 0 8px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1F2937'
              }}>
                Profile Insights
              </h4>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <BookmarkIcon style={{
                  // width: '12px',
                  // height: '12px',
                  color:'green'
                  // backgroundColor: candidate.profileInsights.color
                }} />

                <span style={{
                  fontSize: '12px',
                color:'green'
                }}>
                  {candidate.profileInsights.status}
                </span>
              </div>

              <button
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <MoreHorizontal size={16} color="#6B7280" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        marginTop: '24px'
      }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            backgroundColor: currentPage === 1 ? '#F3F4F6' : '#FFFFFF',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            color: currentPage === 1 ? '#9CA3AF' : '#374151'
          }}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              padding: '8px 12px',
              backgroundColor: currentPage === page ? '#3B82F6' : '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              color: currentPage === page ? '#FFFFFF' : '#374151',
              minWidth: '40px'
            }}
          >
            {page}
          </button>
        ))}

        <span style={{ fontSize: '14px', color: '#6B7280' }}>...</span>

        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            backgroundColor: currentPage === totalPages ? '#F3F4F6' : '#FFFFFF',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            color: currentPage === totalPages ? '#9CA3AF' : '#374151'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReviewCV;