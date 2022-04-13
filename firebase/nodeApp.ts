import * as admin from "firebase-admin";
import getEnv from "../util/env";

export default admin;

export const getFirebaseAdmin = async () => {
  
  // TODO: Find better solution
  let env: Record<string, string>;
  try {
    env = await getEnv();
  } catch (e) {
    console.error("errored out in firebase.ts");
    throw e;
  }

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      databaseURL: env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  }

  return admin.apps[0];
};
