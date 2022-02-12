import PlayerService from '../players/player.service';
import { emailLogger } from './email.utils';
import EmailDb, { _EmailDb } from './email.db';
import { PromiseEventResp, PromiseRequest } from '../lib/PromiseNetEvents/promise.types';
import {
  Email,
  EmailDeleteDto,
  EmailEvents,
  EmailMarkAsReadDto,
  EmailSendDto,
} from '../../../typings/nerp_emails';

class _EmailService {
  private readonly emailDB: _EmailDb;

  constructor() {
    this.emailDB = EmailDb;
    emailLogger.debug('email service started');
  }

  async handleSendEmail(emailData: EmailSendDto): Promise<void> {
    emailLogger.debug('Handling send email, email:');
    emailLogger.debug(emailData);

    try {
      const emailId = await this.emailDB.addEmail(
        emailData.citizenId,
        emailData.sender,
        emailData.subject,
        emailData.message,
        emailData.button,
      );

      const email: Email = {
        id: emailId,
        citizenid: emailData.citizenId,
        sender: emailData.sender,
        subject: emailData.subject,
        message: emailData.message,
        date: new Date(),
        deleted: false,
        read: false,
        button: emailData.button,
      };

      const player = PlayerService.getPlayerFromIdentifier(emailData.citizenId);
      if (player != null) {
        emitNet(EmailEvents.SEND_EMAIL, player.source, email);
      }
    } catch (e) {
      emailLogger.error(`Failed to send email ${e.message}`, {
        citizenid: emailData.citizenId,
      });
    }
  }

  async handleFetchEmails(req: PromiseRequest<void>, resp: PromiseEventResp<Email[]>) {
    const identifier = PlayerService.getIdentifier(req.source);
    try {
      const emails = await this.emailDB.fetchEmails(identifier);

      resp({ data: emails, status: 'ok' });
    } catch (e) {
      emailLogger.error(`Failed to fetch emails, ${e.message}`, {
        source: req.source,
      });
      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }

  async handleDeleteEmail(
    reqObj: PromiseRequest<EmailDeleteDto>,
    resp: PromiseEventResp<void>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    try {
      await this.emailDB.deleteEmail(reqObj.data.id, identifier);

      resp({ status: 'ok' });
    } catch (e) {
      emailLogger.error(`Error in handleDeleteEmail, ${e.message}`);

      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }

  async handleMarkEmailAsRead(
    reqObj: PromiseRequest<EmailMarkAsReadDto>,
    resp: PromiseEventResp<void>,
  ): Promise<void> {
    const identifier = PlayerService.getIdentifier(reqObj.source);
    try {
      await this.emailDB.markEmailAsRead(reqObj.data.id, identifier);

      resp({ status: 'ok' });
    } catch (e) {
      emailLogger.error(`Error in handleMarkEmailAsRead, ${e.message}`);

      resp({ status: 'error', errorMsg: 'GENERIC_DB_ERROR' });
    }
  }
}

const EmailService = new _EmailService();
export default EmailService;
