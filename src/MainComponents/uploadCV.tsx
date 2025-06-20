import React, { useState, useRef } from 'react';
import { Upload, FileText, MoreHorizontal, Database } from 'lucide-react';

interface ResumeFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'doc';
  status: 'uploading' | 'success' | 'error' | 'inProgress' | 'cancelled';
}

const UploadCV: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('Filter By Status');
  const [resumeFiles, setResumeFiles] = useState<ResumeFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'uploaded successfully!';
      case 'error': return 'Error uploading';
      case 'inProgress': return 'In Progress';
      case 'cancelled': return 'Cancel';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      case 'inProgress': return '#3B82F6';
      case 'cancelled': return '#9CA3AF';
      default: return '#9CA3AF';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const maxSize = 1024 * 1024 * 1024; // 1GB in bytes
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    const newFiles: ResumeFile[] = Array.from(files).map((file, index) => {
      const fileType = file.type === 'application/pdf' ? 'pdf' : 'doc';
      const fileSize = (file.size / 1024).toFixed(2) + 'kb';
      
      // Validate file type and size
      if (!allowedTypes.includes(file.type)) {
        return {
          id: Date.now().toString() + index,
          name: file.name,
          size: fileSize,
          type: fileType,
          status: 'error'
        };
      }
      if (file.size > maxSize) {
        return {
          id: Date.now().toString() + index,
          name: file.name,
          size: fileSize,
          type: fileType,
          status: 'error'
        };
      }

      // Simulate upload process
      simulateFileUpload(file);
      
      return {
        id: Date.now().toString() + index,
        name: file.name,
        size: fileSize,
        type: fileType,
        status: 'inProgress'
      };
    });

    setResumeFiles(prev => [...prev, ...newFiles]);
    setTotalFiles(prev => prev + files.length);
  };

  const simulateFileUpload = (file: File) => {
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setResumeFiles(prev =>
          prev.map(f =>
            f.name === file.name && f.status === 'inProgress'
              ? { ...f, status: 'success' }
              : f
          )
        );
      }
    }, 500);

    // Simulate random error for some files (for demo purposes)
    if (Math.random() > 0.8) {
      setTimeout(() => {
        clearInterval(interval);
        setResumeFiles(prev =>
          prev.map(f =>
            f.name === file.name && f.status === 'inProgress'
              ? { ...f, status: 'error' }
              : f
          )
        );
      }, 1000);
    }
  };

  const handleCancelUpload = () => {
    setResumeFiles(prev =>
      prev.map(file =>
        file.status === 'inProgress' ? { ...file, status: 'cancelled' } : file
      )
    );
    setUploadProgress(0);
  };

  const handleRetryUpload = (fileId: string) => {
    setResumeFiles(prev =>
      prev.map(file =>
        file.id === fileId && file.status === 'error'
          ? { ...file, status: 'inProgress' }
          : file
      )
    );
    
    // Find the file and simulate upload again
    const file = resumeFiles.find(f => f.id === fileId);
    if (file) {
      simulateFileUpload({ name: file.name, size: parseFloat(file.size) * 1024, type: file.type === 'pdf' ? 'application/pdf' : 'application/msword' } as File);
    }
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#F8FAFC',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Upload Section */}
      <div style={{
        border: '2px dashed #3B82F6',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        padding: '50px 20px',
        textAlign: 'center' as const,
        maxWidth: '100%',
        margin: '0 auto 40px auto'
      }}>
        {/* Upload Icon */}
        <div style={{
          display: 'inline-block',
          position: 'relative' as const,
          marginBottom: '20px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#93C5FD',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative' as const
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            <div style={{
              position: 'absolute' as const,
              bottom: '-8px',
              right: '-8px',
              width: '32px',
              height: '32px',
              backgroundColor: '#1D4ED8',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
          </div>
        </div>

        <h2 style={{
          fontSize: '18px',
          fontWeight: '500',
          color: '#1F2937',
          margin: '0 0 8px 0'
        }}>
          Upload your CV's or Resumes here
        </h2>

        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          margin: '0 0 30px 0'
        }}>
          Maximum upload size: 1GB • Supported Format: Doc & PDF
        </p>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap' as const
        }}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx"
            multiple
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #3B82F6',
              borderRadius: '8px',
              color: '#3B82F6',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Upload
          </button>

          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: '#0EA5E9',
            border: 'none',
            borderRadius: '8px',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}>
            <img
              src="assets/static/images/icon1.png"
              alt="ATS"
              style={{
                width: '16px',
                height: '16px',
                marginRight: '8px',
              }}
            />
            Connect to ATS
          </button>
        </div>
      </div>

      {/* Progress and Controls Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1F2937',
              margin: '0 0 4px 0'
            }}>
              Uploading Resumes
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#6B7280',
              margin: '0'
            }}>
              Monitor the real-time progress of resumes being uploaded.
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* Progress Bar */}
            <div style={{
              width: '120px',
              height: '6px',
              backgroundColor: '#E5E7EB',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${uploadProgress}%`,
                height: '100%',
                backgroundColor: '#3B82F6',
                borderRadius: '3px'
              }} />
            </div>

            {/* Progress Text */}
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#3B82F6'
            }}>
              {resumeFiles.filter(f => f.status === 'success').length}/{totalFiles}
            </span>

            {/* Cancel Button */}
            <button
              onClick={handleCancelUpload}
              style={{
                padding: '4px 8px',
                backgroundColor: 'transparent',
                border: '1px solid #EF4444',
                borderRadius: '4px',
                color: '#EF4444',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            {/* Filter Dropdown */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              style={{
                padding: '6px 8px',
                border: '1px solid #D1D5DB',
                borderRadius: '4px',
                fontSize: '12px',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option>Filter By Status</option>
              <option>Success</option>
              <option>Error</option>
              <option>In Progress</option>
            </select>

            {/* Select Button */}
            <button style={{
              padding: '6px 12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              Select
            </button>

            {/* Checkbox */}
            <input type="checkbox" style={{
              width: '16px',
              height: '16px',
              cursor: 'pointer'
            }} />
          </div>
        </div>

        {/* Files Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}>
          {resumeFiles
            .filter(file => selectedFilter === 'Filter By Status' || file.status === selectedFilter.toLowerCase())
            .map((file) => (
              <div
                key={file.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  position: 'relative' as const,
                  minHeight: '80px'
                }}
              >
                {/* File Icon */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: file.type === 'pdf' ? '#EF4444' : '#2563EB',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </div>

                {/* File Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1F2937',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap' as const
                  }}>
                    {file.name}
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    marginBottom: '8px'
                  }}>
                    {file.size}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap' as const
                  }}>
                    <span style={{
                      fontSize: '11px',
                      color: getStatusColor(file.status)
                    }}>
                      {getStatusText(file.status)}
                    </span>
                    
                    <span style={{
                      backgroundColor: getStatusColor(file.status),
                      color: '#FFFFFF',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: '500'
                    }}>
                      0
                    </span>

                    {(file.status === 'error' || file.status === 'inProgress') && (
                      <button
                        onClick={() => handleRetryUpload(file.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#3B82F6',
                          fontSize: '11px',
                          cursor: 'pointer',
                          padding: '0',
                          textDecoration: 'underline'
                        }}
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </div>

                {/* More Options */}
                <button style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute' as const,
                  top: '12px',
                  right: '12px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="19" cy="12" r="1"/>
                    <circle cx="5" cy="12" r="1"/>
                  </svg>
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UploadCV;