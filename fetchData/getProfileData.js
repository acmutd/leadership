import admin from "../firebase/nodeApp";

export const getProfileData = async (
  documentName,
  includeSubCollections = false
) => {
  const db = admin.firestore();
  const doc = await db.collection("officer").doc(documentName).get();

  if (!doc.exists) {
    return null;
  }
  const data = doc.data();
  const ret_value = {
    name: data.name,
    roles: data.role_list,
    email: data?.email ?? null,
    acm_email: data?.acm_email ?? null,
    linkedin: data?.linkedin ?? null,
    accolades: data.accolades ?? [],
    start: data.start.toDate().toDateString(),
    end: data.end.toDate().toDateString(),
    id: doc.id,
  };

  if (includeSubCollections) {
    ret_value.roles =
      (await getRoles(doc.id,)) ??
      ret_value.roles.map((role) => {
        title: role;
      });

    ret_value.accolades =
      (await getAccolades(doc.id,)) ??
      ret_value.accolades.map((accolade) => {
        text: accolade;
      });
  }

  return ret_value;
};

export const getProfileByName = async (name, includeSubCollections = false) => {
  const db = admin.firestore();
  const docs = await db.collection("officer").where("name", "==", name).get();

  if (docs.empty) {
    return null;
  }

  const data = docs.docs[0].data();

  const ret_value = {
    name: data.name,
    roles: data.role_list,
    email: data?.email ?? null,
    acm_email: data?.acm_email ?? null,
    linkedin: data?.linkedin ?? null,
    accolades: data.accolades ?? [],
    start: data.start.toDate().toDateString(),
    end: data.end.toDate().toDateString(),
    id: docs.docs[0].id,
  };

  if (includeSubCollections) {
    ret_value.roles =
      (await getRoles(docs.docs[0].id)) ??
      ret_value.roles.map((role) => {
        title: role;
      });

    ret_value.accolades =
      (await getAccolades(docs.docs[0].id)) ??
      ret_value.accolades.map((accolade) => {
        text: accolade;
      });
  }

  return ret_value;
};

const getRoles = async (documentName) => {
  const db = admin.firestore();
  const docs = await db
    .collection("officer")
    .doc(documentName)
    .collection("roles")
    .get();

  if (docs.empty) {
    return null;
  }

  return docs.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      start: data.start.toDate().toDateString(),
      end: data.end.toDate().toDateString(),
    };
  });
};

const getAccolades = async (documentName) => {
  const db = admin.firestore();
  const docs = await db
    .collection("officer")
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
