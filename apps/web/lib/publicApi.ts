import { notFound } from "next/navigation";

export const callPublicApi = async(endpoint: string) => {
    console.log("here endpoint is", endpoint)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        cache: "no-store"
    });

    if(res.status === 404){
        notFound();
    }
    if(!res.ok){
        console.log(res)
        throw new Error("Public API failed");
    }

    return res.json();
}