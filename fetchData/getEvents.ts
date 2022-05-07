import { firestore } from "firebase-admin";
import { getFirebaseAdmin } from "../firebase/nodeApp";
import { officer } from "./getOfficers";

export interface event {
  id: string;
  name: string;
  date_start?: firestore.Timestamp | string;
  date_end?: firestore.Timestamp | string;
  filter?: string[];
  team?: officer[];
  director?: officer;
}

interface totalEvent {
  events: event[];
  filters: string[];
}

interface filterQuery {
  query: string;
  events: event[];
}

export const getEvents = async (query: string | null): Promise<totalEvent> => {

  const db = (await getFirebaseAdmin()).firestore();

  let events = (await db.collection("total").doc("events_leadership").get()).data() as totalEvent;

  if (query) {

    // check if we have queried for this before
    const res = await db
      .collection("total")
      .doc("event_leadership")
      .collection("rolequery")
      .where("query", "==", query)
      .get();

    // if queried before look up results
    if (!res.empty) {
      events.events = (res.docs[0].data() as filterQuery).events;
    }
    // else perform the query and save the results for next time
    else {
      const eventList = await queryRole(query);

      await db.collection("total").doc("events_leadership").collection("rolequery").add({
        query: query,
        events: eventList,
      });

      events.events = eventList;
    }
  }

  return events;
};

const queryRole = async (query: string): Promise<event[]> => {
  const db = (await getFirebaseAdmin()).firestore();

  const eventList: event[] = [];

  await db
    .collection("event_leadership")
    .where("filter", "array-contains", query)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        eventList.push({
          id: doc.id,
          name: data.name,
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  return eventList;
};
