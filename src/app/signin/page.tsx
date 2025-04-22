"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {SignupWithCreds} from '../../(server)/actions/user/signUp'
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Link from "next/link";

const loginSchema = z.object({
  username:z.string(),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/,"Password must contains atleast one uppercase letter")
  .regex(/[\W_]/,"Password must contains atleast one uppercase letter")
});

export default function SignInPage() {
  const queryClient = useQueryClient()
  const [loading,setLoading] = useState(false)

  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

 
  async function onSubmit(data:any) {
    setError("");
    setLoading(true) 
    try {
      const response = await SignupWithCreds({ params: { email: data.email, password: data.password,username:data.username } })
      if(response?.success){
        await queryClient.invalidateQueries({ queryKey: ["session"] });
        router.push("/")
       }
      else {setError(response?.message)}
    } catch (err:any) {
      setError(err.message);
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-white">Sign In</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-80">
      <input
          type="username"
          placeholder="user name"
          {...register("username")}
          className="p-2 border rounded"
        />
        {errors.username && <p className="text-red-500">{errors.username.message?.toString()}</p>}
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="p-2 border rounded "
        />
        {errors.email && <p className="text-red-500">{errors.email.message?.toString()}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="p-2 border rounded "
        />
        {errors.password && <p className="text-red-500">{errors.password.message?.toString()}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting? "Signing in..." : "Sign In"}
        </button>
      </form>
      <Link className="decoration-lime-950 text-white" href={"/login"}>click here to Login if already registered</Link>
    </div>
    </div>
  );
}
