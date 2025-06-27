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
import { getResumeCount, uploadStatus } from '../services/ResumeService';
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
    progress: upload.progress
  }));

  const [filter, setFilter] = useState('All');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [backendFiles, setBackendFiles] = useState<BackendFileItem[]>([]);
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [5, 10, 25, 50];

  const organisation = localStorage.getItem('organisation');

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (filter === 'All') return true;
    if (filter === 'Uploaded') return file.status === 'uploaded';
    if (filter === 'Failed') return file.status === 'failed';
    if (filter === 'Uploading') return file.status === 'uploading';
    return true;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      Array.from(uploadedFiles).forEach((file, index) => {
        const newFile: FileItem = {
          id: `new-${Date.now()}-${index}`,
          name: file.name,
          type: file.name.endsWith('.pdf') ? 'pdf' : 'doc',
          status: 'uploading',
          uploadDate: 'uploading...',
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
        
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            dispatch(updateUploadStatus(newFile.id, {
              status: 'success',
              uploadDate: 'just now',
              progress: undefined
            }));
            clearInterval(interval);
          } else {
            dispatch(updateUploadStatus(newFile.id, {
              progress
            }));
          }
        }, 200);
      });
    }
  };

  const deleteFile = (id: string) => {
    // For now, we'll just update the status to cancelled
    dispatch(updateUploadStatus(id, { status: 'cancelled' }));
  };

  // Determine which data to display
  const displayData = reqNo ? backendFiles : filteredFiles;
  const isBackendData = reqNo && backendFiles.length > 0;

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Header */}
      <Header
        title={reqNo ? "Status of Upload" : "Uploaded Resumes"}
        userProfileImage={userProfileImage}
        path="/uploadfiles"
      />

      {/* Show backend table if req_no is provided */}
      {isBackendData ? (
        <div style={{ padding: '4px 33px 15px 38px' }}>
          <div>
            <Box sx={{ paddingTop: '20px' }}>
              <Grid container spacing={0}>
                <Grid item xs={12} md={12} lg={12}>
                  <div>
                    <div style={{
                      borderRadius: '11px',
                      height: '600px',
                      overflowY: 'auto',
                      color: '#A7DBD6',
                      overflowX: 'hidden',
                    }}>
                      <TableContainer component={Paper} style={{ overflowY: 'auto' }}>
                        <Table aria-label="simple table" style={{ background: '#1C1C1C' }}>
                          <TableHead>
                            <TableRow style={{ background: '#FFFFFF' }}>
                              <TableCell style={{
                                fontFamily: 'SF Pro Display',
                                color: 'darkblue',
                              }}>
                                File names
                              </TableCell>
                              <TableCell style={{
                                fontFamily: 'SF Pro Display',
                                color: 'darkblue',
                              }}>
                                Status
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
                                }}>
                                  {file.original_file_name}
                                </TableCell>

                                <TableCell style={{
                                  fontFamily: 'SF Pro Display',
                                  backgroundColor: '#FFFFFF',
                                  color: file.duplicate === 'no' ? 'green' : 'red',
                                }}>
                                  {file.duplicate === 'no' ? 'Successful' : 'Failed'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <TablePagination
                          rowsPerPageOptions={rowsPerPageOptions}
                          component="div"
                          count={backendFiles.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
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
                  gap: '8px',
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
                  <option value="Uploading">Uploading</option>
                  <option value="Failed">Failed</option>
                </select>
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
                    gap: '6px',
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
              gridTemplateColumns: windowWidth <= 640 ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    backgroundColor: file.status === 'failed' ? '#fef2f2' : 'white',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      flex: 1,
                      minWidth: 0
                    }}>
                      {getFileIcon(file.type, file.status)}
                      <span style={{
                        fontSize: '14px',
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
                        padding: '4px',
                        color: '#6b7280',
                        flexShrink: 0
                      }}
                    >
                      <X style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '8px'
                  }}>
                    {file.size} • {file.uploadDate}
                  </div>

                  {file.status === 'uploading' && file.progress !== undefined && (
                    <div style={{
                      backgroundColor: '#f3f4f6',
                      borderRadius: '4px',
                      height: '6px',
                      overflow: 'hidden',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        backgroundColor: '#3b82f6',
                        height: '100%',
                        width: `${file.progress}%`,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(file.status)
                    }} />
                    <span style={{
                      fontSize: '12px',
                      color: getStatusColor(file.status),
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {file.status === 'uploaded' ? 'uploaded successfully' : file.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploadInterface;