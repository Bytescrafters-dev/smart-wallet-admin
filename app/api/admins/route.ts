import { NextRequest } from "next/server";
import { withAuthProxy } from "@/lib/with-auth-proxy";

export const GET = withAuthProxy(async (req: NextRequest) => {
  const query = req.nextUrl.searchParams.toString();
  return { path: `/platform/admins${query ? `?${query}` : ""}` };
});
