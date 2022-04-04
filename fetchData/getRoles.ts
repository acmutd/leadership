import { firestore } from "firebase-admin";
import { getFirebaseAdmin } from "../firebase/nodeApp";
import { role } from "./getOfficers";

export interface full_role extends role {
  name: string;
}

export const getRoles = async (): Promise<full_role[]> => {
  const db = (await getFirebaseAdmin()).firestore();

  const res = await db.collectionGroup("roles").get();
  const roles = await Promise.all(
    res.docs.map(async (doc) => {
      const parent = await doc.ref.parent.parent.get();

      const data = doc.data() as role;

      return {
        title: data.title,
        start: (data.start as firestore.Timestamp).toDate().toDateString(),
        end: (data.end as firestore.Timestamp).toDate().toDateString(),
        name: parent.data().name,
      };
    })
  );
  return roles;
};
