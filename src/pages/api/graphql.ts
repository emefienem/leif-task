import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import type { NextApiRequest, NextApiResponse } from "next";

import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";
import { createContext } from "@/graphql/context";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema,
  context: createContext,
  graphqlEndpoint: "/api/graphql",
});

export const config = {
  api: {
    bodyParser: false,
  },
};
