import axios from 'axios';
import semver from 'semver';
import { messageTemplates } from './msgTemplates';
import { mainLogger } from '../sv_logger';

const GITHUB_USER = 'project-error';
const REPO_NAME = 'npwd';
const DEFAULT_BRANCH = 'feat/gh-513';

const CURRENT_RESOURCE_NAME = GetCurrentResourceName();

const getVersionFromRawManifest = (manifestContent: string) => {
  const rawResults = manifestContent.match(/^[\s]*version.*['"]$/m);
  if (!rawResults || !rawResults[0]) throw new Error('Unable to find parse version in fxmanifest');

  mainLogger.silly('Raw Remote Regex Result:', rawResults);

  // Improve this parsing to be adaptable & maintable for the future
  return rawResults[0].split(' ')[1].replace(/["']/g, '');
};

const getVersionFromMetadata = () => {
  return GetResourceMetadata(CURRENT_RESOURCE_NAME, 'version', 0);
};

interface ManifestFetchResult {
  version?: string;
  error?: Error;
  statusCode?: number;
}

const fetchManifestVersionFromGitHub = async (): Promise<ManifestFetchResult> => {
  try {
    const rawRes = await axios.get<string>(
      `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/${DEFAULT_BRANCH}/fxmanifest.lua`,
      {
        responseType: 'text',
      },
    );

    mainLogger.silly('Ret Text:', rawRes);
    const textConversion = rawRes.data;

    return {
      version: getVersionFromRawManifest(textConversion),
      statusCode: rawRes.status,
    };
  } catch (e: any) {
    return { error: e };
  }
};

const startUpdateCheck = async () => {
  const localVersion = getVersionFromMetadata();
  const {
    version: remoteVersion,
    error,
    statusCode: respStatusCode,
  } = await fetchManifestVersionFromGitHub();

  if (error) {
    return console.log(messageTemplates.genericError(error));
  }

  if (!respStatusCode || !remoteVersion) {
    return console.log(
      messageTemplates.genericError(
        new Error('The version or response status code is undefined after error checks'),
      ),
    );
  }

  mainLogger.silly('Fetched RemoteVer:', remoteVersion);
  mainLogger.silly('Local Ver:', localVersion);

  // This set of conditionals, should handle all the possible returns
  // from GH adequately.

  // Non 200 status code handling
  if (respStatusCode < 200 || respStatusCode > 200) {
    return console.log(messageTemplates.badResponseCode(respStatusCode));
  }

  // Local version is equal to remote
  if (semver.eq(localVersion, remoteVersion)) {
    return console.log(messageTemplates.isUpdated(localVersion));
  }

  // Local version is below remote
  if (semver.lt(localVersion, remoteVersion)) {
    // Non-null assert as we have already confirmed that localVersion < remoteVersion
    const verDiffType = semver.diff(localVersion, remoteVersion)!;

    return console.log(messageTemplates.outOfDate(remoteVersion, localVersion, verDiffType));
  }

  // Local version is ahead of remote
  if (semver.gt(localVersion, remoteVersion)) {
    return console.log(messageTemplates.prerelease(remoteVersion, localVersion));
  }
};

const updateCheckDisabled = GetConvarInt('npwd:disableUpdateCheck', 0) == 1;

on('onResourceStart', async (resName: string) => {
  if (resName !== CURRENT_RESOURCE_NAME) return;

  if (updateCheckDisabled) {
    mainLogger.silly('Update checking disabled by convar');
    return;
  }

  mainLogger.silly('Beginning update check');
  await startUpdateCheck();
});
