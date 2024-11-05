import { errorCodes } from "@/utils/errors";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";

const getError = (error) => {
  let errorMessage = errorCodes.auth[error.code];
  if (!errorMessage)
    errorMessage =
      "An unknown error has occurred. Please try again later. If the problem persists, contact support.";
  return new Error(errorMessage);
};

export const signUp = async (email, password) => {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (e) {
    throw getError(e);
  }
};

export const signIn = async (email, password) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (e) {
    throw getError(e);
  }
};

export const logOut = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
  } catch (e) {
    throw getError(e);
  }
};
