import Peer from "simple-peer";

import { setShowOverlay } from "../redux/actions";
import { store } from "../redux/store";
import * as wss from "./wss";
import { Participant } from "../Interfaces";

const defaultConstraints = {
  audio: true,
  video: {
    width: "480",
    height: "360",
  },
};

const onlyAudioConstraints = {
  audio: true,
  video: false,
};

let localStream: MediaStream | null = null;
console.log("localStream:", localStream);

export const getLocalPreviewAndInitRoomConnection = async (
  isRoomHost: boolean,
  identity: string,
  roomId: string | null = null,
  onlyAudio: boolean
): Promise<void> => {
  // await fetchTURNCredentials();

  const constraints = onlyAudio ? onlyAudioConstraints : defaultConstraints;

  navigator.mediaDevices
    .getUserMedia(constraints as MediaStreamConstraints)
    .then((stream: MediaStream) => {
      console.log("Successfully received local stream");
      localStream = stream;
      console.log("localStream:", localStream);

      showLocalVideoPreview(localStream);

      // Dispatch an action to hide overlay
      store.dispatch(setShowOverlay(false));

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isRoomHost ? wss.createNewRoom(identity, onlyAudio) : wss.joinRoom(identity, roomId, onlyAudio);
    })
    .catch((err) => {
      console.log("Error occurred when trying to get an access to local stream");
      console.log("err:", err);
    });
};

const peers = {} as { connUserSocketId: Peer.Instance };
let streams = [] as MediaStream[];

const getConfiguration = () => {
  // const turnIceServers = getTurnIceServers();
  const turnIceServers = false;

  if (turnIceServers) {
    return {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
        ...turnIceServers,
      ],
    };
  } else {
    console.warn("Using only STUN server");
    return {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
  }
};

const messengerChannel: string = "messenger";

export const prepareNewPeerConnection = (connUserSocketId: string, isInitiator: boolean): void => {
  const configuration = getConfiguration();
  peers[connUserSocketId as keyof typeof peers] = new Peer({
    initiator: isInitiator,
    config: configuration,
    stream: localStream as MediaStream,
    channelName: messengerChannel,
  });

  peers[connUserSocketId as keyof typeof peers].on("signal", (data) => {
    // WebRTC offer, webRTC Answer (SDP information), ice candidates
    const signalData = {
      signal: data,
      connUserSocketId: connUserSocketId,
    };
    wss.signalPeerData(signalData);
  });

  peers[connUserSocketId as keyof typeof peers].on("stream", (stream: MediaStream): void => {
    console.log("new stream came");
    addStream(stream, connUserSocketId);
    streams = [...streams, stream];
  });

  // peers[connUserSocketId].on("data", (data) => {
  //   const messageData = JSON.parse(data);
  //   appendNewMessage(messageData);
  // });
};

// export const handleSignalingData = (data) => {
//   //add signaling data to peer connection
//   peers[data.connUserSocketId].signal(data.signal);
// };

// export const removePeerConnection = (data) => {
//   const { socketId } = data;
//   const videoContainer = document.getElementById(socketId);
//   const videoEl = document.getElementById(`${socketId}-video`);

//   if (videoContainer && videoEl) {
//     const tracks = videoEl.srcObject.getTracks();

//     tracks.forEach((t) => t.stop());

//     videoEl.srcObject = null;
//     videoContainer.removeChild(videoEl);

//     videoContainer.parentNode.removeChild(videoContainer);

//     if (peers[socketId]) {
//       peers[socketId].destroy();
//     }
//     delete peers[socketId];
//   }
// };

// ////////////////////////////////// UI Videos //////////////////////////////////
const showLocalVideoPreview = (stream: MediaStream): void => {
  const videosContainer = document.getElementById("videos_portal") as HTMLDivElement;
  videosContainer.classList.add("videos_portal_styles");
  const videoContainer = document.createElement("div");
  videoContainer.classList.add("video_track_container");
  const videoElement: HTMLVideoElement = document.createElement("video");
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.srcObject = stream;

  videoElement.onloadedmetadata = (): void => {
    videoElement.play();
  };

  videoContainer.appendChild(videoElement);

  if (store.getState().connectOnlyWithAudio) {
    videoContainer.appendChild(getAudioOnlyLabel());
  }

  videosContainer.appendChild(videoContainer);
};

