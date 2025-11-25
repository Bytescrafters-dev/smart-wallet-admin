import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/cookies";

const BACKEND_URL = process.env.BACKEND_URL;

export const POST = async (req: Request) => {
  console.log("called login api");
  const body = await req.json();

  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log(res);

    if (!res.ok) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const data = await res.json();
    const access = data?.access;
    const refresh = data?.refresh;
    if (!(access && refresh)) {
      return NextResponse.json(
        { message: "Invalid login response" },
        { status: 500 }
      );
    }

    await setAuthCookies(access, 15 * 60, refresh, 60 * 60 * 24 * 30);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Login error" }, { status: 500 });
  }
};
