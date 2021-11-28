import admin from "../../firebase/nodeApp";
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

  await db
    .collection("officer")
    .doc(req.body.user_id)
    .update({
      accolades: firestore.FieldValue.arrayUnion(req.body.accolade),
    });

  await db
    .collection("officer")
    .doc(req.body.user_id)
    .collection("accolades")
    .add({
      accolade: req.body.accolade,
      sender_name: req.body.sender_name,
      sender_email: req.body.sender_email,
      date: firestore.FieldValue.serverTimestamp(),
    });

  try {
    res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ message: "failure", error: e });
  }
}
