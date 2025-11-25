import { NextRequest, NextResponse } from "next/server";
import {
  proxyToBackend,
  proxyToBackendWithAccess,
} from "@/lib/with-auth-proxy";

async function attempt(req: NextRequest, path: string) {
  const res = await proxyToBackend(req, path);
  return res;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return handle(req, path);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return handle(req, path);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return handle(req, path);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return handle(req, path);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return handle(req, path);
}

async function handle(req: NextRequest, pathArr: string[]) {
  const path = pathArr.join("/");

  let res = await attempt(req, path);
  if (res.status !== 401) return res;

  console.log("res called got 401 from proxy");

  const refresh = await fetch(new URL("/api/auth/refresh", req.url), {
    method: "POST",
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  if (!refresh.ok) {
    console.log("refresh called and failed from proxy");
    const url = new URL("/login", req.url);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  const refreshData = await refresh.json();
  const newAccess = refreshData?.access || refreshData?.accessToken;

  res = await proxyToBackendWithAccess(req, path, newAccess);

  if (res.status === 401) {
    console.log("refresh called and res status 401 from proxy");
    const url = new URL("/login", req.url);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return res;
}
