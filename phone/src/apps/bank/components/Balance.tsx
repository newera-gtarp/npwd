import React from 'react';
import { Box } from '@mui/material';
import { useBalanceValue } from '../hooks/state';

const Balance: React.FC = () => {
  const balance = useBalanceValue();

  return <Box>{balance}</Box>;
};

export default Balance;
