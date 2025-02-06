"use server"
import { NextResponse } from "next/server";
import { userFetch } from "../(server)/actions/user/userFetch";

export async function middleware(req:any) {
    
    const session = await userFetch()

    if (!session) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (!session || session?.expires < new Date()) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: ["/board/:path*"], 
    runtime:"nodejs"
};
