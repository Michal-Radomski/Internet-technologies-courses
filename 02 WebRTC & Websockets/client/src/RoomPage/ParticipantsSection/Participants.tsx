import React from "react";
import { connect } from "react-redux";

import { setActiveConversation } from "../../redux/actions";
import { Dispatch, Participant, RootState } from "../../Interfaces";

const SingleParticipant = (props: {
  identity: string;
  lastItem: boolean;
  participant: Participant;
  setActiveConversationAction: (arg0: Participant) => void;
  socketId: string;
}): JSX.Element => {
  const { identity, lastItem, participant, setActiveConversationAction, socketId } = props;

  const handleOpenActiveChatbox = (): void => {
    if (participant.socketId !== socketId) {
      setActiveConversationAction(participant);
    }
  };

  return (
    <React.Fragment>
      <p className="participants_paragraph" onClick={handleOpenActiveChatbox}>
        {identity}
      </p>
      {!lastItem ? <span className="participants_separator_line"></span> : null}
    </React.Fragment>
  );
};

const Participants = ({
  participants,
  setActiveConversationAction,
  socketId,
}: {
  participants?: Participant[];
  setActiveConversationAction?: (arg0: Participant) => void;
  socketId?: string;
}): JSX.Element => {
  return (
    <React.Fragment>
      <div className="participants_container">
        {participants?.map((participant: Participant, index: number): JSX.Element => {
          return (
            <SingleParticipant
              key={participant.identity}
              lastItem={participants.length === index + 1}
              participant={participant}
              identity={participant.identity}
              setActiveConversationAction={setActiveConversationAction!}
              socketId={socketId as string}
            />
          );
        })}
      </div>
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
    setActiveConversationAction: (activeConversation: boolean) => dispatch(setActiveConversation(activeConversation)),
  };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(Participants);
