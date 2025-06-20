import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, Paperclip, Sparkles } from 'lucide-react';

const AIJDCreator = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [keyResponsibilities, setKeyResponsibilities] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [activeTab, setActiveTab] = useState('jobTitle');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const generatedJD = `Job Title: ${jobTitle || 'Software Engineer'}

Key Responsibilities:
${keyResponsibilities || '• Develop and maintain high-quality software applications\n• Collaborate with cross-functional teams to define and implement new features\n• Write clean, maintainable, and efficient code\n• Participate in code reviews and ensure best practices'}

Required Skills:
${requiredSkills || '• Bachelor\'s degree in Computer Science or related field\n• Proficiency in modern programming languages\n• Strong problem-solving and analytical skills\n• Excellent communication and teamwork abilities'}

Experience Level: ${experienceLevel || 'Mid-level (3-5 years)'}

Additional Requirements:
• Strong attention to detail and commitment to quality
• Ability to work in a fast-paced, collaborative environment
• Continuous learning mindset and adaptability to new technologies`;

      setJobDescription(generatedJD);
      setIsGenerating(false);
    }, 2000);
  };

  const tabStyle = (isActive: boolean) => ({
    padding: '12px 20px',
    borderRadius: '25px',
    border: 'none',
    backgroundColor: isActive ? '#e3f2fd' : 'transparent',
    color: isActive ? '#1976d2' : '#666',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '0 5px'
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #f0f7ff 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.3)'
      }}>
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#666',
          fontSize: '14px'
        }}>
          <ChevronLeft size={20} />
          Back
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            width: '45px',
            height: '45px',
            background: 'linear-gradient(135deg, #2196f3, #21cbf3)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              width: '15px',
              height: '15px',
              backgroundColor: '#ff9800',
              borderRadius: '50%'
            }}></div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format"
              alt="Alex Carter"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>Alex Carter</div>
              <div style={{ fontSize: '12px', color: '#666' }}>alexcarter@gmail.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '60px 40px',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Title Section */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1976d2',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #1976d2, #21cbf3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Hire Smarter with AI-Powered JD Creation
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Just tell me about the role, and I'll generate a professional, tailored JD for you instantly.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <button 
            style={tabStyle(activeTab === 'jobTitle')}
            onClick={() => setActiveTab('jobTitle')}
          >
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#f44336',
              borderRadius: '50%'
            }}></div>
            Job Title
          </button>
          <button 
            style={tabStyle(activeTab === 'responsibilities')}
            onClick={() => setActiveTab('responsibilities')}
          >
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#ff9800',
              borderRadius: '50%'
            }}></div>
            Key Responsibilities
          </button>
          <button 
            style={tabStyle(activeTab === 'skills')}
            onClick={() => setActiveTab('skills')}
          >
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#f44336',
              borderRadius: '50%'
            }}></div>
            Required Skills
          </button>
          <button 
            style={tabStyle(activeTab === 'experience')}
            onClick={() => setActiveTab('experience')}
          >
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#4caf50',
              borderRadius: '50%'
            }}></div>
            Experience Level
          </button>
          <button 
            style={tabStyle(activeTab === 'suggestions')}
            onClick={() => setActiveTab('suggestions')}
          >
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#ffeb3b',
              borderRadius: '50%'
            }}></div>
            More Suggestions
          </button>
        </div>

        {/* Pro Tip */}
        <div style={{
          backgroundColor: 'rgba(255, 235, 59, 0.1)',
          border: '1px solid rgba(255, 235, 59, 0.3)',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '16px' }}>💡</span>
          <span style={{ color: '#666', fontSize: '14px' }}>
            <strong>Pro Tip:</strong> You can drag any card to the canvas or start typing freely — we'll format it automatically.
          </span>
        </div>

        {/* Input Area */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          minHeight: '400px'
        }}>
          <p style={{
            color: '#666',
            marginBottom: '30px',
            fontSize: '16px'
          }}>
            Let's build your next great hire. Start by typing your job description, or use one of the smart options below.
          </p>

          {activeTab === 'jobTitle' && (
            <div>
              <input
                type="text"
                placeholder="e.g., Senior Software Engineer, Marketing Manager, Product Designer..."
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2196f3'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
          )}

          {activeTab === 'responsibilities' && (
            <div>
              <textarea
                placeholder="Describe the key responsibilities for this role..."
                value={keyResponsibilities}
                onChange={(e) => setKeyResponsibilities(e.target.value)}
                style={{
                  width: '100%',
                  height: '200px',
                  padding: '15px 20px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2196f3'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <textarea
                placeholder="List the required skills and qualifications..."
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                style={{
                  width: '100%',
                  height: '200px',
                  padding: '15px 20px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2196f3'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
          )}

          {activeTab === 'experience' && (
            <div>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select experience level...</option>
                <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
                <option value="Mid-level (3-5 years)">Mid-level (3-5 years)</option>
                <option value="Senior (5-8 years)">Senior (5-8 years)</option>
                <option value="Lead/Principal (8+ years)">Lead/Principal (8+ years)</option>
              </select>
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px'
            }}>
              {[
                'Include diversity and inclusion statement',
                'Add remote work flexibility',
                'Mention career growth opportunities',
                'Include company culture highlights',
                'Add performance metrics/KPIs',
                'Include learning and development benefits'
              ].map((suggestion, index) => (
                <button
                  key={index}
                  style={{
                    padding: '15px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '14px',
                    textAlign: 'left'
                  }}
                onMouseEnter={(e) => {
  (e.target as HTMLElement).style.borderColor = '#2196f3';
  (e.target as HTMLElement).style.backgroundColor = '#f8f9fa';
}}
onMouseLeave={(e) => {
  (e.target as HTMLElement).style.borderColor = '#ccc'; // Reset to original or desired color
  (e.target as HTMLElement).style.backgroundColor = ''; // Reset to original or desired color
}}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {jobDescription && (
            <div style={{
              marginTop: '30px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              textAlign: 'left'
            }}>
              <h3 style={{ color: '#333', marginBottom: '15px' }}>Generated Job Description:</h3>
              <pre style={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#555'
              }}>
                {jobDescription}
              </pre>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={{
              padding: '12px 20px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <ChevronDown size={16} />
              Select Job Description
            </button>
            <button style={{
              padding: '12px 20px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <Paperclip size={16} />
              Attach Existing JD
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              padding: '15px 30px',
              background: isGenerating 
                ? 'linear-gradient(135deg, #ccc, #999)' 
                : 'linear-gradient(135deg, #2196f3, #21cbf3)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            <Sparkles size={20} />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '40px',
          fontSize: '12px',
          color: '#999',
          textAlign: 'center'
        }}>
          © 2025 aipoint.ai • Empowering Recruiters with AI • 
          <a href="mailto:support@aipoint.ai" style={{ color: '#2196f3', textDecoration: 'none' }}>
            support@aipoint.ai
          </a>
        </div>
      </div>
    </div>
  );
};

export default AIJDCreator;