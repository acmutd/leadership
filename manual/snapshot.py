import os
from os import listdir
from os.path import isfile, join

# Class for storing officer schema
class Officer:
    def __init__(self, name, role):
        self._name = name
        self._role = role


officer_path = "_officers"

# Remove .DS_Store file if exists
if os.path.exists(f'{officer_path}/.DS_Store'):
    os.remove(f'{officer_path}/.DS_Store')

files = [f for f in listdir(officer_path) if isfile(join(officer_path, f))]

officers = []

# Read officer information from readme files
for file_name in files:
    with open(f'{officer_path}/{file_name}') as file:
        for line in file:
            if line.__contains__("name") or line.__contains__("role"):
                name = line.split("\"")[1]
                line = next(file)
                role = line.split("\"")[1]
                officer = Officer(name, role)
                officers.append(officer)

roles = {}

# Save to role array
# Note: This entire file is used in the history.py script
for officer in officers:
    if officer._role in roles:
        roles[officer._role].append(officer._name)
    else:
        roles[officer._role] = [officer._name]
