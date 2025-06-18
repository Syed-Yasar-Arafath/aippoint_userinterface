import React, { useState } from 'react'
import { ArrowUpRight, FileText, BarChart3, FolderOpen } from 'lucide-react'
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
const RecruitmentDashboard: React.FC = () => {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('JD Overview')

  // Interface for StatCard
  interface StatCardProps {
    title: string
    value: string
    change: string
    isPositive: boolean
    changeText: string
  }

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    isPositive,
    changeText,
  }) => {
    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: '7px 17px 24px 13px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <h3
            style={{
              fontFamily: 'SF Pro Display',
              fontWeight: 400,
              fontSize: '12px',
              letterSpacing: '0%',
              color: '#1C1C1C',
              marginTop: '10px',
            }}
          >
            {title}
          </h3>
          <div
            style={{
              backgroundColor: '#f3f4f6',
              borderRadius: '100px',
              width: '35px',
              height: '35px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowUpRight
              style={{ width: '16px', height: '16px', color: '#1C1C1C' }}
            />
          </div>
        </div>
        <p
          style={{
            fontFamily: 'SF Pro Display',
            fontWeight: 700,
            fontSize: '34px',
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#0284C7',
          }}
        >
          {value}
        </p>
        <div
          style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}
        >
          <span
            style={{
              fontFamily: 'SF Pro Display',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: isPositive ? '#0284C7' : '#FF3B30',
            }}
          >
            {change}
            {isPositive ? '▲' : '▼'}
          </span>
          <span
            style={{
              marginLeft: '4px',
              fontFamily: 'SF Pro Display',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#1C1C1C',
            }}
          >
            {changeText}
          </span>
        </div>
      </div>
    )
  }

  // Interface for Tab
  interface TabProps {
    label: string
    active: boolean
    onClick: () => void
  }

  const Tab: React.FC<TabProps> = ({ label, active, onClick }) => {
    return (
      <button
        onClick={onClick}
        style={{
          padding: '8px 16px',
          fontFamily: 'SF Pro Display',
          fontWeight: 700,
          fontSize: '12px',
          lineHeight: '100%',
          letterSpacing: '0%',
          color: active ? '#2563eb' : '#6b7280',
          backgroundColor: 'transparent',
          border: 'none',
          borderBottom: active ? '2px solid #3b82f6' : 'none',
          cursor: 'pointer',
          textDecoration: 'underline',
          textDecorationStyle: 'solid',
          textDecorationSkipInk: 'auto',
        }}
      >
        {label}
      </button>
    )
  }

  // Interface for RoleItem
  interface RoleItemProps {
    icon: string
    role: string
    count: number
  }

  const RoleItem: React.FC<RoleItemProps> = ({ icon, role, count }) => {
    return (
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
      >
        <div
          style={{
            width: '37px',
            height: '37px',
            borderRadius: '100px',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '6px',
            border: '0.5px solid #1C1C1E80',
          }}
        >
          {icon}
        </div>
        <div>
          <p
            style={{
              fontFamily: 'SF Pro Display',
              fontWeight: 400,
              fontSize: '12px',
              lineHeight: '100%',
              letterSpacing: 0,
            }}
          >
            {role}{' '}
            <span
              style={{
                color: '#3b82f6',
                fontFamily: 'SF Pro Display',
                fontWeight: 400,
                fontSize: '12px',
              }}
            >
              {count}
            </span>
            <br />
            <span
              style={{
                fontFamily: 'SF Pro Display',
                fontWeight: 400,
                fontSize: '10px',
                lineHeight: '100%',
                letterSpacing: '0',
                color: '#1C1C1E80',
              }}
            >
              Since last login
            </span>
          </p>
        </div>
      </div>
    )
  }

  // Interface for ActionCard
  interface ActionCardProps {
    icon: React.ReactNode
    title: string
    value: string
    description: string
  }

  const ActionCard: React.FC<ActionCardProps> = ({
    icon,
    title,
    value,
    description,
  }) => {
    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: '10px 17px 8px 9px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
          }}
        >
          <div
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '100px',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              padding: '5px 8px',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
          <div
            style={{
              backgroundColor: '#f3f4f6',
              borderRadius: '100px',
              width: '35px',
              height: '35px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowUpRight
              style={{ width: '16px', height: '16px', color: '#1C1C1C' }}
            />
          </div>
        </div>
        <h3
          style={{
            fontFamily: 'SF Pro Display',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#0A0A0A',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: 'SF Pro Display',
            fontWeight: 700,
            fontSize: '34px',
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#0284C7',
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontFamily: 'SF Pro Display',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#6b7280',
          }}
        >
          {description}
        </p>
      </div>
    )
  }

  // Sample data for each tab
  const jdOverviewData = Array(10).fill({
    jdTitle: 'Full-Stack Engineer',
    openPositions: '05',
    resumesAvailable: '120',
    aiInterviewsCompleted: '08',
  })

  const upcomingInterviewsData = Array(10).fill({
    candidate: 'Rahul Sharma',
    jdTitle: 'Full-Stack Developer',
    date: '15-03-2025',
    time: '10:30 AM',
    status: 'Scheduled',
  })

  const aiInterviewsData = Array(10).fill({
    candidate: 'Rahul Sharma',
    jdTitle: 'Full-Stack Developer',
    date: '15-03-2025',
    time: '10:30 AM',
    aiScore: '95%',
    status: 'Completed',
  })

  const codingAssessmentsData = Array(10).fill({
    candidate: 'Rahul Sharma',
    jdTitle: 'Full-Stack Developer',
    assessmentStatus: 'Completed',
    aiScore: '95%',
  })

  // Render table based on active tab
  const renderTable = () => {
    switch (activeTab) {
      case 'JD Overview':
        return (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0284C7', color: 'white' }}>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '12px',
                    borderTopLeftRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    JD Title
                    <span>
                      <KeyboardArrowDownSharpIcon
                        style={{
                          marginLeft: '4px',
                          width: '16px',
                          height: '16px',
                        }}
                      />
                    </span>
                  </div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px' }}>
                  Open Positions
                </th>
                <th style={{ textAlign: 'left', padding: '12px' }}>
                  Resumes Available
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '12px',
                    borderTopRightRadius: '8px',
                  }}
                >
                  AI Interviews Completed
                </th>
              </tr>
            </thead>
            <tbody>
              {jdOverviewData.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <td style={{ padding: '12px' }}>{row.jdTitle}</td>
                  <td style={{ padding: '12px' }}>{row.openPositions}</td>
                  <td style={{ padding: '12px' }}>{row.resumesAvailable}</td>
                  <td style={{ padding: '12px' }}>
                    {row.aiInterviewsCompleted}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      case 'Upcoming Interviews':
        return (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0284C7', color: 'white' }}>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '12px',
                    borderTopLeftRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    Candidate
                  </div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    JD Title
                    <span>
                      <KeyboardArrowDownSharpIcon
                        style={{
                          marginLeft: '4px',
                          width: '16px',
                          height: '16px',
                        }}
                      />
                    </span>{' '}
                  </div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    Date
                    <span>
                      <CalendarMonthIcon
                        style={{
                          marginLeft: '4px',
                          width: '16px',
                          height: '16px',
                        }}
                      />
                    </span>
                  </div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    Time
                    <span>
                      <AccessTimeIcon
                        style={{
                          marginLeft: '4px',
                          width: '16px',
                          height: '16px',
                        }}
                      />
                    </span>
                  </div>
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '12px',
                    borderTopRightRadius: '8px',
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {upcomingInterviewsData.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <td style={{ padding: '12px' }}>{row.candidate}</td>
                  <td style={{ padding: '12px' }}>{row.jdTitle}</td>
                  <td style={{ padding: '12px' }}>{row.date}</td>
                  <td style={{ padding: '12px' }}>{row.time}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        color:
                          row.status === 'Scheduled'
                            ? '#2563eb'
                            : row.status === 'Cancelled'
                            ? '#FF3B30'
                            : '#22c55e',
                        backgroundColor:
                          row.status === 'Scheduled'
                            ? '#dbeafe'
                            : row.status === 'Cancelled'
                            ? '#fee2e2'
                            : '#dcfce7',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      case 'AI Interviews':
        return (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0284C7', color: 'white' }}>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '12px',
                    borderTopLeftRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    Candidate
                  </div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    JD Title
                    <span>
                      <KeyboardArrowDownSharpIcon
                        style={{
                          marginLeft: '4px',
                          width: '16px',
                          height: '16px',
                        }}
                      />
                    </span>
                  </div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    Date
                    <span>
                      <CalendarMonthIcon
                        style={{
                          marginLeft: '4px',
                          width: '16px',
                          height: '16px',
                        }}
                      />
                    </span>
                  </div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    Time
                    <span>
                      <AccessTimeIcon
                        style={{
                          marginLeft: '4px',
                          width: '16px',
                          height: '16px',
                        }}
                      />
                    </span>
                  </div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px' }}>
                  AI Score %
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '12px',
                    borderTopRightRadius: '8px',
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {aiInterviewsData.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <td style={{ padding: '12px' }}>{row.candidate}</td>
                  <td style={{ padding: '12px' }}>{row.jdTitle}</td>
                  <td style={{ padding: '12px' }}>{row.date}</td>
                  <td style={{ padding: '12px' }}>{row.time}</td>
                  <td style={{ padding: '12px' }}>{row.aiScore}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        color:
                          row.status === 'Completed'
                            ? '#2563eb'
                            : row.status === 'Cancelled'
                            ? '#FF3B30'
                            : '#22c55e',
                        backgroundColor:
                          row.status === 'Completed'
                            ? '#dbeafe'
                            : row.status === 'Cancelled'
                            ? '#fee2e2'
                            : '#dcfce7',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      case 'Coding Assessments':
        return (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0284C7', color: 'white' }}>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '12px',
                    borderTopLeftRadius: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    Candidate
                  </div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    JD Title
                    <span>
                      <KeyboardArrowDownSharpIcon
                        style={{
                          marginLeft: '4px',
                          width: '16px',
                          height: '16px',
                        }}
                      />
                    </span>
                  </div>
                </th>
                <th style={{ textAlign: 'left', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    Assessment Status
                    <span>
                      <KeyboardArrowDownSharpIcon
                        style={{
                          marginLeft: '4px',
                          width: '16px',
                          height: '16px',
                        }}
                      />
                    </span>
                  </div>
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '12px',
                    borderTopRightRadius: '8px',
                  }}
                >
                  AI Score %
                </th>
              </tr>
            </thead>
            <tbody>
              {codingAssessmentsData.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <td style={{ padding: '12px' }}>{row.candidate}</td>
                  <td style={{ padding: '12px' }}>{row.jdTitle}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        color:
                          row.assessmentStatus === 'Completed'
                            ? '#2563eb'
                            : row.assessmentStatus === 'Cancelled'
                            ? '#FF3B30'
                            : '#22c55e',
                        backgroundColor:
                          row.assessmentStatus === 'Completed'
                            ? '#dbeafe'
                            : row.assessmentStatus === 'Cancelled'
                            ? '#fee2e2'
                            : '#dcfce7',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    >
                      {row.assessmentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{row.aiScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )

      default:
        return null
    }
  }

  return (
    <div
      style={{
        backgroundColor: '#f9fafb',
        padding: '24px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Top Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <StatCard
          title="Total Job Descriptions"
          value="200"
          change="5"
          isPositive={true}
          changeText="Increased from last login"
        />
        <StatCard
          title="Resumes Available"
          value="2500"
          change="250"
          isPositive={true}
          changeText="Increased from last login"
        />
        <StatCard
          title="Interviews Completed"
          value="150"
          change="22"
          isPositive={false}
          changeText="Pending from last login"
        />
        <StatCard
          title="Coding Assessment"
          value="75"
          change="5"
          isPositive={true}
          changeText="Increased from last login"
        />
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
          <Tab
            label="JD Overview"
            active={activeTab === 'JD Overview'}
            onClick={() => setActiveTab('JD Overview')}
          />
          <Tab
            label="Upcoming Interviews"
            active={activeTab === 'Upcoming Interviews'}
            onClick={() => setActiveTab('Upcoming Interviews')}
          />
          <Tab
            label="AI Interviews"
            active={activeTab === 'AI Interviews'}
            onClick={() => setActiveTab('AI Interviews')}
          />
          <Tab
            label="Coding Assessments"
            active={activeTab === 'Coding Assessments'}
            onClick={() => setActiveTab('Coding Assessments')}
          />
        </div>
      </div>

      {/* Table and Top Hiring Roles */}
      <div style={{ display: 'flex', height: '250px' }}>
        {/* Dynamic Table */}
        <div
          style={{
            flexGrow: 1,
            marginRight: '16px',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '5px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'auto',
          }}
        >
          {renderTable()}
        </div>

        {/* Top Hiring Roles */}
        <div
          style={{
            width: '250px',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'auto',
          }}
        >
          <h3
            style={{
              fontFamily: 'SF Pro Display',
              fontWeight: 700,
              fontSize: '12px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#1C1C1E',
              padding: '0px 0px 5px 0px',
            }}
          >
            Top Hiring Roles
          </h3>
          <RoleItem icon="👩‍💻" role="Software Engineer" count={35} />
          <RoleItem icon="📊" role="Data Scientist" count={26} />
          <RoleItem icon="🎨" role="UI/UX Designer" count={18} />
          <RoleItem icon="⚙️" role="DevOps Engineer" count={16} />
          <RoleItem icon="⚙️" role="AI/ML Engineer" count={9} />
          <RoleItem icon="🚀" role="Mechanical Engineer" count={5} />
          <RoleItem icon="💻" role="Sales & Marketing" count={3} />
        </div>
      </div>

      {/* Pending Actions */}
      <div style={{}}>
        <h3
          style={{
            fontFamily: 'SF Pro Display',
            fontWeight: 700,
            fontSize: '12px',
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#1C1C1E',
            padding: '15px 0px 5px 0px',
          }}
        >
          Pending Actions
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
        >
          <ActionCard
            icon={
              <FolderOpen
                style={{ width: '31px', height: '17px', color: '#cccccc' }}
              />
            }
            title="New Resumes Added"
            value="200"
            description="Uploaded but not yet reviewed. Ensure timely screening for quick candidate progression."
          />
          <ActionCard
            icon={
              <FileText
                style={{ width: '31px', height: '17px', color: '#cccccc' }}
              />
            }
            title="Job Descriptions Pending Approval"
            value="24"
            description="These JDs need final confirmation before they can be posted."
          />
          <ActionCard
            icon={
              <BarChart3
                style={{ width: '31px', height: '17px', color: '#cccccc' }}
              />
            }
            title="AI Analytics"
            value="65"
            description="Candidate AI interview analytics are ready for review."
          />
        </div>
      </div>
    </div>
  )
}

export default RecruitmentDashboard
