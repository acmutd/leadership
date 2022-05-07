import { firestore } from "firebase-admin";
import { getFirebaseAdmin } from "../firebase/nodeApp";
import { event } from "./getEvents";

export const getEventData = async (
  documentName: string,
  includeSubCollections = false
): Promise<event> => {
  const db = (await getFirebaseAdmin()).firestore();

  const doc = await db.collection("event_leadership").doc(documentName).get();

  if (!doc.exists) {
    return null;
  }
  const data = doc.data() as event;
  const ret_value = {
    name: data.name,
    filter: data.filter,
    team: data.team ?? [],
    director: data.director,
    date_start: (data.date_start as firestore.Timestamp)
      .toDate()
      .toDateString(),
    date_end: (data.date_end as firestore.Timestamp).toDate().toDateString(),
    id: doc.id,
  };

  return ret_value;
};

export const getEventByName = async (
  name: string,
  includeSubCollections = false
): Promise<event> => {
  const db = (await getFirebaseAdmin()).firestore();

  const docs = await db
    .collection("event_leadership")
    .where("name", "==", name)
    .get();

  if (docs.empty) {
    return null;
  }

  const data = docs.docs[0].data() as event;

  const ret_value = {
    name: data.name,
    filter: data.filter,
    team: data.team ?? [],
    director: data.director,
    date_start: (data.date_start as firestore.Timestamp)
      .toDate()
      .toDateString(),
    date_end: (data.date_end as firestore.Timestamp).toDate().toDateString(),
    id: docs.docs[0].id,
  };

  return ret_value;
};
