import { firestore } from "firebase-admin";
import { getFirebaseAdmin } from "../firebase/nodeApp";
import { team } from "./getTeams";
import { event } from "./getEvents";
export interface officer {
  id: string;
  name: string;
  email?: string;
  start?: firestore.Timestamp | string;
  end?: firestore.Timestamp | string;
  acm_email?: string;
  linkedin?: string;
  teams?: team[];
  events?: event[];
  role_list?: role[] | string[];
  accolades?: accolade[] | string[];
}

export interface role {
  id?: string;
  title: string;
  start?: firestore.Timestamp | string;
  end?: firestore.Timestamp | string;
}

export interface accolade {
  id?: string;
  text: string;
  date?: firestore.Timestamp | string;
  sender_email?: string;
  sender_name?: string;
}

interface totalOfficer {
  officers: officer[];
  role_list: string[];
  historian: string[];
}

interface roleQuery {
  query: string;
  officers: officer[];
}

export const getOfficers = async (query: string | null): Promise<totalOfficer> => {

  const db = (await getFirebaseAdmin()).firestore();

  let officers = (await db.collection("total").doc("allinone").get()).data() as totalOfficer;

  if (query) {

    // check if we have queried for this before
    const res = await db
      .collection("total")
      .doc("allinone")
      .collection("rolequery")
      .where("query", "==", query)
      .get();

    // if queried before look up results
    if (!res.empty) {
      officers.officers = (res.docs[0].data() as roleQuery).officers;
    }
    // else perform the query and save the results for next time
    else {
      const officerList = await queryRole(query);

      await db.collection("total").doc("allinone").collection("rolequery").add({
        query: query,
        officers: officerList,
      });

      officers.officers = officerList;
    }
  }

  return officers;
};

const queryRole = async (query: string): Promise<officer[]> => {
  const db = (await getFirebaseAdmin()).firestore();

  const officerList: officer[] = [];

  await db
    .collection("officer")
    .where("role_list", "array-contains", query)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        officerList.push({
          id: doc.id,
          name: data.name,
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  return officerList;
};
