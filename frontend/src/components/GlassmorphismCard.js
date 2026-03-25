import React from 'react';
import { Card, CardContent, Box } from '@mui/material';
import { motion } from 'framer-motion';

const GlassmorphismCard = ({
  children,
  sx = {},
  whileHover = {},
  whileTap = {},
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 0.5 },
  glowColor = 'rgba(167, 199, 231, 0.3)',
  ...props
}) => {
  const defaultHover = {
    scale: 1.02,
    boxShadow: `0 20px 40px ${glowColor}, 0 0 20px ${glowColor}`,
    transition: { duration: 0.3 }
  };

  const defaultTap = {
    scale: 0.98
  };

  return (
    <Card
      component={motion.div}
      initial={initial}
      animate={animate}
      transition={transition}
      whileHover={{ ...defaultHover, ...whileHover }}
      whileTap={{ ...defaultTap, ...whileTap }}
      sx={{
        // Dark glass card: deep translucent surface with subtle border and glow
        background: 'linear-gradient(180deg, rgba(10,12,18,0.85), rgba(14,20,28,0.85))',
        backdropFilter: 'blur(8px) saturate(120%)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        borderRadius: '20px',
        boxShadow: `0 16px 48px rgba(2,8,20,0.7), 0 0 24px ${glowColor}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
        },
        ...sx
      }}
      {...props}
    >
      <CardContent
        sx={{
          position: 'relative',
          zIndex: 1,
          '&:last-child': { pb: 2 },
          color: 'text.primary'
        }}
      >
        {children}
      </CardContent>

      {/* Subtle animated background gradient */}
      <Box
        component={motion.div}
        animate={{
          background: [
            'linear-gradient(45deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00))',
            'linear-gradient(45deg, rgba(255,255,255,0.00), rgba(255,255,255,0.01))',
            'linear-gradient(45deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00))'
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          borderRadius: '20px'
        }}
      />
    </Card>
  );
};

export default GlassmorphismCard;
