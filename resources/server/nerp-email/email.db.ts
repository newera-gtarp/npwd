import { ResultSetHeader } from 'mysql2';
import DbInterface from '../db/db_wrapper';
import { Email } from '../../../typings/nerp_emails';

export class _EmailDb {
  async addEmail(
    citizenId: string,
    sender: string,
    subject: string,
    message: string,
    button?: Email['button'],
  ): Promise<number> {
    const query = `
        INSERT INTO player_mails 
            (citizenid, sender, subject, message, date, button) 
        VALUES 
            (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await DbInterface._rawExec(query, [
      citizenId,
      sender,
      subject,
      message,
      new Date(),
      button ? JSON.stringify(button) : null,
    ]);

    const resultCast = result as ResultSetHeader;

    return resultCast.insertId;
  }

  async fetchEmails(citizenId: string): Promise<Email[]> {
    const query =
      'SELECT * FROM player_mails WHERE citizenid = ? AND deleted = 0 ORDER BY date DESC';
    const [results] = await DbInterface._rawExec(query, [citizenId]);
    const emails = results as Email[];
    return emails.map((e) => ({
      ...e,
      date: new Date(e.date).toISOString() as any,
      button: e.button ? JSON.parse(e.button as any) : null,
    }));
  }

  async deleteEmail(emailId: number, citizenId: string): Promise<void> {
    const query = 'UPDATE player_mails SET `deleted` = 1 WHERE id = ? AND citizenid = ?';
    await DbInterface._rawExec(query, [emailId, citizenId]);
  }

  async markEmailAsRead(emailId: number, citizenId: string): Promise<void> {
    const query = 'UPDATE player_mails SET `read` = 1 WHERE id = ? AND citizenid = ?';
    await DbInterface._rawExec(query, [emailId, citizenId]);
  }
}

const EmailDb = new _EmailDb();

export default EmailDb;
