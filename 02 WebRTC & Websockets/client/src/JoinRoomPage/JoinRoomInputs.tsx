import React from "react";

const Input = ({
  placeholder,
  value,
  changeHandler,
}: {
  placeholder: string;
  value: string;
  changeHandler: (arg0: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element => {
  return (
    <React.Fragment>
      <input value={value} onChange={changeHandler} className="join_room_input" placeholder={placeholder} />
    </React.Fragment>
  );
};

interface Props {
  roomIdValue: string;
  setRoomIdValue: (arg0: string) => void;
  nameValue: string;
  setNameValue: (arg0: string) => void;
  isRoomHost: boolean;
}

const JoinRoomInputs = (props: Props): JSX.Element => {
  const { roomIdValue, setRoomIdValue, nameValue, setNameValue, isRoomHost } = props;

  const handleRoomIdValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomIdValue(event.target.value);
  };

  const handleNameValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(event.target.value);
  };

  return (
    <React.Fragment>
      <div className="join_room_inputs_container">
        {!isRoomHost ? (
          <Input placeholder="Enter meeting ID" value={roomIdValue} changeHandler={handleRoomIdValueChange} />
        ) : null}
        <Input placeholder="Enter your Name" value={nameValue} changeHandler={handleNameValueChange} />
      </div>
    </React.Fragment>
  );
};

export default JoinRoomInputs;
