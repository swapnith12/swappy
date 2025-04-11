import { NextResponse, NextRequest } from "next/server";
// import { userFetch } from "./(server)/actions/user/userFetch";

export async function middleware(req: NextRequest) {
  console.log("middleware executing");
  try {
    const sessionToken = req.cookies.get('auth_token')?.value
    if (sessionToken===undefined){
      console.log("session not found by middleware")
      return NextResponse.redirect(new URL("/signin", req.nextUrl.origin));
    }
    console.log("cookie in middleware worked",sessionToken)
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
