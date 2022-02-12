import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import {
  Email,
  EmailDeleteDto,
  EmailEvents,
  EmailMarkAsReadDto,
  EmailSendDto,
} from '../../../typings/nerp_emails';
import EmailService from './email.service';
import { emailLogger } from './email.utils';
import { getSource } from '../utils/miscUtils';

onNet(EmailEvents.SEND_EMAIL, (emailData: EmailSendDto) => {
  EmailService.handleSendEmail(emailData).catch((e) => {
    const src = getSource();
    emailLogger.error(`Error occurred in send event (${src}), Error: ${e.message}`);
  });
});

onNetPromise<void, Email[]>(EmailEvents.FETCH_EMAILS, async (reqObj, resp) => {
  EmailService.handleFetchEmails(reqObj, resp).catch((e) => {
    emailLogger.error(
      `Error occurred in fetch emails event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<EmailDeleteDto>(EmailEvents.DELETE_EMAIL, async (reqObj, resp) => {
  EmailService.handleDeleteEmail(reqObj, resp).catch((e) => {
    emailLogger.error(
      `Error occurred in delete email event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

onNetPromise<EmailMarkAsReadDto>(EmailEvents.MARK_AS_READ, async (reqObj, resp) => {
  EmailService.handleMarkEmailAsRead(reqObj, resp).catch((e) => {
    emailLogger.error(
      `Error occurred in mark email as read event (${reqObj.source}), Error: ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});
