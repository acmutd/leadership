import axios from "axios";

interface slack_user {
  id: string;
  name: string;
}

const fetchUsers = async (): Promise<any> => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
    },
  };
  return await axios.get<any>("https://slack.com/api/users.list", config);
};

const filterCurrentUsers = (users: any): any => {
  return users.data.members.filter((user: any) => user.deleted === false);
};

const mapNamesToIds = (users: any): slack_user[] => {
  return users.map((user: any) => {
    return {
      id: user.id,
      name: user.profile.real_name_normalized,
    };
  });
};

const findID = (users: slack_user[], name: string): string => {
  const user =  users.find((user: slack_user) => user.name === name);

  if (user) {
      return user.id;
  }

  return undefined;
};

const formatID = (id: string): string => {
  return `<@${id}>`;
};

/**
 * Search up the slack id for a given user name
 * @param {string} name of the user that is being looked up
 * @returns {string} the slack id of the user if found in the mentionable format, else returns back the name of the user
 */
export const fetchID = async (name: string): Promise<string> => {
  const users = await fetchUsers().then(filterCurrentUsers).then(mapNamesToIds);

  const id = findID(users, name);

  if (id) {
    return formatID(id);
  }

  return name;
};
