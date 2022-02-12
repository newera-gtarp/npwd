import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { Email } from '@typings/nerp_emails';
import { useApp } from '@os/apps/hooks/useApps';
import { INotification } from '@os/notifications/providers/NotificationsProvider';
import { useHistory } from 'react-router-dom';

const NOTIFICATION_ID = 'email:new-email';

export const useEmailNotifications = () => {
  const { addNotificationAlert, addNotification } = useNotifications();
  const { icon, notificationIcon } = useApp('EMAIL');

  const history = useHistory();

  const setNotification = (email: Email) => {
    console.log('ADDING EMAIL NOTI');
    const id = `${NOTIFICATION_ID}:${email.id}`;

    const notification: INotification = {
      app: 'EMAIL',
      id,
      sound: true,
      title: 'New email',
      content: email.subject,
      icon,
      notificationIcon,
      onClick: () => history.push(`/email/${email.id}`),
    };

    addNotificationAlert(notification);
    addNotification(notification);
  };

  return { setNotification };
};
