"use server";

import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

const saltRounds = 10;
const myPlaintextPassword = 'swappy';

export async function LoginWithCreds({ params }: { params: { email: string; password: string } }) {
  try {
    // console.log(params)
    const existingUser = await prisma.user.findUnique({
      where: { email: params.email },
    });

    if (!existingUser) {
      throw new Error("User doesnot already exists");
    }


    const salt = await bcrypt.hash(myPlaintextPassword,saltRounds)
    const sessionToken = jwt.sign({ userId: existingUser.id, email: existingUser.email }, salt, {
      expiresIn: "1d",
    });


    await prisma.session.create({
      data: {
        sessionToken: sessionToken,
        userId: existingUser.id,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), 
      },
    });


    (await cookies()).set("auth_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, 
    });

    return { success: true, message: "User registered successfully", userId: existingUser.id };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
