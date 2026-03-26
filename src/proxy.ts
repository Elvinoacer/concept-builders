import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthenticated = !!token;
  const userRole = token?.role as string | undefined;

  // If user is authenticated but has no valid role, redirect to homepage as a fallback
  if (
    isAuthenticated &&
    (!userRole || !["CLIENT", "ADMIN", "TEAM"].includes(userRole))
  ) {
    // Avoid redirecting away from the homepage itself
    if (pathname !== "/") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");
  const isClientDashboardPage = pathname.startsWith("/dashboard");
  const isCartPage = pathname.startsWith("/cart");
  const isCheckoutPage = pathname.startsWith("/checkout");

  // If the user is authenticated
  if (isAuthenticated) {
    // If they try to access an auth page, redirect to their dashboard
    if (isAuthPage) {
      const dashboardUrl = userRole === "CLIENT" ? "/dashboard" : "/admin";
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }

    // Role-based authorization
    if (isAdminPage && userRole !== "ADMIN" && userRole !== "TEAM") {
      // Client trying to access admin page
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (isClientDashboardPage && userRole !== "CLIENT") {
      // Admin/Team trying to access client dashboard
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if ((isCartPage || isCheckoutPage) && userRole !== "CLIENT") {
      // Admin/Team trying to access client cart/checkout
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  } else {
    // If the user is not authenticated
    // If they try to access a protected page, redirect to login
    if (isAdminPage || isClientDashboardPage || isCartPage || isCheckoutPage) {
      const url = new URL("/auth", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/cart/:path*",
    "/checkout/:path*",
  ],
};
