import admin from "../firebase/nodeApp";

export const getOfficers = async (query) => {
  const db = admin.firestore();

  let officers = (await db.collection("total").doc("allinone").get()).data();
  const officerList = [];

  if (query) {
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
    console.log(officerList);
    officers.officers = officerList;
  }

  return officers;
};
