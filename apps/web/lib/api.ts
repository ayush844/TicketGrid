import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { createBackendToken } from "./backendToken";
import { redirect } from "next/navigation";

type HttpMethods = "GET" | "POST" | "PUT" | "DELETE";

interface CallBackendOptions {
    method?: HttpMethods;
    body?: any;
}

export const callBackend = async (endpoint: string, options: CallBackendOptions = {}) => {
    const session = await getServerSession(authOptions);

    if(!session){
        console.error("Unauthorized!");
        redirect("/signin");
    }

    const token = createBackendToken({
        id: session.user.id,
        role: session.user.role
    });

    const {method = "GET", body} = options;

    const response = await fetch(`${process.env.BACKEND_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        ...(body && {body: JSON.stringify(body)})
    })

    if (response.status === 401) {
        redirect("/signin");
    }

    if (!response.ok) {
        
        console.error("Backend request failed");
        return;
    }

    return response.json();
}