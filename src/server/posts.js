import { errorCodes } from "@/utils/errors";
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "@/server/firebase.config";

const getError = (code, operation) => {
  const errorMessage = {
    description: `database.${code}`,
    process: operation,
    operation: operation,
    object: "post",
  };
  const objectToString = JSON.stringify(errorMessage);
  return new Error(objectToString);
};

export const writeToDB = async (id, newPost) => {
  await setDoc(doc(db, "posts/" + id), newPost)
    .then(() => {})
    .catch((error) => {
      throw getError(error.code, "write")
    });
};

export const updateToDB = async (id, updatedFields) => {
  await updateDoc(doc(db, "posts/" + id), updatedFields)
    .then(() => {})
    .catch((error) => {
      throw getError(error.code, "update")
    });
};

export const deleteFromDB = async (id) => {
  await deleteDoc(doc(db, "posts/" + id))
    .then(() => {})
    .catch((error) => {
      throw getError(error.code, "delete")
    });
};

export const readToDB = async (query) => {
  try {
    const querySnapshot = await getDocs(query);
    return querySnapshot;
  } catch (error) {
    throw getError(error.code, "read")
  }
};

export const getDocFromDB = async (id) => {
  try {
    const docRef = doc(db, "posts", id);
    const document = (await getDoc(docRef)).data();
    return document;
  } catch (error) {
    throw getError(error.code, "read")
  }
};
