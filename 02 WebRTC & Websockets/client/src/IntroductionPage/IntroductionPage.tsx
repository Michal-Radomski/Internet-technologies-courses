import React from "react";
import { connect } from "react-redux";

import logo from "../resources/images/logo.png";
import ConnectingButtons from "./ConnectingButtons";

import "./IntroductionPage.scss";
import { Dispatch } from "../Interfaces";
import { setIsRoomHost } from "../redux/actions";

const IntroductionPage = ({ setIsRoomHostAction }: { setIsRoomHostAction: (arg0: boolean) => void }): JSX.Element => {
  React.useEffect(() => {
    setIsRoomHostAction(false);
  }, []);

  return (
    <React.Fragment>
      <div className="introduction_page_container">
        <div className="introduction_page_panel">
          <img src={logo} className="introduction_page_image"></img>
          <ConnectingButtons />
        </div>
      </div>
    </React.Fragment>
  );
};

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    setIsRoomHostAction: (isRoomHost: boolean) => dispatch(setIsRoomHost(isRoomHost)),
  };
};

export default connect(null, mapActionsToProps)(IntroductionPage);
