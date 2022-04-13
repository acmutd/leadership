import axios from "axios";

interface Environment {
  initialized: boolean;
  env: Record<string, string>;
}

const environment: Environment = {
  initialized: false,
  env: {},
};

const getEnv = async () => {
  if (!environment.initialized) {
    const response =
      process.env.NODE_ENV === "development"
        ? await axios.get<Record<string, string>>(
            `https://${process.env.DEV_DOPPLER_TOKEN}@api.doppler.com/v3/configs/config/secrets/download?format=json`
          )
        : await axios.get<Record<string, string>>(
            `https://${process.env.PROD_DOPPLER_TOKEN}@api.doppler.com/v3/configs/config/secrets/download?format=json`
          );
    environment.env = response.data;
    environment.initialized = true;
  }
  return environment.env;
};

export default getEnv;
