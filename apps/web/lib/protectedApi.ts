import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { createBackendToken } from "./backendToken";

type HttpMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface CallBackendOptions {
  method?: HttpMethods;
  body?: any;
}

export const callBackend = async (
  endpoint: string,
  options: CallBackendOptions = {}
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  const token = createBackendToken({
    id: session.user.id,
    role: session.user.role,
  });

  const { method = "GET", body } = options;

  const response = await fetch(
    `${process.env.BACKEND_URL}${endpoint}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      ...(body && { body: JSON.stringify(body) }),
    }
  );

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    const error = await response.json();
    console.error("Backend error:", error);
    throw new Error(error.message || "Internal Server Error");
  }

  return response.json();
};