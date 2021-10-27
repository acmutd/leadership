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

unique_roles = {}
unique_roles_array = []

# Loop through all documents
for doc in docs:
    document = doc.to_dict()

    # Save role name to array if it does not already exist
    roles = document['role_list']
    for role in roles:
        if role not in unique_roles:
            unique_roles[role] = True

for key in unique_roles:
    unique_roles_array.append(key)

# Write data back to firestore
db.collection(u'total').document('allinone').set({
    u'role_list': unique_roles_array
}, merge=True)