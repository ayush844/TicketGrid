import { notFound } from "next/navigation";

export const callPublicApi = async(endpoint: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        cache: "no-store"
    });

    if(res.status === 404){
        notFound();
    }
    if(!res.ok){
        throw new Error("Public API failed");
    }

    return res.json();
}