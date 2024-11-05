import {
  getStorage,
  ref as stRef,
  uploadBytesResumable,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import { errorCodes } from "@/utils/errors";

const storage = getStorage();

const getError = (code, operation, process) => {
  const errorMessage = {
    description: errorCodes.storage[error.code],
    process: process,
    operation: operation,
    object: "image",
  };
  const objectToString = JSON.stringify(errorMessage);
  return new Error(objectToString);
};

export const loadImage = async (name) => {
  const pathReference = stRef(storage, `images/${name}`);
  try {
    const urlImage = await getDownloadURL(pathReference);
    return urlImage;
  } catch (error) {
    throw getError(error.code, "get", "Error loading image!");
  }
};

export const deleteImage = async (image) => {
  const deleteReference = stRef(storage, `images/${image}`);
  await deleteObject(deleteReference)
    .then(() => {})
    .catch((error) => {
      throw getError(error.code, "delete", "Error when deleting image!");
    });
};

export const uploadImage = async (image, file) => {
  const uploadRef = stRef(storage, `images/${image}`);
  await uploadBytesResumable(uploadRef, file)
    .then(() => {})
    .catch((error) => {
      throw getError(error.code, "upload", "Error uploading image!");
    });
};
