export const welcomeEmailTemplate = (data: any) => {
    return `
        <div style="font-family: Arial; padding: 20px;">
            <h2>👋 Welcome to TicketGrid!</h2>
 
            <p>Hi there,</p>
 
            <p>
                We're excited to have you onboard 🎉  
                You can now explore events, book tickets, and attend amazing experiences.
            </p>
 
            <a href="${process.env.FRONTEND_URL}/events"
               style="display:inline-block; margin-top:10px; padding:10px 15px; background:#06b6d4; color:black; text-decoration:none; border-radius:6px;">
               Explore Events
            </a>
 
            <hr/>
 
            <p style="font-size:12px; color:gray;">
                TicketGrid Team ❤️
            </p>
        </div>
    `;
};