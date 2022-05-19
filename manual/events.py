import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize firebase admin sdk
cred = credentials.Certificate('path-to-acm-core-json')
firebase_admin.initialize_app(cred)

# Initialize firestore
db = firestore.client()

docs = db.collection(u'event_leadership').stream()

# This script will run through the list of all events & update the officer document for each organizer with the names of events they have organized
for doc in docs:
    document = doc.to_dict()

    print(document)
    print(doc.id)

    for organizer in document['team']:
        if organizer['id'] != '':
            print(organizer['name'])

            db.collection(u'officer').document(organizer['id']).update({
                u'events': firestore.ArrayUnion([{
                    u'name': document['name'],
                    u'id': doc.id
                }])
            })

    db.collection(u'officer').document(document['director']['id']).update({
        u'events': firestore.ArrayUnion([{
            u'name': document['name'],
            u'id': doc.id
        }])
    })
