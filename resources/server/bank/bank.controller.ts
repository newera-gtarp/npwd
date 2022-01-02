import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import { BankEvents } from '../../../typings/bank';

onNetPromise<void, number>(BankEvents.FETCH_BALANCE, (reqObj, resp) => {});
