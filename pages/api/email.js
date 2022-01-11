import axios from "axios";
import Cors from "cors";
import { getSession } from "next-auth/client";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD", "POST", "OPTIONS"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
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

  const receiver_data = {
    from: req.body.sender_email,
    from_name: req.body.sender_name,
    to: req.body.to,
    template_id: process.env.TEMPLATE_ID_RECEIVER,
    dynamicSubstitutions: {
      sender_name: req.body.sender_name,
      receiver_name: req.body.receiver_name,
    },
  };

  const sender_data = {
    from: "development@acmutd.co",
    from_name: "ACM Development",
    to: req.body.sender_email,
    template_id: process.env.TEMPLATE_ID_SENDER,
    dynamicSubstitutions: {
      sender_name: req.body.sender_name,
      receiver_name: req.body.receiver_name,
    },
  };

  const url = process.env.ACM_CORE_BASE_URL + "/challenge/send-email";

  try {
    await axios.post(
      url,
      receiver_data,
      {}
    );
    await axios.post(
        url,
        sender_data,
        {}
      );
    res.status(200).json({ message: "success" });
  } catch (e) {
    res.status(500).json({ message: "failure", error: e });
  }
}
