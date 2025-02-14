"use server"
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function userFetch() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("auth_token")?.value;

    if (!sessionToken) {
      console.log("❌ No session token found");
      return false; 
    }

    const sessionTokenDB = await prisma.session.findUnique({
      where: { sessionToken },
      select: { sessionToken: true, expires: true, user: true }
    });

    if (!sessionTokenDB) {
      console.log("❌ No session found in database");
      return false;
    }

    console.log("✅ Session found:", sessionTokenDB);
    return {
      sessionToken: sessionTokenDB.sessionToken,
      expires: sessionTokenDB.expires.toISOString(),
      user: sessionTokenDB.user
    };

  } catch (error: any) {
    console.error("⚠️ Error fetching session:", error);
    return false; 
  }
}
