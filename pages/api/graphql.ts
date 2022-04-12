import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import jwt from 'jsonwebtoken';
import Cors from 'micro-cors';
import { resolvers } from './resolvers';
import { typeDefs } from './schemas';
// import getEnv from '../../util/env';

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault({ footer: false })],
  context: async ({ req }) => {
    // const env = await getEnv();
    const public_key = process.env.LEADERSHIP_RSA_PUBLIC_KEY.replace(
      /\\n/gm,
      '\n'
    );

    const decoded_token = jwt.verify(
      req.headers.authorization.split(' ')[1],
      public_key,
      { issuer: process.env.NEXTAUTH_URL }
    );
    return {
      ...(decoded_token as jwt.JwtPayload),
    };
  },
});

const startServer = apolloServer.start();

export default cors(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
});
