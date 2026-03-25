import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import { Google, Visibility, VisibilityOff, Email, Lock, Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { motion } from 'framer-motion';
import { IconButton, InputAdornment } from '@mui/material';
import { useErrorHandler } from '../utils/errorHandler';
import ErrorAlert from '../components/ErrorAlert';
import ParticleBackground from '../components/ParticleBackground';
import GlassmorphismCard from '../components/GlassmorphismCard';

const Login = () => {
  const [email, setEmail] = useState('demo@lendiq.ai');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const { login, resetPassword } = useAuth();
  // Google login handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    clearError();
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Smart routing: mobile/native goes to home, desktop goes to dashboard
      const isNative = Capacitor.isNativePlatform();
      if (isMobile || isNative) {
        navigate('/home');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async () => {
    setResetLoading(true);
    setResetSuccess('');
    clearError();
    try {
      await resetPassword(resetEmail || email);
      setResetSuccess('Password reset email sent! Check your inbox.');
    } catch (error) {
      handleError(error);
    } finally {
      setResetLoading(false);
    }
  };
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    try {
      await login(email, password);
      // Smart routing: mobile/native goes to home, desktop goes to dashboard
      const isNative = Capacitor.isNativePlatform();
      if (isMobile || isNative) {
        navigate('/home');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ParticleBackground>
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 4,
            position: 'relative',
            zIndex: 1
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            <GlassmorphismCard
              sx={{
                p: { xs: 3, sm: 4 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}
              glowColor="rgba(167,199,231,0.3)"
            >
              {/* Floating decorative elements */}
              <Box
                component={motion.div}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                sx={{
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(167,199,231,0.1), transparent)',
                  pointerEvents: 'none'
                }}
              />

              <Box
                component={motion.div}
                animate={{
                  rotate: [360, 0],
                  scale: [1, 0.9, 1]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                sx={{
                  position: 'absolute',
                  bottom: -25,
                  left: -25,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(181,234,215,0.1), transparent)',
                  pointerEvents: 'none'
                }}
              />
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Box
                component="img"
                src="/logo.png"
                alt="LendIQ Logo"
                sx={{
                  width: isMobile ? '120px' : '150px',
                  height: 'auto',
                  mb: 2
                }}
              />
              <Typography
                component="h1"
                variant={isMobile ? "h4" : "h3"}
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #8e19d2ff 30%, #d742f5ff 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                LendIQ
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Insight to foresight, In real-time
              </Typography>
            </Box>            
              <ErrorAlert error={error} />

              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', position: 'relative', zIndex: 1 }}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.08)',
                        },
                        '&.Mui-focused': {
                          background: 'rgba(255,255,255,0.1)',
                          boxShadow: '0 0 20px rgba(167,199,231,0.3)'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: 'primary.main' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.08)',
                        },
                        '&.Mui-focused': {
                          background: 'rgba(255,255,255,0.1)',
                          boxShadow: '0 0 20px rgba(181,234,215,0.3)'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'secondary.main' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'text.secondary' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    component={motion.button}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 10px 30px rgba(167,199,231,0.4)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    sx={{
                      mb: 2,
                      py: 1.5,
                      borderRadius: '12px',
                      background: 'linear-gradient(45deg, #A7C7E7 0%, #B5EAD7 50%, #C7CEEA 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transition: 'left 0.5s',
                      },
                      '&:hover::before': {
                        left: '100%',
                      },
                      '&:disabled': {
                        background: 'rgba(167,199,231,0.3)',
                      }
                    }}
                  >
                    {loading ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={20} color="inherit" />
                        <span>Signing In...</span>
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center" gap={1}>
                        <LoginIcon />
                        <span>Sign In to Your Account</span>
                      </Box>
                    )}
                  </Button>
                </motion.div>


                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    sx={{
                      mb: 2,
                      py: 1.5,
                      borderRadius: '12px',
                      border: '2px solid rgba(167,199,231,0.3)',
                      color: 'primary.main',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                      background: 'rgba(255,255,255,0.05)',
                      '&:hover': {
                        borderColor: 'primary.main',
                        background: 'rgba(167,199,231,0.1)',
                        boxShadow: '0 4px 12px rgba(167,199,231,0.2)'
                      }
                    }}
                    onClick={() => setResetEmail(email)}
                  >
                    Forgot Password?
                  </Button>
                </motion.div>

                {resetEmail && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ mb: 2, p: 2, borderRadius: '12px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                      <TextField
                        fullWidth
                        label="Enter your email to reset password"
                        value={resetEmail}
                        onChange={e => setResetEmail(e.target.value)}
                        sx={{
                          mb: 1,
                          '& .MuiOutlinedInput-root': {
                            background: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '8px'
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        fullWidth
                        component={motion.button}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleForgotPassword}
                        disabled={resetLoading}
                        sx={{
                          background: 'linear-gradient(45deg, #FFE4B5, #FFB3BA)',
                          color: 'white',
                          fontWeight: 600,
                          borderRadius: '8px'
                        }}
                      >
                        {resetLoading ? <CircularProgress size={20} color="inherit" /> : 'Send Reset Email'}
                      </Button>
                      {resetSuccess && (
                        <Alert
                          severity="success"
                          sx={{
                            mt: 1,
                            background: 'rgba(184, 230, 184, 0.1)',
                            color: '#B8E6B8',
                            border: '1px solid rgba(184, 230, 184, 0.3)'
                          }}
                        >
                          {resetSuccess}
                        </Alert>
                      )}
                    </Box>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'rgba(167,199,231,0.3)' } }}>
                    <Chip
                      label="या"
                      size="small"
                      sx={{
                        background: 'rgba(167,199,231,0.1)',
                        color: 'primary.main',
                        fontWeight: 600
                      }}
                    />
                  </Divider>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<Google />}
                    component={motion.button}
                    whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(167,199,231,0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    sx={{
                      mb: 3,
                      py: 1.5,
                      borderRadius: '12px',
                      border: '2px solid rgba(167,199,231,0.3)',
                      color: 'text.primary',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                      background: 'rgba(255,255,255,0.05)',
                      '&:hover': {
                        borderColor: 'primary.main',
                        background: 'rgba(167,199,231,0.1)'
                      }
                    }}
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign in with Google'}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Don't have an account?
                    </Typography>
                    <Link
                      to="/register"
                      style={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '1rem'
                      }}
                    >
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        style={{ display: 'inline-block' }}
                      >
                        Create Your Account ✨
                      </motion.span>
                    </Link>
                  </Box>
                </motion.div>

                {/* Extraordinary footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                >
                  <Box textAlign="center" mt={3}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                      🇮🇳 Made with ❤️ for Indian Financial Freedom 🇮🇳
                    </Typography>
                    <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
                      <Chip
                        label="₹ INR Ready"
                        size="small"
                        sx={{
                          background: 'rgba(167,199,231,0.1)',
                          color: '#A7C7E7',
                          border: '1px solid rgba(167,199,231,0.3)',
                          fontSize: '0.7rem'
                        }}
                      />
                      <Chip
                        label="🤖 AI Powered"
                        size="small"
                        sx={{
                          background: 'rgba(181,234,215,0.1)',
                          color: '#B5EAD7',
                          border: '1px solid rgba(181,234,215,0.3)',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  </Box>
                </motion.div>
              </Box>
              </GlassmorphismCard>
            </motion.div>
          </Box>
        </Container>
      </ParticleBackground>
    );
};

export default Login;
