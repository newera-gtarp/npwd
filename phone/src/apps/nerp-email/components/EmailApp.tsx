import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppTitle } from '@ui/components/AppTitle';
import { AppContent } from '@ui/components/AppContent';
import { useApp } from '@os/apps/hooks/useApps';
import { Route } from 'react-router-dom';
import { InboxPage } from './views/InboxPage';
import { EmailDetailsPage } from './views/EmailDetailsPage';
import { EmailThemeProvider } from '../providers/EmailThemeProvider';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';
import InjectDebugData from '@os/debug/InjectDebugData';
import { Email, EmailEvents } from '@typings/nerp_emails';

export const EmailApp: React.FC = () => {
  const email = useApp('EMAIL');

  return (
    <EmailThemeProvider>
      <AppWrapper id="email-app">
        <AppTitle app={email} />
        <AppContent paperStyle={{ height: '100%' }}>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Route path="/email" exact component={InboxPage} />
            <Route path="/email/:id" exact component={EmailDetailsPage} />
          </React.Suspense>
        </AppContent>
      </AppWrapper>
    </EmailThemeProvider>
  );
};

InjectDebugData<Email>(
  [
    {
      app: 'EMAIL',
      method: EmailEvents.SEND_EMAIL,
      data: {
        id: 2342345,
        citizenid: '1234',
        date: new Date(),
        deleted: false,
        read: false,
        message: 'Test',
        subject: 'Well hello there',
        sender: 'Obi won',
      },
    },
  ],
  6000,
);
