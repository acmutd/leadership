import admin from '../firebase/nodeApp'

export const getAllOfficers = async () => {
  const db = admin.firestore()
  const officers = await db.collection('total').doc('allinone').get();

  if (!officers.exists) {
    return null
  }

  return officers.data().officers;
}
