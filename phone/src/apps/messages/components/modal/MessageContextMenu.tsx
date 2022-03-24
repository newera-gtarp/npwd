import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import PinDropIcon from '@mui/icons-material/PinDrop';
import { ContextMenu, IContextMenuOption } from '@ui/components/ContextMenu';
import qs from 'qs';
import { useHistory, useLocation } from 'react-router-dom';
import { MessageImageModal } from './MessageImageModal';
import MessageContactModal from './MessageContactModal';
import Backdrop from '@ui/components/Backdrop';
import { MessageConversation, MessageEvents } from '@typings/messages';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import useMessages from '../../hooks/useMessages';
import fetchNui from '@utils/fetchNui';
import { LocationEmbedData } from '../ui/MessageEmbed';

interface MessageCtxMenuProps {
  isOpen: boolean;
  onClose: () => void;
  messageGroup: MessageConversation | undefined;
  image?: string;
}

const MessageContextMenu: React.FC<MessageCtxMenuProps> = ({
  isOpen,
  onClose,
  messageGroup,
  image,
}) => {
  const history = useHistory();
  const [t] = useTranslation();
  const { pathname, search } = useLocation();
  const [imagePreview, setImagePreview] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);

  const { sendEmbedMessage } = useMessageAPI();
  const { activeMessageConversation } = useMessages();

  const modalsVisible = imagePreview || contactModalOpen;

  const menuOptions: IContextMenuOption[] = useMemo(
    () => [
      {
        label: t('MESSAGES.MEDIA_OPTION'),
        icon: <PhotoLibraryIcon />,
        onClick: () =>
          history.push(
            `/camera?${qs.stringify({
              referal: encodeURIComponent(pathname + search),
            })}`,
          ),
      },
      {
        label: t('MESSAGES.CONTACT_OPTION'),
        icon: <ContactPageIcon />,
        onClick: () => setContactModalOpen(true),
      },
      {
        label: 'Share location',
        icon: <PinDropIcon />,
        onClick: async () => {
          try {
            const locationData = await fetchNui<LocationEmbedData>(
              MessageEvents.GET_CURRENT_LOCATION,
            );

            sendEmbedMessage({
              conversationId: messageGroup.id,
              conversationList: activeMessageConversation.conversationList,
              embed: { type: 'location', ...locationData },
              tgtPhoneNumber: messageGroup.participant,
            });
          } catch (error) {
            console.log('Failed to send location', error);
          }

          onClose();
        },
      },
    ],
    [
      history,
      pathname,
      search,
      t,
      onClose,
      fetchNui,
      sendEmbedMessage,
      activeMessageConversation,
      messageGroup,
    ],
  );

  return (
    <>
      <ContextMenu open={isOpen} onClose={onClose} options={menuOptions} />
      {modalsVisible ? <Backdrop /> : undefined}
      <MessageImageModal
        image={image}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        messageGroup={messageGroup}
        onClose={onClose}
      />
      {
        <MessageContactModal
          messageGroup={messageGroup}
          isVisible={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
        />
      }
    </>
  );
};

export default MessageContextMenu;
