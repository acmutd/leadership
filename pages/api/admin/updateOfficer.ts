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
    // create root level document for officer
    const result = await db
      .collection("officer")
      .where("name", "==", req.body.name)
      .get();
    const officer = result.docs[0];

    await officer.ref.update({
      email: req.body.email,
      acm_email: req.body.acm_email,
      linkedin: req.body.linkedin,
    });

    res.status(200).json({ message: "success", id: officer.id });
  } catch (e) {
    res.status(500).json({ message: "failure", error: e.message });
  }
}
