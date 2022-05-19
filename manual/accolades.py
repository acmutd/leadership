import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize firebase admin sdk
cred = credentials.Certificate('path-to-acm-core-json')
firebase_admin.initialize_app(cred)

# Initialize firestore
db = firestore.client()

teams = db.collection(u'teams').stream()

for team in teams:
    doc = team.to_dict()

    print(f"{doc[u'officer']['name']} => {doc[u'officer']['id']}")

    team_info = {
        "id": team.id,
        "name": doc[u'name']
    }

    print(team_info)

    # db.collection(u'officer').document(doc[u'officer']['id']).update({
    #     u'teams': firestore.ArrayUnion([team_info])
    # })

# events1 = db.collection(u'event_data').stream()
#
# total_events = 0
# total_attendees = 0
#
# for event in events1:
#     doc = event.to_dict()
#
#     print(doc)
#
#     total_events = total_events + 1
#
#     total_attendees = total_attendees + len(doc[u'attendance'])
#
# print(total_events)
# print(total_attendees)