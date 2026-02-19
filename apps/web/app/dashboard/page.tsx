import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

const page = async () => {

    const session = await getServerSession(authOptions);

    if(!session){
        redirect("/signin");
    }

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-slate-950 pt-20 pb-12 text-white">
        This is a dshboard page, only visible to authenticated users. Session: {JSON.stringify(session)}
    </div>
  )
}

export default page