# ACM Leadership

![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=leadership-acmutd.vercel.app) [![CodeQL](https://github.com/acmutd/leadership/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/acmutd/leadership/actions/workflows/codeql-analysis.yml)

Explore how leadership & programs in _ACM_ have evolved over the ages!

Checkout out the [Documentation Portal](https://docs.leadership.acmutd.co) for more information!

### How to add new officers

Adding new officers / updating existing officer information can be done through the admin console. Simply sign in with your _ACM_ account & navigate to the [admin console](https://leadership.acmutd.co/admin). Here you can add new officers, update existing officers, create new roles, switch roles for existing officers, set end date for departing officers and grant other officers access to the admin console. 

Note: To access the admin console your _ACM_ account needs to have the historian permission. If you don't have this permission reach out to any of the current historians for _ACM_.

### Quick Start

Follow these steps to get started with the project locally:

- Clone the repo `git clone https://github.com/acmutd/leadership.git`
- Setup Doppler by running `doppler setup` and select the `dev` config for the `leadership` project
- Run `npm install`
- Run `npm run dev`
- Navigate to `http://localhost:3000`

Note: If you are using Windows, running `npm run dev` may cause some errors. By default this project is setup to inspect server side logs and print them to the terminal window running the application. If there are any issues remove the `NODE_OPTIONS='--inspect'` from the scripts section of the `package.json` file for `npm run dev`.

### API Development

To view the production GraphQL API click [here](https://leadership.acmutd.co/api/graphql).

To test the GraphQL API locally follow these steps:

 - Run the project using the aforementioned steps
 - Open the GraphQL API endpoint at `http://localhost:3000/api/graphql`
 - Click "Query your server` to open Apollo Studio. Note: Make sure to a compliant browser like Chrome. 
 - Sign into the leadership site & navigate to `http://localhost:3000/settings` and generate a new API Key.
 - Copy the key (it should start with `eyJ`) and add it as a header in Apollo Studio as follows `Authorization: Bearer <API KEY>`.
 - The schema and queries for the GraphQL API should now be visible.

### Anniversary Program

[![Anniversary](https://github.com/acmutd/leadership/actions/workflows/anniversary.yml/badge.svg)](https://github.com/acmutd/leadership/actions/workflows/anniversary.yml)

This repo also separately from the NextJS application houses the Anniversary workflow. This script runs as a GitHub action every night to check whether an anniversary has occured and if so to then send a message in slack. To run the anniversary script locally follow these steps:

 - Clone the repo
 - Set all the environment variables for the firebase config via the command line. The script does not use `dotenv` so set them as global environment variables using `export FIREBASE_API_KEY=<API KEY>` etc. 
 - Set the slack channel environment variable to point to the `#general` channel by running `export SLACK_CHANNEL_ID=<Webhook Url>`. Note that this is different from the slack channel ID used by the NextJS application (which points to `#shoutouts`). 
 - Run `npm install`
 - Run `npm run anniversary-build`
 - Run `npm run anniversary-start`

### Birthday Program

[![Birthday](https://github.com/acmutd/leadership/actions/workflows/birthday.yml/badge.svg)](https://github.com/acmutd/leadership/actions/workflows/birthday.yml)

The birthday bot program resides in this repository as a GitHub action triggered workflow. Much like the anniversary program, this script runs eveery night to check whether there are any birthdays on that date. Birthdays for officers are found on this [google spreadsheet](https://docs.google.com/spreadsheets/d/1hGO85H85VOhVnI-seXKsDKIXVKZ8Kq1EK59hF382u6k/edit#gid=0). Note: Need to be signed in with an `@acmutd.co` account to view the spreadsheet. If you've just joined the organization update the spreadsheet with your birthday too! To run the program locally follow these steps:

 - Clone the repo
 - Open the `calendar-converter` project in google cloud, find the default service account and download the `.json` key.
 - Set the following environment variables via the command line

```
export SLACK_CHANNEL_ID=<Webhook_Url>
export SLACK_TOKEN=<API_KEY>
export BIRTHDAY_SPREADSHEET_ID=https://docs.google.com/spreadsheets/<SPREADSHEET_ID>/edit  (Note: enter just the spreadsheet id, not the whole url)
export GOOGLE_APPLICATION_CREDENTIALS=<PATH_TO_SERVICE_ACCOUNT_JSON_FILE>
```

 - Run `npm install`
 - Run `npm run birthday-build`
 - Run `npm run birthday-start`

### Contributors

- [Harsha Srikara](https://harshasrikara.dev)

### Questions

Sometimes you may have additional questions. If the answer was not found in this readme please feel free to reach out to the [Director of Development](mailto:development@acmutd.co) for _ACM_

We request that you be as detailed as possible in your questions, doubts, or concerns to ensure that we can be of maximum assistance. Thank you!

![ACM Development](https://brand.acmutd.co/Development/Banners/light_dark_background.png)
