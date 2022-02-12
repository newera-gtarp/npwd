import { emailState, useSetEmails } from './state';
import { Email } from '@typings/nerp_emails';
import { useRecoilCallback } from 'recoil';

interface EmailActionValues {
  addEmail: (email: Email) => void;
}

export const useEmailActions = (): EmailActionValues => {
  const setEmails = useSetEmails();

  const addEmail = useRecoilCallback(
    ({ snapshot }) =>
      (email: Email) => {
        const { state } = snapshot.getLoadable(emailState);
        console.log('state', state);
        // Make sure our atom is actually loaded before we attempt a dispatch
        if (state !== 'hasValue') return;
        console.log('HAS VALUE DFGSDFG');
        setEmails((emails) => [email, ...emails]);
      },
    [setEmails],
  );

  return { addEmail };
};
