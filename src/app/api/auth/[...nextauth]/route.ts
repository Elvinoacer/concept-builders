import NextAuth, { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'; // Import NextRequest

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
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        if (!user.hashedPassword) {
          throw new Error('Account created via social login. Please use social login or set a password.');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error('Incorrect password');
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user, isNewUser }) {
      const ipAddress = globalThis.tempSignInIp || 'Unknown';
      delete globalThis.tempSignInIp; // Clean up

      await prisma.loginHistory.create({
        data: {
          userId: user.id!,
          ipAddress: ipAddress,
        },
      });

      if (isNewUser) {
        const cookieStore = cookies();
        const referral = cookieStore.get('referral')?.value;
        if (referral) {
          await prisma.user.update({
            where: { id: user.id! },
            data: { referralSource: referral },
          });
        }
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile, isNewUser }) {
      return true;
    },
    async signOut({ token }) {
      // @ts-ignore
      const userId = token.impersonator?.id || token.user?.id;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { impersonatingUserId: null },
        });
      }
    },
    async jwt ({ token, account, user }) {
      console.log("--- JWT CALLBACK ENTERED ---");
      console.log("JWT callback triggered");
      // Initial sign in
      if (account && user) {
        console.log("Initial sign in");
        token.user = user;
        token.accessToken = account.access_token;
        token.accessTokenExpires = Date.now() + (account.expires_at ?? 0) * 1000;
        token.refreshToken = account.refresh_token;
      }

      // @ts-ignore
      const userForCheck = token.impersonator || token.user;
      console.log("User for check:", userForCheck?.email);

      if (userForCheck) {
        // @ts-ignore
        const userFromDb = await prisma.user.findUnique({ where: { id: userForCheck.id } });
        console.log("User from DB:", userFromDb?.email, "Impersonating:", userFromDb?.impersonatingUserId);

        // @ts-ignore
        if (userFromDb?.impersonatingUserId) {
          console.log("Admin is impersonating, fetching impersonated user");
          const impersonatedUser = await prisma.user.findUnique({ where: { id: userFromDb.impersonatingUserId } });
          if (impersonatedUser) {
            console.log("Impersonated user found:", impersonatedUser.email);
            token.user = impersonatedUser;
            token.impersonator = userFromDb;
          }
        } else if (token.impersonator) {
          console.log("Exiting impersonation");
          // Exiting impersonation
          token.user = token.impersonator;
          delete token.impersonator;
        }
      }

      // @ts-ignore
      if (Date.now() < token.accessTokenExpires) {
        console.log("Access token is valid");
        return token;
      }

      console.log("Access token expired, refreshing...");
      // @ts-ignore
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user = token.user;
      // @ts-ignore
      session.accessToken = token.accessToken;
      // @ts-ignore
      session.error = token.error;
      // @ts-ignore
      session.impersonator = token.impersonator;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

async function getHandler(req: NextRequest, context: any) {
  if (req.nextUrl.pathname.includes('callback') && req.method === 'GET') {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded
      ? (Array.isArray(forwarded)
          ? forwarded[0]
          : forwarded.split(/\s*,\s*/)[0])
      : req.headers.get('x-real-ip') || req.ip || 'Unknown';

    globalThis.tempSignInIp = ip;
  }

  // @ts-ignore
  return await handler(req, context);
}

async function postHandler(req: NextRequest, context: any) {
  // @ts-ignore
  return await handler(req, context);
}

export { getHandler as GET, postHandler as POST };
