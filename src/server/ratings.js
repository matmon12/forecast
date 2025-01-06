import { errorCodes } from "@/utils/errors";
import { db } from "@/server/firebase.config";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  setDoc
} from "firebase/firestore";

const getError = (code) => {
  const errorMessage = `database.${code}`;
  return new Error(errorMessage);
};

export const readToDB = async (query) => {
  try {
    const querySnapshot = await getDocs(query);
    return querySnapshot;
  } catch (e) {
    throw getError(e.code);
  }
};

export const writeToDB = async (newRating) => {
  try {
    const newRef = doc(collection(db, "ratings"));
    await setDoc(newRef, newRating);
    return newRef.id;
  } catch (e) {
    throw getError(e.code);
  }
};

export const updateToDB = async (id, updatedFields) => {
  try {
    await updateDoc(doc(db, "ratings/" + id), updatedFields);
  } catch (e) {
    throw getError(e.code);
  }
};

export const deleteFromDB = async (id) => {
  try {
    deleteDoc(doc(db, "ratings/" + id))
  } catch(e) {
    throw getError(e.code);
  }
}
