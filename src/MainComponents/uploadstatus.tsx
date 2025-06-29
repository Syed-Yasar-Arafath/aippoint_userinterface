import React, { useState, useEffect } from 'react';
import { Upload, FileText, X, Filter, Search, Bell, Mail } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { updateUploadStatus, clearUploads, addUpload } from '../redux/actions';
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';

import TablePagination from '@mui/material/TablePagination';
import { getResumeCount, uploadStatus, uploadResume } from '../services/ResumeService';
import { sendUploadStatusNotification, sendResumeProcessingNotification } from '../services/NotificationService';
import { useLocation } from 'react-router-dom';
import { loaderOff, loaderOn } from '../redux/actions';
import Header from '../CommonComponents/topheader';
import { getUserDetails } from '../services/UserService';

interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx';
  status: 'uploaded' | 'uploading' | 'failed';
  uploadDate: string;
  size: string;
  progress?: number;
  errorMessage?: string;
}

interface BackendFileItem {
  original_file_name: string;
  duplicate: string;
  status?: string;
  upload_date?: string;
  file_size?: string;
}

const FileUploadInterface: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reqNo = queryParams.get('req_no');
  
  const { uploads, totalUploads, successfulUploads, failedUploads } = useSelector((state: RootState) => state.uploadStatus);
  
  // Convert Redux uploads to FileItem format for compatibility
  const files: FileItem[] = uploads.map(upload => ({
    id: upload.id,
    name: upload.name,
    type: upload.type,
    status: upload.status === 'success' ? 'uploaded' : 
            upload.status === 'error' ? 'failed' : 'uploading',
    uploadDate: upload.uploadDate,
    size: upload.size,
    progress: upload.progress,
    errorMessage: upload.errorMessage
  }));

  const [filter, setFilter] = useState('All');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [backendFiles, setBackendFiles] = useState<BackendFileItem[]>([]);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);
  const rowsPerPageOptions = [1, 5, 10, 25, 50];
  const [uploadIntervals, setUploadIntervals] = useState<{[key: string]: NodeJS.Timeout}>({});

  const organisation = localStorage.getItem('organisation');

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cleanup function to clear intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(uploadIntervals).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, [uploadIntervals]);

  // Clean up failed or empty uploads after a certain time
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const uploadsToClean = uploads.filter(upload => {
        // Clean up uploads that have been in 'uploading' state for more than 5 minutes
        if (upload.status === 'uploading') {
          const uploadTime = new Date(upload.uploadDate).getTime();
          return (now - uploadTime) > 300000; // 5 minutes
        }
        // Clean up failed uploads after 10 minutes
        if (upload.status === 'error') {
          const uploadTime = new Date(upload.uploadDate).getTime();
          return (now - uploadTime) > 600000; // 10 minutes
        }
        return false;
      });

      uploadsToClean.forEach(upload => {
        // Clear any running intervals for this upload
        if (uploadIntervals[upload.id]) {
          clearInterval(uploadIntervals[upload.id]);
          setUploadIntervals(prev => {
            const newIntervals = { ...prev };
            delete newIntervals[upload.id];
            return newIntervals;
          });
        }
        
        // Update status to failed if still uploading
        if (upload.status === 'uploading') {
          const errorMessage = 'Upload timeout - please try again';
          dispatch(updateUploadStatus(upload.id, {
            status: 'error',
            errorMessage,
            uploadDate: new Date().toLocaleString()
          }));
          
          // Send timeout notification
          sendUploadStatusNotification(
            upload.id,
            upload.name,
            'error',
            errorMessage
          );
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(cleanupInterval);
  }, [uploads, uploadIntervals, dispatch]);

  // Fetch backend upload status if req_no is provided
  useEffect(() => {
    const fetchBackendUploadStatus = async () => {
      if (reqNo) {
        dispatch(loaderOn());
        try {
          const data = { req_no: reqNo };
          const res = await uploadStatus(data);
          if (res) {
            setBackendFiles(res);
          }
          dispatch(loaderOff());
        } catch (err) {
          console.error('Request error:', err);
          dispatch(loaderOff());
        }
      }
    };

    fetchBackendUploadStatus();
  }, [reqNo, dispatch]);

  // Periodic check for backend upload status updates
  useEffect(() => {
    if (!reqNo) return;

    const checkUploadStatus = async () => {
      try {
        const data = { req_no: reqNo };
        const res = await uploadStatus(data);
        if (res) {
          setBackendFiles(res);
          // Remove duplicate notifications - they should only come from actual upload completion
        }
      } catch (error) {
        console.error('Error checking upload status:', error);
      }
    };

    // Check immediately
    checkUploadStatus();

    // Set up periodic checking every 10 seconds
    const interval = setInterval(checkUploadStatus, 10000);

    return () => clearInterval(interval);
  }, [reqNo]);

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getFileIcon = (type: string, status: string) => {
    const iconStyle = {
      width: '20px',
      height: '20px',
      marginRight: '8px'
    };

    if (status === 'failed') {
      return <div style={{...iconStyle, backgroundColor: '#ef4444', borderRadius: '3px'}}></div>;
    }

    switch (type) {
      case 'pdf':
        return <div style={{...iconStyle, backgroundColor: '#ef4444', borderRadius: '3px'}}></div>;
      case 'doc':
      case 'docx':
        return <div style={{...iconStyle, backgroundColor: '#2563eb', borderRadius: '3px'}}></div>;
      default:
        return <FileText style={iconStyle} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded':
      case 'Successful':
        return '#10b981';
      case 'uploading':
        return '#f59e0b';
      case 'failed':
      case 'Failed':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const filteredFiles = files.filter(file => {
    // By default, exclude uploading files - only show completed uploads
    if (file.status === 'uploading') return false;
    
    if (filter === 'All') return true;
    if (filter === 'Uploaded') return file.status === 'uploaded';
    if (filter === 'Failed') return file.status === 'failed';
    return true;
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      Array.from(uploadedFiles).forEach(async (file, index) => {
        // Validate file
        if (!file || file.size === 0) {
          console.error('Empty file detected:', file.name);
          return;
        }

        const newFile: FileItem = {
          id: `new-${Date.now()}-${index}`,
          name: file.name,
          type: file.name.endsWith('.pdf') ? 'pdf' : 'doc',
          status: 'uploading',
          uploadDate: new Date().toLocaleString(),
          size: `${Math.round(file.size / 1024)}KB`,
          progress: 0
        };
        
        // Add to Redux store
        dispatch(addUpload({
          id: newFile.id,
          name: newFile.name,
          type: newFile.type,
          status: 'uploading',
          uploadDate: newFile.uploadDate,
          size: newFile.size,
          progress: newFile.progress
        }));
        
        // Send initial upload notification
        sendUploadStatusNotification(
          newFile.id,
          newFile.name,
          'uploading'
        );

        try {
          // Create FormData for file upload
          const formData = new FormData();
          formData.append('file', file);
          
          // Call backend upload API
          const response = await uploadResume(formData);
          
          if (response && response.success) {
            // Upload successful
            dispatch(updateUploadStatus(newFile.id, {
              status: 'success',
              uploadDate: new Date().toLocaleString(),
              progress: 100
            }));
            
            // Send success notification
            sendUploadStatusNotification(
              newFile.id,
              newFile.name,
              'success'
            );
            
            // Send processing started notification
            setTimeout(() => {
              sendResumeProcessingNotification(
                newFile.id,
                newFile.name,
                'started'
              );
            }, 1000);
            
            // Send processing completion notification
            setTimeout(() => {
              sendResumeProcessingNotification(
                newFile.id,
                newFile.name,
                'completed'
              );
            }, 4000);
            
          } else {
            // Upload failed
            const errorMessage = response?.message || 'Upload failed';
            dispatch(updateUploadStatus(newFile.id, {
              status: 'error',
              errorMessage,
              uploadDate: new Date().toLocaleString(),
              progress: 100
            }));
            
            // Send error notification
            sendUploadStatusNotification(
              newFile.id,
              newFile.name,
              'error',
              errorMessage
            );
          }
          
        } catch (error) {
          // Handle upload error
          const errorMessage = error instanceof Error ? error.message : 'Upload failed';
          dispatch(updateUploadStatus(newFile.id, {
            status: 'error',
            errorMessage,
            uploadDate: new Date().toLocaleString(),
            progress: 100
          }));
          
          // Send error notification
          sendUploadStatusNotification(
            newFile.id,
            newFile.name,
            'error',
            errorMessage
          );
        }
      });
    }
  };

  const deleteFile = (id: string) => {
    // Clear any running intervals
    if (uploadIntervals[id]) {
      clearInterval(uploadIntervals[id]);
      setUploadIntervals(prev => {
        const newIntervals = { ...prev };
        delete newIntervals[id];
        return newIntervals;
      });
    }
    
    // Update status to cancelled
    dispatch(updateUploadStatus(id, { status: 'cancelled' }));
  };

  const retryUpload = async (id: string) => {
    const file = uploads.find(upload => upload.id === id);
    if (!file) return;

    // Reset to uploading state
    dispatch(updateUploadStatus(id, {
      status: 'uploading',
      progress: 0,
      errorMessage: undefined,
      uploadDate: new Date().toLocaleString()
    }));

    // Send retry notification
    sendUploadStatusNotification(
      id,
      file.name,
      'uploading'
    );

    try {
      // For retry, we need to get the original file
      // Since we don't have the original file in Redux, we'll simulate the retry
      // In a real implementation, you might want to store the original file or get it from somewhere
      
      // Simulate retry with backend call
      // You can modify this to actually retry the upload if you have the original file
      const response = await uploadResume(new FormData()); // This would need the actual file
      
      if (response && response.success) {
        dispatch(updateUploadStatus(id, {
          status: 'success',
          uploadDate: new Date().toLocaleString(),
          progress: 100
        }));
        
        // Send success notification
        sendUploadStatusNotification(
          id,
          file.name,
          'success'
        );
        
        // Send processing notifications
        setTimeout(() => {
          sendResumeProcessingNotification(
            id,
            file.name,
            'started'
          );
        }, 1000);
        
        setTimeout(() => {
          sendResumeProcessingNotification(
            id,
            file.name,
            'completed'
          );
        }, 4000);
        
      } else {
        const errorMessage = response?.message || 'Retry failed';
        dispatch(updateUploadStatus(id, {
          status: 'error',
          errorMessage,
          uploadDate: new Date().toLocaleString(),
          progress: 100
        }));
        
        // Send error notification
        sendUploadStatusNotification(
          id,
          file.name,
          'error',
          errorMessage
        );
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Retry failed';
      dispatch(updateUploadStatus(id, {
        status: 'error',
        errorMessage,
        uploadDate: new Date().toLocaleString(),
        progress: 100
      }));
      
      // Send error notification
      sendUploadStatusNotification(
        id,
        file.name,
        'error',
        errorMessage
      );
    }
  };

  const clearAllUploads = () => {
    // Clear all running intervals
    Object.values(uploadIntervals).forEach(interval => {
      if (interval) clearInterval(interval);
    });
    setUploadIntervals({});
    
    // Clear all uploads from Redux
    dispatch(clearUploads());
  };

  // Determine which data to display
  const displayData = reqNo ? backendFiles : filteredFiles;
  const isBackendData = reqNo && backendFiles.length > 0;

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <Header
        title={reqNo ? "Status of Upload" : "Uploaded Resumes"}
        userProfileImage={userProfileImage}
        path="/uploadfiles"
      />

      {/* Show backend table if req_no is provided */}
      {isBackendData ? (
        <div style={{ 
          padding: '16px 24px',
          marginTop: '20px'
        }}>
          <div>
            <Box sx={{ paddingTop: '20px' }}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={12} lg={12}>
                  <div>
                    <div style={{
                      borderRadius: '12px',
                      height: windowWidth < 1024 ? '500px' : '600px',
                      overflowY: 'auto',
                      color: '#A7DBD6',
                      overflowX: 'hidden',
                      backgroundColor: 'white',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}>
                      <TableContainer component={Paper} style={{ 
                        overflowY: 'auto',
                        height: '100%',
                        borderRadius: '12px'
                      }}>
                        <Table aria-label="upload status table" style={{ 
                          background: '#1C1C1C',
                          minWidth: windowWidth < 1024 ? '600px' : '800px'
                        }}>
                          <TableHead>
                            <TableRow style={{ background: '#FFFFFF' }}>
                              <TableCell style={{
                                fontFamily: 'SF Pro Display',
                                color: 'darkblue',
                                fontWeight: '600',
                                fontSize: '14px',
                                padding: '16px',
                                borderBottom: '2px solid #e5e7eb'
                              }}>
                                File Names
                              </TableCell>
                              <TableCell style={{
                                fontFamily: 'SF Pro Display',
                                color: 'darkblue',
                                fontWeight: '600',
                                fontSize: '14px',
                                padding: '16px',
                                borderBottom: '2px solid #e5e7eb',
                                textAlign: 'center'
                              }}>
                                Status
                              </TableCell>
                              <TableCell style={{
                                fontFamily: 'SF Pro Display',
                                color: 'darkblue',
                                fontWeight: '600',
                                fontSize: '14px',
                                padding: '16px',
                                borderBottom: '2px solid #e5e7eb',
                                textAlign: 'center'
                              }}>
                                Upload Date
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {backendFiles && backendFiles.length > 0 && backendFiles.map((file: any, index: any) => (
                              <TableRow key={index}>
                                <TableCell style={{
                                  fontFamily: 'SF Pro Display',
                                  cursor: 'pointer',
                                  color: '#0284C7',
                                  backgroundColor: '#FFFFFF',
                                  padding: '12px 16px',
                                  borderBottom: '1px solid #f3f4f6',
                                  fontSize: '13px',
                                  fontWeight: '500'
                                }}>
                                  {file.original_file_name}
                                </TableCell>

                                <TableCell style={{
                                  fontFamily: 'SF Pro Display',
                                  backgroundColor: '#FFFFFF',
                                  color: file.duplicate === 'no' ? '#10b981' : '#ef4444',
                                  padding: '12px 16px',
                                  borderBottom: '1px solid #f3f4f6',
                                  textAlign: 'center',
                                  fontSize: '13px',
                                  fontWeight: '600'
                                }}>
                                  <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    backgroundColor: file.duplicate === 'no' ? '#d1fae5' : '#fee2e2',
                                    color: file.duplicate === 'no' ? '#065f46' : '#991b1b'
                                  }}>
                                    <div style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      backgroundColor: file.duplicate === 'no' ? '#10b981' : '#ef4444'
                                    }}></div>
                                    {file.duplicate === 'no' ? 'Successful' : 'Failed'}
                                  </div>
                                </TableCell>

                                <TableCell style={{
                                  fontFamily: 'SF Pro Display',
                                  backgroundColor: '#FFFFFF',
                                  color: '#6b7280',
                                  padding: '12px 16px',
                                  borderBottom: '1px solid #f3f4f6',
                                  textAlign: 'center',
                                  fontSize: '12px'
                                }}>
                                  {file.upload_date ? new Date(file.upload_date).toLocaleDateString() : 'N/A'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <div style={{
                          padding: '16px',
                          backgroundColor: '#f9fafb',
                          borderTop: '1px solid #e5e7eb',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}>
                          <div style={{
                            fontSize: '14px',
                            color: '#6b7280'
                          }}>
                            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, backendFiles.length)} of {backendFiles.length} results
                          </div>
                          <TablePagination
                            rowsPerPageOptions={rowsPerPageOptions}
                            component="div"
                            count={backendFiles.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </div>
                      </TableContainer>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>
      ) : (
        // Show Redux-based upload status interface
        <>
          {/* Notification */}
          <div style={{
            backgroundColor: '#dbeafe',
            border: '1px solid #93c5fd',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px'
              }}>
                ✓
              </div>
              <span style={{ fontSize: '14px', color: '#1e40af' }}>
                {successfulUploads} resumes uploaded successfully, {failedUploads} failed
              </span>
            </div>
            
            {/* Auto-refresh indicator - removed since we don't show uploading files */}
          </div>

          {/* Upload Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <h2 style={{
                  margin: '0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  Uploaded Resumes
                </h2>
                <div style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {filteredFiles.length}/{totalUploads}
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  <Filter style={{ width: '16px', height: '16px' }} />
                  Filter by Status
                </div>
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="All">All</option>
                  <option value="Uploaded">Uploaded</option>
                  <option value="Failed">Failed</option>
                </select>
                
                {/* Clear All Button */}
                {filteredFiles.length > 0 && (
                  <button
                    onClick={clearAllUploads}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <X style={{ width: '16px', height: '16px' }} />
                    Clear All
                  </button>
                )}
                
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: 'none'
                  }}
                >
                  <Upload style={{ width: '16px', height: '16px' }} />
                  Upload
                </label>
              </div>
            </div>

            {/* Files Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {filteredFiles
                .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                .map((file) => (
                <div
                  key={file.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '16px',
                    backgroundColor: file.status === 'failed' ? '#fef2f2' : 'white',
                    position: 'relative',
                    minHeight: '120px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '6px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      flex: 1,
                      minWidth: 0
                    }}>
                      {getFileIcon(file.type, file.status)}
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#1f2937',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {file.name}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteFile(file.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px',
                        color: '#6b7280',
                        flexShrink: 0
                      }}
                    >
                      <X style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                  
                  <div style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    marginBottom: '6px'
                  }}>
                    {file.size} • {file.uploadDate}
                  </div>

                  {file.status === 'uploading' && file.progress !== undefined && (
                    <div style={{
                      backgroundColor: '#f3f4f6',
                      borderRadius: '3px',
                      height: '4px',
                      overflow: 'hidden',
                      marginBottom: '6px'
                    }}>
                      <div style={{
                        backgroundColor: '#3b82f6',
                        height: '100%',
                        width: `${file.progress}%`,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  )}

                  {/* Error message for failed uploads */}
                  {file.status === 'failed' && file.errorMessage && (
                    <div style={{
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '3px',
                      padding: '4px 6px',
                      marginBottom: '6px'
                    }}>
                      <div style={{
                        fontSize: '10px',
                        color: '#dc2626',
                        fontWeight: '500',
                        marginBottom: '2px'
                      }}>
                        Error: {file.errorMessage}
                      </div>
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '4px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(file.status)
                      }} />
                      <span style={{
                        fontSize: '10px',
                        color: getStatusColor(file.status),
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {file.status === 'uploaded' ? 'uploaded successfully' : file.status}
                      </span>
                    </div>
                    
                    {/* Retry button for failed uploads */}
                    {file.status === 'failed' && (
                      <button
                        onClick={() => retryUpload(file.id)}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          padding: '2px 6px',
                          fontSize: '9px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                      >
                        <Upload style={{ width: '10px', height: '10px' }} />
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination for Redux-based interface */}
            {filteredFiles.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredFiles.length)} of {filteredFiles.length} results
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    {rowsPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option} per page
                      </option>
                    ))}
                  </select>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <button
                      onClick={() => setPage(Math.max(0, page - 1))}
                      disabled={page === 0}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: page === 0 ? '#f3f4f6' : 'white',
                        color: page === 0 ? '#9ca3af' : '#374151',
                        cursor: page === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Previous
                    </button>
                    
                    <span style={{
                      padding: '6px 12px',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      Page {page + 1} of {Math.ceil(filteredFiles.length / rowsPerPage)}
                    </span>
                    
                    <button
                      onClick={() => setPage(Math.min(Math.ceil(filteredFiles.length / rowsPerPage) - 1, page + 1))}
                      disabled={page >= Math.ceil(filteredFiles.length / rowsPerPage) - 1}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: page >= Math.ceil(filteredFiles.length / rowsPerPage) - 1 ? '#f3f4f6' : 'white',
                        color: page >= Math.ceil(filteredFiles.length / rowsPerPage) - 1 ? '#9ca3af' : '#374151',
                        cursor: page >= Math.ceil(filteredFiles.length / rowsPerPage) - 1 ? 'not-allowed' : 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploadInterface;