import { useNuiEvent } from 'fivem-nui-react-lib';
import { Email, EmailEvents } from '@typings/nerp_emails';
import { useEmailActions } from './useEmailActions';
import { useCallback } from 'react';
import { useEmailNotifications } from './useEmailNotifications';
import { useRecoilValueLoadable } from 'recoil';
import { emailState } from './state';

export const useEmailService = () => {
  const { addEmail } = useEmailActions();
  const { setNotification } = useEmailNotifications();

  const { state: emailsLoading, contents: emailContent } = useRecoilValueLoadable(emailState);

  const addEmailHandler = useCallback(
    (email: Email) => {
      if (emailsLoading !== 'hasValue') return;
      if (!emailContent) return;
      addEmail(email);
      setNotification(email);
    },
    [addEmail, setNotification, emailsLoading, emailContent],
  );

  useNuiEvent<Email>('EMAIL', EmailEvents.SEND_EMAIL, addEmailHandler);
};
