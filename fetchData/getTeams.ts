import admin from "../firebase/nodeApp";
const db = admin.firestore();
import { participant } from "./getParticipants";
import { officer, accolade } from "./getOfficers";

export interface team {
  id: string;
  name: string;
  accolades?: string[] | accolade[];
  participants?: participant[];
  officer?: officer;
  director?: officer[];
  tags?: string[];
}

interface totalTeams {
  teams: team[];
  programs: string[];
}

export const getTeams = async (query: string): Promise<totalTeams> => {

  let teams = (await db.collection("total").doc("teams").get()).data() as totalTeams;

  if (query) {

    // check if we have queried for this before
    const res = await db
      .collection("total")
      .doc("teams")
      .collection("rolequery")
      .where("query", "==", query)
      .get();

    // if queried before look up results
    if (!res.empty) {
      teams.teams = res.docs[0].data().teams;
    }
    // else perform the query and save the results for next time
    else {
      const participantList = await queryRole(query);

      await db.collection("total").doc("teams").collection("rolequery").add({
        query: query,
        teams: participantList,
      });

      teams.teams = participantList;
    }
  }

  return teams;
};

const queryRole = async (query: string): Promise<team[]> => {
  const teamList: team[] = [];

  await db
    .collection("teams")
    .where("tags", "array-contains", query)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        teamList.push({
          id: doc.id,
          name: data.name,
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  return teamList;
};
