import { uuidv4 } from '../utils/fivem';
import { ClUtils } from './client';

interface ISettings {
  promiseTimeout: number;
}

interface ISettingsParams {
  promiseTimeout?: number;
}

export default class ClientUtils {
  private _settings: ISettings;
  private _defaultSettings: ISettings = {
    promiseTimeout: 15000,
  };

  constructor(settings?: ISettingsParams) {
    this.setSettings(settings);
  }

  public setSettings(settings: ISettingsParams) {
    this._settings = {
      ...this._defaultSettings,
      ...settings,
    };
  }

  public emitNetPromise<T = any>(eventName: string, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      let hasTimedOut = false;

      setTimeout(() => {
        hasTimedOut = true;
        reject(`${eventName} has timed out after ${this._settings.promiseTimeout} ms`);
      }, this._settings.promiseTimeout);

      // Have to use this as the regular uuid refused to work here for some
      // fun reason
      const uniqId = uuidv4();

      const listenEventName = `${eventName}:${uniqId}`;

      emitNet(eventName, listenEventName, ...args);

      const handleListenEvent = (data: T) => {
        removeEventListener(listenEventName, handleListenEvent);
        if (hasTimedOut) return;
        resolve(data);
      };
      onNet(listenEventName, handleListenEvent);
    });
  }
}

type CallbackFn<T> = (data: T, cb: Function) => void;

/**
 * A wrapper for handling NUI Callbacks
 *  @param event - The event name to listen for
 *  @param callback - The callback function
 */
export const RegisterNuiCB = <T = any>(event: string, callback: CallbackFn<T>) => {
  RegisterNuiCallbackType(event);
  on(`__cfx_nui:${event}`, callback);
};

/**
 * Returns a promise that will be resolved once the client has been loaded.
 */
export const playerLoaded = () => {
  return new Promise<any>((resolve) => {
    const id = setInterval(() => {
      if (global.isPlayerLoaded) resolve(id);
    }, 50);
  }).then((id) => clearInterval(id));
};

/**
 *  Will Register an NUI event listener that will immediately
 *  proxy to a server side event of the same name and wait
 *  for the response.
 *  @param event - The event name to listen for
 */
export const RegisterNuiProxy = (event: string) => {
  RegisterNuiCallbackType(event);
  on(`__cfx_nui:${event}`, async (data: unknown, cb: Function) => {
    if (!global.isPlayerLoaded) await playerLoaded();
    try {
      const res = await ClUtils.emitNetPromise(event, data);
      cb(res);
    } catch (e) {
      console.error('Error encountered while listening to resp. Error:', e);
      cb({ status: 'error' });
    }
  });
};

type MsgpackTypes =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'function'
  | 'object';

type WrapperNetEventCb = <T extends any[]>(...args: T) => void;

/**
 * Wrapped onNet so we can use generic types on return values from server
 * @param event - The event name to listen to
 * @param cb - The callback function to execute
 */
export const onNpwdEvent = (event: string, cb: WrapperNetEventCb) => {
  onNet(event, cb);
};
export const verifyExportArgType = (
  exportName: string,
  passedArg: unknown,
  validTypes: MsgpackTypes[],
): void => {
  const passedArgType = typeof passedArg;

  if (!validTypes.includes(passedArgType))
    throw new Error(
      `Export ${exportName} was called with incorrect argument type (${validTypes.join(
        ', ',
      )}. Passed: ${passedArg}, Type: ${passedArgType})`,
    );
};

export const zoneNameMap = {
  AIRP: 'Los Santos International Airport',
  ALAMO: 'Alamo Sea',
  ALTA: 'Alta',
  ARMYB: 'Fort Zancudo',
  BANHAMC: 'Banham Canyon Dr',
  BANNING: 'Banning',
  BAYTRE: 'Baytree Canyon',
  BEACH: 'Vespucci Beach',
  BHAMCA: 'Banham Canyon',
  BRADP: 'Braddock Pass',
  BRADT: 'Braddock Tunnel',
  BURTON: 'Burton',
  CALAFB: 'Calafia Bridge',
  CANNY: 'Raton Canyon',
  CCREAK: 'Cassidy Creek',
  CHAMH: 'Chamberlain Hills',
  CHIL: 'Vinewood Hills',
  CHU: 'Chumash',
  CMSW: 'Chiliad Mountain State Wilderness',
  CYPRE: 'Cypress Flats',
  DAVIS: 'Davis',
  DELBE: 'Del Perro Beach',
  DELPE: 'Del Perro',
  DELSOL: 'La Puerta',
  DESRT: 'Grand Senora Desert',
  DOWNT: 'Downtown',
  DTVINE: 'Downtown Vinewood',
  EAST_V: 'East Vinewood',
  EBURO: 'El Burro Heights',
  ELGORL: 'El Gordo Lighthouse',
  ELYSIAN: 'Elysian Island',
  GALFISH: 'Galilee',
  GALLI: 'Galileo Park',
  golf: 'GWC and Golfing Society',
  GRAPES: 'Grapeseed',
  GREATC: 'Great Chaparral',
  HARMO: 'Harmony',
  HAWICK: 'Hawick',
  HORS: 'Vinewood Racetrack',
  HUMLAB: 'Humane Labs and Research',
  JAIL: 'Bolingbroke Penitentiary',
  KOREAT: 'Little Seoul',
  LACT: 'Land Act Reservoir',
  LAGO: 'Lago Zancudo',
  LDAM: 'Land Act Dam',
  LEGSQU: 'Legion Square',
  LMESA: 'La Mesa',
  LOSPUER: 'La Puerta',
  MIRR: 'Mirror Park',
  MORN: 'Morningwood',
  MOVIE: 'Richards Majestic',
  MTCHIL: 'Mount Chiliad',
  MTGORDO: 'Mount Gordo',
  MTJOSE: 'Mount Josiah',
  MURRI: 'Murrieta Heights',
  NCHU: 'North Chumash',
  NOOSE: 'N.O.O.S.E',
  OCEANA: 'Pacific Ocean',
  PALCOV: 'Paleto Cove',
  PALETO: 'Paleto Bay',
  PALFOR: 'Paleto Forest',
  PALHIGH: 'Palomino Highlands',
  PALMPOW: 'Palmer-Taylor Power Station',
  PBLUFF: 'Pacific Bluffs',
  PBOX: 'Pillbox Hill',
  PROCOB: 'Procopio Beach',
  RANCHO: 'Rancho',
  RGLEN: 'Richman Glen',
  RICHM: 'Richman',
  ROCKF: 'Rockford Hills',
  RTRAK: 'Redwood Lights Track',
  SanAnd: 'San Andreas',
  SANCHIA: 'San Chianski Mountain Range',
  SANDY: 'Sandy Shores',
  SKID: 'Mission Row',
  SLAB: 'Stab City',
  STAD: 'Maze Bank Arena',
  STRAW: 'Strawberry',
  TATAMO: 'Tataviam Mountains',
  TERMINA: 'Terminal',
  TEXTI: 'Textile City',
  TONGVAH: 'Tongva Hills',
  TONGVAV: 'Tongva Valley',
  VCANA: 'Vespucci Canals',
  VESP: 'Vespucci',
  VINE: 'Vinewood',
  WINDF: 'Ron Alternates Wind Farm',
  WVINE: 'West Vinewood',
  ZANCUDO: 'Zancudo River',
  ZP_ORT: 'Port of South Los Santos',
  ZQ_UAR: 'Davis Quartz',
};
