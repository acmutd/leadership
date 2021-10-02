import admin from "../firebase/nodeApp";
const db = admin.firestore();

export const getOfficers = async (query) => {

  let officers = (await db.collection("total").doc("allinone").get()).data();

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
      officers.officers = res.docs[0].data().officers;
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

const queryRole = async (query) => {
  const officerList = [];

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
