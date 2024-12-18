import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzn9T1kjS1QUqdMFmEbSWs5m1xuiqjf7M",
  authDomain: "forecast-b003a.firebaseapp.com",
  databaseURL:
    "https://forecast-b003a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "forecast-b003a",
  storageBucket: "forecast-b003a.appspot.com",
  messagingSenderId: "746327068027",
  appId: "1:746327068027:web:fd6812153a3907c3ffc1de",
  storageBucket: "gs://forecast-b003a.appspot.com",
};

export const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);

export const postsRef = collection(db, "posts");
export const ratingsRef = collection(db, "ratings");

export const auth = getAuth(firebaseApp);
