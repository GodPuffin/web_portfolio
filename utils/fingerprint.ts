import * as FingerprintJS from "@fingerprintjs/fingerprintjs";

let fpPromise: Promise<FingerprintJS.Agent> | null = null;
let cachedDeviceId: string | null = null;

export const getFingerprint = () => {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }
  return fpPromise;
};

export const generateDeviceId = async (): Promise<string> => {
  if (cachedDeviceId) {
    return cachedDeviceId;
  }

  const fp = await getFingerprint();
  const result = await fp.get();
  cachedDeviceId = result.visitorId;
  return cachedDeviceId;
};
