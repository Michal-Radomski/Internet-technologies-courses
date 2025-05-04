import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import JoinRoomInputs from "./JoinRoomInputs";
import OnlyWithAudioCheckbox from "./OnlyWithAudioCheckbox";
import { setConnectOnlyWithAudio, setIdentity, setRoomId } from "../redux/actions";
import ErrorMessage from "./ErrorMessage";
import JoinRoomButtons from "./JoinRoomButtons";
import { getRoomExists } from "../utils/api";
import { Dispatch, RootState } from "../Interfaces";

interface Props {
  isRoomHost?: boolean;
  setConnectOnlyWithAudio?: (arg0: boolean) => void;
  connectOnlyWithAudio?: boolean;
  setIdentityAction?: (arg0: string) => void;
  setRoomIdAction?: (arg0: string) => void;
}

const JoinRoomContent = (props: Props) => {
  const { isRoomHost, setConnectOnlyWithAudio, connectOnlyWithAudio, setIdentityAction, setRoomIdAction } = props;

  const [roomIdValue, setRoomIdValue] = React.useState<string>("");
  const [nameValue, setNameValue] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const history = useHistory();

  const handleJoinRoom = async (): Promise<void> => {
    setIdentityAction!(nameValue);
    if (isRoomHost) {
      createRoom();
    } else {
      await joinRoom();
    }
  };

  const joinRoom = async (): Promise<void> => {
    const responseMessage = await getRoomExists(roomIdValue);

    const { roomExists, full } = responseMessage;

    if (roomExists) {
      if (full) {
        setErrorMessage("Meeting is full. Please try again later.");
      } else {
        // Join a room !
        setRoomIdAction!(roomIdValue);
        history.push("/room");
      }
    } else {
      setErrorMessage("Meeting not found. Check your meeting id.");
    }
  };

  const createRoom = (): void => {
    history.push("/room");
  };

  return (
    <React.Fragment>
      <JoinRoomInputs
        roomIdValue={roomIdValue}
        setRoomIdValue={setRoomIdValue}
        nameValue={nameValue}
        setNameValue={setNameValue}
        isRoomHost={isRoomHost as boolean}
      />
      <OnlyWithAudioCheckbox
        setConnectOnlyWithAudio={setConnectOnlyWithAudio!}
        connectOnlyWithAudio={connectOnlyWithAudio as boolean}
      />
      <ErrorMessage errorMessage={errorMessage as string} />
      <JoinRoomButtons handleJoinRoom={handleJoinRoom} isRoomHost={isRoomHost as boolean} />
    </React.Fragment>
  );
};

const mapStoreStateToProps = (state: RootState) => {
  return {
    ...state,
  };
};

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    setConnectOnlyWithAudio: (onlyWithAudio: boolean) => dispatch(setConnectOnlyWithAudio(onlyWithAudio)),
    setIdentityAction: (identity: string) => dispatch(setIdentity(identity)),
    setRoomIdAction: (roomId: string) => dispatch(setRoomId(roomId)),
  };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(JoinRoomContent);
