import { getFirebaseAdmin } from "../firebase/nodeApp";
import { accolade } from "./getOfficers";

interface full_accolade extends accolade {
    receiver_name?: string;
    receiver_email?: string;
}

export const getAccolades = async (): Promise<full_accolade[]> => {
    const db = (await getFirebaseAdmin()).firestore();
    
    const res = await db.collectionGroup("accolades").get();
    const accolades = await Promise.all(res.docs.map(async (doc) => {
        const parent = await doc.ref.parent.parent.get();

        return {
            ...doc.data() as accolade,
            receiver_name: parent.data().name,
            receiver_email: parent.data().acm_email,
        };
    }));
    return accolades;
}