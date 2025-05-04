import axios from "axios";

const serverApi: string = "http://localhost:5000/api";

export const getRoomExists = async (roomId: string): Promise<any> => {
  const response = await axios.get(`${serverApi}/room-exists/${roomId}`);
  return response.data;
};
