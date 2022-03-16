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
    // create new role & append to role array
    await db
      .collection("total")
      .doc("allinone")
      .update({
        role_list: firestore.FieldValue.arrayUnion(req.body.role),
      });

    res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ message: "failure", error: e.message });
  }
}
