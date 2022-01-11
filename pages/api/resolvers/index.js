import { getOfficers } from "../../../fetchData/getOfficers";
import { getParticipants } from "../../../fetchData/getParticipants";
import {
  getProfileData,
  getProfileByName,
  getProfileByEmail
} from "../../../fetchData/getProfileData";
import {
  getParticipantData,
  getParticipantDataByName,
} from "../../../fetchData/getParticipantData";

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
    getOfficer: async (_, { id, name, email }) => {
      try {
        if (name) {
          const profile = await getProfileByName(name, true);
          return profile;
        }
        else if (id) {
          const profile = await getProfileData(id, true);
          return profile;
        }
        else if (email) {
          const profile = await getProfileByEmail(email, true);
          return profile;
        }
        else {
            throw new Error("Must provide either an id, email or a name");
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    getParticipants: async (_, { query }) => {
      try {
        const { participants } = await getParticipants(query);
        return participants;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    getParticipant: async (_, { id, name }) => {
      try {
        if (name) {
          const participant = await getParticipantDataByName(name, true);
          return participant;
        }
        else if (id) {
          const participant = await getParticipantData(id, true);
          return participant;
        }
        else {
            throw new Error("Must provide either an id or a name");
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  },
};
