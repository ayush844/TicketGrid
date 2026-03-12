import { prisma } from "./prisma.js"


export const expireBookings = async () => {
    await prisma.booking.updateMany({
        where: {
            status: "PENDING",
            expiresAt: {
                lt: new Date()
            }
        },
        data: {
            status: "EXPIRED"
        }
    })
}