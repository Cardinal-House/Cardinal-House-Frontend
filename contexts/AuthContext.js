import React, { useContext, useState, useEffect } from "react";
import { auth, moralisAuth, firestore } from "../firebase-vars";
import { GoogleAuthProvider, TwitterAuthProvider, signInWithPopup, 
    signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail,
    updateProfile } from "firebase/auth";
import { signInWithMoralis } from "@moralisweb3/client-firebase-evm-auth";
import { doc, getDoc, setDoc, writeBatch } from "firebase/firestore";

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [currentUserData, setCurrentUserData] = useState({});
  const [settingUpAccount, setSettingUpAccount] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [logoutRequested, setLogoutRequested] = useState(false);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  const signInWithTwitter = () => {
    const provider = new TwitterAuthProvider();
    signInWithPopup(auth, provider);
  }

  const signInMoralis = () => {
    return signInWithMoralis(moralisAuth);
  }

  function logout() {
    if (isConnected) {
      setLogoutRequested(true);
    }
    else {
      return auth.signOut();
    }
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateProfilePicture(profilePictureURL) {
    return updateProfile(currentUser, {photoURL: profilePictureURL});
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  async function updateUserData(field, newFieldValue) {
    const docRef = doc(firestore, "users", currentUser.uid);

    if (field == "username") {
      const docSnap = await getDoc(docRef);
      const batch = writeBatch(firestore);

      const usernameDocRef = doc(firestore, "usernames", newFieldValue);

      batch.set(docRef, { [field]: newFieldValue }, { merge: true });
      batch.set(usernameDocRef, { uid: currentUser.uid });

      if (docSnap.exists() && docSnap.data().username) {
        const oldUsernameDocRef = doc(firestore, "usernames", docSnap.data().username);
        batch.delete(oldUsernameDocRef);
      }

      return batch.commit();
    }
    else {
      return setDoc(docRef, { [field]: newFieldValue }, { merge: true });
    }
  }

  async function getLatestUserData() {
    const docRef = doc(firestore, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setCurrentUserData(docSnap.data());
    } else {
      console.log(`User with UID ${currentUser.uid} not found.`);
      setCurrentUserData({});
      setSettingUpAccount(true);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      getLatestUserData();
    }
  }, [currentUser])

  useEffect(() => {
    if (!isConnected && logoutRequested) {
      setLogoutRequested(false);
      auth.signOut();
      location.reload();
    }
  }, [isConnected])

  const value = {
    currentUser,
    currentUserData,
    getLatestUserData,
    updateUserData,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    signInWithGoogle,
    signInWithTwitter,
    signInMoralis,
    updateProfilePicture,
    settingUpAccount,
    setSettingUpAccount,
    isConnected,
    setIsConnected,
    logoutRequested
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}