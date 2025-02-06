"use server"
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";


export async function userFetch(){
  try{
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("auth_token")?.value;
     const sessionTokenDB = await prisma.session.findUnique({
        where: { sessionToken:sessionToken },
        select:{sessionToken:true , expires:true , user:true}
     })
     if(sessionTokenDB){
        return {sessionTokenDB:sessionToken,expires:sessionTokenDB.expires,user:sessionTokenDB.expires}
     }
     else throw new Error("no session found")
  }
  catch(error:any){throw error?.message}
}