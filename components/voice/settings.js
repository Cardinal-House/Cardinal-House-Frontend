import { createClient, createMicrophoneAndCameraTracks, createMicrophoneAudioTrack } from "agora-rtc-react";

const appId = "dc82e2b2474e4946888bcb1ccf5d01d0";

export const config = { mode: "rtc", codec: "vp8", appId: appId };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const useMicrophoneAudioTrack = createMicrophoneAudioTrack();
export const channelName = "test";