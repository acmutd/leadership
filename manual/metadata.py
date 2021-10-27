# Note: After all the names add the word STOP on the next row in the first column

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import pandas as pd

# Initialize firebase admin sdk
cred = credentials.Certificate('path-to-acm-core-json')
firebase_admin.initialize_app(cred)

# read excel
officer_doc_path = 'path-to-officer-spreadsheet'
df = pd.read_excel(officer_doc_path, header=0)

# Initialize firestore
db = firestore.client()

for index, entry in df.iterrows():
    # Only read until where valid data is present
    if(entry['First Name'] == 'STOP'):
        break

    # search up officer that has the correct first + last name
    query_results = db.collection(u'officer').where(u'name', u'==', entry['First Name'] + " " + entry['Last Name']).get()

    # save linkedin and email fields to variables
    linkedin_url = entry['LinkedIn Profile URL']
    email = entry['Personal Email']

    # Check whether query returned results and if so write to that document
    if (len(query_results) > 0):
        doc_ref = query_results[0]
        db.collection(u'officer').document(doc_ref.id).update({u'linkedin': linkedin_url, u'email': email})
