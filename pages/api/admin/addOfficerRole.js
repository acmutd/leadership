import admin from "../../../firebase/nodeApp";
import { getSession } from "next-auth/client";
import { firestore } from "firebase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(400).json({ message: "Invalid API method specified" });
    return;
  }

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }

  const db = admin.firestore();

  try {
    // create root level document for officer
    const result = await db
      .collection("officer")
      .where("name", "==", req.body.name)
      .get();

    const officer = result.docs[0];
    const roles = officer.data().role_list;

    // update last role to have ended
    const old_role = roles[roles.length - 1];
    const old_role_docs = await db.collection("officer").doc(officer.id).collection("roles").where("title", "==", old_role).get();
    const old_role_doc = old_role_docs[0];
    old_role_doc.ref.update({
      end: firestore.FieldValue.serverTimestamp(),
    });

    // create new document for new role
    await db.collection("officer").doc(officer.id).collection("roles").add({
      title: req.body.role,
      start: firestore.FieldValue.serverTimestamp(),
      end: admin.firestore.Timestamp.fromDate(new Date("June 19, 2021")),
    });

    // update role list to have new role
    await db.collection("officer").doc(officer.id).update({
      role_list: firestore.FieldValue.arrayUnion(req.body.role),
    });

    res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ message: "failure", error: e.message });
  }
}
