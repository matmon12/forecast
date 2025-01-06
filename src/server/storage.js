import {
  getStorage,
  ref as stRef,
  uploadBytesResumable,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";

const getError = (code, operation) => {
  const errorMessage = {
    description: `storage.${code}`,
    process: operation,
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
    throw getError(error.code, "get");
  }
};

export const deleteImage = async (image, path) => {
  const storage = getStorage();
  const deleteReference = stRef(storage, `${path}${image}`);
  await deleteObject(deleteReference)
    .then(() => {})
    .catch((error) => {
      throw getError(error.code, "delete");
    });
};

export const uploadImage = async (image, file, path) => {
  const storage = getStorage();
  const uploadRef = stRef(storage, `${path}${image}`);
  await uploadBytesResumable(uploadRef, file)
    .then(() => {})
    .catch((error) => {
      throw getError(error.code, "upload");
    });
};
