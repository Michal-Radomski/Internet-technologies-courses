import React from "react";

const LocalScreenSharingPreview = ({ stream }: { stream: MediaStream }): JSX.Element => {
  const localPreviewRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (localPreviewRef?.current) {
      const video = localPreviewRef.current as HTMLVideoElement;

      video.srcObject = stream;

      video.onloadedmetadata = (): void => {
        video.play();
      };
    }
  }, [stream]);

  return (
    <React.Fragment>
      <div className="local_screen_share_preview">
        <video muted autoPlay ref={localPreviewRef}></video>
      </div>
    </React.Fragment>
  );
};

export default LocalScreenSharingPreview;
