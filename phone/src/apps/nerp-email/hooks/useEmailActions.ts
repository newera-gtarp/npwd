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
        if (state !== 'hasValue') return;
        setEmails((emails) => [
          {
            ...email,
            date: new Date(email.date),
          },
          ...emails,
        ]);
      },
    [setEmails],
  );

  return { addEmail };
};
