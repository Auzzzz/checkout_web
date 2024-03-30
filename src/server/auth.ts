import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import FusionAuthProvider from "next-auth/providers/fusionauth"

import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({token, user, account}) {
      return {...token, ...user, ...account}
    }, 
    session: ({ session, token, user}) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        raw: token

      },
    }),

  // callbacks: {
  //   async jwt({token, user}) {
  //     return {...token, ...user}
  //   }, 
  //   async session({session, token, user}) {
  //     session.user = token as any;
  //     return session;
  //   }
    
  },
  providers: [
    FusionAuthProvider({
      id: "fusionauth",
      name: "FusionAuth",
      issuer:  process.env.FUSIONAUTH_ISSUER,
      clientId: process.env.FUSIONAUTH_CLIENT_ID || "",
      clientSecret: process.env.FUSIONAUTH_SECRET || "",
      idToken: true,
      // tenantId: process.env.FUSIONAUTH_TENANT_ID // Only required if you're using multi-tenancy
       client: {
        authorization_signed_response_alg: "HS256",
        id_token_signed_response_alg: "HS256",
       }
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
