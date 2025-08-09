// import { ApolloServer } from "apollo-server-micro";
// import { auth0 } from "@/lib/auth0";
// import { typeDefs } from "@/graphql/schema";
// import { resolvers } from "@/graphql/resolvers";
// import { prisma } from "@/lib/prisma";

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: async ({ req, res }) => {
//     const session = await auth0.getSession();

//     const MANAGER_ID = "fixed-manager-id";

//     if (!session || !session.user) {
//       throw new Error("Not authenticated");
//     }

//     const auth0Id = session.user.sub;

//     let dbUser = await prisma.user.findUnique({
//       where: { id: auth0Id },
//     });

//     if (!dbUser) {
//       dbUser = await prisma.user.create({
//         data: {
//           id: auth0Id,
//           email: session.user.email!,
//           name: session.user.name || null,
//           role: "CARE_WORKER",
//           managerId: MANAGER_ID,
//         },
//       });
//     }

//     return { user: dbUser };
//   },
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default server.createHandler({ path: "/api/graphql" });

// pages/api/graphql.ts
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
