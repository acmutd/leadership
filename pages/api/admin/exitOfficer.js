import { firestore } from "firebase-admin";
import { getSession } from "next-auth/client";
import admin from "../../../firebase/nodeApp";

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

    const officer = result.docs[0];

    // update end date to current date
    await officer.ref.update({
      end: firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ message: "failure", error: e.message });
  }
}
