from git import Repo
import os
import datetime
from os import listdir
from os.path import isfile, join
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize firebase admin sdk
cred = credentials.Certificate('path-to-acm-core-json')
firebase_admin.initialize_app(cred)

# Initialize firestore
db = firestore.client()

path_to_repo = "path-to-acmutd.github.io-repo"
repo = Repo(path_to_repo)
all_commits = [c for c in repo.iter_commits()]  # Get all the commits
git = repo.git  # This creates an object that allows for using regular git commands

git.checkout('master')  # Make sure I start at master

# time.sleep(10)  # Need to give time for files write

# Stores officer schema
class Officer:
    def __init__(self, name, role):
        self._name = name
        self._role = role

# Folder in jekyll repo that contains officer readmes
officer_path = "_officers"

# 
role_collection = []
officer_collection = []
officer_map = {}

# Note: 608 commits back was the earliest commit that used jekyll with officer info stored in _officers
for c in sorted(all_commits[0:608], key=lambda x: x.committed_date):  # Go through all commits
    git.checkout(c)
    print(c)

    # remove .DS_Store if it exists
    if os.path.exists(f'{officer_path}/.DS_Store'):
        os.remove(f'{officer_path}/.DS_Store')

    tz = c.committed_date
    print(datetime.datetime.fromtimestamp(tz))
    files = [f for f in listdir(officer_path) if isfile(join(officer_path, f))]
    officers = []

    # parse readme files and convert to the officer object
    for file_name in files:
        with open(f'{officer_path}/{file_name}') as file:
            for line in file:
                if line.__contains__("name") or line.__contains__("role"):
                    name = line.split("\"")[1]
                    line = next(file)
                    role = line.split("\"")[1]
                    if role.__contains__(", "):
                        multi_roles = role.split(", ")
                        officers.append(Officer(name, multi_roles[0]))
                        officers.append(Officer(name, multi_roles[1]))
                    else:
                        officer = Officer(name, role)
                        officers.append(officer)

    roles = {}

    for officer in officers:
        # save information for the roles collection
        if officer._role in roles:
            roles[officer._role].append(officer._name)
        else:
            roles[officer._role] = [officer._name]

        # if the officer's name is already saved in the collection
        if officer._name in officer_collection:
            # if this specific role is already present in the officer's role list
            if officer._role in officer_map[officer._name]["role_list"]:
                # update the end time for the role to be the latest
                officer_map[officer._name]["role_map"][officer._role]["end"] = tz
                officer_map[officer._name]["end"] = tz
            else:
                # create new role and save start/end time
                officer_map[officer._name]["role_list"].append(officer._role)
                officer_map[officer._name]["role_map"][officer._role] = {"title": officer._role, "start": tz, "end": tz}
                officer_map[officer._name]["end"] = tz
        else:
            # first time seeing officer's name
            officer_collection.append(officer._name)
            officer_map[officer._name] = {"name": officer._name, "linkedin": "https://linkedin.com", "start": tz,
                                          "end": tz, "role_list": [officer._role],
                                          "role_map": {officer._role: {"title": officer._role, "start": tz, "end": tz}}}

    tz_to_roles = {tz: roles}
    role_collection.append(tz_to_roles)

# Note: The following section is commented out because accidentally running this can overwrite the existing data
# write the results back to firestore
#
# for key, value in officer_map.items():
#     # create root level document
#     doc_ref = db.collection(u'officer').document()
#     doc_ref.set({
#         u'name': value['name'],
#         u'start': datetime.datetime.fromtimestamp(value['start']),
#         u'end': datetime.datetime.fromtimestamp(value['end']),
#         u'role_list': value['role_list']
#     })
#
#     # create sub document for each role that the officer had
#     for k, v in officer_map[key]['role_map'].items():
#         sub_doc_ref = doc_ref.collection('roles').document()
#         sub_doc_ref.set({
#             u'title': v['title'],
#             u'start': datetime.datetime.fromtimestamp(v['start']),
#             u'end': datetime.datetime.fromtimestamp(v['end'])
#         })
#
# # create snapshot documents for each commit time
# for snapshot in role_collection:
#     for key, value in snapshot.items():
#         doc_ref = db.collection(u'snapshot').document()
#         doc_ref.set({
#             **value, # spread operator, equivalent of doing ...value in typescript
#             u'timestamp': datetime.datetime.fromtimestamp(key)
#         })

git.checkout('master')  # Go back to HEAD of master
