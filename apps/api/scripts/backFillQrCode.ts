import { prisma } from "../src/config/prisma.js"; // adjust path
import { generateQRCode } from "../src/utils/qr.utils.js"; // adjust path

async function backfill() {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        qrCode: null,
      },
    });

    console.log(`Found ${tickets.length} tickets to update`);

    for (const ticket of tickets) {
      const qr = await generateQRCode(ticket.id);

      await prisma.ticket.update({
        where: { id: ticket.id },
        data: { qrCode: qr },
      });

      console.log(`Updated ticket ${ticket.id}`);
    }

    console.log("✅ Backfill completed");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

backfill();