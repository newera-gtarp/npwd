import React from 'react';
import { BankThemeProvider } from '../providers/BankThemeProvider';
import { AppContent } from '@ui/components/AppContent';
import { AppWrapper } from '@ui/components';
import { AppTitle } from '@ui/components/AppTitle';
import { useApp } from '@os/apps/hooks/useApps';
import Balance from './Balance';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

const BankApp: React.FC = () => {
  const bank = useApp('BANK');

  return (
    <BankThemeProvider>
      <AppWrapper>
        <AppTitle app={bank} />
        <AppContent>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Balance />
          </React.Suspense>
        </AppContent>
      </AppWrapper>
    </BankThemeProvider>
  );
};

export default BankApp;
