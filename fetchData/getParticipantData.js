import admin from "../firebase/nodeApp";

export const getParticipantData = async (documentName, includeSubCollections = false) => {
  const db = admin.firestore();
  const doc = await db.collection("participants").doc(documentName).get();

  if (!doc.exists) {
    return null;
  }

  const ret_value = {
    ...doc.data(),
    accolades: doc.data().accolades ?? [],
    id: doc.id,
  };

  if (includeSubCollections) {
    ret_value.accolades =
      (await getAccolades(doc.id)) ??
      ret_value.accolades.map((accolade) => {
        text: accolade;
      });
  }

  return ret_value;
};

export const getParticipantDataByName = async (name, includeSubCollections = false) => {
  const db = admin.firestore();
  const docs = await db
    .collection("participants")
    .where("name", "==", name)
    .get();

  if (docs.empty) {
    return null;
  }

  const ret_value = {
    ...docs.docs[0].data(),
    accolades: docs.docs[0].data().accolades ?? [],
    id: docs.docs[0].id,
  };

  if (includeSubCollections) {
    ret_value.accolades =
      (await getAccolades(docs.docs[0].id)) ??
      ret_value.accolades.map((accolade) => {
        text: accolade;
      });
  }

  return ret_value;
};

const getAccolades = async (documentName) => {
  const db = admin.firestore();
  const docs = await db
    .collection("participants")
    .doc(documentName)
    .collection("accolades")
    .get();

  if (docs.empty) {
    return null;
  }

  return docs.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      text: data.accolade,
      date: data.date.toDate().toDateString(),
      sender_email: data.sender_email,
      sender_name: data.sender_name,
    };
  });
};
