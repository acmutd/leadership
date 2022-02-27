import { getOfficers } from "../../../fetchData/getOfficers";
import {
  getParticipantData,
  getParticipantDataByName
} from "../../../fetchData/getParticipantData";
import { getParticipants } from "../../../fetchData/getParticipants";
import {
  getProfileByEmail, getProfileByName, getProfileData
} from "../../../fetchData/getProfileData";
import {
  getTeamData,
  getTeamDataByName
} from "../../../fetchData/getTeamData";
import { getTeams } from "../../../fetchData/getTeams";

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
          return {
            ...profile,
            email: null,
          };
        }
        else if (id) {
          const profile = await getProfileData(id, true);
          return {
            ...profile,
            email: null,
          };
        }
        else if (email) {
          const profile = await getProfileByEmail(email, true);
          return {
            ...profile,
            email: null,
          };
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
          return {
            ...participant,
            email: null,
          };
        }
        else if (id) {
          const participant = await getParticipantData(id, true);
          return {
            ...participant,
            email: null,
          };
        }
        else {
            throw new Error("Must provide either an id or a name");
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    getTeams: async (_, { query }) => {
      try {
        const { teams } = await getTeams(query);
        return teams;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    getTeam: async (_, { id, name }) => {
      try {
        if (name) {
          const team = await getTeamDataByName(name, true);
          return team;
        }
        else if (id) {
          const team = await getTeamData(id, true);
          return team;
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
  Team: {
    id: ({ id }) => {
      return id;
    },
    name: ({ name }) => {
      return name;
    },
    participants: async ({ id }) => {
      const team = await getTeamData(id);
      return team.participants;
    },
    officer: async ({ id }) => {
      const team = await getTeamData(id);
      return team.officer;
    },
    director: async ({ id }) => {
      const team = await getTeamData(id);
      return team.director;
    },
    tags: async ({ id }) => {
      const team = await getTeamData(id);
      return team.tags;
    }
  },
  Participant: {
    id: ({ id }) => {
      return id;
    },
    name: ({ name }) => {
      return name;
    },
    email: async ({ id }) => {
      const participant = await getParticipantData(id);
      return null;
      // return participant.email;
    },
    netid: async ({ id }) => {
      const participant = await getParticipantData(id);
      return participant.netid;
    },
    classification: async ({ id }) => {
      const participant = await getParticipantData(id);
      return participant.classification;
    },
    major: async ({ id }) => {
      const participant = await getParticipantData(id);
      return participant.major;
    },
    participation: async ({ id }) => {
      const participant = await getParticipantData(id);
      return participant.participation;
    },
    accolades: async ({ id }) => {
      const participant = await getParticipantData(id, true);
      return participant.accolades;
    },
    teams: async ({ id }) => {
      const participant = await getParticipantData(id);
      return participant.teams;
    }
  },
  Officer: {
    id: ({ id }) => {
      return id;
    },
    name: ({ name }) => {
      return name;
    },
    acm_email: async ({ id }) => {
      const officer = await getProfileData(id);
      return officer.acm_email;
    },
    email: async ({ id }) => {
      const officer = await getProfileData(id);
      return null;
      // return officer.email;
    },
    linkedin: async ({ id }) => {
      const officer = await getProfileData(id);
      return officer.linkedin;
    },
    roles: async ({ id }) => {
      const officer = await getProfileData(id, true);
      return officer.roles;
    },
    accolades: async ({ id }) => {
      const officer = await getProfileData(id, true);
      return officer.accolades;
    }
  }
};
