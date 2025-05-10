import axios, { AxiosResponse } from "axios";

const serverApi: string = "http://localhost:5000/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRoomExists = async (roomId: string): Promise<AxiosResponse<any, any>> => {
  const response = await axios.get(`${serverApi}/room-exists/${roomId}`);
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTURNCredentials = async (): Promise<AxiosResponse<any, any>> => {
  const response = await axios.get(`${serverApi}/get-turn-credentials`);
  return response.data;
};
