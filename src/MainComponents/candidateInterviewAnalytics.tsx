import { Avatar, Box, Button, Card, CardContent, FormControl, Grid, MenuItem, Rating, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { CircleCheck } from 'lucide-react';
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

function CandidateInterviewAnalytics() {

    const location = useLocation()
    const { id } = location.state || {}
    console.log(id)

    const objectId = id

    const [interviewData, setInterviewData] = useState<any>(null)
    const [technicalQuestions, setTechnicalQuestions] = useState<any>([]);
    const [proctoringDetails, setProctoringDetails] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>(null);

    useEffect(() => {
        const fetchInterviewData = async () => {
            const organisation = localStorage.getItem('organisation');
            try {
                // const response = await axios.post("http://localhost:8000/get_interview_data/", {
                //     object_id: objectId,
                // }, {
                //     headers: {
                //         "Content-Type": "application/json",
                //         Organization: organisation || ''
                //     }
                // });
                const response = await axios.post(
                    "http://localhost:8000/get_interview_data/",
                    new URLSearchParams({
                        object_id: objectId,
                    }),
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Organization: organisation || ''
                        }
                    }
                );

                const report = response.data.data
                console.log("Interview Data:", report);

                setInterviewData(report)
                setTechnicalSkill(report.skill_scores)
                setSoftSkill(report.soft_skills_ratings)
                setTechnicalQuestions(report.analysis)
                setSummary(report.summary)

                // ✅ PROCTORING
                const proctoringTemplate = [
                    { key: "identity_verification", heading: "Identity Verification", icon: <AccountCircleIcon /> },
                    { key: "multiple_face_result", heading: "Multiple Faces Detection", icon: <FaceRetouchingNaturalIcon /> },
                    { key: "noise_detection_result", heading: "Background Noise", icon: <GraphicEqIcon /> },
                    { key: "tab_switching", heading: "Tab Switching Detected", icon: <TabIcon /> },
                    { key: "eye_movement", heading: "Eye Movement Analysis", icon: <VisibilityIcon /> },
                ];

                const proctoring_formatted_data = proctoringTemplate.map(item => {
                    let text = 'Not Available';

                    switch (item.key) {
                        case "identity_verification":
                            text = report.identity_verification?.identity === "true" ? "Successfully completed" : "Failed";
                            break;

                        case "multiple_face_result":
                            text = report.multiple_face_result?.Multiple_faces_detected_frames > 1 ? "Yes, detected" : "No faces detected";
                            break;

                        case "noise_detection_result":
                            text = report.noise_detection_result?.external_voice_analysis?.external_voice_detected === "true" ? "Yes, detected" : "Minimal";
                            break;

                        case "tab_switching":
                            text = report.tab_switching?.tab === "true" ? "Yes, detected" : "No major issues";
                            break;

                        case "eye_movement":
                            const percentStr = report.eye_movement?.sustained_eye_contact || "0%";
                            const percentNum = Math.round(parseFloat(percentStr.replace('%', '')));
                            text =
                                percentNum > 50
                                    ? `Normal, No excessive sideways glances`
                                    : `Abnormal, excessive sideways glances detected`;
                            break;

                        default:
                            break;
                    }
                    return {
                        icon: item.icon,
                        heading: item.heading,
                        text: text
                    };
                });

                setProctoringDetails(proctoring_formatted_data);

                // ✅ QUESTION TYPE COUNT
                const technicalKeywords = ['technical', 'algorithm', 'plsql', 'java', 'sql', 'api'];
                const projectKeywords = ['project', 'responsibilities', 'role', 'architecture'];
                const situationalKeywords = ['challenge', 'difficult', 'situation', 'pressure', 'deal'];
                const solvingKeywords = ['solve', 'solution', 'troubleshoot', 'debug', 'fix', 'issue'];

                let technical = 0, project = 0, situational = 0, solving = 0, general = 0;

                report.analysis.forEach((item: any) => {
                    const question = item.question.toLowerCase();

                    if (technicalKeywords.some(kw => question.includes(kw))) {
                        technical++;
                    } else if (projectKeywords.some(kw => question.includes(kw))) {
                        project++;
                    } else if (situationalKeywords.some(kw => question.includes(kw))) {
                        situational++;
                    } else if (solvingKeywords.some(kw => question.includes(kw))) {
                        solving++;
                    } else {
                        general++;
                    }
                });

                const labels = [
                    `Technical Questions: ${technical}`,
                    `Project-Based Questions: ${project}`,
                    `Situational Questions: ${situational}`,
                    `Problem-Solving Questions: ${solving}`,
                    `General Questions: ${general}`,
                ];
                const labelsValues = [technical, project, situational, solving, general];
                const updatedPieColors = labelsValues.map(getColorByQuestionRange)

                setPieChart((prevState: any) => ({
                    ...prevState,
                    series: labelsValues,
                    options: {
                        ...prevState.options,
                        colors: updatedPieColors,
                        labels,
                        tooltip: {
                            enabled: false
                        },
                        legend: {
                            show: true,
                            fontSize: '10px',
                            fontWeight: 700,
                        },
                        plotOptions: {
                            ...prevState.options.plotOptions,
                            pie: {
                                ...prevState.options.plotOptions?.pie,
                                donut: {
                                    ...prevState.options.plotOptions?.pie?.donut,
                                    labels: {
                                        ...prevState.options.plotOptions?.pie?.donut?.labels,
                                        total: {
                                            ...prevState.options.plotOptions?.pie?.donut?.labels?.total,
                                            formatter: () => `${report.analysis.length}`
                                        }
                                    }
                                }
                            }
                        }
                    }
                }));

                const skillNames = Object.keys(report.skill_scores)
                const skillValues = Object.values(report.skill_scores).map(Number)
                const updatedColors = skillValues.map(getColorByRange)

                const truncatedLabels = skillNames.map(name => {
                    return name.length > 10 ? name.slice(0, 10) + '...' : name;
                });

                setColumnChart((prevState: any) => ({
                    ...prevState,
                    series: [{ data: skillValues }],
                    options: {
                        ...prevState.options,
                        colors: updatedColors,
                        xaxis: {
                            categories: truncatedLabels,
                            labels: {
                                style: {
                                    colors: updatedColors,
                                    fontSize: '10px',
                                },
                            },
                        },
                        tooltip: {
                            x: {
                                formatter: function (value: any) {
                                    return skillNames[truncatedLabels.indexOf(value)];
                                }
                            }
                        },
                    },
                }))

            } catch (error) {
                console.log('Error')
            }
        };

        fetchInterviewData();
    }, []);


    const downloadResume = async (proId: string) => {
        const organisation = localStorage.getItem('organisation');
        const jsonData = {
            resume_id: [proId],
        };

        try {
            const response = await fetch('http://localhost:8000/get_resume/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Organization: organisation || '',
                },
                body: JSON.stringify(jsonData),
            });

            const resData = await response.json();
            const base64Data = resData[0].file_data;

            // Convert base64 to Blob
            const pdfBlob = await fetch(`data:application/pdf;base64,${base64Data}`).then((res) =>
                res.blob()
            );

            // Create download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = `resume_${proId}.pdf`;
            link.click();

            // Cleanup
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading the PDF:', error);
        }
    };

    const downloadPDF = async (objectId: string) => {
        try {
            const organisation = localStorage.getItem('organisation');

            const response = await fetch(`http://localhost:8000/export-ai-pdf/${objectId}/`, {
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



    const CustomLinearProgress = styled(LinearProgress)({
        height: 10,
        borderRadius: 5,
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

    const getColorByQuestionRange = (value: number | string) => {
        const score = typeof value === 'string' ? parseInt(value, 10) : value;
        if (score <= 2) return '#FF3B30';
        if (score <= 4) return '#FFCC00';
        if (score <= 6) return '#FF9500';
        if (score <= 8) return '#0284C7';
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

    const [pieChart, setPieChart] = useState({
        series: [],
        options: {
            chart: {
                type: 'donut',
            },
            labels: [],
            colors: [],
            dataLabels: {
                enabled: false,
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            value: {
                                show: true,
                                fontSize: '20px',
                                fontWeight: 700,
                                offsetY: 0,
                            },
                            total: {
                                show: true,
                                label: '',
                                formatter: () => '',
                            }
                        }
                    }
                }
            },
            responsive: [{
                breakpoint: 480, //From 480 to below 
                options: {
                    chart: {
                        width: 300,
                        height: 200
                    },
                    legend: {
                        position: 'bottom',
                    }
                }
            },
            {
                breakpoint: 1200, //From 1200 to below 
                options: {
                    chart: {
                        width: 200,
                        height: 200,
                    },
                    legend: {
                        position: 'bottom',
                    }
                }
            },
            {
                breakpoint: 3200, //From 3200 to below 
                options: {
                    chart: {
                        width: 300,
                        height: 200,
                    },
                    legend: {
                        position: 'bottom',
                    }
                }
            },
            ]
        }
    });

    const [columnChart, setColumnChart] = useState({
        series: [
            {
                data: [],
            },
        ],
        options: {
            chart: {
                type: 'bar',
            },
            colors: [],
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                    distributed: true,
                    borderRadius: 5,
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            tooltip: {
                shared: false,
                intersect: false,
                y: {
                    title: {
                        formatter: function () {
                            return 'Score:'
                        },
                    },
                    formatter: function (val: any) {
                        return `${val}%`
                    },
                },
            },
        },
    });


    const [softSkill, setSoftSkill] = useState<Record<string, number> | null>(
        null,
    )

    const [technicalSkill, setTechnicalSkill] = useState<Record<string, number> | null>(
        null,
    )

    const [selectedSkills, setSelectedSkills] = useState<boolean>(false)
    const handleSkillsChange = (event: any) => {
        setSelectedSkills(event.target.value === 'true')
    }

    const [selectedQuestionType, setSelectedQuestionType] = useState<boolean>(false)
    const handleQuestionTypeChange = (event: any) => {
        setSelectedQuestionType(event.target.value === 'true')
    }

    const [selectedAllQuestionType, setSelectedAllQuestionType] = useState<boolean>(false)
    const handleAllQuestionTypeChange = (event: any) => {
        setSelectedAllQuestionType(event.target.value === 'true')
    }

    const [selectedType, setSelectedType] = useState<boolean>(false)
    const handleChangeType = (event: any) => {
        setSelectedType(event.target.value === 'true')
    }

    const strengths = summary?.strengths || []
    const improvements = summary?.areas_of_improvement || []

    const questionPerformanceStyle: React.CSSProperties = {
        fontSize: '10px',
        fontWeight: 500,
        fontFamily: 'SF Pro Display',
        // color: '#22973F',
        border: '1px solid #1C1C1E1A',
        borderRadius: '6px',
        padding: '5px 10px'
    }

    const cardTitleStyle: React.CSSProperties = {
        color: '#0284C7',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'SF Pro Display',
    }

    const interviewSummaryHeadingStyle: React.CSSProperties = {
        fontSize: '10px',
        fontWeight: 500,
        fontFamily: 'SF Pro Display',
        border: '0.5px solid #22973F1A',
        borderRadius: '12px',
        padding: '5px',
        width: '30%',
        textAlign: 'center',
        marginBottom: '10px'
    }

    const dropdownStyle: React.CSSProperties = {
        backgroundColor: 'transparent',
        height: '20px',
        fontSize: '10px',
        border: '1px solid #1C1C1E1A',
        fontFamily: 'SF Pro Display',
    }

    return (
        <>
          <Header
                                title="Interview Analytics"
                                // userProfileImage={userProfileImage}
                                path="/analytics_report"
                            />
            <Grid container spacing={2} padding={2} sx={{
                background: '#F7F7F7'
            }}>
                {interviewData ? (
                    <>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ background: '#FFFFFF', borderRadius: '12px', height: '250px' }} elevation={0}>
                                <CardContent>
                                    <Typography sx={cardTitleStyle}>Candidate Overview</Typography>
                                    <Box mt={2} sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                    }}>
                                        <Avatar
                                            alt={interviewData.resume_data.name}
                                            src={interviewData.resume_data.profile_picture || ''}
                                            sx={{ width: 40, height: 40, bgcolor: '#0284C7', fontSize: '14px', fontWeight: 700 }}
                                        >
                                            {!interviewData.resume_data.profile_picture &&
                                                (interviewData.resume_data.name as string)
                                                    .split(' ')
                                                    .map((word: string) => word[0])
                                                    .slice(0, 2)
                                                    .join('')
                                                    .toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{
                                                color: '#1C1C1E',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                fontFamily: 'SF Pro Display',
                                            }}>{interviewData.resume_data.name || 'N/A'}</Typography>
                                            <Typography sx={{
                                                color: '#1C1C1E80',
                                                fontSize: '10px',
                                                fontWeight: 400,
                                                fontFamily: 'SF Pro Display',
                                            }}>{interviewData.resume_data.email || 'N/A'}</Typography>
                                        </Box>
                                        <Typography sx={{
                                            border: '0.5px solid #1C1C1E1A',
                                            borderRadius: '6px',
                                            color: '#1C1C1E',
                                            fontSize: '10px',
                                            fontWeight: 400,
                                            fontFamily: 'SF Pro Display',
                                            alignContent: 'center',
                                            padding: '0px 10px',
                                            height: '30px'
                                        }}>Date: {interviewData.resume_data.date || 'N/A'}</Typography>
                                    </Box>
                                    <Typography mt={1} sx={{
                                        color: '#1C1C1E80',
                                        fontSize: '10px',
                                        fontWeight: 400,
                                        fontFamily: 'SF Pro Display',
                                        height: '80px',
                                        overflow: 'auto'
                                    }}>{interviewData.resume_data.Resume_Category || 'N/A'}</Typography>
                                    <Box mt={1} sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                    }}>
                                        {/* <Typography sx={{
                                            alignContent: 'center',
                                            border: '0.5px solid #1C1C1E1A',
                                            borderRadius: '6px',
                                            color: '#22973F',
                                            fontSize: '10px',
                                            fontWeight: 500,
                                            fontFamily: 'SF Pro Display',
                                            padding: '0px 10px'
                                        }}>Interview Completed</Typography>
                                        <Button sx={{
                                            textTransform: 'none',
                                            border: '0.5px solid #1C1C1E1A',
                                            borderRadius: '6px',
                                            color: '#1C1C1E',
                                            fontSize: '10px',
                                            fontWeight: 500,
                                            fontFamily: 'SF Pro Display',
                                        }}
                                            onClick={() => downloadResume(interviewData.resume_data.resume_id)}
                                        >
                                            Download CV
                                        </Button> */}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ background: '#FFFFFF', borderRadius: '12px', height: '250px' }} elevation={0}>
                                <CardContent>
                                    <Typography sx={cardTitleStyle}>Total Number of Questions</Typography>
                                    <Box mt={2} width="100%">
                                        <ReactApexChart options={pieChart.options as ApexOptions} series={pieChart.series} type="donut" />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} >
                            <Card sx={{ background: '#FFFFFF', borderRadius: '12px', height: '250px' }} elevation={0}>
                                <CardContent>
                                    <Typography sx={cardTitleStyle}>Overall Interview Score</Typography>
                                    <Box mt={2} sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Typography
                                            sx={{
                                                width: '150px',
                                                height: '150px',
                                                background: getColorByRange(interviewData.overall_score * 10),
                                                border: `10px solid ${reduceColorOpacityByRange(interviewData.overall_score * 10)}`,
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
                                        >{interviewData.overall_score * 10}%
                                            <Typography sx={{
                                                color: '#FFFFFF',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                fontFamily: 'SF Pro Display',
                                            }}>{ratingScalesByRange(interviewData.overall_score * 10)}</Typography>
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} >
                            <Card sx={{ background: '#FFFFFF', borderRadius: '12px', height: '250px' }} elevation={0}>
                                <CardContent>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row'
                                    }}>
                                        <Typography sx={cardTitleStyle}>Skill Analysis</Typography>
                                        <FormControl>
                                            <Select
                                                labelId="skill-select-label"
                                                id="skill-select"
                                                value={selectedSkills.toString()}
                                                onChange={handleSkillsChange}
                                                sx={{ ...dropdownStyle, '& fieldset': { border: 'none' }, }}>
                                                <MenuItem value="false" sx={{ fontFamily: 'SF Pro Display', }}>TechnicalSkill</MenuItem>
                                                <MenuItem value="true" sx={{ fontFamily: 'SF Pro Display', }}>SoftSkill</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box mt={2} sx={{ height: '170px', overflow: 'auto' }}>
                                        {selectedSkills ? (
                                            softSkill &&
                                            Object.entries(softSkill).map(([skill, rating]) => (
                                                <Box
                                                    key={skill}
                                                    sx={{
                                                        marginBottom: '10px',
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            color: '#1C1C1E',
                                                            fontSize: '12px',
                                                            fontWeight: 500,
                                                            fontFamily: 'SF Pro Display',
                                                        }}
                                                    >
                                                        {skill}
                                                    </Typography>
                                                    <Rating name={skill} value={rating} readOnly />
                                                </Box>
                                            ))
                                        ) : (
                                            // <ReactApexChart
                                            //     options={barChart.options as ApexOptions}
                                            //     series={barChart.series}
                                            //     type="bar"
                                            //     height="150px"
                                            // />

                                            technicalSkill &&
                                            Object.entries(technicalSkill).map(([skill, value]) => (
                                                <Box key={skill} mb={1}>
                                                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                                                        <Typography sx={{
                                                            color: '#1C1C1E',
                                                            fontSize: '12px',
                                                            fontWeight: 400,
                                                            fontFamily: 'SF Pro Display',
                                                        }}>{skill}</Typography>
                                                        <Typography sx={{
                                                            color: '#0284C7',
                                                            fontSize: '12px',
                                                            fontWeight: 400,
                                                            fontFamily: 'SF Pro Display',
                                                        }}>{value}%</Typography>
                                                    </Box>
                                                    <CustomLinearProgress variant="determinate" value={value} />
                                                </Box>
                                            ))
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} >
                            <Card sx={{ background: '#FFFFFF', borderRadius: '12px', height: '250px' }} elevation={0}>
                                <CardContent>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row'
                                    }}>
                                        <Typography sx={cardTitleStyle}>Question-wise Performance</Typography>
                                        {/* <FormControl>
                                            <Select
                                                labelId="skill-select-label"
                                                id="skill-select"
                                                value={selectedQuestionType.toString()}
                                                onChange={handleQuestionTypeChange}
                                                sx={{ ...dropdownStyle, '& fieldset': { border: 'none' }, }}>
                                                <MenuItem value="false" sx={{ fontFamily: 'SF Pro Display', }}>Technical Question</MenuItem>
                                                <MenuItem value="true" sx={{ fontFamily: 'SF Pro Display', }}>Coding Question</MenuItem>
                                            </Select>
                                        </FormControl> */}
                                    </Box>
                                    <Box mt={2} sx={{
                                        height: '170px',
                                        overflow: 'auto'
                                    }}>
                                        {/* {selectedQuestionType ? (
                                            'No Data'
                                        ) : (
                                            technicalQuestions.map((item: any, index: any) => (
                                                <Box key={index} mb={2}>
                                                    <Typography sx={{
                                                        fontSize: '12px',
                                                        fontWeight: 500,
                                                        fontFamily: 'SF Pro Display',
                                                        color: '#1C1C1E'
                                                    }}>{index + 1}.{item.question}</Typography>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                    }}>
                                                        <Typography sx={{ ...questionPerformanceStyle, color: getColorByRange(item.analysis.correctness), }}>Correctness: {item.analysis.correctness}%</Typography>
                                                        <Typography sx={{ ...questionPerformanceStyle, color: getColorByRange(item.analysis.clarity), }}>Clarity: {item.analysis.clarity}%</Typography>
                                                        <Typography sx={{ ...questionPerformanceStyle, color: getColorByRange(item.analysis.Perfection), }}>Perfection: {item.analysis.Perfection}%</Typography>
                                                    </Box>
                                                </Box>
                                            ))
                                        )} */}
                                        {technicalQuestions.map((item: any, index: any) => (
                                            <Box key={index} mb={2}>
                                                <Typography sx={{
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    fontFamily: 'SF Pro Display',
                                                    color: '#1C1C1E'
                                                }}>{index + 1}.{item.question}</Typography>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                }}>
                                                    <Typography sx={{ ...questionPerformanceStyle, color: getColorByRange(item.analysis.correctness), }}>Correctness: {item.analysis.correctness}%</Typography>
                                                    <Typography sx={{ ...questionPerformanceStyle, color: getColorByRange(item.analysis.clarity), }}>Clarity: {item.analysis.clarity}%</Typography>
                                                    <Typography sx={{ ...questionPerformanceStyle, color: getColorByRange(item.analysis.Perfection), }}>Perfection: {item.analysis.Perfection}%</Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} >
                            <Card sx={{ background: '#FFFFFF', borderRadius: '12px', height: '250px' }} elevation={0}>
                                <CardContent>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row'
                                    }}>
                                        <Typography sx={cardTitleStyle}>Interview Outcome</Typography>
                                        {/* <FormControl>
                                            <Select
                                                labelId="skill-select-label"
                                                id="skill-select"
                                                value={selectedAllQuestionType.toString()}
                                                onChange={handleAllQuestionTypeChange}
                                                sx={{ ...dropdownStyle, '& fieldset': { border: 'none' }, }}>
                                                <MenuItem value="false" sx={{ fontFamily: 'SF Pro Display', }}>All Question</MenuItem>
                                                <MenuItem value="true" sx={{ fontFamily: 'SF Pro Display', }}>Question</MenuItem>
                                            </Select>
                                        </FormControl> */}
                                    </Box>
                                    <Box mt={2}>
                                        {/* {selectedAllQuestionType ? (
                                            'No Data'
                                        ) : ( */}
                                        <ReactApexChart
                                            options={columnChart.options as ApexOptions}
                                            series={columnChart.series}
                                            type="bar"
                                            height={200}
                                        />
                                        {/* )} */}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} >
                            <Card sx={{ background: '#FFFFFF', borderRadius: '12px', height: '250px' }} elevation={0}>
                                <CardContent>
                                    <Typography sx={cardTitleStyle}>Proctoring Details</Typography>
                                    <Box mt={2} sx={{
                                        height: '170px',
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
                                                    height="10px"
                                                    width="10px"
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
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}>
                                                    <Typography sx={{
                                                        color: '#1C1C1E',
                                                        fontSize: '12px',
                                                        fontWeight: 500,
                                                        fontFamily: 'SF Pro Display',
                                                    }}>{item.heading}</Typography>
                                                    <Typography sx={{
                                                        color: (item.text === 'Yes, detected' || item.text === 'Failed' || item.text === 'Abnormal, excessive sideways glances detected') ? '#FF3B30' : '#22973F',
                                                        fontSize: '10px',
                                                        fontWeight: 400,
                                                        fontFamily: 'SF Pro Display',
                                                    }}>{item.text}</Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} >
                            <Card sx={{ background: '#FFFFFF', borderRadius: '12px', height: '250px' }} elevation={0}>
                                <CardContent>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row'
                                    }}>
                                        <Typography sx={cardTitleStyle}>Interview Summary</Typography>
                                        {/* <FormControl>
                                            <Select
                                                labelId="skill-select-label"
                                                id="skill-select"
                                                value={selectedType.toString()}
                                                onChange={handleChangeType}
                                                sx={{ ...dropdownStyle, '& fieldset': { border: 'none' }, }}>
                                                <MenuItem value="false" sx={{ fontFamily: 'SF Pro Display', }}>All</MenuItem>
                                                <MenuItem value="true" sx={{ fontFamily: 'SF Pro Display', }}>Individual</MenuItem>
                                            </Select>
                                        </FormControl> */}
                                    </Box>
                                    <Box mt={2} sx={{ height: '170px', overflow: 'auto' }}>
                                        {/* {selectedType ? (
                                            'No Data'
                                        ) : ( */}
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px'
                                        }}>
                                            <Box>
                                                <Typography sx={{ ...interviewSummaryHeadingStyle, color: '#22973F', }}>
                                                    Strengths
                                                </Typography>
                                                {strengths.map((str: any, index: number) => (
                                                    <Typography
                                                        key={`strength-${index}`}
                                                        sx={{
                                                            color: '#1C1C1E',
                                                            fontSize: '12px',
                                                            fontWeight: 400,
                                                            fontFamily: 'SF Pro Display',
                                                        }}
                                                    >
                                                        <CircleCheck color='#22973F' height='20px' /> {str}
                                                    </Typography>
                                                ))}
                                            </Box>
                                            <Box>
                                                <Typography sx={{ ...interviewSummaryHeadingStyle, color: '#FF3B30', }}>
                                                    Improvements
                                                </Typography>
                                                {improvements.map((imp: any, index: number) => (
                                                    <Typography
                                                        key={`improvement-${index}`}
                                                        sx={{
                                                            color: '#1C1C1E',
                                                            fontSize: '12px',
                                                            fontWeight: 400,
                                                            fontFamily: 'SF Pro Display',
                                                        }}
                                                    >
                                                        <CircleAlert color='#FF3B30' height='20px' /> {imp}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </Box>
                                        {/* )} */}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4} >
                            <Card sx={{ background: '#FFFFFF', borderRadius: '12px', height: '250px' }} elevation={0}>
                                <CardContent>
                                    <Typography sx={cardTitleStyle}>Interview Outcome</Typography>
                                    <Box mt={2}>
                                        <Typography sx={{
                                            color: '#1C1C1E',
                                            fontSize: '12px',
                                            fontWeight: 400,
                                            fontFamily: 'SF Pro Display',
                                            height: '120px',
                                            overflow: 'auto'
                                        }}>{'N/A'}</Typography>
                                        <Box mt={2} sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            {/* <Button sx={{
                                                textTransform: 'none',
                                                background: getColorByRange(interviewData.overall_score * 10),
                                                borderRadius: '6px',
                                                color: '#FFFFFF',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                fontFamily: 'SF Pro Display',
                                                '&:hover': {
                                                    background: '#0284C7',
                                                }
                                            }}>
                                                {ratingScalesByRange(interviewData.overall_score * 10)} {interviewData.overall_score * 10}%
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
                                                    }
                                                }}
                                                onClick={() => downloadPDF(objectId)}
                                            >
                                                Download Assessment
                                            </Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </>
                ) : ('')}
            </Grid>
        </>
    )
}

export default CandidateInterviewAnalytics;