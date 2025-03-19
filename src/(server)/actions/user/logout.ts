"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function logout() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      console.log("No token found, user already logged out.");
      return;
    }

    const deleteAction = await prisma.session.deleteMany({
      where: { sessionToken:token },
    });

    console.log(deleteAction)

    cookieStore.set("auth_token", "", { expires: new Date(0) });
    cookieStore.delete("auth_token")

    console.log("User logged out successfully.");
  } catch (error: any) {
    console.error("Logout error:", error);
    throw new Error(error.message);
  }
}
