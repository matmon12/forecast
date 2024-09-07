export const errorCodes = {
  database: {
    "permission-denied": "You do not have permission to access the document or collection.",
    "not-found": "The document or collection was not found.",
    "invalid-argument": "One or more arguments in the request are invalid.",
    "aborted": "The operation was aborted, often due to a conflict.",
    "unauthenticated": "Authentication is required to perform the operation.",
    "out-of-range": "The value is outside the allowed range.",
    "failed-precondition": "The operation cannot be performed due to the current state of the system."
  },
  storage: {
    "storage/retry-limit-exceeded":
      "The maximum time limit on an operation has been excceded. Try uploading again.",
    "storage/unauthorized":
      "User is not authorized to perform the desired action, check your security rules to ensure they are correct.",
    "storage/canceled": "User canceled the operation.",
    "storage/unknown": "An unknown error occurred.",
    "storage/object-not-found": "No object exists at the desired reference.",
  },
};
