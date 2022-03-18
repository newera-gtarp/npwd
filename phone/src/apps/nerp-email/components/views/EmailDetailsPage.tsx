import { Button, Card, CardActions, CardContent, CardHeader, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MobileScreenShareIcon from '@mui/icons-material/MobileScreenShare';
import { useEmails } from '../../hooks/state';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { EmailDeleteDto, EmailEvents } from '@typings/nerp_emails';
import fetchNui from '@utils/fetchNui';
import { Delete } from '@mui/icons-material';
import DialogForm from '@ui/components/DialogForm';

interface EmailDetailsRouteParams {
  id: string;
}

export const EmailDetailsPage: React.FC = () => {
  const [emails, setEmails] = useEmails();

  const history = useHistory();
  const { id } = useParams<EmailDetailsRouteParams>();

  const email = emails.find((e) => e.id.toString() === id);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const deleteEmail = () => {
    setEmails((old) => {
      return old.filter((e) => e.id !== email.id);
    });

    fetchNui<void, EmailDeleteDto>(EmailEvents.DELETE_EMAIL, {
      id: email.id,
    }).catch((error) => {
      console.log('Failed to delete email', error);
    });

    history.goBack();
  };

  if (email == null) {
    history.push(`/email`);
    return <></>;
  }

  return (
    <>
      <DialogForm
        open={showDeleteConfirmation}
        handleClose={() => setShowDeleteConfirmation(false)}
        onSubmit={() => {
          deleteEmail();
        }}
        title={'Delete Email'}
        content={'Are you sure you want to delete this email?'}
      >
        <span></span>
      </DialogForm>
      <Card
        sx={{
          height: '100%',
        }}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#1b1b1b',
        }}
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
        <CardActions>
          {email.button && (
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
          )}
          <Button
            onClick={() => {
              setShowDeleteConfirmation(true);
            }}
            variant="outlined"
            color="error"
            fullWidth
            style={{ margin: '10px 0' }}
          >
            <Delete fontSize="medium" />
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
