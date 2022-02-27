import { getSession } from "next-auth/client";
import admin from "../../firebase/nodeApp";

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

  const profiles = await Promise.all(req.body.names.map(async (name) => {
    const doc = await db.collection("officer").where("name", "==", name).get()
    return {
      ...doc.docs[0].data(),
      id: doc.docs[0].id
    };
  }));

  try {
    res.status(200).json({ message: "success", profiles: profiles });
  } catch (e) {
    res.status(500).json({ message: "failure", error: e });
  }
}
