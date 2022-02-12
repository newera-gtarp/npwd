import { mainLogger } from '../sv_logger';

export const emailLogger = mainLogger.child({ module: 'email' });
