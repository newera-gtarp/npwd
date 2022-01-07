import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';

class _BankService {
  handleGetBalance(reqObj: PromiseRequest<any>, resp: PromiseEventResp<any>) {
    const balance = global.exports['npwd-exports'].getBalance(reqObj.source);

    resp({ status: 'ok', data: balance });
  }
}

const BankService = new _BankService();
export default BankService;
