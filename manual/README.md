# Manual Scripts 

This set of scripts was used to populate the initial database with information about the current and past officers. These scripts use the `acmutd.github.io` repository and the officer spreadsheet as input sources. Running several of these scripts initally requires moving them into the `acmutd.github.io` repository since they will traverse through its git history. It is possible to modify these scripts to run anywhere by adding a line at the top of `history.py` and `roles.py` to clone the repo.

Note: These scripts were designed to be run exactly one time. Running them again will likely cause the data in firestore to be corrupted by being overwritten. In addition to running these scripts there were same manual modifications made to the documents in firestore to ensure that it is fully up to date.

### FAQ

Reach out to [Harsha Srikara](@harshasrikara) for more information.