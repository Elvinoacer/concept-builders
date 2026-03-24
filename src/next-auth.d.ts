import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * 1. Extend the User type
   * This type is used internally (e.g., in adapter functions).
   */
  interface User extends DefaultUser {
    // Add custom properties found in the database User object
    id: string; // The user ID from your database
    role: "ADMIN" | "TEAM" | "CLIENT"; // Define possible roles
  }

  /**
   * 2. Extend the Session type
   * This is the object returned by useSession() and getSession().
   */
  interface Session extends DefaultSession {
    // Modify the user object structure to include your custom fields
    user: {
      id: string; // Must match the custom field you defined in User
      role: "ADMIN" | "TEAM" | "CLIENT"; // Must match the custom field you defined in User

      // Keep the default properties as well
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };

    // You can also add top-level custom properties here if needed
    accessToken?: string;
    impersonator?: {
      id: string;
      role: "ADMIN" | "TEAM" | "CLIENT";
      name?: string | null;
      email?: string | null;
    };
    error?: "RefreshAccessTokenError" | "UserNotFound";
  }
}

declare module "next-auth/jwt" {
  /**
   * 3. Extend the JWT type
   * This is the shape of the token when using the JWT session strategy.
   */
  interface JWT extends DefaultJWT {
    id: string;
    role: "ADMIN" | "TEAM" | "CLIENT";
    baseUserId?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    lastSyncedAt?: number;
    impersonator?: {
      id: string;
      role: "ADMIN" | "TEAM" | "CLIENT";
      name?: string | null;
      email?: string | null;
    };
    error?: "RefreshAccessTokenError" | "UserNotFound";
  }
}
