import { errorCodes } from "@/utils/errors";
import { db } from "@/server/firebase.config";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const getError = (code, operation, process) => {
  const messageError = {
    description: errorCodes.database[code],
    process: process,
    operation: operation,
    object: "user",
  };
  const objectToString = JSON.stringify(messageError);
  return new Error(objectToString);
};

export const writeToDB = async (uid, user) => {
  try {
    await setDoc(doc(db, "users/" + uid), user);
  } catch (e) {
    throw getError(e.code, "write", "Error saving data!");
  }
};

export const updateToDB = async (uid, updatedFields) => {
  try {
    await updateDoc(doc(db, "users/" + uid), updatedFields);
  } catch (e) {
    throw getError(e.code, "update", "Error updating data!");
  }
};

export const getDocFromDB = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const document = (await getDoc(docRef)).data();
    return document;
  } catch (e) {
    throw getError(e.code, "read", "Error reading data!");
  }
};
