import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Card, CardActionArea, CardContent, Typography, useTheme, useMediaQuery, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import AITipsPanel from '../components/AITipsPanel';
import ParticleBackground from '../components/ParticleBackground';
import GlassmorphismCard from '../components/GlassmorphismCard';
import { useState, useEffect, useCallback } from 'react';
import * as ApiService from '../services/api';
import { useUser } from '../contexts/UserContext';
import { useErrorHandler } from '../utils/errorHandler';
import ErrorAlert from '../components/ErrorAlert';
// Use image icons to match mobile navigation

// Extraordinary features with Indian themes and advanced animations
const features = [
  {
    label: '📊 Dashboard',
    hindiLabel: 'डैशबोर्ड',
    description: 'Track your financial journey',
    hindiDesc: 'आपकी वित्तीय यात्रा को ट्रैक करें',
    icon: '📊',
    route: '/dashboard',
    color: '#A7C7E7',
    delay: 0.1
  },
  {
    label: '💰 Expenses',
    hindiLabel: 'खर्च',
    description: 'Manage your spending',
    hindiDesc: 'अपने खर्च का प्रबंधन करें',
    icon: '💰',
    route: '/expenses',
    color: '#B5EAD7',
    delay: 0.2
  },
  {
    label: '🎯 Budgets',
    hindiLabel: 'बजट',
    description: 'Plan your finances',
    hindiDesc: 'अपने वित्त की योजना बनाएं',
    icon: '🎯',
    route: '/budgets',
    color: '#C7CEEA',
    delay: 0.3
  },
  {
    label: '🔍 Can I Afford?',
    hindiLabel: 'क्या मैं खरीद सकता हूं?',
    description: 'Check affordability',
    hindiDesc: 'किफायती जांचें',
    icon: '🔍',
    route: '/can-i-afford-this',
    color: '#FFE4B5',
    delay: 0.4
  },
  {
    label: '📈 Reports',
    hindiLabel: 'रिपोर्ट',
    description: 'Analyze your data',
    hindiDesc: 'अपने डेटा का विश्लेषण करें',
    icon: '📈',
    route: '/reports',
    color: '#FFB3BA',
    delay: 0.5
  },
  {
    label: '⚙️ Settings',
    hindiLabel: 'सेटिंग्स',
    description: 'Customize your experience',
    hindiDesc: 'अपना अनुभव अनुकूलित करें',
    icon: '⚙️',
    route: '/settings',
    color: '#D1A3FF',
    delay: 0.6
  },
];

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tipsExpanded, setTipsExpanded] = useState(false); // always collapsed by default
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userProfile, initialized } = useUser();
  const { error, handleError, clearError } = useErrorHandler();

  // Fetch home data (current month's expenses and budgets)
  const fetchHomeData = useCallback(async () => {
    if (!initialized || !userProfile) {
      console.log('Home: Skipping data fetch - user not initialized or profile not available');
      return;
    }

    try {
      setLoading(true);
      clearError();

      const currentMonth = new Date();
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      console.log('Home: Fetching current month data for tips...');

      // Fetch current month's expenses
      const expensesResponse = await ApiService.getExpenses({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });

      // Fetch current month's budgets
      const budgetsResponse = await ApiService.getBudgets({
        month: currentMonth.getMonth() + 1,
        year: currentMonth.getFullYear(),
      });

      console.log('Home: Data fetched successfully', {
        expenses: expensesResponse?.length || 0,
        budgets: budgetsResponse?.length || 0
      });

      setExpenses(expensesResponse || []);
      setBudgets(budgetsResponse || []);
    } catch (error) {
      console.error('Home: Error fetching home data:', error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [initialized, userProfile, clearError, handleError]);

  // Load data when component mounts
  useEffect(() => {
    if (initialized && userProfile) {
      fetchHomeData();
    }
  }, [fetchHomeData, initialized, userProfile]);
  return (
    <ParticleBackground>
      <Box p={2} sx={{ minHeight: '100vh', position: 'relative' }}>
        {/* Extraordinary Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          {!isMobile && (
            <Box textAlign="center" mb={4}>
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={800}
                  sx={{
                    background: 'linear-gradient(45deg, #A7C7E7, #B5EAD7, #C7CEEA)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  🪐 FinSightAI
                </Typography>
              </motion.div>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                Your Extraordinary Financial Companion
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                "वित्तीय स्वतंत्रता की ओर आपका मार्गदर्शक" • "Your Guide to Financial Freedom"
              </Typography>
            </Box>
          )}

          {isMobile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Box textAlign="center" mb={3}>
                <Typography variant="h4" fontWeight={700} sx={{ color: theme.palette.primary.main, mb: 1 }}>
                  🪐 Welcome!
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  "वित्तीय सफलता की यात्रा शुरू करें"
                </Typography>
              </Box>
              <ErrorAlert error={error} />
              <Box mb={3}>
                <AITipsPanel
                  expandable
                  expanded={tipsExpanded}
                  onExpand={() => setTipsExpanded((prev) => !prev)}
                  expenses={expenses}
                  budgets={budgets}
                />
              </Box>
            </motion.div>
          )}
        </motion.div>

        {/* Extraordinary Feature Grid */}
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={feature.label}>
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: feature.delay,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <GlassmorphismCard
                  onClick={() => navigate(feature.route)}
                  sx={{
                    height: isMobile ? 140 : 160,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    }
                  }}
                  glowColor={`${feature.color}40`}
                >
                  {/* Floating background elements */}
                  <Box
                    component={motion.div}
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 20 + index * 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${feature.color}20, transparent)`,
                      pointerEvents: 'none'
                    }}
                  />

                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography variant="h2" sx={{ mb: 1, fontSize: isMobile ? '2rem' : '2.5rem' }}>
                      {feature.icon}
                    </Typography>
                  </motion.div>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      background: `linear-gradient(45deg, ${feature.color}, ${feature.color}DD)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {feature.label}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: isMobile ? '0.7rem' : '0.75rem',
                      mb: 0.5
                    }}
                  >
                    {feature.description}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.65rem',
                      fontStyle: 'italic',
                      opacity: 0.7
                    }}
                  >
                    {feature.hindiDesc}
                  </Typography>

                  {/* Animated border */}
                  <Box
                    component={motion.div}
                    animate={{
                      boxShadow: [
                        `0 0 0 0 ${feature.color}40`,
                        `0 0 0 4px ${feature.color}20`,
                        `0 0 0 0 ${feature.color}40`
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: `linear-gradient(90deg, ${feature.color}, ${feature.color}80, ${feature.color})`,
                      borderRadius: '1px 1px 20px 20px'
                    }}
                  />
                </GlassmorphismCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Extraordinary Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Box textAlign="center" mt={4} mb={2}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              🇮🇳 Proudly Made for Indian Financial Freedom 🇮🇳
            </Typography>
            <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
              <Chip
                label="₹ INR Currency"
                size="small"
                sx={{
                  background: 'rgba(167,199,231,0.1)',
                  color: '#A7C7E7',
                  border: '1px solid rgba(167,199,231,0.3)'
                }}
              />
              <Chip
                label="🎯 Smart Budgeting"
                size="small"
                sx={{
                  background: 'rgba(181,234,215,0.1)',
                  color: '#B5EAD7',
                  border: '1px solid rgba(181,234,215,0.3)'
                }}
              />
              <Chip
                label="🤖 AI Powered"
                size="small"
                sx={{
                  background: 'rgba(199,206,234,0.1)',
                  color: '#C7CEEA',
                  border: '1px solid rgba(199,206,234,0.3)'
                }}
              />
            </Box>
          </Box>
        </motion.div>
      </Box>
    </ParticleBackground>
  );
};

export default Home;
