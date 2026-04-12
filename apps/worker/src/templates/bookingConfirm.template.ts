export const bookingEmailTemplate = (data: any) => {
    const { eventTitle, tickets } = data;
    console.log("tickets in template:", tickets);
    return `
<div style="font-family: Arial; padding: 20px;">
            <h2>🎉 Booking Confirmed!</h2>
 
            <p>Your booking for <strong>${eventTitle}</strong> is confirmed.</p>
 
            <h3>🎟 Your Tickets:</h3>
 
            ${tickets.map((ticket: any, index: number) => `
                <div style="border:1px solid #ddd; padding:10px; margin-bottom:15px; border-radius:10px;">
                    <p><strong>Ticket ${index + 1}</strong></p>
                    <p>ID: ${ticket.id}</p>
 
                    ${
                      ticket.qrCode
                        ? `<img src="cid:qr-${index}" width="150" height="150" />`
                        : `<p>No QR available</p>`
                    }
                </div>
            `).join("")}
 
            <p>📍 Show this QR at entry.</p>
 
            <hr/>
            <p style="font-size: 12px; color: gray;">
                Thanks for using TicketGrid ❤️
            </p>
        </div>
    `;
};