export const eventCancelledTemplate = (data: any) => {
    return `
        <div style="font-family: Arial; padding: 20px;">
            <h2>❌ Event Cancelled</h2>

            <p>Hi,</p>

            <p>
                We regret to inform you that the event 
                <strong>${data.eventTitle}</strong> has been cancelled.
            </p>

            <p>
                If you made a payment, the refund will be processed shortly.
            </p>

            <hr/>

            <p style="font-size:12px; color:gray;">
                TicketGrid Team ❤️
            </p>
        </div>
    `;
};