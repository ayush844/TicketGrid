import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { createBackendToken } from "./backendToken";
import { notFound } from "next/navigation";

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

  // 🔒 Not logged in
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

  console.log("Backend response status:", response.status);

  // ❌ Not found → trigger global 404 page
  if (response.status === 404) {
    notFound();
  }

  // 🔒 Unauthorized (token expired / invalid)
  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  // ❌ Other errors
  if (!response.ok) {
    let errorMessage = "Internal Server Error";

    try {
      const error = await response.json();
      errorMessage = error?.message || errorMessage;
    } catch {
      // fallback if no JSON
    }

    console.error("Backend error:", errorMessage);
    throw new Error(errorMessage);
  }

  return response.json();
};