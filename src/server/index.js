import { errorCodes } from "@/utils/errors";
import { doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/server/firebase.config";

import {
  getStorage,
  ref as stRef,
  uploadBytesResumable,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";

const storage = getStorage();

export const loadImage = async (name) => {
  const pathReference = stRef(storage, `images/${name}`);
  try {
    const urlImage = await getDownloadURL(pathReference);
    return urlImage;
  } catch (error) {
    const errorMessage = {
      description: errorCodes.storage[error.code],
      process: "Error loading image!",
      operation: "get",
      object: "image",
    };
    const objectToString = JSON.stringify(errorMessage);
    throw new Error(objectToString);
  }
};

export const deleteImage = async (image) => {
  const deleteReference = stRef(storage, `images/${image}`);
  await deleteObject(deleteReference)
    .then(() => {})
    .catch((error) => {
      const errorMessage = {
        description: errorCodes.storage[error.code],
        process: "Error when deleting image!",
        operation: "delete",
        object: "image",
      };
      const objectToString = JSON.stringify(errorMessage);
      throw new Error(objectToString);
    });
};

export const uploadImage = async (image, file) => {
  const uploadRef = stRef(storage, `images/${image}`);
  await uploadBytesResumable(uploadRef, file)
    .then(() => {})
    .catch((error) => {
      const errorMessage = {
        description: errorCodes.storage[error.code],
        process: "Error uploading image!",
        operation: "upload",
        object: "image",
      };
      const objectToString = JSON.stringify(errorMessage);
      throw new Error(objectToString);
    });
};

// export const writeToDB = async (id, newPost) => {
//   await set(dbRef(db, "posts/" + id), newPost)
//     .then(() => {})
//     .catch((error) => {
//       const errorMessage = {
//         description: errorCodes.database[error.code],
//         process: "Error saving data!",
//         operation: "write",
//         object: "post",
//       };
//       const objectToString = JSON.stringify(errorMessage);
//       throw new Error(objectToString);
//     });
// };

export const writeToDB = async (id, newPost) => {
  await setDoc(doc(db, "posts/" + id), newPost)
    .then(() => {})
    .catch((error) => {
      console.log(error.code)
      const errorMessage = {
        description: errorCodes.database[error.code],
        process: "Error saving data!",
        operation: "write",
        object: "post",
      };
      const objectToString = JSON.stringify(errorMessage);
      throw new Error(objectToString);
    });
};

// export const updateToDB = async (id, updatedPost) => {
//   const updates = {};
//   updates["posts/" + id] = updatedPost;
//   await update(dbRef(db), updates)
//     .then(() => {})
//     .catch((error) => {
//       const errorMessage = {
//         description: errorCodes.database[error.code],
//         process: "Error updating data!",
//         operation: "update",
//         object: "post",
//       };
//       const objectToString = JSON.stringify(errorMessage);
//       throw new Error(objectToString);
//     });
// };

export const updateToDB = async (id, updatedFields) => {
  await updateDoc(doc(db, "posts/" + id), updatedFields)
    .then(() => {})
    .catch((error) => {
      const errorMessage = {
        description: errorCodes.database[error.code],
        process: "Error updating data!",
        operation: "update",
        object: "post",
      };
      const objectToString = JSON.stringify(errorMessage);
      throw new Error(objectToString);
    });
};

// export const deleteFromDB = async (id) => {
//   await remove(dbRef(db, "posts/" + id))
//     .then(() => {})
//     .catch((error) => {
//       const errorMessage = {
//         description: errorCodes.database[error.code],
//         process: "Error when deleting data!",
//         operation: "delete",
//         object: "post",
//       };
//       const objectToString = JSON.stringify(errorMessage);
//       throw new Error(objectToString);
//     });
// };

export const deleteFromDB = async (id) => {
  await deleteDoc(doc(db, "posts/" + id))
    .then(() => {})
    .catch((error) => {
      const errorMessage = {
        description: errorCodes.database[error.code],
        process: "Error when deleting data!",
        operation: "delete",
        object: "post",
      };
      const objectToString = JSON.stringify(errorMessage);
      throw new Error(objectToString);
    });
};
