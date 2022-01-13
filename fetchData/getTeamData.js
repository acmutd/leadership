import admin from "../firebase/nodeApp";

export const getTeamData = async (
  documentName,
  includeSubCollections = false
) => {
  const db = admin.firestore();
  const doc = await db.collection("teams").doc(documentName).get();

  if (!doc.exists) {
    return null;
  }
  const data = doc.data();
  const ret_value = {
    ...data,
    accolades: data.accolades ?? [],
    id: doc.id,
  };

  return ret_value;
};

export const getTeamDataByName = async (name, includeSubCollections = false) => {
  const db = admin.firestore();
  const docs = await db.collection("teams").where("name", "==", name).get();

  if (docs.empty) {
    return null;
  }

  const data = docs.docs[0].data();

  const ret_value = {
    ...data,
    accolades: data.accolades ?? [],
    id: docs.docs[0].id,
  };

  return ret_value;
};
