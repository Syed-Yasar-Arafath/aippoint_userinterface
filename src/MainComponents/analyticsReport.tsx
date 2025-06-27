import { Avatar, Box, Button, Checkbox, FormControl, Grid, IconButton, InputAdornment, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { Dayjs } from 'dayjs';
import axios from 'axios';

function AnalyticsReport() {
    const theme = useTheme()

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null); //dayjs()
    const formattedDate = selectedDate?.format('DD/MM/YYYY');
    console.log(formattedDate);

    const [selectedJobRole, setSelectedJobRole] = useState('');
    const [selectedInterviewStatus, setSelectedInterviewStatus] = useState('');

    const jobRoles = ['Java Developer', 'Python Developer', 'React Developer', 'Full Stack Developer']
    // const interviewStatus = ['Completed', 'Not Attended', 'Cancelled', 'Rescheduled']
    const interviewStatus = ['Coding', 'AI']

    const handleJobRole = (event: SelectChangeEvent) => {
        console.log('Job Role:', event.target.value)
        setSelectedJobRole(event.target.value);
    };

    const handleInterviewStatus = (event: SelectChangeEvent) => {
        console.log('Interview Status:', event.target.value)
        setSelectedInterviewStatus(event.target.value);
    };

    const [isSelected, setIsSelected] = useState(false)
    const [selected, setSelected] = useState<number[]>([]);
    const isChecked = (id: number) => selected.includes(id);

    const [interviewData, setInterviewData] = useState<any[]>([])

    useEffect(() => {
        const fetchInterviewData = async () => {
            const organisation = localStorage.getItem('organisation');
            try {
                const response = await axios.get("http://localhost:8000/get_all_interview_data/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Organization: organisation || '',
                    },
                });
                const report = response.data.data;
                console.log("Interview Data:", report);
                // setInterviewData(report)

                const formattedData = report
                    .filter((item: any) => item.resume_data)
                    .map((item: any, index: number) => ({
                        id: index + 1,
                        name: item.resume_data.name || 'N/A',
                        email: item.resume_data.email || 'N/A',
                        position: item.resume_data.job_role || 'N/A',
                        type: item.interview_type || 'N/A',
                        experience: item.resume_data.experience_in_number || 'N/A',
                        score: item.coding_overall_score ?? item.overall_score ?? 'N/A'
                    }));

                setInterviewData(formattedData);
                setInterviewProfileData(formattedData)
            } catch (error) {
                console.error('Error fetching interview data:', error);
            }
        };

        fetchInterviewData();
    }, []);

    const [page, setPage] = useState(0)
    const fixedRowsPerPage = 5

    const handleBackButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        setPage((prevPage) => prevPage - 1)
    }

    const handleNextButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        setPage((prevPage) => prevPage + 1)
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = interviewData.map((row: any) => row.id);
            setSelected(newSelecteds);
        } else {
            setSelected([]);
        }
    };

    const handleClick = (id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else {
            newSelected = selected.filter((item) => item !== id);
        }

        setSelected(newSelected);
    };

    const [interviewProfileData, setInterviewProfileData] = useState<any[]>([])

    // useEffect(() => {
    //     setInterviewProfileData(interviewData)
    // }, [])

    // const filteredData = interviewData.filter(
    //     (item) =>
    //         (!selectedJobRole || item.position?.toLowerCase() === selectedJobRole.toLowerCase()) &&
    //         (!selectedInterviewStatus || item.type?.toLowerCase() === selectedInterviewStatus.toLowerCase())
    //     // (!formattedDate || item.interviewDate === formattedDate)
    // );

    const filteredData = interviewProfileData.filter((item) => {

        const matchesJobRole =
            !selectedJobRole || item.position?.toLowerCase() === selectedJobRole.toLowerCase();

        const matchesInterviewStatus =
            !selectedInterviewStatus || item.type?.toLowerCase() === selectedInterviewStatus.toLowerCase();

        return matchesJobRole && matchesInterviewStatus;
    });


    console.log('Filtered Data', interviewProfileData)

    const [searchCandidate, setSearchCandidate] = useState('');

    const handleSearch = (value: string) => {
        if (value.trim() === '') {
            setInterviewProfileData(interviewData);
            setIsSelected(true);
        } else {
            const filteredData = interviewData.filter(
                (item: any) =>
                    item.name.toLowerCase().includes(value.toLowerCase()) ||
                    item.email.toLowerCase().includes(value.toLowerCase()) ||
                    item.position.toLowerCase().includes(value.toLowerCase()) ||
                    item.type.toLowerCase().includes(value.toLowerCase()) ||
                    item.experience?.toString().includes(value)
            );
            setInterviewProfileData(filteredData);
            setIsSelected(true);
        }
    };



    const getScoreColorByRange = (value: number | string) => {
        const score = typeof value === 'string' ? parseInt(value, 10) : value;
        if (score <= 20) return '#FF3B30';
        if (score <= 40) return '#FFCC00';
        if (score <= 60) return '#FF9500';
        if (score <= 80) return '#0284C7';
        return '#22973F';
    };

    const interviewStatusColor = (value: string) => {
        if (value === 'Completed') {
            return '#22973F';
        } else if (value === 'Not Attended' || value === 'Cancelled') {
            return '#FF3B30';
        } else if (value === 'Rescheduled') {
            return '#FF9500';
        }
        return '#000000';
    };

    const interviewScoreStyle: React.CSSProperties = {
        textTransform: 'none',
        border: '0.5px solid #1C1C1E33',
        color: '#1C1C1E',
        borderRadius: '6px',
        fontSize: '10px',
        fontWeight: 500,
        fontFamily: 'SF Pro Display',
        gap: '5px'
    }

    const tableHeading: React.CSSProperties = {
        fontSize: '12px',
        fontFamily: 'SF Pro Display',
        fontWeight: 700,
        color: '#FFFFFF',
    }

    return (
        <>
            <Grid
                padding={2}
                sx={{ background: '#F7F7F7' }}
            >
                {interviewData ? (
                    <>
                        <Grid
                            container
                            padding={1}
                            border='1px solid #1C1C1E40'
                            borderRadius='8px'
                            alignItems="center"
                            justifyContent='space-between'
                        >
                            <Grid item xs={12} sm={12} md={3}>
                                <TextField
                                    placeholder="Search.."
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={searchCandidate}
                                    onChange={(e) => {
                                        setSearchCandidate(e.target.value)
                                        handleSearch(e.target.value)
                                    }
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <SearchIcon
                                                    // onClick={handleSearch}
                                                    sx={{
                                                        color: '#FFFFFF',
                                                        background: '#0284C7',
                                                        borderRadius: '6px',
                                                        padding: '5px',
                                                        // cursor: 'pointer',
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={2}>
                                <FormControl fullWidth>
                                    <Select
                                        value={selectedJobRole}
                                        onChange={handleJobRole}
                                        displayEmpty
                                        renderValue={(selected) =>
                                            selected === '' ? (
                                                <span style={{
                                                    color: '#888',
                                                    fontSize: '10px',
                                                    fontWeight: 500,
                                                    fontFamily: 'SF Pro Display',
                                                }}>Select Job Role</span>
                                            ) : (
                                                selected
                                            )
                                        }
                                        sx={{
                                            '& fieldset': { border: 'none' },
                                            backgroundColor: 'transparent',
                                            height: '36px',
                                            fontSize: '10px',
                                            fontFamily: 'SF Pro Display',
                                        }}
                                    >
                                        {jobRoles.map((role, index) => (
                                            <MenuItem
                                                key={index}
                                                value={role}
                                                sx={{ fontFamily: 'SF Pro Display' }}
                                                onClick={() => {
                                                    setIsSelected(true)
                                                    setPage(0)
                                                }}
                                            >
                                                {role}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item display={{ xs: 'none', md: 'block' }}>
                                <Box sx={{ height: '36px', width: '1px', backgroundColor: '#1C1C1E' }} />
                            </Grid>

                            <Grid item xs={12} sm={6} md={2}>
                                <FormControl fullWidth>
                                    <Select
                                        value={selectedInterviewStatus}
                                        onChange={handleInterviewStatus}
                                        displayEmpty
                                        renderValue={(selected) =>
                                            selected === '' ? (
                                                <span style={{
                                                    color: '#888',
                                                    fontSize: '10px',
                                                    fontWeight: 500,
                                                    fontFamily: 'SF Pro Display',
                                                }}>Select Interview Status</span>
                                            ) : (
                                                selected
                                            )
                                        }
                                        sx={{
                                            '& fieldset': { border: 'none' },
                                            backgroundColor: 'transparent',
                                            height: '36px',
                                            fontSize: '10px',
                                            fontFamily: 'SF Pro Display',
                                        }}
                                    >
                                        {interviewStatus.map((status, index) => (
                                            <MenuItem
                                                key={index}
                                                value={status}
                                                sx={{ fontFamily: 'SF Pro Display' }}
                                                onClick={() => {
                                                    setIsSelected(true)
                                                    setPage(0)
                                                }}
                                            >
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item display={{ xs: 'none', md: 'block' }}>
                                <Box sx={{ height: '36px', width: '1px', backgroundColor: '#1C1C1E' }} />
                            </Grid>

                            <Grid item xs={12} sm={6} md={2}>
                                <Box>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            format="DD/MM/YYYY"
                                            // onChange={(newValue) => {
                                            onChange={(newValue: Dayjs | null) => {
                                                setSelectedDate(newValue)
                                                setIsSelected(true)
                                            }
                                            }
                                            slotProps={{
                                                textField: {
                                                    variant: 'standard',
                                                    placeholder: 'Date Range',
                                                    InputProps: {
                                                        disableUnderline: true,
                                                        sx: {
                                                            border: 'none',
                                                            backgroundColor: 'transparent',
                                                            color: '#1C1C1E',
                                                            fontSize: '10px',
                                                            fontWeight: 500,
                                                            fontFamily: 'SF Pro Display',
                                                            '& .MuiInputAdornment-root': {
                                                                marginLeft: { xl: '-50%', lg: '-50%' } // adjust icon spacing
                                                            }
                                                        },
                                                    },
                                                } as any,
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6} md={2}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    {/* <Button
                                sx={{
                                    textTransform: 'none',
                                    border: '0.5px solid #0284C780',
                                    borderRadius: '6px',
                                    color: '#1C1C1E',
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    fontFamily: 'SF Pro Display',
                                }}
                            >
                                Filter
                            </Button> */}
                                    <Button
                                        sx={{
                                            textTransform: 'none',
                                            background: '#0284C7',
                                            borderRadius: '6px',
                                            color: '#FFFFFF',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            fontFamily: 'SF Pro Display',
                                            '&:hover': {
                                                background: '#0284C7',
                                            },
                                        }}
                                    >
                                        Schedule Interview
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box mt={2}>
                            {isSelected && (
                                <Typography sx={{
                                    fontSize: '12px',
                                    fontFamily: 'SF Pro Display',
                                    fontWeight: 500,
                                    color: '#1C1C1E',
                                }}>Candidates interview details for {selectedJobRole}:</Typography>
                            )}
                        </Box>
                        <Grid item xs={12} sm={12} md={12} display='flex' justifyContent='center' mt={2}>
                            {isSelected ? (
                                <Box width='100%' height='60vh'>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead sx={{ backgroundColor: '#0284C7' }}>
                                                <TableRow>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selected.length === interviewData.length}
                                                            indeterminate={selected.length > 0 && selected.length < interviewData.length}
                                                            onChange={handleSelectAllClick}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={tableHeading}>Full Name & Email</TableCell>
                                                    <TableCell sx={tableHeading}>Position</TableCell>
                                                    <TableCell sx={tableHeading}>Interview Status</TableCell>
                                                    <TableCell sx={tableHeading}>AI Interview Score</TableCell>
                                                    <TableCell sx={tableHeading}>AI Coding Assessment Score</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredData
                                                    // .sort((a, b) => {
                                                    //     const scoreA = parseInt(a.interviewScore.replace('%', ''));
                                                    //     const scoreB = parseInt(b.interviewScore.replace('%', ''));
                                                    //     return scoreB - scoreA; // descending order
                                                    // })
                                                    .slice(
                                                        page * fixedRowsPerPage,
                                                        page * fixedRowsPerPage + fixedRowsPerPage,
                                                    )
                                                    .map((profile) => {
                                                        const isItemSelected = isChecked(profile.id);
                                                        return (
                                                            <TableRow key={profile.id} hover>
                                                                <TableCell padding="checkbox">
                                                                    <Checkbox
                                                                        checked={isItemSelected}
                                                                        onChange={() => handleClick(profile.id)}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        flexDirection: 'row',
                                                                        alignItems: 'center',
                                                                        gap: '10px'
                                                                    }}>
                                                                        <Avatar
                                                                            alt={profile.name}
                                                                            src={profile.profile_picture || ''}
                                                                            sx={{ width: 40, height: 40, bgcolor: '#0284C7', fontSize: '14px', fontWeight: 700 }}
                                                                        >
                                                                            {!profile.profile_picture &&
                                                                                (profile.name as string)
                                                                                    .split(' ')
                                                                                    .map((word: string) => word[0])
                                                                                    .slice(0, 2)
                                                                                    .join('')
                                                                                    .toUpperCase()}
                                                                        </Avatar>
                                                                        <Box sx={{
                                                                            display: 'flex',
                                                                            flexDirection: 'column'
                                                                        }}>
                                                                            <Typography sx={{
                                                                                fontSize: '12px',
                                                                                fontFamily: 'SF Pro Display',
                                                                                fontWeight: 400,
                                                                                color: '#1C1C1E',
                                                                            }}>{profile.name}</Typography>
                                                                            <Typography sx={{
                                                                                fontSize: '10px',
                                                                                fontFamily: 'SF Pro Display',
                                                                                fontWeight: 400,
                                                                                color: '#1C1C1E80',
                                                                            }}>{profile.email}</Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell> <Typography sx={{
                                                                    ...interviewScoreStyle,
                                                                    padding: '5px',
                                                                    textAlign: 'center'
                                                                }}>{profile.position}</Typography></TableCell>
                                                                <TableCell>
                                                                    <Typography sx={{
                                                                        ...interviewScoreStyle,
                                                                        color: interviewStatusColor(profile.type),
                                                                        padding: '5px',
                                                                        textAlign: 'center'
                                                                    }}>{profile.type}</Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {profile.interviewStatus === 'Completed' ? (
                                                                        <Box sx={{
                                                                            display: 'flex',
                                                                            flexDirection: 'row',
                                                                            gap: '5px'
                                                                        }}>
                                                                            <Button
                                                                                sx={{
                                                                                    ...interviewScoreStyle,
                                                                                    color: getScoreColorByRange(profile.score),
                                                                                }}
                                                                            >
                                                                                {profile.score}<ErrorOutlineIcon sx={{ fontSize: '15px' }} />
                                                                            </Button>
                                                                            <Button sx={interviewScoreStyle}>
                                                                                Download <DownloadForOfflineIcon sx={{ fontSize: '15px' }} />
                                                                            </Button>
                                                                            <Button sx={interviewScoreStyle}>
                                                                                Play <PlayCircleIcon sx={{ fontSize: '15px' }} />
                                                                            </Button>
                                                                        </Box>
                                                                    ) : (
                                                                        <Box sx={{
                                                                            display: 'flex',
                                                                            flexDirection: 'row',
                                                                            gap: '15px'
                                                                        }}>
                                                                            <Button
                                                                                sx={interviewScoreStyle}>
                                                                                <HorizontalRuleIcon />
                                                                            </Button>
                                                                            <Button sx={interviewScoreStyle}>
                                                                                <HorizontalRuleIcon />
                                                                            </Button>
                                                                            <Button sx={interviewScoreStyle}>
                                                                                <HorizontalRuleIcon />
                                                                            </Button>
                                                                        </Box>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {profile.interviewStatus === 'Completed' ? (
                                                                        <Box sx={{
                                                                            display: 'flex',
                                                                            flexDirection: 'row',
                                                                            gap: '5px'
                                                                        }}>
                                                                            <Button
                                                                                sx={{
                                                                                    ...interviewScoreStyle,
                                                                                    color: getScoreColorByRange(profile.codingAssessmentScore),
                                                                                }}
                                                                            >
                                                                                {profile.codingAssessmentScore} <ErrorOutlineIcon sx={{ fontSize: '15px' }} />
                                                                            </Button>
                                                                            <Button sx={interviewScoreStyle}>
                                                                                Download <DownloadForOfflineIcon sx={{ fontSize: '15px' }} />
                                                                            </Button>
                                                                            <Button sx={interviewScoreStyle}>
                                                                                Play <PlayCircleIcon sx={{ fontSize: '15px' }} />
                                                                            </Button>
                                                                        </Box>
                                                                    ) : (
                                                                        <Box sx={{
                                                                            display: 'flex',
                                                                            flexDirection: 'row',
                                                                            gap: '15px'
                                                                        }}>
                                                                            <Button
                                                                                sx={interviewScoreStyle}>
                                                                                <HorizontalRuleIcon />
                                                                            </Button>
                                                                            <Button sx={interviewScoreStyle}>
                                                                                <HorizontalRuleIcon />
                                                                            </Button>
                                                                            <Button sx={interviewScoreStyle}>
                                                                                <HorizontalRuleIcon />
                                                                            </Button>
                                                                        </Box>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            ) : (
                                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                <img src="assets/static/images/Profiling-bro 1.png" alt='Image'
                                    height='auto'
                                    width='40%'
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} display='flex' justifyContent='center' mt={2}>
                            {isSelected && (
                                <Box display="flex" justifyContent="center" marginTop={7}>
                                    <Box sx={{ flexShrink: 0 }}>
                                        <IconButton
                                            onClick={handleBackButtonClick}
                                            disabled={page === 0}
                                            aria-label="previous page"
                                            sx={{
                                                fontSize: '16px',
                                                color: '#1C1C1E',
                                                '&:hover': {
                                                    background: 'inherit',
                                                },
                                            }}
                                        >
                                            {theme.direction === 'rtl' ? <EastIcon /> : <WestIcon />}
                                        </IconButton>
                                        {[
                                            ...Array(Math.ceil(filteredData.length / fixedRowsPerPage)).keys(),
                                        ].map((pageNumber) => {
                                            const startPage = Math.max(0, page - 1)
                                            const endPage = Math.min(
                                                Math.ceil(filteredData.length / fixedRowsPerPage) - 1,
                                                startPage + 2,
                                            )

                                            if (pageNumber >= startPage && pageNumber <= endPage) {
                                                return (
                                                    <span
                                                        key={pageNumber}
                                                        style={{
                                                            alignSelf: 'center',
                                                            margin: '0 8px',
                                                            color: page === pageNumber ? '#0284C7' : '#1C1C1E',
                                                            // border: '1px solid #0284C7',
                                                            fontSize: '16px',
                                                            // padding: '5px 10px',
                                                            // background:
                                                            //     page === pageNumber ? '#0284C7' : 'inherit',
                                                        }}
                                                        onClick={() => setPage(pageNumber)}
                                                    >
                                                        {pageNumber + 1}
                                                    </span>
                                                )
                                            }
                                            return null
                                        })}
                                        <IconButton
                                            onClick={handleNextButtonClick}
                                            disabled={
                                                page >= Math.ceil(filteredData.length / fixedRowsPerPage) - 1
                                            }
                                            aria-label="next page"
                                            sx={{
                                                fontSize: '16px',
                                                color: '#1C1C1E',
                                                '&:hover': {
                                                    background: 'inherit',
                                                },
                                            }}
                                        >
                                            {theme.direction === 'rtl' ? <WestIcon /> : <EastIcon />}
                                        </IconButton>
                                    </Box>
                                </Box>
                            )}
                        </Grid>
                    </>
                ) : ('')}
            </Grid>
        </>
    )
}

export default AnalyticsReport;