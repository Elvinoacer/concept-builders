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
      const userId = (token.impersonator as { id: string })?.id || token.id;
      if (userId) {
        await prisma.user.update({
          where: { id: userId as string },
          data: { impersonatingUserId: null },
        });
      }
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = Date.now() + (account.expires_at ?? 0) * 1000;
        return token;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        // Fetch user from DB to get latest role and impersonation status
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
        if (!dbUser) {
          return { ...token, error: "UserNotFound" };
        }

        token.role = dbUser.role;

        if (dbUser.impersonatingUserId) {
          const impersonatedUser = await prisma.user.findUnique({ where: { id: dbUser.impersonatingUserId } });
          if (impersonatedUser) {
            token.id = impersonatedUser.id;
            token.role = impersonatedUser.role;
            token.impersonator = dbUser;
          }
        } else if (token.impersonator) {
          // Exiting impersonation
          token.id = (token.impersonator as { id: string }).id;
          token.role = (token.impersonator as { role: string }).role;
          delete token.impersonator;
        }
        
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
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
