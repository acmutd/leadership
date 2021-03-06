import { getFirebaseAdmin } from "../firebase/nodeApp";
import { accolade } from "./getOfficers";
import { team } from "./getTeams";
export interface participant {
  id: string;
  name: string;
  email?: string[];
  netid?: string;
  classification?: string;
  major?: string;
  participation?: string[];
  accolades?: string[] | accolade[];
  teams?: team[];
}

interface totalParticipants {
  participants: participant[];
  programs: string[];
}

export const getParticipants = async (query: string): Promise<totalParticipants> => {

  const db = (await getFirebaseAdmin()).firestore();

  let participants = (await db.collection("total").doc("participants").get()).data() as totalParticipants;

  if (query) {

    // check if we have queried for this before
    const res = await db
      .collection("total")
      .doc("participants")
      .collection("rolequery")
      .where("query", "==", query)
      .get();

    // if queried before look up results
    if (!res.empty) {
      participants.participants = res.docs[0].data().participants;
    }
    // else perform the query and save the results for next time
    else {
      const participantList = await queryRole(query);

      await db.collection("total").doc("participants").collection("rolequery").add({
        query: query,
        participants: participantList,
      });

      participants.participants = participantList;
    }
  }

  return participants;
};

const queryRole = async (query: string): Promise<participant[]> => {

  const db = (await getFirebaseAdmin()).firestore();
  
  const participantList: participant[] = [];

  await db
    .collection("participants")
    .where("participation", "array-contains", query)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        participantList.push({
          id: doc.id,
          name: data.name,
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  return participantList;
};
