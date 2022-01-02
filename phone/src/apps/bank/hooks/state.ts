import { atom, selector, useRecoilValue } from 'recoil';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { BankEvents } from '@typings/bank';
import { isEnvBrowser } from '../../../utils/misc';

export const bankState = {
  balance: atom<number>({
    key: 'bankBalance',
    default: selector({
      key: 'defaultBankBalance',
      get: async () => {
        try {
          const resp = await fetchNui<ServerPromiseResp<number>>(BankEvents.FETCH_BALANCE);
          return resp.data;
        } catch (e) {
          if (isEnvBrowser()) {
            return 1000;
          }
          console.error(e);
          return 0;
        }
      },
    }),
  }),
};

export const useBalanceValue = () => useRecoilValue(bankState.balance);
