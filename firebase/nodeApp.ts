import * as admin from "firebase-admin";
import getEnv from "../util/env";

export default admin;

export const getFirebaseAdmin = async () => {
  const env = await getEnv();

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      databaseURL: env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  }

  return admin;
};
