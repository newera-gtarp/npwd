import {
  CreateMessageBroadcast,
  MessageConversationResponse,
  MessageEvents,
  PreDBMessage,
} from '../../typings/messages';
import { sendMessageEvent } from '../utils/messages';
import { RegisterNuiCB, RegisterNuiProxy, zoneNameMap } from './cl_utils';

RegisterNuiProxy(MessageEvents.FETCH_MESSAGE_CONVERSATIONS);
RegisterNuiProxy(MessageEvents.DELETE_MESSAGE);
RegisterNuiProxy(MessageEvents.FETCH_MESSAGES);
RegisterNuiProxy(MessageEvents.CREATE_MESSAGE_CONVERSATION);
RegisterNuiProxy(MessageEvents.DELETE_CONVERSATION);
RegisterNuiProxy(MessageEvents.SEND_MESSAGE);
RegisterNuiProxy(MessageEvents.SET_MESSAGE_READ);

onNet(MessageEvents.SEND_MESSAGE_SUCCESS, (messageDto: PreDBMessage) => {
  sendMessageEvent(MessageEvents.SEND_MESSAGE_SUCCESS, messageDto);
});

onNet(MessageEvents.CREATE_MESSAGE_BROADCAST, (result: CreateMessageBroadcast) => {
  sendMessageEvent(MessageEvents.CREATE_MESSAGE_BROADCAST, result);
});

onNet(MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS, (result: MessageConversationResponse) => {
  sendMessageEvent(MessageEvents.CREATE_MESSAGE_CONVERSATION_SUCCESS, result);
});

RegisterNuiCB<void>(MessageEvents.GET_CURRENT_LOCATION, async (_, cb) => {
  const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
  const coords = { x, y, z };
  const streetHash = GetStreetNameAtCoord(coords.x, coords.y, coords.z)[0];
  const streetName = streetHash ? GetStreetNameFromHashKey(streetHash) : '';
  const zoneId = GetNameOfZone(coords.x, coords.y, coords.z);
  const zoneName = (zoneNameMap as any)[zoneId] as string;
  cb({
    coords,
    street: streetName,
    zone: zoneName,
  });
});

RegisterNuiCB<{ x: number; y: number; z: number }>(MessageEvents.SET_GPS, async (coords, cb) => {
  SetNewWaypoint(coords.x, coords.y);
  TriggerEvent('QBCore:Notify', 'GPS updated!');
  cb({});
});
