import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "dc82e2b2474e4946888bcb1ccf5d01d0";
const token =
  "007eJxTYPCe8HZyi4lq0zprkXc2zfMORM+9Hvft6Ns7Iat/6G1eYlKgwJCSbGGUapRkZGJukmpiaWJmYWGRlJxkmJycZppiYJhiEDBlSXJDICODpsUZZkYGCATxWRhKUotLGBgA4B4hTA==";

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "test";