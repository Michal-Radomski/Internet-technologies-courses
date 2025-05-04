import React from "react";

const ErrorMessage = ({ errorMessage }: { errorMessage: string }): JSX.Element => {
  return (
    <React.Fragment>
      <div className="error_message_container">
        {errorMessage ? <p className="error_message_paragraph">{errorMessage}</p> : null}
      </div>
    </React.Fragment>
  );
};

export default ErrorMessage;
