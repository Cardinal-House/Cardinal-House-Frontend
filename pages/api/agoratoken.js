import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import admin from "firebase-admin";

export default async (req, res) => {
    const agoraAppId = process.env.AGORA_APP_ID;
    const agoraAppCert = process.env.AGORA_APP_CERT;

    const firebaseJson = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replaceAll(/\\n/g, '\n')
    }

    res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.setHeader("Expires", "-1");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const channelName = req.query.channelName;
    if (!channelName) {
        res.json({"success": "false", "error": "Channel name is required."});
        return;
    }

    const uidFull = req.query.uid;

    if (!uidFull.includes("<~>")) {
        res.json({"success": "false", "error": "Invalid UID."});
        return;
    }

    const uid = uidFull.split("<~>")[1];

    try {
        admin.initializeApp({
            credential: admin.credential.cert(firebaseJson)
        });
    }
    catch(error) {
        console.log(error)
    }

    const firestore = admin.firestore();
    const docRef = firestore.doc(`users/${uid}`);
    const user = (await docRef.get()).data();

    if (Object.keys(user).includes("isBanned") && user["isBanned"]) {
        res.json({"success": "false", "error": "You are banned from the Coin Cardinal platform."});
        return;
    }

    let role = RtcRole.SUBSCRIBER;
    if (req.query.role == "publisher") {
        role = RtcRole.PUBLISHER;
    }

    const expireTime = 3600;
    const currentTime = Math.floor(Date.now() / 1000);
    const priviledgeExpireTime = currentTime + expireTime;

    const token = RtcTokenBuilder.buildTokenWithUid(agoraAppId, agoraAppCert, channelName, uidFull, role, priviledgeExpireTime);

    res.json({"success": "true", "token": token});
};