const addStream = (stream: MediaProvider, connUserSocketId: string): void => {
  // Display incoming stream
  const videosContainer = document.getElementById("videos_portal") as HTMLDivElement;
  const videoContainer = document.createElement("div");
  videoContainer.id = connUserSocketId;

  videoContainer.classList.add("video_track_container");
  const videoElement = document.createElement("video");
  videoElement.autoplay = true;
  videoElement.srcObject = stream;
  videoElement.id = `${connUserSocketId}-video`;

  videoElement.onloadedmetadata = (): void => {
    videoElement.play();
  };

  videoElement.addEventListener("click", () => {
    if (videoElement.classList.contains("full_screen")) {
      videoElement.classList.remove("full_screen");
    } else {
      videoElement.classList.add("full_screen");
    }
  });

  videoContainer.appendChild(videoElement);

  // Check if other user connected only with audio
  const participants = store.getState().participants as Participant[];

  const participant = participants.find((p: Participant) => p.socketId === connUserSocketId) as Participant;
  console.log(participant);
  if (participant?.onlyAudio) {
    videoContainer.appendChild(getAudioOnlyLabel(participant.identity));
  } else {
    videoContainer.style.position = "static";
  }

  videosContainer.appendChild(videoContainer);
};

const getAudioOnlyLabel = (identity = ""): HTMLDivElement => {
  const labelContainer: HTMLDivElement = document.createElement("div");
  labelContainer.classList.add("label_only_audio_container");

  const label: HTMLParagraphElement = document.createElement("p");
  label.classList.add("label_only_audio_text");
  label.innerHTML = `Only audio ${identity}`;

  labelContainer.appendChild(label);
  return labelContainer;
};

// ////////////////////////////////// Buttons logic //////////////////////////////////

// export const toggleMic = (isMuted) => {
//   localStream.getAudioTracks()[0].enabled = isMuted ? true : false;
// };

// export const toggleCamera = (isDisabled) => {
//   localStream.getVideoTracks()[0].enabled = isDisabled ? true : false;
// };

// export const toggleScreenShare = (
//   isScreenSharingActive,
//   screenSharingStream = null
// ) => {
//   if (isScreenSharingActive) {
//     switchVideoTracks(localStream);
//   } else {
//     switchVideoTracks(screenSharingStream);
//   }
// };

// const switchVideoTracks = (stream) => {
//   for (let socket_id in peers) {
//     for (let index in peers[socket_id].streams[0].getTracks()) {
//       for (let index2 in stream.getTracks()) {
//         if (
//           peers[socket_id].streams[0].getTracks()[index].kind ===
//           stream.getTracks()[index2].kind
//         ) {
//           peers[socket_id].replaceTrack(
//             peers[socket_id].streams[0].getTracks()[index],
//             stream.getTracks()[index2],
//             peers[socket_id].streams[0]
//           );
//           break;
//         }
//       }
//     }
//   }
// };

// ////////////////////////////////// Messages /////////////////////////////////////
// const appendNewMessage = (messageData) => {
//   const messages = store.getState().messages;
//   store([...messages, messageData]));
// };

// export const sendMessageUsingDataChannel = (messageContent) => {
//   // append this message locally
//   const identity = store.getState().identity;

//   const localMessageData = {
//     content: messageContent,
//     identity,
//     messageCreatedByMe: true,
//   };

//   appendNewMessage(localMessageData);

//   const messageData = {
//     content: messageContent,
//     identity,
//   };

//   const stringifiedMessageData = JSON.stringify(messageData);
//   for (let socketId in peers) {
//     peers[socketId].send(stringifiedMessageData);
//   }
// };
