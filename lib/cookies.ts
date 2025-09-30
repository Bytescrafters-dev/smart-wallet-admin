import { cookies } from "next/headers";

export const JWT_COOKIE = process.env.JWT_COOKIE_NAME || "platform_jwt";

export const getJwtFromCookies = async () => {
  const cookieStore = await cookies();

  return cookieStore.get(JWT_COOKIE)?.value;
};
