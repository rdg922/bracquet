import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

interface IsUserSetupResponse {
  message: boolean;
}

async function checkUserSetup(authId: string) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/isUserSetup?authId=${authId}`,
    );
    if (response.ok) {
      const data = (await response.json()) as IsUserSetupResponse;
      return data.message;
    }
    return false;
  } catch (error) {
    console.error("Error checking user setup:", error);
    return false;
  }
}

export default clerkMiddleware(async (auth, request) => {
  const authId = auth().userId;

  if (isProtectedRoute(request)) {
    auth().protect();
    if (authId) {
      const userSetup = await checkUserSetup(authId);
      if (!userSetup) {
        return NextResponse.redirect(new URL("/account-setup", request.url));
      }
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
