import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

export default admin

export const getFirebaseAdmin = (secrets: Record<string, string>) => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: secrets.FIREBASE_CLIENT_EMAIL,
        privateKey: secrets.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      databaseURL: secrets.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    })
  }

  return admin;
}