import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import pandas as pd

# Initialize firebase admin sdk
cred = credentials.Certificate('path-to-acm-core-json')
firebase_admin.initialize_app(cred)

# read csv
participant_doc_path = 'path-to-teams-csv'
pdf = pd.read_csv(participant_doc_path, header=0)

# Initialize firestore
db = firestore.client()

headers = pdf.columns

teams = {}

# initialize empty list for all teams
for header in headers:
    teams[header] = {
        'name': header,
        'participants': []
    }

for index, entry in pdf.iterrows():

    # save officer name to team object
    if (index == len(pdf)-1):
        for header in headers:
            teams[header]['officer'] = entry[header]

    # save participant names to team object
    else:
        for header in headers:
            if (entry[header] == entry[header]):
                teams[header]['participants'].append(entry[header])


for key, value in teams.items():

    # print(value)

    # set director names manually
    director_name = 'Connie Clark'

    director_name_2 = 'Karan Shukla'

    # find officer and director ids from firestore
    officer_id = db.collection(u'officer').where(u'name', u'==', value['officer']).get()[0].id

    director_id = db.collection(u'officer').where(u'name', u'==', director_name).get()[0].id

    director_id_2 = db.collection(u'officer').where(u'name', u'==', director_name_2).get()[0].id

    participants = []

    # find participant ids from firestore
    for name in value['participants']:

        id = db.collection(u'participants').where(u'name', u'==', name).get()[0].id

        participants.append({
            'id': id,
            'name': name
        })

    # construct team object
    document = {
        'name': value['name'],
        'participants': participants,
        'officer': {
            'id': officer_id,
            'name': value['officer']
        },
        'director': [{
            'id': director_id,
            'name': director_name
        }, {
            'id': director_id_2,
            'name': director_name_2
        }],
        'tags': ['Projects', 'Projects F16-S17', 'F16-S17']
    }

    print(document)

    # save team object to firestore
    # team_doc = db.collection(u'teams').add(document)
    #
    # team_doc_id = team_doc[1].id
    #
    # for participant in participants:
    #
    #     db.collection(u'participants').document(participant['id']).update({
    #         'teams': firestore.ArrayUnion([{
    #             'id': team_doc_id,
    #             'tag': 'Projects F16-S17',
    #             'name': value['name']
    #         }])
    #     })

# create total object containing names and ids
# docs = db.collection(u'teams').stream()
#
# documents = []
#
# for doc in docs:
#     val = doc.to_dict()
#
#     documents.append({
#         'id': doc.id,
#         'name': val['name']
#     })
#
# print(documents)
#
# print(len(documents))
#
# db.collection(u'total').document(u'teams').set({
#     'teams': documents,
#     'programs': ['TIP','Research','Projects','TIP F21','TIP S21','Research F21','Research S21','Research F20','Projects F21','Projects F20','Projects S20','Projects F19','Projects S19','Projects F18','Project S18','Projects F17','Projects F16-S17','F21','S21','F20','S20','F19','S19','F18','S18','F17','F16-S17']
# })