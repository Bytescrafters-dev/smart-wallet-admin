import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const JWT_COOKIE = process.env.JWT_COOKIE_NAME || "platform_jwt";

export const POST = async () => {
  const cookie = await cookies();

  cookie.set({
    name: JWT_COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ ok: true });
};
