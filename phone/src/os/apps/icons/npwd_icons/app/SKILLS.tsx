import React from 'react';
import { Psychology } from '@mui/icons-material';

const SkillsIcon: React.FC = () => (
  <div
    style={{
      width: '3.25vw',
      height: '3.25vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'red',
      borderRadius: '50%',
    }}
  >
    <Psychology fontSize="large" />;
  </div>
);

export default SkillsIcon;
