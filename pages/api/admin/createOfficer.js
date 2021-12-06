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
    const result = await db.collection("officer").add({
      name: req.body.name,
      email: req.body.email,
      acm_email: req.body.acm_email,
      start: firestore.FieldValue.serverTimestamp(),
      end: admin.firestore.Timestamp.fromDate(new Date("June 19, 2021")),
      linkedin: req.body.linkedin,
      role_list: [req.body.role],
    });

    const document_id = result.id;

    // create subcollection document for specific role start and end
    await db.collection("officer").doc(document_id).collection("roles").add({
        title: req.body.role,
        start: firestore.FieldValue.serverTimestamp(),
        end: admin.firestore.Timestamp.fromDate(new Date("June 19, 2021")),
    });

    // add id, name to single document
    await db.collection("total")
      .doc("allinone")
      .update({
        officers: firestore.FieldValue.arrayUnion({
          id: document_id,
          name: req.body.name,
        }),
      });

    res.status(200).json({ message: "success", id: document_id });
  } catch (e) {
    res.status(500).json({ message: "failure", error: e.message });
  }
}