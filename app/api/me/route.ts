import { withAuthProxy } from "@/lib/with-auth-proxy";
import { NextRequest } from "next/server";

export const GET = withAuthProxy(async (req: NextRequest) => {
  return { path: `/platform/rbac/current` };
});
