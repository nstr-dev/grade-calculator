import { db } from "@/db";
import { users } from "@/db/schema";
import {
  getRefreshTokenFromDb,
  saveRefreshTokenIntoDb,
} from "@/lib/repositories/user-repo";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession, NextAuthOptions, User } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { Provider } from "next-auth/providers/index";

export const config = {
  adapter: DrizzleAdapter(db) as Adapter,
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
    verifyRequest: "/login/sent",
  },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID || "",
      clientSecret: process.env.DISCORD_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    EmailProvider({
      server: process.env.SMTP_SERVER || "",
      from: process.env.SMTP_FROM || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    ...(process.env.MOCK_OAUTH_WELLKNOWN_URL
      ? [
          {
            id: "local",
            name: "Local",
            type: "oauth",
            wellKnown:
              process.env.MOCK_OAUTH_WELLKNOWN_URL ||
              "http://localhost:8080/default/.well-known/openid-configuration",
            clientId: "mock",
            clientSecret: "mock",
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.sub,
                email: `${profile.sub}@nstr.dev`,
                image: undefined,
              };
            },
          } as Provider,
        ]
      : []),
    ...(process.env.CUSTOM_OAUTH_NAME &&
    process.env.CUSTOM_OAUTH_SECRET &&
    process.env.CUSTOM_OAUTH_CLIENT_ID &&
    process.env.CUSTOM_OAUTH_WELLKNOWN_URL
      ? [
          {
            id: "custom",
            name: process.env.CUSTOM_OAUTH_NAME,
            type: "oauth",
            wellKnown: process.env.CUSTOM_OAUTH_WELLKNOWN_URL,
            clientId: process.env.CUSTOM_OAUTH_CLIENT_ID,
            clientSecret: process.env.CUSTOM_OAUTH_SECRET,
            authorization: { params: { scope: "openid email profile" } },
            checks: ["pkce", "state"],
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.name ?? profile.preferred_username,
                email: profile.email,
                image: profile.picture,
              };
            },
          } as Provider,
        ]
      : []),
    ...(process.env.NO_AUTH &&
    (process.env.NO_AUTH === "true" || process.env.NO_AUTH === "1")
      ? [
          Credentials({
            id: "noAuth",
            name: "NoAuth",
            credentials: {},
            async authorize(credentials, req) {
              const inserted = await db
                .insert(users)
                .values({
                  id: "9090e027-3b15-43b4-ab84-ad133895927d",
                  email: "user@local",
                  name: "User",
                  image: null,
                })
                .returning()
                .onConflictDoUpdate({
                  target: users.id,
                  set: {
                    name: "User",
                  },
                })
                .execute();
              return inserted[0] as User;
            },
          }),
        ]
      : []),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.uid = token.sub as string;
      }
      return session;
    },
    jwt: async ({ user, token, account }) => {
      if (process.env.SELFHOSTED && process.env.SELFHOSTED === "1")
        return token;
      if (user) {
        token.uid = user.id;
      }

      if (account && user) {
        if (account.refresh_token) {
          token.refreshToken = account.refresh_token;
          await saveRefreshTokenIntoDb(
            user.id,
            account.refresh_token as string
          );
        }
      } else {
        const refreshToken = await getRefreshTokenFromDb(token.sub as string);
        if (refreshToken) token.refreshToken = refreshToken;
      }

      return token;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
} satisfies NextAuthOptions;

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  const session = getServerSession(...args, config);
  return session;
}
