import { firestore } from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from "next-auth/client";
import { getFirebaseAdmin } from "../../../firebase/nodeApp";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(400).json({ message: "Invalid API method specified" });
    return;
  }

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }

  const db = (await getFirebaseAdmin()).firestore();

  try {
    // check if officer is already in the database
    const search = await db.collection("officer").where("acm_email", "==", req.body.acm_email).get();

    // if officer doc already exists then return with error message
    if (!search.empty) {
      res.status(400).json({ message: "failure", error: "officer already exists" });
      return;
    }

    // create root level document for officer
    const result = await db.collection("officer").add({
      name: req.body.name,
      email: req.body.email,
      acm_email: req.body.acm_email,
      start: firestore.FieldValue.serverTimestamp(),
      end: firestore.Timestamp.fromDate(new Date("June 19, 2021")),
      linkedin: req.body.linkedin,
      role_list: [req.body.role],
    });

    const document_id = result.id;

    // create subcollection document for specific role start and end
    await db.collection("officer").doc(document_id).collection("roles").add({
        title: req.body.role,
        start: firestore.FieldValue.serverTimestamp(),
        end: (await getFirebaseAdmin()).firestore.Timestamp.fromDate(new Date("June 19, 2021")),
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
