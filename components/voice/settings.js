import { createClient, createMicrophoneAndCameraTracks, createMicrophoneAudioTrack } from "agora-rtc-react";

const appId = "dc82e2b2474e4946888bcb1ccf5d01d0";
const token =
  "007eJxTYNgxKY3HYvMuVr5q3WXdAVMTlY6+jvjU/Nb6dUfqtpqsiaYKDCnJFkapRklGJuYmqSaWJmYWFhZJyUmGyclppikGhikGdTsuJTcEMjKUitxjZGSAQBCfhaEktbiEgQEATyogBQ==";

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const useMicrophoneAudioTrack = createMicrophoneAudioTrack();
export const channelName = "test";