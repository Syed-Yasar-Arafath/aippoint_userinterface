import React, { useState, useRef, useEffect } from 'react';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { uploadResume } from '../services/ResumeService';
import { useDispatch } from 'react-redux';
import { addUpload, openSnackbar, updateUploadStatus } from '../redux/actions';
import Header from '../CommonComponents/topheader';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

interface ResumeFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'docx';
  status: 'uploading' | 'success' | 'error' | 'inProgress' | 'cancelled';
}

const UploadCV: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('Filter By Status');
  const [resumeFiles, setResumeFiles] = useState<ResumeFile[]>([]);
  const [file, setFile] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userEmail, setUserEmail] = useState('test@example.com');
  const dispatch = useDispatch();
  const [userProfileImage, setUserProfileImage]: any = React.useState(null)
  const { t, i18n } = useTranslation()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const resumesPerPage = 12;

  // Pagination functions
  const filteredFiles = resumeFiles.filter(file => 
    selectedFilter === 'Filter By Status' || file.status === selectedFilter.toLowerCase()
  );
  
  const totalPages = Math.ceil(filteredFiles.length / resumesPerPage);
  const startIndex = (currentPage - 1) * resumesPerPage;
  const endIndex = startIndex + resumesPerPage;
  const currentFiles = filteredFiles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Uploaded successfully!';
      case 'error': return 'Error uploading';
      case 'inProgress': return 'In Progress';
      case 'uploading': return 'Ready to upload';
      case 'cancelled': return 'Cancelled';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      case 'inProgress': return '#3B82F6';
      case 'uploading': return '#F59E0B';
      case 'cancelled': return '#9CA3AF';
      default: return '#9CA3AF';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setFile(files); // Store files for upload

    const maxSize = 1024 * 1024 * 1024; // 1GB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    const newFiles: ResumeFile[] = Array.from(files).map((file, index) => {
      const fileType = file.type === 'application/pdf' ? 'pdf' : 'doc';
      const fileSize = (file.size / 1024).toFixed(2) + 'kb';
      const fileId = Date.now().toString() + index;

      // Validate file type and size
      if (!allowedTypes.includes(file.type)) {
        const uploadData = {
          id: fileId,
          name: file.name,
          type: fileType as 'pdf' | 'doc' | 'docx',
          status: 'error' as const,
          uploadDate: new Date().toLocaleString(),
          size: fileSize,
          errorMessage: 'Invalid file type'
        };
        dispatch(addUpload(uploadData));
        
        return {
          id: fileId,
          name: file.name,
          size: fileSize,
          type: fileType,
          status: 'error'
        };
      }

      if (file.size > maxSize) {
        const uploadData = {
          id: fileId,
          name: file.name,
          type: fileType as 'pdf' | 'doc' | 'docx',
          status: 'error' as const,
          uploadDate: new Date().toLocaleString(),
          size: fileSize,
          errorMessage: 'File size too large'
        };
        dispatch(addUpload(uploadData));
        
        return {
          id: fileId,
          name: file.name,
          size: fileSize,
          type: fileType,
          status: 'error'
        };
      }

      // Add to Redux store for valid files
      const uploadData = {
        id: fileId,
        name: file.name,
        type: fileType as 'pdf' | 'doc' | 'docx',
        status: 'uploading' as const,
        uploadDate: new Date().toLocaleString(),
        size: fileSize
      };
      dispatch(addUpload(uploadData));

      return {
        id: fileId,
        name: file.name,
        size: fileSize,
        type: fileType,
        status: 'uploading'
      };
    });

    setResumeFiles(prev => [...prev, ...newFiles]);
    setTotalFiles(prev => prev + files.length);
  };

  const handleUploadClick = async () => {
    if (!file || file.length === 0) {
      alert('Please select files first');
      return;
    }

    // Create FormData with all selected files
    const formData = new FormData();
    
    // Add all files to FormData
    for (const resume of Array.from(file)) {
      formData.append('files', resume);
    }

    // Add user email
    formData.append('created_by', userEmail);

    // Update file statuses to 'inProgress' and start progress
    setResumeFiles(prev =>
      prev.map(f => ({ ...f, status: 'inProgress' as const }))
    );
    setUploadProgress(10); // Start progress

    // Update Redux status to inProgress
    resumeFiles.forEach(file => {
      dispatch(updateUploadStatus(file.id, { 
        status: 'uploading',
        progress: 10 
      }));
    });

    try {
      console.log('Uploading files:', Array.from(file).map(f => f.name));
      
      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          const newProgress = prev + 10;
          
          // Update Redux progress
          resumeFiles.forEach(file => {
            dispatch(updateUploadStatus(file.id, { 
              progress: newProgress 
            }));
          });
          
          return newProgress;
        });
      }, 200);

      const res = await uploadResume(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      console.log('Upload Response:', res);
      
      // Update file statuses to 'success'
      setResumeFiles(prev =>
        prev.map(f => ({ ...f, status: 'success' as const }))
      );
      
      // Update Redux status to success
      resumeFiles.forEach(file => {
        dispatch(updateUploadStatus(file.id, { 
          status: 'success',
          progress: 100,
          uploadDate: new Date().toLocaleString()
        }));
      });
      
      dispatch(openSnackbar(t('uploadIsInProgressSnackbar'), 'green'))


      // Reset input and file state
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFile(null);
      setResumeFiles([]);
      setTotalFiles(0);
      setUploadProgress(0);

      // Dispatch to Redux store
      dispatch(addUpload(res));
    } catch (err) {
      console.error('Upload error:', err);
      
      // Update file statuses to 'error'
      setResumeFiles(prev =>
        prev.map(f => ({ ...f, status: 'error' as const }))
      );
      
      // Update Redux status to error
      resumeFiles.forEach(file => {
        dispatch(updateUploadStatus(file.id, { 
          status: 'error',
          errorMessage: 'Upload failed'
        }));
      });
      
      // alert('Error uploading files. Please try again.');
      
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
    // Find the file to retry
    const fileData = resumeFiles.find(f => f.id === fileId);
    if (!fileData || !file) return;

    // Update status to inProgress
    setResumeFiles(prev =>
      prev.map(file =>
        file.id === fileId && file.status === 'error'
          ? { ...file, status: 'inProgress' }
          : file
      )
    );

    // Create FormData with just this file
    const formData = new FormData();
    const fileToRetry = Array.from(file).find(f => f.name === fileData.name);
    
    if (fileToRetry) {
      formData.append('files', fileToRetry);
      formData.append('created_by', userEmail);

      // Upload the specific file
      uploadResume(formData)
        .then(() => {
          setResumeFiles(prev =>
            prev.map(f =>
              f.id === fileId ? { ...f, status: 'success' } : f
            )
          );
        })
        .catch((err) => {
          console.error('Retry upload failed:', err);
          setResumeFiles(prev =>
            prev.map(f =>
              f.id === fileId ? { ...f, status: 'error' } : f
            )
          );
        });
    }
  };

  return (
     
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '10px' }}>
      {/* Upload Section */}
      <Header
          title="Upload Resumes"
          userProfileImage={userProfileImage}
        />
      <div style={{
        border: '2px dashed #3B82F6',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        padding: '50px 10px',
        textAlign: 'center',
        maxWidth: '90%',
        margin: '0 auto 10px auto'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#1F2937', marginBottom: '8px' }}>
          Upload your CV or Resumes here
        </h2>

        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '30px' }}>
          Maximum upload size: 1GB • Supported Format: Doc & PDF
        </p>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf,.doc,.docx"
          multiple
          onChange={handleFileUpload}
        />

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
              cursor: 'pointer'
            }}
          >
            <CloudUploadOutlinedIcon />
            Select Files
          </button>

          <button
            onClick={handleUploadClick}
            style={{
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
              cursor: 'pointer'
            }}
          >
            Upload
          </button>
        </div>
      </div>

      {/* If No Files */}
      {resumeFiles.length === 0 ? (
        // <div style={{
        //   textAlign: 'center',
        //   padding: '40px',
        //   color: '#6B7280',
        //   fontSize: '14px',
        //   border: '1px dashed #D1D5DB',
        //   borderRadius: '8px'
        // }}>
        //   <p style={{ marginBottom: '8px' }}>No resumes uploaded.</p>
        //   <p>Please upload resumes or connect to ATS.</p>
        // </div>
        <>
        </>
      ) 
      : (
        <div>
          {/* Progress Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            maxWidth: '1200px',
            margin: '0 auto 20px auto'
          }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>
                Uploading Resumes
              </h3>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                Monitor the real-time progress of resumes being uploaded.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

              <span style={{ fontSize: '14px', fontWeight: '600', color: '#3B82F6' }}>
                {resumeFiles.filter(f => f.status === 'success').length}/{totalFiles}
              </span>

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
            </div>
          </div>

          {/* Files Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            maxWidth: '100%',
            margin: '0 auto',
            padding: '0 16px'
          }}>
            {currentFiles.map((file) => (
              <div key={file.id} style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                minHeight: '80px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: file.type === 'pdf' ? '#EF4444' : '#2563EB',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10,9 9,9 8,9" />
                  </svg>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.name}
                  </div>

                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>
                    {file.size}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: getStatusColor(file.status) }}>
                      {getStatusText(file.status)}
                    </span>

                    {(file.status === 'error' || file.status === 'inProgress') && (
                      <button
                        onClick={() => handleRetryUpload(file.id)}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#3B82F6', fontSize: '11px', cursor: 'pointer', padding: '0', textDecoration: 'underline' }}
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              marginTop: '20px',
              padding: '16px'
            }}>
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  backgroundColor: currentPage === 1 ? '#F3F4F6' : '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  color: currentPage === 1 ? '#9CA3AF' : '#3B82F6',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Previous
              </button>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: currentPage === page ? '#3B82F6' : '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      color: currentPage === page ? '#FFFFFF' : '#3B82F6',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      minWidth: '40px'
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  backgroundColor: currentPage === totalPages ? '#F3F4F6' : '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  color: currentPage === totalPages ? '#9CA3AF' : '#3B82F6',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadCV;
