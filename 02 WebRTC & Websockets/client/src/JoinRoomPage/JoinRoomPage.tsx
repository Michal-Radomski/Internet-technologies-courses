import React from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";

import { setIsRoomHost } from "../redux/actions";
import JoinRoomTitle from "./JoinRoomTitle";
import JoinRoomContent from "./JoinRoomContent";
import "./JoinRoomPage.scss";
import { Dispatch, RootState } from "../Interfaces";

const JoinRoomPage = (props: { setIsRoomHostAction?: (arg0: boolean) => void; isRoomHost?: boolean }): JSX.Element => {
  const { setIsRoomHostAction, isRoomHost } = props;

  const search: string = useLocation().search;

  React.useEffect(() => {
    const isRoomHost = new URLSearchParams(search).get("host") as string;
    if (isRoomHost) {
      setIsRoomHostAction!(true);
    }
  }, [search, setIsRoomHostAction]);

  return (
    <React.Fragment>
      <div className="join_room_page_container">
        <div className="join_room_page_panel">
          <JoinRoomTitle isRoomHost={isRoomHost as boolean} />
          <JoinRoomContent />
        </div>
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
    setIsRoomHostAction: (isRoomHost: boolean) => dispatch(setIsRoomHost(isRoomHost)),
  };
};

export default connect(mapStoreStateToProps, mapActionsToProps)(JoinRoomPage);
