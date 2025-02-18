"use server"
import { prisma } from "@/lib/prisma";


export async function userFetch(sessionToken:any) {
  try {
    const sessionTokenDB = await prisma.session.findFirst({
      where: { sessionToken:sessionToken },
      select: { sessionToken: true, expires: true, user: true }
    });
    console.log("sessionTokenDB",sessionTokenDB)

    if (!sessionTokenDB) {
      console.log("sessiontoken in DB undefined")
      return null;
    }
 
    return {
      sessionToken: sessionTokenDB.sessionToken,
      expires: sessionTokenDB.expires.toISOString(),
      user: sessionTokenDB.user
    };

  } catch (error: any) {
    console.log(error.message)
    return null; 
  }
}
