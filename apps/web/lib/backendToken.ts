import jwt from "jsonwebtoken";


export function createBackendToken(user: {
    id: string;
    role: string;
}){

    return jwt.sign(
        {
            userId: user.id,
            role: user.role
        },
        process.env.BACKEND_JWT_SECRET!,
        {expiresIn: "10m"}
    )

}