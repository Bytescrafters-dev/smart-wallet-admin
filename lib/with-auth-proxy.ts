import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE = process.env.BACKEND_URL!;
const JWT_COOKIE = process.env.JWT_COOKIE_NAME || "platform_jwt";

type Upstream = (
  req: NextRequest
) => Promise<{ path: string; init?: RequestInit }>;

export const withAuthProxy = (upstream: Upstream) => {
  return async (req: NextRequest) => {
    console.log(JWT_COOKIE);

    const token = req.cookies.get(JWT_COOKIE)?.value;

    console.log("from proxy", token);
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { path, init } = await upstream(req);
    const headers = new Headers(init?.headers || {});
    headers.set("Authorization", `Bearer ${token}`);
    if (!headers.has("content-type") && init?.body)
      headers.set("content-type", "application/json");

    console.log(`${BASE}${path}`);

    const res = await fetch(`${BASE}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });

    return new NextResponse(res.body, {
      status: res.status,
      headers: res.headers,
    });
  };
};
