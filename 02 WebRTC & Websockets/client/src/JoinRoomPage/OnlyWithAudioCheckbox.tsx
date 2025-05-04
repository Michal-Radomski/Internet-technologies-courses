import React from "react";

import CheckImg from "../resources/images/check.png";

const OnlyWithAudioCheckbox = ({
  connectOnlyWithAudio,
  setConnectOnlyWithAudio,
}: {
  connectOnlyWithAudio: boolean;
  setConnectOnlyWithAudio: (arg0: boolean) => void;
}): JSX.Element => {
  const handleConnectionTypeChange = (): void => {
    setConnectOnlyWithAudio(!connectOnlyWithAudio);
  };

  return (
    <React.Fragment>
      <div className="checkbox_container">
        <div className="checkbox_connection" onClick={handleConnectionTypeChange}>
          {connectOnlyWithAudio ? <img className="checkbox_image" src={CheckImg} /> : null}
        </div>
        <p className="checkbox_container_paragraph">Only audio</p>
      </div>
    </React.Fragment>
  );
};

export default OnlyWithAudioCheckbox;
