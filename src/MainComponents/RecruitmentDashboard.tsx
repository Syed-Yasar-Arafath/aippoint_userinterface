import React, { useEffect, useState } from 'react'
import { ArrowUpRight, FileText, BarChart3, FolderOpen } from 'lucide-react'
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import axios from 'axios'
import Header from '../CommonComponents/topheader'
import { getUserDetails } from '../services/UserService'
interface Job {
  jobid: number
  referenceNumber: string
  job_title: string
  job_role: string
  createdBy: string
  experience_required: string
  location: string
  type: string
  job_type: string[]
  skills: string
  company_name: string | null
  modeOfWork: string
  specificDomainSkills: string
  primarySkills: string
  secondarySkills: string
  job_description: string
  created_on: string
  rolecategory: string
  newLocation: {
    country: string
    state: string
    city: string
  }
}
const RecruitmentDashboard: React.FC = () => {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('JD Overview')
  const [error, setError] = useState<string | null>(null)
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null)
  const organisation = localStorage.getItem('organisation')
  const token = localStorage.getItem('token')

  // Interface for StatCard
  interface StatCardProps {
    title: string
    value: number
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
            fontSize: '24px',
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

  const sendOrg = async (dbName: any) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get-organization-name/`,
        {
          headers: { Organization: dbName },
        },
      )
      console.log(response.data) // Log the whole response
    } catch (error: any) {
      console.error(
        'Error:',
        error.response ? error.response.data : error.message,
      )
    }
  }
  useEffect(() => {
    const fetchDiagnostic = async () => {
      try {
        // Call the Django diagnostic endpoint using an absolute URL.
        const response = await fetch(
          `${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/diagnostic/?org=${organisation}`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }
        const data = await response.json()
        // setActiveDatabase(data.active_database);
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchDiagnostic()
    sendOrg(organisation);
  }, [organisation])

  // Fetch user profile image
  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await getUserDetails(organisation);
        if (res.imageUrl) {
          setUserProfileImage(
            `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/user/read/downloadFile/${res.imageUrl}/${organisation}`,
          );
        } else {
          setUserProfileImage(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();
  }, [organisation]);

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
            fontSize: '24px',
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
  const [loading, setLoading] = useState<boolean>(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [upcomingInterview, setUpcomingInterview] = useState<Job[]>([])
  const [aiInterview, setAiInterview] = useState<Job[]>([])
  const [codingAssessment, setCodingAssessment] = useState<Job[]>([])

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`http://localhost:8082/user/read/${organisation}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log('API response:', response.data)

        // ✅ set jobs from job_description field
        if (Array.isArray(response.data.job_description)) {
          setJobs(response.data.job_description)
          setUpcomingInterview(response.data.job_description)
          setAiInterview(response.data.job_description)
          setCodingAssessment(response.data.job_description)
        } else {
          console.error('Unexpected response format:', response.data)
          setError('Unexpected response format from server.')
        }
      } catch (err) {
        console.error('Error fetching jobs:', err)
        setError('Failed to fetch job data.')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Render table based on active tab
  const renderTable = () => {
    switch (activeTab) {
      case 'JD Overview':
        return (
          // <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          //   <thead>
          //     <tr style={{ backgroundColor: '#0284C7', color: 'white' }}>
          //       <th
          //         style={{
          //           textAlign: 'left',
          //           padding: '12px',
          //           borderTopLeftRadius: '8px',
          //         }}
          //       >
          //         <div style={{ display: 'flex', alignItems: 'center' }}>
          //           JD Title
          //           <span>
          //             <KeyboardArrowDownSharpIcon
          //               style={{
          //                 marginLeft: '4px',
          //                 width: '16px',
          //                 height: '16px',
          //               }}
          //             />
          //           </span>
          //         </div>
          //       </th>
          //       <th style={{ textAlign: 'left', padding: '12px' }}>
          //         Open Positions
          //       </th>
          //       <th style={{ textAlign: 'left', padding: '12px' }}>
          //         Resumes Available
          //       </th>
          //       <th
          //         style={{
          //           textAlign: 'left',
          //           padding: '12px',
          //           borderTopRightRadius: '8px',
          //         }}
          //       >
          //         AI Interviews Completed
          //       </th>
          //     </tr>
          //   </thead>
          //   <tbody>
          //     {jdOverviewData.map((row, index) => (
          //       <tr
          //         key={index}
          //         style={{
          //           backgroundColor: 'white',
          //           borderBottom: '1px solid #e5e7eb',
          //         }}
          //       >
          //         <td style={{ padding: '12px' }}>{row.jdTitle}</td>
          //         <td style={{ padding: '12px' }}>{row.openPositions}</td>
          //         <td style={{ padding: '12px' }}>{row.resumesAvailable}</td>
          //         <td style={{ padding: '12px' }}>
          //           {row.aiInterviewsCompleted}
          //         </td>
          //       </tr>
          //     ))}
          //   </tbody>
          // </table>
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
              {jobs.map((job, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <td style={{ padding: '12px' }}>{job.job_title}</td>
                  <td style={{ padding: '12px' }}>{job.job_type?.length || 0}</td>
                  <td style={{ padding: '12px' }}>{job.skills?.split(',').length || 0}</td>
                  <td style={{ padding: '12px' }}>{Math.floor(Math.random() * 10)}</td>
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
              {upcomingInterview.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <td style={{ padding: '12px' }}>n/a</td>
                  <td style={{ padding: '12px' }}>{row.job_title}</td>
                  {/* <td style={{ padding: '12px' }}>{row.date}</td> */}
                  {/* <td style={{ padding: '12px' }}>{row.time}</td> */}
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        // color:
                        //   row.status === 'Scheduled'
                        //     ? '#2563eb'
                        //     : row.status === 'Cancelled'
                        //     ? '#FF3B30'
                        //     : '#22c55e',
                        // backgroundColor:
                        //   row.status === 'Scheduled'
                        //     ? '#dbeafe'
                        //     : row.status === 'Cancelled'
                        //     ? '#fee2e2'
                        //     : '#dcfce7',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    >
                      {/* {row.status} */}
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
              {aiInterview.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <td style={{ padding: '12px' }}>n/a</td>
                  <td style={{ padding: '12px' }}>{row.job_title}</td>
                  {/* <td style={{ padding: '12px' }}>{row.date}</td> */}
                  {/* <td style={{ padding: '12px' }}>{row.time}</td> */}
                  {/* <td style={{ padding: '12px' }}>{row.aiScore}</td> */}
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        // color:
                        //   row.status === 'Completed'
                        //     ? '#2563eb'
                        //     : row.status === 'Cancelled'
                        //     ? '#FF3B30'
                        //     : '#22c55e',
                        // backgroundColor:
                        //   row.status === 'Completed'
                        //     ? '#dbeafe'
                        //     : row.status === 'Cancelled'
                        //     ? '#fee2e2'
                        //     : '#dcfce7',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    >
                      {/* {row.status} */}
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
              {codingAssessment.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <td style={{ padding: '12px' }}>n/a</td>
                  <td style={{ padding: '12px' }}>{row.job_title}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        // color:
                        //   row.assessmentStatus === 'Completed'
                        //     ? '#2563eb'
                        //     : row.assessmentStatus === 'Cancelled'
                        //     ? '#FF3B30'
                        //     : '#22c55e',
                        // backgroundColor:
                        //   row.assessmentStatus === 'Completed'
                        //     ? '#dbeafe'
                        //     : row.assessmentStatus === 'Cancelled'
                        //     ? '#fee2e2'
                        //     : '#dcfce7',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    >
                      {/* {row.assessmentStatus} */}
                    </span>
                  </td>
                  {/* <td style={{ padding: '12px' }}>{row.aiScore}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )

      default:
        return null
    }
  }
  const [totaljdCount, setTotaljdcount] = useState(0)
  const [totalresumeavailableCount, setTotalresumeavailablecount] = useState(0)
  const [totalaiinterviewcompletedCount, setTotalaiinterviewcompletedcount] = useState(0)
  const [totalcodingassessmentcompletedCount, setTotalcodingassessmentcompletedcount] = useState(0)
  // const[userId,setUserId]=useState(0)
  const getUserData = async (userId: any) => {
    try {
      const res = await axios.get(`http://localhost:8082/user/jdcount/${organisation}/${userId}`)
      if (res.status === 200) {
        setTotaljdcount(res.data.totalJDs)

      }
    } catch (err: any) {
      console.log('error', err)
    }
  }
   const getAvailableresumes = async (user_id:any) => {
    try {
      const data={
        created_by:user_id
      }
      const res = await axios.post('http://localhost:8000/count_resumes_by_user/',{
        data
      },
       {
        headers: {
          Organization: organisation,
          'Content-Type': 'application/json'
        }
      }
     )
      if (res.status === 200) {
        setTotalresumeavailablecount(res.data.totalresumes)
      }
    } catch (error: any) {
      console.log('error', error)
    }
  }
   const getTotalaiinterview = async (user_id:any) => {
    try {
      const data={
        created_by:user_id
      }
      const res = await axios.post('http://localhost:8000/count_resumes_by_user/',{
        data
      },
       {
        headers: {
          Organization: organisation,
          'Content-Type': 'application/json'
        }
      }
     )
      if (res.status === 200) {
        setTotalaiinterviewcompletedcount(res.data.totalresumes)
      }
    } catch (error: any) {
      console.log('error', error)
    }
  }
   const getTotalcodinginterview = async (user_id:any) => {
    try {
      const data={
        created_by:user_id
      }
      const res = await axios.post('http://localhost:8000/count_resumes_by_user/',{
        data
      },
       {
        headers: {
          Organization: organisation,
          'Content-Type': 'application/json'
        }
      }
     )
      if (res.status === 200) {
        setTotalcodingassessmentcompletedcount(res.data.totalresumes)
      }
    } catch (error: any) {
      console.log('error', error)
    }
  }
  const email = localStorage.getItem('email')
  const getUserId = async () => {
    try {
      const res = await axios.get(`http://localhost:8082/user/getuserid/${organisation}/${email}`)
      if (res.status === 200) {
        console.log(res.data.user_id)
        const temp = res.data.user_id
        getUserData(temp)
        getAvailableresumes(temp)
        getTotalaiinterview(temp)
        getTotalcodinginterview(temp)
        // if (Array.isArray(allresume)) {
        //   const matchedResumes = allresume.filter(
        //     (resume: any) => {
        //       resume.resume_data?.created_by === temp
        //     }
        //   );

        //   setTotalresumeavailablecount(matchedResumes.length);

        // // 2. Count of completed coding interviews
        // const codingCompleted = matchedResumes.filter(
        //   (resume: any) =>
        //     resume.interview_type === 'coding' &&
        //     resume.interview_status === 'completed'
        // ).length;

        // // 3. Count of completed AI interviews
        // const aiCompleted = matchedResumes.filter(
        //   (resume: any) =>
        //     resume.interview_type === 'AI' &&
        //     resume.interview_status === 'completed'
        // ).length;
        // setTotalaiinterviewcompletedcount(aiCompleted)
        // setTotalcodingassessmentcompletedcount(codingCompleted)
        // } else {
        //   setTotalresumeavailablecount(0);
        // }
      }
    } catch (error: any) {
      console.log('error', error)
    }
  }
  const getAiinterviewCount = async (userId: any) => {
    try {
      const res = await axios.get(`http://localhost:8082/user/jdcount/${organisation}/${userId}`)
      if (res.status === 200) {
        setTotalaiinterviewcompletedcount(res.data.totalJDs)
      }
    } catch (err: any) {
      console.log('error', err)
    }
  }
  const getCodingassessmentCount = async (userId: any) => {
    try {
      const res = await axios.get(`http://localhost:8082/user/jdcount/${organisation}/${userId}`)
      if (res.status === 200) {
        setTotalcodingassessmentcompletedcount(res.data.totalJDs)
      }
    } catch (err: any) {
      console.log('error', err)
    }
  }
  const [allresume, getAllresume] = useState([])
 
  useEffect(() => {
    getUserId()
  }, [])

  return (
    <div
      style={{
        backgroundColor: '#f9fafb',
        padding: '24px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Header */}
      <Header
        title="Dashboard"
        userProfileImage={userProfileImage}
        path="/RecruitmentDashboard"
      />

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
          value={totaljdCount}
          change="5"
          isPositive={true}
          changeText="Increased from last login"
        />
        <StatCard
          title="Resumes Available"
          value={totalresumeavailableCount}
          change="250"
          isPositive={true}
          changeText="Increased from last login"
        />
        <StatCard
          title="Interviews Completed"
          value={totalaiinterviewcompletedCount}
          change="22"
          isPositive={false}
          changeText="Pending from last login"
        />
        <StatCard
          title="Coding Assessment"
          value={totalcodingassessmentcompletedCount}
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
