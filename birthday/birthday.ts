import { google } from "googleapis";
import axios from "axios";
import messages from "./messages";
import { fetchID } from "../util/slack";

function arrayEquals<T>(xs: readonly T[], ys: readonly T[]): boolean {
  return xs.length === ys.length && xs.every((v, i) => v === ys[i]);
}

/**
 * This is what we expect the first row of the spreadsheet to be. We use this as
 * a sanity check in `spreadsheetToEvents` to make sure that the spreadsheet
 * format hasn't changed before we try manipulating things.
 */
const EXPECTED_COLUMNS = ["Name", "Birthday (mm/dd/yyyy)"] as const;
/**
 * The union of all of the strings in EXPECTED_COLUMNS (i.e., "Name" | "Birthday" | ...).
 * This allows us to ensure we don't accidentally use non-existant column name.
 */
type Column = typeof EXPECTED_COLUMNS[number];

/**
 * Our event schema. Each field corresponds to a column of the spreadsheet.
 * Note that not all columns are present, because only some are necessary for
 * generating the ics.
 */
interface Birthday {
  name: string;
  birthday: Date;
}

/**
 * Fetches the spreadsheet using the Google Sheets API. This yields the
 * spreadsheet as a very unstructured `any[][]`.
 */
async function fetchSpreadsheet(): Promise<any[][]> {
  // Construct a sheets client with the appropriate scope for reading
  // spreadsheets. We don't pass any API key, because that is automatically
  // detected from the `GOOGLE_APPLICATIONS_CREDENTIALS` env var.
  const sheets = google.sheets({
    version: "v4",
    auth: new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    }),
  });

  // Request the spreadsheet. Passing 'Birthday' for the range fetches the entire
  // sheet (which is called 'Birthday').
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.BIRTHDAY_SPREADSHEET_ID,
    range: "Birthday",
  });

  // Return the values of the sheet, coercing null | undefined to []
  // (I don't actually know in what cases it would be null or undefined...).
  return res.data.values ?? [];
}

/**
 * Converts a single row of the spreadsheet to a `Birthday` Object.
 * @param row A row of the spreadsheet (an element of the result of `fetchSpreadsheet()`).
 */
function rowToEvent(row: any[]): Birthday {
  /**
   * Convenience function for getting a value from the row given a column name
   * (e.g., `getValue("Date")` would get the first element of `row`).
   * @param column The name of the column.
   */
  function getValue(column: Column): any {
    return row[EXPECTED_COLUMNS.indexOf(column)];
  }

  /**
   * @param dateCol The column from which to get the date part.
   */
  function parseDate(dateCol: Column): Date {
    return new Date(getValue(dateCol));
  }

  return {
    name: getValue("Name"),
    birthday: parseDate("Birthday (mm/dd/yyyy)"),
  };
}

/**
 * Converts the raw spreadsheet data to an array of `Birthdays`.
 * @param spreadsheet The raw spreadsheet data (probably from `fetchSpreadsheet()`).
 */
function spreadsheetToEvents(spreadsheet: any[][]): Birthday[] {
  // Sanity check that the header row is what we expect. See `EXPECTED_COLUMNS`.
  if (!arrayEquals(spreadsheet[0], EXPECTED_COLUMNS)) {
    throw new Error("Unexpected header, aborting: " + spreadsheet[0]);
  }

  spreadsheet.shift(); // discard header row
  return spreadsheet.map(rowToEvent);
}

/**
 * Performs a filter to get back just the names of the people who have a birthday on the day the script is run
 * @param birthdays The list of all birthday objects from the spreadsheet
 */
function findBirthdays(birthdays: Birthday[]): string[] {
  const today = new Date();
  return birthdays
    .filter((birthday) => {
      if (
        birthday.birthday.getDate() === today.getDate() &&
        birthday.birthday.getMonth() === today.getMonth()
      ) {
        return true;
      }
      return false;
    })
    .map((birthday) => {
      return birthday.name;
    });
}

/**
 * Will loop through the array of names and make a post to slack that wishes them happy birthday and pulls a random message out as well
 * @param names an array of names of people who have birthdays today
 * @param channel_id what channel to send the messages to, default set on github env to #general
 */
function shareToSlack(
  names: string[],
  channel_id: string = process.env.SLACK_CHANNEL_ID as string
): void {
  Promise.all(
    names.map(async (name) => {
      const payload = {
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Happy Birthday ${await fetchID(name)} :tada:`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: messages[Math.floor(Math.random() * 13)],
            },
          },
        ],
      };
      await axios.post(channel_id, payload);
    })
  );
}

// Tie everything together and send the result to stdout (or log an error).
fetchSpreadsheet()
  .then(spreadsheetToEvents)
  .then(findBirthdays)
  .then(shareToSlack)
  .catch((r) => {
    console.error(`Error: ${r}`);
    process.exit(1);
  });
