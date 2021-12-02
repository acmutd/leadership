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
    // search for document with matching name
    const result = await db
      .collection("officer")
      .where("name", "==", req.body.name)
      .get();

    const officer = result.docs[0].data();

    // add new historian
    await db.collection("total").doc("allinone").update({
      historian: firestore.FieldValue.arrayUnion(officer.acm_email)
    });

    res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ message: "failure", error: e.message });
  }
}
