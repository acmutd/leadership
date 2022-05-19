# Manual Scripts 

**Important** : In all scripts the sections that involve firestore writes are commented out as a precaution. Be very careful to not corrupt the dataset by simply running the scripts.

This set of scripts was used to populate the initial database with information about the current and past officers, participants from TIP, Research and Projects as well as teams. These scripts use the `acmutd.github.io` repository, the officer spreadsheet, exports from typeform and participant spreadsheets as input sources. Running several of these scripts initally requires moving them into the `acmutd.github.io` repository since they will traverse through its git history. It is possible to modify these scripts to run anywhere by adding a line at the top of `history.py` and `roles.py` to clone the repo.

Note: These scripts were designed to be run exactly one time. Running them again will likely cause the data in firestore to be corrupted by being overwritten. In addition to running these scripts there were same manual modifications made to the documents in firestore to ensure that it is fully up to date.

### Adding new officers

To add new officers use the [Admin Console](https://leadership.acmutd.co/admin) instead of these scripts.
### Adding new participants / teams

To add new participants the `participant.py` script can be used. It requires as input 2 spreadsheets. The first is the names of all the participants. This spreadsheet should have the first column be participants and the second be emails. Most divisions have kept a spreadsheet in this format to record all the participants for a given semester. The second spreadsheet is the typeform export for the applicants for that semester. The data in that spreadsheet is used to add metadata information like applicant emails, major and classification to their profile. To some extent, both of these spreadsheets need some degree of manual control to adjust headers and potential mismatches due to invalid user input (For example students putting in different names, first and last name together, etc). 

To add new teams the `teams.py` script can be used. Before running this script the `participants.py` script for that semester's data MUST be run. This script requires as input the spreadsheet containing the names of all participants and the team that they belong to. The script creates team objects and then looks for the matching participant and officer ids in firestore. Input for the director name is required to be entered manually as a field in the script. Much like the participant script, some level of manual control to adjust names and header information is required since there may be inconsistencies in the spreadsheet formats semester to semester.

### FAQ

Reach out to [Harsha Srikara](@harshasrikara) for more information.