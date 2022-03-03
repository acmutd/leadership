# ACM Leadership

![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=leadership-acmutd.vercel.app) [![CodeQL](https://github.com/acmutd/leadership/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/acmutd/leadership/actions/workflows/codeql-analysis.yml)

Explore how leadership in ACM has evolved over the ages!

### Quick Start

Follow these steps to get started with the project:

- Clone the repo `git clone https://github.com/acmutd/leadership.git`
- Fill in the values in `.env.local.example` and rename it to `.env.local`. Reach out to an existing contributor to get these values.
- Run `npm install`
- Run `npm run dev`

Note: If you are using Windows, running `npm run dev` may cause some errors. By default this project is setup to inspect server side logs and print them to the terminal window running the application. If there are any issues remove the `NODE_OPTIONS='--inspect'` from the scripts section of the `package.json` file for `npm run dev`.

### API Development

To test the GraphQL API follow these steps:

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
### Contributors

- [Harsha Srikara](https://harshasrikara.dev)

### Questions

Sometimes you may have additional questions. If the answer was not found in this readme please feel free to reach out to the [Director of Development](mailto:development@acmutd.co) for _ACM_

We request that you be as detailed as possible in your questions, doubts, or concerns to ensure that we can be of maximum assistance. Thank you!

![ACM Development](https://brand.acmutd.co/Development/Banners/light_dark_background.png)
