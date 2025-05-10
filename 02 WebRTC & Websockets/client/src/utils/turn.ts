/* eslint-disable @typescript-eslint/no-explicit-any */
import * as api from "./api";

let TURNIceServers: any = null;

export const fetchTURNCredentials = async (): Promise<any> => {
  const responseData = (await api.getTURNCredentials()) as any;

  if (responseData.token?.iceServers) {
    TURNIceServers = responseData.token.iceServers;
  }

  return TURNIceServers as any;
};

export const getTurnIceServers = (): any => {
  return TURNIceServers;
};
