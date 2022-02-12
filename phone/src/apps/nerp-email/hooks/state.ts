import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Email, EmailEvents } from '@typings/nerp_emails';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { buildRespObj, isEnvBrowser } from '@utils/misc';
import { BrowserEmailState } from '../utils/constants';

export const emailState = atom<Email[]>({
  key: 'emails',
  default: selector({
    key: 'emailsDefault',
    get: async () => {
      try {
        const resp = await fetchNui<ServerPromiseResp<Email[]>>(
          EmailEvents.FETCH_EMAILS,
          null,
          buildRespObj(BrowserEmailState),
        );
        console.log('EMAILS: ', resp.data);
        return resp.data ?? [];
      } catch (e) {
        if (isEnvBrowser()) return BrowserEmailState;
        console.error(e);
        return [];
      }
    },
  }),
});

export const useSetEmails = () => useSetRecoilState(emailState);
export const useEmails = () => useRecoilState(emailState);
export const useEmailsValue = () => useRecoilValue(emailState);
