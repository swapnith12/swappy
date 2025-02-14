
import { NextResponse, NextRequest } from "next/server";
// import { userFetch } from "./(server)/actions/user/userFetch";

export async function middleware(req: NextRequest) {
  console.log("middleware executing");
  try {
    const sessionResponse = await fetch(new URL("api/session",req.nextUrl.origin));
    const session = await sessionResponse.json();
    console.log(session)

    if (!session) {
      return NextResponse.redirect(new URL("/signin", req.nextUrl.origin));
    } 

    if (!session || session?.expires < new Date().toISOString()) {
      return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }

    return NextResponse.next();
  } catch (err: any) {
    console.log(err.message)
    throw new Error(err?.message);
  }
}

export const config = {
  matcher: ["/board","/board/:path*"],
  runtime: "nodejs",
};
