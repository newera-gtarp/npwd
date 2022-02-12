import { RegisterNuiCB, RegisterNuiProxy } from './cl_utils';
import { Email, EmailEvents } from '../../typings/nerp_emails';
import { sendEmailEvent } from '../utils/messages';

RegisterNuiProxy(EmailEvents.FETCH_EMAILS);
RegisterNuiProxy(EmailEvents.DELETE_EMAIL);
RegisterNuiProxy(EmailEvents.MARK_AS_READ);

onNet(EmailEvents.SEND_EMAIL, (email: Email) => {
  sendEmailEvent(EmailEvents.SEND_EMAIL, email);
});

RegisterNuiCB<Email['button']>(EmailEvents.BUTTON_PRESSED, async (button, cb) => {
  if (button?.enabled) {
    emit(button.buttonEvent, button.buttonData);
  }
  cb();
});
