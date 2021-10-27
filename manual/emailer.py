import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize firebase admin sdk
cred = credentials.Certificate('path-to-acm-core-json')
firebase_admin.initialize_app(cred)

# Initialize firestore
db = firestore.client()

# Read all documents in officer collection
docs = db.collection(u'officer').stream()

# Read name & convert to email in the <first-name>.<last-name>@acmutd.co format
for doc in docs:
    document = doc.to_dict()
    id = doc.id

    full_name = document['name'].lower()

    words = full_name.split(' ')
    acm_email = words[0] + '.'

    for i in range(1, len(words)):
        acm_email = acm_email + words[i]

    acm_email = acm_email + "@acmutd.co"

    db.collection(u'officer').document(id).update({
        'acm_email': acm_email
    })
