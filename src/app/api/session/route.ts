import { NextResponse } from "next/server";
import { userFetch } from "@/(server)/actions/user/userFetch";

export async function GET() {
  const session = await userFetch();
  console.log(session,"GET")
  return NextResponse.json(session);
}
