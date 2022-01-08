import axios from "axios";
import { getOfficers } from "../../../fetchData/getOfficers";
import {
  getProfileData,
  getProfileByName,
} from "../../../fetchData/getProfileData";

export const resolvers = {
  Query: {
    getOfficers: async (_, { query }) => {
      try {
        const { officers, role_list, historian } = await getOfficers(query);
        return officers;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    getOfficer: async (_, { id, name }) => {
      try {
        if (name) {
          const profile = await getProfileByName(name, true);
          return profile;
        }
        else if (id) {
          const profile = await getProfileData(id, true);
          return profile;
        }
        else {
            throw new Error("Must provide either an id or a name");
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
