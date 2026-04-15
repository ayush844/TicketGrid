import { transporter } from "../config/mailer.js";
 
export const sendEmail = async ({
    to,
    subject,
    html,
    attachments = []
}: {
    to: string;
    subject: string;
    html: string;
    attachments?: any[];
}) => {
    await transporter.sendMail({
        from: `"TicketGrid" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        attachments
    });
};
 