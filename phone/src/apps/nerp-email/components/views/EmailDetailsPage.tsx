import { Button, Card, CardActions, CardContent, CardHeader, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MobileScreenShareIcon from '@mui/icons-material/MobileScreenShare';
import { useEmails } from '../../hooks/state';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { EmailEvents } from '@typings/nerp_emails';
import fetchNui from '@utils/fetchNui';

interface EmailDetailsRouteParams {
  id: string;
}

export const EmailDetailsPage: React.FC = () => {
  const [emails] = useEmails();

  const history = useHistory();
  const { id } = useParams<EmailDetailsRouteParams>();

  const email = emails.find((e) => e.id.toString() === id);

  if (email == null) {
    history.push(`/email`);
    return <></>;
  }

  return (
    <Card
      sx={{
        height: '100%',
      }}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
      square
    >
      <CardHeader
        title={email.subject}
        subheader={email.sender}
        avatar={
          <Button onClick={() => history.goBack()}>
            <ArrowBackIcon fontSize="large" />
          </Button>
        }
      />
      <Divider variant="middle" color="lightgray" />
      <CardContent style={{ height: '100%', flexShrink: '1', overflowY: 'auto' }}>
        <div
          dangerouslySetInnerHTML={{
            __html: email.message,
          }}
        ></div>
      </CardContent>
      {email.button && (
        <CardActions>
          <Button
            onClick={() => {
              fetchNui(EmailEvents.BUTTON_PRESSED, email.button);
            }}
            variant="outlined"
            fullWidth
            style={{ margin: '10px 0' }}
          >
            <MobileScreenShareIcon fontSize="medium" />
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
