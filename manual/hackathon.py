import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from dateutil import parser
import pprint
import pandas as pd

# Initialize firebase admin sdk
cred = credentials.Certificate('path-to-acm-core-json')
firebase_admin.initialize_app(cred)

# read csv
organizer_doc_path = 'path-to-organizer-spreadsheet'
pdf = pd.read_csv(organizer_doc_path, header=0)

# Initialize firestore
db = firestore.client()

officers = []

# Creates an event document & updates it with all the information about the event
for index, entry in pdf.iterrows():
    print(entry['name'])

    docs = db.collection(u'officer').where(u'name', u'==', entry['name']).get()

    officer_id = ""
    officer_name = ""

    officer = {}

    if len(docs) > 0:
        document = docs[0]

        officer = {
            'id': document.id,
            'name': document.to_dict()['name']
        }
    else:
        officer = {
            'id': "",
            'name': entry['name']
        }

    officers.append(officer)

director_name = 'Harsha Srikara'
director_id = db.collection(u'officer').where(u'name', u'==', director_name).get()[0].id

event_name = 'Hacktoberfest'

event = {
    'name': event_name,
    'team': officers,
    'director': {
        'name': director_name,
        'id': director_id,
    },
    'filter': ['hackathon'],
    'date_start': parser.parse("Oct 17 2020"),
    'date_end': parser.parse("Oct 17 2020"),
}

pprint.pprint(event)

# document = db.collection(u'event_leadership').add(event)
#
# db.collection(u'total').document('events_leadership').update({
#     u'events': firestore.ArrayUnion([{
#         'id': document[1].id,
#         'name': event_name,
#     }])
# })
