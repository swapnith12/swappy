'use server'

import { prisma } from "@/lib/prisma"

export async function SignupWithCreds({params}:any){
  try {
    await prisma.user.create({
      data:{
          email:params.email,
          password: params.password,
      }
    })
  } catch (error:any) {
    throw new Error(error.message)
  }
}

 
