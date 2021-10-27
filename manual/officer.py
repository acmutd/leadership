import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize firebase admin sdk
cred = credentials.Certificate('path-to-acm-core-json')
firebase_admin.initialize_app(cred)

# Initialize firestore
db = firestore.client()

# Read all documents
docs = db.collection(u'officer').stream()

# Create an empty array
all = []

# Loop through all documents and create objects with officer document id & name
for doc in docs:
    temp = doc.id
    doc = doc.to_dict()
    all.append({"id": temp, "name": doc["name"]})

# Write back data to firestore
db.collection(u'total').document(u'allinone').set({"officers": all})