import {
  getStorage,
  ref as stRef,
  uploadBytesResumable,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import { errorCodes } from "@/utils/errors";

const getError = (code, operation, process) => {
  const errorMessage = {
    description: errorCodes.storage[code],
    process: process,
    operation: operation,
    object: "image",
  };
  const objectToString = JSON.stringify(errorMessage);
  return new Error(objectToString);
};

export const loadImage = async (name, path) => {
  const storage = getStorage();
  const pathReference = stRef(storage, `${path}${name}`);
  try {
    const urlImage = await getDownloadURL(pathReference);
    return urlImage;
  } catch (error) {
    throw getError(error.code, "get", "Error loading image!");
  }
};

export const deleteImage = async (image, path) => {
  const storage = getStorage();
  const deleteReference = stRef(storage, `${path}${image}`);
  await deleteObject(deleteReference)
    .then(() => {})
    .catch((error) => {
      throw getError(error.code, "delete", "Error when deleting image!");
    });
};

export const uploadImage = async (image, file, path) => {
  const storage = getStorage();
  const uploadRef = stRef(storage, `${path}${image}`);
  await uploadBytesResumable(uploadRef, file)
    .then(() => {})
    .catch((error) => {
      throw getError(error.code, "upload", "Error uploading image!");
    });
};
