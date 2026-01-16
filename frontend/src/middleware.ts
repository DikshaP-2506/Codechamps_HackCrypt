import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)", 
  "/sign-up(.*)", 
  "/api/webhooks(.*)",
  "/auth/callback",
  "/complete-profile"
]);

export default clerkMiddleware(async (auth, request) => {
  // Allow public routes (sign-in, sign-up, webhooks, auth callback, complete-profile)
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Protect all other routes - redirect to sign-in if not authenticated
  const { userId } = await auth();
  
  if (!userId && !isPublicRoute(request)) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|png|jpg|svg|woff2?|ico)).*)",
    "/(api|trpc)(.*)",
  ],
};
