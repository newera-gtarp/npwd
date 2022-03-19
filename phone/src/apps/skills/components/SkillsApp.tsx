import React, { useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Stop, PlayArrow } from '@mui/icons-material';
import { useExampleStringValue } from '../hooks/state';
import useSound from '@os/sound/hooks/useSound';
import { useApp } from '@os/apps/hooks/useApps';

export const SkillsApp: React.FC = () => {
  return (
    <Box height="100%" width="100%" p={2} style={{ textAlign: 'center' }}>
      <h1>App coming soon!</h1>
      <p style={{ fontSize: '1.3vw' }}>
        For now, you can choose your skill with the <b>/setskill</b> command.
      </p>
    </Box>
  );
};
