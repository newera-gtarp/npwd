export interface Email {
  id: number;
  citizenid: string;
  sender: string;
  subject: string;
  message: string;
  read: boolean;
  date: Date;
  deleted: boolean;
  button?: {
    buttonEvent: string;
    buttonData: any;
    enabled: boolean;
  };
}

export enum EmailEvents {
  SEND_EMAIL = 'nerp:sendEmail',
  FETCH_EMAILS = 'nerp:fetchAllEmail',
  DELETE_EMAIL = 'nerp:deleteEmail',
  MARK_AS_READ = 'nerp:markEmailAsRead',
  BUTTON_PRESSED = 'nerp:emailButtonPressed',
}

export interface EmailDeleteDto {
  id: number;
}

export interface EmailMarkAsReadDto {
  id: number;
}

export interface EmailSendDto {
  citizenId: string;
  sender: string;
  subject: string;
  message: string;
  button?: Email['button'];
}
