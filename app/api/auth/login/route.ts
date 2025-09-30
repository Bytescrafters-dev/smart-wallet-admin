import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;
const JWT_COOKIE = process.env.JWT_COOKIE_NAME || "platform_jwt";

export const POST = async (req: Request) => {
  const body = await req.json();

  try {
    const res = await fetch(`${BACKEND_URL}/platform/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const data = await res.json();
    const token = data?.accessToken;
    if (!token) {
      return NextResponse.json(
        { message: "Invalid login response" },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ ok: true });

    console.log("platform token", token);

    //const cookieStore = await cookies();

    response.cookies.set({
      name: JWT_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json({ message: "Login error" }, { status: 500 });
  }
};
