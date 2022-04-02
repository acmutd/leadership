import axios from "axios";

const getEnv = async () => {
  const response =
    process.env.NODE_ENV === "development"
      ? await axios.get<Record<string, string>>(
          `https://${process.env.DEV_DOPPLER_TOKEN}@api.doppler.com/v3/configs/config/secrets/download?format=json`
        )
      : await axios.get<Record<string, string>>(
          `https://${process.env.PROD_DOPPLER_TOKEN}@api.doppler.com/v3/configs/config/secrets/download?format=json`
        );
  return response.data;
};

export default getEnv;
