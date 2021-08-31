import admin from '../firebase/nodeApp'

export const getProfileData = async (documentName) => {
  const db = admin.firestore()
  const doc = await db.collection('officer').doc(documentName).get();

  if (!doc.exists) {
    return null
  }
  const data = doc.data();
  return { name: data.name, roles: data.role_list, start: data.start.toDate().toDateString(), end: data.end.toDate().toDateString() }
}
