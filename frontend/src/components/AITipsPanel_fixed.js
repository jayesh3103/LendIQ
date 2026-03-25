import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';
import {
  // Replaced Lightbulb with a custom Indian-inspired icon (lotus for wisdom)
  // Note: You'll need to import or define a custom LotusIcon component for full effect
  // For now, using Lightbulb as placeholder; replace with <LotusIcon /> if available
  Lightbulb,
  ExpandMore,
  ExpandLess,
  TrendingUp,
  AccountBalance,
  ShoppingCart,
  Warning,
  // Replaced CheckCircle with a custom peacock icon for success (Indian symbol)
  // Note: Define or import PeacockIcon; using CheckCircle as placeholder
  CheckCircle,
  Refresh,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import * as ApiService from '../services/api';
import { useUser } from '../contexts/UserContext';

const AITipsPanel = ({ expenses = [], budgets = [] }) => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const { userProfile } = useUser();

  // Cache duration: 3 minutes (matching backend cache)
  const CACHE_DURATION = 3 * 60 * 1000; 
  const CACHE_KEY = 'ai_tips_cache';

  const generateFallbackTips = useCallback(() => {
    const fallbackTips = [];
    
    if (expenses.length > 0) {
      const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      // Updated to use ₹ for Indian currency
      fallbackTips.push(`💰 You've spent ₹${totalSpent.toFixed(2)} this month. Like saving for Diwali, track daily to stay mindful of your spending habits.`);
    }
    
    if (budgets.length === 0) {
      fallbackTips.push("🎯 Set up budgets for your main expense categories, inspired by Indian festivals, to get personalized spending insights and recommendations.");
    }
    
    if (expenses.length > 10) {
      fallbackTips.push("📊 With multiple transactions this month, consider categorizing expenses to identify spending patterns and optimization opportunities, just like balancing a traditional Indian household budget.");
    }
    
    return fallbackTips.length > 0 ? fallbackTips : [
      // Changed name to LendIQ
      "💡 Welcome to LendIQ! Start tracking expenses to receive personalized financial insights, tailored for Indian lifestyles."
    ];
  }, [expenses, budgets.length, userProfile.currency]);

  // Cache functions - stable references
  const getCachedTips = useCallback(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { tips: cachedTips, timestamp } = JSON.parse(cached);
        const now = Date.now();
        if (now - timestamp < CACHE_DURATION) {
          console.log('Using cached AI tips');
          return cachedTips;
        }
      }
    } catch (error) {
      console.warn('Error reading cached tips:', error);
    }
    return null;
  }, [CACHE_KEY, CACHE_DURATION]);

  const cacheTips = useCallback((tipsToCache) => {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        tips: tipsToCache,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Error caching tips:', error);
    }
  }, [CACHE_KEY]);

  const fetchTips = useCallback(async () => {
    // Check cache first
    const cachedTips = getCachedTips();
    if (cachedTips) {
      setTips(cachedTips);
      return;
    }
    
    // Prevent multiple simultaneous requests
    if (loading) return;
    
    setLoading(true);
    try {
      console.log('Fetching fresh AI tips from API');
      // Try to get multiple personalized tips
      const multipleTipsResponse = await ApiService.getMultipleTips();
      
      if (multipleTipsResponse && multipleTipsResponse.tips) {
        setTips(multipleTipsResponse.tips);
        cacheTips(multipleTipsResponse.tips);
      } else {
        // Fallback to single tip
        const singleTip = await ApiService.getDailyTip(userProfile.currency);
        const singleTipArray = [singleTip.tip];
        setTips(singleTipArray);
        cacheTips(singleTipArray);
      }
    } catch (error) {
      console.error('Error fetching AI tips:', error);
      // Fallback tips based on current data
      const fallbackTips = generateFallbackTips();
      setTips(fallbackTips);
      cacheTips(fallbackTips);
    } finally {
      setLoading(false);
    }
  }, [loading, userProfile.currency, generateFallbackTips, getCachedTips, cacheTips]);

  const handleManualRefresh = useCallback(async () => {
    // Allow manual refresh - clear cache first
    if (loading) return;
    
    // Clear cache to force fresh fetch
    try {
      sessionStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.warn('Error clearing cache:', error);
    }
    
    setLoading(true);
    try {
      console.log('Manual refresh: fetching fresh AI tips');
      // Try to get multiple personalized tips
      const multipleTipsResponse = await ApiService.getMultipleTips();
      
      if (multipleTipsResponse && multipleTipsResponse.tips) {
        setTips(multipleTipsResponse.tips);
        cacheTips(multipleTipsResponse.tips);
      } else {
        // Fallback to single tip
        const singleTip = await ApiService.getDailyTip(userProfile.currency);
        const singleTipArray = [singleTip.tip];
        setTips(singleTipArray);
        cacheTips(singleTipArray);
      }
    } catch (error) {
      console.error('Error fetching AI tips:', error);
      // Fallback tips based on current data
      const fallbackTips = generateFallbackTips();
      setTips(fallbackTips);
      cacheTips(fallbackTips);
    } finally {
      setLoading(false);
    }
  }, [loading, userProfile.currency, generateFallbackTips, cacheTips, CACHE_KEY]);

  useEffect(() => {
    // Load tips on component mount - use cache if available
    fetchTips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const getTipIcon = (tip) => {
    if (tip.includes('🚨') || tip.includes('Budget Alert') || tip.includes('over budget')) {
      return <Warning color="warning" />;
    } else if (tip.includes('✅') || tip.includes('Great job') || tip.includes('within your limits')) {
      // Replaced with peacock icon for Indian success theme
      return <CheckCircle color="success" />; // Placeholder; use <PeacockIcon /> if defined
    } else if (tip.includes('investment') || tip.includes('ETF') || tip.includes('savings')) {
      return <TrendingUp color="primary" />;
    } else if (tip.includes('budget') || tip.includes('spending')) {
      return <AccountBalance color="info" />;
    } else if (tip.includes('shopping') || tip.includes('purchase')) {
      return <ShoppingCart color="secondary" />;
    }
    // Replaced with lotus icon for Indian wisdom theme
    return <Lightbulb color="primary" />; // Placeholder; use <LotusIcon /> if defined
  };

  const getTipSeverity = (tip) => {
    if (tip.includes('🚨') || tip.includes('Budget Alert') || tip.includes('over budget')) {
      return 'warning';
    } else if (tip.includes('✅') || tip.includes('Great job')) {
      return 'success';
    }
    return 'info';
  };

  const getTipCategory = (tip) => {
    if (tip.includes('budget') || tip.includes('Budget Alert')) return 'Budget';
    if (tip.includes('investment') || tip.includes('ETF') || tip.includes('savings')) return 'Investment';
    if (tip.includes('shopping') || tip.includes('purchase') || tip.includes('meal') || tip.includes('food')) return 'Spending';
    if (tip.includes('tip') || tip.includes('advice')) return 'General';
    return 'Insight';
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 0,
        mb: 3,
        // Updated to pastel gradient with Indian-inspired colors (soft saffron, white, green)
        background: `linear-gradient(135deg, #FFF8E1 0%, #E8F5E8 50%, #F3E5F5 100%)`, // Pastel yellow-green-purple
        border: `1px solid #B2DFDB`, // Soft teal border
        borderRadius: 2,
        // Added Indian font suggestion for headings
        fontFamily: "'Noto Sans Devanagari', sans-serif", // Devanagari-inspired font
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Lotus icon for Indian theme */}
            <Lightbulb sx={{ color: '#FF9800' }} /> {/* Pastel orange for saffron */}
            <Typography variant="h6" color="primary" sx={{ color: '#4CAF50' }}> {/* Pastel green */}
              AI Financial Tips
            </Typography>
            {tips.length > 1 && (
              <Chip 
                label={`${tips.length} tips`} 
                size="small" 
                color="primary" 
                variant="outlined" 
                sx={{ backgroundColor: '#E1F5FE' }} // Pastel blue
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              onClick={handleManualRefresh} 
              size="small" 
              disabled={loading}
              title="Refresh tips"
            >
              {loading ? <CircularProgress size={20} /> : <Refresh />}
            </IconButton>
            {tips.length > 1 && (
              <IconButton 
                onClick={() => setExpanded(!expanded)} 
                size="small"
                title={expanded ? "Show less" : "Show all tips"}
              >
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </Box>
        </Box>

        {loading && tips.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Loading personalized tips...
            </Typography>
          </Box>
        ) : (
          <AnimatePresence>
            {tips.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 100 }} // Enhanced with bounce
              >
                <Alert 
                  severity={getTipSeverity(tips[0])} 
                  icon={getTipIcon(tips[0])}
                  sx={{ 
                    mb: 2,
                    backgroundColor: '#FFF3E0', // Pastel peach
                    '& .MuiAlert-message': {
                      width: '100%'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {tips[0]}
                    </Typography>
                    <Chip 
                      label={getTipCategory(tips[0])} 
                      size="small" 
                      variant="outlined" 
                      sx={{ ml: 1, fontSize: '0.75rem', backgroundColor: '#FCE4EC' }} // Pastel pink
                    />
                  </Box>
                </Alert>

                {expanded && tips.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Divider sx={{ my: 2, backgroundColor: '#B2DFDB' }} /> {/* Pastel teal */}
                    <Typography variant="subtitle2" color="primary" sx={{ mb: 2, color: '#4CAF50' }}>
                      Additional Tips
                    </Typography>
                    {tips.slice(1).map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1, type: 'spring' }} // Staggered with bounce
                      >
                        <Alert 
                          severity={getTipSeverity(tip)} 
                          icon={getTipIcon(tip)}
                          sx={{ 
                            mb: 2,
                            backgroundColor: '#E8F5E8', // Pastel green
                            '& .MuiAlert-message': {
                              width: '100%'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="body2" sx={{ flex: 1 }}>
                              {tip}
                            </Typography>
                            <Chip 
                              label={getTipCategory(tip)} 
                              size="small" 
                              variant="outlined" 
                              sx={{ ml: 1, fontSize: '0.75rem', backgroundColor: '#F3E5F5' }} // Pastel purple
                            />
                          </Box>
                        </Alert>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </CardContent>
    </Paper>
  );
};

export default AITipsPanel;