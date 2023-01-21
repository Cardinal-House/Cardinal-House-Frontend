import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMoralisAuth } from "@moralisweb3/client-firebase-auth-utils";

const app = initializeApp({
    apiKey: "AIzaSyCparc8fNTAUhsEygb5gILejPSz2p9mL7M",
    authDomain: "cardinal-house-community.firebaseapp.com",
    projectId: "cardinal-house-community",
    storageBucket: "cardinal-house-community.appspot.com",
    messagingSenderId: "713295281156",
    appId: "1:713295281156:web:79f58b90b6725084f24951",
    measurementId: "G-6KRHNW8M7J"
});

const functions = getFunctions(app);
export const auth = getAuth(app);
export const moralisAuth = getMoralisAuth(app, {
    auth,
    functions
});
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export default app;