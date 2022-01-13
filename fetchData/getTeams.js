import admin from "../firebase/nodeApp";
const db = admin.firestore();

export const getTeams = async (query) => {

  let teams = (await db.collection("total").doc("teams").get()).data();

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

const queryRole = async (query) => {
  const teamList = [];

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
