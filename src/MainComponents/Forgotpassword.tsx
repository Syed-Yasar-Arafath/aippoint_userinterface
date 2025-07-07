import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    useMediaQuery,
    Theme,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';
import { openSnackbar } from '../redux/actions';
import { useDispatch } from 'react-redux';
import { emailRegex } from '../custom-components/CustomRegex';
import { getUserDetails, getUserDetailsWithouttoken } from '../services/UserService';
import { useNavigate } from 'react-router-dom';
export const passwordRegex1 = /^.{10,}$/
const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [timer, setTimer] = useState(59);

    //   const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (index: number, value: string) => {
        if (/^\d?$/.test(value)) {
            const updated = [...otp];
            updated[index] = value;
            setOtp(updated);

            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                nextInput?.focus();
            }
        }
    };
    console.log(otp)

    const handleResend = () => {
        setTimer(59);
        // Add your resend logic here
    };


    const isValidEmail = (email: any) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(email)
    }
    const [temporg, setTemporg] = useState('')
    const getOrganisation = async (email: string) => {
        if (!email || !isValidEmail(email)) {
            console.error('Email is null or undefined')
            return null
        }

        try {
            const res: any = await axios.post(
                `${process.env.REACT_APP_SPRINGBOOT_BACKEND_SERVICE}/admin/getschema/${email}`,
            )

            if (res.status === 200 && res.data !== 'no user found') {
                // ✅ Save organisation to localStorage immediately after successful response
                localStorage.setItem('organisation', res.data)
                setTemporg(res.data)
                console.log('Organisation set:', res.data)
                return res.data
            }

            return null
        } catch (error) {
            console.error('Error fetching organisation name:', error)
            setTemporg('')
            return null
        }
    }
    useEffect(() => {
        getOrganisation(email)
    }, [email])
    const dispatch = useDispatch()
    const organisation = localStorage.getItem('organisation')
    const [databaseOtp, setdatabaseOtp] = useState('')
    const getUserData = async () => {
        try {
            const res = await getUserDetailsWithouttoken(email, organisation)
            if (res != null) {
                setdatabaseOtp(res.otp)
            }

        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }
    const navigate = useNavigate()

    const handleChangeVerify = () => {
        const fullotp = otp.join('')
        if (databaseOtp === fullotp) {
            // navigate('/resetpassword')
            dispatch(openSnackbar('successfully verified', 'green'))
            setMatchedotp(true)
        } else {
            dispatch(openSnackbar('invalid otp', 'red'))
        }
    }
    const handleChangeReset = async () => {
        // const organisation = localStorage.getItem('organisation');
        const organisation = temporg;
        const isValidEmail: boolean = emailRegex.test(email)

        if (!isValidEmail) {
            dispatch(openSnackbar('Please enter correct email', 'red'))
            return;
        }

        if (organisation === '') {
            dispatch(openSnackbar('no user found', 'red'))
            return;
        }
        // if (fullOtp.length !== 6) {
        //     dispatch(openSnackbar('Please enter the complete 6-digit OTP', 'red'))
        //     return;
        // }


        try {
            const formData = new FormData()
            formData.append('email', email)
            const res = await axios.post(
                `http://localhost:8082/user/sendemail/${organisation}`,
                formData
            );
            if (res.status === 200) {
                dispatch(openSnackbar('verification otp sent successfully to your email', 'green'))
                getUserData()
            }
            console.log('OTP Verified & Email Sent:', res.data);
        } catch (err) {
            console.error('Reset error:', err);
        }
    };

    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmpassword] = useState('')
    const [matchedotp, setMatchedotp] = useState(false)
    const [passwordError, setPasswordError] = useState(false);
    const [confirmpasswordError, setConfirmpasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showconfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showconfirmPassword);
    };

    const handlechangePassword = (password: any) => {
        setPassword(password);
        if (password !== '') {
            setPasswordError(false);
        }
        if (password === '') {
            setPasswordError(true);
        }
    };
    const handlechangeConfirmpassword = (confirmpassword: any) => {
        setConfirmpassword(confirmpassword);
        if (password === confirmpassword) {
            setConfirmpasswordError(false);
        } else {
            setConfirmpasswordError(true);
        }

    };
    const handleChangeUpdatepassword = async () => {
        if(!emailRegex.test(email)){
            dispatch(openSnackbar('something wrong', 'red'));
            return
        }
        if (password === '') {
            setPasswordError(true);
        }
        if (confirmpassword === '') {
            setConfirmpasswordError(true);
        }
        if (!passwordRegex1.test(password)) {
            dispatch(openSnackbar('Password must be at least 10 characters long and include uppercase, lowercase, number, and special character', 'red'));
            return;
        }

        if (password !== confirmpassword) {
            dispatch(openSnackbar('Passwords do not match', 'red'));
            return;
        }
        const formData = new FormData();
        formData.append('password', password)
        formData.append('confirmpassword', confirmpassword);
        formData.append('email', email);
        try {
            const res = await axios.post(`http://localhost:8082/user/changePassword/${organisation}`, formData)
            if (res.status === 201) {
                dispatch(openSnackbar('password changed successfully', 'green'))
                navigate('/')
            }

        } catch (error) {
            console.log('error')
        }
    }
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Grid container spacing={0} sx={{ paddingTop: '11px', paddingLeft: '9px' }}>
                <Grid item lg={6}>
                    <Box
                        sx={{
                            // flex: 1,
                            // display: { xs: 'none', md: 'flex' },
                            // justifyContent: 'center',
                            // alignItems: 'center',
                            backgroundColor: '#fff',
                        }}
                    >
                        <img
                            src='/assets/static/images/logimg.png'
                            alt='login'
                            style={{
                                width: '100%',
                                height: '95vh',


                            }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    {matchedotp === false ? (
                        <>
                            <Box
                                display='flex'
                                flexDirection='column'
                                justifyContent='center'
                                alignItems='center'
                                px={4}
                                py={8}
                            >
                                <Box maxWidth={400} width='100%'>
                                    <Typography variant='h4' fontWeight='bold' color='primary' gutterBottom>
                                        appoint.ai
                                    </Typography>
                                    <Typography variant='h6' color='error' gutterBottom>
                                        Forgot Your Password?
                                    </Typography>
                                    <Typography variant='body2' mb={3}>
                                        No worries! Enter your registered email and we’ll help you reset your password.
                                    </Typography>
                                    <Typography mt={3} fontSize={16} color='#0A0B5C' fontWeight={300}>
                                        Email
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        //   label='Email'
                                        size='small'
                                        placeholder='Enter your email'
                                        variant='outlined'
                                        margin='normal'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    <EmailIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Box mt={2}>
                                        {
                                            databaseOtp != '' ? (
                                                <>
                                                    <Typography variant='body2' mb={1}>
                                                        Verify OTP
                                                    </Typography>
                                                    <Box display='flex' gap={1}>
                                                        {otp.map((digit, idx) => (
                                                            <TextField
                                                                key={idx}
                                                                size='small'
                                                                autoComplete='off'
                                                                id={`otp-${idx}`}
                                                                value={digit}
                                                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                                                inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                                                                sx={{ width: 48 }}
                                                            />
                                                        ))}
                                                    </Box>
                                                    <Typography variant='caption' mt={1}>
                                                        Didn&nbsp;t receive?{' '}
                                                        <Button
                                                            onClick={handleResend}
                                                            disabled={timer > 0}
                                                            size='small'
                                                            sx={{ textTransform: 'none', padding: 0 }}
                                                        >
                                                            Resend OTP in {timer > 0 ? `00:${String(timer).padStart(2, '0')}` : 'now'}
                                                        </Button>
                                                    </Typography>
                                                </>
                                            ) : (
                                                ''
                                            )
                                        }
                                    </Box>
                                    {
                                        databaseOtp != '' ? (
                                            <Button
                                                fullWidth
                                                variant='contained'
                                                color='primary'
                                                sx={{ mt: 2, py: 1.5, fontWeight: 'bold', textTransform: 'none' }}
                                                onClick={handleChangeVerify}
                                            >
                                                Verify Password
                                            </Button>
                                        ) : (
                                            <Button
                                                fullWidth
                                                variant='contained'
                                                color='primary'

                                                sx={{ mt: 2, py: 1.5, fontWeight: 'bold', textTransform: 'none' }}
                                                onClick={handleChangeReset}
                                            >
                                                Reset Password
                                            </Button>
                                        )
                                    }


                                </Box>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box
                                display='flex'
                                flexDirection='column'
                                justifyContent='center'
                                alignItems='center'
                                px={4}
                                py={8}
                            >
                                <Box maxWidth={400} width='100%'>
                                    <Typography variant='h4' fontWeight='bold' color='primary' gutterBottom>
                                        appoint.ai
                                    </Typography>
                                    <Typography variant='h6' gutterBottom>
                                        Set Your New Password
                                    </Typography>
                                    <Typography variant='body2' mb={3}>
                                        Create a strong password to secure your account. Make sure it’s something you’ll remember.
                                    </Typography>
                                    <div style={{}}>
                                        <div
                                            style={{
                                                color: '#000000',
                                                fontWeight: 700,
                                                fontSize: '16px',
                                                fontFamily: 'Epilogue',
                                                lineHeight: '48px',
                                            }}
                                        >
                                            Create Password
                                        </div>
                                        <TextField
                                            fullWidth
                                            //   label='password'
                                            name='password'
                                            // value={password}
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete='off'
                                            placeholder='Create password'
                                            onChange={(e) => handlechangePassword(e.target.value)}
                                            style={{
                                                border: '1px solid #00000080',
                                                borderRadius: '12px',
                                                // width: '260px',
                                                height: '44px',
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'transparent',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'transparent',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'transparent',
                                                    },
                                                    '& .MuiInputBase-input::placeholder': {
                                                        color: '#00000080',
                                                        fontWeight: 400,
                                                        fontSize: '16px',
                                                        fontFamily: 'Epilogue',
                                                        lineHeight: 'normal',
                                                    },
                                                },
                                            }}

                                            InputProps={{
                                                style: {
                                                    padding: '10px 12px',
                                                    height: '44px',
                                                    boxSizing: 'border-box',
                                                },
                                                endAdornment: (
                                                    <InputAdornment position='end'>
                                                        <IconButton
                                                            aria-label='toggle password visibility'
                                                            onClick={handleClickShowPassword}
                                                            edge='end'
                                                        >
                                                            {showPassword ? (
                                                                <VisibilityIcon />
                                                            ) : (
                                                                <VisibilityOffIcon />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {passwordError ? (
                                            <p style={{ color: 'red', margin: '0px', padding: '0px' }}>Please enter password</p>
                                        ) : (
                                            ''
                                        )}

                                        <div
                                            style={{
                                                color: '#000000',
                                                fontWeight: 700,
                                                fontSize: '16px',
                                                fontFamily: 'Epilogue',
                                                lineHeight: '48px',
                                            }}
                                        >
                                            Confirm Password
                                        </div>
                                        <TextField
                                            fullWidth
                                            //   label='Email'
                                            name='confirmpassword'
                                            value={confirmpassword}
                                            autoComplete='off'
                                            type={showconfirmPassword ? 'text' : 'password'}
                                            placeholder='Confirm password'
                                            onChange={(e) => handlechangeConfirmpassword(e.target.value)}
                                            style={{
                                                border: '1px solid #00000080',
                                                borderRadius: '12px',
                                                // width: '260px',
                                                height: '44px',
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: 'transparent',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: 'transparent',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: 'transparent',
                                                    },
                                                    '& .MuiInputBase-input::placeholder': {
                                                        color: '#00000080',
                                                        fontWeight: 400,
                                                        fontSize: '16px',
                                                        fontFamily: 'Epilogue',
                                                        lineHeight: 'normal',
                                                    },
                                                },
                                            }}
                                            InputProps={{
                                                style: {
                                                    padding: '10px 12px',
                                                    height: '44px',
                                                    boxSizing: 'border-box',
                                                },
                                                endAdornment: (
                                                    <InputAdornment position='end'>
                                                        <IconButton
                                                            aria-label='toggle password visibility'
                                                            onClick={handleClickShowConfirmPassword}
                                                            edge='end'
                                                        >
                                                            {showconfirmPassword ? (
                                                                <VisibilityIcon />
                                                            ) : (
                                                                <VisibilityOffIcon />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        {confirmpasswordError ? (
                                            <p style={{ color: 'red', margin: '0px', padding: '0px' }}>Please enter confirmpassword</p>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                    <Button
                                        fullWidth
                                        variant='contained'
                                        color='primary'
                                        sx={{ mt: 2, py: 1.5, fontWeight: 'bold', textTransform: 'none' }}
                                        onClick={handleChangeUpdatepassword}
                                    >
                                        Update Password
                                    </Button>


                                </Box>
                            </Box>
                        </>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default ForgotPassword;
