import firebase from "../firebase/clientApp";

// Get default storage bucket
const storage = firebase.app().storage("gs://acm-core.appspot.com").ref();

export default async function fetchProfileImage(userId) {
  const profileImage = storage.child("leadership/profile/" + userId + ".jpg");

  let url;

  try {
    url = await profileImage.getDownloadURL();
  } catch (error) {
    url = "https://acmutd.co/brand/General/Assets/Logos/favicon.png";
  }

  return url;
}

/**
 * Upload the file to google cloud storage
 * @param {string} userId document id for the user profile
 * @param {File} file profile image file
 */
export async function uploadProfileImage(userId, file) {
  const profileImage = storage.child("leadership/profile/" + userId + ".jpg");

  try {
    await profileImage.put(file);
  } catch (error) {
    console.log(error);
  }
}
