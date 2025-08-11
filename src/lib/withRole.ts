// lib/withRole.ts
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import type { Session } from "@auth0/nextjs-auth0";
import { getSession } from "@auth0/nextjs-auth0";

type PropsWithUser = {
  user: Session["user"];
};

// This is a wrapper around getServerSideProps to enforce role checks
export function withRole<P extends PropsWithUser = PropsWithUser>(
  allowedRoles: string[],
  getServerSidePropsFunc?: GetServerSideProps<P>
): GetServerSideProps<P> {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const session = await getSession(context.req, context.res);

    if (!session || !session.user) {
      return {
        redirect: {
          destination: "/api/auth/login",
          permanent: false,
        },
      };
    }

    const roles =
      (session.user[process.env.AUTH0_DOMAIN as string] as string[]) || [];
    const hasRole = roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return {
        redirect: {
          destination: "/unauthorized",
          permanent: false,
        },
      };
    }

    if (getServerSidePropsFunc) {
      // Pass session via context if needed or just run the original function
      return getServerSidePropsFunc(context);
    }

    // By default return user as prop
    return {
      props: {
        user: session.user,
      } as P,
    };
  };
}
