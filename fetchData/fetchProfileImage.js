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
