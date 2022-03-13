import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import pandas as pd

# Initialize firebase admin sdk
cred = credentials.Certificate('path-to-acm-core-json')
firebase_admin.initialize_app(cred)

# read csv that contains list of participant names & their email addresses
participant_doc_path = 'path-to-participants-csv'
pdf = pd.read_csv(participant_doc_path, header=0)

# read csv that contains list of all applicants and their metadata information (export from typeform)
applicant_doc_path = 'path-to-applicants-csv'
adf = pd.read_csv(applicant_doc_path, header=0)

# Initialize firestore
db = firestore.client()

# find netid for given participant name in applicant csv. Return xxx000000 if not found
def find_netid(name: str):
    for index, entry in adf.iterrows():

        full_name = entry['first'] + " " + entry['last']
        # full_name = entry['name']

        if (full_name == name):
            if ('utdallas' in entry['email']):
                return entry['email'].split('@')[0].lower()
    return 'xxx000000'

# find all emails for given participant name in applicant csv. Return empty list if not found
def find_emails(name: str):
    for index, entry in adf.iterrows():
        full_name = entry['first'] + " " + entry['last']
        # full_name = entry['name']

        if (full_name == name):
            return [entry['email'].lower()]
    return []

# find classification for given participant name in applicant csv. Return unknown if not found
def find_classification(name: str):
    for index, entry in adf.iterrows():
        full_name = entry['first'] + " " + entry['last']
        # full_name = entry['name']

        if (full_name == name):
            return entry['classification']
    return 'unknown'

# find major for given participant name in applicant csv. Return unknown if not founnd
def find_major(name: str):
    for index, entry in adf.iterrows():
        full_name = entry['first'] + " " + entry['last']
        # full_name = entry['name']

        if (full_name == name):
            return entry['major']
    return 'unknown'


participants = []

# iterate through all participants in participant csv
for index, entry in pdf.iterrows():

    netid = 'xxx.000000'

    # if netid email was collected for all applicants then use it to find netid
    # if ('utdallas' in entry['netid_email']):
    #     netid = entry['email'].split('@')[0].lower()

    # if people had an email like harsha.srikara@utdalls.edu then discard previous entry and check in applicant csv
    if '.' in netid:
        netid = find_netid(entry['name'])

    if '.' in netid:
        netid = 'xxx000000'

    # create student object
    student = {
        'name': entry['name'],
        'email': find_emails(entry['name']),
        'netid': netid,
        'classification': find_classification(entry['name']),
        'major': find_major(entry['name']),
        'participation': ['Projects F16-S17', 'Projects']
    }

    emails = find_emails(entry['name'])

    for email in emails:
        if email not in student['email']:
            student['email'].append(email)

    participants.append(student)

index = 0

# save all student objects to db
for participant in participants:
    print(str(index + 1) + ". ", end='')
    index = index + 1
    print(participant)

    docs = db.collection(u'participants').where(
        u'name', u'==', participant['name']).get()

    if (len(docs) == 0):
        print("unique")
        # db.collection(u'participants').add(participant)
    else:
        print("match found")
        # db.collection(u'participants').document(docs[0].id).update({
        #     u'participation': firestore.ArrayUnion(['Projects F16-S17','Projects']),
        #     u'email': firestore.ArrayUnion(participant['email'])
        # })

# create total document that containts names and ids
# docs = db.collection(u'participants').stream()
#
# members = []
#
# for doc in docs:
#     member = {
#         'id': doc.id,
#         'name': doc.to_dict()['name']
#     }
#     members.append(member)
#
# print(members)
#
# print(len(members))
#
# db.collection(u'total').document(u'participants').set({
#     'participants': members,
#     'programs': ['TIP','Research','Projects','TIP F21','TIP S21','Research F21','Research S21','Research F20','Projects F21','Projects F20','Projects S20','Projects F19','Projects S19','Projects F18','Projects S18','Projects F17']
# })
