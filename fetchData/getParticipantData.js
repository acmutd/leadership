import admin from "../firebase/nodeApp";

export const getParticipantData = async (
  documentName
) => {
  const db = admin.firestore();
  const doc = await db.collection("participants").doc(documentName).get();

  if (!doc.exists) {
    return null;
  }

  return {
    ...doc.data(),
    id: doc.id,
  }
};

export const getParticipantDataByName = async (name) => {
  const db = admin.firestore();
  const docs = await db.collection("participants").where("name", "==", name).get();

  if (docs.empty) {
    return null;
  }

  return {
    ...docs.docs[0].data(),
    id: docs.docs[0].id,
  }
};
