import { Box, Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Tooltip, Typography } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts';
import { CircleAlert } from 'lucide-react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import TabIcon from '@mui/icons-material/Tab';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Header from '../CommonComponents/topheader';

function CandidateCodingAssessment() {

    const location = useLocation()
    const { id } = location.state || {}
    console.log(id)

    const objectId = id

    const CustomLinearProgress = styled(LinearProgress)({
        height: 10,
        width: '100%',
        borderRadius: 5,
        marginLeft: 10,
        marginRight: 10,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: '#e0e0e0',
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: '#1a90ff',
        },
    });

    const getColorByRange = (value: number | string) => {
        const score = typeof value === 'string' ? parseInt(value, 10) : value;
        if (score <= 20) return '#FF3B30';
        if (score <= 40) return '#FFCC00';
        if (score <= 60) return '#FF9500';
        if (score <= 80) return '#0284C7';
        return '#22973F';
    };

    const reduceColorOpacityByRange = (value: number | string) => {
        const score = typeof value === 'string' ? parseInt(value, 10) : value;
        if (score <= 20) return '#f7aaa6';
        if (score <= 40) return '#fff1ba';
        if (score <= 60) return '#ffd9a3';
        if (score <= 80) return '#c2e9fc';
        return '#ecffdc';
    };

    const ratingScalesByRange = (value: number | string) => {
        const score = typeof value === 'string' ? parseInt(value, 10) : value;
        if (isNaN(score)) return 'N/A';
        if (score <= 20) return 'Poor';
        if (score <= 40) return 'Fair';
        if (score <= 60) return 'Good';
        if (score <= 80) return 'Very Good';
        return 'Excellent';
    };

    const [interviewData, setInterviewData] = useState<any>(null)
    const [proctoringDetails, setProctoringDetails] = useState<any[]>([]);

    interface Question {
        title: string;
        problem_statement: string;
    }

    interface CodeAnalysis {
        question: string;
        answer: string;
        analysis: {
            assessment_metrics: {
                correctness_score: number;
                time_complexity_score: number;
                space_complexity_score: number;
                error_report_percentage: number;
            }
        }
    }

    const [selectedTitle, setSelectedTitle] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysis[]>([]);

    const [matchedAnswer, setMatchedAnswer] = useState<string>('');
    const [matchedQuestion, setMatchedQuestion] = useState<string>('');
    const [matchedMetrics, setMatchedMetrics] = useState<Record<string, number> | null>(null,)

    const handleChange = (event: SelectChangeEvent) => {
        const title = event.target.value;
        setSelectedTitle(title);

        const selectedQuestion = questions.find(q => q.title === title);

        if (selectedQuestion) {
            console.log('Problem Statement:', selectedQuestion.problem_statement);

            // Match codeAnalysis.question with selectedQuestion.problem_statement
            const matched = codeAnalysis.find(
                (item) => item.question.trim() === selectedQuestion.problem_statement.trim()
            );

            if (matched) {
                console.log('Matched Answer:', matched.answer);
                setMatchedAnswer(matched.answer)

                console.log('Matched Question:', matched.question);
                setMatchedQuestion(matched.question)

                const metrics = matched.analysis.assessment_metrics;
                console.log('Matched Metrics:', metrics);

                const skillValue = {
                    Correctness: metrics.correctness_score,
                    Time_Comple: metrics.time_complexity_score,
                    Space_Compl: metrics.space_complexity_score,
                    Error_Report: metrics.error_report_percentage,
                };
                setMatchedMetrics(skillValue);
            } else {
                console.log('No matching question found in codeAnalysis');
            }
        }
    };

    useEffect(() => {
        const fetchInterviewData = async () => {
            const organisation = localStorage.getItem('organisation');
            try {
                const response = await axios.post(`${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/get_interview_data/`, {
                    object_id: objectId,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Organization: organisation || ''
                    }
                });

                const report = response.data.data
                console.log("Interview Data:", report);

                setQuestions(report.questions);
                setCodeAnalysis(report.code_analysis)

                setInterviewData(report)

                // ✅ Default selection logic
                if (report.questions.length > 0) {
                    const firstTitle = report.questions[0].title;
                    setSelectedTitle(firstTitle);

                    // Try to match code_analysis with this question
                    const matched = report.code_analysis.find(
                        (item: any) =>
                            item.question.trim().toLowerCase() ===
                            report.questions[0].problem_statement.trim().toLowerCase()
                    );

                    if (matched) {
                        setMatchedAnswer(matched.answer);
                        setMatchedQuestion(matched.question);

                        const metrics = matched.analysis?.assessment_metrics;

                        if (metrics) {
                            const skillValue = {
                                Correctness: metrics.correctness_score,
                                Time_Comple: metrics.time_complexity_score,
                                Space_Compl: metrics.space_complexity_score,
                                Error_Report: metrics.error_report_percentage,
                            };
                            setMatchedMetrics(skillValue);
                        } else {
                            setMatchedMetrics({});
                        }
                    } else {
                        setMatchedAnswer('');
                        setMatchedQuestion('');
                        setMatchedMetrics({});
                    }
                }

                // ✅ PROCTORING
                const backgroundNoise = report.proctoring_details?.background_noise || "N/A";

                const eyeMovementAnalysis = report.proctoring_details?.eye_movement_analysis;
                const eyeMovement = eyeMovementAnalysis
                    ? Math.round(parseFloat(eyeMovementAnalysis.replace('%', '')))
                    : null;
                const eyeMovementReport =
                    eyeMovement === undefined || eyeMovement === null
                        ? "N/A"
                        : eyeMovement > 50
                            ? "Detected"
                            : "Not Detected";

                const multipleFace = report.proctoring_details?.multiple_faces_detection;
                const multipleFaceReport =
                    multipleFace === undefined || multipleFace === null
                        ? "N/A"
                        : multipleFace > 1
                            ? "Detected"
                            : "Not Detected";

                const proctoringDetails = [
                    {
                        key: "noise_detection",
                        heading: "Background Noise",
                        icon: <GraphicEqIcon />,
                        report: backgroundNoise,
                    },
                    {
                        key: "eye_movement",
                        heading: "Eye Movement Analysis",
                        icon: <VisibilityIcon />,
                        report: eyeMovementReport,
                    },
                    {
                        key: "multiple_face",
                        heading: "Multiple Faces Detection",
                        icon: <FaceRetouchingNaturalIcon />,
                        report: multipleFaceReport,
                    },
                ];

                setProctoringDetails(proctoringDetails);

            } catch (error) {
                console.log('Error', error);
            }
        };

        fetchInterviewData();
    }, []);

    const downloadPDF = async (objectId: string) => {
        try {
            const organisation = localStorage.getItem('organisation');

            const response = await fetch(`${process.env.REACT_APP_DJANGO_PYTHON_MODULE_SERVICE}/export-coding-pdf/${objectId}/`, {
                method: 'GET',
                headers: {
                    Organization: organisation || '',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to download PDF');
            }

            const pdfBlob = await response.blob();

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(pdfBlob);
            link.download = `Interview_Report_${objectId}.pdf`;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading interview report PDF:', error);
        }
    };

    const cardTitleStyle: React.CSSProperties = {
        color: '#0284C7',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'SF Pro Display',
    }

    return (
        <>
            <Header
                title="Coding Assessment"
                // userProfileImage={userProfileImage}
                path="/analytics_report"
            />
            <Grid container spacing={1} pl={2} pb={1} sx={{ background: '#F7F7F7' }}>
                {interviewData ? (
                    <>
                        <Grid item xs={12} md={7.9}>
                            <Card sx={{ background: '#FFFFFF', borderRadius: '12px', height: '100%' }} elevation={0}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <Typography variant="inherit" sx={cardTitleStyle}>Question {questions.findIndex(q => q.title === selectedTitle) + 1}:</Typography>
                                            <FormControl>
                                                <Select
                                                    value={selectedTitle}
                                                    onChange={handleChange}
                                                    sx={{
                                                        '& fieldset': { border: 'none' },
                                                        backgroundColor: 'transparent',
                                                        height: '20px',
                                                        fontSize: '10px',
                                                        fontFamily: 'SF Pro Display'
                                                    }}
                                                >
                                                    {questions.map((item: any, index) => (
                                                        <MenuItem key={index} value={item.title} sx={{ fontFamily: 'SF Pro Display' }}>

                                                            {/* <Tooltip title={item.title} arrow> */}
                                                            <Typography
                                                                variant="inherit"
                                                                sx={{
                                                                    color: '#1C1C1E',
                                                                    fontSize: '12px',
                                                                    fontWeight: 400,
                                                                    fontFamily: 'SF Pro Display',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                }}
                                                            >
                                                                {/* {item.title.length > 50 ?
                                                                `${item.title.slice(0, 50)}...` :
                                                                item.title} */}
                                                                {item.title}
                                                            </Typography>
                                                            {/* </Tooltip> */}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
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
                                                }
                                            }}
                                            onClick={() => downloadPDF(objectId)}
                                        >
                                            Download Assessment
                                        </Button>
                                    </Box>

                                    <Box mt={2}>
                                        <Typography
                                            variant="inherit"
                                            sx={{
                                                color: '#1C1C1E',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                fontFamily: 'SF Pro Display',
                                            }}>
                                            Objective:
                                        </Typography>
                                        {/* <Tooltip title={codingInterview[selectedInterview].objective} arrow></Tooltip> */}
                                        <Tooltip title={matchedQuestion} arrow>
                                            <Typography
                                                variant="inherit"
                                                sx={{
                                                    color: '#1C1C1E',
                                                    fontSize: '12px',
                                                    fontWeight: 400,
                                                    fontFamily: 'SF Pro Display',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {/* {codingInterview[selectedInterview].objective.length > 200 ?
                                            `${codingInterview[selectedInterview].objective.slice(0, 200)}...` :
                                            codingInterview[selectedInterview].objective} */}
                                                {matchedQuestion.length > 200
                                                    ? `${matchedQuestion.slice(0, 200)}...`
                                                    : matchedQuestion}
                                            </Typography>
                                        </Tooltip>
                                        <Typography mt={1}
                                            variant="inherit"
                                            sx={{
                                                color: '#1C1C1E',
                                                fontSize: '12px',
                                                fontWeight: 400,
                                                fontFamily: 'SF Pro Display',
                                            }}>Candidate’s Code Submission</Typography>
                                        <Box border="1px solid #0284C7" borderRadius="12px" p={2} mt={1}>
                                            <Typography
                                                variant="inherit"
                                                sx={{
                                                    color: '#999999',
                                                    fontSize: '12px',
                                                    fontWeight: 400,
                                                    fontFamily: 'SF Pro Display',
                                                    whiteSpace: 'pre-line',
                                                    height: '380px',
                                                    overflow: 'auto'
                                                }}
                                            >
                                                {/* {codingInterview[selectedInterview].answer} */}
                                                {matchedAnswer}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        marginTop: '15px'
                                    }}>
                                        <Button
                                            sx={{
                                                textTransform: 'none',
                                                background: getColorByRange(interviewData.coding_overall_score),
                                                borderRadius: '6px',
                                                color: '#FFFFFF',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                fontFamily: 'SF Pro Display',
                                                '&:hover': {
                                                    background: getColorByRange(interviewData.coding_overall_score),
                                                }
                                            }}
                                        >
                                            {interviewData.resume_data.job_role.split(' ')[0] || 'N/A'}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>


                        <Grid item xs={12} md={4} >
                            <Grid container direction="column" gap={1}>
                                <Card sx={{ background: '#FFFFFF', borderRadius: '12px', height: '200px' }} elevation={0}>
                                    <CardContent>
                                        <Typography variant="inherit" sx={cardTitleStyle}>Overall Coding Assessment Score</Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: '10px'
                                        }}>
                                            <Typography
                                                variant="inherit"
                                                sx={{
                                                    width: '120px',
                                                    height: '120px',
                                                    background: getColorByRange(Math.round(interviewData.coding_overall_score)),
                                                    border: `10px solid ${reduceColorOpacityByRange(Math.round(interviewData.coding_overall_score))}`,
                                                    color: '#FFFFFF',
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    fontFamily: 'SF Pro Display',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >{Math.round(interviewData.coding_overall_score) || '0'}%
                                                <Typography
                                                    variant="inherit"
                                                    sx={{
                                                        color: '#FFFFFF',
                                                        fontSize: '14px',
                                                        fontWeight: 500,
                                                        fontFamily: 'SF Pro Display',
                                                    }}>{ratingScalesByRange(Math.round(interviewData.coding_overall_score))}</Typography>
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                                <Card sx={{ background: '#FFFFFF', borderRadius: '12px', height: '200px' }} elevation={0}>
                                    <CardContent>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            flexDirection: 'row'
                                        }}>
                                            <Typography variant="inherit" sx={cardTitleStyle}>Code Assesment Metrics</Typography>
                                            {/* <Typography sx={{
                                                color: '#1C1C1E',
                                                fontSize: '10px',
                                                fontWeight: 500,
                                                fontFamily: 'SF Pro Display',
                                                border: '1px solid #1C1C1E1A',
                                                borderRadius: '6px',
                                                padding: '2px'
                                            }}>
                                                Detailed info <CircleAlert height='15px' />
                                            </Typography> */}
                                        </Box>
                                        <Box mt={1} sx={{ height: '140px', overflow: 'auto' }}>
                                            {/* <ReactApexChart
                                        options={barChart.options as ApexOptions}
                                        series={barChart.series}
                                        type="bar"
                                        height="150px"
                                    /> */}
                                            {matchedMetrics &&
                                                Object.entries(matchedMetrics).map(([skill, value]) => (
                                                    <Box key={skill} mb={1} sx={{
                                                        border: `1px solid ${reduceColorOpacityByRange(value)}`,
                                                        borderRadius: '20px',
                                                        padding: '10px'
                                                    }}>
                                                        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                                                            <Tooltip title={skill} arrow>
                                                                <Typography
                                                                    variant="inherit"
                                                                    sx={{
                                                                        color: '#1C1C1E',
                                                                        fontSize: '12px',
                                                                        fontWeight: 400,
                                                                        fontFamily: 'SF Pro Display',
                                                                        whiteSpace: 'nowrap',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                    }}
                                                                >
                                                                    {skill.length > 10 ? `${skill.slice(0, 10)}...` : skill}
                                                                </Typography>
                                                            </Tooltip>
                                                            <CustomLinearProgress
                                                                variant="determinate"
                                                                value={value}
                                                                sx={{
                                                                    '& .MuiLinearProgress-bar': {
                                                                        backgroundColor: getColorByRange(value),
                                                                    },
                                                                }}
                                                            />
                                                            <Typography
                                                                variant="inherit"
                                                                sx={{
                                                                    color: '#1C1C1E',
                                                                    fontSize: '10px',
                                                                    fontWeight: 400,
                                                                    fontFamily: 'SF Pro Display',
                                                                }}>{value}%</Typography>
                                                        </Box>
                                                    </Box>
                                                ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                                <Card sx={{ background: '#FFFFFF', borderRadius: '12px', height: '200px' }} elevation={0}>
                                    <CardContent>
                                        <Typography variant="inherit" sx={cardTitleStyle}>Proctoring Details</Typography>
                                        <Box mt={1} sx={{
                                            height: '140px',
                                            overflow: 'auto'
                                        }}>
                                            {proctoringDetails.map((item, index) => (
                                                <Box key={index} mb={2} sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: '20px'
                                                }}>
                                                    <Box
                                                        height="0px"
                                                        width="0px"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        border="1px solid #1C1C1E1A"
                                                        borderRadius="17px"
                                                        p="17px"
                                                        color="#0284C7"
                                                    >
                                                        {item.icon}
                                                    </Box>
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                    }}>
                                                        <Typography
                                                            variant="inherit"
                                                            sx={{
                                                                color: '#1C1C1E',
                                                                fontSize: '12px',
                                                                fontWeight: 500,
                                                                fontFamily: 'SF Pro Display',
                                                            }}>{item.heading}</Typography>
                                                        <Typography
                                                            variant="inherit"
                                                            sx={{
                                                                color: (item.report === 'Detected' || item.report === 'Failed') ? '#FF3B30' : '#22973F',
                                                                fontSize: '10px',
                                                                fontWeight: 400,
                                                                fontFamily: 'SF Pro Display',
                                                            }}>{item.report}</Typography>
                                                    </div>
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                ) : ('')}
            </Grid >
        </>
    )
}

export default CandidateCodingAssessment;