import firebase, { getFirebaseClient } from "../firebase/clientApp";

/**
 * Fetch image src link from firebase cloud storage
 * @param {string} userId document id for the user profile
 * @returns download url of profile image
 */
export default async function fetchProfileImage(
  userId: string
): Promise<string> {
  // Get default storage bucket
  const storage = (await getFirebaseClient())
    .app()
    .storage("gs://acm-core.appspot.com")
    .ref();

  const profileImage = storage.child("leadership/profile/" + userId + ".jpg");

  let url: string;

  try {
    url = await profileImage.getDownloadURL();
  } catch (error) {
    url = "https://brand.acmutd.co/General/Assets/Logos/favicon.png";
  }

  return url;
}

/**
 * Upload the file to google cloud storage
 * @param {string} userId document id for the user profile
 * @param {File} file profile image file
 */
export async function uploadProfileImage(userId: string, file: File) {
  // Get default storage bucket
  const storage = (await getFirebaseClient())
    .app()
    .storage("gs://acm-core.appspot.com")
    .ref();

  const profileImage = storage.child("leadership/profile/" + userId + ".jpg");

  try {
    await profileImage.put(file);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Delete previous profile image and upload new one to replace it
 * @param {string} userId document id for the user profile
 * @param {File} file profile image to replace the previous one
 */
export async function updateProfileImage(userId: string, file: File) {
  // Get default storage bucket
  const storage = (await getFirebaseClient())
    .app()
    .storage("gs://acm-core.appspot.com")
    .ref();

  const profileImage = storage.child("leadership/profile/" + userId + ".jpg");

  try {
    await profileImage.delete();
    await profileImage.put(file);
  } catch (error) {
    console.log(error);
  }
}
