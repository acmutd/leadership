import admin from "../firebase/nodeApp";
import { participant } from "./getParticipants";
import { accolade } from "./getOfficers";

export const getParticipantData = async (
  documentName: string,
  includeSubCollections = false
): Promise<participant> => {
  const db = admin.firestore();
  const doc = await db.collection("participants").doc(documentName).get();

  if (!doc.exists) {
    return null;
  }

  const ret_value: participant = {
    ...(doc.data() as participant),
    accolades: (doc.data() as participant).accolades ?? [],
    id: doc.id,
  };

  if (includeSubCollections) {
    ret_value.accolades =
      (await getAccolades(doc.id)) ??
      (ret_value.accolades as string[]).map((accolade) => {
        return {
          text: accolade,
        };
      });
  }

  return ret_value;
};

export const getParticipantDataByName = async (
  name: string,
  includeSubCollections = false
): Promise<participant> => {
  const db = admin.firestore();
  const docs = await db
    .collection("participants")
    .where("name", "==", name)
    .get();

  if (docs.empty) {
    return null;
  }

  const ret_value: participant = {
    ...(docs.docs[0].data() as participant),
    accolades: (docs.docs[0].data() as participant).accolades ?? [],
    id: docs.docs[0].id,
  };

  if (includeSubCollections) {
    ret_value.accolades =
      (await getAccolades(docs.docs[0].id)) ??
      (ret_value.accolades as string[]).map((accolade) => {
        return {
          text: accolade,
        };
      });
  }

  return ret_value;
};

const getAccolades = async (documentName: string): Promise<accolade[]> => {
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
