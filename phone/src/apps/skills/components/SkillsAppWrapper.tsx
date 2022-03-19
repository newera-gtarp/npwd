import React from 'react';
import { AppWrapper } from '@ui/components';
import { AppContent } from '@ui/components/AppContent';
import { useApp } from '@os/apps/hooks/useApps';
import { SkillsThemeProvider } from '../providers/SkillsThemeProvider';
import { AppTitle } from '@ui/components/AppTitle';
import { SkillsApp } from './SkillsApp';

// AppContent by default has a React.Suspense which can be used to handle the app as a whole, for
// when it must resolve the render promise. But, we must make sure that this is is mounted in a component
// higher in the tree than the Recoil state caller.

// This is why this wrapper component is needed.
export const SkillsAppWrapper: React.FC = () => {
  const skills = useApp('SKILLS');
  return (
    <SkillsThemeProvider>
      <AppWrapper>
        <AppTitle app={skills} />
        <AppContent>
          <SkillsApp />
        </AppContent>
      </AppWrapper>
    </SkillsThemeProvider>
  );
};
