import * as firebase from "firebase";
import "firebase/firestore"; // If you need it
import messages from "./messages";
import axios from "axios";

interface anniversary {
  name: string;
  date: Date;
  end?: Date;
  roles?: string[];
}

interface anniversary_count {
  name: string;
  fun_facts: string[];
  count: number;
}

/**
 * Initialize firebase
 * @returns initialized firestore instance
 */
const initializeFirebase = async (): Promise<firebase.firestore.Firestore> => {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };

  firebase.initializeApp(firebaseConfig);

  return firebase.firestore();
};

/**
 * Reads all documents in the officer collection
 * @param db firestore database
 * @returns lists of all officer documents
 */
const readAllDocuments = async (
  db: firebase.firestore.Firestore
): Promise<anniversary[]> => {
  const snapshot = await db.collection("officer").get();

  const documents: anniversary[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    documents.push({
      name: data.name,
      date: data.start.toDate(), // start date
      end: data.end.toDate(), // leave date to check if they are a current officer
      roles: data.role_list,
    });
  });

  return documents;
};

/**
 * Check end date to make sure they are still an officer
 * @param documents all officer documents
 * @returns filtered list of only current officers
 */
const filterCurrentOfficers = (documents: anniversary[]): anniversary[] => {
  return documents.filter((document) => {
    if (document.end.toDateString() === "Sat Jun 19 2021") {
      return true;
    }
    return false;
  });
};

/**
 * Generates a list of fun facts about the officer given their list of roles
 * TODO: Read in all documents from `/officer/<officer-id>/roles` subcollection and generate additional facts from there
 * @param name of the officer
 * @param role_list is the list of roles that they have had
 * @returns an array containing fun facts about the officer
 */
const generateFunFacts = (name: string, role_list: string[]): string[] => {
  const fun_facts: string[] = [];
  if (role_list.length === 1) {
    fun_facts.push(
      `Did you know that ${name} has held ${role_list[0]} for over a year?`
    );
  }
  if (role_list.length > 1) {
    fun_facts.push(
      `Did you know that ${name} joined as a ${
        role_list[0]
      } before becoming a ${role_list[role_list.length - 1]}?`
    );
  }
  if (role_list.length > 2) {
    fun_facts.push(`Did you know that ${name} switched roles more than twice?`);
  }
  if (role_list.length > 3) {
    fun_facts.push(
      `Did you know that ${name} used to be a ${
        role_list[Math.floor(Math.random() * role_list.length - 2) + 1]
      } at one point?`
    );
  }
  if (role_list.length > 4) {
    fun_facts.push(`Did you know that ${name} has had 5+ roles in acm?`);
  }
  return fun_facts;
};

/**
 * Check whether the current date & month match the start date and month
 * @param documents all current officer documents
 * @returns filtered list of officer documents that have an anniversary today
 */
const filterAnniversaries = (documents: anniversary[]): anniversary_count[] => {
  const today = new Date();

  return documents
    .filter((document) => {
      if (
        today.getDate() === document.date.getDate() &&
        today.getMonth() === document.date.getMonth() &&
        today.getFullYear() !== document.date.getFullYear()
      ) {
        return true;
      }
      return false;
    })
    .map((document) => {
      return {
        name: document.name,
        fun_facts: generateFunFacts(document.name, document.roles),
        count: today.getFullYear() - document.date.getFullYear(),
      };
    });
};

/**
 * Post message for each officer that has an anniversary today
 * @param anniversaries names of all people that have an anniversary and their anniversary count
 * @param channel_id #general on slack
 */
const postToSlack = async (
  anniversaries: anniversary_count[],
  channel_id: string = process.env.SLACK_CHANNEL_ID as string
): Promise<void> => {
  for (const anniversary of anniversaries) {
    const payload = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Happy *${anniversary.count} Year* Anniversary ${anniversary.name} :tada:`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: messages[Math.floor(Math.random() * 12)],
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Fun Fact: ${
              anniversary.fun_facts[
                Math.floor(Math.random() * anniversary.fun_facts.length)
              ]
            } Check out more interesting facts at <https://leadership.acmutd.co|ACM Leadership>!`,
          },
        },
      ],
    };
    await axios.post(channel_id, payload);
  }
  process.exit(0);
};

/**
 * Run everything
 */
initializeFirebase()
  .then(readAllDocuments)
  .then(filterCurrentOfficers)
  .then(filterAnniversaries)
  .then(postToSlack)
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
