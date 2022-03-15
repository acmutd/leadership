import axios from "axios";
import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { fetchID } from "../../util/slack";
import { withSecrets } from "next-secrets";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD", "POST", "OPTIONS"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default withSecrets((secrets: Record<string, string>) => {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
      res.status(400).json({ message: "Invalid API method specified" });
      return;
    }

    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    // Run the middleware
    await runMiddleware(req, res, cors);

    const body = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Shoutout to *${await fetchID(
              req.body.receiver_name
            )}*! You just got an accolade from *${await fetchID(
              req.body.sender_name
            )}*! :tada: \n\n> ${req.body.accolade}`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Check out all the accolades on your ${
              req.body.collection === "officer" ? "leadership" : "profile"
            } page! :sparkles:`,
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text:
                req.body.collection === "officer"
                  ? "View Leadership"
                  : "View Profile",
              emoji: true,
            },
            value: "click_me_123",
            url: `https://leadership.acmutd.co/${
              req.body.collection === "officer" ? "profile" : "participant"
            }/${req.body.user_id}`,
            action_id: "button-action",
          },
        },
      ],
    };

    const url = secrets.ACM_SLACK_SHOUTOUT_CHANNEL;
    try {
      await axios.post(url, body, {});
      res.status(200).json({ message: "success" });
    } catch (e) {
      res.status(500).json({ message: "failure", error: e });
    }
  };
});
