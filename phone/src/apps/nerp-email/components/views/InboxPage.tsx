import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useEmails } from '../../hooks/state';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { EmailEvents, EmailMarkAsReadDto } from '@typings/nerp_emails';
import fetchNui from '@utils/fetchNui';

export const InboxPage: React.FC = () => {
  const [emails, setEmails] = useEmails();
  const sorted = [...emails].sort((a, b) => {
    return (b.date as any) - (a.date as any);
  });

  const history = useHistory();

  const openEmail = (emailId: number) => {
    history.push(`/email/${emailId}`);
  };

  return (
    <>
      <List>
        {sorted.map((email) => {
          return (
            <ListItem
              key={email.id}
              divider
              disablePadding
              onClick={() => {
                if (!email.read) {
                  fetchNui<void, EmailMarkAsReadDto>(EmailEvents.MARK_AS_READ, {
                    id: email.id,
                  });
                  setEmails((old) => {
                    const filtered = old.filter((e) => e.id !== email.id);
                    return [
                      ...filtered,
                      {
                        ...email,
                        read: true,
                      },
                    ];
                  });
                }
                openEmail(email.id);
              }}
            >
              <ListItemButton>
                <ListItemText
                  primary={email.sender}
                  secondary={email.subject}
                  primaryTypographyProps={{
                    style: {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                  }}
                  secondaryTypographyProps={{
                    style: {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                  }}
                />
                {!email.read && (
                  <ListItemIcon>
                    <CircleIcon htmlColor="#00ceff" fontSize="small" />
                  </ListItemIcon>
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
