import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAX_rTy9tOQ9H1XZBDoVcPpJjsBS93_IYI",
  authDomain: "zoom-meet-4637e.firebaseapp.com",
  projectId: "zoom-meet-4637e",
  storageBucket: "zoom-meet-4637e.appspot.com",
  messagingSenderId: "778624482847",
  appId: "1:778624482847:web:476b57e81e6b1166779f2a",
  measurementId: "G-JCD13G1DWZ"
};
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);

export const usersRef = collection(firebaseDB, "users");
export const meetingsRef = collection(firebaseDB, "meetings");
