import axios from "axios";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import FusionAuthProvider from "next-auth/providers/fusionauth";

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
      raw: {
        access_token: string;
        expires_in: number;
        refresh_expires_in: number;
        refresh_token: string;
        token_type: string;
        "not-before-policy": number;
        session_state: string;
        scope: string;
        error: string;
      };
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

// Token refresh API call

async function refreshAccessToken(token: any) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL + 'v1/auth/refresh'}`
    // console.log("refreshed token 1.5", token)
    // console.log(url)
    // const res: { ok: any; status: number; json: () => any; } = await fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ refreshToken: token.refresh_token }),
    // });


    // Fetch does not work Axios does
    const res = await axios.post(url, {
      refreshToken: token.refresh_token,
    });

    if (res.status !== 200) {
      console.log("error in auth JWT refresh", res);
      return;
    }

    const data = res.data;

    return {
      ...token,
      access_token: data.response.access_token, 
      expires_in: data.response.expires_in, 
      refresh_token: data.response.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log("token refresh error", error);
  }
  return {
    ...token,
    error: "RefreshAccessTokenError",
  };
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user, account }) {

      if(account && user) {

        return {
          ...token,
          ...user,
          ...account,
        };

      }

      if(Date.now() < (account?.expires_at ?? 0)) {
        return { ...token, ...user, ...account };
      }

      // If the token is expired, refresh it
      return refreshAccessToken(token);

    },
    session: ({ session, token, user }) => ({

      ...session,
      ...user,
      ...token,
      user: {
        ...session.user,
        id: token.sub,
        raw: token,
        error: token.error,
      },
    }),
  },
  providers: [
    FusionAuthProvider({
      id: "fusionauth",
      name: "FusionAuth",
      issuer: process.env.FUSIONAUTH_ISSUER,
      clientId: process.env.FUSIONAUTH_CLIENT_ID || "",
      clientSecret: process.env.FUSIONAUTH_SECRET || "",
      idToken: true,
      // tenantId: process.env.FUSIONAUTH_TENANT_ID // Only required if you're using multi-tenancy
      client: {
        authorization_signed_response_alg: "HS256",
        id_token_signed_response_alg: "HS256",
      },
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
