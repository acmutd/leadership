import { firestore } from "firebase-admin";
import { getFirebaseAdmin } from "../firebase/nodeApp";
import { officer, role, accolade } from "./getOfficers";

export const getProfileData = async (
  documentName: string,
  includeSubCollections = false
): Promise<officer> => {
  const db = (await getFirebaseAdmin()).firestore();

  const doc = await db.collection("officer").doc(documentName).get();

  if (!doc.exists) {
    return null;
  }
  const data = doc.data() as officer;
  const ret_value = {
    name: data.name,
    role_list: data.role_list,
    email: data?.email ?? null,
    acm_email: data?.acm_email ?? null,
    linkedin: data?.linkedin ?? null,
    accolades: data.accolades ?? [],
    teams: data.teams ?? [],
    start: (data.start as firestore.Timestamp).toDate().toDateString(),
    end: (data.end as firestore.Timestamp).toDate().toDateString(),
    id: doc.id,
  };

  if (includeSubCollections) {
    ret_value.role_list =
      (await getRoles(doc.id)) ??
      (ret_value.role_list as string[]).map<role>((role) => {
        return {
          title: role,
        }
      });

    ret_value.accolades =
      (await getAccolades(doc.id)) ??
      (ret_value.accolades as string[]).map<accolade>((accolade) => {
        return {
          text: accolade,
        }
      });
  }

  return ret_value;
};

export const getProfileByName = async (name: string, includeSubCollections = false): Promise<officer> => {
  const db = (await getFirebaseAdmin()).firestore();

  const docs = await db.collection("officer").where("name", "==", name).get();

  if (docs.empty) {
    return null;
  }

  const data = docs.docs[0].data() as officer;

  const ret_value = {
    name: data.name,
    role_list: data.role_list,
    email: data?.email ?? null,
    acm_email: data?.acm_email ?? null,
    linkedin: data?.linkedin ?? null,
    accolades: data.accolades ?? [],
    teams: data.teams ?? [],
    start: (data.start as firestore.Timestamp).toDate().toDateString(),
    end: (data.end as firestore.Timestamp).toDate().toDateString(),
    id: docs.docs[0].id,
  };

  if (includeSubCollections) {
    ret_value.role_list =
      (await getRoles(docs.docs[0].id)) ??
      (ret_value.role_list as string[]).map<role>((role) => {
        return {
          title: role,
        }
      });

    ret_value.accolades =
      (await getAccolades(docs.docs[0].id)) ??
      (ret_value.accolades as string[]).map<accolade>((accolade) => {
        return {
          text: accolade,
        }
      });
  }

  return ret_value;
};

export const getProfileByEmail = async (
  email: string,
  includeSubCollections = false
): Promise<officer> => {
  const db = (await getFirebaseAdmin()).firestore();

  const docs = await db
    .collection("officer")
    .where("acm_email", "==", email)
    .get();

  if (docs.empty) {
    return null;
  }

  const data = docs.docs[0].data() as officer;

  const ret_value = {
    name: data.name,
    role_list: data.role_list,
    email: data?.email ?? null,
    acm_email: data?.acm_email ?? null,
    linkedin: data?.linkedin ?? null,
    accolades: data.accolades ?? [],
    teams: data.teams ?? [],
    start: (data.start as firestore.Timestamp).toDate().toDateString(),
    end: (data.end as firestore.Timestamp).toDate().toDateString(),
    id: docs.docs[0].id,
  };

  if (includeSubCollections) {
    ret_value.role_list =
      (await getRoles(docs.docs[0].id)) ??
      (ret_value.role_list as string[]).map<role>((role) => {
        return {
          title: role,
        }
      });

    ret_value.accolades =
      (await getAccolades(docs.docs[0].id)) ??
      (ret_value.accolades as string[]).map<accolade>((accolade) => {
        return {
          text: accolade,
        }
      });
  }

  return ret_value;
};

const getRoles = async (documentName: string): Promise<role[] | null> => {
  const db = (await getFirebaseAdmin()).firestore();

  const docs = await db
    .collection("officer")
    .doc(documentName)
    .collection("roles")
    .get();

  if (docs.empty) {
    return null;
  }

  return docs.docs.map((doc) => {
    const data = doc.data() as role;
    return {
      id: doc.id,
      title: data.title,
      start: (data.start as firestore.Timestamp).toDate().toDateString(),
      end: (data.end as firestore.Timestamp).toDate().toDateString(),
    };
  });
};

const getAccolades = async (documentName: string): Promise<accolade[] | null> => {
  const db = (await getFirebaseAdmin()).firestore();

  const docs = await db
    .collection("officer")
    .doc(documentName)
    .collection("accolades")
    .get();

  if (docs.empty) {
    return null;
  }

  return docs.docs.map<accolade>((doc) => {
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
