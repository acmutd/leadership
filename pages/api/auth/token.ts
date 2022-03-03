import jwt from "jsonwebtoken";
import { getSession } from "next-auth/client";
import admin from "../../../firebase/nodeApp";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  const docs = await db
    .collection("officer")
    .where("acm_email", "==", session.user.email)
    .get();

  const private_key = process.env.LEADERSHIP_RSA_PRIVATE_KEY.replace(
    /\\n/gm,
    "\n"
  );

  const payload = {
    name: session.user.name,
    email: session.user.email,
    sub: docs.docs[0].id,
    iss: process.env.NEXTAUTH_URL,
  };

  const token = jwt.sign(payload, private_key, {
    algorithm: "RS256",
    expiresIn: "1d",
  });

  try {
    res.status(200).json({ token: token, message: "success" });
  } catch (e) {
    res.status(500).json({ message: "failure", error: e });
  }
}
