import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const TOKEN_SYNC_INTERVAL_MS = 60 * 1000;

function extractClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return req.headers.get("x-real-ip") || req.ip || "Unknown";
}

async function syncUserContext(token: any) {
  const baseUserId =
    token.baseUserId ||
    (token.impersonator as { id?: string } | undefined)?.id ||
    token.id;

  if (!baseUserId) {
    return token;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: baseUserId as string },
  });
  if (!dbUser) {
    return { ...token, error: "UserNotFound" };
  }

  const nextToken: any = {
    ...token,
    baseUserId: dbUser.id,
    lastSyncedAt: Date.now(),
  };

  if (dbUser.impersonatingUserId) {
    const impersonatedUser = await prisma.user.findUnique({
      where: { id: dbUser.impersonatingUserId },
    });

    if (impersonatedUser) {
      nextToken.id = impersonatedUser.id;
      nextToken.role = impersonatedUser.role;
      nextToken.impersonator = {
        id: dbUser.id,
        role: dbUser.role,
        name: dbUser.name,
        email: dbUser.email,
      };
      return nextToken;
    }
  }

  nextToken.id = dbUser.id;
  nextToken.role = dbUser.role;
  delete nextToken.impersonator;
  return nextToken;
}

async function refreshAccessToken(token: any) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    console.log("Refreshing access token; url:", url);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      console.error("Error refreshing access token:", refreshedTokens);
      throw refreshedTokens;
    }

    console.log("Refreshed tokens successfully");

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error("Error in refreshAccessToken:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Allow automatic linking for users who created an account via email and later try to sign in with Google
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.hashedPassword) {
          throw new Error(
            "Account created via social login. Please use social login or set a password.",
          );
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword,
        );

        if (!isCorrectPassword) {
          throw new Error("Incorrect password");
        }

        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user, isNewUser }) {
      let ipAddress = "Unknown";
      try {
        const cookieStore = await cookies();
        ipAddress = cookieStore.get("signin_ip")?.value || "Unknown";
        cookieStore.delete("signin_ip");
      } catch {
        // Ignore cookie access errors and keep fallback.
      }

      await prisma.loginHistory.create({
        data: {
          userId: user.id!,
          ipAddress: ipAddress,
        },
      });

      if (isNewUser) {
        const cookieStore = await cookies();
        const referral = cookieStore.get("referral")?.value;
        if (referral) {
          await prisma.user.update({
            where: { id: user.id! },
            data: { referralSource: referral },
          });
        }
      }
    },
    async signOut({ token }) {
      const userId =
        (token?.impersonator as { id?: string } | undefined)?.id ||
        (token as any)?.baseUserId ||
        (token as any)?.id;

      if (userId) {
        await prisma.user
          .update({
            where: { id: userId as string },
            data: { impersonatingUserId: null },
          })
          .catch(() => {});
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile, isNewUser }) {
      return true;
    },
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (account && user) {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (dbUser) {
          token.id = dbUser.id;
          token.baseUserId = dbUser.id;
          token.role = dbUser.role;
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.accessTokenExpires = (account.expires_at ?? 0) * 1000;
          token.lastSyncedAt = Date.now();

          if (dbUser.impersonatingUserId) {
            const impersonatedUser = await prisma.user.findUnique({
              where: { id: dbUser.impersonatingUserId },
            });

            if (impersonatedUser) {
              token.id = impersonatedUser.id;
              token.role = impersonatedUser.role;
              token.impersonator = {
                id: dbUser.id,
                role: dbUser.role,
                name: dbUser.name,
                email: dbUser.email,
              };
            }
          }
        }
        return token;
      }

      if (trigger === "update") {
        return await syncUserContext(token);
      }

      const accessTokenExpires = Number(token.accessTokenExpires || 0);

      // Access token has expired, try to update it first.
      if (Date.now() >= accessTokenExpires) {
        const refreshed = await refreshAccessToken(token);
        return await syncUserContext(refreshed);
      }

      const shouldSyncUserContext =
        !token.lastSyncedAt ||
        Date.now() - Number(token.lastSyncedAt) > TOKEN_SYNC_INTERVAL_MS;

      if (shouldSyncUserContext) {
        return await syncUserContext(token);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      session.accessToken = token.accessToken as string;
      session.error = token.error as string;
      session.impersonator = token.impersonator;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

async function getHandler(req: NextRequest, context: any) {
  if (req.nextUrl.pathname.includes("callback")) {
    const cookieStore = await cookies();
    cookieStore.set("signin_ip", extractClientIp(req), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 120,
    });
  }

  // @ts-ignore
  return await handler(req, context);
}

async function postHandler(req: NextRequest, context: any) {
  if (req.nextUrl.pathname.includes("callback")) {
    const cookieStore = await cookies();
    cookieStore.set("signin_ip", extractClientIp(req), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 120,
    });
  }

  // @ts-ignore
  return await handler(req, context);
}

export { getHandler as GET, postHandler as POST };
